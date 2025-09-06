'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { GridReadyEvent, GridApi, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

import { MedicalClaim, ClaimsFilters, SortOption } from '@/types/claims';
import { columnDefinitions } from '@/config/gridColumns';
import MedicalClaimsFilters from './MedicalClaimsFilters';

interface MedicalClaimsGridProps {
  initialData: MedicalClaim[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  currentFilters: ClaimsFilters;
  currentSearch: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onFiltersChange: (filters: ClaimsFilters) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: SortOption | undefined) => void;
  onExport: () => void;
  loading?: boolean;
  error?: string | null;
}

export default function MedicalClaimsGrid({
  initialData,
  totalCount,
  currentPage,
  pageSize,
  currentFilters,
  currentSearch,
  onPageChange,
  onPageSizeChange,
  onFiltersChange,
  onSearchChange,
  onSortChange,
  onExport,
  loading = false,
  error = null,
}: MedicalClaimsGridProps) {
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [pageSizeSelection, setPageSizeSelection] = useState(pageSize);

  // Update local searchTerm when currentSearch prop changes (from URL navigation)
  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  // Update local pageSizeSelection when pageSize prop changes (from URL navigation)
  useEffect(() => {
    setPageSizeSelection(pageSize);
  }, [pageSize]);

  // Debounced search - only trigger when searchTerm actually changes from user input
  useEffect(() => {
    // Don't trigger search if searchTerm is same as currentSearch (initial or prop update)
    if (searchTerm === currentSearch) {
      return;
    }

    const timeoutId = setTimeout(() => {
      onSearchChange(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearchChange, currentSearch]);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  }, []);

  const onSortChanged = useCallback(() => {
    if (!gridApi) return;
    
    const columnState = gridApi.getColumnState();
    const sortedColumn = columnState.find(col => col.sort);
    
    if (sortedColumn) {
      onSortChange({
        field: sortedColumn.colId as keyof MedicalClaim,
        order: sortedColumn.sort as 'asc' | 'desc'
      });
    } else {
      onSortChange(undefined);
    }
  }, [gridApi, onSortChange]);

  const exportToCsv = useCallback(() => {
    if (gridApi) {
      gridApi.exportDataAsCsv({
        fileName: `medical-claims-${new Date().toISOString().split('T')[0]}.csv`,
        suppressQuotes: false,
      });
    }
  }, [gridApi]);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSizeSelection(newPageSize);
    onPageSizeChange(newPageSize); // Call the callback to update URL (already resets to page 1)
  }, [onPageSizeChange]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const defaultColDef = useMemo(() => ({
    sortable: false,
    filter: false,
    resizable: true,
    minWidth: 100,
    suppressMovable: true,
  }), []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medical Claims</h2>
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${totalCount.toLocaleString()} claims found`}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportToCsv}
            disabled={loading || initialData.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Export CSV
          </button>
          
          <button
            onClick={onExport}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search across all fields (patient, diagnosis, provider, etc.)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
          </div>
          
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={loading}
            >
              Clear
            </button>
          )}
        </div>
        
        {searchTerm && (
          <p className="text-sm text-gray-600 mt-2">
            Search results are filtered across patient, diagnosis, provider, hospital, and agreement fields
          </p>
        )}
      </div>

      {/* Filters */}
      <MedicalClaimsFilters 
        onFiltersChange={onFiltersChange}
        initialFilters={currentFilters}
        loading={loading}
      />

      {/* Error Message */}
      {error && (
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
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="ag-theme-alpine" style={{ height: '600px', width: '100%' }}>
          <AgGridReact
            rowData={initialData}
            columnDefs={columnDefinitions}
            onGridReady={onGridReady}
            onSortChanged={onSortChanged}
            theme="legacy"
            pagination={false}
            defaultColDef={defaultColDef}
            loadingOverlayComponent="Loading claims..."
            noRowsOverlayComponent="No claims found. Try adjusting your search or filters."
            rowSelection="multiple"
            suppressRowClickSelection={true}
            animateRows={true}
            suppressCellFocus={true}
            tooltipShowDelay={500}
            suppressColumnVirtualisation={true}
          />
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-t border-gray-200 gap-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700">
              Showing page {currentPage} of {totalPages} ({totalCount.toLocaleString()} total claims)
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Rows per page:</label>
              <select
                value={pageSizeSelection}
                onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                disabled={loading}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1 || loading}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              First
            </button>
            
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="px-3 py-2 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Next
            </button>
            
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages || loading}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Last
            </button>
          </div>
        </div>

        {/* Additional Info */}
        {/* {totalCount > 200 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-blue-50">
            <p className="text-sm text-blue-700">
              Note: Results are limited to 200 records per page for performance. Use filters to narrow down your search.
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
}
