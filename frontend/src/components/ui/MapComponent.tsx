import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapComponentProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number };
  className?: string;
}

export default function MapComponent({ onLocationSelect, initialLocation, className = '' }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const geocoder = useRef<MapboxGeocoder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!token) {
      setError('Token Mapbox manquant. Veuillez configurer VITE_MAPBOX_TOKEN.');
      setIsLoading(false);
      return;
    }

    mapboxgl.accessToken = token;

    // Initialiser la carte
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialLocation ? [initialLocation.lng, initialLocation.lat] : [2.3522, 48.8566], // Brazzaville par défaut
      zoom: 13
    });

    // Ajouter les contrôles
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Créer le marqueur
    marker.current = new mapboxgl.Marker({
      draggable: true
    } as any);

    if (initialLocation) {
      marker.current.setLngLat([initialLocation.lng, initialLocation.lat]).addTo(map.current);
    }

    // Gérer le déplacement du marqueur
    (marker.current as any).on('dragend', () => {
      const lngLat = (marker.current as any)?.getLngLat();
      if (lngLat) {
        // Reverse geocoding pour obtenir l'adresse
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?access_token=${token}`)
          .then(response => response.json())
          .then(data => {
            const address = data.features[0]?.place_name || 'Adresse non trouvée';
            onLocationSelect({
              lat: lngLat.lat,
              lng: lngLat.lng,
              address
            });
          })
          .catch(() => {
            onLocationSelect({
              lat: lngLat.lat,
              lng: lngLat.lng,
              address: 'Adresse non trouvée'
            });
          });
      }
    });

    // Configurer le geocoder
    geocoder.current = new MapboxGeocoder({
      accessToken: token,
      mapboxgl: mapboxgl,
      placeholder: 'Entrez votre adresse de livraison...',
      countries: 'fr',
      language: 'fr',
      types: 'address'
    });

    map.current.addControl(geocoder.current);

    // Gérer la sélection d'adresse via le geocoder
    geocoder.current.on('result', (event) => {
      const { center, place_name } = event.result;
      if (marker.current) {
        marker.current.setLngLat(center).addTo(map.current);
      }
      onLocationSelect({
        lat: center[1],
        lng: center[0],
        address: place_name
      });
    });

    // Gérer les erreurs
    map.current.on('error', (e) => {
      setError('Erreur lors du chargement de la carte');
      console.error('Mapbox error:', e);
    });

    map.current.on('load', () => {
      setIsLoading(false);
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [initialLocation, onLocationSelect]);

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="text-red-800">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-10">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Chargement de la carte...</span>
          </div>
        </div>
      )}
      <div 
        ref={mapContainer} 
        className="w-full h-64 rounded-lg border border-gray-200 shadow-sm"
      />
      <div className="mt-2 text-sm text-gray-500">
        💡 Glissez le marqueur ou utilisez la barre de recherche pour définir votre adresse
      </div>
    </div>
  );
} 