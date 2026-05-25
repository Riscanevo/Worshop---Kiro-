# Documento de Requisitos: Autenticación y Refactorización de Arquitectura POS

## Introducción

Este documento define los requisitos para tres mejoras principales del sistema POS frontend:

1. **Sistema de Autenticación**: Implementar un sistema de login/autenticación completo con gestión de sesiones y rutas protegidas
2. **Refactorización Atomic Design**: Reorganizar la estructura de componentes siguiendo la metodología Atomic Design con las carpetas correctas
3. **Sistema de Visualización de Requests**: Implementar herramientas de desarrollo para visualizar requests HTTP y payloads de forma profesional

Estas mejoras mantendrán la funcionalidad existente del POS mientras añaden capacidades de autenticación, mejoran la organización del código y facilitan el debugging.

## Glosario

- **POS_System**: El sistema frontend de punto de venta completo
- **Auth_Module**: El módulo de autenticación que gestiona login, sesiones y protección de rutas
- **Component_Library**: La biblioteca de componentes organizados según Atomic Design
- **Dev_Tools**: Las herramientas de desarrollo para visualización de requests y debugging
- **Session_Manager**: El gestor de sesiones de usuario autenticado
- **Route_Guard**: El componente que protege rutas requiriendo autenticación
- **Request_Logger**: El sistema que captura y visualiza requests HTTP
- **Atomic_Structure**: La estructura de carpetas atoms/, molecules/, organisms/, templates/, pages/
- **Login_Screen**: La pantalla de inicio de sesión del sistema
- **Color_Palette**: La paleta de colores definida en src/styles/global.css del POS
- **Protected_Route**: Una ruta que requiere autenticación para acceder

## Requisitos

### Requisito 1: Autenticación de Usuario

**User Story:** Como cajero, quiero iniciar sesión en el sistema POS, para que solo usuarios autorizados puedan realizar transacciones.

#### Criterios de Aceptación

1. THE Login_Screen SHALL mostrar campos para nombre de usuario y contraseña
2. WHEN el usuario envía credenciales válidas, THE Auth_Module SHALL crear una sesión autenticada
3. WHEN el usuario envía credenciales inválidas, THE Auth_Module SHALL mostrar un mensaje de error descriptivo
4. THE Login_Screen SHALL usar la Color_Palette definida en src/styles/global.css
5. WHEN la autenticación es exitosa, THE POS_System SHALL redirigir al usuario a la pantalla principal del POS
6. THE Login_Screen SHALL incluir estados de carga durante el proceso de autenticación
7. WHEN ocurre un error de red, THE Auth_Module SHALL mostrar un mensaje de error apropiado

### Requisito 2: Gestión de Sesiones

**User Story:** Como cajero, quiero que mi sesión se mantenga activa mientras trabajo, para que no tenga que iniciar sesión repetidamente.

#### Criterios de Aceptación

1. WHEN un usuario se autentica exitosamente, THE Session_Manager SHALL almacenar el token de sesión de forma segura
2. WHEN el usuario recarga la página, THE Session_Manager SHALL restaurar la sesión si el token es válido
3. THE Session_Manager SHALL proporcionar una función para cerrar sesión
4. WHEN el usuario cierra sesión, THE Session_Manager SHALL eliminar todos los datos de sesión
5. WHEN el token de sesión expira, THE Session_Manager SHALL redirigir al usuario al Login_Screen
6. THE Session_Manager SHALL almacenar información del usuario autenticado (nombre, rol, ID)

### Requisito 3: Protección de Rutas

**User Story:** Como administrador del sistema, quiero que las rutas del POS estén protegidas, para que solo usuarios autenticados puedan acceder.

#### Criterios de Aceptación

1. WHEN un usuario no autenticado intenta acceder a una Protected_Route, THE Route_Guard SHALL redirigir al Login_Screen
2. WHEN un usuario autenticado accede a una Protected_Route, THE Route_Guard SHALL permitir el acceso
3. WHEN un usuario autenticado intenta acceder al Login_Screen, THE Route_Guard SHALL redirigir a la pantalla principal
4. THE Route_Guard SHALL verificar la validez del token antes de permitir acceso
5. THE POS_System SHALL marcar todas las rutas principales como Protected_Route excepto el login

