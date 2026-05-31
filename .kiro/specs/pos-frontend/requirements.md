# POS Frontend Requirements

## Scope
Build a supermarket Point of Sale (POS) frontend that allows a cashier to load products from the backend, search products, scan barcodes, manage a cart, apply discounts and taxes, complete checkout, register sales through the API, and generate a digital receipt.

## Actors
- Cashier
- Store Supervisor (configures discounts, not implemented as separate UI role)

## Functional Requirements

### FR-1 Product Search and Browsing
As a cashier, I want to find products quickly by name and category.

Acceptance criteria:
- The app consumes `GET /productos` from the API Gateway to populate the product catalog.
- The app shows each product with at least name, price, and a selection/add action.
- Typing in the search field filters products by product name.
- Category selection filters products by category.
- Search and category filters can be combined.
- If the products API fails or returns an error status, the app shows a friendly error message and a retry option.

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
- Completing payment registers the sale with `POST /ventas`.
- The sale payload includes selected products, quantities, totals, payment method, timestamp, and receipt number.
- If the sales API succeeds, the app shows a success message and clears the cart.
- If the sales API fails or returns an error status, the app shows an error message and keeps the cart available.

### FR-6 Digital Receipt
As a cashier, I want a clear receipt I can show to the customer.

Acceptance criteria:
- Receipt shows line items, quantities, subtotal, tax, discount, and final total.
- Receipt includes payment method and payment-specific details.
- Receipt includes generated receipt number and transaction date/time.

### FR-7 API Configuration
As a developer, I want the API Gateway base URL to be configurable, so deployments can point to different environments.

Acceptance criteria:
- The API Gateway base URL is defined in a configuration module or environment variable.
- API calls use the shared configuration instead of hardcoding the base URL in each request.
- The frontend supports `VITE_API_BASE_URL` for environment-specific configuration.
- If external assets fail (e.g., product images), the UI still allows checkout workflow.

## Non-Functional Requirements
- NFR-1 Performance: interaction updates should feel instant for a catalog of at least 200 products.
- NFR-2 Usability: cashier can complete a simple transaction in less than 60 seconds after onboarding.
- NFR-3 Maintainability: business logic centralized in store/actions with typed contracts.
- NFR-4 Reliability: invalid operations show friendly feedback via toast notifications.
