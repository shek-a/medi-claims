// Mock dependencies BEFORE importing the module under test
jest.mock('./mongodb');
jest.mock('./claims.queries');

// Now import (require) after mocks are in place so the real mongodb driver isn't loaded
const mongo = require('./mongodb');
const { buildPipeline } = require('./claims.queries');
const { listClaims, countClaims, distinctOptions, exportClaims } = require('./claims.repo');

const mockDb = {
  collection: jest.fn().mockReturnThis(),
  aggregate: jest.fn().mockReturnThis(),
  toArray: jest.fn(),
  countDocuments: jest.fn(),
  distinct: jest.fn(),
};

(mongo as any).getDb = jest.fn().mockResolvedValue(mockDb);

describe('claims.repo', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (mongo as any).getDb.mockResolvedValue(mockDb);
    mockDb.collection.mockReturnValue(mockDb);
    mockDb.aggregate.mockReturnValue(mockDb);
  });

  it('lists claims with pagination', async () => {
    (buildPipeline as jest.Mock).mockReturnValue([{ $match: {} }, { $limit: 25 }]);
    mockDb.toArray.mockResolvedValue([{ claim: 1 }, { claim: 2 }]);

    const result = await listClaims({ page: 1, limit: 25 }, {}, { field: 'service_date', order: 'desc' } as any, '');
    expect(buildPipeline).toHaveBeenCalled();
    expect(mockDb.collection).toHaveBeenCalledWith('medical_claims');
    expect(result.data.length).toBe(2);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(25);
  });

  it('counts claims matching filters', async () => {
    mockDb.countDocuments.mockResolvedValue(42);
    const result = await countClaims({}, '');
    expect(mockDb.countDocuments).toHaveBeenCalled();
    expect(result).toBe(42);
  });

  it('returns distinct options for hospitals/providers/status', async () => {
    mockDb.distinct
      .mockResolvedValueOnce(['Calvary', 'SJOG'])
      .mockResolvedValueOnce(['0055600D'])
      .mockResolvedValueOnce(['Paid', 'Verified']);

    const res = await distinctOptions();
    expect(res.hospitals).toContain('Calvary');
    expect(res.providers).toContain('0055600D');
    expect(res.statuses).toContain('Paid');
  });

  it('exports claims without pagination', async () => {
    (buildPipeline as jest.Mock).mockReturnValue([{ $match: {} }]);
    mockDb.toArray.mockResolvedValue([{ claim: 1 }, { claim: 2 }, { claim: 3 }]);
    const rows = await exportClaims({}, { field: 'service_date', order: 'desc' } as any, '');
    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBe(3);
  });
});


