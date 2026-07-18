'use client';

import React from 'react';
import { Home, Users, Search, Settings, HelpCircle, Map } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col justify-between p-4 border-r border-gray-800">
      <div>
        <div className="flex items-center space-x-2 mb-8">
            <Map className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold tracking-tight">OmniLead Nexus</h1>
        </div>

        <nav className="space-y-4">
          <div>
            <h2 className="text-xs uppercase text-gray-400 font-semibold mb-2">Leads</h2>
            <ul className="space-y-2">
              <li className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded cursor-pointer">
                <Users className="w-5 h-5 text-gray-400" />
                <span>Contact +plus</span>
              </li>
              <li className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded cursor-pointer">
                <Home className="w-5 h-5 text-gray-400" />
                <span>FSBO/Expired</span>
              </li>
              <li className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded cursor-pointer bg-blue-900/30 text-blue-400 border border-blue-800/50">
                <Search className="w-5 h-5" />
                <span>Neighborhood Data</span>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div>
        <nav className="space-y-2 mb-4">
            <h2 className="text-xs uppercase text-gray-400 font-semibold mb-2">System</h2>
            <li className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded cursor-pointer">
              <Settings className="w-5 h-5 text-gray-400" />
              <span>Options & Sync</span>
            </li>
            <li className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded cursor-pointer">
              <HelpCircle className="w-5 h-5 text-gray-400" />
              <span>Help Center</span>
            </li>
        </nav>

        {/* Credit Augmentation Frictionless Top-Off Sidebar */}
        <div className="bg-gray-800 p-4 rounded-lg mt-4 border border-gray-700">
          <p className="text-sm font-semibold text-gray-300">Available Credits</p>
          <div className="flex justify-between items-baseline mt-1 mb-3">
             <span className="text-2xl font-bold text-white">4,250</span>
             <span className="text-xs text-blue-400 font-medium">PREMIUM</span>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded transition-colors text-sm">
            Add More
          </button>
        </div>
      </div>
    </div>
  );
}