### Requisito 4: Consistencia Visual de Autenticación

**User Story:** Como cajero, quiero que la pantalla de login tenga el mismo aspecto visual que el resto del POS, para una experiencia consistente.

#### Criterios de Aceptación

1. THE Login_Screen SHALL usar var(--pos-bg-primary) como color de fondo principal
2. THE Login_Screen SHALL usar var(--pos-bg-secondary) para tarjetas y contenedores
3. THE Login_Screen SHALL usar var(--pos-accent) para botones primarios y elementos interactivos
4. THE Login_Screen SHALL usar var(--pos-text-primary) para texto principal
5. THE Login_Screen SHALL usar var(--pos-text-secondary) para texto secundario
6. THE Login_Screen SHALL usar var(--pos-border) para bordes
7. THE Login_Screen SHALL usar var(--pos-danger) para mensajes de error
8. THE Login_Screen SHALL mantener el mismo border-radius y espaciado que otros componentes del POS

### Requisito 5: Reorganización Atomic Design - Atoms

**User Story:** Como desarrollador, quiero que los componentes básicos estén en la carpeta atoms/, para seguir la metodología Atomic Design correctamente.

#### Criterios de Aceptación

1. THE Component_Library SHALL crear la carpeta src/components/atoms/
2. THE Component_Library SHALL mover todos los botones básicos a atoms/
3. THE Component_Library SHALL mover todos los inputs básicos a atoms/
4. THE Component_Library SHALL mover todos los labels y badges a atoms/
5. THE Component_Library SHALL mover todos los iconos standalone a atoms/
6. WHEN se reorganizan componentes, THE POS_System SHALL mantener toda la funcionalidad existente
7. THE Component_Library SHALL actualizar todas las importaciones afectadas

### Requisito 6: Reorganización Atomic Design - Molecules

**User Story:** Como desarrollador, quiero que las combinaciones simples de componentes estén en molecules/, para una estructura clara y mantenible.

#### Criterios de Aceptación

1. THE Component_Library SHALL crear la carpeta src/components/molecules/
2. THE Component_Library SHALL mover componentes como search bars a molecules/
3. THE Component_Library SHALL mover form fields con labels a molecules/
4. THE Component_Library SHALL mover CartItem a molecules/cart/
5. THE Component_Library SHALL mover componentes de input con validación a molecules/
6. WHEN se reorganizan componentes, THE POS_System SHALL mantener toda la funcionalidad existente
7. THE Component_Library SHALL actualizar todas las importaciones afectadas

### Requisito 7: Reorganización Atomic Design - Organisms

**User Story:** Como desarrollador, quiero que los componentes complejos estén en organisms/, para separar claramente la complejidad.

#### Criterios de Aceptación

1. THE Component_Library SHALL crear la carpeta src/components/organisms/
2. THE Component_Library SHALL mover el header completo a organisms/
3. THE Component_Library SHALL mover ProductCard a organisms/products/
4. THE Component_Library SHALL mover ShoppingCart a organisms/cart/
5. THE Component_Library SHALL mover BarcodeScanner a organisms/products/
6. THE Component_Library SHALL mover CategoryFilter a organisms/products/
7. WHEN se reorganizan componentes, THE POS_System SHALL mantener toda la funcionalidad existente
8. THE Component_Library SHALL actualizar todas las importaciones afectadas

### Requisito 8: Reorganización Atomic Design - Templates y Pages

**User Story:** Como desarrollador, quiero separar layouts de páginas completas, para una arquitectura clara y escalable.

#### Criterios de Aceptación

