"use client";

import React from 'react'

export type StatusBadgeProps = {
  status: string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span data-testid="status-badge" data-status={status}>{status}</span>
  )
}


