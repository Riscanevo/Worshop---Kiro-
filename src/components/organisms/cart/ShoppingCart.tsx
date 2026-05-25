import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { usePOSStore } from '../../../store/posStore'
import CartItem from '../../molecules/cart/CartItem'
import CartSummary from './CartSummary'
import DiscountInput from '../../molecules/cart/DiscountInput'

export default function ShoppingCart() {
  const { cart, clearCart, getCartCount, openCheckout } = usePOSStore()

  const isEmpty = cart.length === 0

  return (
    <div
      className="pos-shopping-cart flex flex-column h-full"
      style={{
        backgroundColor: 'var(--pos-bg-secondary)',
        borderRadius: '20px',
        border: '1px solid var(--pos-border)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        className="flex align-items-center justify-content-between p-4"
        style={{ borderBottom: '1px solid var(--pos-border)' }}
      >
        <div className="flex align-items-center gap-3">
          <div
            className="flex align-items-center justify-content-center"
            style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--pos-accent)' }}
          >
            <i className="pi pi-shopping-cart text-white text-lg"></i>
          </div>
          <div>
            <h2 className="m-0 text-lg font-bold" style={{ color: 'var(--pos-text-primary)' }}>
              Carrito de Compras
            </h2>
            <p className="m-0 text-sm" style={{ color: 'var(--pos-text-secondary)' }}>
              {getCartCount()} {getCartCount() === 1 ? 'producto' : 'productos'}
            </p>
          </div>
        </div>

        {!isEmpty && (
          <Button
            icon="pi pi-trash"
            className="p-button-text p-button-danger p-button-sm"
            tooltip="Vaciar carrito"
            tooltipOptions={{ position: 'left' }}
            onClick={clearCart}
            style={{ borderRadius: '10px' }}
          />
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-auto p-3" style={{ minHeight: 0 }}>
        {isEmpty ? (
          <div
            className="flex flex-column align-items-center justify-content-center h-full"
            style={{ color: 'var(--pos-text-secondary)' }}
          >
            <i className="pi pi-shopping-cart text-6xl mb-4" style={{ opacity: 0.2 }}></i>
            <p className="text-lg font-semibold m-0">Carrito vacio</p>
            <p className="text-sm mt-2">Agrega productos para comenzar</p>
          </div>
        ) : (
          <div className="flex flex-column gap-2">
            {cart.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {!isEmpty && (
        <div
          className="flex flex-column p-4"
          style={{ borderTop: '1px solid var(--pos-border)', backgroundColor: 'var(--pos-bg-tertiary)' }}
        >
          <DiscountInput />
          <Divider className="my-3" style={{ borderColor: 'var(--pos-border)' }} />
          <CartSummary />
          <Button
            label="Procesar Pago"
            className="w-full mt-4"
            style={{
              height: '50px',
              fontSize: '1.1rem',
              fontWeight: 700,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--pos-success) 0%, #16a34a 100%)',
              border: 'none',
            }}
            onClick={openCheckout}
          />
          <div
            className="flex align-items-center justify-content-center gap-3 mt-3"
            style={{ color: 'var(--pos-text-secondary)' }}
          >
            <span className="flex align-items-center gap-1 text-xs">
              <i className="pi pi-lock"></i>
              Pago seguro
            </span>
            <span className="flex align-items-center gap-1 text-xs">
              <i className="pi pi-shield"></i>
              Datos protegidos
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
