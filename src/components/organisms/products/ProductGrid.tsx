import { RefObject } from 'react'
import { Toast } from 'primereact/toast'
import { Product } from '../../../types'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
  toast: RefObject<Toast | null>
}

export default function ProductGrid({ products, toast }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div
        className="flex flex-column align-items-center justify-content-center h-full"
        style={{ color: 'var(--pos-text-secondary)' }}
      >
        <i className="pi pi-search text-6xl mb-4" style={{ opacity: 0.3 }}></i>
        <p className="text-xl font-semibold">No se encontraron productos</p>
        <p className="text-sm">Intenta con otra busqueda o categoria</p>
      </div>
    )
  }

  return (
    <div
      className="grid gap-3"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        padding: '4px',
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} toast={toast} />
      ))}
    </div>
  )
}
