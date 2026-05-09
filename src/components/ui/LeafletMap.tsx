'use client';

import { useEffect, useState } from 'react';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  name: string;
  producers: number;
  specialties: string[];
}

interface LeafletMapProps {
  markers: MapMarker[];
  onMarkerClick: (marker: MapMarker) => void;
  center?: [number, number];
  zoom?: number;
}

export default function LeafletMap({ markers, onMarkerClick, center = [14.5, -14.5], zoom = 7 }: LeafletMapProps) {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Dynamically import leaflet only on client side
    const loadMap = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      const container = document.getElementById('agrilien-map');
      if (!container || (container as any)._leaflet_id) return;

      const map = L.map(container).setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 18,
      }).addTo(map);

      // Custom green icon
      const greenIcon = L.divIcon({
        html: `<div style="width:32px;height:32px;background:#0B6B32;border-radius:50%;border:3px solid #fff;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:700;box-shadow:0 2px 8px rgba(0,0,0,0.3);">🌾</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        className: '',
      });

      markers.forEach(m => {
        const marker = L.marker([m.lat, m.lng], { icon: greenIcon }).addTo(map);
        marker.bindPopup(`
          <div style="text-align:center;min-width:150px;">
            <strong style="font-size:14px;">${m.name}</strong><br/>
            <span style="color:#666;font-size:12px;">${m.producers} producteurs</span><br/>
            <span style="font-size:11px;color:#0B6B32;">${m.specialties.join(', ')}</span>
          </div>
        `);
        marker.on('click', () => onMarkerClick(m));
      });

      setMapReady(true);
    };

    loadMap();
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div id="agrilien-map" style={{ width: '100%', height: '100%', borderRadius: 16, overflow: 'hidden' }} />
      {!mapReady && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', borderRadius: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🗺️</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Chargement de la carte...</p>
          </div>
        </div>
      )}
    </div>
  );
}
