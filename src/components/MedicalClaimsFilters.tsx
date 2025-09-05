'use client';

import { useState, useCallback, useRef } from 'react';
import { ClaimsFilters } from '@/types/claims';

interface MedicalClaimsFiltersProps {
  onFiltersChange: (filters: ClaimsFilters) => void;
  initialFilters?: ClaimsFilters;
  loading?: boolean;
}

export default function MedicalClaimsFilters({ onFiltersChange, initialFilters = {}, loading = false }: MedicalClaimsFiltersProps) {
  const [filters, setFilters] = useState<ClaimsFilters>(initialFilters);
  const initialFiltersRef = useRef<string>(JSON.stringify(initialFilters));

  // Check if initialFilters changed and update state if needed
  const currentInitialFiltersStr = JSON.stringify(initialFilters);
  if (currentInitialFiltersStr !== initialFiltersRef.current) {
    initialFiltersRef.current = currentInitialFiltersStr;
    // Only update if the filters actually changed
    if (JSON.stringify(filters) !== currentInitialFiltersStr) {
      setFilters(initialFilters);
    }
  }

    const updateFilter = (key: keyof ClaimsFilters, value: string | number | undefined) => {
    console.log(`🔥 Filters: updateFilter called with ${key} = ${value}`);
    const newFilters = { ...filters, [key]: value };
    console.log('🔥 Filters: Current filters:', filters);
    console.log('🔥 Filters: New filters:', newFilters);
    
    // Compare with current filters before updating state
    if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
      console.log('🔥 Filters: Filters changed, calling onFiltersChange');
      setFilters(newFilters);
      onFiltersChange(newFilters);
    } else {
      console.log('🔥 Filters: No change in filters');
    }
  };

  const clearFilters = useCallback(() => {
    setFilters({});
    onFiltersChange({});
  }, [onFiltersChange]);

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof ClaimsFilters];
    return value !== undefined && value !== '' && value !== null;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Search Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            disabled={loading}
            className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
          >
            Clear All Filters
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Provider Filters */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3">Provider Filters</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hospital
              </label>
              <select
                value={filters.hospital || ''}
                onChange={(e) => updateFilter('hospital', e.target.value || undefined)}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">All Hospitals</option>
                <option value="Calvary">Calvary</option>
                <option value="Gosford">Gosford</option>
                <option value="SJOG">SJOG</option>
                <option value="St Vincent&apos;s">St Vincent&apos;s</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract Type
              </label>
              <select
                value={filters.contract_type || ''}
                onChange={(e) => updateFilter('contract_type', e.target.value || undefined)}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">All Contract Types</option>
                <option value="HOSPITAL">HOSPITAL</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provider
              </label>
              <input
                type="text"
                value={filters.provider || ''}
                onChange={(e) => updateFilter('provider', e.target.value || undefined)}
                placeholder="Search provider..."
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Process Filters */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3">Process Filters</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Claim Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => updateFilter('status', e.target.value || undefined)}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">All Statuses</option>
                <option value="Assessed">Assessed</option>
                <option value="Paid">Paid</option>
                <option value="Verified">Verified</option>
                <option value="Received">Received</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Claim Type
              </label>
              <select
                value={filters.claim_type || ''}
                onChange={(e) => updateFilter('claim_type', e.target.value || undefined)}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">All Claim Types</option>
                <option value="HOSPITAL">HOSPITAL</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={filters.service_date_from ? new Date(filters.service_date_from).toISOString().split('T')[0] : ''}
                  onChange={(e) => updateFilter('service_date_from', e.target.value || undefined)}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
                <input
                  type="date"
                  value={filters.service_date_to ? new Date(filters.service_date_to).toISOString().split('T')[0] : ''}
                  onChange={(e) => updateFilter('service_date_to', e.target.value || undefined)}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Episode Filters */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3">Episode Filters</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Claim Number
              </label>
              <input
                type="number"
                value={filters.claim || ''}
                onChange={(e) => updateFilter('claim', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Enter claim number..."
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Member Number
              </label>
              <input
                type="number"
                value={filters.member_no || ''}
                onChange={(e) => updateFilter('member_no', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Enter member number..."
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Episode ID
              </label>
              <input
                type="number"
                value={filters.episode_id || ''}
                onChange={(e) => updateFilter('episode_id', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Enter episode ID..."
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Episode Cost Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={filters.cost_from || ''}
                  onChange={(e) => updateFilter('cost_from', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="From $"
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
                <input
                  type="number"
                  value={filters.cost_to || ''}
                  onChange={(e) => updateFilter('cost_to', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="To $"
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
