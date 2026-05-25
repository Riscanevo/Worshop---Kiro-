import { User } from '../types'

interface LoginResponse {
  token: string
  user: User
  expiresIn: number
}

interface AuthService {
  login: (username: string, password: string) => Promise<LoginResponse>
  logout: () => Promise<void>
  verifyToken: (token: string) => Promise<boolean>
  refreshToken: (token: string) => Promise<string>
}

interface MockUser {
  password: string
  user: User
}

const mockUsers: Record<string, MockUser> = {
  admin: {
    password: 'admin123',
    user: {
      id: '1',
      username: 'admin',
      name: 'Administrador',
      role: 'admin',
      email: 'admin@pos.com',
    },
  },
  cajero: {
    password: 'cajero123',
    user: {
      id: '2',
      username: 'cajero',
      name: 'Maria Garcia',
      role: 'cashier',
      email: 'maria@pos.com',
    },
  },
}

const LOGIN_REQUEST_URL = `data:application/json,${encodeURIComponent(
  JSON.stringify({ ok: true, service: 'pos-auth-mock' }),
)}`

async function simulateLoginRequest(username: string): Promise<void> {
  if (typeof fetch !== 'function') return

  // Keeps mock auth backend-free while still going through the HTTP interceptor.
  await fetch(LOGIN_REQUEST_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username }),
  })
}

export const authService: AuthService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 800))

    try {
      await simulateLoginRequest(username)
    } catch {
      throw new Error('Error de conexión. Intente nuevamente')
    }

    const mockUser = mockUsers[username.toLowerCase()]

    if (!mockUser || mockUser.password !== password) {
      throw new Error('Usuario o contraseña incorrectos')
    }

    // Token mock en base64 con expiración de 8 horas
    const payload = {
      userId: mockUser.user.id,
      username: mockUser.user.username,
      exp: Date.now() + 8 * 60 * 60 * 1000,
    }
    const token = btoa(JSON.stringify(payload))

    return {
      token,
      user: mockUser.user,
      expiresIn: 8 * 60 * 60,
    }
  },

  logout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
  },

  verifyToken: (token: string): Promise<boolean> => {
    try {
      const payload = JSON.parse(atob(token)) as { exp: number }
      return Promise.resolve(payload.exp > Date.now())
    } catch {
      return Promise.resolve(false)
    }
  },

  refreshToken: async (token: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return token
  },
}
