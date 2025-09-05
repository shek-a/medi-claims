import { getDb } from './mongodb';
import { buildPipeline, buildMatchStage } from './claims.queries';
import type { ClaimsFilters, PageParams, PageResult, SortOption, MedicalClaim } from '@/types/claims';

const COLLECTION = process.env.MONGODB_COLLECTION || 'medical_claims';

console.log('Using collection:', COLLECTION);

export async function listClaims(
  pageParams: PageParams,
  filters: ClaimsFilters,
  sort: SortOption | undefined,
  globalSearch: string,
): Promise<PageResult<MedicalClaim>> {
  console.log('listClaims called with:', { pageParams, filters, sort, globalSearch });
  
  const db = await getDb();
  console.log('Database connection established', db);
  
  const skip = (pageParams.page - 1) * pageParams.limit;
  const pipeline = buildPipeline(filters, sort, skip, pageParams.limit, globalSearch);
  console.log('Pipeline built:', JSON.stringify(pipeline, null, 2));
  
  const data = await db.collection(COLLECTION).aggregate(pipeline).toArray();
  console.log('Data fetched:', data.length, 'records');
  
  const totalCount = await countClaims(filters, globalSearch);
  console.log('Total count:', totalCount);
  
  const totalPages = Math.max(1, Math.ceil(totalCount / pageParams.limit));
  const result = { data: data as MedicalClaim[], totalCount, page: pageParams.page, limit: pageParams.limit, totalPages };
  console.log('Returning result:', { totalCount, page: pageParams.page, limit: pageParams.limit, totalPages, dataLength: data.length });
  
  return result;
}

export async function countClaims(filters: ClaimsFilters, globalSearch: string): Promise<number> {
  const db = await getDb();
  const match = buildMatchStage(filters, globalSearch);
  console.log('Count match stage:', JSON.stringify(match, null, 2));
  
  const count = await db.collection(COLLECTION).countDocuments(match);
  console.log('Count result:', count);
  
  return count;
}

export async function distinctOptions() {
  const db = await getDb();
  const [hospitals, providers, statuses] = await Promise.all([
    db.collection(COLLECTION).distinct('hospital'),
    db.collection(COLLECTION).distinct('provider'),
    db.collection(COLLECTION).distinct('claim_status'),
  ]);
  return { hospitals, providers, statuses };
}

export async function exportClaims(
  filters: ClaimsFilters,
  sort: SortOption | undefined,
  globalSearch: string,
) {
  const db = await getDb();
  const pipeline = buildPipeline(filters, sort, 0, 0, globalSearch);
  const data = await db.collection(COLLECTION).aggregate(pipeline).toArray();
  return data as MedicalClaim[];
}


