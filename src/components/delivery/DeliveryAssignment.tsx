import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormEvent } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { DeliveryDriver, DeliveryRequest } from '@/types/delivery';
import { calculateDistance } from '@/utils/distance';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet's default marker icon
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface DeliveryAssignmentProps {
  restaurantId: string;
}

const DeliveryAssignment = ({ restaurantId }: DeliveryAssignmentProps) => {
  const { id: deliveryId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [deliveryRequest, setDeliveryRequest] = useState<DeliveryRequest | null>(null);
  const [availableDrivers, setAvailableDrivers] = useState<DeliveryDriver[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [restaurantLocation, setRestaurantLocation] = useState<[number, number]>([48.8566, 2.3522]); // Default to Paris coordinates
  const [defaultLocation, setDefaultLocation] = useState<[number, number]>([48.8566, 2.3522]); // Default to Paris coordinates

  useEffect(() => {
    const fetchDeliveryRequest = async () => {
      if (!deliveryId) return;

      try {
        const { data: deliveryData, error: deliveryError } = await supabase
          .from('delivery_requests')
          .select('*')
          .eq('id', deliveryId)
          .single();

        if (deliveryError) throw deliveryError;

        setDeliveryRequest(deliveryData);
      } catch (error) {
        console.error('Error fetching delivery request:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la demande de livraison",
          variant: "destructive",
        });
      }
    };

    const fetchAvailableDrivers = async () => {
      try {
        const { data: driversData, error: driversError } = await supabase
          .from('delivery_drivers')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .eq('is_available', true);

        if (driversError) throw driversError;

        setAvailableDrivers(driversData || []);
      } catch (error) {
        console.error('Error fetching available drivers:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les livreurs disponibles",
          variant: "destructive",
        });
      }
    };

    const fetchRestaurantLocation = async () => {
      try {
        const { data: restaurantData, error: restaurantError } = await supabase
          .from('restaurants')
          .select('latitude, longitude')
          .eq('id', restaurantId)
          .single();

        if (restaurantError) throw restaurantError;

        if (restaurantData && restaurantData.latitude && restaurantData.longitude) {
          setRestaurantLocation([restaurantData.latitude, restaurantData.longitude]);
          setDefaultLocation([restaurantData.latitude, restaurantData.longitude]);
        }
      } catch (error) {
        console.error('Error fetching restaurant location:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la position du restaurant",
          variant: "destructive",
        });
      }
    };

    fetchDeliveryRequest();
    fetchAvailableDrivers();
    fetchRestaurantLocation();
    setLoading(false);
  }, [deliveryId, restaurantId, toast]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!selectedDriverId || !deliveryRequest) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un livreur",
        variant: "destructive",
      });
      return;
    }

    setFormLoading(true);

    try {
      // Update delivery_requests table
      const { error: updateDeliveryError } = await supabase
        .from('delivery_requests')
        .update({
          driver_id: selectedDriverId,
          status: 'assigned',
        })
        .eq('id', deliveryId);

      if (updateDeliveryError) throw updateDeliveryError;

      // Update delivery_drivers table
      const { error: updateDriverError } = await supabase
        .from('delivery_drivers')
        .update({
          is_available: false,
        })
        .eq('user_id', selectedDriverId);

      if (updateDriverError) throw updateDriverError;

      toast({
        title: "Succès",
        description: "Livreur assigné avec succès",
      });

      navigate(`/restaurants/${restaurantId}/deliveries`);
    } catch (error) {
      console.error('Error assigning driver:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'assigner le livreur",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const calculateDriverDistance = (driver: DeliveryDriver) => {
    if (!deliveryRequest || !driver.current_latitude || !driver.current_longitude) return 'N/A';

    const distance = calculateDistance(
      [driver.current_latitude, driver.current_longitude],
      [deliveryRequest.delivery_latitude || defaultLocation[0], deliveryRequest.delivery_longitude || defaultLocation[1]],
      'km',
      true
    );

    return `${distance} km`;
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (!deliveryRequest) {
    return <p>Demande de livraison non trouvée.</p>;
  }

  return (
    <div className="container mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Assigner un livreur</CardTitle>
          <CardDescription>Assignez un livreur disponible à cette commande.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="deliveryAddress">Adresse de livraison</Label>
              <Input
                type="text"
                id="deliveryAddress"
                value={deliveryRequest.delivery_address}
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="customerName">Nom du client</Label>
              <Input
                type="text"
                id="customerName"
                value={deliveryRequest.customer_name}
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="customerPhone">Téléphone du client</Label>
              <Input
                type="text"
                id="customerPhone"
                value={deliveryRequest.customer_phone}
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={deliveryRequest.notes || ''}
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="driver">Livreur</Label>
              <Select onValueChange={value => setSelectedDriverId(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sélectionner un livreur" />
                </SelectTrigger>
                <SelectContent>
                  {availableDrivers.map(driver => (
                    <SelectItem key={driver.user_id} value={driver.user_id}>
                      {driver.name} ({calculateDriverDistance(driver)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={formLoading} className="w-full">
              {formLoading ? 'Assignation...' : 'Assigner'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Carte de livraison</CardTitle>
          <CardDescription>Visualisation de la position du restaurant et de la livraison.</CardDescription>
        </CardHeader>
        <CardContent>
          <DeliveryMap
            restaurantLocation={restaurantLocation}
            deliveryLocation={[deliveryRequest.delivery_latitude || defaultLocation[0], deliveryRequest.delivery_longitude || defaultLocation[1]]}
            drivers={availableDrivers}
          />
        </CardContent>
      </Card>
    </div>
  );
};

interface DeliveryMapProps {
  restaurantLocation: [number, number];
  deliveryLocation: [number, number];
  drivers: DeliveryDriver[];
}

const DeliveryMap = ({ restaurantLocation, deliveryLocation, drivers }: DeliveryMapProps) => {
  const mapRef = React.useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(restaurantLocation, 13);
      return;
    }

    const map = L.map('delivery-map').setView(restaurantLocation, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [restaurantLocation]);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Clear existing markers
    map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add restaurant marker
    L.marker(restaurantLocation, { icon: DefaultIcon }).addTo(map).bindPopup("Restaurant");

    // Add delivery location marker
    L.marker(deliveryLocation, { icon: DefaultIcon }).addTo(map).bindPopup("Delivery Location");

    // Add driver markers
    drivers.forEach(driver => {
      if (driver.current_latitude && driver.current_longitude) {
        L.marker([driver.current_latitude, driver.current_longitude], { icon: DefaultIcon })
          .addTo(map)
          .bindPopup(driver.name);
      }
    });
  }, [restaurantLocation, deliveryLocation, drivers]);

  return (
    <div id="delivery-map" style={{ height: '400px', width: '100%' }}></div>
  );
};

export default DeliveryAssignment;
