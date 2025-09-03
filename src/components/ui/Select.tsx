"use client";

import React from 'react'

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>

export default function Select(props: SelectProps) {
  const { className = '', children, ...rest } = props
  return (
    <select {...rest} className={`border rounded px-2 py-1 ${className}`.trim()}>
      {children}
    </select>
  )
}


