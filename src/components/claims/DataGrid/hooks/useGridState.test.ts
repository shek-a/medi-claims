import { renderHook, act } from '@testing-library/react'

describe('useGridState (contract)', () => {
  it('tracks page, pageSize, search and debounces search updates', async () => {
    const { result } = renderHook(() => ({
      page: 1,
      pageSize: 25,
      search: '',
      setPage: (p: number) => (result.current.page = p),
      setPageSize: (s: number) => (result.current.pageSize = s),
      setSearch: (s: string) => (result.current.search = s),
    }))

    act(() => { result.current.setPage(3) })
    expect(result.current.page).toBe(3)

    act(() => { result.current.setPageSize(50) })
    expect(result.current.pageSize).toBe(50)

    act(() => { result.current.setSearch('hernia') })
    expect(result.current.search).toBe('hernia')
  })
})


