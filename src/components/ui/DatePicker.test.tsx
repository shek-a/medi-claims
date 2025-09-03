import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import DatePicker from './DatePicker'

describe('DatePicker (contract)', () => {
  it('renders an input that accepts date and fires onChange', () => {
    const onChange = jest.fn()
    render(<DatePicker aria-label="Date" onChange={onChange} />)
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2024-03-13' } })
    expect(onChange).toHaveBeenCalled()
  })
})


