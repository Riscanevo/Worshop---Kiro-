import { PaymentMethod } from '../types'

interface PaymentValidationInput {
  method: PaymentMethod
  total: number
  cashAmount?: number
  cardLastFour?: string
}

export const calculateChange = (cashAmount: number, total: number): number => {
  return Math.max(0, cashAmount - total)
}

export const isPaymentValid = ({
  method,
  total,
  cashAmount = 0,
  cardLastFour = '',
}: PaymentValidationInput): boolean => {
  if (total <= 0) return false

  if (method === 'efectivo') {
    return cashAmount >= total
  }

  if (method === 'tarjeta') {
    return /^\d{4}$/.test(cardLastFour)
  }

  return false
}
