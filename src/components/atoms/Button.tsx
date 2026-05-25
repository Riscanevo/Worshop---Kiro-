import { Button as PrimeButton, ButtonProps as PrimeButtonProps } from 'primereact/button'
import { CSSProperties } from 'react'

export interface ButtonProps extends Omit<PrimeButtonProps, 'size' | 'variant'> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
}

export default function Button({
  variant = 'primary',
  size = 'medium',
  loading = false,
  style,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const variantStyles: Record<string, CSSProperties> = {
    primary: {
      backgroundColor: 'var(--pos-accent)',
      borderColor: 'var(--pos-accent)',
      color: 'var(--pos-text-primary)',
    },
    secondary: {
      backgroundColor: 'var(--pos-bg-tertiary)',
      borderColor: 'var(--pos-border)',
      color: 'var(--pos-text-primary)',
    },
    danger: {
      backgroundColor: 'var(--pos-danger)',
      borderColor: 'var(--pos-danger)',
      color: 'var(--pos-text-primary)',
    },
  }

  const sizeClasses: Record<string, string> = {
    small: 'p-button-sm',
    medium: '',
    large: 'p-button-lg',
  }

  const combinedStyle: CSSProperties = {
    ...variantStyles[variant],
    ...style,
  }

  const combinedClassName = `${sizeClasses[size]} ${className}`.trim()

  return (
    <PrimeButton
      {...props}
      style={combinedStyle}
      className={combinedClassName}
      loading={loading}
      disabled={disabled || loading}
    />
  )
}
