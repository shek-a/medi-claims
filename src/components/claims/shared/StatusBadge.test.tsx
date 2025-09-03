import { render, screen } from '@testing-library/react'
import React from 'react'
import StatusBadge from './StatusBadge'

describe('StatusBadge (contract)', () => {
  it('renders text and applies style by status', () => {
    render(<StatusBadge status="Verified" />)
    const el = screen.getByTestId('status-badge')
    expect(el.textContent).toBe('Verified')
    expect(el.getAttribute('data-status')).toBe('Verified')
  })
})


