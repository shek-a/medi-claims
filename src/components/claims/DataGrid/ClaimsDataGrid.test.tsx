import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import ClaimsDataGrid, { type GridColumn } from './ClaimsDataGrid'

// NOTE: This test defines the expected public API and structure of ClaimsDataGrid.
// The component is not yet implemented; these tests describe required behavior.

const sampleColumns: GridColumn[] = [
  { key: 'claim', header: 'Claim' },
  { key: 'patient', header: 'Patient' },
  { key: 'status', header: 'Status' },
]

const sampleRows = [
  { claim: 1001, patient: 'Jane Doe', status: 'Verified' },
  { claim: 1002, patient: 'John Smith', status: 'Paid' },
]

describe('ClaimsDataGrid (contract)', () => {
  it('renders grid container, headers, and rows', () => {
    // Expected props shape for the component
    const props = {
      columns: sampleColumns,
      rows: sampleRows,
      totalCount: 2,
      page: 1,
      pageSize: 25,
      onPageChange: jest.fn(),
      onPageSizeChange: jest.fn(),
      onSearchChange: jest.fn(),
      onSortChange: jest.fn(),
      onFilterChange: jest.fn(),
    }

    render(<ClaimsDataGrid {...props} />)

    const grid = screen.getByTestId('claims-grid')
    expect(grid).toBeInTheDocument()

    // const table = screen.getByTestId('grid-table')
    // const headers = within(table).getAllByRole('columnheader', { hidden: true })
    // As we are using a fake table, fallback to checking header text exists
    expect(screen.getByText('Claim')).toBeInTheDocument()
    expect(screen.getByText('Patient')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()

    // Rows
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('John Smith')).toBeInTheDocument()
  })

  it('invokes handlers for search and pagination interactions', () => {
    const onSearchChange = jest.fn()
    const onPageChange = jest.fn()
    const onPageSizeChange = jest.fn()

    render(
      <ClaimsDataGrid
        columns={sampleColumns}
        rows={sampleRows}
        totalCount={2}
        page={2}
        pageSize={25}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onSearchChange={onSearchChange}
      />
    )

    fireEvent.change(screen.getByTestId('grid-search'), { target: { value: 'jane' } })
    expect(onSearchChange).toHaveBeenCalledWith('jane')

    fireEvent.click(screen.getByLabelText('Next page'))
    expect(onPageChange).toHaveBeenCalledWith(3)

    fireEvent.change(screen.getByLabelText('Page size'), { target: { value: '50' } })
    expect(onPageSizeChange).toHaveBeenCalledWith(50)
  })
})


