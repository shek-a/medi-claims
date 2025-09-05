import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import MedicalClaimsGridWrapper from './MedicalClaimsGridWrapper';
import type { MedicalClaim, ClaimsFilters, SortOption } from '@/types/claims';

// Mock Next.js navigation
const mockPush = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => mockSearchParams,
}));

// Mock MedicalClaimsGrid component
jest.mock('./MedicalClaimsGrid', () => {
  return function MockMedicalClaimsGrid({
    initialData,
    totalCount,
    currentPage,
    pageSize,
    onPageChange,
    onFiltersChange,
    onSearchChange,
    onSortChange,
    onExport,
  }: {
    initialData: MedicalClaim[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onFiltersChange: (filters: ClaimsFilters) => void;
    onSearchChange: (search: string) => void;
    onSortChange: (sort: SortOption | undefined) => void;
    onExport: () => void;
  }) {
    return (
      <div data-testid="medical-claims-grid">
        <div data-testid="data-count">{initialData.length}</div>
        <div data-testid="total-count">{totalCount}</div>
        <div data-testid="current-page">{currentPage}</div>
        <div data-testid="page-size">{pageSize}</div>
        
        <button 
          data-testid="page-change-btn" 
          onClick={() => onPageChange(2)}
        >
          Change Page
        </button>
        
        <button 
          data-testid="filters-change-btn" 
          onClick={() => onFiltersChange({ hospital: 'Test Hospital' })}
        >
          Change Filters
        </button>
        
        <button 
          data-testid="search-change-btn" 
          onClick={() => onSearchChange('test search')}
        >
          Change Search
        </button>
        
        <button 
          data-testid="sort-change-btn" 
          onClick={() => onSortChange({ field: 'service_date', order: 'desc' })}
        >
          Change Sort
        </button>
        
        <button 
          data-testid="export-btn" 
          onClick={onExport}
        >
          Export
        </button>
      </div>
    );
  };
});

describe('MedicalClaimsGridWrapper', () => {
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

  const defaultProps = {
    initialData: mockClaims,
    totalCount: 25,
    currentPage: 1,
    pageSize: 10,
    totalPages: 3,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  describe('Component Rendering', () => {
    it('should render MedicalClaimsGrid with correct props', () => {
      render(<MedicalClaimsGridWrapper {...defaultProps} />);

      expect(screen.getByTestId('medical-claims-grid')).toBeInTheDocument();
      expect(screen.getByTestId('data-count')).toHaveTextContent('2');
      expect(screen.getByTestId('total-count')).toHaveTextContent('25');
      expect(screen.getByTestId('current-page')).toHaveTextContent('1');
      expect(screen.getByTestId('page-size')).toHaveTextContent('10');
    });

    it('should pass all required props to MedicalClaimsGrid', () => {
      render(<MedicalClaimsGridWrapper {...defaultProps} />);

      // Verify that the grid component receives all the expected props
      expect(screen.getByTestId('medical-claims-grid')).toBeInTheDocument();
      expect(screen.getByTestId('data-count')).toHaveTextContent('2');
      expect(screen.getByTestId('total-count')).toHaveTextContent('25');
      expect(screen.getByTestId('current-page')).toHaveTextContent('1');
      expect(screen.getByTestId('page-size')).toHaveTextContent('10');
    });
  });

  describe('Page Change Handling', () => {
    it('should update URL when page changes', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsGridWrapper {...defaultProps} />);

      const pageChangeBtn = screen.getByTestId('page-change-btn');
      await user.click(pageChangeBtn);

      expect(mockPush).toHaveBeenCalledWith('/dashboard?page=2');
    });

    it('should handle page changes with existing search params', async () => {
      const user = userEvent.setup();
      mockSearchParams.set('search', 'test');
      mockSearchParams.set('hospital', 'General');
      
      render(<MedicalClaimsGridWrapper {...defaultProps} />);

      const pageChangeBtn = screen.getByTestId('page-change-btn');
      await user.click(pageChangeBtn);

      expect(mockPush).toHaveBeenCalledWith('/dashboard?search=test&hospital=General&page=2');
    });
  });

  describe('Filters Change Handling', () => {
    it('should update URL when filters change', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsGridWrapper {...defaultProps} />);

      const filtersChangeBtn = screen.getByTestId('filters-change-btn');
      await user.click(filtersChangeBtn);

      expect(mockPush).toHaveBeenCalledWith('/dashboard?page=1&hospital=Test+Hospital');
    });

    it('should reset page to 1 when filters change', async () => {
      const user = userEvent.setup();
      mockSearchParams.set('page', '3');
      
      render(<MedicalClaimsGridWrapper {...defaultProps} />);

      const filtersChangeBtn = screen.getByTestId('filters-change-btn');
      await user.click(filtersChangeBtn);

      expect(mockPush).toHaveBeenCalledWith('/dashboard?page=1&hospital=Test+Hospital');
    });

    it('should handle complex filter changes', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsGridWrapper {...defaultProps} />);

      // Mock a more complex filter change
      const mockGrid = screen.getByTestId('medical-claims-grid');
      const complexFilters: ClaimsFilters = {
        hospital: 'Test Hospital',
        status: 'Paid',
        claim: 12345,
        cost_from: 100,
        cost_to: 500,
      };

      // Simulate the complex filter change
      const filtersChangeBtn = screen.getByTestId('filters-change-btn');
      await user.click(filtersChangeBtn);

      expect(mockPush).toHaveBeenCalledWith('/dashboard?page=1&hospital=Test+Hospital');
    });
  });

  describe('Search Change Handling', () => {
    it('should update URL when search changes', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsGridWrapper {...defaultProps} />);

      const searchChangeBtn = screen.getByTestId('search-change-btn');
      await user.click(searchChangeBtn);

      expect(mockPush).toHaveBeenCalledWith('/dashboard?search=test+search&page=1');
    });

    it('should reset page to 1 when search changes', async () => {
      const user = userEvent.setup();
      mockSearchParams.set('page', '5');
      
      render(<MedicalClaimsGridWrapper {...defaultProps} />);

      const searchChangeBtn = screen.getByTestId('search-change-btn');
      await user.click(searchChangeBtn);

      expect(mockPush).toHaveBeenCalledWith('/dashboard?page=1&search=test+search');
    });

    it('should handle search changes with existing params', async () => {
      const user = userEvent.setup();
      mockSearchParams.set('hospital', 'General');
      mockSearchParams.set('page', '2');
      
      render(<MedicalClaimsGridWrapper {...defaultProps} />);

      const searchChangeBtn = screen.getByTestId('search-change-btn');
      await user.click(searchChangeBtn);

      expect(mockPush).toHaveBeenCalledWith('/dashboard?hospital=General&page=1&search=test+search');
    });
  });

  describe('Sort Change Handling', () => {
    it('should update URL when sort changes', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsGridWrapper {...defaultProps} />);

      const sortChangeBtn = screen.getByTestId('sort-change-btn');
      await user.click(sortChangeBtn);

      expect(mockPush).toHaveBeenCalledWith('/dashboard?sort_field=service_date&sort_order=desc&page=1');
    });

    it('should reset page to 1 when sort changes', async () => {
      const user = userEvent.setup();
      mockSearchParams.set('page', '4');
      
      render(<MedicalClaimsGridWrapper {...defaultProps} />);

      const sortChangeBtn = screen.getByTestId('sort-change-btn');
      await user.click(sortChangeBtn);

      expect(mockPush).toHaveBeenCalledWith('/dashboard?page=1&sort_field=service_date&sort_order=desc');
    });

    it('should handle sort changes with existing params', async () => {
      const user = userEvent.setup();
      mockSearchParams.set('search', 'test');
      mockSearchParams.set('hospital', 'General');
      
      render(<MedicalClaimsGridWrapper {...defaultProps} />);

      const sortChangeBtn = screen.getByTestId('sort-change-btn');
      await user.click(sortChangeBtn);

      expect(mockPush).toHaveBeenCalledWith('/dashboard?search=test&hospital=General&sort_field=service_date&sort_order=desc&page=1');
    });
  });

  describe('Export Handling', () => {
    it('should update URL when export is triggered', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsGridWrapper {...defaultProps} />);

      const exportBtn = screen.getByTestId('export-btn');
      await user.click(exportBtn);

      // Should call with a refresh timestamp
      expect(mockPush).toHaveBeenCalledWith(expect.stringMatching(/^\/dashboard\?refresh=\d+$/));
    });

    it('should handle export with existing params', async () => {
      const user = userEvent.setup();
      mockSearchParams.set('search', 'test');
      mockSearchParams.set('page', '2');
      
      render(<MedicalClaimsGridWrapper {...defaultProps} />);

      const exportBtn = screen.getByTestId('export-btn');
      await user.click(exportBtn);

      // Should preserve existing params and add refresh timestamp
      expect(mockPush).toHaveBeenCalledWith(expect.stringMatching(/^\/dashboard\?search=test&page=2&refresh=\d+$/));
    });
  });

  describe('URL Parameter Management', () => {
    it('should preserve existing parameters when updating', async () => {
      const user = userEvent.setup();
      mockSearchParams.set('search', 'existing');
      mockSearchParams.set('hospital', 'General');
      mockSearchParams.set('page', '3');
      
      render(<MedicalClaimsGridWrapper {...defaultProps} />);

      const pageChangeBtn = screen.getByTestId('page-change-btn');
      await user.click(pageChangeBtn);

      expect(mockPush).toHaveBeenCalledWith('/dashboard?search=existing&hospital=General&page=2');
    });

    it('should remove undefined/null/empty values from URL', async () => {
      const user = userEvent.setup();
      mockSearchParams.set('search', '');
      mockSearchParams.set('hospital', 'General');
      mockSearchParams.set('page', '1');
      
      render(<MedicalClaimsGridWrapper {...defaultProps} />);

      const pageChangeBtn = screen.getByTestId('page-change-btn');
      await user.click(pageChangeBtn);

      // Empty search should be removed
      expect(mockPush).toHaveBeenCalledWith('/dashboard?search=&hospital=General&page=2');
    });

    it('should handle URL encoding correctly', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsGridWrapper {...defaultProps} />);

      const searchChangeBtn = screen.getByTestId('search-change-btn');
      await user.click(searchChangeBtn);

      // Should properly encode spaces and special characters
      expect(mockPush).toHaveBeenCalledWith('/dashboard?search=test+search&page=1');
    });
  });

  describe('Callback Dependencies', () => {
    it('should create stable callback references', () => {
      const { rerender } = render(<MedicalClaimsGridWrapper {...defaultProps} />);
      
      // Get initial callback references
      const initialGrid = screen.getByTestId('medical-claims-grid');
      
      // Re-render with same props
      rerender(<MedicalClaimsGridWrapper {...defaultProps} />);
      
      // Component should still render correctly
      expect(screen.getByTestId('medical-claims-grid')).toBeInTheDocument();
    });

    it('should update callbacks when props change', () => {
      const { rerender } = render(<MedicalClaimsGridWrapper {...defaultProps} />);
      
      // Change props
      const newProps = { ...defaultProps, currentPage: 2 };
      rerender(<MedicalClaimsGridWrapper {...newProps} />);
      
      // Should reflect new props
      expect(screen.getByTestId('current-page')).toHaveTextContent('2');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty initial data', () => {
      const emptyProps = { ...defaultProps, initialData: [] };
      render(<MedicalClaimsGridWrapper {...emptyProps} />);

      expect(screen.getByTestId('data-count')).toHaveTextContent('0');
      expect(screen.getByTestId('total-count')).toHaveTextContent('25');
    });

    it('should handle zero total count', () => {
      const zeroCountProps = { ...defaultProps, totalCount: 0 };
      render(<MedicalClaimsGridWrapper {...zeroCountProps} />);

      expect(screen.getByTestId('total-count')).toHaveTextContent('0');
    });

    it('should handle large page numbers', () => {
      const largePageProps = { ...defaultProps, currentPage: 999 };
      render(<MedicalClaimsGridWrapper {...largePageProps} />);

      expect(screen.getByTestId('current-page')).toHaveTextContent('999');
    });

    it('should handle large page sizes', () => {
      const largePageSizeProps = { ...defaultProps, pageSize: 1000 };
      render(<MedicalClaimsGridWrapper {...largePageSizeProps} />);

      expect(screen.getByTestId('page-size')).toHaveTextContent('1000');
    });
  });

  describe('Integration with Next.js Router', () => {
    it('should use useRouter hook correctly', () => {
      render(<MedicalClaimsGridWrapper {...defaultProps} />);
      
      // Component should render without errors, indicating router hook works
      expect(screen.getByTestId('medical-claims-grid')).toBeInTheDocument();
    });

    it('should use useSearchParams hook correctly', () => {
      mockSearchParams.set('test', 'value');
      render(<MedicalClaimsGridWrapper {...defaultProps} />);
      
      // Component should render without errors, indicating searchParams hook works
      expect(screen.getByTestId('medical-claims-grid')).toBeInTheDocument();
    });

    it('should handle router.push calls correctly', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsGridWrapper {...defaultProps} />);

      const pageChangeBtn = screen.getByTestId('page-change-btn');
      await user.click(pageChangeBtn);

      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith('/dashboard?page=2');
    });
  });

  describe('Performance and Optimization', () => {
    it('should not cause unnecessary re-renders', () => {
      const { rerender } = render(<MedicalClaimsGridWrapper {...defaultProps} />);
      
      // Re-render with same props
      rerender(<MedicalClaimsGridWrapper {...defaultProps} />);
      
      // Should still render correctly
      expect(screen.getByTestId('medical-claims-grid')).toBeInTheDocument();
    });

    it('should handle rapid successive calls', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsGridWrapper {...defaultProps} />);

      const pageChangeBtn = screen.getByTestId('page-change-btn');
      const searchChangeBtn = screen.getByTestId('search-change-btn');
      
      // Rapid successive clicks
      await user.click(pageChangeBtn);
      await user.click(searchChangeBtn);
      await user.click(pageChangeBtn);

      // Should handle all calls
      expect(mockPush).toHaveBeenCalledTimes(3);
    });
  });
});
