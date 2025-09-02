import type { ClaimsFilters, SortOption } from '@/types/claims';

export function buildMatchStage(filters: ClaimsFilters, globalSearch: string) {
  const match: any = {};

  if (filters.claim !== undefined) match.claim = filters.claim;
  if (filters.member_no !== undefined) match.member_no = filters.member_no;
  if (filters.episode_id !== undefined) match.episode_id = filters.episode_id;

  if (filters.hospital) {
    match.hospital = Array.isArray(filters.hospital)
      ? { $in: filters.hospital }
      : filters.hospital;
  }

  if (filters.status) {
    match.status = Array.isArray(filters.status)
      ? { $in: filters.status }
      : filters.status;
  }

  if (filters.claim_type) {
    match.claim_type = Array.isArray(filters.claim_type)
      ? { $in: filters.claim_type }
      : filters.claim_type;
  }

  if (filters.contract_type) {
    match.contract_type = Array.isArray(filters.contract_type)
      ? { $in: filters.contract_type }
      : filters.contract_type;
  }

  if (filters.provider) {
    match.provider = { $regex: escapeRegex(filters.provider), $options: 'i' };
  }

  if (filters.cost_from !== undefined || filters.cost_to !== undefined) {
    match.cost = {} as any;
    if (filters.cost_from !== undefined) match.cost.$gte = filters.cost_from;
    if (filters.cost_to !== undefined) match.cost.$lte = filters.cost_to;
  }

  if (filters.service_date_from || filters.service_date_to) {
    match.service_date = {} as any;
    if (filters.service_date_from)
      match.service_date.$gte = new Date(filters.service_date_from as any);
    if (filters.service_date_to)
      match.service_date.$lte = new Date(filters.service_date_to as any);
  }

  if (globalSearch && globalSearch.trim().length > 0) {
    const r = { $regex: escapeRegex(globalSearch), $options: 'i' };
    match.$or = [
      { patient: r },
      { diagnosis: r },
      { provider: r },
      { hospital: r },
      { agreement: r },
    ];
  }

  return match;
}

export function buildSortStage(sort?: SortOption) {
  const field = sort?.field ?? 'service_date';
  const dir = sort?.order === 'asc' ? 1 : -1;
  return { $sort: { [field]: dir } } as const;
}

export function buildPipeline(
  filters: ClaimsFilters,
  sort: SortOption | undefined,
  skip: number,
  limit: number,
  globalSearch: string,
) {
  const pipeline: any[] = [];
  const match = buildMatchStage(filters, globalSearch);
  if (Object.keys(match).length > 0) pipeline.push({ $match: match });
  pipeline.push(buildSortStage(sort));
  if (skip > 0) pipeline.push({ $skip: skip });
  if (limit > 0) pipeline.push({ $limit: limit });
  return pipeline;
}

function escapeRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


