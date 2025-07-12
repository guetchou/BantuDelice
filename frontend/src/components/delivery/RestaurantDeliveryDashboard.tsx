import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { DeliveryDriver, DeliverySettings } from '@/types/delivery';
import { useTableExistence } from '@/hooks/useTableExistence';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface RestaurantDeliveryDashboardProps {
  restaurantId: string;
}

const RestaurantDeliveryDashboard = ({ restaurantId }: RestaurantDeliveryDashboardProps) => {
  const [settings, setSettings] = useState<DeliverySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [minOrderValue, setMinOrderValue] = useState<number>(0);
  const [deliveryRadius, setDeliveryRadius] = useState<number>(10);
  const [deliveryFeeBase, setDeliveryFeeBase] = useState<number>(500);
  const [deliveryFeePerKm, setDeliveryFeePerKm] = useState<number>(100);
  const [deliveryFeeMin, setDeliveryFeeMin] = useState<number>(1000);
  const [autoAcceptOrders, setAutoAcceptOrders] = useState<boolean>(false);
  const [autoAssignDrivers, setAutoAssignDrivers] = useState<boolean>(false);
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState<number>(30);
  const [allowRestaurantDelivery, setAllowRestaurantDelivery] = useState<boolean>(true);
  const [allowExternalDelivery, setAllowExternalDelivery] = useState<boolean>(false);
  const [defaultDeliveryFee, setDefaultDeliveryFee] = useState<number>(1500);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState<number>(5000);
  const [maxDeliveryDistance, setMaxDeliveryDistance] = useState<number>(20);
  const [availableDrivers, setAvailableDrivers] = useState<DeliveryDriver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const { exists: deliverySettingsExists } = useTableExistence('delivery_settings');
  const { exists: deliveryDriversExists } = useTableExistence('delivery_drivers');
  const { toast } = useToast();
  
  useEffect(() => {
    fetchSettings();
    fetchAvailableDrivers();
  }, [restaurantId, deliverySettingsExists, deliveryDriversExists]);
  
  const fetchSettings = async () => {
    try {
      setLoading(true);
      
      if (!deliverySettingsExists) {
        return;
      }
      
      const { data, error } = await supabase
        .from('delivery_settings')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setSettings(data as DeliverySettings);
        setMinOrderValue(data.min_order_value);
        setDeliveryRadius(data.delivery_radius);
        setDeliveryFeeBase(data.delivery_fee_base);
        setDeliveryFeePerKm(data.delivery_fee_per_km);
        setDeliveryFeeMin(data.delivery_fee_min);
        setAutoAcceptOrders(data.auto_accept_orders || false);
        setAutoAssignDrivers(data.auto_assign_drivers || false);
        setEstimatedDeliveryTime(data.estimated_delivery_time || 30);
        setAllowRestaurantDelivery(data.allow_restaurant_delivery !== false);
        setAllowExternalDelivery(data.allow_external_delivery || false);
        setDefaultDeliveryFee(data.default_delivery_fee || 1500);
        setFreeDeliveryThreshold(data.free_delivery_threshold || 5000);
        setMaxDeliveryDistance(data.max_delivery_distance || 20);
      } else {
        // Initialize default settings
        setMinOrderValue(0);
        setDeliveryRadius(10);
        setDeliveryFeeBase(500);
        setDeliveryFeePerKm(100);
        setDeliveryFeeMin(1000);
        setAutoAcceptOrders(false);
        setAutoAssignDrivers(false);
        setEstimatedDeliveryTime(30);
        setAllowRestaurantDelivery(true);
        setAllowExternalDelivery(false);
        setDefaultDeliveryFee(1500);
        setFreeDeliveryThreshold(5000);
        setMaxDeliveryDistance(20);
      }
    } catch (error) {
      console.error('Error fetching delivery settings:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les paramètres de livraison',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAvailableDrivers = async () => {
    setLoadingDrivers(true);
    try {
      if (!deliveryDriversExists) {
        return;
      }
      
      // First try restaurant drivers
      const { data: restaurantDrivers, error } = await supabase
        .from('delivery_drivers')
        .select('*')
        .eq('is_available', true)
        .eq('status', 'available')
        .eq('is_external', false);
        
      if (error) throw error;
      
      // Then try external services
      const { data: externalDrivers } = await supabase
        .from('delivery_drivers')
        .select('*')
        .eq('is_available', true)
        .eq('status', 'available')
        .eq('is_external', true);
        
      setAvailableDrivers([...(restaurantDrivers || []), ...(externalDrivers || [])]);
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
  
  const saveSettings = async () => {
    try {
      setSaving(true);
      
      const settingsData = {
        restaurant_id: restaurantId,
        min_order_value: minOrderValue,
        delivery_radius: deliveryRadius,
        delivery_fee_base: deliveryFeeBase,
        delivery_fee_per_km: deliveryFeePerKm,
        delivery_fee_min: deliveryFeeMin,
        auto_accept_orders: autoAcceptOrders,
        auto_assign_drivers: autoAssignDrivers,
        estimated_delivery_time: estimatedDeliveryTime,
        allow_restaurant_delivery: allowRestaurantDelivery,
        allow_external_delivery: allowExternalDelivery,
        default_delivery_fee: defaultDeliveryFee,
        free_delivery_threshold: freeDeliveryThreshold,
        max_delivery_distance: maxDeliveryDistance,
      };
      
      if (settings) {
        // Update existing settings
        const { error } = await supabase
          .from('delivery_settings')
          .update(settingsData)
          .eq('id', settings.id);
          
        if (error) throw error;
        
        toast({
          title: 'Succès',
          description: 'Paramètres de livraison mis à jour',
        });
      } else {
        // Create new settings
        const { error } = await supabase
          .from('delivery_settings')
          .insert(settingsData);
          
        if (error) throw error;
        
        toast({
          title: 'Succès',
          description: 'Paramètres de livraison enregistrés',
        });
      }
      
      fetchSettings();
    } catch (error) {
      console.error('Error saving delivery settings:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'enregistrer les paramètres de livraison',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };
  
  const vehicleTypes = [
    { value: 'bike', label: 'Vélo' },
    { value: 'scooter', label: 'Scooter' },
    { value: 'car', label: 'Voiture' },
    { value: 'motorcycle', label: 'Moto' },
    { value: 'walk', label: 'À pied' },
  ];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Paramètres de livraison</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minOrderValue">Commande minimale (XAF)</Label>
                <Input
                  type="number"
                  id="minOrderValue"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="deliveryRadius">Rayon de livraison (km)</Label>
                <Input
                  type="number"
                  id="deliveryRadius"
                  value={deliveryRadius}
                  onChange={(e) => setDeliveryRadius(Number(e.target.value))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="deliveryFeeBase">Frais de base (XAF)</Label>
                <Input
                  type="number"
                  id="deliveryFeeBase"
                  value={deliveryFeeBase}
                  onChange={(e) => setDeliveryFeeBase(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="deliveryFeePerKm">Frais par km (XAF)</Label>
                <Input
                  type="number"
                  id="deliveryFeePerKm"
                  value={deliveryFeePerKm}
                  onChange={(e) => setDeliveryFeePerKm(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="deliveryFeeMin">Frais minimum (XAF)</Label>
                <Input
                  type="number"
                  id="deliveryFeeMin"
                  value={deliveryFeeMin}
                  onChange={(e) => setDeliveryFeeMin(Number(e.target.value))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="defaultDeliveryFee">Frais de livraison par défaut (XAF)</Label>
                <Input
                  type="number"
                  id="defaultDeliveryFee"
                  value={defaultDeliveryFee}
                  onChange={(e) => setDefaultDeliveryFee(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="freeDeliveryThreshold">Livraison gratuite à partir de (XAF)</Label>
                <Input
                  type="number"
                  id="freeDeliveryThreshold"
                  value={freeDeliveryThreshold}
                  onChange={(e) => setFreeDeliveryThreshold(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="maxDeliveryDistance">Distance de livraison maximale (km)</Label>
                <Input
                  type="number"
                  id="maxDeliveryDistance"
                  value={maxDeliveryDistance}
                  onChange={(e) => setMaxDeliveryDistance(Number(e.target.value))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="estimatedDeliveryTime">Temps de livraison estimé (minutes)</Label>
                <Input
                  type="number"
                  id="estimatedDeliveryTime"
                  value={estimatedDeliveryTime}
                  onChange={(e) => setEstimatedDeliveryTime(Number(e.target.value))}
                />
              </div>
              {availableDrivers.length > 0 && (
                <div>
                  <Label htmlFor="selectedDriver">Livreur par défaut</Label>
                  <Select onValueChange={setSelectedDriver}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Choisir un livreur" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDrivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label>Types de véhicules</Label>
                {availableDrivers.map((driver) => (
                  <div key={driver.id}>
                    {driver.name}:{' '}
                    {vehicleTypes.find((v) => v.value === driver.vehicle_type)?.label || 'Non spécifié'}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Label htmlFor="autoAcceptOrders">Accepter automatiquement les commandes</Label>
              <Switch
                id="autoAcceptOrders"
                checked={autoAcceptOrders}
                onCheckedChange={setAutoAcceptOrders}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Label htmlFor="autoAssignDrivers">Attribuer automatiquement les livreurs</Label>
              <Switch
                id="autoAssignDrivers"
                checked={autoAssignDrivers}
                onCheckedChange={setAutoAssignDrivers}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Label htmlFor="allowRestaurantDelivery">Autoriser la livraison par le restaurant</Label>
              <Switch
                id="allowRestaurantDelivery"
                checked={allowRestaurantDelivery}
                onCheckedChange={setAllowRestaurantDelivery}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Label htmlFor="allowExternalDelivery">Autoriser la livraison externe</Label>
              <Switch
                id="allowExternalDelivery"
                checked={allowExternalDelivery}
                onCheckedChange={setAllowExternalDelivery}
              />
            </div>
            
            <Button onClick={saveSettings} disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer les paramètres'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RestaurantDeliveryDashboard;
