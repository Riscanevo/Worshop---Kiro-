import { v4 as uuidv4 } from 'uuid'
import { CartItem, Discount, PaymentDetails, PaymentMethod, Transaction } from '../../types'
import {
  calculateDiscountTotal,
  calculateSubtotal,
  calculateTaxTotal,
  calculateTotal,
} from '../../domain/pos/pricing'

interface CreateTransactionInput {
  cart: CartItem[]
  appliedDiscount: Discount | null
  method: PaymentMethod
  details: PaymentDetails
  cashier: string
  timestamp?: Date
}

export const createTransaction = ({
  cart,
  appliedDiscount,
  method,
  details,
  cashier,
  timestamp = new Date(),
}: CreateTransactionInput): Transaction => {
  const subtotal = calculateSubtotal(cart)
  const taxTotal = calculateTaxTotal(cart)
  const discountTotal = calculateDiscountTotal(appliedDiscount, subtotal, taxTotal)
  const total = calculateTotal(subtotal, taxTotal, discountTotal)

  return {
    id: uuidv4(),
    items: [...cart],
    subtotal,
    taxTotal,
    discountTotal,
    total,
    paymentMethod: method,
    paymentDetails: details,
    cashier,
    timestamp,
    receiptNumber: `REC-${Date.now().toString().slice(-8)}`,
  }
}
