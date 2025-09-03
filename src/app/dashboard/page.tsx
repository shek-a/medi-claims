import { Suspense } from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ClaimsFilters, SortOption, MedicalClaim } from '@/types/claims'
import { listClaims } from '@/lib/database/claims.repo'
import MedicalClaimsGridWrapper from '@/components/MedicalClaimsGridWrapper'

interface DashboardPageProps {
  searchParams: Promise<{
    page?: string
    limit?: string
    search?: string
    sort_field?: string
    sort_order?: string
    [key: string]: string | undefined
  }>
}

async function ClaimsDataGridWrapper({ searchParams }: DashboardPageProps) {
  // Await searchParams since it's now a Promise in Next.js 15
  const params = await searchParams
  
  // Parse search parameters
  const page = parseInt(params.page || '1')
  const limit = Math.min(parseInt(params.limit || '50'), 200) // Max 200 records
  const globalSearch = params.search || ''
  
  // Parse sort parameters
  let sort: SortOption | undefined
  if (params.sort_field && params.sort_order) {
    sort = {
      field: params.sort_field as keyof MedicalClaim,
      order: params.sort_order as 'asc' | 'desc'
    }
  }

  // Parse filters
  const filters: ClaimsFilters = {}
  if (params.claim) filters.claim = parseInt(params.claim)
  if (params.member_no) filters.member_no = parseInt(params.member_no)
  if (params.episode_id) filters.episode_id = parseInt(params.episode_id)
  if (params.hospital) filters.hospital = params.hospital
  if (params.provider) filters.provider = params.provider
  if (params.status) filters.status = params.status as import('@/types/claims').ClaimStatus
  if (params.claim_type) filters.claim_type = params.claim_type
  if (params.contract_type) filters.contract_type = params.contract_type
  if (params.cost_from) filters.cost_from = parseFloat(params.cost_from)
  if (params.cost_to) filters.cost_to = parseFloat(params.cost_to)
  if (params.service_date_from) filters.service_date_from = params.service_date_from
  if (params.service_date_to) filters.service_date_to = params.service_date_to

  try {
    // Fetch data from MongoDB
    const result = await listClaims(
      { page, limit },
      filters,
      sort,
      globalSearch
    )

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-blue-900">
              Dashboard
            </h1>
            <p className="text-lg text-blue-700 mt-2">
              Medical Claims Management
            </p>
          </div>

          <MedicalClaimsGridWrapper 
            initialData={result.data}
            totalCount={result.totalCount}
            currentPage={result.page}
            pageSize={result.limit}
            totalPages={result.totalPages}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading claims:', error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-blue-900">
              Dashboard
            </h1>
            <p className="text-lg text-blue-700 mt-2">
              Medical Claims Management
            </p>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Claims</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Failed to load medical claims. Please try again later.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default async function DashboardPage(props: DashboardPageProps) {
  // Check authentication
  const { userId } = await auth()
  if (!userId) {
    redirect('/')
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700">Loading dashboard...</p>
        </div>
      </div>
    }>
      <ClaimsDataGridWrapper {...props} />
    </Suspense>
  )
}