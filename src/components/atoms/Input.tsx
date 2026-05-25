import { InputText, InputTextProps } from 'primereact/inputtext'
import { CSSProperties } from 'react'

export interface InputProps extends InputTextProps {
  error?: string
}

export default function Input({ error, style, className = '', ...props }: InputProps) {
  const combinedStyle: CSSProperties = {
    borderColor: error ? 'var(--pos-danger)' : undefined,
    ...style,
  }

  const combinedClassName = `${className} ${error ? 'p-invalid' : ''}`.trim()

  return (
    <InputText {...props} style={combinedStyle} className={combinedClassName} />
  )
}
