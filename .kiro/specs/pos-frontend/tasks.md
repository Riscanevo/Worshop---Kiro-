# POS Frontend Tasks

## Milestone 1 - Spec Foundation
- [x] Create `.kiro/specs/pos-frontend/` folder.
- [x] Define complete `requirements.md` with stories and acceptance criteria.
- [x] Define `design.md` with architecture, components, and data flow.

## Milestone 2 - Product Discovery Experience
- [x] Implement product catalog from `GET /productos`.
- [x] Implement product search by name and barcode text.
- [x] Implement category filter chips.
- [x] Implement product card add-to-cart action.
- [x] Show loading and error states for product API failures.

## Milestone 3 - Barcode Flows
- [x] Implement manual barcode entry and Enter-to-submit.
- [x] Implement camera scanner trigger and dialog UI.
- [x] Integrate browser camera scanning via `BarcodeDetector` when supported.
- [x] Implement graceful fallback and warnings when camera scan is unavailable.

## Milestone 4 - Cart and Pricing
- [x] Implement cart item list with quantity controls and remove action.
- [x] Implement subtotal/tax/discount/total calculations in store.
- [x] Implement discount application UI and store integration.

## Milestone 5 - Checkout and Receipt
- [x] Implement checkout dialog with payment method selection.
- [x] Implement cash validation and change calculation.
- [x] Implement card validation (last four digits).
- [x] Implement transaction creation and sale registration with `POST /ventas`.
- [x] Show success and error messages for sale registration.
- [x] Keep the cart intact when sale registration fails.

## Milestone 6 - Validation and Polish
- [x] Show toasts for success/warning flows.
- [x] Build and compile with TypeScript strict checks.
- [x] Add automated unit tests for pricing and payment edge cases.
- [x] Add optional transaction persistence (localStorage) for session recovery.
- [x] Centralize API Gateway base URL in configuration/env (`VITE_API_BASE_URL`).
- [x] Provide backend seed data for products in `docs/backend-products.json`.
