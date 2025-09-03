import { loadClaimsData, loadFilterOptions } from './loaders'
import { searchClaims, exportClaims, updateClaimStatus } from './actions'

// Mock the repository module
jest.mock('@/lib/database/claims.repo', () => ({
  listClaims: jest.fn(),
  distinctOptions: jest.fn(),
  exportClaims: jest.fn(),
}))

// Mock Clerk server auth
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(() => ({ userId: 'user123' })),
}))

describe('Dashboard Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('loaders', () => {
    it('loadClaimsData parses URL parameters correctly', async () => {
      const { listClaims } = await import('@/lib/database/claims.repo')
      ;(listClaims as jest.Mock).mockResolvedValue({
        data: [],
        totalCount: 0,
        page: 1,
        limit: 25,
        totalPages: 0,
      })

      const result = await loadClaimsData({
        page: '2',
        limit: '50',
        search: 'hernia',
        hospital: 'Calvary',
      })

      expect(listClaims).toHaveBeenCalledWith(
        { page: 2, limit: 50 },
        { hospital: 'Calvary' },
        { field: 'service_date', order: 'desc' },
        'hernia'
      )
    })

    it('loadClaimsData clamps invalid values', async () => {
      const { listClaims } = await import('@/lib/database/claims.repo')
      ;(listClaims as jest.Mock).mockResolvedValue({
        data: [],
        totalCount: 0,
        page: 1,
        limit: 200,
        totalPages: 0,
      })

      const result = await loadClaimsData({
        page: '0', // Should clamp to 1
        limit: '1000', // Should clamp to 200
      })

      expect(listClaims).toHaveBeenCalledWith(
        { page: 1, limit: 200 }, // Clamped values
        {},
        { field: 'service_date', order: 'desc' },
        ''
      )
    })

    it('loadFilterOptions returns sorted options', async () => {
      const { distinctOptions } = await import('@/lib/database/claims.repo')
      ;(distinctOptions as jest.Mock).mockResolvedValue({
        hospitals: ['SJOG', 'Calvary'],
        providers: ['0055601E', '0055600D'],
        statuses: ['Paid', 'Assessed'],
      })

      const result = await loadFilterOptions()

      expect(result.hospitals).toEqual(['Calvary', 'SJOG'])
      expect(result.providers).toEqual(['0055600D', '0055601E'])
      expect(result.statuses).toEqual(['Assessed', 'Paid'])
    })
  })

  describe('actions', () => {
    it('searchClaims validates and clamps parameters', async () => {
      const { listClaims } = await import('@/lib/database/claims.repo')
      ;(listClaims as jest.Mock).mockResolvedValue({
        data: [],
        totalCount: 0,
        page: 1,
        limit: 200,
        totalPages: 0,
      })

      const result = await searchClaims({
        page: 0,
        limit: 1000,
        search: 'test',
        filters: {},
        sort: { field: 'service_date', order: 'desc' },
      })

      expect(listClaims).toHaveBeenCalledWith(
        { page: 1, limit: 200 }, // Clamped values
        {},
        { field: 'service_date', order: 'desc' },
        'test'
      )
    })

    it('exportClaims converts data to CSV format', async () => {
      const { exportClaims: repoExportClaims } = await import('@/lib/database/claims.repo')
      ;(repoExportClaims as jest.Mock).mockResolvedValue([
        { claim: 1001, patient: 'Jane Doe', status: 'Verified' },
        { claim: 1002, patient: 'John Smith', status: 'Paid' },
      ])

      const result = await exportClaims({
        search: 'hernia',
        filters: { hospital: 'Calvary' },
        sort: { field: 'service_date', order: 'desc' },
        format: 'csv',
      })

      expect(result).toContain('claim,patient,status')
      expect(result).toContain('1001,Jane Doe,Verified')
      expect(result).toContain('1002,John Smith,Paid')
    })

    it('updateClaimStatus validates status values', async () => {
      const result = await updateClaimStatus({
        claimId: '1001',
        status: 'InvalidStatus',
        notes: 'Test update',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid status')
    })

    it('updateClaimStatus accepts valid status values', async () => {
      const result = await updateClaimStatus({
        claimId: '1001',
        status: 'Verified',
        notes: 'Claim verified by admin',
      })

      expect(result.success).toBe(true)
      expect(result.claimId).toBe('1001')
      expect(result.status).toBe('Verified')
    })
  })
})