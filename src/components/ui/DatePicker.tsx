"use client";

import React from 'react'

export type DatePickerProps = React.InputHTMLAttributes<HTMLInputElement>

export default function DatePicker(props: DatePickerProps) {
  return <input type="date" aria-label={props['aria-label'] || 'Date'} {...props} />
}


