# Plan de Implementación: Autenticación y Refactorización de Arquitectura POS

## Visión General

Implementación incremental en 6 fases que migra la arquitectura de componentes a Atomic Design, agrega autenticación completa con Zustand y React Router, e integra un sistema de Developer Tools para debugging de requests HTTP. Cada fase termina con validación para garantizar que la funcionalidad existente no se rompa.

## Tareas

- [x] 1. Instalar dependencia y preparar tipos base
  - [x] 1.1 Instalar react-router-dom v6
    - Ejecutar `npm install react-router-dom@^6.28.0`
    - Verificar que aparece en `package.json` bajo `dependencies`
    - _Requisitos: 3.1, 3.2, 3.5_

  - [x] 1.2 Agregar tipos de autenticación y request logger a `src/types/index.ts`
    - Agregar interfaces `User`, `AuthState`, `RequestLog` y `LogFilters` al archivo existente
    - Mantener todos los tipos existentes sin modificar
    - _Requisitos: 2.6, 9.2, 9.3_

- [x] 2. Fase 1 — Crear estructura de carpetas y atoms
  - [x] 2.1 Crear componente `src/components/atoms/Button.tsx`
    - Wrapper de PrimeReact `Button` con prop `variant` (primary, secondary, danger), `size`, `icon` y `loading`
    - Aplicar estilos con variables CSS del POS (`--pos-accent`, `--pos-danger`)
    - _Requisitos: 5.1, 5.2, 5.6_

  - [x] 2.2 Crear componente `src/components/atoms/Input.tsx`
    - Wrapper de PrimeReact `InputText` con props `error`, `disabled` y `placeholder`
    - _Requisitos: 5.1, 5.3, 5.6_

  - [x] 2.3 Crear componente `src/components/atoms/Badge.tsx`
    - Wrapper de PrimeReact `Badge` con props `value`, `severity` y `size`
    - _Requisitos: 5.1, 5.4, 5.6_

  - [x] 2.4 Crear componente `src/components/atoms/Icon.tsx`
    - Wrapper de PrimeIcons con props `name`, `size`, `color` y `spin`
    - _Requisitos: 5.1, 5.5, 5.6_

  - [x] 2.5 Crear componente `src/components/atoms/Label.tsx`
    - Label estilizado con props `text`, `required` y `htmlFor`
    - Usar `--pos-text-primary` y `--pos-text-secondary` según contexto
    - _Requisitos: 5.1, 5.4, 5.6_

  - [x] 2.6 Escribir tests unitarios para atoms
    - Verificar que Button renderiza con cada variante
    - Verificar que Input muestra estado de error
    - Verificar que Label muestra indicador de requerido
    - _Requisitos: 5.6, 5.7_

- [x] 3. Checkpoint Fase 1 — Validar atoms y estructura base
  - Ejecutar `npm run typecheck` — sin errores de TypeScript
  - Ejecutar `npm run test` — todos los tests existentes deben pasar
  - Ejecutar `npm run lint` — sin errores de ESLint
  - Preguntar al usuario si hay dudas antes de continuar

- [x] 4. Fase 2 — Crear molecules
  - [x] 4.1 Crear componente `src/components/molecules/SearchBar.tsx`
    - Props: `value`, `onChange`, `placeholder`, `onSearch`
    - Componer usando `atoms/Input` e `atoms/Icon`
    - _Requisitos: 6.1, 6.2, 6.6_

  - [x] 4.2 Crear componente `src/components/molecules/FormField.tsx`
    - Props: `label`, `error`, `required`, `children`
    - Componer usando `atoms/Label`; mostrar mensaje de error con `--pos-danger`
    - _Requisitos: 6.1, 6.3, 6.6_

  - [x] 4.3 Crear componente `src/components/molecules/PriceDisplay.tsx`
    - Props: `amount`, `label`, `size` (small | medium | large), `highlight`
    - Formatear moneda usando la utilidad existente `src/lib/currency.ts`
    - _Requisitos: 6.1, 6.6_

  - [x] 4.4 Mover `CartItem` a `src/components/molecules/cart/CartItem.tsx`
    - Copiar contenido de `src/components/cart/CartItem.tsx` a la nueva ubicación
    - Actualizar imports internos si los hay
    - Actualizar el import en `src/components/cart/ShoppingCart.tsx` para apuntar a la nueva ruta
    - _Requisitos: 6.1, 6.4, 6.6, 6.7_

  - [x] 4.5 Mover `DiscountInput` a `src/components/molecules/cart/DiscountInput.tsx`
    - Copiar contenido de `src/components/cart/DiscountInput.tsx` a la nueva ubicación
    - Actualizar el import en `src/components/cart/ShoppingCart.tsx` para apuntar a la nueva ruta
    - _Requisitos: 6.1, 6.5, 6.6, 6.7_

  - [x] 4.6 Escribir tests unitarios para molecules
    - Verificar que SearchBar llama `onChange` al escribir
    - Verificar que FormField muestra mensaje de error cuando se provee `error`
    - Verificar que PriceDisplay formatea el monto correctamente
    - _Requisitos: 6.6, 6.7_

