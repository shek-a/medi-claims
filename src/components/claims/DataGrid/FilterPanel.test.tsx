import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import FilterPanel from './FilterPanel'

describe('FilterPanel (contract)', () => {
  it('groups filters and emits onChange with merged values', () => {
    const onChange = jest.fn()
    const initial = { hospital: [], status: [], claim_type: [] }
    render(<FilterPanel value={initial} onChange={onChange} />)

    fireEvent.change(screen.getByLabelText('Hospital'), { target: { value: 'Calvary' } })
    expect(onChange).toHaveBeenCalledWith({ hospital: ['Calvary'], status: [], claim_type: [], episode_id: undefined })

    fireEvent.change(screen.getByLabelText('Claim Status'), { target: { value: 'Paid' } })
    expect(onChange).toHaveBeenCalledWith({ hospital: [], status: ['Paid'], claim_type: [], episode_id: undefined })

    fireEvent.change(screen.getByLabelText('Episode ID'), { target: { value: '123' } })
    expect(onChange).toHaveBeenCalledWith({ hospital: [], status: [], claim_type: [], episode_id: 123 })
  })
})


