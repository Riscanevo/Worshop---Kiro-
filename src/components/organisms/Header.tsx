import { Badge } from 'primereact/badge'
import { Button } from 'primereact/button'
import { usePOSStore } from '../../store/posStore'
import { useAuthStore } from '../../store/authStore'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '../../lib/currency'

export default function Header() {
  const { getCartCount, transactions } = usePOSStore()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())

  const userName = user?.name ?? 'Cajero'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const todaySales = transactions
    .filter((t) => {
      const today = new Date()
      return t.timestamp.toDateString() === today.toDateString()
    })
    .reduce((sum, t) => sum + t.total, 0)

  return (
    <header
      className="pos-header flex align-items-center justify-content-between px-4 py-3 pos-glass"
      style={{
        borderBottom: '1px solid var(--pos-border)',
        minHeight: '70px',
      }}
    >
      <div className="pos-header-brand flex align-items-center gap-4">
        <div className="flex align-items-center gap-3">
          <div
            className="flex align-items-center justify-content-center"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--pos-accent) 0%, #1d4ed8 100%)',
            }}
          >
            <i className="pi pi-shopping-cart text-2xl text-white"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold m-0" style={{ color: 'var(--pos-text-primary)' }}>
              SuperMarket POS
            </h1>
            <p className="text-sm m-0" style={{ color: 'var(--pos-text-secondary)' }}>
              Sistema de Punto de Venta
            </p>
          </div>
        </div>
      </div>

      <div className="pos-header-metrics flex align-items-center gap-5">
        <div
          className="flex align-items-center gap-3 px-4 py-2"
          style={{
            backgroundColor: 'var(--pos-bg-secondary)',
            borderRadius: '12px',
            border: '1px solid var(--pos-border)',
          }}
        >
          <i className="pi pi-calendar" style={{ color: 'var(--pos-accent)' }}></i>
          <div>
            <p className="text-xs m-0" style={{ color: 'var(--pos-text-secondary)' }}>
              Fecha
            </p>
            <p className="text-sm font-semibold m-0" style={{ color: 'var(--pos-text-primary)' }}>
              {format(currentTime, "dd 'de' MMMM, yyyy", { locale: es })}
            </p>
          </div>
        </div>

        <div
          className="flex align-items-center gap-3 px-4 py-2"
          style={{
            backgroundColor: 'var(--pos-bg-secondary)',
            borderRadius: '12px',
            border: '1px solid var(--pos-border)',
          }}
        >
          <i className="pi pi-clock" style={{ color: 'var(--pos-accent)' }}></i>
          <div>
            <p className="text-xs m-0" style={{ color: 'var(--pos-text-secondary)' }}>
              Hora
            </p>
            <p className="text-sm font-semibold m-0" style={{ color: 'var(--pos-text-primary)' }}>
              {format(currentTime, 'HH:mm:ss')}
            </p>
          </div>
        </div>

        <div
          className="flex align-items-center gap-3 px-4 py-2"
          style={{
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(34, 197, 94, 0.3)',
          }}
        >
          <i className="pi pi-dollar" style={{ color: 'var(--pos-success)' }}></i>
          <div>
            <p className="text-xs m-0" style={{ color: 'var(--pos-text-secondary)' }}>
              Ventas Hoy
            </p>
            <p className="text-sm font-bold m-0" style={{ color: 'var(--pos-success)' }}>
              {formatCurrency(todaySales)}
            </p>
          </div>
        </div>

        <div
          className="flex align-items-center gap-3 px-4 py-2"
          style={{
            backgroundColor: 'var(--pos-bg-secondary)',
            borderRadius: '12px',
            border: '1px solid var(--pos-border)',
          }}
        >
          <i className="pi pi-user" style={{ color: 'var(--pos-accent)' }}></i>
          <div>
            <p className="text-xs m-0" style={{ color: 'var(--pos-text-secondary)' }}>
              Cajero
            </p>
            <p className="text-sm font-semibold m-0" style={{ color: 'var(--pos-text-primary)' }}>
              {userName}
            </p>
          </div>
          <Badge value={getCartCount()} severity="info" className="ml-2" />
        </div>

        {/* Logout button */}
        <Button
          icon="pi pi-sign-out"
          className="p-button-text p-button-sm"
          tooltip="Cerrar sesión"
          tooltipOptions={{ position: 'bottom' }}
          style={{ color: 'var(--pos-text-secondary)' }}
          onClick={handleLogout}
        />
      </div>
    </header>
  )
}
