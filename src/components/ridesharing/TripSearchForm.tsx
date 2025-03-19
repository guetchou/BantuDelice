
import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MapPin, Calendar as CalendarIcon, Search, Users, CreditCard } from "lucide-react";
import { RidesharingSearchFilters } from '@/types/ridesharing';

interface TripSearchFormProps {
  onSearch: (filters: RidesharingSearchFilters) => void;
  isLoading?: boolean;
}

const TripSearchForm: React.FC<TripSearchFormProps> = ({ onSearch, isLoading = false }) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [passengers, setPassengers] = useState(1);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [preferences, setPreferences] = useState({
    nonSmoking: false,
    petsAllowed: false,
    musicAllowed: false,
    airConditioning: false,
    luggageAllowed: false
  });

  const handleSearch = () => {
    // Convertir les préférences au format attendu
    const preferenceFilters = showAdvanced ? {
      smoking_allowed: !preferences.nonSmoking,
      pets_allowed: preferences.petsAllowed,
      music_allowed: preferences.musicAllowed,
      air_conditioning: preferences.airConditioning,
      luggage_allowed: preferences.luggageAllowed
    } : undefined;
    
    // Construire les filtres
    const filters: RidesharingSearchFilters = {
      origin: origin || undefined,
      destination: destination || undefined,
      date: date,
      minSeats: passengers,
      maxPrice: maxPrice,
      preferenceFilters
    };
    
    onSearch(filters);
  };

  return (
    <Card className="bg-white border border-gray-200 mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Départ */}
          <div className="space-y-2">
            <Label>Départ</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                className="pl-10"
                placeholder="Lieu de départ" 
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </div>
          </div>
          
          {/* Destination */}
          <div className="space-y-2">
            <Label>Destination</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                className="pl-10"
                placeholder="Lieu d'arrivée" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </div>
          
          {/* Date */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full pl-3 text-left font-normal justify-start"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "EEEE d MMMM", { locale: fr }) : "Sélectionner une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Passagers */}
          <div className="space-y-2">
            <Label>Passagers</Label>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="icon"
                className="h-10 w-10"
                onClick={() => setPassengers(Math.max(1, passengers - 1))}
              >
                -
              </Button>
              <div className="flex-1 text-center font-medium">{passengers}</div>
              <Button 
                variant="outline" 
                size="icon"
                className="h-10 w-10"
                onClick={() => setPassengers(Math.min(4, passengers + 1))}
              >
                +
              </Button>
            </div>
          </div>
        </div>
        
        {/* Advanced options */}
        <div className="mt-4">
          <div className="flex items-center space-x-2 mb-4">
            <Switch 
              checked={showAdvanced} 
              onCheckedChange={setShowAdvanced} 
              id="advanced-options"
            />
            <Label htmlFor="advanced-options">Options avancées</Label>
          </div>
          
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Price slider */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Prix maximum (FCFA)</Label>
                  <span className="font-medium">{maxPrice?.toLocaleString() || "Non défini"}</span>
                </div>
                <Slider
                  value={maxPrice ? [maxPrice] : [20000]}
                  min={5000}
                  max={50000}
                  step={1000}
                  onValueChange={(values) => setMaxPrice(values[0])}
                />
              </div>
              
              {/* Preferences */}
              <div className="space-y-3">
                <Label>Préférences</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={preferences.nonSmoking} 
                      onCheckedChange={(checked) => setPreferences({...preferences, nonSmoking: checked})}
                      id="non-smoking"
                    />
                    <Label htmlFor="non-smoking">Non-fumeur</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={preferences.airConditioning} 
                      onCheckedChange={(checked) => setPreferences({...preferences, airConditioning: checked})}
                      id="air-conditioning"
                    />
                    <Label htmlFor="air-conditioning">Climatisé</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={preferences.musicAllowed} 
                      onCheckedChange={(checked) => setPreferences({...preferences, musicAllowed: checked})}
                      id="music"
                    />
                    <Label htmlFor="music">Musique</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={preferences.petsAllowed} 
                      onCheckedChange={(checked) => setPreferences({...preferences, petsAllowed: checked})}
                      id="pets"
                    />
                    <Label htmlFor="pets">Animaux autorisés</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={preferences.luggageAllowed} 
                      onCheckedChange={(checked) => setPreferences({...preferences, luggageAllowed: checked})}
                      id="luggage"
                    />
                    <Label htmlFor="luggage">Bagages autorisés</Label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Search button */}
        <Button 
          className="w-full mt-6"
          onClick={handleSearch}
          disabled={isLoading}
        >
          <Search className="mr-2 h-5 w-5" />
          Rechercher
          {isLoading && <span className="ml-2 animate-spin">⏳</span>}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TripSearchForm;
