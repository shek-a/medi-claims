import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import GridToolbar from './GridToolbar'

describe('GridToolbar (contract)', () => {
  it('calls onSearchChange with debounced input (simulated immediate here)', () => {
    const onSearchChange = jest.fn()
    render(<GridToolbar onSearchChange={onSearchChange} />)

    fireEvent.change(screen.getByPlaceholderText('Search claims'), { target: { value: 'hernia' } })
    expect(onSearchChange).toHaveBeenCalledWith('hernia')

    fireEvent.click(screen.getByLabelText('Clear search'))
    expect(onSearchChange).toHaveBeenCalledWith('')
  })

  it('exposes buttons for export and column settings', () => {
    const onExport = jest.fn()
    const onSettings = jest.fn()
    render(<GridToolbar onSearchChange={() => {}} onExport={onExport} onOpenColumnSettings={onSettings} />)

    fireEvent.click(screen.getByLabelText('Export'))
    expect(onExport).toHaveBeenCalled()

    fireEvent.click(screen.getByLabelText('Column settings'))
    expect(onSettings).toHaveBeenCalled()
  })
})


