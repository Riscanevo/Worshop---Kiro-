# Design Document

## Overview

La integración conecta el POS_Frontend con el Backend_API desplegado en AWS API Gateway + Lambda + DynamoDB. Los cambios son quirúrgicos: se corrigen dos módulos de infraestructura existentes (`salesRepository.ts` y `catalogRepository.ts`), se ajusta la configuración de entorno, y se actualiza el store para consumir la `SaleResponse` del backend. No se introduce ninguna nueva dependencia ni se cambia la arquitectura de componentes.

## Architecture

El flujo de datos sigue la arquitectura en capas ya establecida en el proyecto:

```
UI (organisms/pages)
    ↓ acciones
Store (posStore.ts)
    ↓ llama
Application (createTransaction.ts)
    ↓ produce Transaction
Infrastructure (salesRepository.ts / catalogRepository.ts)
    ↓ HTTP fetch
Backend_API (AWS API Gateway)
```

Los únicos archivos que cambian son los de la capa de infraestructura y configuración. La capa de dominio (`pricing.ts`, `createTransaction.ts`) y los componentes UI no se tocan.

## Components and Interfaces

### 1. `src/config/api.ts` — sin cambios funcionales

El archivo ya implementa `buildApiUrl()` y lee `VITE_API_BASE_URL`. Solo se necesita agregar el guard para cadena vacía:

```typescript
const raw = import.meta.env.VITE_API_BASE_URL
const configuredApiBaseUrl = raw && raw.trim() !== '' ? raw : 'http://localhost:8080'
export const API_BASE_URL = configuredApiBaseUrl.replace(/\/+$/, '')
```

### 2. `src/infrastructure/catalog/catalogRepository.ts` — mejora de error handling

El `normalizeProduct` ya existe y mapea correctamente los campos del backend. Solo se necesita mejorar el manejo de errores HTTP para extraer el campo `message` del cuerpo de la respuesta:

```typescript
export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(buildApiUrl('/productos'))

  if (!response.ok) {
    let message = 'No se pudieron cargar los productos'
    try {
      const body = await response.json() as { message?: string }
      if (body.message) message = body.message
    } catch { /* ignorar si el cuerpo no es JSON */ }
    throw new Error(message)
  }

  const payload = await response.json() as ProductApiResponse
  const productList = Array.isArray(payload)
    ? payload
    : payload.productos ?? payload.data ?? []

  return productList.map(normalizeProduct)
}
```

### 3. `src/infrastructure/sales/salesRepository.ts` — corrección del payload y SaleResponse

Este es el cambio principal. El payload actual envía ~12 campos; el backend solo acepta 3.

**Tipo SaleResponse** (nuevo, en `src/types/index.ts`):
```typescript
export interface SaleResponse {
  ventaId: string
  estado: string
  total: number
  items: Array<{
    productoId: string
    nombre: string
    cantidad: number
    precioUnitario: number
    subtotal: number
  }>
}
```

**Payload corregido**:
```typescript
// ANTES (rechazado por el backend):
{
  items: [{ productoId, nombre, codigoBarras, cantidad, precioUnitario, subtotal }],
  subtotal, impuestoTotal, descuentoTotal, total,
  metodoPago, detallesPago, cajero, fecha, recibo
}

// DESPUÉS (aceptado por el backend):
{
  items: [{ productoId: string, cantidad: number }],
  medioPago: PaymentMethod
}
```

**Manejo de errores por código HTTP**:
```typescript
export const registerSale = async (transaction: Transaction): Promise<SaleResponse> => {
  const response = await fetch(buildApiUrl('/ventas'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      items: transaction.items.map(item => ({
        productoId: item.product.id,
        cantidad: item.quantity,
      })),
      medioPago: transaction.paymentMethod,
    }),
  })

  let body: unknown
  try { body = await response.json() } catch { body = null }

  if (response.status === 200 || response.status === 201) {
    if (!body || typeof body !== 'object') throw new Error('Respuesta inválida del servidor')
    return body as SaleResponse
  }

  const msg = (body as { message?: string })?.message
  if (response.status === 400) throw new Error(msg ?? 'Solicitud inválida')
  if (response.status === 404) throw new Error(msg ?? 'Recurso no encontrado')
  if (response.status >= 500) throw new Error('Error interno del servidor al registrar la venta')
  throw new Error('Error inesperado al registrar la venta')
}
```

### 4. `src/store/posStore.ts` — consumir SaleResponse

`processPayment` actualmente ignora el retorno de `registerSale`. Debe usar `ventaId` y `total` de la respuesta:

```typescript
processPayment: async (method, details): Promise<Transaction> => {
  const { cart, appliedDiscount } = get()
  const transaction = createTransaction({ cart, appliedDiscount, method, details, cashier: 'Cajero 1' })

  const saleResponse = await registerSale(transaction)  // ahora retorna SaleResponse

  // Actualizar la transacción con los datos confirmados por el backend
  const confirmedTransaction: Transaction = {
    ...transaction,
    id: saleResponse.ventaId,
    total: saleResponse.total,
  }

  set(state => ({
    transactions: [...state.transactions, confirmedTransaction],
    currentReceipt: confirmedTransaction,
    cart: [],
    appliedDiscount: null,
    isCheckoutOpen: false,
  }))

  persistStateFromStore(get)
  return confirmedTransaction
},
```

