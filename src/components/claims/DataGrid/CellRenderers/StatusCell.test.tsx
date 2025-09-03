import { render, screen } from '@testing-library/react'
import React from 'react'
import StatusCell from './StatusCell'

describe('StatusCell (contract)', () => {
  it('renders a badge with status text and variant mapping', () => {
    const status = 'Verified'
    render(<StatusCell status={status} />)
    const el = screen.getByTestId('status-cell')
    expect(el).toBeInTheDocument()
    expect(el.querySelector('[data-variant="success"]')?.textContent).toBe('Verified')
  })
})


