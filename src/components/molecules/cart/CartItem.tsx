import { Button } from 'primereact/button'
import { InputNumber } from 'primereact/inputnumber'
import { CartItem as CartItemType } from '../../../types'
import { usePOSStore } from '../../../store/posStore'
import { useState } from 'react'
import { formatCurrency } from '../../../lib/currency'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = usePOSStore()
  const [imgError, setImgError] = useState(false)
  const { product, quantity, subtotal } = item

  return (
    <div
      className="flex align-items-center gap-3 p-3 animate-slide-in"
      style={{
        backgroundColor: 'var(--pos-bg-secondary)',
        borderRadius: '12px',
        border: '1px solid var(--pos-border)',
      }}
    >
      {/* Product Image */}
      <div
        className="flex align-items-center justify-content-center flex-shrink-0"
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '10px',
          backgroundColor: 'var(--pos-bg-tertiary)',
          overflow: 'hidden',
        }}
      >
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full"
            style={{ objectFit: 'cover' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <i
            className="pi pi-image text-xl"
            style={{ color: 'var(--pos-text-secondary)', opacity: 0.5 }}
          ></i>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h4
          className="m-0 text-sm font-semibold white-space-nowrap overflow-hidden text-overflow-ellipsis"
          style={{ color: 'var(--pos-text-primary)' }}
        >
          {product.name}
        </h4>
        <p className="m-0 text-xs mt-1" style={{ color: 'var(--pos-text-secondary)' }}>
          {formatCurrency(product.price)} / {product.unit}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex align-items-center gap-2">
        <Button
          icon="pi pi-minus"
          className="p-button-text p-button-sm"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'var(--pos-bg-tertiary)',
            color: 'var(--pos-text-primary)',
          }}
          onClick={() => updateQuantity(product.id, quantity - 1)}
        />

        <InputNumber
          value={quantity}
          onValueChange={(e) => updateQuantity(product.id, e.value || 1)}
          min={1}
          max={product.stock}
          inputStyle={{
            width: '50px',
            textAlign: 'center',
            backgroundColor: 'var(--pos-bg-tertiary)',
            border: '1px solid var(--pos-border)',
            borderRadius: '8px',
            color: 'var(--pos-text-primary)',
          }}
        />

        <Button
          icon="pi pi-plus"
          className="p-button-text p-button-sm"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'var(--pos-bg-tertiary)',
            color: 'var(--pos-text-primary)',
          }}
          onClick={() => updateQuantity(product.id, quantity + 1)}
          disabled={quantity >= product.stock}
        />
      </div>

      {/* Subtotal and Remove */}
      <div className="flex flex-column align-items-end gap-2">
        <span className="font-bold" style={{ color: 'var(--pos-accent)' }}>
          {formatCurrency(subtotal)}
        </span>

        <Button
          icon="pi pi-times"
          className="p-button-text p-button-danger p-button-sm"
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
          }}
          onClick={() => removeFromCart(product.id)}
        />
      </div>
    </div>
  )
}
