import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import Button from './Button'

describe('Button (contract)', () => {
  it('renders label and fires onClick', () => {
    const onClick = jest.fn()
    render(<Button onClick={onClick}>Click me</Button>)
    fireEvent.click(screen.getByText('Click me'))
    expect(onClick).toHaveBeenCalled()
  })
})


