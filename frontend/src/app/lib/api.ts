/**
 * Shared API client for OmniLead Nexus frontend.
 *
 * Why: the five page routes all talk to the same backend and need the same
 * error/loading handling. Centralising here keeps pages focused on layout
 * and lets us swap the base URL without touching every fetch call.
 */

// The legacyleads backend listens on PORT (default 3001) but the tray
// orchestrator assigns 3006 to avoid colliding with leadg on 3001.
// Override with NEXT_PUBLIC_API_URL at build time if needed.
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3006';

/** Mirrors backend `UnifiedPropertyRecord` (RESO Web API standard). */
export interface PropertyRecord {
  ListingKey: string;
  ListAgentMlsId?: string;
  ListingId: string;
  PropertyType: 'Residential' | 'Commercial' | 'Land' | 'Other';
  StandardStatus:
    | 'Active'
    | 'Pending'
    | 'Closed'
    | 'Expired'
    | 'Canceled'
    | 'Withdrawn'
    | 'ComingSoon';
  Latitude?: number;
  Longitude?: number;
  UnparsedAddress: string;
  City: string;
  StateOrProvince: string;
  PostalCode: string;
  ListPrice: number;
  ClosePrice?: number;
  BedroomsTotal?: number;
  BathroomsTotalInteger?: number;
  LivingArea?: number;
  LotSizeAcres?: number;
  OwnerName?: string;
  OwnerPhones?: string[];
  OwnerEmails?: string[];
  IsAbsenteeOwner?: boolean;
  EstimatedEquity?: number;
  ModificationTimestamp: string;
}

export interface ApiResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

/**
 * GET a JSON array from the backend with unified error handling.
 * Returns `{ data, error }` so callers never need try/catch boilerplate.
 */
export async function fetchListings(): Promise<{
  data: PropertyRecord[];
  error: string | null;
}> {
  try {
    const res = await fetch(`${API_BASE}/listings`, { cache: 'no-store' });
    if (!res.ok) return { data: [], error: `HTTP ${res.status} from API` };
    const json = await res.json();
    return { data: Array.isArray(json) ? json : (json.listings ?? []), error: null };
  } catch (e) {
    return { data: [], error: e instanceof Error ? e.message : 'API unreachable' };
  }
}

/** Currency formatter shared by every page that shows ListPrice / equity. */
export function fmtCurrency(n: number | undefined): string {
  if (n == null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

/** Relative-time formatter for ModificationTimestamp columns. */
export function fmtRelative(iso: string | undefined): string {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
