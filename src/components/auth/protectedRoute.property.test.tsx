import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import { useAuthStore } from '../../store/authStore'

const authenticatedUser = {
  id: '1',
  username: 'admin',
  name: 'Administrador',
  role: 'admin' as const,
}

beforeEach(() => {
  useAuthStore.setState({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    checkAuth: vi.fn().mockResolvedValue(undefined),
  })
})

describe('Propiedad ProtectedRoute: proteccion de rutas', () => {
  it('usuario no autenticado en ruta protegida se redirige a /login', () => {
    render(
      <MemoryRouter initialEntries={['/pos']}>
        <Routes>
          <Route path="/login" element={<div>Login Screen</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/pos" element={<div>POS Screen</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Login Screen')).toBeInTheDocument()
    expect(screen.queryByText('POS Screen')).not.toBeInTheDocument()
  })

  it('usuario autenticado puede acceder a ruta protegida', () => {
    useAuthStore.setState({
      user: authenticatedUser,
      token: 'token',
      isAuthenticated: true,
    })

    render(
      <MemoryRouter initialEntries={['/pos']}>
        <Routes>
          <Route path="/login" element={<div>Login Screen</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/pos" element={<div>POS Screen</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('POS Screen')).toBeInTheDocument()
  })

  it('usuario autenticado en /login es redirigido a /pos', () => {
    useAuthStore.setState({
      user: authenticatedUser,
      token: 'token',
      isAuthenticated: true,
    })

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<div>Login Screen</div>} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/pos" element={<div>POS Screen</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('POS Screen')).toBeInTheDocument()
    expect(screen.queryByText('Login Screen')).not.toBeInTheDocument()
  })

  it('usuario autenticado sin rol requerido es redirigido a /unauthorized', () => {
    useAuthStore.setState({
      user: { ...authenticatedUser, role: 'cashier' },
      token: 'token',
      isAuthenticated: true,
    })

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin" element={<div>Admin Screen</div>} />
          </Route>
          <Route path="/unauthorized" element={<div>Unauthorized Screen</div>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Unauthorized Screen')).toBeInTheDocument()
    expect(screen.queryByText('Admin Screen')).not.toBeInTheDocument()
  })
})
