import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { DeliverySettings as DeliverySettingsType } from '@/types/delivery';

// Helper pour créer la structure de business hours correcte
const createDefaultBusinessHours = () => ({
  monday: { open: "08:00", close: "22:00", is_closed: false },
  tuesday: { open: "08:00", close: "22:00", is_closed: false },
  wednesday: { open: "08:00", close: "22:00", is_closed: false },
  thursday: { open: "08:00", close: "22:00", is_closed: false },
  friday: { open: "08:00", close: "22:00", is_closed: false },
  saturday: { open: "08:00", close: "22:00", is_closed: false },
  sunday: { open: "08:00", close: "22:00", is_closed: false }
});

// Convertir le format précédent si nécessaire
const convertHoursFormat = (hours: unknown) => {
  if (Array.isArray(hours)) {
    const businessHours = createDefaultBusinessHours();
    
    hours.forEach(day => {
      const dayKey = day.day.toLowerCase();
      if (businessHours[dayKey as keyof typeof businessHours]) {
        businessHours[dayKey as keyof typeof businessHours].open = day.open;
        businessHours[dayKey as keyof typeof businessHours].close = day.close;
      }
    });
    
    return businessHours;
  }
  
  return hours || createDefaultBusinessHours();
};

interface DeliverySettingsProps {
  restaurantId: string;
}

