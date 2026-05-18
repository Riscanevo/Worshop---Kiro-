# POS Frontend con SDD (Kiro)

Frontend de punto de venta (POS) para supermercado, desarrollado como proyecto de estudio aplicando **Spec-Driven Development (SDD)** con flujo de trabajo en **Kiro**.

## Objetivo del proyecto

Este proyecto no solo implementa funcionalidades POS, también documenta una forma profesional de construir software:

- Definir primero **qué** se va a construir (requisitos).
- Diseñar luego **cómo** se va a construir (arquitectura).
- Implementar finalmente con trazabilidad contra tareas y criterios de aceptación.

## Metodología: SDD con Kiro

El flujo de trabajo usado fue:

1. `requirements.md`: historias de usuario + criterios de aceptación.
2. `design.md`: diseño técnico y decisiones de arquitectura.
3. `tasks.md`: plan de ejecución y seguimiento.
4. Implementación en código, pruebas y validación.

Documentos SDD del proyecto:

- [.kiro/specs/pos-frontend/requirements.md](.kiro/specs/pos-frontend/requirements.md)
- [.kiro/specs/pos-frontend/design.md](.kiro/specs/pos-frontend/design.md)
- [.kiro/specs/pos-frontend/tasks.md](.kiro/specs/pos-frontend/tasks.md)
- [SDD_REFLECTION.md](SDD_REFLECTION.md)

## Funcionalidades principales

- Catálogo de productos con búsqueda por texto.
- Filtro por categorías.
- Ingreso de código de barras manual y escaneo por cámara (con fallback).
- Carrito con edición de cantidades y eliminación de ítems.
- Cálculo de subtotal, impuestos, descuentos y total.
- Checkout con pago en efectivo/tarjeta.
- Recibo digital de venta.
- Persistencia local (localStorage) para recuperación de sesión.

## Stack tecnológico

- React 18 + TypeScript
- Vite
- Zustand
- PrimeReact + PrimeFlex + PrimeIcons
- Vitest (unit testing)
- ESLint + Prettier + lint-staged + Husky

## Arquitectura actual

El proyecto evolucionó desde una estructura por componentes a una arquitectura en capas ligera:

1. Presentación: `src/components/**`
2. Aplicación (casos de uso): `src/application/**`
3. Dominio (reglas de negocio): `src/domain/**`
4. Infraestructura (persistencia y repositorios): `src/infrastructure/**`
5. Estado de UI/aplicación (orquestación): `src/store/posStore.ts`
6. Contratos de dominio: `src/types/index.ts`

### Principios aplicados

- Reglas de negocio fuera de la UI.
- Separación entre cálculo de dominio y orquestación de estado.
- Trazabilidad entre especificación y código.
- Validación continua con pruebas y lint.

## Estructura del repositorio

```text
src/
  application/
    pos/
  components/
    cart/
    checkout/
    layout/
    products/
    receipt/
  data/
  domain/
    pos/
  infrastructure/
    catalog/
    storage/
  lib/
  store/
  styles/
  types/
```

## Cómo ejecutar el proyecto

### Requisitos

- Node.js 20+ (recomendado)
- npm 10+

### Instalación y desarrollo

```bash
npm install
npm run dev
```

## Scripts disponibles

- `npm run dev`: servidor de desarrollo.
- `npm run build`: compilación TypeScript + build de producción.
- `npm run preview`: previsualización del build.
- `npm run test`: pruebas unitarias.
- `npm run test:watch`: pruebas en modo watch.
- `npm run typecheck`: validación de tipos.
- `npm run lint`: análisis estático con ESLint.
- `npm run lint:fix`: corrección automática de lint.
- `npm run format`: formateo con Prettier.
- `npm run format:check`: validación de formato.
- `npm run validate`: pipeline rápido de calidad (`typecheck + lint + test`).

## Calidad de código

- ESLint (flat config): `eslint.config.js`
- Prettier: `.prettierrc.json`
- Lint-staged: `package.json`
- Hook pre-commit: `.husky/pre-commit`

Nota: Husky requiere un repositorio Git funcional para instalar hooks.

## Alcance académico

Este repositorio está orientado al aprendizaje de:

- Ingeniería guiada por especificaciones (SDD).
- Uso de Kiro como soporte para ejecución disciplinada del ciclo de desarrollo.
- Diseño y evolución de arquitectura frontend mantenible.
