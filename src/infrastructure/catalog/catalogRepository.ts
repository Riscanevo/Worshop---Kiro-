import { categories, products } from '../../data/products'
import { CategoryInfo, Product, ProductCategory } from '../../types'

interface SearchProductsInput {
  searchTerm: string
  category: ProductCategory | 'all'
}

export const getCategories = (): CategoryInfo[] => categories

export const getProducts = (): Product[] => products

export const findProductByBarcode = (barcode: string): Product | undefined => {
  return products.find((product) => product.barcode === barcode)
}

export const findCategoryById = (categoryId: ProductCategory): CategoryInfo | undefined => {
  return categories.find((category) => category.id === categoryId)
}

export const searchProducts = ({ searchTerm, category }: SearchProductsInput): Product[] => {
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
