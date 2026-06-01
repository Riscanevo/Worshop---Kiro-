import { Suspense, lazy, useRef, useEffect, useCallback } from 'react'
import { Toast } from 'primereact/toast'
import { usePOSStore } from '../../store/posStore'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../templates/MainLayout'
import KeyboardShortcutsPanel from '../organisms/KeyboardShortcutsPanel'
import type { BarcodeScannerHandle } from '../organisms/products/BarcodeScanner'

const ProductCatalog = lazy(() => import('../organisms/products/ProductCatalog'))
const ShoppingCart = lazy(() => import('../organisms/cart/ShoppingCart'))
const CheckoutDialog = lazy(() => import('../organisms/checkout/CheckoutDialog'))
const ReceiptDialog = lazy(() => import('../organisms/checkout/ReceiptDialog'))

export default function POSPage() {
  const toast = useRef<Toast>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const barcodeScannerRef = useRef<BarcodeScannerHandle>(null)
  const { currentReceipt, setCurrentReceipt, isCheckoutOpen, clearCart, removeFromCart, cart, openCheckout } = usePOSStore()
  const { logout } = useAuthStore()
  const navigate = useNavigate()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Prevent default browser behavior for F-keys
      const fKeys = ['F1', 'F2', 'F3', 'F4', 'F5', 'F8', 'F9']
      if (fKeys.includes(e.key)) {
        e.preventDefault()
      }

      switch (e.key) {
        case 'F1':
          // Focus search input
          searchInputRef.current?.focus()
          break

        case 'F4':
          // Open camera barcode scanner
          barcodeScannerRef.current?.openCamera()
          break

        case 'F2':
          // Remove last item from cart
          if (cart.length > 0) {
            const lastItem = cart[cart.length - 1]
            removeFromCart(lastItem.product.id)
            toast.current?.show({
              severity: 'info',
              summary: 'Producto eliminado',
              detail: `${lastItem.product.name} eliminado del carrito`,
              life: 2000,
            })
          }
          break

        case 'F3':
          // Clear cart
          if (cart.length > 0) {
            clearCart()
            toast.current?.show({
              severity: 'info',
              summary: 'Carrito limpiado',
              detail: 'Se eliminaron todos los productos',
              life: 2000,
            })
          }
          break

        case 'F5':
          // Open checkout / cobrar
          if (cart.length > 0 && !isCheckoutOpen) {
            openCheckout()
          }
          break

        case 'F8':
          // Nueva venta — clear cart and close receipt
          clearCart()
          setCurrentReceipt(null)
          toast.current?.show({
            severity: 'info',
            summary: 'Nueva venta',
            detail: 'Carrito listo para nueva venta',
            life: 2000,
          })
          break

        case 'F9':
          // Logout
          logout()
          void navigate('/login')
          break

        case 'Escape':
          // Close any open modal
          if (currentReceipt) setCurrentReceipt(null)
          break
      }
    },
    [cart, clearCart, removeFromCart, openCheckout, isCheckoutOpen, currentReceipt, setCurrentReceipt, logout, navigate],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <MainLayout>
      <Toast ref={toast} position="top-right" />

      <div className="flex flex-column flex-1 overflow-hidden" style={{ height: '100%' }}>
        <div className="pos-main-layout flex flex-1 overflow-hidden gap-3 p-3">
          <Suspense fallback={null}>
            <section className="pos-catalog-panel flex-1 overflow-hidden">
              <ProductCatalog toast={toast} searchInputRef={searchInputRef} barcodeScannerRef={barcodeScannerRef} />
            </section>

            <aside className="pos-cart-panel">
              <ShoppingCart />
            </aside>
          </Suspense>
        </div>

        {/* Footer de atajos de teclado */}
        <KeyboardShortcutsPanel />
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
