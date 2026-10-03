import React from 'react';
import PageShell from '../components/PageShell';
import { fetchListings, fmtCurrency, fmtRelative, PropertyRecord } from '../lib/api';
import { Phone, Mail, User, MapPin, DollarSign } from 'lucide-react';

/**
 * Contact +plus — skip-traced owner contact database.
 *
 * Shows every property record that has been augmented with owner phones,
 * emails, and equity estimates. This is the primary outbound-prospecting
 * surface: agents filter by equity/absentee status and export contacts.
 *
 * Data source: GET /listings from the legacyleads backend (RESO schema).
 */
export const dynamic = 'force-dynamic'; // Always show fresh contact data.

function ContactRow({ rec }: { rec: PropertyRecord }) {
  return (
    <tr className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400 shrink-0" />
          <div>
            <p className="font-semibold text-gray-800 text-sm">{rec.OwnerName ?? 'Unknown Owner'}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" /> {rec.UnparsedAddress}, {rec.City}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {(rec.OwnerPhones ?? []).map((p, i) => (
            <a
              key={i}
              href={`tel:${p}`}
              className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full hover:bg-green-100"
              title={`Call ${p}`}
            >
              <Phone className="w-3 h-3" /> {p}
            </a>
          ))}
          {(!rec.OwnerPhones || rec.OwnerPhones.length === 0) && (
            <span className="text-xs text-gray-400">No phones</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {(rec.OwnerEmails ?? []).map((e, i) => (
            <a
              key={i}
              href={`mailto:${e}`}
              className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-100"
              title={`Email ${e}`}
            >
              <Mail className="w-3 h-3" /> {e}
            </a>
          ))}
          {(!rec.OwnerEmails || rec.OwnerEmails.length === 0) && (
            <span className="text-xs text-gray-400">No emails</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        <div className="flex items-center gap-1">
          <DollarSign className="w-3 h-3 text-emerald-500" />
          {fmtCurrency(rec.EstimatedEquity)}
        </div>
        {rec.IsAbsenteeOwner && (
          <span className="text-xs bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded mt-1 inline-block">
            Absentee
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-xs text-gray-500">{fmtRelative(rec.ModificationTimestamp)}</td>
    </tr>
  );
}

export default async function ContactsPage() {
  const { data, error } = await fetchListings();

  // Only records that have been skip-traced (owner name present) belong here.
  const contacts = (data ?? []).filter((r) => r.OwnerName);

  return (
    <PageShell
      title="Contact +plus"
      subtitle="Skip-traced owner contacts with phone, email, and equity intelligence"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          <strong>API unreachable:</strong> {error}. Start the legacyleads backend on port 3006
          (<code>cd apps/legacyleads/backend && npm run dev</code>).
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Contacts', value: contacts.length, color: 'text-blue-600' },
          {
            label: 'Absentee Owners',
            value: contacts.filter((r) => r.IsAbsenteeOwner).length,
            color: 'text-amber-600',
          },
          {
            label: 'With Phone + Email',
            value: contacts.filter((r) => (r.OwnerPhones?.length ?? 0) > 0 && (r.OwnerEmails?.length ?? 0) > 0).length,
            color: 'text-emerald-600',
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Owner Directory</h2>
          <span className="text-xs text-gray-500">{contacts.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Owner / Property</th>
                <th className="px-4 py-3">Phones</th>
                <th className="px-4 py-3">Emails</th>
                <th className="px-4 py-3">Est. Equity</th>
                <th className="px-4 py-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400 text-sm">
                    {error
                      ? 'No data available — backend offline.'
                      : 'No skip-traced contacts yet. Run the augmentation pipeline to enrich listings.'}
                  </td>
                </tr>
              ) : (
                contacts.map((rec) => <ContactRow key={rec.ListingKey} rec={rec} />)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
