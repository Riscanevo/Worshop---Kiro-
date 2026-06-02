import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getProducts } from './catalogRepository'

// Validates: Requirements 2.12

describe('catalogRepository', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('throws the backend message when 4xx response contains a message field', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Catálogo no disponible' }),
      }),
    )

    await expect(getProducts()).rejects.toThrow('Catálogo no disponible')
  })

  it("throws 'No se pudieron cargar los productos' when 4xx response has no message field", async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({}),
      }),
    )

    await expect(getProducts()).rejects.toThrow('No se pudieron cargar los productos')
  })
})
