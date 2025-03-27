
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Clock, Calendar, Timer, ZapIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
  // Calculer la date minimum (maintenant + 30 minutes)
  const minTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now.toISOString().slice(0, 16);
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base">Quand souhaitez-vous partir?</Label>
        <p className="text-sm text-muted-foreground mb-3">
          Choisissez si vous voulez être pris en charge maintenant ou planifier un trajet ultérieur
        </p>
      </div>
      
      <Tabs 
        defaultValue={pickupTime} 
        value={pickupTime}
        onValueChange={(value) => onPickupTimeChange(value as 'now' | 'scheduled')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="now" className="flex items-center gap-2">
            <ZapIcon className="h-4 w-4" />
            <span>Maintenant</span>
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Planifier</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="now" className="pt-4">
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 text-primary p-2 rounded-full">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Départ immédiat</p>
                  <p className="text-sm text-muted-foreground">
                    Votre chauffeur arrivera dans 5-10 minutes après confirmation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled" className="pt-4">
          <Card>
            <CardContent className="pt-4 pb-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scheduled-time">Date et heure de prise en charge</Label>
                <div className="relative">
                  <Input
                    id="scheduled-time"
                    type="datetime-local"
                    min={minTime()}
                    value={scheduledTime}
                    onChange={(e) => onScheduledTimeChange(e.target.value)}
                    className="pl-10"
                  />
                  <Timer className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>
              
              <div className="rounded-lg border border-muted bg-muted/20 p-3 text-sm">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Conseil :</span> Planifiez votre course à l'avance pour garantir la disponibilité d'un véhicule à l'heure souhaitée.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedPickupTimeSection;
