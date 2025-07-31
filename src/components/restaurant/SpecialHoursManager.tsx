
import React, { useState, useEffect } from 'react';
import apiClient from '@/integrations/api/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format, isToday, isFuture, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Clock, 
  Calendar as CalendarIcon, 
  Trash2, 
  AlarmClock, 
  Plus 
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SpecialHour {
  id: string;
  restaurant_id: string;
  date: string;
  is_closed: boolean;
  open_time: string | null;
  close_time: string | null;
  reason: string | null;
  created_at: string;
}

interface SpecialHoursManagerProps {
  restaurantId: string;
  isOwner?: boolean;
}

export function SpecialHoursManager({ restaurantId, isOwner = true }: SpecialHoursManagerProps) {
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [specialHours, setSpecialHours] = useState<SpecialHour[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  // New special hour form state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isClosed, setIsClosed] = useState(false);
  const [openTime, setOpenTime] = useState("09:00");
  const [closeTime, setCloseTime] = useState("22:00");
  const [reason, setReason] = useState("");
  
  useEffect(() => {
    if (restaurantId) {
      fetchSpecialHours();
    }
  }, [restaurantId]);
  
  const fetchSpecialHours = async () => {
    try {
      setLoading(true);
      
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      const data = await apiClient.restaurants.getSpecialHours(restaurantId, {
        from_date: today
      });
      
      if (data) {
        setSpecialHours(data);
      }
    } catch (error) {
      console.error('Error fetching special hours:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de charger les horaires spéciaux",
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const addSpecialHours = async () => {
    if (!selectedDate) {
      toast({
        title: 'Date requise',
        description: "Veuillez sélectionner une date",
        variant: 'destructive'
      });
      return;
    }
    
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    
    try {
      setLoading(true);
      
      const newSpecialHour = {
        date: formattedDate,
        is_closed: isClosed,
        open_time: isClosed ? null : openTime,
        close_time: isClosed ? null : closeTime,
        reason: reason || null
      };
      
      await apiClient.restaurants.setSpecialHours(restaurantId, newSpecialHour);
      
      // Reset form
      setSelectedDate(undefined);
      setIsClosed(false);
      setOpenTime("09:00");
      setCloseTime("22:00");
      setReason("");
      setIsAddingNew(false);
      
      // Refresh special hours
      fetchSpecialHours();
      
      toast({
        title: 'Horaires spéciaux ajoutés',
        description: `Horaires spéciaux pour le ${format(selectedDate, 'dd MMMM yyyy', { locale: fr })} enregistrés avec succès`
      });
    } catch (error) {
      console.error('Error adding special hours:', error);
      toast({
        title: 'Erreur',
        description: "Impossible d'ajouter les horaires spéciaux",
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const deleteSpecialHours = async (id: string) => {
    try {
      setLoading(true);
      
      await apiClient.restaurants.deleteSpecialHours(restaurantId, id);
      
      // Update local state
      setSpecialHours(prevHours => prevHours.filter(hour => hour.id !== id));
      
      toast({
        title: 'Horaires spéciaux supprimés',
        description: "Les horaires spéciaux ont été supprimés avec succès"
      });
    } catch (error) {
      console.error('Error deleting special hours:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de supprimer les horaires spéciaux",
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && specialHours.length === 0) {
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
            <AlarmClock className="mr-2 h-6 w-6" />
            Gestion des horaires exceptionnels
          </CardTitle>
          <CardDescription>
            Définissez des jours fériés, des fermetures exceptionnelles ou des horaires spéciaux
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {isOwner && (
              <div className="flex justify-end">
                <Button 
                  onClick={() => setIsAddingNew(!isAddingNew)} 
                  variant={isAddingNew ? "outline" : "default"}
                >
                  {isAddingNew ? "Annuler" : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter des horaires spéciaux
                    </>
                  )}
                </Button>
              </div>
            )}
            
            {isAddingNew && (
              <Card className="border-dashed">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? (
                              format(selectedDate, 'PPP', { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => !isFuture(date) && !isToday(date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="closed"
                        checked={isClosed}
                        onCheckedChange={setIsClosed}
                      />
                      <Label htmlFor="closed">Restaurant fermé ce jour</Label>
                    </div>
                    
                    {!isClosed && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="open-time">Heure d'ouverture</Label>
                          <Input
                            id="open-time"
                            type="time"
                            value={openTime}
                            onChange={(e) => setOpenTime(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="close-time">Heure de fermeture</Label>
                          <Input
                            id="close-time"
                            type="time"
                            value={closeTime}
                            onChange={(e) => setCloseTime(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="reason">Raison (optionnelle)</Label>
                      <Textarea
                        id="reason"
                        placeholder="Ex: Jour férié, Fermeture exceptionnelle, etc."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </div>
                    
                    <Button 
                      onClick={addSpecialHours} 
                      className="w-full"
                      disabled={!selectedDate}
                    >
                      Enregistrer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Horaires exceptionnels à venir</h3>
              
              {specialHours.length === 0 ? (
                <div className="text-center p-8 border rounded-md">
                  <Clock className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun horaire exceptionnel</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Ajoutez des horaires spéciaux pour les jours fériés ou événements.
                  </p>
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Horaires
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Raison
                        </th>
                        {isOwner && (
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {specialHours.map((hour) => (
                        <tr key={hour.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {format(parseISO(hour.date), 'dd MMMM yyyy', { locale: fr })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {hour.is_closed ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Fermé
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Ouvert (Horaires modifiés)
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {hour.is_closed ? (
                              "Fermé toute la journée"
                            ) : (
                              `${hour.open_time || "09:00"} - ${hour.close_time || "22:00"}`
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {hour.reason || "-"}
                          </td>
                          {isOwner && (
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Êtes-vous sûr de vouloir supprimer ces horaires exceptionnels ?
                                      Cette action ne peut pas être annulée.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteSpecialHours(hour.id)}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Supprimer
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
