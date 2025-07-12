
import React from 'react';
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EnhancedPickupTimeSectionProps {
  pickupTime: 'now' | 'scheduled';
  scheduledTime: string;
  onPickupTimeChange: (time: 'now' | 'scheduled') => void;
  onScheduledTimeChange: (time: string) => void;
}

const EnhancedPickupTimeSection: React.FC<EnhancedPickupTimeSectionProps> = ({
  pickupTime,
  scheduledTime,
  onPickupTimeChange,
  onScheduledTimeChange
}) => {
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    // Garder l'heure actuelle du champ scheduledTime s'il existe
    let hour = "12";
    let minute = "00";
    
    if (scheduledTime) {
      const scheduledDate = new Date(scheduledTime);
      hour = String(scheduledDate.getHours()).padStart(2, '0');
      minute = String(scheduledDate.getMinutes()).padStart(2, '0');
    }
    
    // Formater la date au format ISO avec l'heure existante
    const formattedDate = new Date(date);
    formattedDate.setHours(parseInt(hour));
    formattedDate.setMinutes(parseInt(minute));
    
    onScheduledTimeChange(formattedDate.toISOString());
  };
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!scheduledTime) {
      // Si pas de date sélectionnée, utiliser la date du jour
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      onScheduledTimeChange(today.toISOString());
    }
    
    // Extraire l'heure et les minutes du champ time
    const [hour, minute] = e.target.value.split(':');
    
    // Créer une nouvelle date basée sur scheduledTime
    const scheduledDate = scheduledTime ? new Date(scheduledTime) : new Date();
    scheduledDate.setHours(parseInt(hour));
    scheduledDate.setMinutes(parseInt(minute));
    
    onScheduledTimeChange(scheduledDate.toISOString());
  };
  
  const isDateDisabled = (date: Date) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return date < now;
  };
  
  // Extraire la date et l'heure de scheduledTime
  const scheduledDate = scheduledTime ? new Date(scheduledTime) : undefined;
  const scheduledTimeValue = scheduledDate 
    ? `${String(scheduledDate.getHours()).padStart(2, '0')}:${String(scheduledDate.getMinutes()).padStart(2, '0')}` 
    : '';
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Quand souhaitez-vous partir ?</h3>
        <p className="text-sm text-gray-500 mb-4">
          Choisissez si vous souhaitez être pris en charge immédiatement ou ultérieurement.
        </p>
      </div>
      
      <Tabs 
        defaultValue={pickupTime} 
        value={pickupTime}
        onValueChange={(value) => onPickupTimeChange(value as 'now' | 'scheduled')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="now" className="gap-2">
            <Clock className="h-4 w-4" />
            <span>Maintenant</span>
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>Planifier</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="now" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Course immédiate</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Un chauffeur sera assigné immédiatement et devrait arriver dans les 5-15 minutes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled" className="pt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate 
                      ? format(scheduledDate, 'P', { locale: fr }) 
                      : "Sélectionner une date"
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={handleDateSelect}
                    initialFocus
                    disabled={isDateDisabled}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Heure</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="time"
                  type="time"
                  value={scheduledTimeValue}
                  onChange={handleTimeChange}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-2 bg-blue-50 p-3 rounded-md text-sm text-blue-800">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p>
              La réservation à l'avance est disponible jusqu'à 7 jours. Prévoyez au moins 
              1 heure à l'avance pour garantir la disponibilité d'un chauffeur.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedPickupTimeSection;
