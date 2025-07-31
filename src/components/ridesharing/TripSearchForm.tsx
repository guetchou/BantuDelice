
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Loader2, Calendar as CalendarIcon, MapPin, Search, User } from "lucide-react";
import { RidesharingSearchFilters } from '@/types/ridesharing';
import { cn } from '@/lib/utils';

interface TripSearchFormProps {
  onSearch: (filters: RidesharingSearchFilters) => void;
  isLoading?: boolean;
}

const TripSearchForm: React.FC<TripSearchFormProps> = ({ onSearch, isLoading = false }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [recurringTrip, setRecurringTrip] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<{
    origin: string;
    destination: string;
    minSeats: number;
  }>();
  
  const onSubmit = (data: { origin: string; destination: string; minSeats: number }) => {
    const filters: RidesharingSearchFilters = {
      origin: data.origin,
      destination: data.destination,
      date,
      minSeats: data.minSeats || 1,
      recurringTrip
    };
    onSearch(filters);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="origin" className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-primary" />
            Lieu de départ
          </Label>
          <Input
            id="origin"
            placeholder="D'où partez-vous?"
            {...register("origin", { required: "Ce champ est requis" })}
            className={errors.origin ? "border-red-500" : ""}
          />
          {errors.origin && (
            <p className="text-red-500 text-xs mt-1">{errors.origin.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="destination" className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-red-500" />
            Destination
          </Label>
          <Input
            id="destination"
            placeholder="Où allez-vous?"
            {...register("destination", { required: "Ce champ est requis" })}
            className={errors.destination ? "border-red-500" : ""}
          />
          {errors.destination && (
            <p className="text-red-500 text-xs mt-1">{errors.destination.message}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
            Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP', { locale: fr }) : <span>Choisir une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <Label htmlFor="minSeats" className="flex items-center">
            <User className="h-4 w-4 mr-1 text-gray-500" />
            Nombre de places
          </Label>
          <Input
            id="minSeats"
            type="number"
            defaultValue={1}
            min={1}
            max={8}
            {...register("minSeats", { 
              min: { value: 1, message: "Minimum 1 place" },
              max: { value: 8, message: "Maximum 8 places" }
            })}
          />
          {errors.minSeats && (
            <p className="text-red-500 text-xs mt-1">{errors.minSeats.message}</p>
          )}
        </div>
        
        <div className="flex items-end">
          <div className="space-y-2 w-full">
            <Label htmlFor="recurringTrip" className="flex items-center">
              Trajet régulier
            </Label>
            <div className="flex items-center space-x-2">
              <Switch 
                id="recurringTrip" 
                checked={recurringTrip}
                onCheckedChange={setRecurringTrip}
              />
              <Label htmlFor="recurringTrip" className="cursor-pointer">
                {recurringTrip ? 'Oui' : 'Non'}
              </Label>
            </div>
          </div>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
