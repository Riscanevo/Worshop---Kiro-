import { CartItem, Discount, Product } from '../../types'

export const createCartItem = (product: Product, quantity: number): CartItem => ({
  product,
  quantity,
  subtotal: quantity * product.price,
  discount: 0,
})

export const updateCartItemQuantity = (item: CartItem, quantity: number): CartItem => ({
  ...item,
  quantity,
  subtotal: quantity * item.product.price,
})

export const calculateSubtotal = (cart: CartItem[]): number => {
  return cart.reduce((sum, item) => sum + item.subtotal, 0)
}

export const calculateTaxTotal = (cart: CartItem[]): number => {
  return cart.reduce((sum, item) => sum + item.subtotal * item.product.taxRate, 0)
}

export const calculateDiscountTotal = (
  discount: Discount | null,
  subtotal: number,
  taxTotal: number,
): number => {
  if (!discount) return 0

  const rawDiscount =
    discount.type === 'percentage' ? subtotal * (discount.value / 100) : discount.value

  const maxDiscount = subtotal + taxTotal
  return Math.min(Math.max(0, rawDiscount), maxDiscount)
}

export const calculateTotal = (
  subtotal: number,
  taxTotal: number,
  discountTotal: number,
): number => {
  return subtotal + taxTotal - discountTotal
}

export const calculateCartCount = (cart: CartItem[]): number => {
  return cart.reduce((sum, item) => sum + item.quantity, 0)
}
