'use client';

import React from 'react';
import { Search, Sparkles } from 'lucide-react';

export default function OmniSearch() {
  return (
    <div className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm relative z-10">
      <div className="flex-1 max-w-3xl flex items-center bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
        <Search className="w-5 h-5 text-gray-400 mr-3" />
        <input
          type="text"
          placeholder='Try: "Free and clear properties in St. Clair county near waterfront areas"'
          className="w-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 text-sm"
        />
      </div>

      <div className="ml-6 flex items-center space-x-4">
        {/* Mock AI Suggestion Widget Trigger */}
        <button className="flex items-center space-x-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-4 py-2 rounded-lg transition-colors group">
            <Sparkles className="w-4 h-4 text-purple-600 group-hover:animate-pulse" />
            <span className="text-sm font-semibold text-purple-700">AI Recommendations</span>
        </button>
      </div>
    </div>
  );
}