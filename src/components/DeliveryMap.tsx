
import { useEffect, useRef } from 'react';

interface DeliveryMapProps {
  latitude: number;
  longitude: number;
  orderId?: string;
}

const DeliveryMap = ({ latitude, longitude, orderId }: DeliveryMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Mock map initialization - in a real app, would use Leaflet/Google Maps here
    if (mapContainer.current) {
      console.log(`Initializing map at coordinates: ${latitude}, ${longitude}`);
      console.log(`Order ID: ${orderId || 'No order ID provided'}`);
      
      // Simulate map loading
      const loadMap = () => {
        if (mapContainer.current) {
          mapContainer.current.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background-color: #e9ecef;">
              <div style="text-align: center;">
                <div>Map Preview</div>
                <div>Latitude: ${latitude.toFixed(4)}</div>
                <div>Longitude: ${longitude.toFixed(4)}</div>
                ${orderId ? `<div>Order: ${orderId}</div>` : ''}
              </div>
            </div>
          `;
        }
      };
      
      loadMap();
    }
    
    return () => {
      // Cleanup
      if (mapContainer.current) {
        mapContainer.current.innerHTML = '';
      }
    };
  }, [latitude, longitude, orderId]);

  return (
    <div 
      ref={mapContainer} 
      style={{ width: '100%', height: '100%' }}
      className="rounded-lg overflow-hidden"
    />
  );
};

export default DeliveryMap;
