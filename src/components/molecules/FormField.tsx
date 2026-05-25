import { ReactNode } from 'react'
import Label from '../atoms/Label'

export interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: ReactNode
  htmlFor?: string
  className?: string
}

export default function FormField({
  label,
  error,
  required = false,
  children,
  htmlFor,
  className = '',
}: FormFieldProps) {
  return (
    <div className={`form-field ${className}`} style={{ marginBottom: '1rem' }}>
      <Label text={label} required={required} htmlFor={htmlFor} />
      {children}
      {error && (
        <small
          style={{
            color: 'var(--pos-danger)',
            display: 'block',
            marginTop: '0.25rem',
            fontSize: '0.875rem',
          }}
        >
          {error}
        </small>
      )}
    </div>
  )
}
