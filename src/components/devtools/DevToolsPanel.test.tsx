import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ButtonHTMLAttributes, ChangeEvent, ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import DevToolsPanel from './DevToolsPanel'
import { requestLogger } from '../../services/requestLogger'

vi.mock('primereact/sidebar', () => ({
  Sidebar: ({ visible, children, header }: { visible: boolean; children: ReactNode; header?: ReactNode }) =>
    visible ? (
      <div data-testid="mock-sidebar">
        {header}
        {children}
      </div>
    ) : null,
}))

vi.mock('primereact/button', () => ({
  Button: ({ onClick, children, label, icon, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label?: string; icon?: string }) => (
    <button type="button" onClick={onClick} {...props}>
      {label ?? children ?? icon ?? 'button'}
    </button>
  ),
}))

vi.mock('primereact/datatable', () => ({
  DataTable: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

vi.mock('primereact/column', () => ({
  Column: () => null,
}))

vi.mock('primereact/dropdown', () => ({
  Dropdown: ({ value, onChange, options, placeholder }: {
    value: string
    onChange: (event: { value: string }) => void
    options: Array<{ value: string; label: string }>
    placeholder: string
  }) => (
    <select
      aria-label={placeholder}
      value={value}
      onChange={(e) => onChange({ value: e.target.value })}
    >
      {options.map((option) => (
        <option key={String(option.value)} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}))

vi.mock('primereact/inputtext', () => ({
  InputText: ({ value, onChange, placeholder }: {
    value: string
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
    placeholder: string
  }) => <input value={value} onChange={onChange} placeholder={placeholder} />,
}))

beforeEach(() => {
  localStorage.clear()
  requestLogger.clearLogs()
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('DevToolsPanel', () => {
  it('no renderiza el boton flotante cuando DEV es false', () => {
    vi.stubEnv('DEV', false)

    render(<DevToolsPanel />)

    expect(screen.queryByTestId('devtools-toggle')).not.toBeInTheDocument()
  })

  it('abre el panel al hacer click en el boton flotante', async () => {
    vi.stubEnv('DEV', true)

    render(<DevToolsPanel />)

    await userEvent.click(screen.getByTestId('devtools-toggle'))

    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument()
    expect(screen.getByText('Developer Tools')).toBeInTheDocument()
  })

  it('el boton limpiar llama requestLogger.clearLogs()', async () => {
    vi.stubEnv('DEV', true)
    const clearSpy = vi.spyOn(requestLogger, 'clearLogs')

    render(<DevToolsPanel />)

    await userEvent.click(screen.getByTestId('devtools-toggle'))
    await userEvent.click(screen.getByTestId('devtools-clear'))

    expect(clearSpy).toHaveBeenCalledTimes(1)
  })
})
