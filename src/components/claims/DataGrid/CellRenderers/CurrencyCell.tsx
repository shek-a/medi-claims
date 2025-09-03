"use client";

import React from 'react'

export type CurrencyCellProps = { value: number | null | undefined }

export default function CurrencyCell({ value }: CurrencyCellProps) {
  const formatted = typeof value === 'number'
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'AUD' }).format(value)
    : ''
  return <div data-testid="currency-cell">{formatted}</div>
}


