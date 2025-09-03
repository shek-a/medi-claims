describe('defaults config (contract)', () => {
  it('exports default page size and visible columns', async () => {
    const mod = await import('./defaults')
    expect(mod.DEFAULT_PAGE_SIZE).toBeGreaterThan(0)
    expect(Array.isArray(mod.DEFAULT_VISIBLE_COLUMNS)).toBe(true)
  })
})


