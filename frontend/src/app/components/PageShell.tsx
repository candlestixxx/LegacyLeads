/**
 * Shared page chrome for all OmniLead Nexus sub-pages.
 *
 * Why: every sub-page needs the same Sidebar + OmniSearch shell around its
 * unique content. Extracting here means each page.tsx only declares its
 * own body — no copy-pasted layout markup that drifts over time.
 */
import React from 'react';
import Sidebar from '../components/Sidebar';
import OmniSearch from '../components/OmniSearch';

export default function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <OmniSearch />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
