import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import Input from './Input'

describe('Input (contract)', () => {
  it('renders input and fires onChange', () => {
    const onChange = jest.fn()
    render(<Input placeholder="Type" onChange={onChange} />)
    fireEvent.change(screen.getByPlaceholderText('Type'), { target: { value: 'x' } })
    expect(onChange).toHaveBeenCalled()
  })
})


