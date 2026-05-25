import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import FormField from './FormField'
import PriceDisplay from './PriceDisplay'
import SearchBar from './SearchBar'

// SearchBar uses PrimeReact InputText which renders a standard <input>
describe('SearchBar', () => {
  it('llama onChange al escribir en el input', async () => {
    const handleChange = vi.fn()
    render(<SearchBar value="" onChange={handleChange} placeholder="Buscar producto" />)

    const input = screen.getByPlaceholderText('Buscar producto')
    await userEvent.type(input, 'leche')

    expect(handleChange).toHaveBeenCalled()
    // Each keystroke triggers onChange with the new character
    expect(handleChange).toHaveBeenCalledWith('l')
    expect(handleChange).toHaveBeenCalledWith('e')
  })

  it('muestra el placeholder por defecto cuando no se provee', () => {
    render(<SearchBar value="" onChange={vi.fn()} />)
    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument()
  })

  it('refleja el valor actual en el input', () => {
    render(<SearchBar value="arroz" onChange={vi.fn()} />)
    const input = screen.getByDisplayValue('arroz')
    expect(input).toBeInTheDocument()
  })
})

// FormField wraps children with a label and optional error message
describe('FormField', () => {
  it('muestra el mensaje de error cuando se provee la prop error', () => {
    render(
      <FormField label="Correo" error="El correo es requerido">
        <input type="email" />
      </FormField>,
    )

    expect(screen.getByText('El correo es requerido')).toBeInTheDocument()
  })

  it('no muestra mensaje de error cuando no se provee la prop error', () => {
    render(
      <FormField label="Correo">
        <input type="email" />
      </FormField>,
    )

    expect(screen.queryByRole('note')).not.toBeInTheDocument()
    // Verify no error text is rendered
    const errorEl = document.querySelector('small')
    expect(errorEl).not.toBeInTheDocument()
  })

  it('muestra el label correctamente', () => {
    render(
      <FormField label="Nombre del producto">
        <input type="text" />
      </FormField>,
    )

    expect(screen.getByText('Nombre del producto')).toBeInTheDocument()
  })

  it('muestra el asterisco de requerido cuando required es true', () => {
    render(
      <FormField label="Campo" required>
        <input type="text" />
      </FormField>,
    )

    expect(screen.getByText('*')).toBeInTheDocument()
  })
})

// PriceDisplay formats amounts using the COP currency formatter
describe('PriceDisplay', () => {
  it('formatea el monto en pesos colombianos (COP)', () => {
    render(<PriceDisplay amount={15000} />)

    // Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }) produces "$ 15.000"
    const formatted = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(15000)

    expect(
      screen.getByText((content) => content.replace(/\s/g, '') === formatted.replace(/\s/g, '')),
    ).toBeInTheDocument()
  })

  it('muestra el label cuando se provee', () => {
    render(<PriceDisplay amount={5000} label="Total" />)

    expect(screen.getByText('Total:')).toBeInTheDocument()
  })

  it('no muestra label cuando no se provee', () => {
    render(<PriceDisplay amount={5000} />)

    expect(screen.queryByText(/:/)).not.toBeInTheDocument()
  })

  it('formatea correctamente montos de cero', () => {
    render(<PriceDisplay amount={0} />)

    const formatted = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(0)

    expect(
      screen.getByText((content) => content.replace(/\s/g, '') === formatted.replace(/\s/g, '')),
    ).toBeInTheDocument()
  })
})
