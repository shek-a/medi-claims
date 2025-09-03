import { render, screen } from '@testing-library/react'
import React from 'react'
import Badge from './Badge'

describe('Badge (contract)', () => {
  it('renders a badge with text', () => {
    render(<Badge>Badge</Badge>)
    expect(screen.getByRole('status')).toHaveTextContent('Badge')
  })
})


