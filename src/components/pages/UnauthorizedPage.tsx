import { useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'
import AuthLayout from '../templates/AuthLayout'

export default function UnauthorizedPage() {
  const navigate = useNavigate()

  return (
    <AuthLayout>
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '2rem',
          backgroundColor: 'var(--pos-bg-secondary)',
          borderRadius: '12px',
          border: '1px solid var(--pos-border)',
          textAlign: 'center',
        }}
      >
        <i
          className="pi pi-lock"
          style={{ color: 'var(--pos-danger)', fontSize: '2.5rem' }}
        />
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--pos-text-primary)' }}>
          Acceso no autorizado
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--pos-text-secondary)' }}>
          Tu usuario no tiene permisos para acceder a esta seccion.
        </p>
        <Button
          icon="pi pi-arrow-left"
          label="Volver al POS"
          onClick={() => navigate('/pos')}
          style={{
            backgroundColor: 'var(--pos-accent)',
            border: 'none',
            borderRadius: '8px',
          }}
        />
      </div>
    </AuthLayout>
  )
}
