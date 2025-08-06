
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '@/services/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix: Missing Leaflet's default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

interface DeliveryDriver {
  user_id: string;
  name: string;
  phone: string;
  current_location: number[];
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

const DeliveryDriverTracking = () => {
  const { driverId } = useParams<{ driverId: string }>();
  const [driver, setDriver] = useState<DeliveryDriver | null>(null);
  const [position, setPosition] = useState<[number, number]>([48.8566, 2.3522]); // Default to Paris coordinates
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    const fetchDriverData = async () => {
      if (!driverId) return;
      
      try {
        const { data, error } = await supabase
          .from('delivery_drivers')
          .select('*')
          .eq('user_id', driverId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setDriver({
            ...data,
            updated_at: data.updated_at || data.created_at || new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error fetching driver data:', error);
      }
    };
    
    fetchDriverData();

    // Set up real-time listener
    const channel = apiService.channel('delivery_driver_location');

    channel
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'delivery_drivers',
        filter: `user_id=eq.${driverId}`
      },
      (payload) => {
        console.log('Change received!', payload);
        const updatedDriver = payload.new as DeliveryDriver;
        setDriver(updatedDriver);
        if (updatedDriver.current_location) {
          setPosition([updatedDriver.current_location[0], updatedDriver.current_location[1]]);
        }
      })
      .subscribe();

    return () => {
      apiService.removeChannel(channel);
    };
  }, [driverId]);

  // Update position when driver data changes
  useEffect(() => {
    if (driver && driver.current_location) {
      setPosition([driver.current_location[0], driver.current_location[1]]);
    }
  }, [driver]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Clean up existing map if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    
    // Create new map
    mapInstanceRef.current = L.map(mapRef.current).setView(position, 13);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstanceRef.current);
    
    // Add marker
    markerRef.current = L.marker(position).addTo(mapInstanceRef.current)
      .bindPopup(driver?.name ? `${driver.name} est ici.` : 'Position du livreur');
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);
  
  // Update marker when position changes
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLatLng(position);
      mapInstanceRef.current.setView(position, 13);
      
      markerRef.current.bindPopup(driver?.name ? `${driver.name} est ici.` : 'Position du livreur');
    }
  }, [position, driver]);

  if (!driver) {
    return <div>Chargement des informations du livreur...</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Suivi du livreur</h1>
      <div className="mb-4">
        <p>Nom: {driver.name}</p>
        <p>Téléphone: {driver.phone}</p>
        <p>Disponibilité: {driver.is_available ? 'Oui' : 'Non'}</p>
        <p>Dernière mise à jour: {new Date(driver.updated_at).toLocaleTimeString()}</p>
      </div>
      <div style={{ height: '500px', width: '100%' }} className="rounded-lg overflow-hidden">
        <div ref={mapRef} style={{ height: '100%', width: '100%' }}></div>
      </div>
    </div>
  );
};

export default DeliveryDriverTracking;
