import React from 'react';
import Sidebar from './components/Sidebar';
import OmniSearch from './components/OmniSearch';
import InteractiveMap from './components/InteractiveMap';

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <OmniSearch />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Map Area dominates the view */}
            <div className="lg:col-span-2 h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
               <InteractiveMap />
            </div>

            {/* Fresh Market Leads Feed */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col h-[calc(100vh-140px)]">
              <h2 className="text-lg font-bold text-gray-800 mb-4 tracking-tight">Live Market Feed</h2>
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                 {/* Mock Feed Items */}
                 <div className="p-3 border border-gray-100 bg-gray-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">EXPIRED</span>
                      <span className="text-xs text-gray-500 font-medium">2m ago</span>
                    </div>
                    <p className="font-semibold text-gray-800 text-sm mt-2">1244 Waterfront Ave</p>
                    <p className="text-xs text-gray-500 mt-1">St. Clair County • $450,000</p>
                 </div>

                 <div className="p-3 border border-gray-100 bg-gray-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">FSBO</span>
                      <span className="text-xs text-gray-500 font-medium">15m ago</span>
                    </div>
                    <p className="font-semibold text-gray-800 text-sm mt-2">8910 Pineview Dr</p>
                    <p className="text-xs text-gray-500 mt-1">Oakland County • $285,000</p>
                 </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
