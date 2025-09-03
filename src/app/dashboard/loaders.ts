import { listClaims, distinctOptions } from '@/lib/database/claims.repo'
import type { ClaimsFilters, SortOption, PageResult, MedicalClaim } from '@/types/claims'

export interface LoaderParams {
  page?: string
  limit?: string
  search?: string
  hospital?: string
  status?: string
  claim_type?: string
  contract_type?: string
  provider?: string
  member_no?: string
  episode_id?: string
  cost_from?: string
  cost_to?: string
  service_date_from?: string
  service_date_to?: string
}

export async function loadClaimsData(params: LoaderParams = {}): Promise<PageResult<MedicalClaim>> {
  // Parse and validate page parameters
  const page = Math.max(1, parseInt(params.page || '1') || 1)
  const limit = Math.min(200, Math.max(1, parseInt(params.limit || '25') || 25))

  // Build filters from URL parameters
  const filters: ClaimsFilters = {}
  
  if (params.hospital) filters.hospital = params.hospital
  if (params.status) filters.status = params.status as 'Assessed' | 'Paid' | 'Verified' | 'Received' | 'Cancelled'
  if (params.claim_type) filters.claim_type = params.claim_type
  if (params.contract_type) filters.contract_type = params.contract_type
  if (params.provider) filters.provider = params.provider
  if (params.member_no) filters.member_no = parseInt(params.member_no) || undefined
  if (params.episode_id) filters.episode_id = parseInt(params.episode_id) || undefined
  
  if (params.cost_from || params.cost_to) {
    filters.cost_from = params.cost_from ? parseFloat(params.cost_from) : undefined
    filters.cost_to = params.cost_to ? parseFloat(params.cost_to) : undefined
  }
  
  if (params.service_date_from || params.service_date_to) {
    filters.service_date_from = params.service_date_from || undefined
    filters.service_date_to = params.service_date_to || undefined
  }

  // Default sort by service date descending
  const sort: SortOption = { field: 'service_date', order: 'desc' }

  // Load data from repository
  return await listClaims(
    { page, limit },
    filters,
    sort,
    params.search || ''
  )
}

export async function loadFilterOptions() {
  const options = await distinctOptions()
  
  // Sort options alphabetically for better UX
  return {
    hospitals: options.hospitals.sort(),
    providers: options.providers.sort(),
    statuses: options.statuses.sort(),
  }
}
