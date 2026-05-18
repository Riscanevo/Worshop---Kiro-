import { Toast } from 'primereact/toast'
import { Suspense, lazy, useRef } from 'react'
import Header from './components/layout/Header'
import ProductCatalog from './components/products/ProductCatalog'
import ShoppingCart from './components/cart/ShoppingCart'
import { usePOSStore } from './store/posStore'

const CheckoutDialog = lazy(() => import('./components/checkout/CheckoutDialog'))
const ReceiptDialog = lazy(() => import('./components/receipt/ReceiptDialog'))

function App() {
  const toast = useRef<Toast>(null)
  const { currentReceipt, setCurrentReceipt, isCheckoutOpen } = usePOSStore()

  return (
    <div className="flex flex-column h-full" style={{ backgroundColor: 'var(--pos-bg-primary)' }}>
      <Toast ref={toast} position="top-right" />

      <Header />

      <main className="pos-main-layout flex flex-1 overflow-hidden gap-3 p-3">
        <section className="pos-catalog-panel flex-1 overflow-hidden">
          <ProductCatalog toast={toast} />
        </section>

        <aside className="pos-cart-panel">
          <ShoppingCart />
        </aside>
      </main>

      {isCheckoutOpen && (
        <Suspense fallback={null}>
          <CheckoutDialog />
        </Suspense>
      )}

      {currentReceipt && (
        <Suspense fallback={null}>
          <ReceiptDialog
            visible={currentReceipt !== null}
            transaction={currentReceipt}
            onClose={() => setCurrentReceipt(null)}
          />
        </Suspense>
      )}
    </div>
  )
}

export default App
