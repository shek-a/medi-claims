'use server'

import { auth } from '@clerk/nextjs/server'
import { listClaims, exportClaims as repoExportClaims } from '@/lib/database/claims.repo'
import type { ClaimsFilters, SortOption, PageResult, MedicalClaim } from '@/types/claims'

export interface SearchParams {
  page: number
  limit: number
  search: string
  filters: ClaimsFilters
  sort: SortOption
}

export interface ExportParams {
  search: string
  filters: ClaimsFilters
  sort: SortOption
  format: 'csv' | 'excel'
}

export interface StatusUpdateParams {
  claimId: string
  status: string
  notes?: string
}

export interface StatusUpdateResult {
  success: boolean
  claimId?: string
  status?: string
  error?: string
}

export async function searchClaims(params: SearchParams): Promise<PageResult<MedicalClaim>> {
  // Validate user authentication
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  // Validate and clamp parameters
  const page = Math.max(1, params.page)
  const limit = Math.min(200, Math.max(1, params.limit))

  return await listClaims(
    { page, limit },
    params.filters,
    params.sort,
    params.search
  )
}

export async function exportClaims(params: ExportParams): Promise<string> {
  // Validate user authentication
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  // Get data without pagination
  const data = await repoExportClaims(
    params.filters,
    params.sort,
    params.search
  )

  if (params.format === 'csv') {
    return convertToCSV(data)
  } else {
    return convertToExcel(data)
  }
}

export async function updateClaimStatus(params: StatusUpdateParams): Promise<StatusUpdateResult> {
  // Validate user authentication
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  // Validate status
  const validStatuses = ['Assessed', 'Paid', 'Verified', 'Received', 'Cancelled']
  if (!validStatuses.includes(params.status)) {
    return {
      success: false,
      error: `Invalid status: ${params.status}. Must be one of: ${validStatuses.join(', ')}`
    }
  }

  // TODO: Implement actual status update in repository
  // For now, return success response
  return {
    success: true,
    claimId: params.claimId,
    status: params.status
  }
}

function convertToCSV(data: MedicalClaim[]): string {
  if (data.length === 0) {
    return 'claim,patient,status,episode_id,member_no,hospital,provider,service_date,cost,benefit\n'
  }

  const headers = Object.keys(data[0]).join(',')
  const rows = data.map(row => 
    Object.values(row).map(value => 
      typeof value === 'string' && value.includes(',') ? `"${value}"` : value
    ).join(',')
  ).join('\n')

  return `${headers}\n${rows}`
}

function convertToExcel(data: MedicalClaim[]): string {
  // TODO: Implement Excel export using a library like xlsx
  // For now, return CSV format
  return convertToCSV(data)
}
