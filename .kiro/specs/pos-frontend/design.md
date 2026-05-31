# POS Frontend Design

## Tech Stack
- React + TypeScript
- Vite
- Zustand for state management
- PrimeReact + PrimeFlex for UI

## Architecture
Single-page frontend with local cart state and backend-backed product/sales integration. Product data comes from the API Gateway, and completed sales are persisted through the sales API.

Layers:
1. Presentation layer (`src/components/**`)
2. State/business layer (`src/store/posStore.ts`)
3. Domain types (`src/types/index.ts`)
4. API configuration (`src/config/api.ts`)
5. Backend repositories (`src/infrastructure/catalog/catalogRepository.ts`, `src/infrastructure/sales/salesRepository.ts`)

## Component Design

### Product Area
- `ProductCatalog`: orchestrates search, category filter, and barcode add flow.
- `CategoryFilter`: category chip selector.
- `ProductGrid` + `ProductCard`: catalog display and add-to-cart action.
- `BarcodeScanner`: manual barcode input + camera dialog for scanning.

### Cart Area
- `ShoppingCart`: cart container.
- `CartItem`: quantity and removal controls.
- `DiscountInput`: applies discount rule.
- `CartSummary`: computes and displays subtotal/tax/discount/total.

### Checkout Area
- `CheckoutDialog`: payment capture and validation (cash/card).
- `ReceiptDialog`: transaction and receipt visualization.

## State Model
`usePOSStore` handles:
- Cart items and CRUD operations
- Applied discount
- Checkout dialog state
- Payment processing and transaction generation
- Derived totals (subtotal, tax, discount, grand total)

## Data Flow
1. Product catalog loads `GET /productos` through `catalogRepository`.
2. User searches/selects category -> catalog filtering in component state.
3. User adds product -> `addToCart` store action.
4. User edits cart -> quantity/remove actions update derived totals.
5. User applies discount -> `applyDiscount`.
6. User checks out -> `processPayment` creates immutable transaction and registers it with `POST /ventas`.
7. Receipt dialog reads transaction and renders output after the backend confirms the sale.

## Barcode Camera Flow
1. User clicks camera button in `BarcodeScanner`.
2. Component requests `getUserMedia` video stream.
3. If `BarcodeDetector` exists, each animation frame attempts detection.
4. On successful detection, scanner submits barcode and closes camera.
5. On unsupported browser or permission error, toast warning is shown and manual input remains available.

## API Strategy
- The API Gateway base URL is centralized in `src/config/api.ts`.
- `VITE_API_BASE_URL` controls the target API environment.
- Product catalog is loaded from `GET /productos`.
- Sales are registered with `POST /ventas`.
- Cart and pricing calculations remain client-side for responsive cashier interaction.
- External product images are non-blocking; failures must not block cart/checkout.

## Error Handling
- Unknown barcode -> warning toast.
- Camera unsupported/permission denied -> warning toast with fallback guidance.
- Invalid payment input -> inline validation in checkout dialog.
- Products API failure -> error toast and retry state.
- Sales API failure -> error toast and cart is preserved.

## Tradeoffs
- Backend must expose `GET /productos` and `POST /ventas`.
- Browser barcode detection depends on client support; fallback is manual barcode entry.
