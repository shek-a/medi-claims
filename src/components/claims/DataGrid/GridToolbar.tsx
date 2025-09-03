"use client";

import React from 'react'

export type GridToolbarProps = {
  onSearchChange: (value: string) => void
  onExport?: () => void
  onOpenColumnSettings?: () => void
}

export default function GridToolbar({ onSearchChange, onExport, onOpenColumnSettings }: GridToolbarProps) {
  const onClear = () => onSearchChange('')
  return (
    <div className="flex items-center gap-2">
      <input
        aria-label="Search"
        placeholder="Search claims"
        className="border rounded px-2 py-1"
        onChange={(e) => onSearchChange((e.target as HTMLInputElement).value)}
      />
      <button aria-label="Clear search" className="px-2 py-1 border rounded" onClick={onClear}>Clear</button>
      <button aria-label="Export" className="px-2 py-1 border rounded" onClick={onExport}>Export</button>
      <button aria-label="Column settings" className="px-2 py-1 border rounded" onClick={onOpenColumnSettings}>Columns</button>
    </div>
  )
}


