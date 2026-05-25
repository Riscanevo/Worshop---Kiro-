import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('uuid', () => ({
  v4: () => 'test-log-id',
}))

import { requestLogger } from './requestLogger'
import { initializeHttpInterceptor, resetHttpInterceptorForTests } from './httpInterceptor'

beforeEach(() => {
  vi.stubEnv('DEV', true)
  requestLogger.clearLogs()
  resetHttpInterceptorForTests()
})

afterEach(() => {
  resetHttpInterceptorForTests()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('httpInterceptor', () => {
  it('captura fetch exitoso y agrega log con status y duration', async () => {
    const baseFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )

    vi.stubGlobal('fetch', baseFetch)
    const addLogSpy = vi.spyOn(requestLogger, 'addLog')

    initializeHttpInterceptor()

    await fetch('/api/test', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ productId: '1' }),
    })

    expect(addLogSpy).toHaveBeenCalledTimes(1)

    const log = requestLogger.getLogs()[0]
    expect(log.id).toBe('test-log-id')
    expect(log.method).toBe('POST')
    expect(log.url).toContain('/api/test')
    expect(log.responseStatus).toBe(200)
    expect(log.responseBody).toEqual({ ok: true })
    expect(log.duration).toBeTypeOf('number')
    expect(log.duration).toBeGreaterThanOrEqual(0)
  })

  it('captura error de red y agrega log con campo error', async () => {
    const networkError = new Error('Network error')
    const baseFetch = vi.fn().mockRejectedValue(networkError)

    vi.stubGlobal('fetch', baseFetch)

    initializeHttpInterceptor()

    await expect(fetch('/api/error')).rejects.toThrow('Network error')

    const log = requestLogger.getLogs()[0]
    expect(log.method).toBe('GET')
    expect(log.error).toBeInstanceOf(Error)
    expect(log.error?.message).toBe('Network error')
    expect(log.duration).toBeTypeOf('number')
  })
})
