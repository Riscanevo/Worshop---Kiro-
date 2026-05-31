import { useState, useMemo, RefObject, useEffect } from 'react'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { Product, ProductCategory } from '../../../types'
import CategoryFilter from './CategoryFilter'
import ProductGrid from './ProductGrid'
import BarcodeScanner from './BarcodeScanner'
import { usePOSStore } from '../../../store/posStore'
import {
  findProductByBarcode,
  getCategories,
  getProducts,
  searchProducts,
} from '../../../infrastructure/catalog/catalogRepository'

interface ProductCatalogProps {
  toast: RefObject<Toast | null>
}

export default function ProductCatalog({ toast }: ProductCatalogProps) {
  const categories = getCategories()
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all')
  const [barcodeInput, setBarcodeInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const { addToCart } = usePOSStore()

  const loadProducts = async () => {
    setIsLoading(true)
    setLoadError(null)

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
  }

  useEffect(() => {
    let isActive = true

    void getProducts()
      .then((nextProducts) => {
        if (isActive) setProducts(nextProducts)
      })
      .catch((error: unknown) => {
        if (!isActive) return

        const message = error instanceof Error ? error.message : 'Error cargando productos'
        setLoadError(message)
        toast.current?.show({
          severity: 'error',
          summary: 'Error de API',
          detail: message,
          life: 4000,
        })
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [toast])

  const filteredProducts = useMemo(() => {
    return searchProducts(products, { searchTerm, category: selectedCategory })
  }, [products, searchTerm, selectedCategory])

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

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="flex-1 overflow-auto">
        {isLoading ? (
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
              onClick={() => {
                void loadProducts()
              }}
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
          {isLoading ? 'Cargando productos...' : `${filteredProducts.length} productos encontrados`}
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
