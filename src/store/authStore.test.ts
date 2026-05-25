import { beforeEach, describe, expect, it, vi } from 'vitest'
import { User } from '../types'

const { mockAuthService } = vi.hoisted(() => ({
  mockAuthService: {
    login: vi.fn(),
    logout: vi.fn(),
    verifyToken: vi.fn(),
    refreshToken: vi.fn(),
  },
}))

vi.mock('../services/authService', () => ({
  authService: mockAuthService,
}))

import { useAuthStore } from './authStore'

const mockUser: User = {
  id: '1',
  username: 'admin',
  name: 'Administrador',
  role: 'admin',
  email: 'admin@pos.com',
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

describe('authStore', () => {
  it('login con credenciales validas establece sesion autenticada', async () => {
    mockAuthService.login.mockResolvedValue({
      token: 'mock-token',
      user: mockUser,
      expiresIn: 28800,
    })

    await useAuthStore.getState().login('admin', 'admin123')

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.token).toBe('mock-token')
    expect(state.user?.username).toBe('admin')
    expect(localStorage.getItem('pos_auth_token')).toBe('mock-token')
    expect(localStorage.getItem('pos_auth_user')).toBe(JSON.stringify(mockUser))
  })

  it('login con credenciales invalidas establece error y sesion no autenticada', async () => {
    mockAuthService.login.mockRejectedValue(new Error('Usuario o contraseña incorrectos'))

    await expect(useAuthStore.getState().login('admin', 'wrong')).rejects.toThrow(
      'Usuario o contraseña incorrectos',
    )

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.error).toBe('Usuario o contraseña incorrectos')
    expect(state.token).toBeNull()
    expect(state.user).toBeNull()
  })

  it('logout limpia estado de sesion y localStorage', () => {
    localStorage.setItem('pos_auth_token', 'token')
    localStorage.setItem('pos_auth_user', JSON.stringify(mockUser))

    useAuthStore.setState({
      user: mockUser,
      token: 'token',
      isAuthenticated: true,
      error: 'old-error',
    })

    useAuthStore.getState().logout()

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(state.error).toBeNull()
    expect(localStorage.getItem('pos_auth_token')).toBeNull()
    expect(localStorage.getItem('pos_auth_user')).toBeNull()
  })
})