export const DeliverySettings: React.FC<DeliverySettingsProps> = ({ restaurantId }) => {
  const [settings, setSettings] = useState<DeliverySettingsType>({
    id: '',
    restaurant_id: restaurantId,
    allow_restaurant_delivery: true,
    allow_external_delivery: false,
    default_delivery_fee: 500,
    free_delivery_threshold: 5000,
    max_delivery_distance: 5,
    delivery_hours: createDefaultBusinessHours(),
    min_order_value: 1000,
    delivery_radius: 5,
    delivery_fee_base: 300,
    delivery_fee_per_km: 100
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        // Fetch delivery settings from API
        // const response = await api.getDeliverySettings(restaurantId);
        
        // Simulate API response for now
        setTimeout(() => {
          const mockSettings = {
            id: 'delivery-settings-1',
            restaurant_id: restaurantId,
            allow_restaurant_delivery: true,
            allow_external_delivery: false,
            default_delivery_fee: 500, // in cents
            free_delivery_threshold: 5000, // in cents
            max_delivery_distance: 5, // in km
            delivery_hours: {
              monday: { open: "09:00", close: "21:00", is_closed: false },
              tuesday: { open: "09:00", close: "21:00", is_closed: false },
              wednesday: { open: "09:00", close: "21:00", is_closed: false },
              thursday: { open: "09:00", close: "21:00", is_closed: false },
              friday: { open: "09:00", close: "22:00", is_closed: false },
              saturday: { open: "10:00", close: "22:00", is_closed: false },
              sunday: { open: "10:00", close: "20:00", is_closed: false }
            },
            min_order_value: 1500,
            delivery_radius: 5,
            delivery_fee_base: 300,
            delivery_fee_per_km: 100
          };
          
          setSettings(mockSettings);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching delivery settings:', error);
        toast({
          title: 'Erreur',
          description: "Impossible de charger les paramètres de livraison",
          variant: 'destructive'
        });
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchSettings();
    }
  }, [restaurantId, toast]);

  const handleChange = (field: keyof DeliverySettingsType, value: unknown) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHoursChange = (day: string, field: 'open' | 'close', value: string) => {
    if (!settings.delivery_hours) return;
    
    setSettings(prev => ({
      ...prev,
      delivery_hours: {
        ...prev.delivery_hours,
        [day]: {
          ...prev.delivery_hours?.[day as keyof typeof prev.delivery_hours],
          [field]: value
        }
      }
    }));
  };

  const handleDayToggle = (day: string, isClosed: boolean) => {
    if (!settings.delivery_hours) return;
    
    setSettings(prev => ({
      ...prev,
      delivery_hours: {
        ...prev.delivery_hours,
        [day]: {
          ...prev.delivery_hours?.[day as keyof typeof prev.delivery_hours],
          is_closed: isClosed
        }
      }
    }));
  };
  
  // Assurer que delivery_hours a le bon format
  const saveSettings = () => {
    setSaving(true);
    
    const formattedSettings = {
      ...settings,
      delivery_hours: convertHoursFormat(settings.delivery_hours)
    };
    
    // Simulate API call
    setTimeout(() => {
      // In a real app: await api.updateDeliverySettings(restaurantId, formattedSettings);
      toast({
        title: 'Paramètres sauvegardés',
        description: "Les paramètres de livraison ont été mis à jour avec succès",
      });
      setSaving(false);
    }, 1000);
  };
  
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de livraison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Activer la livraison</h3>
              <p className="text-sm text-gray-500">Permettre aux clients de commander en livraison</p>
            </div>
            <Switch 
              checked={settings.allow_restaurant_delivery}
              onCheckedChange={(checked) => handleChange('allow_restaurant_delivery', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Livraison externe</h3>
              <p className="text-sm text-gray-500">Utiliser des services de livraison tiers</p>
            </div>
            <Switch 
              checked={settings.allow_external_delivery}
              onCheckedChange={(checked) => handleChange('allow_external_delivery', checked)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="delivery_fee">Frais de livraison (XAF)</Label>
            <Input 
              id="delivery_fee"
              type="number"
              value={settings.default_delivery_fee / 100}
              onChange={(e) => handleChange('default_delivery_fee', parseInt(e.target.value) * 100)}
            />
            <p className="text-xs text-gray-500">Frais de livraison standard</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="free_delivery_threshold">Seuil de livraison gratuite (XAF)</Label>
            <Input 
              id="free_delivery_threshold"
              type="number"
              value={settings.free_delivery_threshold / 100}
              onChange={(e) => handleChange('free_delivery_threshold', parseInt(e.target.value) * 100)}
            />
            <p className="text-xs text-gray-500">Montant minimum pour la livraison gratuite</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="min_order_value">Commande minimum (XAF)</Label>
            <Input 
              id="min_order_value"
              type="number"
              value={settings.min_order_value / 100}
              onChange={(e) => handleChange('min_order_value', parseInt(e.target.value) * 100)}
            />
            <p className="text-xs text-gray-500">Montant minimum pour passer une commande</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="max_delivery_distance">Distance maximale (km)</Label>
            <Input 
              id="max_delivery_distance"
              type="number"
              value={settings.max_delivery_distance}
              onChange={(e) => handleChange('max_delivery_distance', parseInt(e.target.value))}
            />
            <p className="text-xs text-gray-500">Distance maximale de livraison</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Tarification avancée</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="delivery_fee_base">Frais de base (XAF)</Label>
              <Input 
                id="delivery_fee_base"
                type="number"
                value={settings.delivery_fee_base / 100}
                onChange={(e) => handleChange('delivery_fee_base', parseInt(e.target.value) * 100)}
              />
              <p className="text-xs text-gray-500">Frais fixes pour chaque livraison</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="delivery_fee_per_km">Frais par km (XAF)</Label>
              <Input 
                id="delivery_fee_per_km"
                type="number"
                value={settings.delivery_fee_per_km / 100}
                onChange={(e) => handleChange('delivery_fee_per_km', parseInt(e.target.value) * 100)}
              />
              <p className="text-xs text-gray-500">Frais additionnels par kilomètre</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Horaires de livraison</h3>
          
          {settings.delivery_hours && Object.entries(settings.delivery_hours).map(([day, hours]) => (
            <div key={day} className="flex items-center space-x-4">
              <div className="w-24">
                <p className="font-medium capitalize">{day}</p>
              </div>
              
              <Switch 
                checked={!hours.is_closed}
                onCheckedChange={(checked) => handleDayToggle(day, !checked)}
              />
              
              {!hours.is_closed ? (
                <div className="flex items-center space-x-2">
                  <Input 
                    type="time"
                    className="w-32"
                    value={hours.open}
                    onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                  />
                  <span>à</span>
                  <Input 
                    type="time"
                    className="w-32"
                    value={hours.close}
                    onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                  />
                </div>
              ) : (
                <p className="text-gray-500">Fermé</p>
              )}
            </div>
          ))}
        </div>
        
        <Button 
          onClick={saveSettings} 
          disabled={saving}
          className="w-full md:w-auto"
        >
          {saving ? 'Enregistrement...' : 'Enregistrer les paramètres'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DeliverySettings;
