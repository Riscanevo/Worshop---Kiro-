import { CSSProperties } from 'react'

export interface LabelProps {
  text: string
  required?: boolean
  htmlFor?: string
  className?: string
  style?: CSSProperties
}

export default function Label({
  text,
  required = false,
  htmlFor,
  className = '',
  style,
}: LabelProps) {
  const combinedStyle: CSSProperties = {
    color: 'var(--pos-text-primary)',
    fontWeight: 500,
    marginBottom: '0.5rem',
    display: 'block',
    ...style,
  }

  return (
    <label htmlFor={htmlFor} className={className} style={combinedStyle}>
      {text}
      {required && (
        <span style={{ color: 'var(--pos-danger)', marginLeft: '0.25rem' }}>*</span>
      )}
    </label>
  )
}
