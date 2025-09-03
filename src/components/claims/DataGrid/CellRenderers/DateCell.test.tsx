import { render, screen } from '@testing-library/react'
import React from 'react'
import DateCell from './DateCell'

describe('DateCell (contract)', () => {
  it('renders date in YYYY/MM/DD format', () => {
    render(<DateCell value="2024-03-13" />)
    const el = screen.getByTestId('date-cell')
    expect(el).toHaveTextContent('2024/03/13')
  })
})


