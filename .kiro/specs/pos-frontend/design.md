# POS Frontend Design

## Tech Stack
- React + TypeScript
- Vite
- Zustand for state management
- PrimeReact + PrimeFlex for UI

## Architecture
Single-page frontend with local in-memory state. Product data comes from a local static module.

Layers:
1. Presentation layer (`src/components/**`)
2. State/business layer (`src/store/posStore.ts`)
3. Domain types (`src/types/index.ts`)
4. Local data source (`src/data/products.ts`)

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
1. User searches/selects category -> catalog filtering in component state.
2. User adds product -> `addToCart` store action.
3. User edits cart -> quantity/remove actions update derived totals.
4. User applies discount -> `applyDiscount`.
5. User checks out -> `processPayment` creates immutable transaction.
6. Receipt dialog reads transaction and renders output.

## Barcode Camera Flow
1. User clicks camera button in `BarcodeScanner`.
2. Component requests `getUserMedia` video stream.
3. If `BarcodeDetector` exists, each animation frame attempts detection.
4. On successful detection, scanner submits barcode and closes camera.
5. On unsupported browser or permission error, toast warning is shown and manual input remains available.

## Offline Strategy
- Product catalog is bundled statically (`products.ts`) with no runtime API dependency.
- Cart and checkout logic are pure client-side computations.
- External product images are non-blocking; failures must not block cart/checkout.

## Error Handling
- Unknown barcode -> warning toast.
- Camera unsupported/permission denied -> warning toast with fallback guidance.
- Invalid payment input -> inline validation in checkout dialog.

## Tradeoffs
- No backend persistence for transactions by design (workshop scope).
- Browser barcode detection depends on client support; fallback is manual barcode entry.
