
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DeliveryDriver, DeliveryLocation, DeliveryRequest } from '@/types/delivery';
import { calculateDistance } from '@/utils/distance';
import { toast } from '@/hooks/use-toast';
import { Clock, MapPin, Phone, Truck, User } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useMap, MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Define custom icons
const createCustomIcon = (iconUrl: string) => {
  return L.icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

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
        name: 'Jean Dupont',
        phone: '+33123456789',
        vehicle_type: 'scooter',
        vehicle_model: 'Vespa 125',
        license_plate: 'AB123CD',
        photo_url: 'https://randomuser.me/api/portraits/men/1.jpg',
        rating: 4.8,
        is_available: true,
        current_latitude: 48.8566,
        current_longitude: 2.3522,
        last_active: new Date().toISOString(),
        total_deliveries: 142,
        status: 'available',
        verified: true
      },
      {
        id: 'd2',
        name: 'Marie Martin',
        phone: '+33623456789',
        vehicle_type: 'bike',
        vehicle_model: 'VTT Decathlon',
        license_plate: 'N/A',
        photo_url: 'https://randomuser.me/api/portraits/women/2.jpg',
        rating: 4.6,
        is_available: true,
        current_latitude: 48.8606,
        current_longitude: 2.3376,
        last_active: new Date().toISOString(),
        total_deliveries: 89,
        status: 'available',
        verified: true
      },
      {
        id: 'd3',
        name: 'Pierre Dubois',
        phone: '+33723456789',
        vehicle_type: 'car',
        vehicle_model: 'Renault Clio',
        license_plate: 'XY789ZW',
        photo_url: 'https://randomuser.me/api/portraits/men/3.jpg',
        rating: 4.9,
        is_available: true,
        current_latitude: 48.8474,
        current_longitude: 2.3591,
        last_active: new Date().toISOString(),
        total_deliveries: 207,
        status: 'available',
        verified: true
      }
    ];
    
    const mockRequests: DeliveryRequest[] = [
      {
        id: 'req1',
        order_id: 'order123',
        pickup_address: '12 Rue du Commerce, Paris',
        delivery_address: '45 Avenue Victor Hugo, Paris',
        status: 'pending',
        created_at: new Date().toISOString(),
        customer_name: 'Sophie Bernard',
        customer_phone: '+33612345678',
        notes: 'Sonner à l\'interphone 42B'
      }
    ];
    
    setDrivers(mockDrivers);
    setRequests(mockRequests);
  }, []);

  // Calculate distance between driver and order location
  const calculateDriverDistance = (driver: DeliveryDriver) => {
    if (!orderLocation) return 999; // Return large value if no location
    
    return calculateDistance(
      [driver.current_latitude, driver.current_longitude],
      [orderLocation.latitude, orderLocation.longitude],
      'km',
      true
    );
  };

  // Sort drivers by distance
  const sortedDrivers = [...drivers].sort((a, b) => 
    calculateDriverDistance(a) - calculateDriverDistance(b)
  );

  // Handle driver assignment
  const handleAssignDriver = async () => {
    if (!selectedDriver) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner un livreur",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      const selectedDriverData = drivers.find(d => d.id === selectedDriver);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Livreur assigné",
        description: `${selectedDriverData?.name} a été assigné à cette livraison.`,
      });
      
      if (onAssign) {
        onAssign(selectedDriver);
      }
    } catch (error) {
      console.error('Error assigning driver:', error);
      toast({
        title: "Erreur d'assignation",
        description: "Impossible d'assigner le livreur sélectionné",
        variant: "destructive"
      });
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
    if (mapMarkers.length === 0) return [48.8566, 2.3522]; // Default to Paris
    
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
            {mapMarkers.map((marker, index) => {
              let icon;
              
              switch (marker.type) {
                case 'driver':
                  icon = createCustomIcon('/assets/driver-marker.png');
                  break;
                case 'pickup':
                  icon = createCustomIcon('/assets/restaurant-marker.png');
                  break;
                case 'dropoff':
                  icon = createCustomIcon('/assets/customer-marker.png');
                  break;
                default:
                  icon = createCustomIcon('/assets/default-marker.png');
              }
              
              return (
                <Marker 
                  key={`marker-${index}`}
                  position={[marker.latitude, marker.longitude]}
                  icon={icon}
                >
                  <Popup>
                    <div>
                      <strong>{marker.name || marker.type}</strong>
                      {marker.address && <p>{marker.address}</p>}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
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
