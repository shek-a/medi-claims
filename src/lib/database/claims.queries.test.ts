import { buildMatchStage, buildSortStage, buildPipeline } from './claims.queries';
import type { ClaimsFilters, SortOption } from '@/types/claims';

describe('claims.queries', () => {
  describe('buildMatchStage', () => {
    it('should return empty object when no filters and no global search', () => {
      const filters: ClaimsFilters = {};
      const globalSearch = '';
      
      const result = buildMatchStage(filters, globalSearch);
      
      expect(result).toEqual({});
    });

    it('should handle basic claim filters', () => {
      const filters: ClaimsFilters = {
        claim: 12345,
        member_no: 67890,
        episode_id: 11111,
      };
      const globalSearch = '';
      
      const result = buildMatchStage(filters, globalSearch);
      
      expect(result).toEqual({
        claim: 12345,
        member_number: 67890,
        episode_id: 11111,
      });
    });

    it('should handle single hospital filter', () => {
      const filters: ClaimsFilters = {
        hospital: 'General Hospital',
      };
      const globalSearch = '';
      
      const result = buildMatchStage(filters, globalSearch);
      
      expect(result).toEqual({
        hospital: 'General Hospital',
      });
    });

    it('should handle multiple hospital filter', () => {
      const filters: ClaimsFilters = {
        hospital: ['General Hospital', 'City Hospital'],
      };
      const globalSearch = '';
      
      const result = buildMatchStage(filters, globalSearch);
      
      expect(result).toEqual({
        hospital: { $in: ['General Hospital', 'City Hospital'] },
      });
    });

    it('should handle single status filter', () => {
      const filters: ClaimsFilters = {
        status: 'Paid',
      };
      const globalSearch = '';
      
      const result = buildMatchStage(filters, globalSearch);
      
      expect(result).toEqual({
        claim_status: 'Paid',
      });
    });

    it('should handle multiple status filter', () => {
      const filters: ClaimsFilters = {
        status: ['Paid', 'Assessed'],
      };
      const globalSearch = '';
      
      const result = buildMatchStage(filters, globalSearch);
      
      expect(result).toEqual({
        claim_status: { $in: ['Paid', 'Assessed'] },
      });
    });

    it('should handle claim_type filter', () => {
      const filters: ClaimsFilters = {
        claim_type: ['Inpatient', 'Outpatient'],
      };
      const globalSearch = '';
      
      const result = buildMatchStage(filters, globalSearch);
      
      expect(result).toEqual({
        claim_type: { $in: ['Inpatient', 'Outpatient'] },
      });
    });

    it('should handle contract_type filter', () => {
      const filters: ClaimsFilters = {
        contract_type: ['HMO', 'PPO'],
      };
      const globalSearch = '';
      
      const result = buildMatchStage(filters, globalSearch);
      
      expect(result).toEqual({
        contract_type: { $in: ['HMO', 'PPO'] },
      });
    });

    it('should handle provider filter with regex', () => {
      const filters: ClaimsFilters = {
        provider: 'Dr. Smith',
      };
      const globalSearch = '';
      
      const result = buildMatchStage(filters, globalSearch);
      
      expect(result).toEqual({
        provider: { $regex: 'Dr\\. Smith', $options: 'i' },
      });
    });

    it('should handle cost range filter', () => {
      const filters: ClaimsFilters = {
        cost_from: 100,
        cost_to: 500,
      };
      const globalSearch = '';
      
      const result = buildMatchStage(filters, globalSearch);
      
      expect(result).toEqual({
        cost: { $gte: 100, $lte: 500 },
      });
    });

    it('should handle cost_from only', () => {
      const filters: ClaimsFilters = {
        cost_from: 100,
      };
      const globalSearch = '';
      
      const result = buildMatchStage(filters, globalSearch);
      
      expect(result).toEqual({
        cost: { $gte: 100 },
      });
    });

    it('should handle cost_to only', () => {
      const filters: ClaimsFilters = {
        cost_to: 500,
      };
      const globalSearch = '';
      
      const result = buildMatchStage(filters, globalSearch);
      
      expect(result).toEqual({
        cost: { $lte: 500 },
      });
    });

    it('should handle service date range filter', () => {
      const filters: ClaimsFilters = {
        service_date_from: '2023-01-01',
        service_date_to: '2023-12-31',
      };
      const globalSearch = '';
      
      const result = buildMatchStage(filters, globalSearch);
      
      expect(result).toEqual({
        service_date: {
          $gte: new Date('2023-01-01'),
          $lte: new Date('2023-12-31'),
        },
      });
    });

    it('should handle service_date_from only', () => {
      const filters: ClaimsFilters = {
        service_date_from: '2023-01-01',
      };
      const globalSearch = '';
      
      const result = buildMatchStage(filters, globalSearch);
      
      expect(result).toEqual({
        service_date: {
          $gte: new Date('2023-01-01'),
        },
      });
    });

    it('should handle service_date_to only', () => {
      const filters: ClaimsFilters = {
        service_date_to: '2023-12-31',
      };
      const globalSearch = '';
      
      const result = buildMatchStage(filters, globalSearch);
      
      expect(result).toEqual({
        service_date: {
          $lte: new Date('2023-12-31'),
        },
      });
    });

    it('should handle global search', () => {
      const filters: ClaimsFilters = {};
      const globalSearch = 'test search';
      
      const result = buildMatchStage(filters, globalSearch);
      
      expect(result).toEqual({
        $or: [
          { patient: { $regex: 'test search', $options: 'i' } },
          { diagnosis: { $regex: 'test search', $options: 'i' } },
          { provider: { $regex: 'test search', $options: 'i' } },
          { hospital: { $regex: 'test search', $options: 'i' } },
          { agreement: { $regex: 'test search', $options: 'i' } },
        ],
      });
    });

    it('should handle global search with special regex characters', () => {
      const filters: ClaimsFilters = {};
      const globalSearch = 'test.search+with*special?chars';
      
      const result = buildMatchStage(filters, globalSearch);
      
      expect(result).toEqual({
        $or: [
          { patient: { $regex: 'test\\.search\\+with\\*special\\?chars', $options: 'i' } },
          { diagnosis: { $regex: 'test\\.search\\+with\\*special\\?chars', $options: 'i' } },
          { provider: { $regex: 'test\\.search\\+with\\*special\\?chars', $options: 'i' } },
          { hospital: { $regex: 'test\\.search\\+with\\*special\\?chars', $options: 'i' } },
          { agreement: { $regex: 'test\\.search\\+with\\*special\\?chars', $options: 'i' } },
        ],
      });
    });

    it('should ignore empty global search', () => {
      const filters: ClaimsFilters = {};
      const globalSearch = '   ';
      
      const result = buildMatchStage(filters, globalSearch);
      
      expect(result).toEqual({});
    });

    it('should combine multiple filters', () => {
      const filters: ClaimsFilters = {
        claim: 12345,
        hospital: ['General Hospital'],
        status: 'Paid',
        cost_from: 100,
        cost_to: 500,
      };
      const globalSearch = 'test';
      
      const result = buildMatchStage(filters, globalSearch);
      
      expect(result).toEqual({
        claim: 12345,
        hospital: { $in: ['General Hospital'] },
        claim_status: 'Paid',
        cost: { $gte: 100, $lte: 500 },
        $or: [
          { patient: { $regex: 'test', $options: 'i' } },
          { diagnosis: { $regex: 'test', $options: 'i' } },
          { provider: { $regex: 'test', $options: 'i' } },
          { hospital: { $regex: 'test', $options: 'i' } },
          { agreement: { $regex: 'test', $options: 'i' } },
        ],
      });
    });
  });

  describe('buildSortStage', () => {
    it('should return default sort by service_date desc when no sort provided', () => {
      const result = buildSortStage(undefined);
      
      expect(result).toEqual({ $sort: { service_date: -1 } });
    });

    it('should return default sort by service_date desc when sort is empty', () => {
      const sort: SortOption = { field: 'service_date', order: 'desc' };
      const result = buildSortStage(sort);
      
      expect(result).toEqual({ $sort: { service_date: -1 } });
    });

    it('should return sort by service_date asc', () => {
      const sort: SortOption = { field: 'service_date', order: 'asc' };
      const result = buildSortStage(sort);
      
      expect(result).toEqual({ $sort: { service_date: 1 } });
    });

    it('should return sort by cost desc', () => {
      const sort: SortOption = { field: 'cost', order: 'desc' };
      const result = buildSortStage(sort);
      
      expect(result).toEqual({ $sort: { cost: -1 } });
    });

    it('should return sort by claim asc', () => {
      const sort: SortOption = { field: 'claim', order: 'asc' };
      const result = buildSortStage(sort);
      
      expect(result).toEqual({ $sort: { claim: 1 } });
    });

    it('should return sort by member_no desc', () => {
      const sort: SortOption = { field: 'member_no', order: 'desc' };
      const result = buildSortStage(sort);
      
      expect(result).toEqual({ $sort: { member_no: -1 } });
    });

    it('should return sort by episode_id asc', () => {
      const sort: SortOption = { field: 'episode_id', order: 'asc' };
      const result = buildSortStage(sort);
      
      expect(result).toEqual({ $sort: { episode_id: 1 } });
    });
  });

  describe('buildPipeline', () => {
    it('should build pipeline with no filters and no pagination', () => {
      const filters: ClaimsFilters = {};
      const sort: SortOption = { field: 'service_date', order: 'desc' };
      const skip = 0;
      const limit = 0;
      const globalSearch = '';
      
      const result = buildPipeline(filters, sort, skip, limit, globalSearch);
      
      expect(result).toEqual([
        { $sort: { service_date: -1 } },
      ]);
    });

    it('should build pipeline with filters and pagination', () => {
      const filters: ClaimsFilters = {
        claim: 12345,
        status: 'Paid',
      };
      const sort: SortOption = { field: 'cost', order: 'asc' };
      const skip = 20;
      const limit = 10;
      const globalSearch = 'test';
      
      const result = buildPipeline(filters, sort, skip, limit, globalSearch);
      
      expect(result).toEqual([
        {
          $match: {
            claim: 12345,
            claim_status: 'Paid',
            $or: [
              { patient: { $regex: 'test', $options: 'i' } },
              { diagnosis: { $regex: 'test', $options: 'i' } },
              { provider: { $regex: 'test', $options: 'i' } },
              { hospital: { $regex: 'test', $options: 'i' } },
              { agreement: { $regex: 'test', $options: 'i' } },
            ],
          },
        },
        { $sort: { cost: 1 } },
        { $skip: 20 },
        { $limit: 10 },
      ]);
    });

    it('should build pipeline without match stage when no filters', () => {
      const filters: ClaimsFilters = {};
      const sort: SortOption = { field: 'service_date', order: 'desc' };
      const skip = 0;
      const limit = 10;
      const globalSearch = '';
      
      const result = buildPipeline(filters, sort, skip, limit, globalSearch);
      
      expect(result).toEqual([
        { $sort: { service_date: -1 } },
        { $limit: 10 },
      ]);
    });

    it('should build pipeline without skip when skip is 0', () => {
      const filters: ClaimsFilters = { claim: 12345 };
      const sort: SortOption = { field: 'service_date', order: 'desc' };
      const skip = 0;
      const limit = 10;
      const globalSearch = '';
      
      const result = buildPipeline(filters, sort, skip, limit, globalSearch);
      
      expect(result).toEqual([
        { $match: { claim: 12345 } },
        { $sort: { service_date: -1 } },
        { $limit: 10 },
      ]);
    });

    it('should build pipeline without limit when limit is 0', () => {
      const filters: ClaimsFilters = { claim: 12345 };
      const sort: SortOption = { field: 'service_date', order: 'desc' };
      const skip = 20;
      const limit = 0;
      const globalSearch = '';
      
      const result = buildPipeline(filters, sort, skip, limit, globalSearch);
      
      expect(result).toEqual([
        { $match: { claim: 12345 } },
        { $sort: { service_date: -1 } },
        { $skip: 20 },
      ]);
    });
  });
});
