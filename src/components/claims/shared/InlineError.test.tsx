import { render, screen } from '@testing-library/react'
import React from 'react'
import InlineError from './InlineError'

describe('InlineError (contract)', () => {
  it('renders an inline error message', () => {
    render(<InlineError message="Something went wrong" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong')
  })
})


