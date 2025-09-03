"use client";

import React from 'react'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export default function Input(props: InputProps) {
  const { className = '', ...rest } = props
  return <input {...rest} className={`border rounded px-2 py-1 ${className}`.trim()} />
}


