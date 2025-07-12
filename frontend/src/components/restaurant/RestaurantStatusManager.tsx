
import React, { useState, useEffect } from 'react';
import apiClient from '@/integrations/api/client';
import { useToast } from '@/hooks/use-toast';
import { format, addHours } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Store, Clock, AlertCircle } from "lucide-react";

interface RestaurantStatusManagerProps {
  restaurantId: string;
  isOwner?: boolean;
}

export function RestaurantStatusManager({ restaurantId, isOwner = true }: RestaurantStatusManagerProps) {
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [reason, setReason] = useState("");
  const [reopenTime, setReopenTime] = useState("");
  const [updating, setUpdating] = useState(false);
  
  useEffect(() => {
    if (restaurantId) {
      fetchRestaurantStatus();
    }
  }, [restaurantId]);
  
  const fetchRestaurantStatus = async () => {
    try {
      setLoading(true);
      
      const data = await apiClient.restaurants.getById(restaurantId);
      
      if (data) {
        setIsOpen(data.is_open || false);
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
  
  const updateRestaurantStatus = async () => {
    try {
      setUpdating(true);
      
      const updateData = {
        is_open: isOpen,
        reason: !isOpen ? reason : null,
        estimated_reopening: !isOpen && reopenTime ? new Date(reopenTime).toISOString() : null
      };
      
      await apiClient.restaurants.updateStatus(restaurantId, updateData);
      
      toast({
        title: isOpen ? 'Restaurant ouvert' : 'Restaurant fermé',
        description: isOpen 
          ? "Le restaurant est maintenant ouvert aux commandes" 
          : "Le restaurant est temporairement fermé aux commandes"
      });
    } catch (error) {
      console.error('Error updating restaurant status:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de mettre à jour le statut du restaurant",
        variant: 'destructive'
      });
    } finally {
      setUpdating(false);
    }
  };
  
  // Set default reopen time to 2 hours from now
  useEffect(() => {
    if (!isOpen && !reopenTime) {
      const defaultReopenTime = addHours(new Date(), 2);
      setReopenTime(format(defaultReopenTime, "yyyy-MM-dd'T'HH:mm"));
    }
  }, [isOpen, reopenTime]);
  
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Store className="mr-2 h-6 w-6" />
          Statut du restaurant
        </CardTitle>
        <CardDescription>
          Gérez l'ouverture et la fermeture temporaire de votre restaurant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {!isOwner && (
            <div className={`p-4 rounded-md ${isOpen ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} flex items-center`}>
              <AlertCircle className="h-5 w-5 mr-2" />
              <div>
                <p className="font-medium">
                  {isOpen ? 'Restaurant ouvert' : 'Restaurant fermé temporairement'}
                </p>
                {!isOpen && reason && (
                  <p className="text-sm mt-1">Raison: {reason}</p>
                )}
              </div>
            </div>
          )}
          
          {isOwner && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="restaurant-status"
                    checked={isOpen}
                    onCheckedChange={setIsOpen}
                    disabled={updating}
                  />
                  <Label htmlFor="restaurant-status" className="text-base font-medium">
                    {isOpen ? 'Restaurant ouvert' : 'Restaurant fermé'}
                  </Label>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-sm ${
                  isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isOpen ? 'Accepte les commandes' : 'Refus de commandes'}
                </div>
              </div>
              
              {!isOpen && (
                <div className="space-y-4 p-4 rounded-md bg-gray-50">
                  <div className="space-y-2">
                    <Label htmlFor="reason">Raison de la fermeture</Label>
                    <Textarea
                      id="reason"
                      placeholder="Ex: Restaurant complet, Équipement en panne, etc."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reopen-time" className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Réouverture prévue
                    </Label>
                    <Input
                      id="reopen-time"
                      type="datetime-local"
                      value={reopenTime}
                      onChange={(e) => setReopenTime(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Le restaurant réouvrira automatiquement à cette date
                    </p>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={updateRestaurantStatus} 
                className="w-full"
                disabled={updating}
              >
                {updating ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Mise à jour...
                  </div>
                ) : (
                  isOpen ? 'Appliquer l\'ouverture' : 'Appliquer la fermeture temporaire'
                )}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
