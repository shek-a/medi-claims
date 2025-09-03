"use client";

import { useCallback, useMemo, useState } from 'react'

export function useGridState(initial?: { page?: number; pageSize?: number; search?: string }) {
  const [page, setPage] = useState(initial?.page ?? 1)
  const [pageSize, setPageSize] = useState(initial?.pageSize ?? 25)
  const [search, setSearchState] = useState(initial?.search ?? '')

  const setSearch = useCallback((value: string) => {
    setSearchState(value)
  }, [])

  return useMemo(() => ({ page, pageSize, search, setPage, setPageSize, setSearch }), [page, pageSize, search, setPage, setPageSize, setSearch])
}


