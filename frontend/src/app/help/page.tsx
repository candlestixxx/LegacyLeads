import React from 'react';
import PageShell from '../components/PageShell';
import {
  BookOpen,
  MessageCircle,
  Zap,
  Shield,
  HelpCircle,
  Mail,
} from 'lucide-react';

/**
 * Help Center — self-service guides and support contact.
 *
 * Static content page (no data fetching). Answers the top questions new
 * OmniLead Nexus users ask: how to sync MLS, how skip-trace credits work,
 * how to export contacts, and how to reach support.
 */

const FAQ = [
  {
    q: 'How do I sync my MLS feed?',
    a: 'Go to Options & Sync and paste your RESO Web API endpoint and credentials. Toggle the MLS Feed source on and click Save. The first sync may take 5-10 minutes depending on listing volume. Subsequent syncs run on your configured interval.',
  },
  {
    q: 'What are skip-trace credits?',
    a: 'Each owner phone or email lookup consumes one credit. Credits never expire and can be topped up from the sidebar at any time. Bulk enrichment of a saved search batch costs one credit per record, not per field.',
  },
  {
    q: 'How do I export contacts to my CRM?',
    a: 'From the Contact +plus page, select the records you want and click Export. You can download a CSV or push directly to a connected CRM via webhook. Exports include all skip-traced fields and equity estimates.',
  },
  {
    q: 'What does "Estimated Equity" mean?',
    a: 'Estimated Equity is the county-assessed value minus the outstanding mortgage balance, derived from recorder records and AVM models. Treat it as a directional signal, not a certified appraisal.',
  },
  {
    q: 'How often is the listing data refreshed?',
    a: 'The sync interval is configurable from every 5 minutes to every 6 hours. MLS RESO feeds typically push updates on their own cadence; the sync pulls the latest diff using ModificationTimestamp.',
  },
  {
    q: 'Can I run this for multiple counties?',
    a: 'Yes. Add each county as a separate data source in Options & Sync. The Neighborhood Data page rolls up all active sources into a unified market view.',
  },
];

export default function HelpPage() {
  return (
    <PageShell
      title="Help Center"
      subtitle="Guides, FAQ, and support for OmniLead Nexus"
    >
      {/* Quick-start cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          {
            icon: Zap,
            title: 'Quick Start',
            desc: 'Connect your MLS feed, enable skip-trace, and generate your first prospecting list in under 10 minutes.',
            color: 'text-yellow-600 bg-yellow-50',
          },
          {
            icon: Shield,
            title: 'Data & Compliance',
            desc: 'All data is sourced from public records and licensed MLS feeds. DNC and TCPA compliance checks run on every outbound contact.',
            color: 'text-blue-600 bg-blue-50',
          },
          {
            icon: MessageCircle,
            title: 'Contact Support',
            desc: 'Reach the team at support@omnilead.example.com. Typical response time is under 2 business hours.',
            color: 'text-emerald-600 bg-emerald-50',
          },
        ].map((card) => (
          <div key={card.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className={`inline-flex p-2 rounded-lg ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-800 mt-3">{card.title}</h3>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <BookOpen className="w-5 h-5 text-blue-500" />
          <h2 className="font-semibold text-gray-800">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-5">
          {FAQ.map((item, i) => (
            <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{item.q}</p>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Support CTA */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6 flex items-center gap-4">
        <Mail className="w-8 h-8 text-blue-500 shrink-0" />
        <div>
          <p className="font-semibold text-gray-800">Still need help?</p>
          <p className="text-sm text-gray-500">
            Email{' '}
            <a href="mailto:support@omnilead.example.com" className="text-blue-600 hover:underline">
              support@omnilead.example.com
            </a>{' '}
            or open the chat widget in the bottom-right corner.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