### 5. `.env.example` — nuevo archivo

```
VITE_API_BASE_URL=https://qg07kng9rk.execute-api.us-east-1.amazonaws.com
```

### 6. `src/data/products.ts` — eliminar

El archivo ya no existe en el filesystem (fue eliminado previamente). Se verifica que no haya imports residuales en ningún componente.

## Data Models

### SalePayload (lo que se envía al backend)
```typescript
interface SalePayload {
  items: Array<{
    productoId: string   // product.id del CartItem
    cantidad: number     // quantity del CartItem (1–9999)
  }>
  medioPago: PaymentMethod  // 'efectivo' | 'tarjeta' | 'mixto'
}
```

### SaleResponse (lo que devuelve el backend)
```typescript
interface SaleResponse {
  ventaId: string       // UUID — se usa como Transaction.id
  estado: string        // 'REGISTRADA'
  total: number         // Total calculado por el backend — se usa en el recibo
  items: Array<{
    productoId: string
    nombre: string
    cantidad: number
    precioUnitario: number
    subtotal: number
  }>
}
```

### ProductResponse (lo que devuelve GET /productos)
```typescript
interface ProductResponse {
  productos: Array<{
    id: string
    nombre: string
    codigoBarras: string
    precio: number
    categoria: ProductCategory
    imagen: string
    stock: number
    unidad: string
    tasaImpuesto: number
  }>
}
```

## Error Handling Strategy

| Escenario | Módulo | Comportamiento |
|-----------|--------|----------------|
| GET /productos → 4xx/5xx | catalogRepository | Lanza `Error(body.message ?? 'No se pudieron cargar los productos')` |
| GET /productos → error de red | catalogRepository | Lanza el error nativo de fetch (sin respuesta) |
| POST /ventas → 400 | salesRepository | Lanza `Error(body.message ?? 'Solicitud inválida')` |
| POST /ventas → 404 | salesRepository | Lanza `Error(body.message ?? 'Recurso no encontrado')` |
| POST /ventas → 5xx | salesRepository | Lanza `Error('Error interno del servidor al registrar la venta')` |
| POST /ventas → otro código | salesRepository | Lanza `Error('Error inesperado al registrar la venta')` |
| POST /ventas → cuerpo inválido en 200/201 | salesRepository | Lanza `Error('Respuesta inválida del servidor')` |
| Cualquier error de red | posStore | El error se propaga; el carrito NO se limpia |

Los errores se propagan desde `posStore.processPayment()` hacia los componentes UI que ya manejan el estado de error con toasts (implementado en el spec anterior).

## Error Handling

Ver la tabla en la sección "Error Handling Strategy" más arriba. El principio general es:

- Los errores de red (sin respuesta del servidor) se propagan como están — el mensaje nativo de fetch es suficientemente descriptivo.
- Los errores HTTP con cuerpo JSON extraen el campo `message` cuando existe.
- Todos los errores se propagan hacia arriba hasta el store y luego a los componentes UI, que ya tienen manejo de toasts implementado del spec anterior.
- El carrito nunca se limpia si `registerSale` lanza un error — esto garantiza que el cajero puede reintentar.

## Correctness Properties

### Property 1: Payload mínimo

Para cualquier `Transaction` con N ítems, el cuerpo enviado a `POST /ventas` contiene exactamente los campos `items` (array de N objetos con solo `productoId` y `cantidad`) y `medioPago`. Ningún otro campo está presente.

**Validates: Requirements 3.2, 3.3, 3.4, 3.5**

### Property 2: Idempotencia de normalización

Para cualquier producto recibido del backend con campos en español (`nombre`, `codigoBarras`, `precio`, etc.), `normalizeProduct` produce un `Product` con todos los campos requeridos del tipo TypeScript, nunca `undefined`.

**Validates: Requirements 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11**

### Property 3: Preservación del carrito en error

Si `registerSale` lanza cualquier error, el estado del store (`cart`, `appliedDiscount`, `isCheckoutOpen`) permanece idéntico al estado previo a la llamada.

**Validates: Requirements 4.4**

## Testing Strategy

Los tests existentes en `src/store/posStore.test.ts` y `src/lib/payment.test.ts` no deben romperse. Se agregan tests unitarios para:

- `salesRepository`: verificar que el payload enviado contiene solo `items[{productoId, cantidad}]` y `medioPago`; verificar manejo de cada código HTTP
- `catalogRepository`: verificar que errores HTTP extraen el campo `message` del cuerpo

Se usa `vi.stubGlobal('fetch', ...)` de Vitest para mockear fetch en los tests de repositorios.
