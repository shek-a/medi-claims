import React from 'react'

describe('columns config (contract)', () => {
  it('exports an array of column definitions with keys and headers', async () => {
    const mod = await import('./columns')
    const cols = mod.columns
    expect(Array.isArray(cols)).toBe(true)
    expect(cols.length).toBeGreaterThan(0)
    expect(cols[0]).toHaveProperty('key')
    expect(cols[0]).toHaveProperty('header')
  })
})


