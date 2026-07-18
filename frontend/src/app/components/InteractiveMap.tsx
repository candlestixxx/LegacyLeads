'use client';

import React, { useState } from 'react';
import Map, { NavigationControl, ScaleControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

// Note: Mapbox access token must be provided via NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function InteractiveMap() {
  const [viewState, setViewState] = useState({
    longitude: -83.0458, // Default to Detroit area as a placeholder
    latitude: 42.3314,
    zoom: 11
  });

  return (
    <div className="w-full h-full relative bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden border border-gray-200">
      {MAPBOX_TOKEN ? (
          <Map
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/light-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
            style={{ width: '100%', height: '100%' }}
          >
            <NavigationControl position="top-right" />
            <ScaleControl position="bottom-right" />
            {/* Future implementation: Add mapbox-gl-draw for drawing polygons */}
            {/* Future implementation: Add Supercluster layers for performance */}
          </Map>
      ) : (
          <div className="text-center p-8 text-gray-500 flex flex-col items-center">
             <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
             <p className="font-medium text-lg text-gray-700">Map Interface Offline</p>
             <p className="text-sm mt-1 max-w-sm">Please set the <code className="bg-gray-200 px-1 py-0.5 rounded text-gray-800">NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> environment variable to render the interactive geospatial layers.</p>
          </div>
      )}

      {/* Floating Action Bar overlaying the map */}
      <div className="absolute top-4 left-4 bg-white shadow-lg rounded-lg border border-gray-200 p-2 flex space-x-2 z-10">
         <button className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded text-sm font-semibold border border-blue-200 transition-colors">Draw Boundary</button>
         <button className="bg-white text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded text-sm font-semibold border border-gray-200 transition-colors">Clear</button>
      </div>
    </div>
  );
}