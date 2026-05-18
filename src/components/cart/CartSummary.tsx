import { usePOSStore } from '../../store/posStore'
import { formatCurrency } from '../../lib/currency'

export default function CartSummary() {
  const { getSubtotal, getTaxTotal, getDiscountTotal, getTotal, appliedDiscount } = usePOSStore()

  const subtotal = getSubtotal()
  const taxTotal = getTaxTotal()
  const discountTotal = getDiscountTotal()
  const total = getTotal()

  return (
    <div className="flex flex-column gap-2">
      <div className="flex justify-content-between">
        <span style={{ color: 'var(--pos-text-secondary)' }}>Subtotal</span>
        <span style={{ color: 'var(--pos-text-primary)' }}>{formatCurrency(subtotal)}</span>
      </div>

      <div className="flex justify-content-between">
        <span style={{ color: 'var(--pos-text-secondary)' }}>IVA</span>
        <span style={{ color: 'var(--pos-text-primary)' }}>{formatCurrency(taxTotal)}</span>
      </div>

      {appliedDiscount && discountTotal > 0 && (
        <div className="flex justify-content-between">
          <span style={{ color: 'var(--pos-success)' }}>
            <i className="pi pi-tag mr-1"></i>
            {appliedDiscount.name}
          </span>
          <span style={{ color: 'var(--pos-success)' }}>-{formatCurrency(discountTotal)}</span>
        </div>
      )}

      <div
        className="flex justify-content-between pt-3 mt-2"
        style={{ borderTop: '2px solid var(--pos-border)' }}
      >
        <span className="text-lg font-bold" style={{ color: 'var(--pos-text-primary)' }}>
          Total
        </span>
        <span className="text-2xl font-bold" style={{ color: 'var(--pos-accent)' }}>
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  )
}
