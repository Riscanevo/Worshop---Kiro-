interface Shortcut {
  key: string
  label: string
}

const SHORTCUTS: Shortcut[] = [
  { key: 'F1', label: 'Buscar' },
  { key: 'F2', label: 'Eliminar último' },
  { key: 'F3', label: 'Limpiar carrito' },
  { key: 'F4', label: 'Escanear' },
  { key: 'F5', label: 'Cobrar' },
  { key: 'F8', label: 'Nueva venta' },
  { key: 'F9', label: 'Cerrar sesión' },
  { key: 'Esc', label: 'Cerrar modal' },
]

export default function KeyboardShortcutsPanel() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--pos-bg-secondary)',
        borderTop: '1px solid var(--pos-border)',
        padding: '0.5rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      {SHORTCUTS.map(({ key, label }, index) => (
        <div
          key={key}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.2rem 0.75rem',
            borderRight: index < SHORTCUTS.length - 1 ? '1px solid var(--pos-border)' : 'none',
          }}
        >
          <kbd
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '34px',
              height: '22px',
              padding: '0 5px',
              backgroundColor: 'var(--pos-accent)',
              color: 'white',
              borderRadius: '5px',
              fontSize: '0.68rem',
              fontWeight: 700,
              fontFamily: 'monospace',
              flexShrink: 0,
              boxShadow: '0 2px 0 rgba(0,0,0,0.35)',
              letterSpacing: '0.02em',
            }}
          >
            {key}
          </kbd>
          <span
            style={{
              color: 'var(--pos-text-secondary)',
              fontSize: '0.75rem',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </footer>
  )
}