- [x] 5. Checkpoint Fase 2 — Validar molecules
  - Ejecutar `npm run typecheck` — sin errores de TypeScript
  - Ejecutar `npm run test` — todos los tests existentes deben pasar
  - Ejecutar `npm run lint` — sin errores de ESLint
  - Verificar visualmente que el carrito sigue funcionando con los imports actualizados
  - Preguntar al usuario si hay dudas antes de continuar

- [x] 6. Fase 3 — Mover organisms
  - [x] 6.1 Mover `Header` a `src/components/organisms/Header.tsx`
    - Copiar contenido de `src/components/layout/Header.tsx`
    - Agregar botón de logout que llame a `useAuthStore().logout()` (puede ser un placeholder hasta que authStore exista)
    - Agregar visualización del nombre del usuario autenticado desde `useAuthStore().user`
    - _Requisitos: 7.1, 7.2, 7.7, 7.8_

  - [x] 6.2 Mover `ProductCard` a `src/components/organisms/products/ProductCard.tsx`
    - Copiar contenido de `src/components/products/ProductCard.tsx`
    - Mantener toda la funcionalidad existente sin cambios
    - _Requisitos: 7.1, 7.3, 7.7, 7.8_

  - [x] 6.3 Mover `ProductGrid` a `src/components/organisms/products/ProductGrid.tsx`
    - Copiar contenido de `src/components/products/ProductGrid.tsx`
    - Actualizar import de `ProductCard` para apuntar a la nueva ruta
    - _Requisitos: 7.1, 7.7, 7.8_

  - [x] 6.4 Mover `BarcodeScanner` a `src/components/organisms/products/BarcodeScanner.tsx`
    - Copiar contenido de `src/components/products/BarcodeScanner.tsx`
    - Mantener toda la funcionalidad existente sin cambios
    - _Requisitos: 7.1, 7.5, 7.7, 7.8_

  - [x] 6.5 Mover `CategoryFilter` a `src/components/organisms/products/CategoryFilter.tsx`
    - Copiar contenido de `src/components/products/CategoryFilter.tsx`
    - Mantener toda la funcionalidad existente sin cambios
    - _Requisitos: 7.1, 7.6, 7.7, 7.8_

  - [x] 6.6 Mover `ProductCatalog` a `src/components/organisms/products/ProductCatalog.tsx`
    - Copiar contenido de `src/components/products/ProductCatalog.tsx`
    - Actualizar imports internos de `ProductGrid`, `BarcodeScanner` y `CategoryFilter` a las nuevas rutas
    - _Requisitos: 7.1, 7.7, 7.8_

  - [x] 6.7 Mover `ShoppingCart` a `src/components/organisms/cart/ShoppingCart.tsx`
    - Copiar contenido de `src/components/cart/ShoppingCart.tsx`
    - Actualizar imports de `CartItem` y `DiscountInput` a las rutas de molecules
    - _Requisitos: 7.1, 7.4, 7.7, 7.8_

  - [x] 6.8 Mover `CartSummary` a `src/components/organisms/cart/CartSummary.tsx`
    - Copiar contenido de `src/components/cart/CartSummary.tsx`
    - Mantener toda la funcionalidad existente sin cambios
    - _Requisitos: 7.1, 7.7, 7.8_

  - [x] 6.9 Mover `CheckoutDialog` a `src/components/organisms/checkout/CheckoutDialog.tsx`
    - Copiar contenido de `src/components/checkout/CheckoutDialog.tsx`
    - Mantener toda la funcionalidad existente sin cambios
    - _Requisitos: 7.1, 7.7, 7.8_

  - [x] 6.10 Mover `ReceiptDialog` a `src/components/organisms/checkout/ReceiptDialog.tsx`
    - Copiar contenido de `src/components/receipt/ReceiptDialog.tsx`
    - Mantener toda la funcionalidad existente sin cambios
    - _Requisitos: 7.1, 7.7, 7.8_

  - [x] 6.11 Actualizar imports en `src/App.tsx` para apuntar a los organisms
    - Reemplazar imports de `components/layout/Header`, `components/products/ProductCatalog`, `components/cart/ShoppingCart`, `components/checkout/CheckoutDialog`, `components/receipt/ReceiptDialog` por las nuevas rutas de organisms
    - Verificar que la app sigue compilando y funcionando
    - _Requisitos: 7.7, 7.8_

