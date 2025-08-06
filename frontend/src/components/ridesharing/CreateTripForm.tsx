
import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecurrencePattern } from '@/types/ridesharing';
import RecurringTripsForm from './RecurringTripsForm';

interface CreateTripFormProps {
  onCreateTrip: (tripData: unknown) => Promise<void>;
  isLoading: boolean;
}

const CreateTripForm: React.FC<CreateTripFormProps> = ({
  onCreateTrip,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState<string>('single');
  
  // Form state for single trip
  const [formState, setFormState] = useState({
    origin_address: '',
    origin_latitude: 0,
    origin_longitude: 0,
    destination_address: '',
    destination_latitude: 0,
    destination_longitude: 0,
    departure_date: format(new Date(), 'yyyy-MM-dd'),
    departure_time: '08:00',
    available_seats: 3,
    price_per_seat: 1500,
    vehicle_model: '',
    vehicle_color: '',
    license_plate: '',
    preferences: {
      smoking_allowed: false,
      pets_allowed: false,
      music_allowed: true,
      air_conditioning: true,
      luggage_allowed: true,
      max_luggage_size: 'medium',
      chatty_driver: true
    }
  });

  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle single trip form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Handle number inputs
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  // Handle checkbox changes for preferences
  const handleCheckboxChange = (name: string, checked: boolean) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormState((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: checked
        }
      }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: checked }));
    }
  };

  // Validate form for single trip
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formState.origin_address) {
      newErrors.origin_address = 'Le point de départ est requis';
    }
    
    if (!formState.destination_address) {
      newErrors.destination_address = 'La destination est requise';
    }
    
    if (!formState.departure_date) {
      newErrors.departure_date = 'La date de départ est requise';
    }
    
    if (!formState.departure_time) {
      newErrors.departure_time = "L'heure de départ est requise";
    }
    
    if (formState.available_seats < 1) {
      newErrors.available_seats = 'Au moins 1 place disponible est requise';
    }
    
    if (formState.price_per_seat < 0) {
      newErrors.price_per_seat = 'Le prix doit être positif';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission for single trip
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const tripData = {
        ...formState,
        is_recurring: false
      };
      await onCreateTrip(tripData);
    } catch (error) {
      console.error('Error creating trip:', error);
    }
  };

  // Handle single trip address search 
  const handleAddressSearch = (type: 'origin' | 'destination', address: string) => {
    // Simulate geocoding with random coordinates (for demo purposes)
    const randomOffset = () => (Math.random() - 0.5) * 0.1;
    const baseLatitude = 4.3947; // Brazzaville
    const baseLongitude = 15.0557;
    
    if (type === 'origin') {
      setFormState((prev) => ({
        ...prev,
        origin_address: address,
        origin_latitude: baseLatitude + randomOffset(),
        origin_longitude: baseLongitude + randomOffset()
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        destination_address: address,
        destination_latitude: baseLatitude + randomOffset(),
        destination_longitude: baseLongitude + randomOffset()
      }));
    }
  };

  // Handle recurring trip creation
  const handleCreateRecurringTrip = async (tripData: unknown) => {
    try {
      await onCreateTrip({
        ...tripData,
        is_recurring: true
      });
    } catch (error) {
      console.error('Error creating recurring trip:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6 w-full">
          <TabsTrigger value="single">Trajet unique</TabsTrigger>
          <TabsTrigger value="recurring">Trajet régulier</TabsTrigger>
        </TabsList>
        
        <TabsContent value="single">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="origin_address">Point de départ</Label>
                <Input
                  id="origin_address"
                  name="origin_address"
                  value={formState.origin_address}
                  onChange={handleInputChange}
                  onBlur={(e) => handleAddressSearch('origin', e.target.value)}
                  placeholder="Ex: 123 Avenue de l'Indépendance, Brazzaville"
                  className={errors.origin_address ? "border-red-500" : ""}
                />
                {errors.origin_address && <p className="text-red-500 text-sm">{errors.origin_address}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination_address">Destination</Label>
                <Input
                  id="destination_address"
                  name="destination_address"
                  value={formState.destination_address}
                  onChange={handleInputChange}
                  onBlur={(e) => handleAddressSearch('destination', e.target.value)}
                  placeholder="Ex: Université Marien Ngouabi, Brazzaville"
                  className={errors.destination_address ? "border-red-500" : ""}
                />
                {errors.destination_address && <p className="text-red-500 text-sm">{errors.destination_address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departure_date">Date de départ</Label>
                  <Input
                    id="departure_date"
                    name="departure_date"
                    type="date"
                    value={formState.departure_date}
                    onChange={handleInputChange}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className={errors.departure_date ? "border-red-500" : ""}
                  />
                  {errors.departure_date && <p className="text-red-500 text-sm">{errors.departure_date}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departure_time">Heure de départ</Label>
                  <Input
                    id="departure_time"
                    name="departure_time"
                    type="time"
                    value={formState.departure_time}
                    onChange={handleInputChange}
                    className={errors.departure_time ? "border-red-500" : ""}
                  />
                  {errors.departure_time && <p className="text-red-500 text-sm">{errors.departure_time}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="available_seats">Places disponibles</Label>
                  <Input
                    id="available_seats"
                    name="available_seats"
                    type="number"
                    min="1"
                    max="8"
                    value={formState.available_seats}
                    onChange={handleNumberChange}
                    className={errors.available_seats ? "border-red-500" : ""}
                  />
                  {errors.available_seats && <p className="text-red-500 text-sm">{errors.available_seats}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_per_seat">Prix par place (FCFA)</Label>
                  <Input
                    id="price_per_seat"
                    name="price_per_seat"
                    type="number"
                    min="0"
                    step="100"
                    value={formState.price_per_seat}
                    onChange={handleNumberChange}
                    className={errors.price_per_seat ? "border-red-500" : ""}
                  />
                  {errors.price_per_seat && <p className="text-red-500 text-sm">{errors.price_per_seat}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle_model">Modèle du véhicule</Label>
                  <Input
                    id="vehicle_model"
                    name="vehicle_model"
                    placeholder="Ex: Toyota Corolla"
                    value={formState.vehicle_model}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicle_color">Couleur</Label>
                  <Input
                    id="vehicle_color"
                    name="vehicle_color"
                    placeholder="Ex: Blanc"
                    value={formState.vehicle_color}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="license_plate">Plaque d'immatriculation</Label>
                  <Input
                    id="license_plate"
                    name="license_plate"
                    placeholder="Ex: 123-ABC"
                    value={formState.license_plate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Préférences</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="preferences.smoking_allowed"
                      checked={formState.preferences.smoking_allowed}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("preferences.smoking_allowed", !!checked)
                      }
                    />
                    <Label htmlFor="preferences.smoking_allowed">Fumeur autorisé</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="preferences.pets_allowed"
                      checked={formState.preferences.pets_allowed}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("preferences.pets_allowed", !!checked)
                      }
                    />
                    <Label htmlFor="preferences.pets_allowed">Animaux autorisés</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="preferences.music_allowed"
                      checked={formState.preferences.music_allowed}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("preferences.music_allowed", !!checked)
                      }
                    />
                    <Label htmlFor="preferences.music_allowed">Musique autorisée</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="preferences.air_conditioning"
                      checked={formState.preferences.air_conditioning}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("preferences.air_conditioning", !!checked)
                      }
                    />
                    <Label htmlFor="preferences.air_conditioning">Climatisation</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="preferences.luggage_allowed"
                      checked={formState.preferences.luggage_allowed}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("preferences.luggage_allowed", !!checked)
                      }
                    />
                    <Label htmlFor="preferences.luggage_allowed">Bagages autorisés</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="preferences.chatty_driver"
                      checked={formState.preferences.chatty_driver}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("preferences.chatty_driver", !!checked)
                      }
                    />
                    <Label htmlFor="preferences.chatty_driver">Conducteur bavard</Label>
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Traitement...
                </>
              ) : (
                'Proposer le trajet'
              )}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="recurring">
          <RecurringTripsForm 
            onCreateRecurringTrip={handleCreateRecurringTrip}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateTripForm;
