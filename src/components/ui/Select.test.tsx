import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import Select from './Select'

describe('Select (contract)', () => {
  it('renders select with options and fires onChange', () => {
    const onChange = jest.fn()
    render(
      <Select aria-label="Select" onChange={onChange}>
        <option value="A">A</option>
        <option value="B">B</option>
      </Select>
    )
    fireEvent.change(screen.getByLabelText('Select'), { target: { value: 'B' } })
    expect(onChange).toHaveBeenCalled()
  })
})


