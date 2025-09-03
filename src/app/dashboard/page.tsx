import { Suspense } from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import ClaimsDataGrid from '@/components/claims/DataGrid/ClaimsDataGrid'
import { loadClaimsData, loadFilterOptions } from './loaders'
import { searchClaims } from './actions'
import type { MedicalClaim, ClaimsFilters, SortOption } from '@/types/claims'

interface DashboardPageProps {
  searchParams: Promise<{
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
  }>
}

async function ClaimsDataGridWrapper({ searchParams }: DashboardPageProps) {
  // Await searchParams since it's now a Promise in Next.js 15
  const params = await searchParams
  
  // Load initial data
  const initialData = await loadClaimsData(params)
  const filterOptions = await loadFilterOptions()

  // Define grid columns
  const columns = [
    { key: 'claim', header: 'Claim #' },
    { key: 'patient', header: 'Patient' },
    { key: 'status', header: 'Status' },
    { key: 'episode_id', header: 'Episode ID' },
    { key: 'member_no', header: 'Member #' },
    { key: 'hospital', header: 'Hospital' },
    { key: 'provider', header: 'Provider' },
    { key: 'service_date', header: 'Service Date' },
    { key: 'cost', header: 'Cost' },
    { key: 'benefit', header: 'Benefit' },
  ]

  // Handle grid interactions
  const handlePageChange = async (newPage: number) => {
    'use server'
    // This would typically update the URL and reload data
    // For now, we'll just log the change
    console.log('Page changed to:', newPage)
  }

  const handlePageSizeChange = async (newPageSize: number) => {
    'use server'
    // This would typically update the URL and reload data
    console.log('Page size changed to:', newPageSize)
  }

  const handleSearchChange = async (searchTerm: string) => {
    'use server'
    // This would typically update the URL and reload data
    console.log('Search changed to:', searchTerm)
  }

  const handleFilterChange = async (filters: ClaimsFilters) => {
    'use server'
    // This would typically update the URL and reload data
    console.log('Filters changed to:', filters)
  }

  const handleSortChange = async (field: string, order: 'asc' | 'desc') => {
    'use server'
    // This would typically update the URL and reload data
    console.log('Sort changed to:', field, order)
  }

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

        <div className="bg-white rounded-lg shadow-lg p-6">
          <ClaimsDataGrid
            columns={columns}
            rows={initialData.data}
            totalCount={initialData.totalCount}
            page={initialData.page}
            pageSize={initialData.limit}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
          />
        </div>
      </div>
    </div>
  )
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