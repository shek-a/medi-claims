"use client";

import React from 'react'

export type StatusCellProps = {
  status: string
}

function mapVariant(status: string): 'success' | 'warning' | 'info' | 'danger' | 'neutral' {
  const s = status.toLowerCase()
  if (s === 'verified' || s === 'paid' || s === 'assessed') return 'success'
  if (s === 'received') return 'info'
  if (s === 'cancelled' || s === 'denied') return 'danger'
  return 'neutral'
}

export default function StatusCell({ status }: StatusCellProps) {
  const variant = mapVariant(status)
  return (
    <div data-testid="status-cell">
      <span data-variant={variant}>{status}</span>
    </div>
  )
}


