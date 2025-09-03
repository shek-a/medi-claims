"use client";

import React from 'react'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export default function Button(props: ButtonProps) {
  const { className = '', ...rest } = props
  return (
    <button {...rest} className={`px-3 py-1 rounded border ${className}`.trim()} />
  )
}


