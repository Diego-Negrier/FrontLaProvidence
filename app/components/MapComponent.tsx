"use client";

import { useEffect, useRef } from 'react';
import type { Fournisseur } from '@/app/services';

// Import Leaflet types and dynamic loading
declare global {
  interface Window {
    L: any;
  }
}

interface MapComponentProps {
  fournisseurs: Fournisseur[];
}

export default function MapComponent({ fournisseurs }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Dynamically load Leaflet CSS and JS
    const loadLeaflet = async () => {
      if (typeof window === 'undefined') return;

      // Load Leaflet CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Load Leaflet JS
      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = () => {
          initMap();
        };
        document.body.appendChild(script);
      } else {
        initMap();
      }
    };

    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const L = window.L;

      // Initialize map centered on France
      const map = L.map(mapRef.current).setView([46.603354, 1.888334], 6);

      // Add tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 20
      }).addTo(map);

      // Custom icon for markers
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: #c9a961;
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="
              transform: rotate(45deg);
              font-size: 16px;
              color: white;
            ">🌾</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      // Add markers for each fournisseur
      fournisseurs.forEach((fournisseur) => {
        let lat, lng;

        if (fournisseur.latitude && fournisseur.longitude) {
          lat = fournisseur.latitude;
          lng = fournisseur.longitude;
        } else {
          // Random position in France for demo
          lat = 46.603354 + (Math.random() - 0.5) * 8;
          lng = 1.888334 + (Math.random() - 0.5) * 10;
        }

        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

        // Popup content
        const popupContent = `
          <div style="font-family: Arial, sans-serif; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #1e3a5f; font-size: 1.1rem;">
              ${fournisseur.nom}
            </h3>
            ${fournisseur.metier ? `
              <p style="margin: 4px 0; color: #666; font-size: 0.9rem;">
                <strong>Métier:</strong> ${fournisseur.metier}
              </p>
            ` : ''}
            ${fournisseur.ville ? `
              <p style="margin: 4px 0; color: #666; font-size: 0.9rem;">
                <strong>Ville:</strong> ${fournisseur.ville}
              </p>
            ` : ''}
            ${fournisseur.description ? `
              <p style="margin: 8px 0 0 0; color: #444; font-size: 0.85rem;">
                ${fournisseur.description}
              </p>
            ` : ''}
          </div>
        `;

        marker.bindPopup(popupContent);
      });

      mapInstanceRef.current = map;
    };

    loadLeaflet();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [fournisseurs]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}
