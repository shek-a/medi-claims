import { buildMatchStage, buildSortStage, buildPipeline } from './claims.queries';
import type { ClaimsFilters, SortOption } from '@/types/claims';

describe('claims.queries', () => {
  describe('buildMatchStage', () => {
    it('builds exact matches for numeric ids', () => {
      const filters: ClaimsFilters = { claim: 123456, member_no: 7890, episode_id: 42 };
      const match = buildMatchStage(filters, '');
      expect(match).toMatchObject({ claim: 123456, member_no: 7890, episode_id: 42 });
    });

    it('supports hospital multi-select and status multi-select', () => {
      const filters: ClaimsFilters = { hospital: ['Calvary', "SJOG"], status: ['Verified', 'Paid'] } as any;
      const match = buildMatchStage(filters, '');
      expect(match.hospital.$in).toEqual(['Calvary', 'SJOG']);
      expect(match.status.$in).toEqual(['Verified', 'Paid']);
    });

    it('adds cost range and service_date range', () => {
      const filters: ClaimsFilters = { cost_from: 100, cost_to: 500, service_date_from: '2024-01-01', service_date_to: '2024-01-31' };
      const match = buildMatchStage(filters, '');
      expect(match.cost).toEqual({ $gte: 100, $lte: 500 });
      expect(match.service_date).toEqual({ $gte: new Date('2024-01-01'), $lte: new Date('2024-01-31') });
    });

    it('adds global text search across patient, diagnosis, provider, hospital, agreement', () => {
      const match = buildMatchStage({}, 'hernia');
      expect(match.$or).toBeDefined();
      expect(match.$or.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('buildSortStage', () => {
    it('sorts ascending/descending correctly', () => {
      const asc: SortOption = { field: 'service_date', order: 'asc' } as any;
      const desc: SortOption = { field: 'cost', order: 'desc' } as any;
      expect(buildSortStage(asc)).toEqual({ $sort: { service_date: 1 } });
      expect(buildSortStage(desc)).toEqual({ $sort: { cost: -1 } });
    });
  });

  describe('buildPipeline', () => {
    it('composes match and sort and supports pagination skip/limit', () => {
      const pipeline = buildPipeline({ hospital: 'Calvary' }, { field: 'service_date', order: 'desc' } as any, 20, 40, '');
      expect(pipeline.find(s => '$match' in s)).toBeTruthy();
      expect(pipeline.find(s => '$sort' in s)).toBeTruthy();
      expect(pipeline.find(s => '$skip' in s)).toEqual({ $skip: 20 });
      expect(pipeline.find(s => '$limit' in s)).toEqual({ $limit: 40 });
    });
  });
});


