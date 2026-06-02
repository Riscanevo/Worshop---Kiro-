import { describe, it, expect, vi, beforeEach } from 'vitest'
import { registerSale } from './salesRepository'
import { Transaction, SaleResponse } from '../../types'

// Helper to build a minimal Transaction for tests
const makeTransaction = (): Transaction => ({
  id: 'tx-1',
  items: [
    {
      product: {
        id: 'prod-1',
        name: 'Leche',
        barcode: '123',
        price: 10,
        category: 'lacteos',
        image: '',
        stock: 5,
        unit: 'litro',
        taxRate: 0,
      },
      quantity: 2,
      subtotal: 20,
      discount: 0,
    },
  ],
  subtotal: 20,
  taxTotal: 0,
  discountTotal: 0,
  total: 20,
  paymentMethod: 'efectivo',
  paymentDetails: { method: 'efectivo', amountPaid: 20 },
  cashier: 'Cajero 1',
  timestamp: new Date(),
  receiptNumber: 'R-001',
})

const makeSaleResponse = (): SaleResponse => ({
  ventaId: 'venta-42',
  estado: 'completada',
  total: 20,
  items: [
    {
      productoId: 'prod-1',
      nombre: 'Leche',
      cantidad: 2,
      precioUnitario: 10,
      subtotal: 20,
    },
  ],
})

// Helper to create a mock Response
const mockResponse = (status: number, body: unknown): Response => {
  const jsonFn = body !== null ? vi.fn().mockResolvedValue(body) : vi.fn().mockRejectedValue(new Error('no body'))
  return {
    ok: status >= 200 && status < 300,
    status,
    json: jsonFn,
  } as unknown as Response
}

describe('salesRepository - registerSale', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  // Requirements: 3.2, 3.3
  it('envía un payload con solo items[{productoId, cantidad}] y medioPago', async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockResponse(200, makeSaleResponse()))
    vi.stubGlobal('fetch', fetchMock)

    const transaction = makeTransaction()
    await registerSale(transaction)

    expect(fetchMock).toHaveBeenCalledOnce()
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    const sentBody = JSON.parse(init.body as string)

    expect(sentBody).toEqual({
      items: [{ productoId: 'prod-1', cantidad: 2 }],
      medioPago: 'efectivo',
    })

    // Ensure no extra fields are present
    expect(Object.keys(sentBody)).toEqual(['items', 'medioPago'])
    expect(Object.keys(sentBody.items[0])).toEqual(['productoId', 'cantidad'])
  })

  // Requirements: 3.6
  it('retorna SaleResponse parseada cuando la respuesta es 200', async () => {
    const saleResponse = makeSaleResponse()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse(200, saleResponse)))

    const result = await registerSale(makeTransaction())

    expect(result).toEqual(saleResponse)
  })

  // Requirements: 3.7
  it('lanza error con el message del cuerpo cuando la respuesta es 400', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(mockResponse(400, { message: 'Producto no encontrado' })),
    )

    await expect(registerSale(makeTransaction())).rejects.toThrow('Producto no encontrado')
  })

  // Requirements: 3.7
  it("lanza 'Solicitud inválida' cuando la respuesta es 400 sin message", async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse(400, {})))

    await expect(registerSale(makeTransaction())).rejects.toThrow('Solicitud inválida')
  })

  // Requirements: 3.9
  it("lanza 'Error interno del servidor al registrar la venta' cuando la respuesta es 5xx", async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse(500, { message: 'Internal Server Error' })))

    await expect(registerSale(makeTransaction())).rejects.toThrow(
      'Error interno del servidor al registrar la venta',
    )
  })

  // Requirements: 3.11
  it("lanza 'Respuesta inválida del servidor' cuando la respuesta 200 tiene cuerpo vacío", async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse(200, null)))

    await expect(registerSale(makeTransaction())).rejects.toThrow('Respuesta inválida del servidor')
  })
})
