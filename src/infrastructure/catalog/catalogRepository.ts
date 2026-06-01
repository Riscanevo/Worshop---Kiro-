import { buildApiUrl } from '../../config/api'
import { categories } from '../../data/categories'
import { CategoryInfo, Product, ProductCategory } from '../../types'

interface SearchProductsInput {
  searchTerm: string
  category: ProductCategory | 'all'
}

export const getCategories = (): CategoryInfo[] => categories

type RawProduct = Partial<Product> & {
  _id?: string | number
  nombre?: string
  codigo?: string
  codigoBarras?: string
  precio?: number | string
  categoria?: ProductCategory
  imagen?: string
  existencia?: number | string
  tasaImpuesto?: number | string
  iva?: number | string
}

type ProductApiResponse = RawProduct[] | { productos?: RawProduct[]; data?: RawProduct[] }

const normalizeProduct = (product: RawProduct): Product => ({
  id: String(product.id ?? product._id ?? product.barcode ?? product.codigoBarras ?? ''),
  name: String(product.name ?? product.nombre ?? ''),
  barcode: String(product.barcode ?? product.codigoBarras ?? product.codigo ?? ''),
  price: Number(product.price ?? product.precio ?? 0),
  category: product.category ?? product.categoria ?? 'snacks',
  image: String(product.image ?? product.imagen ?? ''),
  stock: Number(product.stock ?? product.existencia ?? 0),
  unit: product.unit ?? 'unidad',
  taxRate: Number(product.taxRate ?? product.tasaImpuesto ?? product.iva ?? 0),
})

export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(buildApiUrl('/productos'))

  if (!response.ok) {
    let message = 'No se pudieron cargar los productos'
    try {
      const errorBody = await response.json() as { message?: string }
      if (errorBody.message) message = errorBody.message
    } catch {
      // ignore if body is not JSON
    }
    throw new Error(message)
  }

  const payload = (await response.json()) as ProductApiResponse
  const productList = Array.isArray(payload) ? payload : payload.productos ?? payload.data ?? []

  return productList.map((product) => normalizeProduct(product))
}

export const findProductByBarcode = (products: Product[], barcode: string): Product | undefined => {
  return products.find((product) => product.barcode === barcode)
}

export const findCategoryById = (categoryId: ProductCategory): CategoryInfo | undefined => {
  return categories.find((category) => category.id === categoryId)
}

export const searchProducts = (
  products: Product[],
  { searchTerm, category }: SearchProductsInput,
): Product[] => {
  const normalizedSearch = searchTerm.trim().toLowerCase()

  return products.filter((product) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      product.name.toLowerCase().includes(normalizedSearch) ||
      product.barcode.includes(normalizedSearch)

    const matchesCategory = category === 'all' || product.category === category

    return matchesSearch && matchesCategory
  })
}
