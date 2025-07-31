
import React from 'react';
import mapboxgl from 'mapbox-gl';

interface MarkerProps {
  map: mapboxgl.Map | null;
  coordinates: [number, number];
  className: string;
  htmlContent: string;
  popup?: {
    text: string;
    offset?: number;
  };
}

export const createCustomMarker = ({ map, coordinates, className, htmlContent, popup }: MarkerProps): mapboxgl.Marker | null => {
  if (!map) return null;
  
  const el = document.createElement('div');
  el.className = className;
  el.innerHTML = htmlContent;
  
  const marker = new mapboxgl.Marker(el)
    .setLngLat(coordinates)
    .addTo(map);
    
  if (popup) {
    const popupInstance = new mapboxgl.Popup({ offset: popup.offset || 25 })
      .setText(popup.text);
    marker.setPopup(popupInstance);
  }
  
  return marker;
};

interface PickupMarkerProps {
  map: mapboxgl.Map | null;
  pickupCoordinates: [number, number];
}

export const createPickupMarker = ({ map, pickupCoordinates }: PickupMarkerProps): mapboxgl.Marker | null => {
  return createCustomMarker({
    map,
    coordinates: pickupCoordinates,
    className: 'pickup-marker',
    htmlContent: '<div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"><span class="text-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg></span></div>'
  });
};

interface DestinationMarkerProps {
  map: mapboxgl.Map | null;
  destinationCoordinates: [number, number];
}

export const createDestinationMarker = ({ map, destinationCoordinates }: DestinationMarkerProps): mapboxgl.Marker | null => {
  return createCustomMarker({
    map,
    coordinates: destinationCoordinates,
    className: 'destination-marker',
    htmlContent: '<div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg"><span class="text-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/></svg></span></div>'
  });
};

interface PassengerMarkerProps {
  map: mapboxgl.Map | null;
  passenger: {
    id: string;
    coordinates: [number, number];
    name?: string;
  };
}

export const createPassengerMarker = ({ map, passenger }: PassengerMarkerProps): mapboxgl.Marker | null => {
  return createCustomMarker({
    map,
    coordinates: passenger.coordinates,
    className: 'passenger-marker',
    htmlContent: `<div class="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"><span class="text-white"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg></span></div>`,
    popup: passenger.name ? { text: passenger.name } : undefined
  });
};
