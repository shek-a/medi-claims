"use client";

import React from 'react'

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement>

export default function Badge({ children, className = '', ...rest }: BadgeProps) {
  return (
    <span role="status" className={`inline-block rounded px-2 py-0.5 text-xs ${className}`.trim()} {...rest}>
      {children}
    </span>
  )
}


