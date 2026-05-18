# POS Frontend Requirements

## Scope
Build a supermarket Point of Sale (POS) frontend that allows a cashier to search products, scan barcodes, manage a cart, apply discounts and taxes, complete checkout, and generate a digital receipt. Core operations must work without backend connectivity.

## Actors
- Cashier
- Store Supervisor (configures discounts, not implemented as separate UI role)

## Functional Requirements

### FR-1 Product Search and Browsing
As a cashier, I want to find products quickly by name and category.

Acceptance criteria:
- The app shows a product catalog with cards and category filters.
- Typing in the search field filters products by product name.
- Category selection filters products by category.
- Search and category filters can be combined.

### FR-2 Barcode Scanning
As a cashier, I want to add products using barcode scanning.

Acceptance criteria:
- Manual barcode entry is available and pressing Enter adds the product when found.
- Camera-based scan can be opened from the scanner action button.
- If a barcode is detected from camera, the product is added automatically.
- If camera APIs are unavailable, the app informs the user and keeps manual entry available.

### FR-3 Cart Management
As a cashier, I want to build and edit a cart before checkout.

Acceptance criteria:
- Products can be added from catalog and from barcode scanning.
- Quantities can be increased/decreased per item.
- Removing an item updates totals in real time.
- Cart count and subtotal reflect current state.

### FR-4 Discounts and Taxes
As a cashier, I want discounts and taxes calculated accurately.

Acceptance criteria:
- A discount can be selected and applied to the cart.
- Percentage and fixed discounts are supported.
- Tax is calculated by line item tax rate.
- Total = subtotal + tax - discount.

### FR-5 Checkout and Payments
As a cashier, I want to close sales with common payment methods.

Acceptance criteria:
- Checkout supports at least cash and card.
- Cash payment validates paid amount and calculates change.
- Card payment captures last four digits.
- Completing payment creates a transaction with timestamp and receipt number.

### FR-6 Digital Receipt
As a cashier, I want a clear receipt I can show to the customer.

Acceptance criteria:
- Receipt shows line items, quantities, subtotal, tax, discount, and final total.
- Receipt includes payment method and payment-specific details.
- Receipt includes generated receipt number and transaction date/time.

### FR-7 Offline Core Operation
As a cashier, I want essential POS actions to work offline.

Acceptance criteria:
- Product data is locally available without live API calls.
- Search, filtering, barcode manual entry, and cart operations do not depend on network.
- If external assets fail (e.g., product images), the UI still allows checkout workflow.

## Non-Functional Requirements
- NFR-1 Performance: interaction updates should feel instant for a catalog of at least 200 products.
- NFR-2 Usability: cashier can complete a simple transaction in less than 60 seconds after onboarding.
- NFR-3 Maintainability: business logic centralized in store/actions with typed contracts.
- NFR-4 Reliability: invalid operations show friendly feedback via toast notifications.
