# Requirements Document

## Introduction

Esta feature integra el frontend POS (React/TypeScript) con el backend ya desplegado en AWS API Gateway. El objetivo es que el sistema opere completamente contra datos reales: cargue el catálogo de productos desde `GET /productos` y registre ventas mediante `POST /ventas` con el payload exacto que el backend espera. Actualmente el repositorio de ventas envía campos extra que el backend rechaza, y la URL base del backend AWS no está configurada en el entorno de producción.

## Glossary

- **POS_Frontend**: La aplicación React/TypeScript que actúa como punto de venta.
- **Backend_API**: El servicio REST desplegado en `https://qg07kng9rk.execute-api.us-east-1.amazonaws.com`.
- **CatalogRepository**: El módulo `src/infrastructure/catalog/catalogRepository.ts` responsable de obtener productos.
- **SalesRepository**: El módulo `src/infrastructure/sales/salesRepository.ts` responsable de registrar ventas.
- **SalePayload**: El cuerpo JSON enviado al endpoint `POST /ventas`, con la forma `{ items: [{ productoId, cantidad }], medioPago }`.
- **SaleResponse**: La respuesta JSON de `POST /ventas`, con la forma `{ ventaId, estado, total, items }`.
- **ProductResponse**: La respuesta JSON de `GET /productos`, con la forma `{ productos: [...] }`.
- **VITE_API_BASE_URL**: Variable de entorno Vite que define la URL base del Backend_API.
- **CartItem**: Elemento del carrito que contiene un `Product` y su `quantity`.
- **Transaction**: Objeto interno del POS_Frontend que representa una venta completada localmente.
- **PaymentMethod**: Tipo de pago: `efectivo`, `tarjeta` o `mixto`.

## Requirements

### Requirement 1: Configuración de la URL base del backend

**User Story:** Como operador del sistema, quiero que el POS_Frontend apunte al Backend_API de AWS, para que todas las operaciones usen datos reales en lugar del servidor local de desarrollo.

#### Acceptance Criteria

1. THE POS_Frontend SHALL leer la URL base del Backend_API exclusivamente desde la variable de entorno `VITE_API_BASE_URL`.
2. WHEN `VITE_API_BASE_URL` no está definida o es una cadena vacía `""`, THE POS_Frontend SHALL usar `http://localhost:8080` como valor por defecto.
3. THE POS_Frontend SHALL exponer un archivo `.env.example` con la línea `VITE_API_BASE_URL=https://qg07kng9rk.execute-api.us-east-1.amazonaws.com` en formato `KEY=value`.
4. THE CatalogRepository SHALL construir todas las URLs de productos usando `buildApiUrl('/productos')`.
5. THE SalesRepository SHALL construir todas las URLs de ventas usando `buildApiUrl('/ventas')`.

---

### Requirement 2: Carga del catálogo de productos desde el backend

**User Story:** Como cajero, quiero que el catálogo de productos se cargue desde el Backend_API, para que los precios y el stock reflejen siempre la información actualizada.

#### Acceptance Criteria

1. WHEN el POS_Frontend se inicializa, THE CatalogRepository SHALL realizar una petición `GET /productos` al Backend_API.
2. WHEN el Backend_API responde con un objeto `{ "productos": [...] }`, THE CatalogRepository SHALL extraer el array `productos` y normalizarlo al tipo `Product` del frontend.
3. WHEN el Backend_API responde con un array directo, THE CatalogRepository SHALL normalizar ese array al tipo `Product` del frontend.
4. THE CatalogRepository SHALL mapear el campo `id` del backend al campo `id` del tipo `Product`.
5. THE CatalogRepository SHALL mapear el campo `nombre` del backend al campo `name` del tipo `Product`.
6. THE CatalogRepository SHALL mapear el campo `codigoBarras` del backend al campo `barcode` del tipo `Product`.
7. THE CatalogRepository SHALL mapear el campo `precio` del backend al campo `price` del tipo `Product`.
8. THE CatalogRepository SHALL mapear el campo `imagen` del backend al campo `image` del tipo `Product`.
9. THE CatalogRepository SHALL mapear el campo `stock` del backend al campo `stock` del tipo `Product`.
10. THE CatalogRepository SHALL mapear el campo `tasaImpuesto` del backend al campo `taxRate` del tipo `Product`.
11. WHEN un campo requerido del backend (`id`, `nombre`, `precio`) está ausente o es `null`, THE CatalogRepository SHALL usar un valor por defecto seguro: `""` para strings y `0` para números.
12. IF el Backend_API responde con un código HTTP 4xx o 5xx, THEN THE CatalogRepository SHALL lanzar un error con el mensaje recibido en el campo `message` del cuerpo de la respuesta, o con el texto `'No se pudieron cargar los productos'` si el cuerpo no contiene ese campo.
13. WHILE los productos se están cargando, THE POS_Frontend SHALL mostrar un indicador de carga visible al cajero.
14. WHEN la carga de productos finaliza (con éxito o con error), THE POS_Frontend SHALL ocultar el indicador de carga.

---

### Requirement 3: Corrección del payload de registro de ventas

**User Story:** Como cajero, quiero que al procesar un pago el sistema registre la venta correctamente en el backend, para que el inventario y los reportes reflejen la transacción.

#### Acceptance Criteria

