import { KeyboardEvent, RefObject, useState } from 'react'
import { Toast } from 'primereact/toast'
import { Badge } from 'primereact/badge'
import { Product } from '../../../types'
import { usePOSStore } from '../../../store/posStore'
import { formatCurrency } from '../../../lib/currency'
import { findCategoryById } from '../../../infrastructure/catalog/catalogRepository'

interface ProductCardProps {
  product: Product
  toast: RefObject<Toast | null>
}

export default function ProductCard({ product, toast }: ProductCardProps) {
  const { addToCart } = usePOSStore()
  const [isAdding, setIsAdding] = useState(false)
  const [imgError, setImgError] = useState(false)

  const category = findCategoryById(product.category)

  const handleAddToCart = () => {
    setIsAdding(true)
    addToCart(product)

    toast.current?.show({
      severity: 'success',
      summary: 'Agregado',
      detail: `${product.name} agregado al carrito`,
      life: 1500,
    })

    setTimeout(() => setIsAdding(false), 300)
  }

  const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleAddToCart()
    }
  }

  return (
    <article
      className={`flex flex-column cursor-pointer transition-all transition-duration-200 ${isAdding ? 'animate-slide-in' : ''}`}
      style={{
        backgroundColor: 'var(--pos-bg-secondary)',
        borderRadius: '16px',
        border: '1px solid var(--pos-border)',
        overflow: 'hidden',
        transform: isAdding ? 'scale(0.95)' : 'scale(1)',
      }}
      tabIndex={0}
      role="button"
      aria-label={`Agregar ${product.name} al carrito`}
      onClick={handleAddToCart}
      onKeyDown={handleCardKeyDown}
    >
      {/* Image Section */}
      <div
        className="relative flex align-items-center justify-content-center"
        style={{
          height: '140px',
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
            className="pi pi-image text-4xl"
            style={{ color: 'var(--pos-text-secondary)', opacity: 0.5 }}
          ></i>
        )}

        {product.stock < 20 && (
          <Badge
            value={`${product.stock} uds`}
            severity={product.stock < 10 ? 'danger' : 'warning'}
            style={{ position: 'absolute', top: '8px', right: '8px' }}
          />
        )}

        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            backgroundColor: category?.color || 'var(--pos-accent)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '0.7rem',
            fontWeight: 600,
          }}
        >
          <i className={`${category?.icon} mr-1`} style={{ fontSize: '0.65rem' }}></i>
          {category?.name}
        </div>
      </div>

      {/* Info Section */}
      <div className="flex flex-column p-3 gap-2">
        <h3
          className="m-0 text-sm font-semibold line-clamp-2"
          style={{ color: 'var(--pos-text-primary)', lineHeight: '1.3', minHeight: '2.6em' }}
        >
          {product.name}
        </h3>

        <div className="flex align-items-center justify-content-between mt-auto">
          <div>
            <span className="text-xl font-bold" style={{ color: 'var(--pos-accent)' }}>
              {formatCurrency(product.price)}
            </span>
            <span className="text-xs ml-1" style={{ color: 'var(--pos-text-secondary)' }}>
              / {product.unit}
            </span>
          </div>

          <button
            type="button"
            aria-label={`Agregar ${product.name}`}
            className="flex align-items-center justify-content-center border-none cursor-pointer transition-all transition-duration-200"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'var(--pos-accent)',
              color: 'white',
            }}
            onClick={(e) => {
              e.stopPropagation()
              handleAddToCart()
            }}
          >
            <i className="pi pi-plus"></i>
          </button>
        </div>

        <div
          className="flex align-items-center gap-1 text-xs"
          style={{ color: 'var(--pos-text-secondary)' }}
        >
          <i className="pi pi-barcode"></i>
          <span>{product.barcode}</span>
        </div>
      </div>
    </article>
  )
}
