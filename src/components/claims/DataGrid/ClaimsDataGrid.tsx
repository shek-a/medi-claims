"use client";

import React from 'react'

export type GridColumn = {
  key: string
  header: string
}

export type ClaimsDataGridProps<Row extends Record<string, any> = Record<string, any>> = {
  columns: GridColumn[]
  rows: Row[]
  totalCount: number
  page: number
  pageSize: number
  onPageChange: (nextPage: number) => void
  onPageSizeChange: (nextSize: number) => void
  onSearchChange: (value: string) => void
  onSortChange?: (field: string, order: 'asc' | 'desc') => void
  onFilterChange?: (filters: Record<string, any>) => void
}

export default function ClaimsDataGrid<Row extends Record<string, any>>({
  columns,
  rows,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
}: ClaimsDataGridProps<Row>) {
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalCount)

  return (
    <div data-testid="claims-grid" className="w-full overflow-auto">
      <div className="mb-2">
        <input
          data-testid="grid-search"
          aria-label="Search"
          placeholder="Search claims"
          className="border rounded px-2 py-1 w-full max-w-md"
          onChange={(e) => onSearchChange((e.target as HTMLInputElement).value)}
        />
      </div>
      <div data-testid="grid-table" className="w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="border-b py-2 font-medium">
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-b last:border-0">
                {columns.map((c) => (
                  <td key={c.key} className="py-2">
                    {String(row[c.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div data-testid="grid-pagination" className="mt-3 flex items-center justify-between gap-3">
        <div aria-label="Range" className="text-sm text-gray-600">
          {totalCount === 0 ? '0-0 of 0' : `${start}-${end} of ${totalCount}`}
        </div>
        <div className="flex items-center gap-2">
          <button aria-label="Previous page" className="px-2 py-1 border rounded" onClick={() => onPageChange(Math.max(1, page - 1))}>Prev</button>
          <button aria-label="Next page" className="px-2 py-1 border rounded" onClick={() => onPageChange(page + 1)}>Next</button>
          <label className="text-sm text-gray-600" htmlFor="page-size-select">Page size</label>
          <select id="page-size-select" aria-label="Page size" className="px-2 py-1 border rounded"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number((e.target as HTMLSelectElement).value))}
          >
            {[25, 50, 100].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}


