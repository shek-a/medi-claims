// Core domain types for medical claims and query parameters

export type ClaimStatus = "Assessed" | "Paid" | "Verified" | "Received" | "Cancelled";

export interface MedicalClaim {
  _id?: string;
  claim_type: string;
  status: ClaimStatus;
  episode_id: number;
  claim: number;
  member_no: number;
  patient: string;
  sex: "M" | "F" | "O";
  hospital: string;
  provider: string;
  agreement: string;
  service_date: string | Date;
  admit_date?: string | Date;
  disch_date?: string | Date;
  service: string;
  diagnosis: string;
  cost: number;
  benefit: number;
  payee: string;
  message_id: string;
  severity: string;
  full_text: string;
  contract_type?: string;
}

export interface ClaimsFilters {
  claim?: number;
  member_no?: number;
  episode_id?: number;
  hospital?: string | string[];
  provider?: string;
  status?: ClaimStatus | ClaimStatus[];
  claim_type?: string | string[];
  contract_type?: string | string[];
  cost_from?: number;
  cost_to?: number;
  service_date_from?: string | Date;
  service_date_to?: string | Date;
}

export interface SortOption {
  field: keyof MedicalClaim | "service_date" | "cost" | "claim" | "member_no" | "episode_id";
  order: "asc" | "desc";
}

export interface PageParams {
  page: number;
  limit: number;
}

export interface PageResult<T> {
  data: T[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}


