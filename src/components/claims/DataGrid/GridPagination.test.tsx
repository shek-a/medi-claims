import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import GridPagination from './GridPagination'

describe('GridPagination (contract)', () => {
  it('shows range text and triggers page/pageSize changes', () => {
    const onPageChange = jest.fn()
    const onPageSizeChange = jest.fn()
    const total = 120
    const page = 2
    const pageSize = 25

    // Range: 26-50 of 120
    const start = (page - 1) * pageSize + 1
    const end = Math.min(page * pageSize, total)

    render(
      <GridPagination totalCount={total} page={page} pageSize={pageSize} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />
    )

    expect(screen.getByLabelText('Range').textContent).toBe('26-50 of 120')
    fireEvent.click(screen.getByLabelText('Next'))
    expect(onPageChange).toHaveBeenCalledWith(3)
    fireEvent.change(screen.getByLabelText('Page size'), { target: { value: '50' } })
    expect(onPageSizeChange).toHaveBeenCalledWith(50)
  })
})


