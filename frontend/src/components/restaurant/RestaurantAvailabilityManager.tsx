
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Clock, Calendar as CalendarIcon, Utensils, Ban, Settings, Info } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface RestaurantAvailabilityManagerProps {
  restaurantId: string;
  isOwner?: boolean;
}

interface SpecialHours {
  date: Date;
  open: string;
  close: string;
  is_closed: boolean;
  reason?: string;
}

export function RestaurantAvailabilityManager({ restaurantId, isOwner = true }: RestaurantAvailabilityManagerProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [specialHours, setSpecialHours] = useState<SpecialHours[]>([]);
  const [currentSpecialDay, setCurrentSpecialDay] = useState<SpecialHours>({
    date: new Date(),
    open: '08:00',
    close: '22:00',
    is_closed: false
  });
  
  // Available reasons for special hours
  const reasons = [
    'Jour férié',
    'Événement privé',
    'Vacances',
    'Maintenance',
    'Personnel limité',
    'Autre'
  ];

  useEffect(() => {
    fetchRestaurantStatus();
  }, [restaurantId]);

  const fetchRestaurantStatus = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('restaurants')
        .select('is_open, special_days')
        .eq('id', restaurantId)
        .single();
        
      if (error) throw error;
      
      setIsOpen(data.is_open || false);
      
      if (data.special_days) {
        const specialDays = Array.isArray(data.special_days) ? data.special_days : [];
        setSpecialHours(specialDays.map((day: any) => ({
          ...day,
          date: new Date(day.date)
        })));
      }
    } catch (error) {
      console.error('Error fetching restaurant status:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de charger le statut du restaurant",
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleRestaurantStatus = async () => {
    try {
      setSaving(true);
      const newStatus = !isOpen;
      
      const { error } = await supabase
        .from('restaurants')
        .update({ is_open: newStatus })
        .eq('id', restaurantId);
        
      if (error) throw error;
      
      setIsOpen(newStatus);
      toast({
        title: newStatus ? 'Restaurant ouvert' : 'Restaurant fermé',
        description: newStatus 
          ? "Le restaurant est maintenant disponible pour les commandes" 
          : "Le restaurant est temporairement fermé",
      });
    } catch (error) {
      console.error('Error updating restaurant status:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de mettre à jour le statut du restaurant",
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const addSpecialHours = async () => {
    try {
      setSaving(true);
      
      // Format the date to ISO string for storage
      const newSpecialHours = {
        ...currentSpecialDay,
        date: format(currentSpecialDay.date, 'yyyy-MM-dd')
      };

      // Add to local state first
      const updatedHours = [...specialHours, {...currentSpecialDay}];
      
      // Update in database
      const { error } = await supabase
        .from('restaurants')
        .update({ 
          special_days: updatedHours.map(day => ({
            ...day,
            date: day.date instanceof Date ? format(day.date, 'yyyy-MM-dd') : day.date
          }))
        })
        .eq('id', restaurantId);
        
      if (error) throw error;
      
      setSpecialHours(updatedHours);
      
      toast({
        title: 'Horaires spéciaux ajoutés',
        description: currentSpecialDay.is_closed 
          ? `Le restaurant sera fermé le ${format(currentSpecialDay.date, 'dd/MM/yyyy')}` 
          : `Les horaires pour le ${format(currentSpecialDay.date, 'dd/MM/yyyy')} ont été mis à jour`,
      });
      
      // Reset form
      setCurrentSpecialDay({
        date: new Date(),
        open: '08:00',
        close: '22:00',
        is_closed: false
      });
    } catch (error) {
      console.error('Error adding special hours:', error);
      toast({
        title: 'Erreur',
        description: "Impossible d'ajouter les horaires spéciaux",
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const removeSpecialHours = async (index: number) => {
    try {
      setSaving(true);
      
      const updatedHours = specialHours.filter((_, i) => i !== index);
      
      const { error } = await supabase
        .from('restaurants')
        .update({ 
          special_days: updatedHours.map(day => ({
            ...day,
            date: day.date instanceof Date ? format(day.date, 'yyyy-MM-dd') : day.date
          }))
        })
        .eq('id', restaurantId);
        
      if (error) throw error;
      
      setSpecialHours(updatedHours);
      
      toast({
        title: 'Horaires spéciaux supprimés',
        description: "Les horaires spéciaux ont été supprimés avec succès",
      });
    } catch (error) {
      console.error('Error removing special hours:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de supprimer les horaires spéciaux",
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Utensils className="mr-2 h-6 w-6" />
            Statut du restaurant
          </CardTitle>
          <CardDescription>
            Gérez la disponibilité de votre restaurant pour les commandes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="open-status" className="text-base">
                {isOpen ? 'Restaurant ouvert' : 'Restaurant fermé'}
              </Label>
              <p className="text-sm text-gray-500">
                {isOpen 
                  ? 'Votre restaurant accepte actuellement les commandes'
                  : 'Votre restaurant n\'accepte pas de commandes actuellement'
                }
              </p>
            </div>
            <div>
              <Switch
                id="open-status"
                checked={isOpen}
                onCheckedChange={toggleRestaurantStatus}
                disabled={saving || !isOwner}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-6 w-6" />
            Horaires exceptionnels
          </CardTitle>
          <CardDescription>
            Définissez des horaires spéciaux ou des fermetures temporaires
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {specialHours.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Horaires spéciaux planifiés</h3>
                <div className="border rounded-md divide-y">
                  {specialHours.map((hours, index) => (
                    <div key={index} className="p-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {hours.date instanceof Date 
                            ? format(hours.date, 'dd/MM/yyyy')
                            : hours.date
                          }
                        </p>
                        {hours.is_closed ? (
                          <p className="text-sm text-destructive flex items-center">
                            <Ban className="h-4 w-4 mr-1" />
                            Fermé
                            {hours.reason && ` (${hours.reason})`}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">
                            {hours.open} - {hours.close}
                            {hours.reason && ` (${hours.reason})`}
                          </p>
                        )}
                      </div>
                      {isOwner && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeSpecialHours(index)}
                          disabled={saving}
                        >
                          Supprimer
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {isOwner && (
              <div className="space-y-4 border rounded-md p-4">
                <h3 className="font-medium">Ajouter un horaire spécial</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="special-date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="special-date"
                          variant="outline"
                          className="w-full justify-start text-left"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {currentSpecialDay.date ? (
                            format(currentSpecialDay.date, 'dd/MM/yyyy')
                          ) : (
                            <span>Sélectionner une date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={currentSpecialDay.date}
                          onSelect={(date) => date && setCurrentSpecialDay({...currentSpecialDay, date})}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="special-reason">Raison (optionnel)</Label>
                    <Select 
                      value={currentSpecialDay.reason} 
                      onValueChange={(value) => 
                        setCurrentSpecialDay({...currentSpecialDay, reason: value})
                      }
                    >
                      <SelectTrigger id="special-reason">
                        <SelectValue placeholder="Sélectionner une raison" />
                      </SelectTrigger>
                      <SelectContent>
                        {reasons.map((reason) => (
                          <SelectItem key={reason} value={reason}>
                            {reason}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  <Switch
                    id="is-closed"
                    checked={currentSpecialDay.is_closed}
                    onCheckedChange={(checked) => 
                      setCurrentSpecialDay({...currentSpecialDay, is_closed: checked})
                    }
                  />
                  <Label htmlFor="is-closed">Restaurant fermé ce jour</Label>
                </div>
                
                {!currentSpecialDay.is_closed && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="open-time">Heure d'ouverture</Label>
                      <Input
                        id="open-time"
                        type="time"
                        value={currentSpecialDay.open}
                        onChange={(e) => 
                          setCurrentSpecialDay({...currentSpecialDay, open: e.target.value})
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="close-time">Heure de fermeture</Label>
                      <Input
                        id="close-time"
                        type="time"
                        value={currentSpecialDay.close}
                        onChange={(e) => 
                          setCurrentSpecialDay({...currentSpecialDay, close: e.target.value})
                        }
                      />
                    </div>
                  </div>
                )}
                
                <Button 
                  className="w-full" 
                  onClick={addSpecialHours}
                  disabled={saving}
                >
                  {saving ? 'Enregistrement...' : 'Ajouter l\'horaire spécial'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
