import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { Transaction } from '../../types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatCurrency } from '../../lib/currency'

interface ReceiptDialogProps {
  visible: boolean
  transaction: Transaction | null
  onClose: () => void
}

export default function ReceiptDialog({ visible, transaction, onClose }: ReceiptDialogProps) {
  if (!transaction) return null

  const handlePrint = () => {
    window.print()
  }

  const handleNewSale = () => {
    onClose()
  }

  const header = (
    <div className="flex align-items-center gap-3">
      <div
        className="flex align-items-center justify-content-center"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: 'var(--pos-success)',
        }}
      >
        <i className="pi pi-check text-white text-xl"></i>
      </div>
      <div>
        <h2 className="m-0 text-xl font-bold" style={{ color: 'var(--pos-text-primary)' }}>
          Venta Completada
        </h2>
        <p className="m-0 text-sm" style={{ color: 'var(--pos-text-secondary)' }}>
          Recibo #{transaction.receiptNumber}
        </p>
      </div>
    </div>
  )

  return (
    <Dialog
      visible={visible}
      onHide={onClose}
      header={header}
      style={{ width: '450px' }}
      modal
      closable={false}
      contentStyle={{
        backgroundColor: 'var(--pos-bg-secondary)',
        padding: '0',
      }}
      headerStyle={{
        backgroundColor: 'var(--pos-bg-secondary)',
        borderBottom: '1px solid var(--pos-border)',
        padding: '1.5rem',
      }}
    >
      {/* Receipt Content */}
      <div className="p-4" style={{ backgroundColor: 'white', color: '#1f2937' }}>
        {/* Store Header */}
        <div className="text-center mb-4">
          <h3 className="m-0 text-lg font-bold">SuperMarket POS</h3>
          <p className="m-0 text-sm" style={{ color: '#6b7280' }}>
            Av 5 Barrio la Cabrera
          </p>
          <p className="m-0 text-sm" style={{ color: '#6b7280' }}>
            Tel: (311) 3581407
          </p>
        </div>

        <Divider style={{ borderColor: '#e5e7eb', borderStyle: 'dashed' }} />

        {/* Transaction Info */}
        <div className="flex justify-content-between text-sm mb-2">
          <span style={{ color: '#6b7280' }}>Fecha:</span>
          <span>{format(transaction.timestamp, 'dd/MM/yyyy HH:mm', { locale: es })}</span>
        </div>
        <div className="flex justify-content-between text-sm mb-2">
          <span style={{ color: '#6b7280' }}>Recibo:</span>
          <span>{transaction.receiptNumber}</span>
        </div>
        <div className="flex justify-content-between text-sm mb-3">
          <span style={{ color: '#6b7280' }}>Cajero:</span>
          <span>{transaction.cashier}</span>
        </div>

        <Divider style={{ borderColor: '#e5e7eb', borderStyle: 'dashed' }} />

        {/* Items */}
        <div className="mb-3">
          {transaction.items.map((item, index) => (
            <div key={index} className="flex justify-content-between py-2 text-sm">
              <div className="flex-1">
                <p className="m-0 font-medium">{item.product.name}</p>
                <p className="m-0 text-xs" style={{ color: '#6b7280' }}>
                  {item.quantity} x {formatCurrency(item.product.price)}
                </p>
              </div>
              <span className="font-medium">{formatCurrency(item.subtotal)}</span>
            </div>
          ))}
        </div>

        <Divider style={{ borderColor: '#e5e7eb', borderStyle: 'dashed' }} />

        {/* Totals */}
        <div className="flex justify-content-between text-sm mb-1">
          <span style={{ color: '#6b7280' }}>Subtotal:</span>
          <span>{formatCurrency(transaction.subtotal)}</span>
        </div>
        <div className="flex justify-content-between text-sm mb-1">
          <span style={{ color: '#6b7280' }}>IVA:</span>
          <span>{formatCurrency(transaction.taxTotal)}</span>
        </div>
        {transaction.discountTotal > 0 && (
          <div className="flex justify-content-between text-sm mb-1" style={{ color: '#16a34a' }}>
            <span>Descuento:</span>
            <span>-{formatCurrency(transaction.discountTotal)}</span>
          </div>
        )}
        <div
          className="flex justify-content-between text-lg font-bold mt-2 pt-2"
          style={{ borderTop: '2px solid #1f2937' }}
        >
          <span>TOTAL:</span>
          <span>{formatCurrency(transaction.total)}</span>
        </div>

        <Divider style={{ borderColor: '#e5e7eb', borderStyle: 'dashed' }} />

        {/* Payment Info */}
        <div className="text-sm">
          <div className="flex justify-content-between mb-1">
            <span style={{ color: '#6b7280' }}>Metodo de pago:</span>
            <span className="capitalize">{transaction.paymentMethod}</span>
          </div>
          {transaction.paymentDetails.method === 'efectivo' && (
            <>
              <div className="flex justify-content-between mb-1">
                <span style={{ color: '#6b7280' }}>Efectivo recibido:</span>
                <span>{formatCurrency(transaction.paymentDetails.amountPaid)}</span>
              </div>
              <div className="flex justify-content-between font-medium">
                <span style={{ color: '#6b7280' }}>Cambio:</span>
                <span>{formatCurrency(transaction.paymentDetails.change ?? 0)}</span>
              </div>
            </>
          )}
          {transaction.paymentDetails.method === 'tarjeta' && (
            <div className="flex justify-content-between">
              <span style={{ color: '#6b7280' }}>Tarjeta:</span>
              <span>**** {transaction.paymentDetails.cardLastFour}</span>
            </div>
          )}
        </div>

        <Divider style={{ borderColor: '#e5e7eb', borderStyle: 'dashed' }} />

        {/* Footer */}
        <div className="text-center">
          <p className="m-0 text-sm font-medium">Gracias por su compra!</p>
          <p className="m-0 text-xs mt-1" style={{ color: '#6b7280' }}>
            Conserve este recibo para cualquier devolucion
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 p-4">
        <Button
          label="Imprimir"
          className="p-button-outlined flex-1"
          style={{
            height: '50px',
            borderRadius: '12px',
            borderColor: 'var(--pos-border)',
            color: 'var(--pos-text-primary)',
          }}
          onClick={handlePrint}
        />

        <Button
          label="Nueva Venta"
          className="flex-1"
          style={{
            height: '50px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--pos-accent) 0%, #1d4ed8 100%)',
            border: 'none',
          }}
          onClick={handleNewSale}
        />
      </div>
    </Dialog>
  )
}