- [x] 7. Checkpoint Fase 3 — Validar organisms
  - Ejecutar `npm run typecheck` — sin errores de TypeScript
  - Ejecutar `npm run test` — todos los tests existentes deben pasar
  - Ejecutar `npm run lint` — sin errores de ESLint
  - Verificar que la app compila y el POS funciona completamente (agregar al carrito, checkout, recibo)
  - Preguntar al usuario si hay dudas antes de continuar

- [x] 8. Fase 4 — Crear templates y pages
  - [x] 8.1 Crear template `src/components/templates/MainLayout.tsx`
    - Props: `children: React.ReactNode`
    - Renderizar `organisms/Header` en la parte superior y `children` en el área principal
    - Usar `--pos-bg-primary` como fondo y estructura flex column
    - _Requisitos: 8.1, 8.2, 8.6, 8.7_

  - [x] 8.2 Crear template `src/components/templates/AuthLayout.tsx`
    - Props: `children: React.ReactNode`
    - Centrar contenido vertical y horizontalmente con `--pos-bg-primary` como fondo
    - _Requisitos: 8.1, 8.2, 8.6, 8.7_

  - [x] 8.3 Crear página `src/components/pages/POSPage.tsx`
    - Extraer la lógica de renderizado del POS desde `src/App.tsx`
    - Usar `MainLayout` como wrapper
    - Incluir `ProductCatalog`, `ShoppingCart`, `CheckoutDialog` y `ReceiptDialog` con lazy loading
    - _Requisitos: 8.1, 8.3, 8.4, 8.6, 8.7_

  - [x] 8.4 Crear página `src/components/pages/LoginPage.tsx`
    - Usar `AuthLayout` como wrapper
    - Implementar formulario con campos `username` y `password` usando PrimeReact `InputText` y `Password`
    - Conectar con `useAuthStore().login()` (el store se creará en Fase 5; usar placeholder por ahora)
    - Aplicar paleta de colores del POS: `--pos-bg-secondary` para la tarjeta, `--pos-accent` para el botón
    - Mostrar sección de usuarios de prueba (admin/admin123, cajero/cajero123)
    - _Requisitos: 1.1, 1.4, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 8.1, 8.5_

  - [x]* 8.5 Escribir tests unitarios para templates y pages
    - Verificar que `MainLayout` renderiza `Header` y `children`
    - Verificar que `AuthLayout` renderiza `children` centrado
    - Verificar que `LoginPage` muestra campos de usuario y contraseña
    - _Requisitos: 8.6, 8.7_

- [x] 9. Checkpoint Fase 4 — Validar templates y pages
  - Ejecutar `npm run typecheck` — sin errores de TypeScript
  - Ejecutar `npm run test` — todos los tests existentes deben pasar
  - Ejecutar `npm run lint` — sin errores de ESLint
  - Preguntar al usuario si hay dudas antes de continuar

