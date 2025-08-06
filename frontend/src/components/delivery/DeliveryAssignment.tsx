
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DeliveryDriver, DeliveryLocation, DeliveryRequest } from '@/types/delivery';
import { Clock, MapPin, Phone, Truck, User } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix the Leaflet icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Create custom icons
const driverIcon = L.icon({
  iconUrl: '/assets/driver-marker.png', 
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const restaurantIcon = L.icon({
  iconUrl: '/assets/restaurant-marker.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const customerIcon = L.icon({
  iconUrl: '/assets/customer-marker.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

interface DeliveryAssignmentProps {
  orderLocation?: {
    latitude: number;
    longitude: number;
  };
  deliveryLocation?: {
    latitude: number;
    longitude: number;
  };
  onAssign?: (driverId: string) => void;
}

const DeliveryAssignment: React.FC<DeliveryAssignmentProps> = ({
  orderLocation,
  deliveryLocation,
  onAssign
}) => {
  const [drivers, setDrivers] = useState<DeliveryDriver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<DeliveryRequest[]>([]);
  
  // Mock data for development
  useEffect(() => {
    // In a real app, this would be an API call
    const mockDrivers: DeliveryDriver[] = [
      {
        id: 'd1',
        user_id: 'user1',
        name: 'Jean Dupont',
        phone: '+242123456789',
        current_latitude: 48.8566,
        current_longitude: 2.3522,
        is_available: true,
        vehicle_type: 'scooter',
        vehicle_model: 'Vespa 125',
        license_plate: 'AB123CD',
        photo_url: 'https://randomuser.me/api/portraits/men/1.jpg',
        rating: 4.8,
        status: 'available',
        verified: true,
        total_deliveries: 142,
        last_active: new Date().toISOString()
      },
      {
        id: 'd2',
        user_id: 'user2',
        name: 'Marie Martin',
        phone: '+242623456789',
        current_latitude: 48.8606,
        current_longitude: 2.3376,
        is_available: true,
        vehicle_type: 'bike',
        vehicle_model: 'VTT Decathlon',
        license_plate: 'N/A',
        photo_url: 'https://randomuser.me/api/portraits/women/2.jpg',
        rating: 4.6,
        status: 'available',
        verified: true,
        total_deliveries: 89,
        last_active: new Date().toISOString()
      },
      {
        id: 'd3',
        user_id: 'user3',
        name: 'Pierre Dubois',
        phone: '+242723456789',
        current_latitude: 48.8474,
        current_longitude: 2.3591,
        is_available: true,
        vehicle_type: 'car',
        vehicle_model: 'Renault Clio',
        license_plate: 'XY789ZW',
        photo_url: 'https://randomuser.me/api/portraits/men/3.jpg',
        rating: 4.9,
        status: 'available',
        verified: true,
        total_deliveries: 207,
        last_active: new Date().toISOString()
      }
    ];
    
    const mockRequests: DeliveryRequest[] = [
      {
        id: 'req1',
        order_id: 'order123',
        pickup_address: '12 Rue du Commerce, Brazzaville',
        delivery_address: '45 Avenue Victor Hugo, Brazzaville',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        customer_name: 'Sophie Bernard',
        customer_phone: '+242612345678',
        notes: 'Sonner à l\'interphone 42B'
      }
    ];
    
    setDrivers(mockDrivers);
    setRequests(mockRequests);
  }, []);

  // Calculate distance between driver and order location
  const calculateDriverDistance = (driver: DeliveryDriver) => {
    if (!orderLocation) return 999; // Return large value if no location
    
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(orderLocation.latitude - driver.current_latitude);
    const dLon = deg2rad(orderLocation.longitude - driver.current_longitude);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(driver.current_latitude)) * Math.cos(deg2rad(orderLocation.latitude)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    
    return parseFloat(distance.toFixed(2));
  };

  // Helper function to convert degrees to radians
  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };

  // Sort drivers by distance
  const sortedDrivers = [...drivers].sort((a, b) => 
    calculateDriverDistance(a) - calculateDriverDistance(b)
  );

  // Handle driver assignment
  const handleAssignDriver = async () => {
    if (!selectedDriver) {
      alert("Please select a driver");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      const selectedDriverData = drivers.find(d => d.id === selectedDriver);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`${selectedDriverData?.name} has been assigned to this delivery.`);
      
      if (onAssign) {
        onAssign(selectedDriver);
      }
    } catch (error) {
      console.error('Error assigning driver:', error);
      alert("Failed to assign driver");
    } finally {
      setIsLoading(false);
    }
  };

  // Create map markers for drivers and locations
  const mapMarkers: DeliveryLocation[] = [
    ...drivers.map(driver => ({
      latitude: driver.current_latitude,
      longitude: driver.current_longitude,
      name: driver.name,
      type: 'driver' as const
    }))
  ];
  
  if (orderLocation) {
    mapMarkers.push({
      latitude: orderLocation.latitude,
      longitude: orderLocation.longitude,
      name: 'Restaurant',
      type: 'pickup' as const
    });
  }
  
  if (deliveryLocation) {
    mapMarkers.push({
      latitude: deliveryLocation.latitude,
      longitude: deliveryLocation.longitude,
      name: 'Client',
      type: 'dropoff' as const
    });
  }
  
  // Calculate map center
  const calculateMapCenter = (): [number, number] => {
    if (mapMarkers.length === 0) return [48.8566, 2.3522]; // Default to Brazzaville
    
    const latitudes = mapMarkers.map(m => m.latitude);
    const longitudes = mapMarkers.map(m => m.longitude);
    
    const centerLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
    const centerLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;
    
    return [centerLat, centerLng];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Assigner un livreur</CardTitle>
        <CardDescription>
          Sélectionnez un livreur disponible pour cette commande
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Map showing driver locations */}
        <div className="h-64 w-full mb-4 rounded-md overflow-hidden">
          <MapContainer 
            center={calculateMapCenter()} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {orderLocation && (
              <Marker 
                position={[orderLocation.latitude, orderLocation.longitude]}
                icon={restaurantIcon}
              >
                <Popup>
                  <div>
                    <strong>Restaurant</strong>
                  </div>
                </Popup>
              </Marker>
            )}
            {deliveryLocation && (
              <Marker 
                position={[deliveryLocation.latitude, deliveryLocation.longitude]}
                icon={customerIcon}
              >
                <Popup>
                  <div>
                    <strong>Client</strong>
                  </div>
                </Popup>
              </Marker>
            )}
            {drivers.map((driver, index) => (
              <Marker 
                key={`driver-${index}`}
                position={[driver.current_latitude, driver.current_longitude]}
                icon={driverIcon}
              >
                <Popup>
                  <div>
                    <strong>{driver.name}</strong>
                    <p>{driver.vehicle_type} - {driver.vehicle_model}</p>
                    <p>Distance: {calculateDriverDistance(driver)} km</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        
        {/* Order details */}
        {requests.length > 0 && (
          <Alert>
            <MapPin className="h-4 w-4" />
            <AlertTitle>Détails de la commande</AlertTitle>
            <AlertDescription>
              <div className="grid grid-cols-1 gap-2 mt-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>Client: {requests[0].customer_name}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>Téléphone: {requests[0].customer_phone}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Notes: {requests[0].notes || 'Aucune'}</span>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <Separator />
        
        {/* Driver selection */}
        <div>
          <h3 className="text-sm font-medium mb-2">Livreurs disponibles</h3>
          <Select onValueChange={setSelectedDriver} value={selectedDriver}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un livreur" />
            </SelectTrigger>
            <SelectContent>
              {sortedDrivers.map(driver => {
                const distance = calculateDriverDistance(driver);
                return (
                  <SelectItem key={driver.id} value={driver.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{driver.name}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{driver.vehicle_type}</Badge>
                        <Badge variant="secondary">{distance} km</Badge>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        
        {/* Selected driver details */}
        {selectedDriver && (
          <div className="bg-muted/50 p-3 rounded-md">
            {drivers.filter(d => d.id === selectedDriver).map(driver => (
              <div key={driver.id} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <img 
                    src={driver.photo_url} 
                    alt={driver.name} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{driver.name}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Truck className="mr-1 h-3 w-3" />
                    <span>{driver.vehicle_type} • {driver.vehicle_model}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>⭐ {driver.rating} • {driver.total_deliveries} livraisons</span>
                  </div>
                </div>
                <div className="text-sm">
                  <Badge>{calculateDriverDistance(driver)} km</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleAssignDriver} 
          disabled={!selectedDriver || isLoading}
        >
          {isLoading ? "Assignation..." : "Assigner le livreur"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeliveryAssignment;