1. THE Component_Library SHALL crear las carpetas src/components/templates/ y src/components/pages/
2. THE Component_Library SHALL crear templates para layouts principales (MainLayout, AuthLayout)
3. THE Component_Library SHALL mover componentes de página completa a pages/
4. THE Component_Library SHALL crear POSPage que use MainLayout
5. THE Component_Library SHALL crear LoginPage que use AuthLayout
6. WHEN se reorganizan componentes, THE POS_System SHALL mantener toda la funcionalidad existente
7. THE Component_Library SHALL actualizar todas las importaciones en App.tsx

### Requisito 9: Captura de Requests HTTP

**User Story:** Como desarrollador, quiero capturar automáticamente todos los requests HTTP, para poder debuggear problemas de integración.

#### Criterios de Aceptación

1. THE Request_Logger SHALL interceptar todos los requests HTTP salientes
2. THE Request_Logger SHALL capturar método, URL, headers y body de cada request
3. THE Request_Logger SHALL capturar status, headers y body de cada response
4. THE Request_Logger SHALL capturar timestamp de inicio y fin de cada request
5. THE Request_Logger SHALL calcular la duración de cada request
6. THE Request_Logger SHALL almacenar los últimos 100 requests en memoria
7. WHEN ocurre un error de request, THE Request_Logger SHALL capturar el error completo

### Requisito 10: Visualización de Requests

**User Story:** Como desarrollador, quiero visualizar requests y responses de forma clara, para debuggear problemas rápidamente.

#### Criterios de Aceptación

1. THE Dev_Tools SHALL proporcionar un panel de visualización de requests
2. THE Dev_Tools SHALL mostrar una lista de todos los requests capturados
3. THE Dev_Tools SHALL mostrar método HTTP con código de color (GET=azul, POST=verde, etc.)
4. THE Dev_Tools SHALL mostrar status code con código de color (2xx=verde, 4xx=naranja, 5xx=rojo)
5. THE Dev_Tools SHALL mostrar duración de cada request en milisegundos
6. WHEN el desarrollador selecciona un request, THE Dev_Tools SHALL mostrar detalles completos
7. THE Dev_Tools SHALL formatear JSON de forma legible con syntax highlighting

### Requisito 11: Panel de Developer Tools

**User Story:** Como desarrollador, quiero un panel de developer tools accesible, para activar/desactivar debugging según necesite.

#### Criterios de Aceptación

1. THE Dev_Tools SHALL proporcionar un botón flotante para abrir el panel
2. THE Dev_Tools SHALL mostrar el panel como overlay o drawer lateral
3. THE Dev_Tools SHALL permitir cerrar el panel sin perder datos capturados
4. THE Dev_Tools SHALL proporcionar un botón para limpiar todos los requests capturados
5. THE Dev_Tools SHALL proporcionar filtros por método HTTP
6. THE Dev_Tools SHALL proporcionar filtros por status code
7. WHERE el entorno es producción, THE Dev_Tools SHALL estar deshabilitado por defecto

### Requisito 12: Detalles de Request/Response

**User Story:** Como desarrollador, quiero ver detalles completos de requests y responses, para entender exactamente qué datos se están enviando y recibiendo.

#### Criterios de Aceptación

1. WHEN el desarrollador selecciona un request, THE Dev_Tools SHALL mostrar la URL completa
2. THE Dev_Tools SHALL mostrar todos los headers del request en formato clave-valor
3. THE Dev_Tools SHALL mostrar el body del request formateado según Content-Type
4. THE Dev_Tools SHALL mostrar todos los headers del response en formato clave-valor
5. THE Dev_Tools SHALL mostrar el body del response formateado según Content-Type
6. THE Dev_Tools SHALL proporcionar un botón para copiar request/response al clipboard
7. THE Dev_Tools SHALL mostrar errores de red con stack trace cuando estén disponibles

### Requisito 13: Integración de Developer Tools con POS

**User Story:** Como desarrollador, quiero que las developer tools se integren sin afectar la funcionalidad del POS, para debuggear en un entorno realista.

#### Criterios de Aceptación