- [x] 10. Fase 5 — Integrar sistema de autenticación
  - [x] 10.1 Crear `src/services/authService.ts`
    - Implementar la interfaz `AuthService` con métodos `login`, `logout`, `verifyToken` y `refreshToken`
    - Implementar mock con usuarios `admin/admin123` y `cajero/cajero123`
    - Simular delay de red con `setTimeout` (800ms para login, 200ms para logout)
    - Generar token mock en base64 con payload `{ userId, username, exp }`
    - _Requisitos: 1.2, 1.3, 1.6, 1.7, 14.1, 14.2_

  - [x] 10.2 Crear `src/store/authStore.ts`
    - Implementar store Zustand con estado: `user`, `token`, `isAuthenticated`, `isLoading`, `error`
    - Implementar acciones: `login`, `logout`, `checkAuth`, `clearError`
    - Implementar helpers: `getToken`, `getUser`, `hasRole`
    - Persistir token y usuario en `localStorage` con claves `pos_auth_token` y `pos_auth_user`
    - En `logout`, limpiar ambas claves de `localStorage`
    - _Requisitos: 1.2, 1.3, 1.6, 2.1, 2.2, 2.3, 2.4, 2.6_

  - [x]* 10.3 Escribir tests unitarios para `authStore`
    - **Propiedad 1: Autenticación Determinista** — `∀ credenciales válidas → login() retorna token válido`
    - **Valida: Requisitos 1.2, 1.3**
    - Test: login con credenciales válidas establece `isAuthenticated = true`
    - Test: login con credenciales inválidas establece `error` y `isAuthenticated = false`
    - Test: logout limpia `user`, `token` e `isAuthenticated`
    - Test: logout elimina `pos_auth_token` y `pos_auth_user` de `localStorage`
    - _Requisitos: 1.2, 1.3, 2.3, 2.4_

  - [x]* 10.4 Escribir tests unitarios para `authService`
    - Test: mock retorna token y usuario correcto para credenciales válidas
    - Test: mock lanza error para credenciales inválidas
    - Test: `verifyToken` retorna `false` para token expirado
    - Test: `verifyToken` retorna `true` para token vigente
    - _Requisitos: 1.2, 1.3, 2.5_

  - [x]* 10.5 Escribir property test para `checkAuth` (Propiedad 2)
    - **Propiedad 2: Sesión Persistente** — `∀ token válido en localStorage → checkAuth() restaura sesión`
    - **Valida: Requisitos 2.2, 2.5**
    - Generar tokens con fechas de expiración arbitrarias (pasadas y futuras)
    - Verificar que tokens vigentes restauran sesión y tokens expirados la limpian

  - [x] 10.6 Crear `src/components/auth/ProtectedRoute.tsx`
    - Props: `requiredRole?: string`, `redirectTo?: string` (default: `/login`)
    - Llamar `checkAuth()` en `useEffect` al montar
    - Si no autenticado: redirigir a `redirectTo` con `<Navigate replace />`
    - Si autenticado pero sin rol requerido: redirigir a `/unauthorized`
    - Si autenticado: renderizar `<Outlet />`
    - _Requisitos: 3.1, 3.2, 3.4, 3.5_

  - [x]* 10.7 Escribir property test para `ProtectedRoute` (Propiedad 3)
    - **Propiedad 3: Protección de Rutas** — `∀ ruta protegida + usuario no autenticado → redirect a /login`
    - **Valida: Requisitos 3.1, 3.2, 3.3**
    - Test: usuario no autenticado es redirigido a `/login`
    - Test: usuario autenticado puede acceder a ruta protegida
    - Test: usuario autenticado en `/login` es redirigido a `/pos`

  - [x] 10.8 Conectar `LoginPage` con `authStore` y agregar navegación
    - Importar `useAuthStore` en `LoginPage`
    - Conectar `handleSubmit` con `login()` del store
    - Usar `useNavigate` de react-router-dom para redirigir a `/pos` tras login exitoso
    - Mostrar spinner en el botón mientras `isLoading = true`
    - Deshabilitar botón si `isLoading` o campos vacíos
    - Mostrar toast de éxito antes de redirigir y toast de error si falla
    - _Requisitos: 1.1, 1.5, 1.6, 14.1, 14.5, 15.1, 15.2, 15.3_

  - [x] 10.9 Actualizar `organisms/Header.tsx` con logout funcional
    - Conectar botón de logout con `useAuthStore().logout()`
    - Mostrar nombre del usuario autenticado (`useAuthStore().user?.name`)
    - Usar `useNavigate` para redirigir a `/login` tras logout
    - _Requisitos: 2.3, 2.4, 3.3_

  - [x] 10.10 Refactorizar `src/App.tsx` con React Router y rutas protegidas
    - Envolver la app en `<BrowserRouter>`
    - Definir rutas: `/login` → `LoginPage`, `/pos` → `POSPage` (protegida), `/` → redirect a `/pos`
    - Llamar `checkAuth()` en `useEffect` al montar `App`
    - Inicializar el interceptor HTTP en modo DEV: `if (import.meta.env.DEV) initializeHttpInterceptor()`
    - _Requisitos: 3.1, 3.2, 3.3, 3.5, 13.1_

- [x] 11. Checkpoint Fase 5 — Validar autenticación completa
  - Ejecutar `npm run typecheck` — sin errores de TypeScript
  - Ejecutar `npm run test` — todos los tests deben pasar
  - Ejecutar `npm run lint` — sin errores de ESLint
  - Verificar flujo completo: acceder a `/` redirige a `/login`, login exitoso lleva a `/pos`, logout regresa a `/login`
  - Verificar que recargar la página con sesión activa restaura la sesión
  - Preguntar al usuario si hay dudas antes de continuar

