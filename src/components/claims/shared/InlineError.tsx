"use client";

import React from 'react'

export type InlineErrorProps = {
  message: string
}

export default function InlineError({ message }: InlineErrorProps) {
  return (
    <div role="alert" data-testid="inline-error">{message}</div>
  )
}


