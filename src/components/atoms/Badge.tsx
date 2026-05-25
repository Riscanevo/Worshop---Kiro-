import { Badge as PrimeBadge, BadgeProps as PrimeBadgeProps } from 'primereact/badge'

export interface BadgeProps extends Omit<PrimeBadgeProps, 'size'> {
  size?: 'small' | 'medium' | 'large'
}

export default function Badge({ size = 'medium', className = '', ...props }: BadgeProps) {
  const sizeClasses: Record<string, string> = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  }

  const combinedClassName = `${sizeClasses[size]} ${className}`.trim()

  return <PrimeBadge {...props} className={combinedClassName} />
}
