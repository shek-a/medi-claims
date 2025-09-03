"use client";

import React from 'react'

export type DateCellProps = { value: string | Date | null | undefined }

export default function DateCell({ value }: DateCellProps) {
  let text = ''
  if (value) {
    const d = typeof value === 'string' ? new Date(value) : value
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    text = `${yyyy}/${mm}/${dd}`
  }
  return <div data-testid="date-cell">{text}</div>
}


