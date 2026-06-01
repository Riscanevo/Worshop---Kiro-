import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import AuthLayout from '../templates/AuthLayout'
import { useAuthStore } from '../../store/authStore'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading, clearError } = useAuthStore()
  const navigate = useNavigate()
  const toast = useRef<Toast>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) return

    clearError()

    try {
      await login(username, password)
      toast.current?.show({
        severity: 'success',
        summary: 'Bienvenido',
        detail: 'Inicio de sesión exitoso',
        life: 1500,
      })
      setTimeout(() => navigate('/pos'), 500)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión'
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 4000,
      })
    }
  }

  return (
    <AuthLayout>
      <Toast ref={toast} />

      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '2rem',
          backgroundColor: 'var(--pos-bg-secondary)',
          borderRadius: '16px',
          border: '1px solid var(--pos-border)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Logo y título */}
        <div className="text-center mb-5">
          <div
            className="inline-flex align-items-center justify-content-center mb-3"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, var(--pos-accent) 0%, #1d4ed8 100%)',
            }}
          >
            <i className="pi pi-shopping-cart" style={{ fontSize: '2.5rem', color: 'white' }}></i>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--pos-text-primary)' }}>
            SuperMarket POS
          </h1>
          <p className="text-sm m-0" style={{ color: 'var(--pos-text-secondary)' }}>
            Inicia sesión para continuar
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={(e) => { void handleSubmit(e) }}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium"
              style={{ color: 'var(--pos-text-primary)' }}
            >
              Usuario
            </label>
            <InputText
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              className="w-full"
              disabled={isLoading}
              autoFocus
              style={{
                backgroundColor: 'var(--pos-bg-tertiary)',
                border: '1px solid var(--pos-border)',
                color: 'var(--pos-text-primary)',
                padding: '0.4rem 1rem',
                fontSize: '1rem'
                
              }}
            />
          </div>

          <div className="mb-4 p-fluid">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium"
              style={{ color: 'var(--pos-text-primary)' }}
            >
              Contraseña
            </label>
            <Password
              inputId="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              className="w-full pos-login-password"
              inputClassName="w-full"
              toggleMask
              feedback={false}
              disabled={isLoading}
              inputStyle={{
                backgroundColor: 'var(--pos-bg-tertiary)',
                border: '1px solid var(--pos-border)',
                color: 'var(--pos-text-primary)',
                padding: '0.4rem 1rem',
                fontSize: '1rem',
              }}
            />
          </div>

          <Button
            type="submit"
            label={isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            icon={isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'}
            className="w-full"
            style={{
              backgroundColor: 'var(--pos-accent)',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '1rem',
            }}
            disabled={isLoading || !username || !password}
          />
        </form>

        {/* Usuarios de prueba */}
        <div
          className="mt-5 p-3"
          style={{
            backgroundColor: 'var(--pos-bg-tertiary)',
            borderRadius: '8px',
            border: '1px solid var(--pos-border)',
          }}
        >
          <p className="text-xs font-semibold mb-2 m-0" style={{ color: 'var(--pos-text-secondary)' }}>
            Usuarios de prueba:
          </p>
          <p className="text-xs mb-1 m-0" style={{ color: 'var(--pos-text-secondary)' }}>
            <strong style={{ color: 'var(--pos-text-primary)' }}>Admin:</strong> admin / admin123
          </p>
          <p className="text-xs m-0" style={{ color: 'var(--pos-text-secondary)' }}>
            <strong style={{ color: 'var(--pos-text-primary)' }}>Cajero:</strong> cajero / cajero123
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}
