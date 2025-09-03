import { loadClaimsData, loadFilterOptions } from './loaders'
import { listClaims, distinctOptions } from '@/lib/database/claims.repo'

// Mock the repository module
jest.mock('@/lib/database/claims.repo', () => ({
  listClaims: jest.fn(),
  distinctOptions: jest.fn(),
}))

// Mock Clerk auth
jest.mock('@clerk/nextjs', () => ({
  auth: jest.fn(() => ({ userId: 'user123' })),
}))

describe('Dashboard Loaders', () => {
  const mockListClaims = listClaims as jest.MockedFunction<typeof listClaims>
  const mockDistinctOptions = distinctOptions as jest.MockedFunction<typeof distinctOptions>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('loadClaimsData', () => {
    it('loads claims data with default parameters when none provided', async () => {
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

      const result = await loadClaimsData()

      expect(mockListClaims).toHaveBeenCalledWith(
        { page: 1, limit: 25 },
        {},
        { field: 'service_date', order: 'desc' },
        ''
      )
      expect(result).toEqual(mockData)
    })

    it('loads claims data with search parameters from URL', async () => {
      const mockData = {
        data: [{ claim: 1001, patient: 'Jane Doe', status: 'Verified' }],
        totalCount: 1,
        page: 2,
        limit: 50,
        totalPages: 1,
      }

      mockListClaims.mockResolvedValue(mockData)

      const result = await loadClaimsData({
        page: '2',
        limit: '50',
        search: 'hernia',
        hospital: 'Calvary',
        status: 'Verified',
      })

      expect(mockListClaims).toHaveBeenCalledWith(
        { page: 2, limit: 50 },
        { hospital: 'Calvary', status: 'Verified' },
        { field: 'service_date', order: 'desc' },
        'hernia'
      )
      expect(result).toEqual(mockData)
    })

    it('handles invalid URL parameters gracefully', async () => {
      const mockData = {
        data: [],
        totalCount: 0,
        page: 1,
        limit: 25,
        totalPages: 0,
      }

      mockListClaims.mockResolvedValue(mockData)

      const result = await loadClaimsData({
        page: 'invalid',
        limit: 'invalid',
        search: '',
        hospital: '',
        status: '',
      })

      expect(mockListClaims).toHaveBeenCalledWith(
        { page: 1, limit: 25 }, // Default values for invalid params
        {}, // Empty filters for empty values
        { field: 'service_date', order: 'desc' },
        ''
      )
      expect(result).toEqual(mockData)
    })

    it('clamps page and limit values to valid ranges', async () => {
      const mockData = {
        data: [],
        totalCount: 0,
        page: 1,
        limit: 200,
        totalPages: 0,
      }

      mockListClaims.mockResolvedValue(mockData)

      const result = await loadClaimsData({
        page: '0', // Invalid: should clamp to 1
        limit: '1000', // Invalid: should clamp to 200
      })

      expect(mockListClaims).toHaveBeenCalledWith(
        { page: 1, limit: 200 }, // Clamped values
        {},
        { field: 'service_date', order: 'desc' },
        ''
      )
      expect(result).toEqual(mockData)
    })
  })

  describe('loadFilterOptions', () => {
    it('loads distinct filter options for hospitals, providers, and statuses', async () => {
      const mockOptions = {
        hospitals: ['Calvary', 'SJOG', 'St Vincent\'s'],
        providers: ['0055600D', '0055601E'],
        statuses: ['Verified', 'Paid', 'Assessed'],
      }

      mockDistinctOptions.mockResolvedValue(mockOptions)

      const result = await loadFilterOptions()

      expect(mockDistinctOptions).toHaveBeenCalled()
      expect(result).toEqual(mockOptions)
      expect(result.hospitals).toContain('Calvary')
      expect(result.providers).toContain('0055600D')
      expect(result.statuses).toContain('Verified')
    })

    it('handles empty filter options gracefully', async () => {
      const mockOptions = {
        hospitals: [],
        providers: [],
        statuses: [],
      }

      mockDistinctOptions.mockResolvedValue(mockOptions)

      const result = await loadFilterOptions()

      expect(result.hospitals).toEqual([])
      expect(result.providers).toEqual([])
      expect(result.statuses).toEqual([])
    })

    it('sorts filter options alphabetically', async () => {
      const mockOptions = {
        hospitals: ['SJOG', 'Calvary', 'St Vincent\'s'],
        providers: ['0055601E', '0055600D'],
        statuses: ['Paid', 'Assessed', 'Verified'],
      }

      mockDistinctOptions.mockResolvedValue(mockOptions)

      const result = await loadFilterOptions()

      expect(result.hospitals).toEqual(['Calvary', 'SJOG', 'St Vincent\'s'])
      expect(result.providers).toEqual(['0055600D', '0055601E'])
      expect(result.statuses).toEqual(['Assessed', 'Paid', 'Verified'])
    })
  })
})
