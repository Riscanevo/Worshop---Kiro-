import { create } from 'zustand'
import { createTransaction } from '../application/pos/createTransaction'
import {
  calculateCartCount,
  calculateDiscountTotal,
  calculateSubtotal,
  calculateTaxTotal,
  calculateTotal,
  createCartItem,
  updateCartItemQuantity,
} from '../domain/pos/pricing'
import { registerSale } from '../infrastructure/sales/salesRepository'
import { loadPersistedSnapshot, savePersistedSnapshot } from '../infrastructure/storage/posStorage'
import { CartItem, Discount, PaymentDetails, PaymentMethod, Product, Transaction } from '../types'

interface POSState {
  // Cart
  cart: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void

  // Discount
  appliedDiscount: Discount | null
  applyDiscount: (discount: Discount) => void
  removeDiscount: () => void

  // Checkout
  isCheckoutOpen: boolean
  openCheckout: () => void
  closeCheckout: () => void
  processPayment: (method: PaymentMethod, details: PaymentDetails) => Promise<Transaction>

  // Transaction history
  transactions: Transaction[]
  currentReceipt: Transaction | null
  setCurrentReceipt: (transaction: Transaction | null) => void

  // Computed
  getSubtotal: () => number
  getTaxTotal: () => number
  getDiscountTotal: () => number
  getTotal: () => number
  getCartCount: () => number
}

const hydratedSnapshot = loadPersistedSnapshot()

const persistStateFromStore = (get: () => POSState) => {
  const { cart, appliedDiscount, transactions, currentReceipt } = get()
  savePersistedSnapshot({ cart, appliedDiscount, transactions, currentReceipt })
}

export const usePOSStore = create<POSState>((set, get) => ({
  // Cart State
  cart: hydratedSnapshot?.cart ?? [],

  addToCart: (product: Product, quantity: number = 1) => {
    if (quantity <= 0 || product.stock <= 0) return

    set((state) => {
      const existingItem = state.cart.find((item) => item.product.id === product.id)

      if (existingItem) {
        const nextQuantity = Math.min(existingItem.quantity + quantity, existingItem.product.stock)

        return {
          cart: state.cart.map((item) =>
            item.product.id === product.id ? updateCartItemQuantity(item, nextQuantity) : item,
          ),
        }
      }

      const initialQuantity = Math.min(quantity, product.stock)

      return {
        cart: [...state.cart, createCartItem(product, initialQuantity)],
      }
    })

    persistStateFromStore(get)
  },

  removeFromCart: (productId: string) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== productId),
    }))

    persistStateFromStore(get)
  },

  updateQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeFromCart(productId)
      return
    }

    set((state) => ({
      cart: state.cart.map((item) => {
        if (item.product.id !== productId) return item

        const nextQuantity = Math.min(quantity, item.product.stock)
        return updateCartItemQuantity(item, nextQuantity)
      }),
    }))

    persistStateFromStore(get)
  },

  clearCart: () => {
    set({ cart: [], appliedDiscount: null })
    persistStateFromStore(get)
  },

  // Discount State
  appliedDiscount: hydratedSnapshot?.appliedDiscount ?? null,

  applyDiscount: (discount: Discount) => {
    set({ appliedDiscount: discount })
    persistStateFromStore(get)
  },

  removeDiscount: () => {
    set({ appliedDiscount: null })
    persistStateFromStore(get)
  },

  // Checkout State
  isCheckoutOpen: false,

  openCheckout: () => set({ isCheckoutOpen: true }),

  closeCheckout: () => set({ isCheckoutOpen: false }),

  processPayment: async (method: PaymentMethod, details: PaymentDetails): Promise<Transaction> => {
    const { cart, appliedDiscount } = get()

    const transaction = createTransaction({
      cart,
      appliedDiscount,
      method,
      details,
      cashier: 'Cajero 1',
    })

    const saleResponse = await registerSale(transaction)

    const confirmedTransaction: Transaction = {
      ...transaction,
      id: saleResponse.ventaId,
      total: saleResponse.total,
    }

    set((state) => ({
      transactions: [...state.transactions, confirmedTransaction],
      currentReceipt: confirmedTransaction,
      cart: [],
      appliedDiscount: null,
      isCheckoutOpen: false,
    }))

    persistStateFromStore(get)
    return confirmedTransaction
  },

  // Transaction History
  transactions: hydratedSnapshot?.transactions ?? [],
  currentReceipt: hydratedSnapshot?.currentReceipt ?? null,
  setCurrentReceipt: (transaction) => {
    set({ currentReceipt: transaction })
    persistStateFromStore(get)
  },

  // Computed Values
  getSubtotal: () => {
    return calculateSubtotal(get().cart)
  },

  getTaxTotal: () => {
    return calculateTaxTotal(get().cart)
  },

  getDiscountTotal: () => {
    const state = get()
    const subtotal = calculateSubtotal(state.cart)
    const taxTotal = calculateTaxTotal(state.cart)
    return calculateDiscountTotal(state.appliedDiscount, subtotal, taxTotal)
  },

  getTotal: () => {
    const state = get()
    const subtotal = calculateSubtotal(state.cart)
    const taxTotal = calculateTaxTotal(state.cart)
    const discountTotal = calculateDiscountTotal(state.appliedDiscount, subtotal, taxTotal)
    return calculateTotal(subtotal, taxTotal, discountTotal)
  },

  getCartCount: () => {
    return calculateCartCount(get().cart)
  },
}))
