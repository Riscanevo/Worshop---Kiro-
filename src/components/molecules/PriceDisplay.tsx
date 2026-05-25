import { formatCurrency } from '../../lib/currency'

export interface PriceDisplayProps {
  amount: number
  label?: string
  size?: 'small' | 'medium' | 'large'
  highlight?: boolean
  className?: string
}

export default function PriceDisplay({
  amount,
  label,
  size = 'medium',
  highlight = false,
  className = '',
}: PriceDisplayProps) {
  const sizeStyles: Record<string, React.CSSProperties> = {
    small: { fontSize: '0.875rem' },
    medium: { fontSize: '1rem' },
    large: { fontSize: '1.5rem', fontWeight: 'bold' },
  }

  const containerStyle: React.CSSProperties = {
    color: highlight ? 'var(--pos-accent)' : 'var(--pos-text-primary)',
    ...sizeStyles[size],
  }

  return (
    <div className={`price-display ${className}`} style={containerStyle}>
      {label && (
        <span
          style={{
            color: 'var(--pos-text-secondary)',
            fontSize: '0.875em',
            marginRight: '0.5rem',
          }}
        >
          {label}:
        </span>
      )}
      <span style={{ fontWeight: highlight ? 'bold' : 'normal' }}>
        {formatCurrency(amount)}
      </span>
    </div>
  )
}
