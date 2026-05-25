import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { authService } from './authService'

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    ),
  )
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('authService', () => {
  it('retorna token y usuario para credenciales validas', async () => {
    vi.useFakeTimers()

    const loginPromise = authService.login('admin', 'admin123')
    await vi.advanceTimersByTimeAsync(800)
    const result = await loginPromise

    expect(result.user.username).toBe('admin')
    expect(result.token).toBeTypeOf('string')
    expect(result.expiresIn).toBe(8 * 60 * 60)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('data:application/json'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ username: 'admin' }),
      }),
    )
  })

  it('lanza error para credenciales invalidas', async () => {
    vi.useFakeTimers()

    const loginPromise = authService.login('admin', 'bad-password')
    const expectedRejection = expect(loginPromise).rejects.toThrow(
      'Usuario o contraseña incorrectos',
    )
    await vi.advanceTimersByTimeAsync(800)

    await expectedRejection
  })

  it('muestra error de conexion cuando falla el request mock', async () => {
    vi.useFakeTimers()
    vi.mocked(fetch).mockRejectedValue(new Error('Network down'))

    const loginPromise = authService.login('admin', 'admin123')
    const expectedRejection = expect(loginPromise).rejects.toThrow(
      'Error de conexión. Intente nuevamente',
    )
    await vi.advanceTimersByTimeAsync(800)

    await expectedRejection
  })

  it('verifyToken retorna false para token expirado', async () => {
    const expiredToken = btoa(
      JSON.stringify({ userId: '1', username: 'admin', exp: Date.now() - 1000 }),
    )

    await expect(authService.verifyToken(expiredToken)).resolves.toBe(false)
  })

  it('verifyToken retorna true para token vigente', async () => {
    const validToken = btoa(
      JSON.stringify({ userId: '1', username: 'admin', exp: Date.now() + 1000 * 60 * 10 }),
    )

    await expect(authService.verifyToken(validToken)).resolves.toBe(true)
  })
})
