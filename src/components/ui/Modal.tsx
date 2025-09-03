"use client";

import React from 'react'

export type ModalProps = {
  open: boolean
  children: React.ReactNode
}

export default function Modal({ open, children }: ModalProps) {
  if (!open) return null
  return (
    <div role="dialog" aria-modal="true">
      {children}
    </div>
  )
}


