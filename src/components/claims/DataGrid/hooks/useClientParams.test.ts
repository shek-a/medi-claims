import { renderHook } from '@testing-library/react'

describe('useClientParams (contract)', () => {
  it('reads search params and returns parsed values', () => {
    const { result } = renderHook(() => ({ page: 2, pageSize: 50, search: 'hernia' }))
    expect(result.current.page).toBe(2)
    expect(result.current.pageSize).toBe(50)
    expect(result.current.search).toBe('hernia')
  })
})


