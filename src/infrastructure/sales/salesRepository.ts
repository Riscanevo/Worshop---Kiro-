import { buildApiUrl } from '../../config/api'
import { SaleResponse, Transaction } from '../../types'

const createSalePayload = (transaction: Transaction) => ({
  items: transaction.items.map((item) => ({
    productoId: item.product.id,
    cantidad: item.quantity,
  })),
  medioPago: transaction.paymentMethod,
})

export const registerSale = async (transaction: Transaction): Promise<SaleResponse> => {
  const response = await fetch(buildApiUrl('/ventas'), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(createSalePayload(transaction)),
  })

  let body: unknown
  try {
    body = await response.json()
  } catch {
    body = null
  }

  if (!response.ok) {
    const msg = (body as { message?: string } | null)?.message
    if (response.status === 400) throw new Error(msg ?? 'Solicitud inválida')
    if (response.status === 404) throw new Error(msg ?? 'Recurso no encontrado')
    if (response.status >= 500) throw new Error('Error interno del servidor al registrar la venta')
    throw new Error('Error inesperado al registrar la venta')
  }

  if (!body || typeof body !== 'object') {
    throw new Error('Respuesta inválida del servidor')
  }

  return body as SaleResponse
}
