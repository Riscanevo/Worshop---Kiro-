import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import MainLayout from './MainLayout'
import AuthLayout from './AuthLayout'
import LoginPage from '../pages/LoginPage'

const authStoreMock = vi.hoisted(() => ({
  login: vi.fn(),
  clearError: vi.fn(),
}))

vi.mock('../organisms/Header', () => ({
  default: () => <header>Header Mock</header>,
}))

vi.mock('../../store/authStore', () => ({
  useAuthStore: () => ({
    login: authStoreMock.login,
    isLoading: false,
    clearError: authStoreMock.clearError,
  }),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Templates and Pages', () => {
  it('MainLayout renderiza Header y children', () => {
    const { container } = render(
      <MainLayout>
        <div>Contenido Principal</div>
      </MainLayout>,
    )

    expect(screen.getByText('Header Mock')).toBeInTheDocument()
    expect(screen.getByText('Contenido Principal')).toBeInTheDocument()
    expect(container.querySelector('main')).toContainElement(
      screen.getByText('Contenido Principal'),
    )
  })

  it('AuthLayout renderiza children centrado', () => {
    const { container } = render(
      <AuthLayout>
        <div>Login Content</div>
      </AuthLayout>,
    )

    const layout = container.firstElementChild
    expect(screen.getByText('Login Content')).toBeInTheDocument()
    expect(layout).toHaveStyle({
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--pos-bg-primary)',
    })
  })

  it('LoginPage muestra campos de usuario y contraseña', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    const usernameInput = screen.getByLabelText('Usuario')
    const passwordInput = screen.getByLabelText('Contraseña')

    expect(usernameInput).toBeInTheDocument()
    expect(usernameInput).toHaveAttribute('placeholder', 'Ingresa tu usuario')
    expect(passwordInput).toBeInTheDocument()
    expect(passwordInput).toHaveAttribute('placeholder', 'Ingresa tu contraseña')
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeDisabled()
  })
})
