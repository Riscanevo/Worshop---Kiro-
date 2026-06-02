# Implementation Plan

## Overview

Integración del POS_Frontend con el Backend_API desplegado en AWS. Los cambios son quirúrgicos y se concentran en la capa de infraestructura: corregir el payload de ventas, mejorar el manejo de errores HTTP, y consumir la `SaleResponse` del backend en el store. No se modifica la arquitectura de componentes ni la lógica de dominio.

**Archivos que cambian:**
- `src/types/index.ts` — agregar `SaleResponse`
- `src/config/api.ts` — guard para cadena vacía
- `src/infrastructure/sales/salesRepository.ts` — payload corregido + manejo de errores
- `src/infrastructure/catalog/catalogRepository.ts` — mejor manejo de errores
- `src/store/posStore.ts` — consumir `SaleResponse`
- `.env.example` — nuevo archivo de documentación

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1", "2", "3", "5", "7"] },
    { "wave": 2, "tasks": ["4"] },
    { "wave": 3, "tasks": ["6", "8", "9"] },
    { "wave": 4, "tasks": ["10"] }
  ]
}
```

## Tasks

- [x] 1. Agregar tipo `SaleResponse` a `src/types/index.ts`
  - Agregar la interfaz `SaleResponse` con campos `ventaId`, `estado`, `total` e `items`
  - Mantener todos los tipos existentes sin modificar
  - _Requirements: 3.6, 4.1, 4.2_

- [x] 2. Corregir `src/config/api.ts` para manejar cadena vacía
  - Cambiar la lógica de fallback para que una cadena vacía `""` también use `http://localhost:8080`
  - _Requirements: 1.2_

- [x] 3. Crear archivo `.env.example` en la raíz del proyecto
  - Contenido: `VITE_API_BASE_URL=https://qg07kng9rk.execute-api.us-east-1.amazonaws.com`
  - _Requirements: 1.3_

- [x] 4. Corregir `src/infrastructure/sales/salesRepository.ts`
  - [x] 4.1 Reemplazar `createSalePayload` para enviar solo `items[{productoId, cantidad}]` y `medioPago`
    - Eliminar todos los campos extra: `nombre`, `codigoBarras`, `precioUnitario`, `subtotal`, `total`, `impuestoTotal`, `descuentoTotal`, `metodoPago`, `detallesPago`, `cajero`, `fecha`, `recibo`
    - Mapear `transaction.paymentMethod` → `medioPago`
    - _Requirements: 3.2, 3.3, 3.4, 3.5_

  - [x] 4.2 Cambiar el tipo de retorno de `registerSale` de `Promise<void>` a `Promise<SaleResponse>`
    - Parsear el cuerpo de la respuesta y retornar `SaleResponse`
    - Si el cuerpo no es JSON válido o está vacío en un 200/201, lanzar `Error('Respuesta inválida del servidor')`
    - _Requirements: 3.6, 3.11_

  - [x] 4.3 Implementar manejo de errores HTTP por código de estado
    - 400 → `Error(body.message ?? 'Solicitud inválida')`
    - 404 → `Error(body.message ?? 'Recurso no encontrado')`
    - 5xx → `Error('Error interno del servidor al registrar la venta')`
    - Otros → `Error('Error inesperado al registrar la venta')`
    - _Requirements: 3.7, 3.8, 3.9, 3.10_

- [x] 5. Mejorar manejo de errores en `src/infrastructure/catalog/catalogRepository.ts`
  - Cuando la respuesta no es `ok`, intentar parsear el cuerpo JSON y extraer el campo `message`
  - Si el cuerpo no tiene `message`, usar `'No se pudieron cargar los productos'`
  - _Requirements: 2.12_

- [x] 6. Actualizar `src/store/posStore.ts` para consumir `SaleResponse`
  - En `processPayment`, capturar el retorno de `registerSale` como `SaleResponse`
  - Crear `confirmedTransaction` usando `saleResponse.ventaId` como `id` y `saleResponse.total` como `total`
  - Guardar `confirmedTransaction` en `transactions` y `currentReceipt` (no la transacción local)
  - Si `registerSale` lanza error, propagarlo sin limpiar el carrito ni cerrar el checkout
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 7. Verificar y limpiar referencias a datos locales de productos
  - Confirmar que `src/data/products.ts` no existe o eliminarlo si existe
  - Buscar y eliminar cualquier import de `src/data/products` en todos los archivos del proyecto
  - Verificar que `src/data/categories.ts` se mantiene intacto
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 8. Escribir tests unitarios para `salesRepository`
  - Test: el payload enviado contiene solo `items[{productoId, cantidad}]` y `medioPago`
  - Test: respuesta 200 retorna `SaleResponse` parseada
  - Test: respuesta 400 lanza error con `message` del cuerpo
  - Test: respuesta 400 sin `message` lanza `'Solicitud inválida'`
  - Test: respuesta 5xx lanza `'Error interno del servidor al registrar la venta'`
  - Test: respuesta 200 con cuerpo vacío lanza `'Respuesta inválida del servidor'`
  - _Requirements: 3.2, 3.3, 3.6, 3.7, 3.9, 3.11_

- [ ] 9. Escribir tests unitarios para `catalogRepository`
  - Test: respuesta 4xx con `message` en el cuerpo lanza ese mensaje
  - Test: respuesta 4xx sin `message` lanza `'No se pudieron cargar los productos'`
  - _Requirements: 2.12_

- [ ] 10. Validación final
  - Ejecutar `npm run typecheck` — sin errores de TypeScript
  - Ejecutar `npm run test` — todos los tests deben pasar
  - Ejecutar `npm run lint` — sin errores de ESLint
  - Verificar que el build de producción compila sin errores: `npm run build`

## Notes

- Las tareas 1–7 son cambios de producción; las tareas 8–9 son tests opcionales pero recomendados.
- La tarea 4 (salesRepository) depende de la tarea 1 (tipo `SaleResponse`) para compilar sin errores.
- La tarea 6 (posStore) depende de la tarea 4 porque `registerSale` cambia su tipo de retorno.
- Las tareas 2, 3, 5 y 7 son independientes entre sí y pueden ejecutarse en paralelo.
- No se requiere cambiar ningún componente UI — el manejo de errores con toasts ya está implementado.
- El archivo `.env.example` es solo documentación; el archivo `.env` real con la URL de producción debe crearse manualmente y no se commitea al repositorio.
