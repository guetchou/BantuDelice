
import React, { useState } from 'react';
import { addDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Calendar } from "@/components/ui/calendar";
import { Search, Calendar as CalendarIcon, MapPin, CreditCard, Star, Repeat } from "lucide-react";
import { RidesharingSearchFilters } from '@/types/ridesharing';

interface TripSearchFormProps {
  onSearch: (filters: RidesharingSearchFilters) => Promise<void>;
  isLoading: boolean;
}

const TripSearchForm: React.FC<TripSearchFormProps> = ({
  onSearch,
  isLoading
}) => {
  const [filters, setFilters] = useState<RidesharingSearchFilters>({
    origin: '',
    destination: '',
    date: new Date(),
    minSeats: 1,
    maxPrice: 10000,
    minDriverRating: 3.0,
    preferenceFilters: {
      smoking_allowed: false,
      pets_allowed: false,
      music_allowed: false,
      air_conditioning: false,
      luggage_allowed: false
    },
    recurringTrip: false
  });
  
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFilters((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof RidesharingSearchFilters] as Record<string, any>,
          [child]: checked
        }
      }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: checked }));
    }
  };

  const handleSliderChange = (name: string, value: number[]) => {
    setFilters((prev) => ({ ...prev, [name]: value[0] }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!filters.origin) {
      newErrors.origin = 'Le point de départ est requis';
    }
    
    if (!filters.destination) {
      newErrors.destination = 'La destination est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await onSearch(filters);
    } catch (error) {
      console.error('Error searching for trips:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="origin">Départ</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              id="origin"
              name="origin"
              value={filters.origin}
              onChange={handleInputChange}
              placeholder="Ville ou adresse de départ"
              className={`pl-10 ${errors.origin ? "border-red-500" : ""}`}
            />
          </div>
          {errors.origin && <p className="text-red-500 text-sm">{errors.origin}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="destination">Destination</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              id="destination"
              name="destination"
              value={filters.destination}
              onChange={handleInputChange}
              placeholder="Ville ou adresse d'arrivée"
              className={`pl-10 ${errors.destination ? "border-red-500" : ""}`}
            />
          </div>
          {errors.destination && <p className="text-red-500 text-sm">{errors.destination}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.date ? (
                  format(filters.date, 'EEEE d MMMM', { locale: fr })
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.date}
                onSelect={(date) => {
                  setFilters((prev) => ({ ...prev, date: date as Date }));
                  setCalendarOpen(false);
                }}
                initialFocus
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minSeats">Nombre de places</Label>
          <div className="flex items-center">
            <Input
              id="minSeats"
              type="number"
              min="1"
              max="8"
              value={filters.minSeats}
              onChange={(e) => setFilters((prev) => ({ ...prev, minSeats: parseInt(e.target.value) || 1 }))}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="recurringTrip"
            checked={filters.recurringTrip}
            onCheckedChange={(checked) => 
              handleCheckboxChange("recurringTrip", !!checked)
            }
          />
          <div>
            <Label htmlFor="recurringTrip" className="flex items-center">
              <Repeat className="h-4 w-4 mr-1" />
              Trajet régulier
            </Label>
            <p className="text-sm text-gray-500">Trajets domicile-travail, école, etc.</p>
          </div>
        </div>
      </div>

      <Accordion type="single" collapsible>
        <AccordionItem value="advanced-filters">
          <AccordionTrigger>
            <span className="text-sm font-medium">Filtres avancés</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>
                      <CreditCard className="h-4 w-4 inline mr-2" />
                      Prix maximum
                    </Label>
                    <span className="text-sm font-medium">{filters.maxPrice?.toLocaleString()} FCFA</span>
                  </div>
                  <Slider
                    defaultValue={[10000]}
                    max={20000}
                    step={500}
                    value={[filters.maxPrice || 10000]}
                    onValueChange={(value) => handleSliderChange("maxPrice", value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>
                      <Star className="h-4 w-4 inline mr-2" />
                      Note minimale conducteur
                    </Label>
                    <span className="text-sm font-medium">{filters.minDriverRating} / 5</span>
                  </div>
                  <Slider
                    defaultValue={[3.0]}
                    min={1}
                    max={5}
                    step={0.5}
                    value={[filters.minDriverRating || 3.0]}
                    onValueChange={(value) => handleSliderChange("minDriverRating", value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Préférences</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="preferenceFilters.smoking_allowed"
                      checked={filters.preferenceFilters?.smoking_allowed}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("preferenceFilters.smoking_allowed", !checked as boolean)
                      }
                    />
                    <Label htmlFor="preferenceFilters.smoking_allowed">Non-fumeur uniquement</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="preferenceFilters.air_conditioning"
                      checked={filters.preferenceFilters?.air_conditioning}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("preferenceFilters.air_conditioning", !!checked)
                      }
                    />
                    <Label htmlFor="preferenceFilters.air_conditioning">Climatisation</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="preferenceFilters.luggage_allowed"
                      checked={filters.preferenceFilters?.luggage_allowed}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("preferenceFilters.luggage_allowed", !!checked)
                      }
                    />
                    <Label htmlFor="preferenceFilters.luggage_allowed">Bagages autorisés</Label>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            Recherche en cours...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Rechercher un trajet
          </>
        )}
      </Button>
    </form>
  );
};

export default TripSearchForm;
