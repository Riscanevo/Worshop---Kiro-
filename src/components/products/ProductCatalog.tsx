import { useState, useMemo, RefObject } from 'react'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { ProductCategory } from '../../types'
import CategoryFilter from './CategoryFilter'
import ProductGrid from './ProductGrid'
import BarcodeScanner from './BarcodeScanner'
import { usePOSStore } from '../../store/posStore'
import {
  findProductByBarcode,
  getCategories,
  searchProducts,
} from '../../infrastructure/catalog/catalogRepository'

interface ProductCatalogProps {
  toast: RefObject<Toast | null>
}

export default function ProductCatalog({ toast }: ProductCatalogProps) {
  const categories = getCategories()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all')
  const [barcodeInput, setBarcodeInput] = useState('')
  const { addToCart } = usePOSStore()

  const filteredProducts = useMemo(() => {
    return searchProducts({
      searchTerm,
      category: selectedCategory,
    })
  }, [searchTerm, selectedCategory])

  const handleBarcodeSubmit = (barcode: string) => {
    const product = findProductByBarcode(barcode)
    if (product) {
      addToCart(product)
      toast.current?.show({
        severity: 'success',
        summary: 'Producto agregado',
        detail: `${product.name} agregado al carrito`,
        life: 2000,
      })
      setBarcodeInput('')
    } else {
      toast.current?.show({
        severity: 'warn',
        summary: 'Producto no encontrado',
        detail: `No se encontro producto con codigo: ${barcode}`,
        life: 3000,
      })
    }
  }

  return (
    <div className="flex flex-column h-full gap-3">
      {/* Search and Barcode Section */}
      <div
        className="pos-catalog-controls flex gap-3 p-3"
        style={{
          backgroundColor: 'var(--pos-bg-secondary)',
          borderRadius: '16px',
          border: '1px solid var(--pos-border)',
        }}
      >
        <div className="flex-1">
          <span className="p-input-icon-left w-full">
            <i className="pi pi-search" style={{ left: '1rem', marginTop: '-0.52rem' }} />
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar productos por nombre..."
              aria-label="Buscar productos por nombre o codigo"
              className="w-full"
              style={{
                paddingLeft: '2.5rem',
                backgroundColor: 'var(--pos-bg-tertiary)',
                border: '1px solid var(--pos-border)',
                borderRadius: '12px',
                height: '48px',
              }}
            />
          </span>
        </div>

        <BarcodeScanner
          value={barcodeInput}
          onChange={setBarcodeInput}
          onSubmit={handleBarcodeSubmit}
          onCameraError={(message) =>
            toast.current?.show({
              severity: 'warn',
              summary: 'Escaner no disponible',
              detail: message,
              life: 3000,
            })
          }
        />
      </div>

      {/* Categories */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Products Grid */}
      <div className="flex-1 overflow-auto">
        <ProductGrid products={filteredProducts} toast={toast} />
      </div>

      {/* Product Count */}
      <div
        className="flex align-items-center justify-content-between px-3 py-2"
        style={{
          backgroundColor: 'var(--pos-bg-secondary)',
          borderRadius: '12px',
          border: '1px solid var(--pos-border)',
        }}
      >
        <span style={{ color: 'var(--pos-text-secondary)' }}>
          <i className="pi pi-box mr-2"></i>
          {filteredProducts.length} productos encontrados
        </span>
        {selectedCategory !== 'all' && (
          <button
            type="button"
            className="cursor-pointer text-sm border-none"
            style={{ color: 'var(--pos-accent)', backgroundColor: 'transparent' }}
            onClick={() => setSelectedCategory('all')}
          >
            <i className="pi pi-times mr-1"></i>
            Limpiar filtro
          </button>
        )}
      </div>
    </div>
  )
}
