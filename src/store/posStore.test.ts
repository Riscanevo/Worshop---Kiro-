import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Discount, Product } from '../types'
import { usePOSStore } from './posStore'

vi.mock('uuid', () => ({
  v4: () => 'test-transaction-id',
}))

const productWithTax: Product = {
  id: 'product-1',
  name: 'Leche',
  barcode: '1111',
  price: 10,
  category: 'lacteos',
  image: '',
  stock: 100,
  unit: 'unidad',
  taxRate: 0.16,
}

const productWithoutTax: Product = {
  id: 'product-2',
  name: 'Pan',
  barcode: '2222',
  price: 5,
  category: 'panaderia',
  image: '',
  stock: 100,
  unit: 'unidad',
  taxRate: 0,
}

beforeEach(() => {
  usePOSStore.setState({
    cart: [],
    appliedDiscount: null,
    isCheckoutOpen: false,
    transactions: [],
    currentReceipt: null,
  })
})

describe('usePOSStore pricing', () => {
  it('calculates subtotal, tax, discount and total correctly', () => {
    const store = usePOSStore.getState()
    const percentageDiscount: Discount = {
      id: 'd1',
      name: '10%',
      type: 'percentage',
      value: 10,
    }

    store.addToCart(productWithTax, 2)
    store.addToCart(productWithoutTax, 1)
    store.applyDiscount(percentageDiscount)

    expect(store.getSubtotal()).toBe(25)
    expect(store.getTaxTotal()).toBe(3.2)
    expect(store.getDiscountTotal()).toBe(2.5)
    expect(store.getTotal()).toBeCloseTo(25.7, 5)
  })

  it('clamps fixed discount so total never goes below zero', () => {
    const store = usePOSStore.getState()
    const fixedDiscount: Discount = {
      id: 'd2',
      name: 'Huge',
      type: 'fixed',
      value: 1000,
    }

    store.addToCart(productWithTax, 1)
    store.applyDiscount(fixedDiscount)

    expect(store.getSubtotal()).toBe(10)
    expect(store.getTaxTotal()).toBe(1.6)
    expect(store.getDiscountTotal()).toBe(11.6)
    expect(store.getTotal()).toBe(0)
  })
})

describe('usePOSStore payments', () => {
  it('creates a transaction and clears the cart after payment', () => {
    const store = usePOSStore.getState()
    store.addToCart(productWithoutTax, 2)

    const transaction = store.processPayment('efectivo', {
      method: 'efectivo',
      amountPaid: 20,
      change: 10,
    })

    const updatedStore = usePOSStore.getState()

    expect(transaction.id).toBe('test-transaction-id')
    expect(transaction.total).toBe(10)
    expect(transaction.receiptNumber.startsWith('REC-')).toBe(true)
    expect(updatedStore.cart).toHaveLength(0)
    expect(updatedStore.transactions).toHaveLength(1)
    expect(updatedStore.currentReceipt?.id).toBe('test-transaction-id')
  })
})
