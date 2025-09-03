'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { ClaimsFilters, SortOption, MedicalClaim } from '@/types/claims';
import MedicalClaimsGrid from './MedicalClaimsGrid';

interface MedicalClaimsGridWrapperProps {
  initialData: MedicalClaim[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export default function MedicalClaimsGridWrapper({ 
  initialData, 
  totalCount, 
  currentPage, 
  pageSize
}: MedicalClaimsGridWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateURL = useCallback((params: Record<string, string | number | undefined>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        newSearchParams.set(key, String(value));
      } else {
        newSearchParams.delete(key);
      }
    });

    router.push(`/dashboard?${newSearchParams.toString()}`);
  }, [router, searchParams]);

  const handlePageChange = useCallback((page: number) => {
    updateURL({ page });
  }, [updateURL]);

  const handleFiltersChange = useCallback((filters: ClaimsFilters) => {
    const filterParams: Record<string, string | number | undefined> = {
      page: 1, // Reset to first page when filters change
      claim: filters.claim,
      member_no: filters.member_no,
      episode_id: filters.episode_id,
      hospital: filters.hospital as string,
      provider: filters.provider,
      status: filters.status as string,
      claim_type: filters.claim_type as string,
      contract_type: filters.contract_type as string,
      cost_from: filters.cost_from,
      cost_to: filters.cost_to,
      service_date_from: filters.service_date_from as string,
      service_date_to: filters.service_date_to as string,
    };
    updateURL(filterParams);
  }, [updateURL]);

  const handleSearchChange = useCallback((search: string) => {
    updateURL({ search, page: 1 }); // Reset to first page when search changes
  }, [updateURL]);

  const handleSortChange = useCallback((sort: SortOption | undefined) => {
    updateURL({
      sort_field: sort?.field,
      sort_order: sort?.order,
      page: 1, // Reset to first page when sort changes
    });
  }, [updateURL]);

  const handleExport = useCallback(() => {
    // Trigger a refresh by updating a timestamp parameter
    updateURL({ refresh: Date.now() });
  }, [updateURL]);

  return (
    <MedicalClaimsGrid
      initialData={initialData}
      totalCount={totalCount}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={handlePageChange}
      onFiltersChange={handleFiltersChange}
      onSearchChange={handleSearchChange}
      onSortChange={handleSortChange}
      onExport={handleExport}
    />
  );
}
