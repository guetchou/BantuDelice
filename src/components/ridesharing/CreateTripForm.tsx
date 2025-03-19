
import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MapPin, Calendar as CalendarIcon, Clock, Car, CreditCard, Users } from "lucide-react";
import { RidesharingTrip, RidesharingPreferences } from '@/types/ridesharing';

interface CreateTripFormProps {
  onCreateTrip: (tripData: Omit<RidesharingTrip, 'id' | 'driver_id' | 'status' | 'created_at'>) => void;
  isLoading?: boolean;
}

const CreateTripForm: React.FC<CreateTripFormProps> = ({ onCreateTrip, isLoading = false }) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
  const [departureTime, setDepartureTime] = useState("08:00");
  const [availableSeats, setAvailableSeats] = useState(3);
  const [pricePerSeat, setPricePerSeat] = useState(15000);
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  
  const [preferences, setPreferences] = useState<RidesharingPreferences>({
    smoking_allowed: false,
    pets_allowed: false,
    music_allowed: true,
    air_conditioning: true,
    luggage_allowed: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!departureDate) {
      alert("Veuillez sélectionner une date de départ");
      return;
    }
    
    // Simulation des coordonnées (dans une application réelle, nous utiliserions un service de géocodage)
    const originCoords = { lat: 4.2634, lng: 15.2429 }; // Brazzaville
    const destCoords = { lat: 4.7889, lng: 11.8653 }; // Pointe-Noire
    
    // Estimer l'heure d'arrivée (dans une application réelle, nous utiliserions une API de calcul d'itinéraire)
    const estimatedHours = 6; // 6 heures de trajet estimées
    const [hours, minutes] = departureTime.split(':').map(Number);
    const arrivalHours = (hours + estimatedHours) % 24;
    const estimatedArrivalTime = `${String(arrivalHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    
    // Formater la date
    const formattedDate = format(departureDate, 'yyyy-MM-dd');
    
    const tripData: Omit<RidesharingTrip, 'id' | 'driver_id' | 'status' | 'created_at'> = {
      origin_address: origin,
      origin_latitude: originCoords.lat,
      origin_longitude: originCoords.lng,
      destination_address: destination,
      destination_latitude: destCoords.lat,
      destination_longitude: destCoords.lng,
      departure_date: formattedDate,
      departure_time: departureTime,
      estimated_arrival_time: estimatedArrivalTime,
      available_seats: availableSeats,
      price_per_seat: pricePerSeat,
      vehicle_model: vehicleModel,
      vehicle_color: vehicleColor,
      license_plate: licensePlate,
      preferences,
      updated_at: new Date().toISOString()
    };
    
    onCreateTrip(tripData);
  };

  const handlePreferenceChange = (key: keyof RidesharingPreferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proposer un trajet</CardTitle>
        <CardDescription>
          Partagez votre trajet et réduisez vos frais de déplacement
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Départ & Destination */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Lieu de départ</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input 
                    id="origin"
                    className="pl-10"
                    placeholder="Adresse de départ précise" 
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input 
                    id="destination"
                    className="pl-10"
                    placeholder="Adresse d'arrivée précise" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="departure-date">Date de départ</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="departure-date"
                      variant="outline"
                      className="w-full pl-3 text-left font-normal justify-start"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {departureDate ? format(departureDate, "EEEE d MMMM yyyy", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={departureDate}
                      onSelect={setDepartureDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="departure-time">Heure de départ</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input 
                    id="departure-time"
                    className="pl-10"
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Vehicle & Price */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle-model">Modèle de voiture</Label>
                <div className="relative">
                  <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input 
                    id="vehicle-model"
                    className="pl-10"
                    placeholder="Ex: Toyota Corolla" 
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle-color">Couleur</Label>
                  <Input 
                    id="vehicle-color"
                    placeholder="Ex: Bleu" 
                    value={vehicleColor}
                    onChange={(e) => setVehicleColor(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="license-plate">Plaque d'immatriculation</Label>
                  <Input 
                    id="license-plate"
                    placeholder="Ex: XY-123-ZA" 
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Prix par passager (FCFA)</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input 
                      id="price"
                      className="pl-10"
                      type="number"
                      min="1000"
                      step="500"
                      value={pricePerSeat}
                      onChange={(e) => setPricePerSeat(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="seats">Places disponibles</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input 
                      id="seats"
                      className="pl-10"
                      type="number"
                      min="1"
                      max="7"
                      value={availableSeats}
                      onChange={(e) => setAvailableSeats(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Préférences</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={!preferences.smoking_allowed} 
                      onCheckedChange={(checked) => handlePreferenceChange('smoking_allowed', !checked)}
                      id="preference-smoking"
                    />
                    <Label htmlFor="preference-smoking">Non-fumeur</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={preferences.air_conditioning} 
                      onCheckedChange={(checked) => handlePreferenceChange('air_conditioning', checked)}
                      id="preference-ac"
                    />
                    <Label htmlFor="preference-ac">Climatisé</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={preferences.music_allowed} 
                      onCheckedChange={(checked) => handlePreferenceChange('music_allowed', checked)}
                      id="preference-music"
                    />
                    <Label htmlFor="preference-music">Musique</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={preferences.pets_allowed} 
                      onCheckedChange={(checked) => handlePreferenceChange('pets_allowed', checked)}
                      id="preference-pets"
                    />
                    <Label htmlFor="preference-pets">Animaux autorisés</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={preferences.luggage_allowed} 
                      onCheckedChange={(checked) => handlePreferenceChange('luggage_allowed', checked)}
                      id="preference-luggage"
                    />
                    <Label htmlFor="preference-luggage">Bagages autorisés</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Informations supplémentaires</Label>
            <Textarea 
              id="notes"
              placeholder="Précisions sur le lieu de rendez-vous, bagages autorisés, etc."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              rows={3}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            Publier le trajet
            {isLoading && <span className="ml-2 animate-spin">⏳</span>}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateTripForm;
