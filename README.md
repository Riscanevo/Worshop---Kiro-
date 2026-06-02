# POS Frontend con React, Vite y SDD

Frontend de punto de venta (POS) para supermercado, desarrollado con **React + TypeScript** y guiado por **Spec-Driven Development (SDD)** usando especificaciones de Kiro.

El sistema permite operar un flujo completo de caja: cargar productos desde un backend real, buscar y filtrar el catálogo, agregar productos al carrito, calcular totales, registrar ventas contra el API y mostrar el comprobante confirmado por el servidor.

## Tabla de contenidos

- [Objetivo del proyecto](#objetivo-del-proyecto)
- [Arquitectura cliente-servidor](#arquitectura-cliente-servidor)
- [Framework elegido y justificación](#framework-elegido-y-justificación)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Configuración del API Gateway](#configuración-del-api-gateway)
- [Ejecución local](#ejecución-local)
- [Scripts disponibles](#scripts-disponibles)
- [Capturas de pantalla](#capturas-de-pantalla)
- [Proceso SDD](#proceso-sdd)
- [Calidad y validación](#calidad-y-validación)

## Objetivo del proyecto

El objetivo principal es construir un frontend POS mantenible, tipado y conectado a un backend mediante API REST. La aplicación está pensada para un escenario de caja de supermercado, donde el cajero necesita una interfaz rápida, clara y tolerante a errores.

El proyecto también documenta un proceso profesional de desarrollo:

1. Definir primero **qué se debe construir** mediante requisitos.
2. Diseñar **cómo se va a implementar** mediante arquitectura y contratos.
3. Ejecutar tareas pequeñas y trazables.
4. Validar el resultado contra criterios de aceptación.

## Arquitectura cliente-servidor

El sistema sigue una arquitectura **cliente-servidor**:

- **Cliente:** aplicación SPA construida con React, TypeScript y Vite. Se ejecuta en el navegador y gestiona la experiencia de usuario del cajero.
- **Servidor:** Backend API expuesto mediante AWS API Gateway. El frontend consume este backend para cargar productos y registrar ventas.
- **Comunicación:** HTTP/JSON usando `fetch` desde la capa de infraestructura del frontend.

Flujo general:

```text
Usuario / Cajero
    ↓
Interfaz React
    ↓
Estado POS (Zustand)
    ↓
Casos de uso y reglas de negocio
    ↓
Repositorios de infraestructura
    ↓
AWS API Gateway
    ↓
Backend / Persistencia
```

### Responsabilidades por capa

| Capa                 | Ubicación                       | Responsabilidad                                                                                  |
| -------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------ |
| Presentación         | `src/components/**`             | Renderizar la interfaz, capturar acciones del usuario y mostrar estados de carga, éxito o error. |
| Estado de aplicación | `src/store/posStore.ts`         | Orquestar carrito, checkout, recibos, carga de productos y procesamiento de pagos.               |
| Aplicación           | `src/application/**`            | Construir transacciones y coordinar reglas del flujo POS.                                        |
| Dominio              | `src/domain/**`, `src/types/**` | Definir tipos, cálculos y reglas de negocio independientes de la UI.                             |
| Infraestructura      | `src/infrastructure/**`         | Comunicarse con el backend, normalizar respuestas y manejar errores HTTP.                        |
| Configuración        | `src/config/api.ts`             | Centralizar la URL base del API y construir endpoints.                                           |

### Endpoints consumidos

| Operación        | Método | Endpoint     | Uso en el frontend                                |
| ---------------- | ------ | ------------ | ------------------------------------------------- |
| Cargar productos | `GET`  | `/productos` | Poblar el catálogo del POS con datos del backend. |
| Registrar venta  | `POST` | `/ventas`    | Enviar los productos vendidos y el medio de pago. |

### Flujo de datos del catálogo

1. Al iniciar el POS, el frontend llama a `GET /productos`.
2. `catalogRepository` obtiene la respuesta del API Gateway.
3. La respuesta se normaliza al tipo `Product` usado por la UI.
4. El catálogo se muestra en pantalla con búsqueda, categorías y acciones para agregar al carrito.
5. Si ocurre un error HTTP o de red, se muestra un mensaje visible y se permite reintentar.

### Flujo de datos de una venta

1. El cajero agrega productos al carrito.
2. El sistema calcula subtotal, impuestos, descuentos y total.
3. El cajero confirma el pago.
4. `posStore` crea una transacción local.
5. `salesRepository` envía a `POST /ventas` un payload compatible con el backend:

```json
{
  "items": [
    {
      "productoId": "producto-123",
      "cantidad": 2
    }
  ],
  "medioPago": "efectivo"
}
```

6. El backend responde con una `SaleResponse`.
7. El frontend usa `ventaId` y `total` confirmados por el backend para mostrar el recibo.
8. Si el API rechaza la venta o no responde correctamente, el carrito se conserva para que el cajero pueda reintentar.

## Framework elegido y justificación

El framework principal elegido fue **React con TypeScript**, empaquetado con **Vite**.

### React

React fue elegido porque permite construir interfaces interactivas mediante componentes reutilizables. Para un POS, esta decisión es importante porque la pantalla combina varias zonas con estados independientes: catálogo, filtros, lector de códigos, carrito, resumen de compra, diálogo de pago y recibo.

Ventajas aplicadas en este proyecto:

- Componentes pequeños y reutilizables.
- Renderizado eficiente para interacciones frecuentes del cajero.
- Separación clara entre UI, estado y lógica de negocio.
- Ecosistema amplio para pruebas, formularios, estilos y componentes visuales.

### TypeScript

TypeScript se usó para reducir errores en contratos importantes:

- Productos recibidos desde el backend.
- Ítems del carrito.
- Payload de venta.
- Respuesta del backend al registrar una venta.
- Métodos de pago y cálculos de totales.

El tipado ayuda a detectar inconsistencias antes de ejecutar la aplicación y mejora la mantenibilidad del código.

### Vite

Vite fue elegido como herramienta de desarrollo y build por su rapidez y simplicidad:

- Servidor local rápido para desarrollo.
- Soporte nativo para variables de entorno con prefijo `VITE_`.
- Configuración ligera para React + TypeScript.
- Build optimizado para producción.

### Zustand

Zustand se usó para manejar el estado global del POS sin introducir una arquitectura pesada. Es adecuado para este caso porque el estado central es claro: productos, carrito, descuentos, checkout, transacciones y recibo actual.

## Stack tecnológico

- **React 18**: construcción de interfaces.
- **TypeScript**: tipado estático.
- **Vite**: servidor de desarrollo y build.
- **Zustand**: estado global del POS.
- **PrimeReact, PrimeFlex y PrimeIcons**: componentes visuales, utilidades CSS e iconografía.
- **Vitest**: pruebas unitarias.
- **ESLint y Prettier**: análisis estático y formato.
- **Husky y lint-staged**: automatización de validaciones antes de commits.

## Estructura del proyecto

```text
src/
  application/
    pos/
  components/
    atoms/
    molecules/
    organisms/
    pages/
    templates/
  config/
    api.ts
  data/
    categories.ts
  domain/
    pos/
  infrastructure/
    catalog/
    sales/
    storage/
  lib/
  services/
  store/
    posStore.ts
  styles/
  types/
    index.ts
```

Archivos clave de integración:

- `src/config/api.ts`: lee `VITE_API_BASE_URL`, aplica fallback local y construye URLs.
- `src/infrastructure/catalog/catalogRepository.ts`: consume `GET /productos`.
- `src/infrastructure/sales/salesRepository.ts`: consume `POST /ventas`.
- `src/store/posStore.ts`: coordina el flujo de productos, carrito, pago y recibo.
- `.env.example`: documenta la variable requerida para apuntar al API Gateway.

## Configuración del API Gateway

La URL base del backend se configura con la variable de entorno:

```bash
VITE_API_BASE_URL=https://qg07kng9rk.execute-api.us-east-1.amazonaws.com
```

El proyecto incluye un archivo `.env.example` con este valor de referencia.

### Pasos para configurar el entorno

1. Crear un archivo `.env` en la raíz del proyecto.
2. Agregar la URL base del API Gateway:

```bash
VITE_API_BASE_URL=https://qg07kng9rk.execute-api.us-east-1.amazonaws.com
```

3. Reiniciar el servidor de desarrollo si ya estaba ejecutándose.

### Comportamiento por defecto

Si `VITE_API_BASE_URL` no existe o está vacía, la aplicación usa:

```bash
http://localhost:8080
```

Esto permite trabajar contra un backend local durante desarrollo.

### Detalle técnico

La configuración se centraliza en `src/config/api.ts`:

```ts
const raw = import.meta.env.VITE_API_BASE_URL
const configuredApiBaseUrl = raw && raw.trim() !== '' ? raw : 'http://localhost:8080'

export const API_BASE_URL = configuredApiBaseUrl.replace(/\/+$/, '')
```

Todas las llamadas HTTP se construyen con `buildApiUrl()`, evitando URLs hardcodeadas dentro de los componentes.

## Ejecución local

### Requisitos

- Node.js 20 o superior.
- npm 10 o superior.
- Acceso al Backend API o un backend local compatible.

### Instalación

Desde la raíz del repositorio:

```bash
npm install
```

### Ejecutar en modo desarrollo

```bash
npm run dev
```

Vite mostrará en la terminal la URL local de la aplicación, normalmente:

```text
http://localhost:5173
```

### Flujo recomendado para levantar el proyecto

```bash
npm install
npm run dev
```

Después de iniciar el servidor, abrir la URL local en el navegador y verificar que el catálogo cargue productos desde el API configurado.

## Scripts disponibles

| Script                 | Descripción                                                  |
| ---------------------- | ------------------------------------------------------------ |
| `npm run dev`          | Inicia el servidor de desarrollo con Vite.                   |
| `npm run build`        | Ejecuta TypeScript y genera el build de producción.          |
| `npm run preview`      | Sirve localmente el build generado.                          |
| `npm run test`         | Ejecuta pruebas unitarias con Vitest.                        |
| `npm run test:watch`   | Ejecuta pruebas en modo observación.                         |
| `npm run typecheck`    | Valida tipos TypeScript.                                     |
| `npm run lint`         | Ejecuta ESLint.                                              |
| `npm run lint:fix`     | Corrige automáticamente problemas de lint cuando es posible. |
| `npm run format`       | Formatea archivos con Prettier.                              |
| `npm run format:check` | Verifica formato sin modificar archivos.                     |
| `npm run validate`     | Ejecuta `typecheck`, `lint` y `test`.                        |

## Capturas de pantalla

> Las siguientes secciones están reservadas para evidencias visuales del sistema funcionando. Agregar aquí las capturas finales del proyecto.
### Login
![alt text](image.png)
### 1. Listado de productos cargado desde el API
![alt text](image-2.png)
catálogo mostrando productos obtenidos desde `GET /productos`.

### 2. Registro de una venta exitosa con respuesta del API visible
![alt text](image-3.png)

![alt text](image-4.png)
flujo de checkout o recibo mostrando una venta registrada correctamente y la respuesta confirmada por el API, incluyendo datos como `ventaId`, `estado` o `total`.

### 3. Manejo de un error del API
![alt text](image-5.png)
respuesta inválida o error HTTP por credenciales incorrectas al iniciar sesion, mostrando el mensaje visible para el usuario.

## Proceso SDD

El proyecto fue desarrollado usando **Spec-Driven Development (SDD)**, una metodología donde la implementación nace de especificaciones escritas antes del código. En lugar de comenzar directamente por componentes, el trabajo se guió por documentos que definieron requisitos, diseño técnico y tareas verificables.

### 1. Requirements

Los documentos `requirements.md` describen las historias de usuario y criterios de aceptación. Estos requisitos definieron, por ejemplo:

- El catálogo debe cargarse desde `GET /productos`.
- La venta debe registrarse con `POST /ventas`.
- La URL del backend debe configurarse con `VITE_API_BASE_URL`.
- El carrito no debe limpiarse si el registro de venta falla.
- Los errores del backend deben mostrarse de forma clara al cajero.

Documentos relevantes:

- `.kiro/specs/pos-frontend/requirements.md`
- `.kiro/specs/backend-integration/requirements.md`

### 2. Design

Los documentos `design.md` tradujeron los requisitos a decisiones técnicas. Allí se definieron:

- Arquitectura por capas.
- Separación entre UI, estado, dominio e infraestructura.
- Contratos esperados por el backend.
- Estrategia de manejo de errores.
- Flujo de datos para productos y ventas.

Documentos relevantes:

- `.kiro/specs/pos-frontend/design.md`
- `.kiro/specs/backend-integration/design.md`

### 3. Tasks

Los documentos `tasks.md` convirtieron el diseño en una lista de trabajo ejecutable. Cada tarea representa una unidad concreta de implementación o validación.

Ejemplos de tareas usadas para guiar la integración:

- Agregar el tipo `SaleResponse`.
- Corregir el payload enviado a `POST /ventas`.
- Mejorar el manejo de errores HTTP.
- Consumir la respuesta real del backend en el store.
- Documentar la variable `VITE_API_BASE_URL`.

Documentos relevantes:

- `.kiro/specs/pos-frontend/tasks.md`
- `.kiro/specs/backend-integration/tasks.md`

### 4. Implementación guiada por specs

La implementación se hizo respetando la trazabilidad entre especificación y código:

| Spec                              | Implementación                            |
| --------------------------------- | ----------------------------------------- |
| Cargar productos desde API        | `catalogRepository.getProducts()`         |
| Configurar URL del backend        | `src/config/api.ts` y `.env.example`      |
| Registrar venta en backend        | `salesRepository.registerSale()`          |
| Usar respuesta confirmada del API | `posStore.processPayment()`               |
| Preservar carrito ante error      | Manejo de excepciones en el flujo de pago |
| Normalizar productos              | `normalizeProduct()` en infraestructura   |

### 5. Beneficios del proceso

El enfoque SDD ayudó a:

- Evitar cambios improvisados en la arquitectura.
- Mantener el alcance controlado.
- Conectar cada cambio de código con un requisito verificable.
- Separar claramente decisiones técnicas de implementación.
- Facilitar la validación final del proyecto.

## Calidad y validación

El proyecto incluye herramientas para revisar calidad antes de entregar:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

También se puede ejecutar el pipeline rápido:

```bash
npm run validate
```

## Alcance académico

Este repositorio está orientado al aprendizaje y demostración de:

- Desarrollo frontend moderno con React y TypeScript.
- Integración cliente-servidor mediante API Gateway.
- Arquitectura por capas en frontend.
- Manejo profesional de configuración por entorno.
- Implementación guiada por especificaciones con SDD.
- Validación mediante pruebas, lint y type checking.