1. WHEN el cajero confirma el pago, THE SalesRepository SHALL enviar una petición `POST /ventas` al Backend_API con el `SalePayload`.
2. THE SalesRepository SHALL construir el `SalePayload` incluyendo únicamente los campos `items` y `medioPago`.
3. THE SalesRepository SHALL construir cada elemento del array `items` del `SalePayload` con únicamente los campos `productoId` (string) y `cantidad` (número entero entre 1 y 9999 inclusive).
4. THE SalesRepository SHALL mapear el campo `paymentMethod` de la `Transaction` al campo `medioPago` del `SalePayload`.
5. THE SalesRepository SHALL omitir del `SalePayload` los campos `nombre`, `codigoBarras`, `precioUnitario`, `subtotal`, `total`, `impuestoTotal`, `descuentoTotal`, `metodoPago`, `detallesPago`, `cajero`, `fecha` y `recibo`.
6. WHEN el Backend_API responde con estado `200` o `201`, THE SalesRepository SHALL retornar la `SaleResponse` parseada del cuerpo de la respuesta.
7. IF el Backend_API responde con un código HTTP 400, THEN THE SalesRepository SHALL lanzar un error con el mensaje contenido en el campo `message` del cuerpo de la respuesta, o con el texto `'Solicitud inválida'` si el campo `message` está ausente.
8. IF el Backend_API responde con un código HTTP 404, THEN THE SalesRepository SHALL lanzar un error con el mensaje contenido en el campo `message` del cuerpo de la respuesta, o con el texto `'Recurso no encontrado'` si el campo `message` está ausente.
9. IF el Backend_API responde con un código HTTP 5xx, THEN THE SalesRepository SHALL lanzar un error con el texto `'Error interno del servidor al registrar la venta'`.
10. IF el Backend_API responde con un código HTTP no contemplado en los criterios anteriores, THEN THE SalesRepository SHALL lanzar un error con el texto `'Error inesperado al registrar la venta'`.
11. IF el Backend_API responde con estado `200` o `201` pero el cuerpo no es JSON válido o está vacío, THEN THE SalesRepository SHALL lanzar un error con el texto `'Respuesta inválida del servidor'`.

---

### Requirement 4: Uso de la SaleResponse en el flujo de pago

**User Story:** Como cajero, quiero que el recibo muestre los datos confirmados por el backend, para que el total y los ítems del comprobante sean los oficiales del sistema.

#### Acceptance Criteria

1. WHEN el Backend_API retorna una `SaleResponse` exitosa, THE POS_Frontend SHALL usar el campo `ventaId` de la `SaleResponse` como identificador de la `Transaction` almacenada localmente.
2. WHEN el Backend_API retorna una `SaleResponse` exitosa, THE POS_Frontend SHALL usar el campo `total` de la `SaleResponse` como total de la `Transaction` mostrada en el recibo.
3. WHEN el Backend_API retorna una `SaleResponse` exitosa, THE POS_Frontend SHALL vaciar el carrito y cerrar el diálogo de pago.
4. IF el SalesRepository lanza un error durante el registro, THEN THE POS_Frontend SHALL mostrar el mensaje de error al cajero sin vaciar el carrito ni cerrar el diálogo de pago.
5. WHEN el Backend_API retorna una `SaleResponse` exitosa, THE POS_Frontend SHALL mostrar el recibo con el `ventaId` y el `total` recibidos del backend antes de limpiar el estado del carrito.

---

### Requirement 5: Manejo de errores HTTP con mensajes del backend

**User Story:** Como cajero, quiero ver mensajes de error claros cuando el backend rechaza una operación, para poder entender qué ocurrió y tomar acción.

#### Acceptance Criteria

1. WHEN el Backend_API responde con un cuerpo JSON que contiene el campo `message`, THE POS_Frontend SHALL mostrar ese valor como mensaje de error en la interfaz.
2. WHEN el Backend_API responde con un error sin campo `message` en el cuerpo, THE POS_Frontend SHALL mostrar un mensaje de error genérico en español.
3. WHEN una petición al Backend_API falla por error de red (sin respuesta), THE POS_Frontend SHALL mostrar el mensaje `'No se pudo conectar con el servidor. Verifica tu conexión.'`.
4. THE POS_Frontend SHALL mostrar los mensajes de error en un componente visible dentro del flujo activo (catálogo o diálogo de pago), sin redirigir al cajero a otra pantalla.
5. WHEN el cajero descarta un mensaje de error, THE POS_Frontend SHALL permitir reintentar la operación fallida.

---

### Requirement 6: Eliminación de referencias a datos locales de productos

**User Story:** Como desarrollador, quiero que el frontend no dependa de datos de productos hardcodeados, para que el catálogo siempre provenga del Backend_API.

#### Acceptance Criteria

1. THE POS_Frontend SHALL obtener todos los productos exclusivamente a través del CatalogRepository.
2. IF existe algún archivo de datos locales de productos (por ejemplo `src/data/products.ts`), THEN THE POS_Frontend SHALL eliminar ese archivo y todas sus importaciones.
3. THE CatalogRepository SHALL mantener el archivo `src/data/categories.ts` para la información de categorías, ya que esta información es estática del frontend.
4. WHEN el CatalogRepository no puede obtener productos del Backend_API, THE POS_Frontend SHALL mostrar el catálogo vacío con un mensaje de error, sin usar datos locales como fallback.
