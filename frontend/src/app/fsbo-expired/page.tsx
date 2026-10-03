import React from 'react';
import PageShell from '../components/PageShell';
import { fetchListings, fmtCurrency, fmtRelative, PropertyRecord } from '../lib/api';
import { AlertTriangle, Clock, TrendingDown, Home } from 'lucide-react';

/**
 * FSBO / Expired — the core prospecting list for distressed listings.
 *
 * Filters the unified listing feed down to records whose StandardStatus is
 * Expired, Canceled, or Withdrawn (FSBO-style), then ranks them by equity
 * so agents work the highest-value opportunities first.
 *
 * Data source: GET /listings from the legacyleads backend.
 */
export const dynamic = 'force-dynamic';

/** Statuses that represent a "dead listing" worth prospecting. */
const PROSPECT_STATUSES = ['Expired', 'Canceled', 'Withdrawn'] as const;

function StatusBadge({ status }: { status: PropertyRecord['StandardStatus'] }) {
  const styles: Record<string, string> = {
    Expired: 'bg-red-100 text-red-700',
    Canceled: 'bg-orange-100 text-orange-700',
    Withdrawn: 'bg-gray-100 text-gray-600',
    Pending: 'bg-yellow-100 text-yellow-700',
    Active: 'bg-green-100 text-green-700',
    Closed: 'bg-blue-100 text-blue-700',
    ComingSoon: 'bg-purple-100 text-purple-700',
  };
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded ${styles[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status.toUpperCase()}
    </span>
  );
}

function LeadCard({ rec }: { rec: PropertyRecord }) {
  return (
    <div className="p-4 border border-gray-100 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex justify-between items-start mb-2">
        <StatusBadge status={rec.StandardStatus} />
        <span className="text-xs text-gray-500 font-medium">{fmtRelative(rec.ModificationTimestamp)}</span>
      </div>
      <p className="font-semibold text-gray-800 text-sm mt-2">{rec.UnparsedAddress}</p>
      <p className="text-xs text-gray-500 mt-1">
        {rec.City}, {rec.StateOrProvince} {rec.PostalCode}
      </p>
      <div className="flex items-center gap-3 mt-3">
        <div className="flex items-center gap-1 text-sm font-bold text-gray-800">
          <Home className="w-3.5 h-3.5 text-blue-500" />
          {fmtCurrency(rec.ListPrice)}
        </div>
        {rec.BedroomsTotal != null && (
          <span className="text-xs text-gray-500">
            {rec.BedroomsTotal} bd / {rec.BathroomsTotalInteger ?? '?'} ba
          </span>
        )}
      </div>
      {rec.EstimatedEquity != null && rec.EstimatedEquity > 0 && (
        <div className="flex items-center gap-1 mt-2 text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
          <TrendingDown className="w-3 h-3" />
          Est. equity {fmtCurrency(rec.EstimatedEquity)}
        </div>
      )}
      {rec.IsAbsenteeOwner && (
        <div className="flex items-center gap-1 mt-2 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
          <AlertTriangle className="w-3 h-3" />
          Absentee owner — high motivation signal
        </div>
      )}
    </div>
  );
}

export default async function FsboExpiredPage() {
  const { data, error } = await fetchListings();
  const all = data ?? [];

  const prospects = all
    .filter((r) => PROSPECT_STATUSES.includes(r.StandardStatus as (typeof PROSPECT_STATUSES)[number]))
    .sort((a, b) => (b.EstimatedEquity ?? 0) - (a.EstimatedEquity ?? 0));

  const byStatus = {
    Expired: prospects.filter((r) => r.StandardStatus === 'Expired').length,
    Canceled: prospects.filter((r) => r.StandardStatus === 'Canceled').length,
    Withdrawn: prospects.filter((r) => r.StandardStatus === 'Withdrawn').length,
  };

  return (
    <PageShell
      title="FSBO / Expired"
      subtitle="Dead-listing prospecting queue ranked by estimated owner equity"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          <strong>API unreachable:</strong> {error}. Start the legacyleads backend on port 3006.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Expired', value: byStatus.Expired, icon: Clock, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Canceled', value: byStatus.Canceled, icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Withdrawn', value: byStatus.Withdrawn, icon: TrendingDown, color: 'text-gray-600', bg: 'bg-gray-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800">Prospecting Queue</h2>
        <p className="text-xs text-gray-500">Sorted by estimated equity (highest first)</p>
      </div>

      {prospects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-400 text-sm">
          {error
            ? 'No data available — backend offline.'
            : 'No expired or canceled listings in the feed yet. Listings appear here after the MLS sync marks them dead.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prospects.map((rec) => (
            <LeadCard key={rec.ListingKey} rec={rec} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
