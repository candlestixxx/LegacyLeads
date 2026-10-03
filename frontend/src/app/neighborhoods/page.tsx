import React from 'react';
import PageShell from '../components/PageShell';
import { fetchListings, fmtCurrency, PropertyRecord } from '../lib/api';
import { MapPin, Building2, BarChart3, DollarSign } from 'lucide-react';

/**
 * Neighborhood Data — market analytics aggregated by city and ZIP.
 *
 * Groups the listing feed by City / PostalCode and computes average price,
 * bedroom mix, and inventory counts so agents can spot micro-market trends
 * before prospecting. The InteractiveMap on the home page shows spatial
 * view; this page shows the tabular roll-up.
 *
 * Data source: GET /listings from the legacyleads backend.
 */
export const dynamic = 'force-dynamic';

interface MarketSlice {
  key: string; // "City, State" or ZIP
  city: string;
  state: string;
  count: number;
  avgPrice: number;
  avgBeds: number;
  active: number;
  distressed: number; // Expired + Canceled + Withdrawn
}

function aggregateByCity(records: PropertyRecord[]): MarketSlice[] {
  const map = new Map<string, PropertyRecord[]>();
  for (const r of records) {
    const key = `${r.City}, ${r.StateOrProvince}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }
  return [...map.entries()]
    .map(([key, recs]) => {
      const prices = recs.map((r) => r.ListPrice).filter((p) => p > 0);
      const beds = recs.map((r) => r.BedroomsTotal).filter((b): b is number => b != null);
      return {
        key,
        city: recs[0].City,
        state: recs[0].StateOrProvince,
        count: recs.length,
        avgPrice: prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0,
        avgBeds: beds.length ? Math.round((beds.reduce((a, b) => a + b, 0) / beds.length) * 10) / 10 : 0,
        active: recs.filter((r) => r.StandardStatus === 'Active').length,
        distressed: recs.filter((r) =>
          ['Expired', 'Canceled', 'Withdrawn'].includes(r.StandardStatus),
        ).length,
      };
    })
    .sort((a, b) => b.count - a.count);
}

export default async function NeighborhoodsPage() {
  const { data, error } = await fetchListings();
  const all = data ?? [];
  const slices = aggregateByCity(all);

  const totalActive = all.filter((r) => r.StandardStatus === 'Active').length;
  const totalDistressed = all.filter((r) =>
    ['Expired', 'Canceled', 'Withdrawn'].includes(r.StandardStatus),
  ).length;
  const overallAvg =
    all.length > 0
      ? Math.round(all.reduce((s, r) => s + r.ListPrice, 0) / all.length)
      : 0;

  return (
    <PageShell
      title="Neighborhood Data"
      subtitle="Market analytics aggregated by city — spot micro-market trends before prospecting"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          <strong>API unreachable:</strong> {error}. Start the legacyleads backend on port 3006.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Listings', value: all.length, icon: Building2, color: 'text-blue-600' },
          { label: 'Active', value: totalActive, icon: BarChart3, color: 'text-emerald-600' },
          { label: 'Distressed', value: totalDistressed, icon: BarChart3, color: 'text-red-600' },
          { label: 'Avg List Price', value: fmtCurrency(overallAvg), icon: DollarSign, color: 'text-purple-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.label}</p>
            </div>
            <p className={`text-2xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Market Slices</h2>
          <span className="text-xs text-gray-500">{slices.length} cities</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Market</th>
                <th className="px-4 py-3">Inventory</th>
                <th className="px-4 py-3">Avg Price</th>
                <th className="px-4 py-3">Avg Beds</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3">Distressed</th>
              </tr>
            </thead>
            <tbody>
              {slices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">
                    {error
                      ? 'No data available — backend offline.'
                      : 'No listings in the feed. Run MLS sync to populate market data.'}
                  </td>
                </tr>
              ) : (
                slices.map((s) => (
                  <tr key={s.key} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{s.city}</p>
                          <p className="text-xs text-gray-500">{s.state}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 font-medium">{s.count}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{fmtCurrency(s.avgPrice)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{s.avgBeds}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-2 max-w-[80px]">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${s.count ? (s.active / s.count) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{s.active}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-2 max-w-[80px]">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${s.count ? (s.distressed / s.count) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{s.distressed}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
