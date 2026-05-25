import { CSSProperties } from 'react'

export interface IconProps {
  name: string
  size?: 'small' | 'medium' | 'large' | number
  color?: string
  spin?: boolean
  className?: string
  style?: CSSProperties
}

export default function Icon({
  name,
  size = 'medium',
  color,
  spin = false,
  className = '',
  style,
}: IconProps) {
  const sizeMap: Record<string, string> = {
    small: '0.875rem',
    medium: '1rem',
    large: '1.5rem',
  }

  const fontSize = typeof size === 'number' ? `${size}px` : sizeMap[size]

  const combinedStyle: CSSProperties = {
    fontSize,
    color: color || 'inherit',
    ...style,
  }

  const iconClass = `pi pi-${name} ${spin ? 'pi-spin' : ''} ${className}`.trim()

  return <i className={iconClass} style={combinedStyle} />
}
