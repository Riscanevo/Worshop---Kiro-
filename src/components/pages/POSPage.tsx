import { Suspense, lazy, useRef } from 'react'
import { Toast } from 'primereact/toast'
import { usePOSStore } from '../../store/posStore'
import MainLayout from '../templates/MainLayout'

const ProductCatalog = lazy(() => import('../organisms/products/ProductCatalog'))
const ShoppingCart = lazy(() => import('../organisms/cart/ShoppingCart'))
const CheckoutDialog = lazy(() => import('../organisms/checkout/CheckoutDialog'))
const ReceiptDialog = lazy(() => import('../organisms/checkout/ReceiptDialog'))

export default function POSPage() {
  const toast = useRef<Toast>(null)
  const { currentReceipt, setCurrentReceipt, isCheckoutOpen } = usePOSStore()

  return (
    <MainLayout>
      <Toast ref={toast} position="top-right" />

      <div className="pos-main-layout flex flex-1 overflow-hidden gap-3 p-3" style={{ height: '100%' }}>
        <Suspense fallback={null}>
          <section className="pos-catalog-panel flex-1 overflow-hidden">
            <ProductCatalog toast={toast} />
          </section>

          <aside className="pos-cart-panel">
            <ShoppingCart />
          </aside>
        </Suspense>
      </div>

      {isCheckoutOpen && (
        <Suspense fallback={null}>
          <CheckoutDialog toast={toast} />
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
    </MainLayout>
  )
}
