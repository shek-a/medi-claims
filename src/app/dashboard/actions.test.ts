import { searchClaims, exportClaims, updateClaimStatus } from './actions'
import { listClaims, exportClaims as repoExportClaims } from '@/lib/database/claims.repo'

// Mock the repository module
jest.mock('@/lib/database/claims.repo', () => ({
  listClaims: jest.fn(),
  exportClaims: jest.fn(),
}))

// Mock Clerk server auth
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(() => ({ userId: 'user123' })),
}))

describe('Dashboard Server Actions', () => {
  const mockListClaims = listClaims as jest.MockedFunction<typeof listClaims>
  const mockRepoExportClaims = repoExportClaims as jest.MockedFunction<typeof repoExportClaims>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('searchClaims', () => {
    it('calls repository with search parameters and returns paginated results', async () => {
      const mockData = {
        data: [
          { claim: 1001, patient: 'Jane Doe', status: 'Verified' },
          { claim: 1002, patient: 'John Smith', status: 'Paid' },
        ],
        totalCount: 2,
        page: 1,
        limit: 25,
        totalPages: 1,
      }

      mockListClaims.mockResolvedValue(mockData)

      const result = await searchClaims({
        page: 1,
        limit: 25,
        search: 'hernia',
        filters: { hospital: 'Calvary' },
        sort: { field: 'service_date', order: 'desc' },
      })

      expect(mockListClaims).toHaveBeenCalledWith(
        { page: 1, limit: 25 },
        { hospital: 'Calvary' },
        { field: 'service_date', order: 'desc' },
        'hernia'
      )
      expect(result).toEqual(mockData)
    })

    it('handles empty search and filters gracefully', async () => {
      const mockData = {
        data: [],
        totalCount: 0,
        page: 1,
        limit: 25,
        totalPages: 0,
      }

      mockListClaims.mockResolvedValue(mockData)

      const result = await searchClaims({
        page: 1,
        limit: 25,
        search: '',
        filters: {},
        sort: { field: 'service_date', order: 'desc' },
      })

      expect(mockListClaims).toHaveBeenCalledWith(
        { page: 1, limit: 25 },
        {},
        { field: 'service_date', order: 'desc' },
        ''
      )
      expect(result).toEqual(mockData)
    })

    it('validates input parameters before calling repository', async () => {
      const result = await searchClaims({
        page: 0, // Invalid page
        limit: 1000, // Invalid limit
        search: 'test',
        filters: {},
        sort: { field: 'service_date', order: 'desc' },
      })

      // Should clamp invalid values
      expect(mockListClaims).toHaveBeenCalledWith(
        { page: 1, limit: 200 }, // Clamped values
        {},
        { field: 'service_date', order: 'desc' },
        'test'
      )
    })
  })

  describe('exportClaims', () => {
    it('calls repository export function and returns CSV data', async () => {
      const mockExportData = [
        { claim: 1001, patient: 'Jane Doe', status: 'Verified' },
        { claim: 1002, patient: 'John Smith', status: 'Paid' },
      ]

      mockRepoExportClaims.mockResolvedValue(mockExportData)

      const result = await exportClaims({
        search: 'hernia',
        filters: { hospital: 'Calvary' },
        sort: { field: 'service_date', order: 'desc' },
        format: 'csv',
      })

      expect(mockRepoExportClaims).toHaveBeenCalledWith(
        { hospital: 'Calvary' },
        { field: 'service_date', order: 'desc' },
        'hernia'
      )
      expect(result).toContain('claim,patient,status')
      expect(result).toContain('1001,Jane Doe,Verified')
      expect(result).toContain('1002,John Smith,Paid')
    })

    it('handles empty export data gracefully', async () => {
      mockRepoExportClaims.mockResolvedValue([])

      const result = await exportClaims({
        search: '',
        filters: {},
        sort: { field: 'service_date', order: 'desc' },
        format: 'csv',
      })

      expect(result).toContain('claim,patient,status')
      expect(result).not.toContain('1001,Jane Doe,Verified')
    })
  })

  describe('updateClaimStatus', () => {
    it('validates claim status updates', async () => {
      const result = await updateClaimStatus({
        claimId: '1001',
        status: 'InvalidStatus', // Invalid status
        notes: 'Test update',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid status')
    })

    it('accepts valid claim status updates', async () => {
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
