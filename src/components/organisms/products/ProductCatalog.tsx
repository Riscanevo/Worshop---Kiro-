import { useState, useMemo, RefObject, useRef, useCallback } from 'react'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { Product, ProductCategory } from '../../../types'
import CategoryFilter from './CategoryFilter'
import ProductGrid from './ProductGrid'
import BarcodeScanner, { BarcodeScannerHandle } from './BarcodeScanner'
import { usePOSStore } from '../../../store/posStore'
import {
  findProductByBarcode,
  getCategories,
  getProducts,
  searchProducts,
} from '../../../infrastructure/catalog/catalogRepository'

interface ProductCatalogProps {
  toast: RefObject<Toast | null>
  searchInputRef?: RefObject<HTMLInputElement | null>
  barcodeScannerRef?: RefObject<BarcodeScannerHandle | null>
}

export default function ProductCatalog({ toast, searchInputRef: externalRef, barcodeScannerRef }: ProductCatalogProps) {
  const categories = getCategories()
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [committedSearch, setCommittedSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all')
  const [barcodeInput, setBarcodeInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const internalRef = useRef<HTMLInputElement>(null)
  const searchInputRef = externalRef ?? internalRef
  const { addToCart } = usePOSStore()

  const loadProducts = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    setHasSearched(true)

    try {
      setProducts(await getProducts())
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error cargando productos'
      setLoadError(message)
      toast.current?.show({
        severity: 'error',
        summary: 'Error de API',
        detail: message,
        life: 4000,
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const handleSearch = useCallback(() => {
    setCommittedSearch(searchTerm)
    if (products.length === 0) {
      void loadProducts()
    }
  }, [searchTerm, products.length, loadProducts])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSearch()
      }
    },
    [handleSearch],
  )

  const filteredProducts = useMemo(() => {
    return searchProducts(products, { searchTerm: committedSearch, category: selectedCategory })
  }, [products, committedSearch, selectedCategory])

  const handleBarcodeSubmit = (barcode: string) => {
    const product = findProductByBarcode(products, barcode)
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
      <div
        className="pos-catalog-controls flex gap-3 p-3"
        style={{
          backgroundColor: 'var(--pos-bg-secondary)',
          borderRadius: '16px',
          border: '1px solid var(--pos-border)',
        }}
      >
        <div className="flex-1 flex gap-2">
          <span className="p-input-icon-left flex-1">
            <i className="pi pi-search" style={{ left: '1rem', marginTop: '-0.52rem' }} />
            <InputText
              ref={searchInputRef as RefObject<HTMLInputElement>}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar productos por nombre... (Enter para buscar)"
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
          <button
            type="button"
            onClick={handleSearch}
            style={{
              height: '48px',
              padding: '0 1.25rem',
              backgroundColor: 'var(--pos-accent)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
            }}
          >
            <i className="pi pi-search"></i>
            Buscar
          </button>
        </div>

        <BarcodeScanner
          ref={barcodeScannerRef}
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

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="flex-1 overflow-auto">
        {!hasSearched ? (
          <div
            className="flex flex-column align-items-center justify-content-center h-full gap-3"
            style={{ color: 'var(--pos-text-secondary)' }}
          >
            <i className="pi pi-search text-5xl" style={{ opacity: 0.15 }}></i>
            <p className="text-lg font-semibold m-0" style={{ opacity: 0.4 }}>Busca un producto para comenzar</p>
          </div>
        ) : isLoading ? (
          <div
            className="flex flex-column align-items-center justify-content-center h-full"
            style={{ color: 'var(--pos-text-secondary)' }}
          >
            <i className="pi pi-spin pi-spinner text-5xl mb-3"></i>
            <p className="text-lg font-semibold m-0">Cargando productos...</p>
          </div>
        ) : loadError ? (
          <div
            className="flex flex-column align-items-center justify-content-center h-full gap-3"
            style={{ color: 'var(--pos-text-secondary)' }}
          >
            <i className="pi pi-exclamation-triangle text-5xl" style={{ color: 'var(--pos-danger)' }}></i>
            <p className="text-lg font-semibold m-0">No se pudieron cargar los productos</p>
            <button
              type="button"
              className="cursor-pointer border-none px-4 py-2 font-semibold"
              style={{ backgroundColor: 'var(--pos-accent)', color: 'white', borderRadius: '10px' }}
              onClick={() => { void loadProducts() }}
            >
              Reintentar
            </button>
          </div>
        ) : (
          <ProductGrid products={filteredProducts} toast={toast} />
        )}
      </div>

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
          {!hasSearched
            ? 'Ingresa un término de búsqueda'
            : isLoading
              ? 'Cargando productos...'
              : `${filteredProducts.length} productos encontrados`}
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
