import { render, screen } from '@testing-library/react'
import React from 'react'
import CurrencyCell from './CurrencyCell'

describe('CurrencyCell (contract)', () => {
  it('renders currency with $ prefix and thousand separators', () => {
    const value = 8740
    render(<CurrencyCell value={value} />)
    const el = screen.getByTestId('currency-cell')
    expect(el).toHaveTextContent('$8,740.00')
  })
})