1. THE Dev_Tools SHALL activarse solo en modo desarrollo (import.meta.env.DEV)
2. THE Dev_Tools SHALL no afectar el rendimiento del POS en operación normal
3. THE Dev_Tools SHALL usar la Color_Palette del POS para consistencia visual
4. THE Dev_Tools SHALL posicionarse de forma que no obstruya la interfaz principal
5. WHEN el panel está abierto, THE POS_System SHALL seguir siendo completamente funcional
6. THE Dev_Tools SHALL persistir su estado (abierto/cerrado) en localStorage

### Requisito 14: Manejo de Errores de Autenticación

**User Story:** Como cajero, quiero mensajes de error claros cuando falla la autenticación, para saber qué hacer a continuación.

#### Criterios de Aceptación

1. WHEN las credenciales son incorrectas, THE Auth_Module SHALL mostrar "Usuario o contraseña incorrectos"
2. WHEN el servidor no responde, THE Auth_Module SHALL mostrar "Error de conexión. Intente nuevamente"
3. WHEN el token expira durante uso, THE Auth_Module SHALL mostrar "Sesión expirada. Por favor inicie sesión nuevamente"
4. WHEN ocurre un error inesperado, THE Auth_Module SHALL mostrar un mensaje genérico y loggear el error
5. THE Auth_Module SHALL usar toasts de PrimeReact para mostrar errores
6. THE Auth_Module SHALL usar var(--pos-danger) para mensajes de error

### Requisito 15: Estados de Carga y Feedback

**User Story:** Como cajero, quiero feedback visual durante operaciones de autenticación, para saber que el sistema está procesando mi solicitud.

#### Criterios de Aceptación

1. WHEN el usuario envía el formulario de login, THE Login_Screen SHALL mostrar un spinner de carga
2. WHILE la autenticación está en proceso, THE Login_Screen SHALL deshabilitar el botón de submit
3. WHEN la autenticación es exitosa, THE Login_Screen SHALL mostrar un mensaje de éxito antes de redirigir
4. THE Login_Screen SHALL usar animaciones suaves para transiciones de estado
5. THE Login_Screen SHALL mostrar un indicador de progreso para operaciones que tomen más de 1 segundo

## Notas de Implementación

### Autenticación
- Usar Zustand para el store de autenticación (consistente con posStore existente)
- Implementar interceptor de axios o fetch para agregar tokens automáticamente
- Considerar usar React Router para manejo de rutas protegidas
- El token debe almacenarse en localStorage con nombre descriptivo (pos_auth_token)

### Atomic Design
- Mantener subcarpetas por dominio dentro de cada nivel (atoms/buttons/, molecules/cart/, etc.)
- Actualizar imports usando find-and-replace cuidadoso
- Ejecutar tests después de cada fase de reorganización
- Documentar la nueva estructura en README.md

### Developer Tools
- Usar un interceptor de fetch/axios global
- Considerar usar una librería como react-query devtools como referencia
- El panel debe ser un portal de React para evitar conflictos de z-index
- Implementar throttling para evitar problemas de memoria con muchos requests

### Paleta de Colores POS
```css
--pos-bg-primary: #0f172a
--pos-bg-secondary: #1e293b
--pos-bg-tertiary: #334155
--pos-accent: #3b82f6
--pos-accent-hover: #2563eb
--pos-success: #22c55e
--pos-warning: #f59e0b
--pos-danger: #ef4444
--pos-text-primary: #f8fafc
--pos-text-secondary: #94a3b8
--pos-border: #475569
```

## Dependencias y Consideraciones

### Nuevas Dependencias Potenciales
- react-router-dom (si no está ya instalado) - para rutas protegidas
- axios (si no está ya instalado) - para interceptores HTTP más robustos
- jwt-decode (opcional) - para decodificar tokens JWT

### Compatibilidad
- Mantener compatibilidad con PrimeReact existente
- Mantener compatibilidad con Zustand existente
- No romper funcionalidad existente del POS durante refactorización

### Testing
- Agregar tests para flujos de autenticación
- Agregar tests para Route Guards
- Verificar que todos los componentes reorganizados mantengan funcionalidad
- Tests de integración para el flujo completo login → POS → logout
