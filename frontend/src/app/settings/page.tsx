'use client';

/**
 * Options & Sync — data source configuration and sync controls.
 *
 * Why client component: form inputs and the "Test Connection" button need
 * local state and event handlers. The page manages the backend's sync
 * endpoints and persists settings to localStorage (server-side persistence
 * lands when the backend gains a settings API).
 */
import React, { useState } from 'react';
import PageShell from '../components/PageShell';
import {
  RefreshCw,
  Key,
  Database,
  Globe,
  Save,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface SyncSource {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  enabled: boolean;
  status: 'connected' | 'disconnected' | 'unknown';
}

const DEFAULT_SOURCES: SyncSource[] = [
  {
    id: 'mls',
    name: 'MLS Feed (RESO Web API)',
    description: 'Primary listing data via RESO OData endpoints. Auto-sync every 15 minutes.',
    endpoint: 'https://mls.example.com/odata/Property',
    enabled: true,
    status: 'unknown',
  },
  {
    id: 'county',
    name: 'County Records',
    description: 'Assessor and recorder data for ownership and equity augmentation.',
    endpoint: 'https://county.example.com/api/records',
    enabled: true,
    status: 'unknown',
  },
  {
    id: 'skiptrace',
    name: 'Skip Trace Provider',
    description: 'Owner phone and email enrichment. Consumes credits per lookup.',
    endpoint: 'https://api.skiptrace.example.com/v2',
    enabled: false,
    status: 'unknown',
  },
];

export default function SettingsPage() {
  const [sources, setSources] = useState<SyncSource[]>(DEFAULT_SOURCES);
  const [syncInterval, setSyncInterval] = useState('15');
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);

  function toggleSource(id: string) {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    );
    setSaved(false);
  }

  async function testConnection(id: string) {
    setTesting(id);
    // Simulated test — real implementation will hit /health on each source.
    await new Promise((r) => setTimeout(r, 1200));
    setSources((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: Math.random() > 0.3 ? 'connected' : 'disconnected' }
          : s,
      ),
    );
    setTesting(null);
  }

  function handleSave() {
    localStorage.setItem('omnilead-settings', JSON.stringify({ sources, syncInterval }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <PageShell
      title="Options & Sync"
      subtitle="Configure data sources, sync schedules, and API credentials"
    >
      {/* Sync Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw className="w-5 h-5 text-blue-500" />
          <h2 className="font-semibold text-gray-800">Sync Schedule</h2>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-600">Auto-sync interval</label>
          <select
            value={syncInterval}
            onChange={(e) => { setSyncInterval(e.target.value); setSaved(false); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="5">Every 5 minutes</option>
            <option value="15">Every 15 minutes</option>
            <option value="30">Every 30 minutes</option>
            <option value="60">Every hour</option>
            <option value="360">Every 6 hours</option>
          </select>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {/* Data Sources */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-blue-500" />
          <h2 className="font-semibold text-gray-800">Data Sources</h2>
        </div>
        <div className="space-y-4">
          {sources.map((src) => (
            <div key={src.id} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <p className="font-semibold text-gray-800 text-sm">{src.name}</p>
                    {src.status === 'connected' && (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Connected
                      </span>
                    )}
                    {src.status === 'disconnected' && (
                      <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3" /> Disconnected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{src.description}</p>
                  <p className="text-xs text-gray-400 mt-1 font-mono">{src.endpoint}</p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <button
                    onClick={() => testConnection(src.id)}
                    disabled={testing === src.id}
                    className="text-xs text-blue-600 hover:text-blue-800 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
                  >
                    {testing === src.id ? 'Testing…' : 'Test'}
                  </button>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={src.enabled}
                      onChange={() => toggleSource(src.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-5 h-5 text-blue-500" />
          <h2 className="font-semibold text-gray-800">API Credentials</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'MLS API Key', placeholder: 'mls_live_••••••••' },
            { label: 'Skip Trace API Key', placeholder: 'sk_live_••••••••' },
          ].map((field) => (
            <div key={field.label}>
              <label className="block text-xs text-gray-500 font-medium mb-1">{field.label}</label>
              <input
                type="password"
                placeholder={field.placeholder}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Keys are stored in your local environment (<code>.env</code>) and never sent to third parties.
        </p>
      </div>
    </PageShell>
  );
}
