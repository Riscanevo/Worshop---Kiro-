import { create } from 'zustand'
import { User } from '../types'
import { authService } from '../services/authService'

const TOKEN_KEY = 'pos_auth_token'
const USER_KEY = 'pos_auth_user'

interface AuthStore {
  // Estado
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Acciones
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
  clearError: () => void

  // Helpers
  getToken: () => string | null
  getUser: () => User | null
  hasRole: (role: string) => boolean
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null })

    try {
      const response = await authService.login(username, password)

      localStorage.setItem(TOKEN_KEY, response.token)
      localStorage.setItem(USER_KEY, JSON.stringify(response.user))

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error de autenticación'
      set({
        error: message,
        isLoading: false,
        isAuthenticated: false,
      })
      throw err
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    })
  },

  checkAuth: async () => {
    const token = localStorage.getItem(TOKEN_KEY)
    const userStr = localStorage.getItem(USER_KEY)

    if (!token || !userStr) {
      set({ isAuthenticated: false })
      return
    }

    try {
      const user = JSON.parse(userStr) as User
      const isValid = await authService.verifyToken(token)

      if (isValid) {
        set({ user, token, isAuthenticated: true })
      } else {
        get().logout()
      }
    } catch {
      get().logout()
    }
  },

  clearError: () => set({ error: null }),

  getToken: () => get().token,
  getUser: () => get().user,
  hasRole: (role: string) => get().user?.role === role,
}))
