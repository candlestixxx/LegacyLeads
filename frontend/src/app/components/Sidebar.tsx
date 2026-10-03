'use client';

/**
 * Persistent left navigation for OmniLead Nexus.
 *
 * Why client component: `usePathname()` drives the active-item highlight,
 * which needs browser routing state. Every nav item is a real Next.js
 * Link so pages are deep-linkable and browser back/forward works.
 */
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  Search,
  Settings,
  HelpCircle,
  Map,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  /** Tooltip text for screen readers and title attribute. */
  tip: string;
}

const leadsNav: NavItem[] = [
  { href: '/contacts', label: 'Contact +plus', icon: Users, tip: 'Skip-traced owner contacts with phones and emails' },
  { href: '/fsbo-expired', label: 'FSBO / Expired', icon: Home, tip: 'For-sale-by-owner and expired listing leads' },
  { href: '/neighborhoods', label: 'Neighborhood Data', icon: Search, tip: 'Market analytics by ZIP and county' },
];

const systemNav: NavItem[] = [
  { href: '/settings', label: 'Options & Sync', icon: Settings, tip: 'API keys, sync schedule, and data sources' },
  { href: '/help', label: 'Help Center', icon: HelpCircle, tip: 'Guides, FAQ, and support contact' },
];

export default function Sidebar() {
  const pathname = usePathname();

  function NavRow({ item }: { item: NavItem }) {
    const active =
      pathname === item.href || pathname.startsWith(item.href + '/');
    const Icon = item.icon;
    return (
      <li>
        <Link
          href={item.href}
          title={item.tip}
          className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors ${
            active
              ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50'
              : 'text-gray-300 hover:bg-gray-800 border border-transparent'
          }`}
        >
          <Icon className={`w-5 h-5 ${active ? 'text-blue-400' : 'text-gray-400'}`} />
          <span>{item.label}</span>
        </Link>
      </li>
    );
  }

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col justify-between p-4 border-r border-gray-800 shrink-0">
      <div>
        <Link href="/" className="flex items-center space-x-2 mb-8" title="Back to live market map">
          <Map className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold tracking-tight">OmniLead Nexus</h1>
        </Link>

        <nav className="space-y-4">
          <div>
            <h2 className="text-xs uppercase text-gray-400 font-semibold mb-2">Leads</h2>
            <ul className="space-y-2">
              {leadsNav.map((item) => (
                <NavRow key={item.href} item={item} />
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div>
        <nav className="space-y-2 mb-4">
          <h2 className="text-xs uppercase text-gray-400 font-semibold mb-2">System</h2>
          <ul className="space-y-2">
            {systemNav.map((item) => (
              <NavRow key={item.href} item={item} />
            ))}
          </ul>
        </nav>

        {/* Credit Augmentation Frictionless Top-Off Sidebar */}
        <div className="bg-gray-800 p-4 rounded-lg mt-4 border border-gray-700">
          <p className="text-sm font-semibold text-gray-300">Available Credits</p>
          <div className="flex justify-between items-baseline mt-1 mb-3">
            <span className="text-2xl font-bold text-white">4,250</span>
            <span className="text-xs text-blue-400 font-medium">PREMIUM</span>
          </div>
          <button
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded transition-colors text-sm"
            title="Purchase additional skip-trace and enrichment credits"
          >
            Add More
          </button>
        </div>
      </div>
    </div>
  );
}
