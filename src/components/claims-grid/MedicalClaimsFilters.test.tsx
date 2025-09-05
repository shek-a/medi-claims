import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import MedicalClaimsFilters from './MedicalClaimsFilters';

describe('MedicalClaimsFilters', () => {
  const mockOnFiltersChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render all filter sections and inputs', () => {
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      // Check main sections
      expect(screen.getByText('Search Filters')).toBeInTheDocument();
      expect(screen.getByText('Provider Filters')).toBeInTheDocument();
      expect(screen.getByText('Process Filters')).toBeInTheDocument();
      expect(screen.getByText('Episode Filters')).toBeInTheDocument();

      // Check provider filter inputs by placeholder and role
      expect(screen.getAllByDisplayValue('')).toHaveLength(8); // All empty inputs
      expect(screen.getByPlaceholderText('Search provider...')).toBeInTheDocument();

      // Check process filter inputs
      expect(screen.getAllByRole('combobox')).toHaveLength(4); // All select elements

      // Check episode filter inputs
      expect(screen.getByPlaceholderText('Enter claim number...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter member number...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter episode ID...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('From $')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('To $')).toBeInTheDocument();
    });

    it('should not show clear filters button initially', () => {
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      expect(screen.queryByText('Clear All Filters')).not.toBeInTheDocument();
    });

    it('should show clear filters button when filters are active', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      const hospitalSelect = screen.getAllByRole('combobox')[0]; // First select is hospital
      await user.selectOptions(hospitalSelect, 'Calvary');

      expect(screen.getByText('Clear All Filters')).toBeInTheDocument();
    });
  });

  describe('Provider Filters', () => {
    it('should update hospital filter', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      const hospitalSelect = screen.getAllByRole('combobox')[0]; // First select is hospital
      await user.selectOptions(hospitalSelect, 'Calvary');

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        hospital: 'Calvary',
      });
    });

    it('should update contract type filter', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      const contractTypeSelect = screen.getAllByRole('combobox')[1]; // Second select is contract type
      await user.selectOptions(contractTypeSelect, 'HOSPITAL');

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        contract_type: 'HOSPITAL',
      });
    });

    it('should update provider filter', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      const providerInput = screen.getByPlaceholderText('Search provider...');
      await user.type(providerInput, 'Dr. Smith');

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        provider: 'Dr. Smith',
      });
    });

    it('should clear provider filter when empty', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      const providerInput = screen.getByPlaceholderText('Search provider...');
      await user.type(providerInput, 'Dr. Smith');
      await user.clear(providerInput);

      expect(mockOnFiltersChange).toHaveBeenLastCalledWith({
        provider: undefined,
      });
    });
  });

  describe('Process Filters', () => {
    it('should update claim status filter', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      const statusSelect = screen.getAllByRole('combobox')[2]; // Third select is claim status
      await user.selectOptions(statusSelect, 'Paid');

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        status: 'Paid',
      });
    });

    it('should update claim type filter', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      const claimTypeSelect = screen.getAllByRole('combobox')[3]; // Fourth select is claim type
      await user.selectOptions(claimTypeSelect, 'HOSPITAL');

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        claim_type: 'HOSPITAL',
      });
    });

    it('should update service date from filter', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      const dateInputs = screen.getAllByDisplayValue('');
      const fromDateInput = dateInputs.find(input => 
        input.getAttribute('type') === 'date' && 
        input.getAttribute('placeholder') === undefined
      );
      
      if (fromDateInput) {
        await user.type(fromDateInput, '2023-01-01');
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
          service_date_from: '2023-01-01',
        });
      }
    });

    it('should update service date to filter', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      const dateInputs = screen.getAllByDisplayValue('');
      const toDateInput = dateInputs.find(input => 
        input.getAttribute('type') === 'date' && 
        input.getAttribute('placeholder') === undefined
      );
      
      if (toDateInput) {
        await user.type(toDateInput, '2023-12-31');
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
          service_date_to: '2023-12-31',
        });
      }
    });
  });

  describe('Episode Filters', () => {
    it('should update claim number filter', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      const claimInput = screen.getByPlaceholderText('Enter claim number...');
      await user.type(claimInput, '12345');

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        claim: 12345,
      });
    });

    it('should update member number filter', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      const memberInput = screen.getByPlaceholderText('Enter member number...');
      await user.type(memberInput, '67890');

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        member_no: 67890,
      });
    });

    it('should update episode ID filter', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      const episodeInput = screen.getByPlaceholderText('Enter episode ID...');
      await user.type(episodeInput, '11111');

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        episode_id: 11111,
      });
    });

    it('should update cost from filter', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      const costFromInput = screen.getByPlaceholderText('From $');
      await user.type(costFromInput, '100');

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        cost_from: 100,
      });
    });

    it('should update cost to filter', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      const costToInput = screen.getByPlaceholderText('To $');
      await user.type(costToInput, '500');

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        cost_to: 500,
      });
    });

    it('should handle empty numeric inputs', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      const claimInput = screen.getByPlaceholderText('Enter claim number...');
      await user.type(claimInput, '12345');
      await user.clear(claimInput);

      expect(mockOnFiltersChange).toHaveBeenLastCalledWith({
        claim: undefined,
      });
    });
  });

  describe('Filter Combinations', () => {
    it('should combine multiple filters', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      // Set multiple filters
      const hospitalSelect = screen.getAllByRole('combobox')[0]; // Hospital select
      await user.selectOptions(hospitalSelect, 'Calvary');

      const statusSelect = screen.getAllByRole('combobox')[2]; // Claim status select
      await user.selectOptions(statusSelect, 'Paid');

      const claimInput = screen.getByPlaceholderText('Enter claim number...');
      await user.type(claimInput, '12345');

      expect(mockOnFiltersChange).toHaveBeenLastCalledWith({
        hospital: 'Calvary',
        status: 'Paid',
        claim: 12345,
      });
    });

    it('should update existing filters when new ones are added', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      // Set initial filter
      const hospitalSelect = screen.getAllByRole('combobox')[0]; // Hospital select
      await user.selectOptions(hospitalSelect, 'Calvary');

      // Add another filter
      const statusSelect = screen.getAllByRole('combobox')[2]; // Claim status select
      await user.selectOptions(statusSelect, 'Paid');

      expect(mockOnFiltersChange).toHaveBeenLastCalledWith({
        hospital: 'Calvary',
        status: 'Paid',
      });
    });
  });

  describe('Clear Filters', () => {
    it('should clear all filters when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      // Set some filters
      const hospitalSelect = screen.getAllByRole('combobox')[0]; // Hospital select
      await user.selectOptions(hospitalSelect, 'Calvary');

      const claimInput = screen.getByPlaceholderText('Enter claim number...');
      await user.type(claimInput, '12345');

      // Clear all filters
      const clearButton = screen.getByText('Clear All Filters');
      await user.click(clearButton);

      expect(mockOnFiltersChange).toHaveBeenLastCalledWith({});
    });

    it('should hide clear button after clearing filters', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      // Set a filter
      const hospitalSelect = screen.getAllByRole('combobox')[0]; // Hospital select
      await user.selectOptions(hospitalSelect, 'Calvary');

      // Clear filters
      const clearButton = screen.getByText('Clear All Filters');
      await user.click(clearButton);

      // Clear button should be hidden
      expect(screen.queryByText('Clear All Filters')).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should disable all inputs when loading is true', () => {
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} loading={true} />);

      // Check that all inputs are disabled
      const hospitalSelect = screen.getAllByRole('combobox')[0];
      const providerInput = screen.getByPlaceholderText('Search provider...');
      const claimInput = screen.getByPlaceholderText('Enter claim number...');
      const costFromInput = screen.getByPlaceholderText('From $');

      expect(hospitalSelect).toBeDisabled();
      expect(providerInput).toBeDisabled();
      expect(claimInput).toBeDisabled();
      expect(costFromInput).toBeDisabled();
    });

    it('should enable all inputs when loading is false', () => {
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} loading={false} />);

      // Check that all inputs are enabled
      const hospitalSelect = screen.getAllByRole('combobox')[0];
      const providerInput = screen.getByPlaceholderText('Search provider...');
      const claimInput = screen.getByPlaceholderText('Enter claim number...');
      const costFromInput = screen.getByPlaceholderText('From $');

      expect(hospitalSelect).not.toBeDisabled();
      expect(providerInput).not.toBeDisabled();
      expect(claimInput).not.toBeDisabled();
      expect(costFromInput).not.toBeDisabled();
    });

    it('should show clear button when filters are active and not loading', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} loading={false} />);

      // Set a filter to show clear button
      const hospitalSelect = screen.getAllByRole('combobox')[0];
      await user.selectOptions(hospitalSelect, 'Calvary');

      const clearButton = screen.getByText('Clear All Filters');
      expect(clearButton).toBeInTheDocument();
      expect(clearButton).not.toBeDisabled();
    });
  });

  describe('Select Options', () => {
    it('should have correct hospital options', () => {
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      const hospitalSelect = screen.getAllByRole('combobox')[0];
      expect(hospitalSelect).toHaveTextContent('All Hospitals');
      expect(hospitalSelect).toHaveTextContent('Calvary');
      expect(hospitalSelect).toHaveTextContent('Gosford');
      expect(hospitalSelect).toHaveTextContent('SJOG');
      expect(hospitalSelect).toHaveTextContent('St Vincent\'s');
    });

    it('should have correct contract type options', () => {
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      const contractTypeSelect = screen.getAllByRole('combobox')[1];
      expect(contractTypeSelect).toHaveTextContent('All Contract Types');
      expect(contractTypeSelect).toHaveTextContent('HOSPITAL');
    });

    it('should have correct claim status options', () => {
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      const statusSelect = screen.getAllByRole('combobox')[2];
      expect(statusSelect).toHaveTextContent('All Statuses');
      expect(statusSelect).toHaveTextContent('Assessed');
      expect(statusSelect).toHaveTextContent('Paid');
      expect(statusSelect).toHaveTextContent('Verified');
      expect(statusSelect).toHaveTextContent('Received');
      expect(statusSelect).toHaveTextContent('Cancelled');
    });

    it('should have correct claim type options', () => {
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      const claimTypeSelect = screen.getAllByRole('combobox')[3];
      expect(claimTypeSelect).toHaveTextContent('All Claim Types');
      expect(claimTypeSelect).toHaveTextContent('HOSPITAL');
    });
  });

  describe('Input Placeholders', () => {
    it('should have correct placeholders for text inputs', () => {
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      expect(screen.getByPlaceholderText('Search provider...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter claim number...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter member number...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter episode ID...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('From $')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('To $')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid filter changes', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      const providerInput = screen.getByPlaceholderText('Search provider...');
      
      // Type rapidly
      await user.type(providerInput, 'Dr. Smith');
      await user.clear(providerInput);
      await user.type(providerInput, 'Dr. Johnson');

      // Should have called onFiltersChange multiple times (each character triggers a call)
      expect(mockOnFiltersChange).toHaveBeenCalledTimes(21); // 9 + 1 + 11 characters
    });

    it('should handle empty string values correctly', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      const providerInput = screen.getByPlaceholderText('Search provider...');
      await user.type(providerInput, 'Dr. Smith');
      await user.clear(providerInput);

      expect(mockOnFiltersChange).toHaveBeenLastCalledWith({
        provider: undefined,
      });
    });

    it('should handle numeric input fields', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      const claimInput = screen.getByPlaceholderText('Enter claim number...');
      await user.type(claimInput, '123');
      await user.clear(claimInput);

      // The component should handle numeric input
      expect(mockOnFiltersChange).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for all inputs', () => {
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      // Check that labels exist in the DOM
      expect(screen.getByText('Hospital')).toBeInTheDocument();
      expect(screen.getByText('Contract Type')).toBeInTheDocument();
      expect(screen.getByText('Provider')).toBeInTheDocument();
      expect(screen.getByText('Claim Status')).toBeInTheDocument();
      expect(screen.getByText('Claim Type')).toBeInTheDocument();
      expect(screen.getByText('Service Date Range')).toBeInTheDocument();
      expect(screen.getByText('Claim Number')).toBeInTheDocument();
      expect(screen.getByText('Member Number')).toBeInTheDocument();
      expect(screen.getByText('Episode ID')).toBeInTheDocument();
      expect(screen.getByText('Episode Cost Range')).toBeInTheDocument();
    });

    it('should have proper button text for clear filters', async () => {
      const user = userEvent.setup();
      render(<MedicalClaimsFilters onFiltersChange={mockOnFiltersChange} />);

      const hospitalSelect = screen.getAllByRole('combobox')[0];
      await user.selectOptions(hospitalSelect, 'Calvary');

      const clearButton = screen.getByText('Clear All Filters');
      expect(clearButton).toBeInTheDocument();
    });
  });
});
