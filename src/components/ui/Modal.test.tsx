import { render, screen } from '@testing-library/react'
import React from 'react'
import Modal from './Modal'

describe('Modal (contract)', () => {
  it('renders content when open', () => {
    render(<Modal open>Modal content</Modal>)
    expect(screen.getByRole('dialog')).toHaveTextContent('Modal content')
  })
})


