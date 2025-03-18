
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { DeliverySettings, ExternalDeliveryService } from '@/types/delivery';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckboxGroup, CheckboxItem } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

interface RestaurantDeliverySettingsProps {
  restaurantId: string;
}

const DeliverySettingsComponent = ({ restaurantId }: RestaurantDeliverySettingsProps) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<DeliverySettings | null>(null);
  const [externalServices, setExternalServices] = useState<ExternalDeliveryService[]>([]);
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        
        // Fetch delivery settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('delivery_settings')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .maybeSingle();
        
        if (settingsError && settingsError.code !== 'PGRST116') {
          throw settingsError;
        }
        
        // Fetch external delivery services
        const { data: servicesData, error: servicesError } = await supabase
          .from('external_delivery_services')
          .select('*')
          .eq('is_active', true);
        
        if (servicesError) {
          throw servicesError;
        }
        
        setExternalServices(servicesData as ExternalDeliveryService[]);
        
        if (settingsData) {
          setSettings(settingsData as DeliverySettings);
        } else {
          // Create default settings if none exist
          const defaultSettings: DeliverySettings = {
            restaurant_id: restaurantId,
            allow_restaurant_delivery: true,
            allow_external_delivery: true,
            default_delivery_fee: 1000,
            free_delivery_threshold: 15000,
            max_delivery_distance: 10,
            estimated_delivery_time: 30,
            accepted_external_services: [],
            delivery_hours: [
              { day: 'monday', open: '09:00', close: '21:00' },
              { day: 'tuesday', open: '09:00', close: '21:00' },
              { day: 'wednesday', open: '09:00', close: '21:00' },
              { day: 'thursday', open: '09:00', close: '21:00' },
              { day: 'friday', open: '09:00', close: '22:00' },
              { day: 'saturday', open: '10:00', close: '22:00' },
              { day: 'sunday', open: '10:00', close: '21:00' },
            ],
            auto_accept_orders: false,
            auto_assign_drivers: false
          };
          
          setSettings(defaultSettings);
          
          // Save default settings to database
          const { error } = await supabase
            .from('delivery_settings')
            .insert(defaultSettings);
          
          if (error) {
            console.error('Error creating default delivery settings:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching delivery settings:', error);
        toast.error('Erreur lors du chargement des paramètres de livraison');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [restaurantId]);
  
  const handleSaveSettings = async () => {
    if (!settings) return;
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('delivery_settings')
        .upsert({
          ...settings,
          restaurant_id: restaurantId
        });
      
      if (error) throw error;
      
      toast.success('Paramètres de livraison enregistrés avec succès');
    } catch (error) {
      console.error('Error saving delivery settings:', error);
      toast.error('Erreur lors de l\'enregistrement des paramètres');
    } finally {
      setSaving(false);
    }
  };
  
  const handleToggleServiceAcceptance = (serviceId: string) => {
    if (!settings) return;
    
    const updatedServices = [...(settings.accepted_external_services || [])];
    
    if (updatedServices.includes(serviceId)) {
      setSettings({
        ...settings,
        accepted_external_services: updatedServices.filter(id => id !== serviceId)
      });
    } else {
      setSettings({
        ...settings,
        accepted_external_services: [...updatedServices, serviceId]
      });
    }
  };
  
  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      </Card>
    );
  }
  
  if (!settings) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-red-500">Erreur lors du chargement des paramètres</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </Button>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Paramètres de livraison</h2>
      
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Options de livraison</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="restaurant-delivery">Livraison par le restaurant</Label>
              <p className="text-sm text-gray-500">
                Permettre à vos propres livreurs de livrer les commandes
              </p>
            </div>
            <Switch
              id="restaurant-delivery"
              checked={settings.allow_restaurant_delivery}
              onCheckedChange={(checked) => 
                setSettings({...settings, allow_restaurant_delivery: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="external-delivery">Livraison par service externe</Label>
              <p className="text-sm text-gray-500">
                Permettre à des services de livraison externes de livrer les commandes
              </p>
            </div>
            <Switch
              id="external-delivery"
              checked={settings.allow_external_delivery}
              onCheckedChange={(checked) => 
                setSettings({...settings, allow_external_delivery: checked})}
            />
          </div>
          
          <Separator className="my-4" />
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="delivery-fee">Frais de livraison (XAF)</Label>
              <Input
                id="delivery-fee"
                type="number"
                min="0"
                value={settings.default_delivery_fee}
                onChange={(e) => 
                  setSettings({...settings, default_delivery_fee: parseInt(e.target.value) || 0})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="free-threshold">
                Seuil de livraison gratuite (XAF)
                {settings.free_delivery_threshold === 0 && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    Désactivé
                  </Badge>
                )}
              </Label>
              <Input
                id="free-threshold"
                type="number"
                min="0"
                value={settings.free_delivery_threshold || ''}
                onChange={(e) => 
                  setSettings({...settings, free_delivery_threshold: parseInt(e.target.value) || 0})}
                placeholder="Jamais gratuit"
              />
              <p className="text-xs text-gray-500">
                Mettre à 0 pour désactiver la livraison gratuite
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="max-distance">Distance maximale de livraison: {settings.max_delivery_distance} km</Label>
            </div>
            <Slider
              id="max-distance"
              min={1}
              max={30}
              step={1}
              value={[settings.max_delivery_distance]}
              onValueChange={(value) => 
                setSettings({...settings, max_delivery_distance: value[0]})}
            />
            <p className="text-xs text-gray-500">
              La distance maximale à laquelle vous êtes prêt à livrer
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="delivery-time">Temps de livraison estimé: {settings.estimated_delivery_time} minutes</Label>
            <Slider
              id="delivery-time"
              min={10}
              max={90}
              step={5}
              value={[settings.estimated_delivery_time]}
              onValueChange={(value) => 
                setSettings({...settings, estimated_delivery_time: value[0]})}
            />
          </div>
        </div>
        
        {settings.allow_external_delivery && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Services de livraison externes</h3>
            
            {externalServices.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                Aucun service de livraison externe disponible actuellement
              </p>
            ) : (
              <CheckboxGroup>
                {externalServices.map(service => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <CheckboxItem
                      id={`service-${service.id}`}
                      checked={settings.accepted_external_services?.includes(service.id)}
                      onCheckedChange={() => handleToggleServiceAcceptance(service.id)}
                    />
                    <Label htmlFor={`service-${service.id}`} className="cursor-pointer">
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-gray-500">
                        Frais de base: {service.base_fee.toLocaleString()} XAF
                        {service.fee_per_km && ` + ${service.fee_per_km} XAF/km`}
                      </div>
                    </Label>
                  </div>
                ))}
              </CheckboxGroup>
            )}
          </div>
        )}
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Automatisation</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-accept">Acceptation automatique des commandes</Label>
              <p className="text-sm text-gray-500">
                Accepter automatiquement les commandes entrantes
              </p>
            </div>
            <Switch
              id="auto-accept"
              checked={settings.auto_accept_orders}
              onCheckedChange={(checked) => 
                setSettings({...settings, auto_accept_orders: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-assign">Assignation automatique des livreurs</Label>
              <p className="text-sm text-gray-500">
                Assigner automatiquement un livreur disponible aux commandes
              </p>
            </div>
            <Switch
              id="auto-assign"
              checked={settings.auto_assign_drivers}
              onCheckedChange={(checked) => 
                setSettings({...settings, auto_assign_drivers: checked})}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-8">
        <Button 
          onClick={handleSaveSettings}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : 'Enregistrer les paramètres'}
        </Button>
      </div>
    </Card>
  );
};

export default DeliverySettingsComponent;
