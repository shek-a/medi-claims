"use client";

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'

export function useClientParams() {
  const params = useSearchParams()
  return useMemo(() => {
    const page = Number(params.get('page') ?? '1')
    const pageSize = Number(params.get('pageSize') ?? '25')
    const search = params.get('search') ?? ''
    return { page, pageSize, search }
  }, [params])
}


