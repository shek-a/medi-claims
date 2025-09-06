import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { listClaims } from '@/lib/database/claims.repo';
import DashboardPage from './page';
import type { MedicalClaim, ClaimsFilters, SortOption } from '@/types/claims';

// Mock dependencies
jest.mock('@clerk/nextjs/server');
jest.mock('next/navigation');
jest.mock('@/lib/database/claims.repo');
jest.mock('@/components/claims-grid/MedicalClaimsGridWrapper', () => {
  return function MockMedicalClaimsGridWrapper({ 
    initialData, 
    totalCount, 
    currentPage, 
    pageSize, 
    totalPages 
  }: {
    initialData: MedicalClaim[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  }) {
    return (
      <div data-testid="medical-claims-grid-wrapper">
        <div data-testid="data-count">{initialData.length}</div>
        <div data-testid="total-count">{totalCount}</div>
        <div data-testid="current-page">{currentPage}</div>
        <div data-testid="page-size">{pageSize}</div>
        <div data-testid="total-pages">{totalPages}</div>
      </div>
    );
  };
});

const mockAuth = auth as jest.MockedFunction<typeof auth>;
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;
const mockListClaims = listClaims as jest.MockedFunction<typeof listClaims>;

describe('DashboardPage', () => {
  const mockClaims: MedicalClaim[] = [
    {
      _id: '1',
      claim_type: 'Inpatient',
      claim_status: 'Paid',
      episode_id: 12345,
      claim: 67890,
      member_number: 11111,
      patient: 'John Doe',
      sex: 'M',
      hospital: 'General Hospital',
      provider: 'Dr. Smith',
      agreement: 'HMO',
      service_date: '2023-01-01',
      service: 'Surgery',
      diagnosis: 'Appendicitis',
      cost: 5000,
      benefit: 4000,
      payee: 'Hospital',
      message_id: 'msg123',
      severity: 'High',
      full_text: 'Full text here',
      contract_type: 'HMO',
    },
    {
      _id: '2',
      claim_type: 'Outpatient',
      claim_status: 'Assessed',
      episode_id: 12346,
      claim: 67891,
      member_number: 11112,
      patient: 'Jane Doe',
      sex: 'F',
      hospital: 'City Hospital',
      provider: 'Dr. Johnson',
      agreement: 'PPO',
      service_date: '2023-01-02',
      service: 'Consultation',
      diagnosis: 'Checkup',
      cost: 200,
      benefit: 180,
      payee: 'Doctor',
      message_id: 'msg124',
      severity: 'Low',
      full_text: 'Full text here',
      contract_type: 'PPO',
    },
  ];

  const mockSearchParams = {
    page: '1',
    limit: '10',
    search: 'test',
    sort_field: 'service_date',
    sort_order: 'desc',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default successful auth
    mockAuth.mockResolvedValue({ userId: 'user123' } as unknown as Awaited<ReturnType<typeof auth>>);
    
    // Mock redirect to throw an error to test redirect behavior
    const mockRedirectError = new Error('NEXT_REDIRECT');
    mockRedirect.mockImplementation(() => {
      throw mockRedirectError;
    });
    
    // Default successful data fetch
    mockListClaims.mockResolvedValue({
      data: mockClaims,
      totalCount: 25,
      page: 1,
      limit: 10,
      totalPages: 3,
    });
  });

  describe('Authentication', () => {
    it('should redirect to home if user is not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null } as unknown as Awaited<ReturnType<typeof auth>>);
      
      const searchParamsPromise = Promise.resolve(mockSearchParams);
      
      await expect(DashboardPage({ searchParams: searchParamsPromise }))
        .rejects.toThrow('NEXT_REDIRECT');
      
      expect(mockRedirect).toHaveBeenCalledWith('/');
    });

    it('should render dashboard if user is authenticated', async () => {
      const searchParamsPromise = Promise.resolve(mockSearchParams);
      
      const result = await DashboardPage({ searchParams: searchParamsPromise });
      
      expect(mockRedirect).not.toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('Component Structure', () => {
    it('should return a Suspense component', async () => {
      const searchParamsPromise = Promise.resolve(mockSearchParams);
      
      const result = await DashboardPage({ searchParams: searchParamsPromise });
      
      expect(React.isValidElement(result)).toBe(true);
      expect(result.type).toBe(React.Suspense);
    });

    it('should handle different search parameter types', async () => {
      const searchParamsPromise = Promise.resolve({
        page: '2',
        limit: '25',
        search: 'test search',
      });
      
      const result = await DashboardPage({ searchParams: searchParamsPromise });
      
      expect(React.isValidElement(result)).toBe(true);
    });

    it('should handle empty search parameters', async () => {
      const searchParamsPromise = Promise.resolve({});
      
      const result = await DashboardPage({ searchParams: searchParamsPromise });
      
      expect(React.isValidElement(result)).toBe(true);
    });
  });

  describe('Data Fetching and Rendering', () => {
    it('should return a valid React element', async () => {
      const searchParamsPromise = Promise.resolve(mockSearchParams);
      
      const result = await DashboardPage({ searchParams: searchParamsPromise });
      
      expect(React.isValidElement(result)).toBe(true);
    });

    it('should handle different data scenarios', async () => {
      mockListClaims.mockResolvedValue({
        data: [],
        totalCount: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
      
      const searchParamsPromise = Promise.resolve(mockSearchParams);
      
      const result = await DashboardPage({ searchParams: searchParamsPromise });
      
      expect(React.isValidElement(result)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should return valid React element when data fetching fails', async () => {
      mockListClaims.mockRejectedValue(new Error('Database connection failed'));
      
      const searchParamsPromise = Promise.resolve(mockSearchParams);
      
      const result = await DashboardPage({ searchParams: searchParamsPromise });
      
      expect(React.isValidElement(result)).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined search parameters', async () => {
      const searchParamsPromise = Promise.resolve({
        page: undefined,
        limit: undefined,
        search: undefined,
      });
      
      const result = await DashboardPage({ searchParams: searchParamsPromise });
      
      expect(React.isValidElement(result)).toBe(true);
    });

    it('should handle empty string search parameters', async () => {
      const searchParamsPromise = Promise.resolve({
        page: '',
        limit: '',
        search: '',
      });
      
      const result = await DashboardPage({ searchParams: searchParamsPromise });
      
      expect(React.isValidElement(result)).toBe(true);
    });

    it('should handle extreme values', async () => {
      const searchParamsPromise = Promise.resolve({
        page: '999999',
        limit: '1',
      });
      
      const result = await DashboardPage({ searchParams: searchParamsPromise });
      
      expect(React.isValidElement(result)).toBe(true);
    });
  });
});
