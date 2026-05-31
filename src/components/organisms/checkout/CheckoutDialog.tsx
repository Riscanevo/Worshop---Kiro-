import { RefObject, useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputNumber } from 'primereact/inputnumber'
import { RadioButton } from 'primereact/radiobutton'
import { Divider } from 'primereact/divider'
import { Toast } from 'primereact/toast'
import { usePOSStore } from '../../../store/posStore'
import { PaymentMethod } from '../../../types'
import { calculateChange, isPaymentValid } from '../../../lib/payment'
import { formatCurrency } from '../../../lib/currency'

interface CheckoutDialogProps {
  toast: RefObject<Toast | null>
}

export default function CheckoutDialog({ toast }: CheckoutDialogProps) {
  const { isCheckoutOpen, closeCheckout, getTotal, processPayment, cart } = usePOSStore()

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo')
  const [cashAmount, setCashAmount] = useState<number>(0)
  const [cardLastFour, setCardLastFour] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const total = getTotal()
  const change = calculateChange(cashAmount, total)
  const paymentIsValid = isPaymentValid({ method: paymentMethod, total, cashAmount, cardLastFour })

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      await processPayment(paymentMethod, {
        method: paymentMethod,
        amountPaid: paymentMethod === 'efectivo' ? cashAmount : total,
        change: paymentMethod === 'efectivo' ? change : undefined,
        cardLastFour: paymentMethod === 'tarjeta' ? cardLastFour : undefined,
      })

      toast.current?.show({
        severity: 'success',
        summary: 'Venta registrada',
        detail: 'La venta se registro correctamente',
        life: 3000,
      })

      setCashAmount(0)
      setCardLastFour('')
      setPaymentMethod('efectivo')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error registrando la venta'
      toast.current?.show({
        severity: 'error',
        summary: 'Error de API',
        detail: message,
        life: 5000,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const quickCashAmounts = [10000, 20000, 50000, 100000, 200000]

  const header = (
    <div className="flex align-items-center gap-3">
      <div
        className="flex align-items-center justify-content-center"
        style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--pos-accent)' }}
      >
        <i className="pi pi-credit-card text-white text-xl"></i>
      </div>
      <div>
        <h2 className="m-0 text-xl font-bold" style={{ color: 'var(--pos-text-primary)' }}>
          Procesar Pago
        </h2>
        <p className="m-0 text-sm" style={{ color: 'var(--pos-text-secondary)' }}>
          {cart.length} productos en el carrito
        </p>
      </div>
    </div>
  )

  return (
    <Dialog
      visible={isCheckoutOpen}
      onHide={closeCheckout}
      header={header}
      style={{ width: '500px' }}
      modal
      className="pos-checkout-dialog"
      contentStyle={{ backgroundColor: 'var(--pos-bg-secondary)', padding: '1.5rem' }}
      headerStyle={{
        backgroundColor: 'var(--pos-bg-secondary)',
        borderBottom: '1px solid var(--pos-border)',
        padding: '1.5rem',
      }}
    >
      <div
        className="flex flex-column align-items-center p-4 mb-4"
        style={{ backgroundColor: 'var(--pos-bg-tertiary)', borderRadius: '16px' }}
      >
        <span style={{ color: 'var(--pos-text-secondary)' }}>Total a Pagar</span>
        <span className="text-4xl font-bold mt-2" style={{ color: 'var(--pos-accent)' }}>
          {formatCurrency(total)}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-sm font-semibold mb-3" style={{ color: 'var(--pos-text-primary)' }}>
          Metodo de Pago
        </p>
        <div className="flex gap-3">
          {(['efectivo', 'tarjeta'] as PaymentMethod[]).map((method) => (
            <div
              key={method}
              className="flex-1 flex flex-column align-items-center p-4 cursor-pointer transition-all transition-duration-200"
              style={{
                backgroundColor: paymentMethod === method ? 'rgba(59, 130, 246, 0.1)' : 'var(--pos-bg-tertiary)',
                border: paymentMethod === method ? '2px solid var(--pos-accent)' : '2px solid var(--pos-border)',
                borderRadius: '12px',
              }}
              onClick={() => setPaymentMethod(method)}
            >
              <RadioButton
                inputId={method}
                value={method}
                checked={paymentMethod === method}
                onChange={() => setPaymentMethod(method)}
              />
              <i
                className={`${method === 'efectivo' ? 'pi pi-wallet' : 'pi pi-credit-card'} text-2xl mt-2`}
                style={{ color: method === 'efectivo' ? 'var(--pos-success)' : 'var(--pos-accent)' }}
              ></i>
              <span className="mt-2 font-semibold capitalize" style={{ color: 'var(--pos-text-primary)' }}>
                {method}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Divider style={{ borderColor: 'var(--pos-border)' }} />

      {paymentMethod === 'efectivo' && (
        <div className="mb-4">
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--pos-text-primary)' }}>
            Monto Recibido
          </p>
          <InputNumber
            value={cashAmount}
            onValueChange={(e) => setCashAmount(e.value || 0)}
            mode="currency"
            currency="COP"
            locale="es-CO"
            minFractionDigits={0}
            maxFractionDigits={0}
            className="w-full mb-3"
            inputStyle={{
              width: '100%',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textAlign: 'center',
              backgroundColor: 'var(--pos-bg-tertiary)',
              border: '2px solid var(--pos-border)',
              borderRadius: '12px',
              color: 'var(--pos-text-primary)',
            }}
          />
          <div className="flex flex-wrap gap-2 mb-4">
            {quickCashAmounts.map((amount) => (
              <Button
                key={amount}
                label={formatCurrency(amount)}
                className="p-button-outlined flex-1"
                style={{ minWidth: '80px', borderRadius: '10px', borderColor: 'var(--pos-border)', color: 'var(--pos-text-primary)' }}
                onClick={() => setCashAmount(amount)}
              />
            ))}
            <Button
              label="Exacto"
              className="p-button-outlined"
              style={{ minWidth: '80px', borderRadius: '10px', borderColor: 'var(--pos-success)', color: 'var(--pos-success)' }}
              onClick={() => setCashAmount(total)}
            />
          </div>
          {paymentIsValid && (
            <div
              className="flex justify-content-between p-3"
              style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.3)' }}
            >
              <span style={{ color: 'var(--pos-text-primary)' }}>Cambio a devolver:</span>
              <span className="font-bold text-xl" style={{ color: 'var(--pos-success)' }}>
                {formatCurrency(change)}
              </span>
            </div>
          )}
        </div>
      )}

      {paymentMethod === 'tarjeta' && (
        <div className="mb-4">
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--pos-text-primary)' }}>
            Ultimos 4 digitos de la tarjeta
          </p>
          <div
            className="flex align-items-center gap-3 p-4"
            style={{ backgroundColor: 'var(--pos-bg-tertiary)', borderRadius: '12px' }}
          >
            <i className="pi pi-credit-card text-2xl" style={{ color: 'var(--pos-accent)' }}></i>
            <span style={{ color: 'var(--pos-text-secondary)' }}>**** **** ****</span>
            <input
              type="text"
              value={cardLastFour}
              onChange={(e) => setCardLastFour(e.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength={4}
              placeholder="0000"
              className="border-none outline-none text-xl font-bold"
              style={{ width: '80px', backgroundColor: 'transparent', color: 'var(--pos-text-primary)' }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-4">
        <Button
          label="Cancelar"
          className="p-button-outlined flex-1"
          style={{ height: '50px', borderRadius: '12px', borderColor: 'var(--pos-border)', color: 'var(--pos-text-primary)' }}
          onClick={closeCheckout}
          disabled={isProcessing}
        />
        <Button
          label={isProcessing ? 'Procesando...' : 'Confirmar Pago'}
          className="flex-1"
          style={{ height: '50px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--pos-success) 0%, #16a34a 100%)', border: 'none' }}
          onClick={() => { void handlePayment() }}
          disabled={!paymentIsValid || isProcessing}
        />
      </div>
    </Dialog>
  )
}
