
import React, { useState } from 'react';
import { format, addDays, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Clock, MapPin, Users, Car, Settings, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";
import { RecurrencePattern } from '@/types/ridesharing';

interface RecurringTripsFormProps {
  onCreateRecurringTrip: (tripData: unknown) => Promise<void>;
  isLoading: boolean;
  initialFormState?: unknown;
  isEditing?: boolean;
}

const RecurringTripsForm: React.FC<RecurringTripsFormProps> = ({
  onCreateRecurringTrip,
  isLoading,
  initialFormState,
  isEditing = false
}) => {
  // Form state with recurring trip fields
  const [formState, setFormState] = useState(initialFormState || {
    origin_address: '',
    origin_latitude: 0,
    origin_longitude: 0,
    destination_address: '',
    destination_latitude: 0,
    destination_longitude: 0,
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
    },
    is_recurring: true,
    recurrence_pattern: {
      frequency: 'weekdays',
      days_of_week: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      start_date: format(new Date(), 'yyyy-MM-dd'),
      end_date: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
      auto_accept_riders: true
    }
  });

  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Calendar state
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Handle number inputs
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  // Handle preferences changes
  const handlePreferenceChange = (preference: keyof RecurrencePattern['days_of_week'], checked: boolean) => {
    setFormState((prev) => ({
      ...prev,
      recurrence_pattern: {
        ...prev.recurrence_pattern,
        days_of_week: checked 
          ? [...(prev.recurrence_pattern.days_of_week || []), preference]
          : (prev.recurrence_pattern.days_of_week || []).filter(day => day !== preference)
      }
    }));
  };

  // Handle checkbox changes
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

  // Handle frequency change
  const handleFrequencyChange = (value: RecurrencePattern['frequency']) => {
    let daysOfWeek: RecurrencePattern['days_of_week'] = [];
    
    // Set default days based on frequency
    if (value === 'daily') {
      daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    } else if (value === 'weekdays') {
      daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    } else if (value === 'weekly') {
      const today = new Date().getDay();
      const dayMap = {
        0: 'sunday',
        1: 'monday',
        2: 'tuesday',
        3: 'wednesday',
        4: 'thursday',
        5: 'friday',
        6: 'saturday'
      };
      daysOfWeek = [dayMap[today as keyof typeof dayMap]];
    }
    
    setFormState((prev) => ({
      ...prev,
      recurrence_pattern: {
        ...prev.recurrence_pattern,
        frequency: value,
        days_of_week: daysOfWeek
      }
    }));
  };

  // Handle date changes
  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormState((prev) => ({
        ...prev,
        recurrence_pattern: {
          ...prev.recurrence_pattern,
          [name]: format(date, 'yyyy-MM-dd')
        }
      }));
    }
  };

  // Validate the form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formState.origin_address) {
      newErrors.origin_address = 'Le point de départ est requis';
    }
    
    if (!formState.destination_address) {
      newErrors.destination_address = 'La destination est requise';
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
    
    if (!formState.recurrence_pattern.days_of_week || 
        formState.recurrence_pattern.days_of_week.length === 0) {
      newErrors.days_of_week = 'Sélectionnez au moins un jour de la semaine';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await onCreateRecurringTrip(formState);
    } catch (error) {
      console.error('Error creating recurring trip:', error);
    }
  };

  // Placeholder for address search (in real app would connect to Maps API)
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Recurring trip indicator */}
      <div className="bg-primary/10 rounded-md p-4 flex items-center gap-3 text-primary">
        <Repeat className="h-5 w-5" />
        <div>
          <h3 className="font-medium">Trajet régulier</h3>
          <p className="text-sm">Définissez un horaire récurrent pour vos trajets quotidiens</p>
        </div>
      </div>

      {/* Journey details section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Détails du trajet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="origin_address">Point de départ</Label>
            <div className="flex gap-2">
              <Input
                id="origin_address"
                name="origin_address"
                value={formState.origin_address}
                onChange={handleInputChange}
                onBlur={(e) => handleAddressSearch('origin', e.target.value)}
                placeholder="Ex: 123 Avenue de l'Indépendance, Brazzaville"
                className={cn(errors.origin_address && "border-red-500")}
              />
            </div>
            {errors.origin_address && (
              <p className="text-red-500 text-sm">{errors.origin_address}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination_address">Destination</Label>
            <div className="flex gap-2">
              <Input
                id="destination_address"
                name="destination_address"
                value={formState.destination_address}
                onChange={handleInputChange}
                onBlur={(e) => handleAddressSearch('destination', e.target.value)}
                placeholder="Ex: Université Marien Ngouabi, Brazzaville"
                className={cn(errors.destination_address && "border-red-500")}
              />
            </div>
            {errors.destination_address && (
              <p className="text-red-500 text-sm">{errors.destination_address}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="departure_time">Heure de départ</Label>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-gray-500" />
              <Input
                id="departure_time"
                name="departure_time"
                type="time"
                value={formState.departure_time}
                onChange={handleInputChange}
                className={cn("w-full", errors.departure_time && "border-red-500")}
              />
            </div>
            {errors.departure_time && (
              <p className="text-red-500 text-sm">{errors.departure_time}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="available_seats">Places disponibles</Label>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-gray-500" />
                <Input
                  id="available_seats"
                  name="available_seats"
                  type="number"
                  min="1"
                  max="8"
                  value={formState.available_seats}
                  onChange={handleNumberChange}
                  className={cn(errors.available_seats && "border-red-500")}
                />
              </div>
              {errors.available_seats && (
                <p className="text-red-500 text-sm">{errors.available_seats}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_per_seat">Prix par place (FCFA)</Label>
              <div className="flex items-center">
                <Input
                  id="price_per_seat"
                  name="price_per_seat"
                  type="number"
                  min="0"
                  step="100"
                  value={formState.price_per_seat}
                  onChange={handleNumberChange}
                  className={cn(errors.price_per_seat && "border-red-500")}
                />
              </div>
              {errors.price_per_seat && (
                <p className="text-red-500 text-sm">{errors.price_per_seat}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle_model">Modèle du véhicule</Label>
              <div className="flex items-center">
                <Car className="mr-2 h-4 w-4 text-gray-500" />
                <Input
                  id="vehicle_model"
                  name="vehicle_model"
                  placeholder="Ex: Toyota Corolla"
                  value={formState.vehicle_model}
                  onChange={handleInputChange}
                />
              </div>
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
        </CardContent>
      </Card>

      {/* Recurrence pattern section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Repeat className="h-5 w-5 mr-2" />
            Fréquence du trajet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Répétition</Label>
            <RadioGroup 
              value={formState.recurrence_pattern.frequency}
              onValueChange={(value) => handleFrequencyChange(value as RecurrencePattern['frequency'])}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily">Tous les jours</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="weekdays" id="weekdays" />
                <Label htmlFor="weekdays">Jours ouvrables (Lun-Ven)</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly">Hebdomadaire</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom">Personnalisé</Label>
              </div>
            </RadioGroup>
          </div>

          {(formState.recurrence_pattern.frequency === 'custom' || formState.recurrence_pattern.frequency === 'weekly') && (
            <div className="space-y-3">
              <Label>Jours de la semaine</Label>
              <div className="grid grid-cols-7 gap-2">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                  const dayLabel = {
                    monday: 'Lun',
                    tuesday: 'Mar',
                    wednesday: 'Mer',
                    thursday: 'Jeu',
                    friday: 'Ven',
                    saturday: 'Sam',
                    sunday: 'Dim'
                  };
                  const isChecked = formState.recurrence_pattern.days_of_week?.includes(day);
                  
                  return (
                    <div 
                      key={day}
                      className={cn(
                        "flex flex-col items-center justify-center rounded-md p-2 cursor-pointer border",
                        isChecked 
                          ? "bg-primary text-primary-foreground border-primary" 
                          : "hover:bg-gray-50"
                      )}
                      onClick={() => handlePreferenceChange(day as any, !isChecked)}
                    >
                      <span>{dayLabel[day as keyof typeof dayLabel]}</span>
                      <Checkbox 
                        checked={isChecked}
                        className="mt-1"
                        onCheckedChange={(checked) => 
                          handlePreferenceChange(day as any, checked as boolean)
                        }
                      />
                    </div>
                  );
                })}
              </div>
              {errors.days_of_week && (
                <p className="text-red-500 text-sm">{errors.days_of_week}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Date de début</Label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      errors.start_date && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formState.recurrence_pattern.start_date ? (
                      format(
                        parse(formState.recurrence_pattern.start_date, 'yyyy-MM-dd', new Date()),
                        'EEEE d MMMM yyyy',
                        { locale: fr }
                      )
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      formState.recurrence_pattern.start_date ? 
                        parse(formState.recurrence_pattern.start_date, 'yyyy-MM-dd', new Date()) : 
                        undefined
                    }
                    onSelect={(date) => {
                      handleDateChange('start_date', date);
                      setStartDateOpen(false);
                    }}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Date de fin (optionnel)</Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formState.recurrence_pattern.end_date ? (
                      format(
                        parse(formState.recurrence_pattern.end_date, 'yyyy-MM-dd', new Date()),
                        'EEEE d MMMM yyyy',
                        { locale: fr }
                      )
                    ) : (
                      <span>Sans date de fin</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      formState.recurrence_pattern.end_date ? 
                        parse(formState.recurrence_pattern.end_date, 'yyyy-MM-dd', new Date()) : 
                        undefined
                    }
                    onSelect={(date) => {
                      handleDateChange('end_date', date);
                      setEndDateOpen(false);
                    }}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="auto_accept_riders"
                checked={formState.recurrence_pattern.auto_accept_riders}
                onCheckedChange={(checked) => {
                  setFormState((prev) => ({
                    ...prev,
                    recurrence_pattern: {
                      ...prev.recurrence_pattern,
                      auto_accept_riders: !!checked
                    }
                  }));
                }}
              />
              <Label htmlFor="auto_accept_riders">
                Accepter automatiquement les demandes des passagers
              </Label>
            </div>
            <p className="text-sm text-gray-500">
              Si activé, les passagers seront automatiquement acceptés sans confirmation de votre part.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Journey preferences section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Préférences du trajet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
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
        </CardContent>
      </Card>

      <CardFooter className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Traitement...
            </>
          ) : isEditing ? (
            'Mettre à jour le trajet régulier'
          ) : (
            'Créer un trajet régulier'
          )}
        </Button>
      </CardFooter>
    </form>
  );
};

export default RecurringTripsForm;
