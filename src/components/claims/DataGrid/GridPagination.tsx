"use client";

import React from 'react'

export type GridPaginationProps = {
  totalCount: number
  page: number
  pageSize: number
  onPageChange: (next: number) => void
  onPageSizeChange: (size: number) => void
}

export default function GridPagination({ totalCount, page, pageSize, onPageChange, onPageSizeChange }: GridPaginationProps) {
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalCount)
  return (
    <div className="mt-3 flex items-center justify-between gap-3">
      <div aria-label="Range" className="text-sm text-gray-600">
        {totalCount === 0 ? '0-0 of 0' : `${start}-${end} of ${totalCount}`}
      </div>
      <div className="flex items-center gap-2">
        <button aria-label="Previous" className="px-2 py-1 border rounded" onClick={() => onPageChange(Math.max(1, page - 1))}>Prev</button>
        <button aria-label="Next" className="px-2 py-1 border rounded" onClick={() => onPageChange(page + 1)}>Next</button>
        <label className="text-sm text-gray-600" htmlFor="grid-page-size">Page size</label>
        <select id="grid-page-size" aria-label="Page size" className="px-2 py-1 border rounded"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number((e.target as HTMLSelectElement).value))}
        >
          {[25, 50, 100].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  )
}


