import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Button from './Button'
import Input from './Input'
import Label from './Label'

describe('Atoms', () => {
  it('renderiza Button con cada variante', () => {
    render(
      <>
        <Button label="Primario" variant="primary" />
        <Button label="Secundario" variant="secondary" />
        <Button label="Peligro" variant="danger" />
      </>,
    )

    expect(screen.getByRole('button', { name: 'Primario' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Secundario' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Peligro' })).toBeInTheDocument()
  })

  it('Input muestra estado de error', () => {
    render(<Input error="Campo requerido" placeholder="Usuario" />)

    const input = screen.getByPlaceholderText('Usuario')
    expect(input).toHaveClass('p-invalid')
  })

  it('Label muestra indicador de requerido', () => {
    render(<Label text="Nombre" required />)

    expect(screen.getByText('Nombre')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
  })
})
