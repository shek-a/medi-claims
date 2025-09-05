import { listClaims, countClaims, distinctOptions, exportClaims } from './claims.repo';
import { getDb } from './mongodb';
import { buildPipeline, buildMatchStage } from './claims.queries';
import type { ClaimsFilters, PageParams, SortOption, MedicalClaim } from '@/types/claims';
import type { Db } from 'mongodb';

// Mock the mongodb module
jest.mock('./mongodb');
jest.mock('./claims.queries', () => ({
  buildPipeline: jest.fn(),
  buildMatchStage: jest.fn(),
}));

const mockGetDb = getDb as jest.MockedFunction<typeof getDb>;
const mockBuildPipeline = buildPipeline as jest.MockedFunction<typeof buildPipeline>;
const mockBuildMatchStage = buildMatchStage as jest.MockedFunction<typeof buildMatchStage>;

interface MockCollection {
  aggregate: jest.MockedFunction<() => { toArray: jest.MockedFunction<() => Promise<MedicalClaim[]>> }>;
  countDocuments: jest.MockedFunction<() => Promise<number>>;
  distinct: jest.MockedFunction<() => Promise<string[]>>;
}

interface MockDb {
  collection: jest.MockedFunction<() => MockCollection>;
}

describe('claims.repo', () => {
  let mockCollection: MockCollection;
  let mockDb: MockDb;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create mock collection
    mockCollection = {
      aggregate: jest.fn().mockReturnValue({
        toArray: jest.fn(),
      }),
      countDocuments: jest.fn(),
      distinct: jest.fn(),
    };

    // Create mock database
    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };

    // Mock getDb to return our mock database
    mockGetDb.mockResolvedValue(mockDb as unknown as Db);

    // Mock buildPipeline to return a simple pipeline
    mockBuildPipeline.mockReturnValue([
      { $match: {} },
      { $sort: { service_date: -1 } },
    ]);

    // Mock buildMatchStage to return a simple match stage
    mockBuildMatchStage.mockReturnValue({});
  });

  describe('listClaims', () => {
    const mockPageParams: PageParams = { page: 1, limit: 10 };
    const mockFilters: ClaimsFilters = {};
    const mockSort: SortOption = { field: 'service_date', order: 'desc' };
    const mockGlobalSearch = '';

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

    it('should return paginated claims with correct structure', async () => {
      // Mock the aggregate result
      mockCollection.aggregate().toArray.mockResolvedValue(mockClaims);
      mockCollection.countDocuments.mockResolvedValue(25);

      const result = await listClaims(mockPageParams, mockFilters, mockSort, mockGlobalSearch);

      expect(result).toEqual({
        data: mockClaims,
        totalCount: 25,
        page: 1,
        limit: 10,
        totalPages: 3,
      });
    });

    it('should call getDb to get database connection', async () => {
      mockCollection.aggregate().toArray.mockResolvedValue([]);
      mockCollection.countDocuments.mockResolvedValue(0);

      await listClaims(mockPageParams, mockFilters, mockSort, mockGlobalSearch);

      // getDb is called twice: once in listClaims and once in countClaims
      expect(mockGetDb).toHaveBeenCalledTimes(2);
    });

    it('should call buildPipeline with correct parameters', async () => {
      mockCollection.aggregate().toArray.mockResolvedValue([]);
      mockCollection.countDocuments.mockResolvedValue(0);

      await listClaims(mockPageParams, mockFilters, mockSort, mockGlobalSearch);

      expect(mockBuildPipeline).toHaveBeenCalledWith(
        mockFilters,
        mockSort,
        0, // skip = (page - 1) * limit = (1 - 1) * 10 = 0
        10, // limit
        mockGlobalSearch
      );
    });

    it('should call collection.aggregate with the pipeline', async () => {
      const mockPipeline = [{ $match: {} }, { $sort: { service_date: -1 } }];
      mockBuildPipeline.mockReturnValue(mockPipeline);
      mockCollection.aggregate().toArray.mockResolvedValue([]);
      mockCollection.countDocuments.mockResolvedValue(0);

      await listClaims(mockPageParams, mockFilters, mockSort, mockGlobalSearch);

      expect(mockCollection.aggregate).toHaveBeenCalledWith(mockPipeline);
    });

    it('should call countClaims for total count', async () => {
      mockCollection.aggregate().toArray.mockResolvedValue([]);
      mockCollection.countDocuments.mockResolvedValue(15);

      await listClaims(mockPageParams, mockFilters, mockSort, mockGlobalSearch);

      expect(mockCollection.countDocuments).toHaveBeenCalledWith({});
    });

    it('should calculate total pages correctly', async () => {
      mockCollection.aggregate().toArray.mockResolvedValue([]);
      mockCollection.countDocuments.mockResolvedValue(25);

      const result = await listClaims(mockPageParams, mockFilters, mockSort, mockGlobalSearch);

      expect(result.totalPages).toBe(3); // Math.ceil(25 / 10) = 3
    });

    it('should handle page 2 correctly', async () => {
      const pageParams: PageParams = { page: 2, limit: 10 };
      mockCollection.aggregate().toArray.mockResolvedValue([]);
      mockCollection.countDocuments.mockResolvedValue(25);

      await listClaims(pageParams, mockFilters, mockSort, mockGlobalSearch);

      expect(mockBuildPipeline).toHaveBeenCalledWith(
        mockFilters,
        mockSort,
        10, // skip = (2 - 1) * 10 = 10
        10, // limit
        mockGlobalSearch
      );
    });

    it('should handle empty results', async () => {
      mockCollection.aggregate().toArray.mockResolvedValue([]);
      mockCollection.countDocuments.mockResolvedValue(0);

      const result = await listClaims(mockPageParams, mockFilters, mockSort, mockGlobalSearch);

      expect(result).toEqual({
        data: [],
        totalCount: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should ensure totalPages is at least 1', async () => {
      mockCollection.aggregate().toArray.mockResolvedValue([]);
      mockCollection.countDocuments.mockResolvedValue(0);

      const result = await listClaims(mockPageParams, mockFilters, mockSort, mockGlobalSearch);

      expect(result.totalPages).toBe(1);
    });
  });

  describe('countClaims', () => {
    const mockFilters: ClaimsFilters = { status: 'Paid' };
    const mockGlobalSearch = 'test';

    it('should return count of documents matching filters', async () => {
      mockCollection.countDocuments.mockResolvedValue(42);

      const result = await countClaims(mockFilters, mockGlobalSearch);

      expect(result).toBe(42);
    });

    it('should call getDb to get database connection', async () => {
      mockCollection.countDocuments.mockResolvedValue(0);

      await countClaims(mockFilters, mockGlobalSearch);

      expect(mockGetDb).toHaveBeenCalledTimes(1);
    });

    it('should call buildMatchStage with correct parameters', async () => {
      mockCollection.countDocuments.mockResolvedValue(0);

      await countClaims(mockFilters, mockGlobalSearch);

      expect(mockBuildMatchStage).toHaveBeenCalledWith(mockFilters, mockGlobalSearch);
    });

    it('should call collection.countDocuments with match stage', async () => {
      const mockMatchStage = { claim_status: 'Paid' };
      mockBuildMatchStage.mockReturnValue(mockMatchStage);
      mockCollection.countDocuments.mockResolvedValue(15);

      await countClaims(mockFilters, mockGlobalSearch);

      expect(mockCollection.countDocuments).toHaveBeenCalledWith(mockMatchStage);
    });

    it('should handle empty filters and search', async () => {
      mockCollection.countDocuments.mockResolvedValue(100);

      const result = await countClaims({}, '');

      expect(result).toBe(100);
      expect(mockBuildMatchStage).toHaveBeenCalledWith({}, '');
    });
  });

  describe('distinctOptions', () => {
    it('should return distinct values for hospitals, providers, and statuses', async () => {
      const mockHospitals = ['General Hospital', 'City Hospital'];
      const mockProviders = ['Dr. Smith', 'Dr. Johnson'];
      const mockStatuses = ['Paid', 'Assessed', 'Verified'];

      mockCollection.distinct
        .mockResolvedValueOnce(mockHospitals)
        .mockResolvedValueOnce(mockProviders)
        .mockResolvedValueOnce(mockStatuses);

      const result = await distinctOptions();

      expect(result).toEqual({
        hospitals: mockHospitals,
        providers: mockProviders,
        statuses: mockStatuses,
      });
    });

    it('should call getDb to get database connection', async () => {
      mockCollection.distinct.mockResolvedValue([]);

      await distinctOptions();

      expect(mockGetDb).toHaveBeenCalledTimes(1);
    });

    it('should call distinct for each field', async () => {
      mockCollection.distinct.mockResolvedValue([]);

      await distinctOptions();

      expect(mockCollection.distinct).toHaveBeenCalledTimes(3);
      expect(mockCollection.distinct).toHaveBeenNthCalledWith(1, 'hospital');
      expect(mockCollection.distinct).toHaveBeenNthCalledWith(2, 'provider');
      expect(mockCollection.distinct).toHaveBeenNthCalledWith(3, 'claim_status');
    });

    it('should handle empty results', async () => {
      mockCollection.distinct.mockResolvedValue([]);

      const result = await distinctOptions();

      expect(result).toEqual({
        hospitals: [],
        providers: [],
        statuses: [],
      });
    });
  });

  describe('exportClaims', () => {
    const mockFilters: ClaimsFilters = { status: 'Paid' };
    const mockSort: SortOption = { field: 'service_date', order: 'desc' };
    const mockGlobalSearch = 'test';

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
    ];

    it('should return all claims matching filters without pagination', async () => {
      mockCollection.aggregate().toArray.mockResolvedValue(mockClaims);

      const result = await exportClaims(mockFilters, mockSort, mockGlobalSearch);

      expect(result).toEqual(mockClaims);
    });

    it('should call getDb to get database connection', async () => {
      mockCollection.aggregate().toArray.mockResolvedValue([]);

      await exportClaims(mockFilters, mockSort, mockGlobalSearch);

      expect(mockGetDb).toHaveBeenCalledTimes(1);
    });

    it('should call buildPipeline with skip=0 and limit=0', async () => {
      mockCollection.aggregate().toArray.mockResolvedValue([]);

      await exportClaims(mockFilters, mockSort, mockGlobalSearch);

      expect(mockBuildPipeline).toHaveBeenCalledWith(
        mockFilters,
        mockSort,
        0, // skip
        0, // limit (0 means no limit)
        mockGlobalSearch
      );
    });

    it('should call collection.aggregate with the pipeline', async () => {
      const mockPipeline = [{ $match: {} }, { $sort: { service_date: -1 } }];
      mockBuildPipeline.mockReturnValue(mockPipeline);
      mockCollection.aggregate().toArray.mockResolvedValue([]);

      await exportClaims(mockFilters, mockSort, mockGlobalSearch);

      expect(mockCollection.aggregate).toHaveBeenCalledWith(mockPipeline);
    });

    it('should handle empty results', async () => {
      mockCollection.aggregate().toArray.mockResolvedValue([]);

      const result = await exportClaims(mockFilters, mockSort, mockGlobalSearch);

      expect(result).toEqual([]);
    });

    it('should handle undefined sort parameter', async () => {
      mockCollection.aggregate().toArray.mockResolvedValue([]);

      await exportClaims(mockFilters, undefined, mockGlobalSearch);

      expect(mockBuildPipeline).toHaveBeenCalledWith(
        mockFilters,
        undefined,
        0,
        0,
        mockGlobalSearch
      );
    });
  });
});
