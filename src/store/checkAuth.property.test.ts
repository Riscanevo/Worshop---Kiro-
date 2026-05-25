import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockAuthService } = vi.hoisted(() => ({
  mockAuthService: {
    login: vi.fn(),
    logout: vi.fn(),
    verifyToken: vi.fn((token: string) => {
      try {
        const payload = JSON.parse(atob(token)) as { exp: number }
        return payload.exp > Date.now()
      } catch {
        return false
      }
    }),
    refreshToken: vi.fn(),
  },
}))

vi.mock('../services/authService', () => ({
  authService: mockAuthService,
}))

import { useAuthStore } from './authStore'

const user = {
  id: '10',
  username: 'tester',
  name: 'Tester',
  role: 'cashier' as const,
}

function buildToken(exp: number): string {
  return btoa(JSON.stringify({ userId: user.id, username: user.username, exp }))
}

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()

  useAuthStore.setState({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  })
})

describe('Propiedad checkAuth: sesion persistente', () => {
  it('para cualquier token vigente en localStorage restaura sesion', async () => {
    const futureOffsets = [1_000, 5_000, 60_000, 300_000, 3_600_000]

    for (const offset of futureOffsets) {
      const token = buildToken(Date.now() + offset)
      localStorage.setItem('pos_auth_token', token)
      localStorage.setItem('pos_auth_user', JSON.stringify(user))

      useAuthStore.setState({
        user: null,
        token: null,
        isAuthenticated: false,
      })

      await useAuthStore.getState().checkAuth()

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.token).toBe(token)
      expect(state.user?.username).toBe(user.username)
    }
  })

  it('para cualquier token expirado limpia la sesion', async () => {
    const pastOffsets = [1_000, 5_000, 60_000, 300_000, 3_600_000]

    for (const offset of pastOffsets) {
      const token = buildToken(Date.now() - offset)
      localStorage.setItem('pos_auth_token', token)
      localStorage.setItem('pos_auth_user', JSON.stringify(user))

      useAuthStore.setState({
        user,
        token,
        isAuthenticated: true,
      })

      await useAuthStore.getState().checkAuth()

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(localStorage.getItem('pos_auth_token')).toBeNull()
      expect(localStorage.getItem('pos_auth_user')).toBeNull()
    }
  })
})