- [x] 12. Fase 6 — Implementar Developer Tools
  - [x] 12.1 Crear `src/services/requestLogger.ts`
    - Implementar clase `RequestLoggerService` con `logs: RequestLog[]` (máximo 100 entradas)
    - Métodos: `addLog`, `clearLogs`, `getLogs`, `getFilteredLogs(filters: LogFilters)`
    - Sistema de suscripción: `subscribe(callback)` retorna función de unsubscribe
    - Exportar instancia singleton `requestLogger`
    - _Requisitos: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

  - [x]* 12.2 Escribir property test para `requestLogger` (Propiedad 4)
    - **Propiedad 4: Captura de Requests** — `∀ addLog() llamado → logs.length aumenta en 1 (hasta máximo 100)`
    - **Valida: Requisitos 9.6**
    - Test: `addLog` incrementa el array de logs
    - Test: al superar 100 logs, el array no crece más allá de 100
    - Test: `clearLogs` vacía el array
    - Test: `getFilteredLogs` filtra correctamente por método y URL

  - [x] 12.3 Crear `src/services/httpInterceptor.ts`
    - Guardar referencia a `window.fetch` original
    - Reemplazar `window.fetch` con función interceptora que:
      - Crea un `RequestLog` con `id` (uuid), `timestamp`, `method`, `url`, `requestHeaders`, `requestBody`
      - Llama al fetch original y captura `responseStatus`, `responseHeaders`, `responseBody` y `duration`
      - En caso de error, captura el error y `duration`
      - Llama a `requestLogger.addLog(log)` en ambos casos
    - Exportar función `initializeHttpInterceptor()` que activa el interceptor solo en `import.meta.env.DEV`
    - _Requisitos: 9.1, 9.2, 9.3, 9.4, 9.5, 9.7, 13.1, 13.2_

  - [x]* 12.4 Escribir tests unitarios para `httpInterceptor`
    - Test: captura fetch exitoso y agrega log con status y duration
    - Test: captura fetch con error de red y agrega log con campo `error`
    - _Requisitos: 9.1, 9.7_

  - [x] 12.5 Crear componente `src/components/devtools/DevToolsPanel.tsx`
    - Botón flotante (posición fixed, bottom-right) visible solo en `import.meta.env.DEV`
    - Panel lateral usando PrimeReact `Sidebar` (posición right, ancho 800px)
    - Header del panel con título "Developer Tools" y botón para limpiar logs
    - Filtros: `Dropdown` por método HTTP y `InputText` para buscar por URL
    - Lista de requests con `DataTable`: columnas Method (con badge de color), URL, Status (con badge de color), Time
    - Al seleccionar un request, mostrar panel de detalles con URL, request body y response body en `<pre>` formateado
    - Suscribirse a `requestLogger.subscribe()` en `useEffect` para actualizaciones en tiempo real
    - _Requisitos: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 11.1, 11.2, 11.3, 11.4, 11.5, 11.7, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 13.3, 13.4, 13.5_

  - [x] 12.6 Integrar `DevToolsPanel` en `src/App.tsx`
    - Importar y renderizar `<DevToolsPanel />` al final del árbol de componentes en `App.tsx`
    - El componente se auto-oculta en producción gracias a `import.meta.env.DEV`
    - _Requisitos: 11.1, 11.2, 13.1, 13.2, 13.4_

  - [x]* 12.7 Escribir tests unitarios para `DevToolsPanel`
    - Test: el botón flotante no se renderiza cuando `import.meta.env.DEV` es false
    - Test: al hacer click en el botón, el Sidebar se abre
    - Test: el botón de limpiar llama a `requestLogger.clearLogs()`
    - _Requisitos: 11.1, 11.3, 11.4, 11.7_

- [x] 13. Checkpoint Final — Validar sistema completo
  - Ejecutar `npm run typecheck` — sin errores de TypeScript
  - Ejecutar `npm run test` — todos los tests deben pasar
  - Ejecutar `npm run lint` — sin errores de ESLint
  - Verificar que el botón flotante de DevTools aparece en modo desarrollo
  - Verificar que al hacer login, el request aparece capturado en el panel de DevTools
  - Verificar que el panel de DevTools no obstruye la interfaz del POS
  - Preguntar al usuario si hay dudas antes de dar por completada la implementación

## Notas

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia requisitos específicos para trazabilidad
- Los checkpoints garantizan que la funcionalidad existente no se rompa en ninguna fase
- Los property tests validan propiedades universales del sistema de autenticación y logging
- Los tests unitarios validan casos específicos y condiciones de borde
- La migración de componentes usa copia (no eliminación) hasta que todos los imports estén actualizados; los archivos originales pueden eliminarse al final de cada fase una vez validado
