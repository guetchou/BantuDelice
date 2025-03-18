
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { findOptimalDriver } from '@/utils/deliveryOptimization';
import { supabase } from '@/integrations/supabase/client';
import { DeliveryDriver } from '@/types/delivery';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, MapPin, Star, Info } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface DeliveryAssignmentProps {
  orderId: string;
  restaurantLocation: {
    latitude: number;
    longitude: number;
  };
  deliveryAddress: string;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
}

const DeliveryAssignment = ({ 
  orderId,
  restaurantLocation,
  deliveryAddress,
  deliveryLatitude,
  deliveryLongitude
}: DeliveryAssignmentProps) => {
  const [loading, setLoading] = useState(false);
  const [assigned, setAssigned] = useState(false);
  const [method, setMethod] = useState<'auto' | 'manual'>('auto');
  const [showDriverSelection, setShowDriverSelection] = useState(false);
  const [availableDrivers, setAvailableDrivers] = useState<DeliveryDriver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAssignment = async () => {
      const { data } = await supabase
        .from('delivery_tracking')
        .select('delivery_user_id')
        .eq('order_id', orderId)
        .single();

      setAssigned(!!data?.delivery_user_id);
    };

    checkAssignment();
  }, [orderId]);

  // Fetch available drivers when showing driver selection
  useEffect(() => {
    if (showDriverSelection) {
      fetchAvailableDrivers();
    }
  }, [showDriverSelection]);

  const fetchAvailableDrivers = async () => {
    setLoadingDrivers(true);
    try {
      // First try restaurant drivers
      const { data: restaurantDrivers, error } = await supabase
        .from('delivery_drivers')
        .select('*')
        .eq('is_available', true)
        .eq('status', 'available');

      if (error) throw error;

      // Then try external services
      const { data: externalDrivers } = await supabase
        .from('delivery_drivers')
        .select('*')
        .eq('is_available', true)
        .eq('status', 'available')
        .eq('is_external', true);

      // Combine and sort by distance
      let allDrivers = [...(restaurantDrivers || []), ...(externalDrivers || [])];
      
      // Calculate distance for each driver
      allDrivers = allDrivers.map(driver => {
        const distance = calculateDistance(
          driver.current_latitude,
          driver.current_longitude,
          restaurantLocation.latitude,
          restaurantLocation.longitude
        );
        return { ...driver, distance };
      }).sort((a, b) => (a.distance || 0) - (b.distance || 0));

      setAvailableDrivers(allDrivers);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les livreurs disponibles",
        variant: "destructive",
      });
    } finally {
      setLoadingDrivers(false);
    }
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1?: number, lon1?: number, lat2?: number, lon2?: number): number => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const toRad = (value: number): number => {
    return value * Math.PI / 180;
  };

  const handleAutomaticAssignment = async () => {
    setLoading(true);
    try {
      const optimalDriver = await findOptimalDriver({
        id: orderId,
        delivery_address: deliveryAddress,
        latitude: deliveryLatitude || restaurantLocation.latitude + 0.01,
        longitude: deliveryLongitude || restaurantLocation.longitude + 0.01,
        total_amount: 0
      });

      if (!optimalDriver) {
        throw new Error('Aucun livreur disponible');
      }

      // Créer l'enregistrement de suivi
      const { error } = await supabase
        .from('delivery_tracking')
        .insert({
          order_id: orderId,
          delivery_user_id: optimalDriver.id,
          status: 'assigned',
          latitude: optimalDriver.current_latitude,
          longitude: optimalDriver.current_longitude
        });

      if (error) throw error;

      // Mettre à jour le statut du livreur
      await supabase
        .from('delivery_drivers')
        .update({
          is_available: false,
          status: 'busy',
          current_order_id: orderId
        })
        .eq('id', optimalDriver.id);

      setAssigned(true);
      toast({
        title: "Livreur assigné",
        description: "Un livreur a été assigné à votre commande",
      });
    } catch (error) {
      console.error('Erreur lors de l\'assignation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'assigner un livreur pour le moment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualAssignment = async () => {
    if (!selectedDriver) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un livreur",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const selectedDriverData = availableDrivers.find(d => d.id === selectedDriver);
      
      if (!selectedDriverData) {
        throw new Error('Livreur introuvable');
      }

      // Créer l'enregistrement de suivi
      const { error } = await supabase
        .from('delivery_tracking')
        .insert({
          order_id: orderId,
          delivery_user_id: selectedDriver,
          status: 'assigned',
          latitude: selectedDriverData.current_latitude,
          longitude: selectedDriverData.current_longitude
        });

      if (error) throw error;

      // Mettre à jour le statut du livreur
      await supabase
        .from('delivery_drivers')
        .update({
          is_available: false,
          status: 'busy',
          current_order_id: orderId
        })
        .eq('id', selectedDriver);

      setAssigned(true);
      toast({
        title: "Livreur assigné",
        description: `Vous avez choisi ${selectedDriverData.name} comme livreur`,
      });
    } catch (error) {
      console.error('Erreur lors de l\'assignation manuelle:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'assigner le livreur sélectionné",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setShowDriverSelection(false);
    }
  };

  if (assigned) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-2 text-green-600 mb-4">
          <Check className="h-5 w-5" />
          <p className="font-medium">Un livreur a été assigné à votre commande</p>
        </div>
        
        <Progress value={25} className="h-2 mb-4" />
        
        <div className="text-sm text-gray-500">
          <p>Un livreur se dirige vers le restaurant pour récupérer votre commande.</p>
          <p className="mt-2">Vous recevrez des notifications à chaque étape de la livraison.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Mode de livraison</h2>
      
      <div className="space-y-4">
        <div className="flex space-x-2">
          <Button 
            variant={method === 'auto' ? 'default' : 'outline'} 
            onClick={() => setMethod('auto')}
            className="flex-1"
          >
            Attribution automatique
          </Button>
          <Button 
            variant={method === 'manual' ? 'default' : 'outline'} 
            onClick={() => setMethod('manual')}
            className="flex-1"
          >
            Choisir mon livreur
          </Button>
        </div>
        
        {method === 'auto' ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Notre système choisira le meilleur livreur disponible en fonction de la distance et des évaluations.
            </p>
            <Button
              className="w-full"
              onClick={handleAutomaticAssignment}
              disabled={loading}
            >
              {loading ? "Recherche en cours..." : "Rechercher un livreur"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Choisissez vous-même votre livreur parmi les personnes disponibles.
            </p>
            <Dialog open={showDriverSelection} onOpenChange={setShowDriverSelection}>
              <DialogTrigger asChild>
                <Button className="w-full">Voir les livreurs disponibles</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Choisir un livreur</DialogTitle>
                  <DialogDescription>
                    Sélectionnez le livreur qui vous convient le mieux
                  </DialogDescription>
                </DialogHeader>
                
                {loadingDrivers ? (
                  <div className="py-6 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : availableDrivers.length === 0 ? (
                  <div className="py-6 text-center">
                    <p className="text-gray-500">Aucun livreur disponible pour le moment</p>
                    <Button variant="outline" className="mt-4" onClick={() => setShowDriverSelection(false)}>
                      Fermer
                    </Button>
                  </div>
                ) : (
                  <>
                    <ScrollArea className="max-h-[300px] pr-4">
                      <div className="space-y-4">
                        {availableDrivers.map((driver) => (
                          <div 
                            key={driver.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedDriver === driver.id 
                                ? 'border-primary bg-primary/10' 
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedDriver(driver.id)}
                          >
                            <div className="flex items-start space-x-3">
                              <Avatar className="h-12 w-12">
                                {driver.profile_picture ? (
                                  <img src={driver.profile_picture} alt={driver.name} />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                                    {driver.name.charAt(0)}
                                  </div>
                                )}
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <h3 className="font-medium">{driver.name}</h3>
                                  <Badge variant={driver.is_external ? "outline" : "default"}>
                                    {driver.is_external ? "Externe" : "Restaurant"}
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center space-x-1 text-yellow-500 mt-1">
                                  <Star className="h-4 w-4 fill-current" />
                                  <span className="text-sm">{driver.average_rating.toFixed(1)}</span>
                                  <span className="text-xs text-gray-500">({driver.total_deliveries} livraisons)</span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>{driver.distance?.toFixed(1)} km</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Info className="h-3 w-3" />
                                    <span>~{Math.round((driver.distance || 0) * 5) + 10} min</span>
                                  </div>
                                </div>
                                
                                {driver.is_external && (
                                  <Badge variant="outline" className="mt-2">
                                    Frais: {((driver.distance || 0) * 200 + 1000).toFixed(0)} XAF
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" onClick={() => setShowDriverSelection(false)}>
                        Annuler
                      </Button>
                      <Button 
                        onClick={handleManualAssignment}
                        disabled={!selectedDriver || loading}
                      >
                        {loading ? "Assignation..." : "Choisir ce livreur"}
                      </Button>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DeliveryAssignment;
