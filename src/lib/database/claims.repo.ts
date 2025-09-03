import { getDb } from './mongodb';
import { buildPipeline, buildMatchStage } from './claims.queries';
import type { ClaimsFilters, PageParams, PageResult, SortOption, MedicalClaim } from '@/types/claims';

const COLLECTION = process.env.MEDICAL_CLAIMS_COLLECTION || 'medical_claims';

export async function listClaims(
  pageParams: PageParams,
  filters: ClaimsFilters,
  sort: SortOption | undefined,
  globalSearch: string,
): Promise<PageResult<MedicalClaim>> {
  const db = await getDb();
  const skip = (pageParams.page - 1) * pageParams.limit;
  const pipeline = buildPipeline(filters, sort, skip, pageParams.limit, globalSearch);
  const data = await db.collection(COLLECTION).aggregate(pipeline).toArray();
  const totalCount = await countClaims(filters, globalSearch);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageParams.limit));
  return { data: data as MedicalClaim[], totalCount, page: pageParams.page, limit: pageParams.limit, totalPages };
}

export async function countClaims(filters: ClaimsFilters, globalSearch: string): Promise<number> {
  const db = await getDb();
  const match = buildMatchStage(filters, globalSearch);
  return db.collection(COLLECTION).countDocuments(match);
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


