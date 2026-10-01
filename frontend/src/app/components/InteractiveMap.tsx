'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Map, { NavigationControl, ScaleControl, Source, Layer } from 'react-map-gl/mapbox';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import Supercluster from 'supercluster';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface LeadPoint {
  id: string;
  lng: number;
  lat: number;
  status: string;
  address: string;
}

const SAMPLE_LEADS: LeadPoint[] = Array.from({ length: 200 }, (_, i) => ({
  id: `lead-${i}`,
  lng: -83.0458 + (Math.random() - 0.5) * 0.3,
  lat: 42.3314 + (Math.random() - 0.5) * 0.2,
  status: ['new', 'contacted', 'qualified', 'lost'][i % 4],
  address: `${100 + i} Main St, Detroit, MI`,
}));

const CLUSTER_COLORS: Record<string, string> = {
  new: '#3B82F6',
  contacted: '#F59E0B',
  qualified: '#10B981',
  lost: '#EF4444',
};

export default function InteractiveMap() {
  const [viewState, setViewState] = useState({
    longitude: -83.0458,
    latitude: 42.3314,
    zoom: 11,
  });
  const [drawMode, setDrawMode] = useState(false);
  const [geoFence, setGeoFence] = useState<any>(null);
  const [filteredLeads, setFilteredLeads] = useState<LeadPoint[]>(SAMPLE_LEADS);
  const drawRef = useRef<MapboxDraw | null>(null);
  const mapRef = useRef<any>(null);

  const clusterRef = useRef(new Supercluster({ radius: 50, maxZoom: 16 }));

  useEffect(() => {
    clusterRef.current.load(
      SAMPLE_LEADS.map((l) => ({
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [l.lng, l.lat] },
        properties: { ...l },
      }))
    );
  }, []);

  const onMapLoad = useCallback((event: any) => {
    const map = event.target;
    mapRef.current = map;

    if (!drawRef.current) {
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: { polygon: true, trash: true },
      });
      map.addControl(draw);
      drawRef.current = draw;

      map.on('draw.create', (e: any) => {
        const feature = e.features[0];
        setGeoFence(feature);
        filterLeadsByGeoFence(feature);
      });

      map.on('draw.delete', () => {
        setGeoFence(null);
        setFilteredLeads(SAMPLE_LEADS);
      });
    }
  }, []);

  const filterLeadsByGeoFence = (polygon: any) => {
    if (!polygon?.geometry?.coordinates?.[0]) {
      setFilteredLeads(SAMPLE_LEADS);
      return;
    }
    const coords = polygon.geometry.coordinates[0];
    const filtered = SAMPLE_LEADS.filter((lead) => isPointInPolygon([lead.lng, lead.lat], coords));
    setFilteredLeads(filtered);
  };

  const isPointInPolygon = (point: number[], polygon: number[][]) => {
    const [x, y] = point;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];
      const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const toggleDraw = () => {
    if (!drawRef.current) return;
    if (drawMode) {
      drawRef.current.changeMode('simple_select');
      setDrawMode(false);
    } else {
      drawRef.current.changeMode('draw_polygon');
      setDrawMode(true);
    }
  };

  const clearFence = () => {
    if (drawRef.current) drawRef.current.deleteAll();
    setGeoFence(null);
    setFilteredLeads(SAMPLE_LEADS);
    setDrawMode(false);
  };

  const clusterData = {
    type: 'FeatureCollection' as const,
    features: filteredLeads.map((l) => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [l.lng, l.lat] },
      properties: { ...l },
    })),
  };

  return (
    <div className="w-full h-full relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
      {MAPBOX_TOKEN ? (
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/light-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
          style={{ width: '100%', height: '100%' }}
          onLoad={onMapLoad}
        >
          <NavigationControl position="top-right" />
          <ScaleControl position="bottom-right" />
          <Source id="lead-clusters" type="geojson" data={clusterData as any}>
            <Layer
              id="lead-points"
              type="circle"
              paint={{
                'circle-radius': 8,
                'circle-color': [
                  'match', ['get', 'status'],
                  'new', CLUSTER_COLORS.new,
                  'contacted', CLUSTER_COLORS.contacted,
                  'qualified', CLUSTER_COLORS.qualified,
                  'lost', CLUSTER_COLORS.lost,
                  '#666',
                ],
                'circle-stroke-width': 2,
                'circle-stroke-color': '#fff',
              }}
            />
          </Source>
        </Map>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          <div className="text-center p-8">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4 mx-auto" />
            <p className="font-medium text-lg text-gray-700">Map Interface Offline</p>
            <p className="text-sm mt-1 max-w-sm mx-auto">
              Set <code className="bg-gray-200 px-1 py-0.5 rounded">NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> to enable the map.
            </p>
          </div>
        </div>
      )}

      <div className="absolute top-4 left-4 bg-white shadow-lg rounded-lg border border-gray-200 p-2 flex items-center space-x-2 z-10">
        <button
          onClick={toggleDraw}
          className={`px-3 py-1.5 rounded text-sm font-semibold border transition-colors ${
            drawMode ? 'bg-blue-600 text-white border-blue-700' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200'
          }`}
        >
          {drawMode ? 'Drawing...' : 'Draw Boundary'}
        </button>
        <button
          onClick={clearFence}
          className="bg-white text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded text-sm font-semibold border border-gray-200 transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="absolute bottom-4 left-4 bg-white shadow-lg rounded-lg border border-gray-200 px-4 py-2 z-10">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-600">
            <strong>{filteredLeads.length}</strong> leads{geoFence ? ' in boundary' : ''}
          </span>
          <div className="flex items-center gap-2">
            {Object.entries(CLUSTER_COLORS).map(([status, color]) => (
              <span key={status} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs text-gray-500 capitalize">{status}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
