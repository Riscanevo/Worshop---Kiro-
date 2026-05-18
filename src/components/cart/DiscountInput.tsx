import { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { usePOSStore } from '../../store/posStore'
import { Discount } from '../../types'

const availableDiscounts: Discount[] = [
  { id: '1', name: '10% Descuento', type: 'percentage', value: 10, code: 'DESCUENTO10' },
  { id: '2', name: '20% Descuento', type: 'percentage', value: 20, code: 'SUPER20' },
  { id: '3', name: '5000 pesos de descuento', type: 'fixed', value: 5000, code: 'AHORRA5' },
]

export default function DiscountInput() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const { appliedDiscount, applyDiscount, removeDiscount } = usePOSStore()

  const handleApplyDiscount = () => {
    const discount = availableDiscounts.find((d) => d.code?.toLowerCase() === code.toLowerCase())

    if (discount) {
      applyDiscount(discount)
      setCode('')
      setError('')
    } else {
      setError('Codigo de descuento invalido')
    }
  }

  if (appliedDiscount) {
    return (
      <div
        className="flex align-items-center justify-content-between p-3"
        style={{
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          borderRadius: '10px',
          border: '1px solid rgba(34, 197, 94, 0.3)',
        }}
      >
        <div className="flex align-items-center gap-2">
          <i className="pi pi-check-circle" style={{ color: 'var(--pos-success)' }}></i>
          <div>
            <p className="m-0 text-sm font-semibold" style={{ color: 'var(--pos-success)' }}>
              {appliedDiscount.name}
            </p>
            <p className="m-0 text-xs" style={{ color: 'var(--pos-text-secondary)' }}>
              Codigo: {appliedDiscount.code}
            </p>
          </div>
        </div>
        <Button
          icon="pi pi-times"
          className="p-button-text p-button-sm"
          style={{ color: 'var(--pos-text-secondary)' }}
          onClick={removeDiscount}
        />
      </div>
    )
  }

  return (
    <div>
      <div className="flex gap-2">
        <InputText
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            setError('')
          }}
          placeholder="Codigo de descuento"
          className="flex-1"
          style={{
            backgroundColor: 'var(--pos-bg-secondary)',
            border: '1px solid var(--pos-border)',
            borderRadius: '10px',
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleApplyDiscount()
            }
          }}
        />
        <Button
          icon="pi pi-tag"
          label="Aplicar"
          className="p-button-outlined"
          style={{
            borderRadius: '10px',
            borderColor: 'var(--pos-border)',
            color: 'var(--pos-text-primary)',
          }}
          onClick={handleApplyDiscount}
          disabled={!code.trim()}
        />
      </div>
      {error && (
        <p className="m-0 mt-2 text-xs" style={{ color: 'var(--pos-danger)' }}>
          <i className="pi pi-exclamation-circle mr-1"></i>
          {error}
        </p>
      )}
      <p className="m-0 mt-2 text-xs" style={{ color: 'var(--pos-text-secondary)' }}>
        Prueba: DESCUENTO10, SUPER20, AHORRA5
      </p>
    </div>
  )
}
