import { describe, expect, it } from 'vitest'
import { calculateChange, isPaymentValid } from './payment'

describe('payment utilities', () => {
  it('calculates change without returning negative values', () => {
    expect(calculateChange(100, 64.5)).toBe(35.5)
    expect(calculateChange(20, 64.5)).toBe(0)
  })

  it('validates cash payments only when received amount covers total', () => {
    expect(isPaymentValid({ method: 'efectivo', total: 50, cashAmount: 50 })).toBe(true)
    expect(isPaymentValid({ method: 'efectivo', total: 50, cashAmount: 49.99 })).toBe(false)
  })

  it('validates card payments only with 4 numeric digits', () => {
    expect(isPaymentValid({ method: 'tarjeta', total: 50, cardLastFour: '1234' })).toBe(true)
    expect(isPaymentValid({ method: 'tarjeta', total: 50, cardLastFour: '12a4' })).toBe(false)
    expect(isPaymentValid({ method: 'tarjeta', total: 50, cardLastFour: '12345' })).toBe(false)
  })
})
