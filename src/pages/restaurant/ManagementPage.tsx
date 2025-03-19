
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuItemAvailabilityManager } from '@/components/restaurant/MenuItemAvailabilityManager';
import { MenuAvailabilityManager } from '@/components/restaurant/MenuAvailabilityManager';
import { RestaurantStatusManager } from '@/components/restaurant/RestaurantStatusManager';
import { SpecialHoursManager } from '@/components/restaurant/SpecialHoursManager';
import apiClient from '@/integrations/api/client';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/Layout';

export default function RestaurantManagementPage() {
  const { id: restaurantId } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if the logged-in user is the owner of this restaurant
    const checkOwnership = async () => {
      try {
        if (!restaurantId) return;
        
        setLoading(true);
        
        const user = await apiClient.auth.getUser();
        
        if (!user) {
          setIsOwner(false);
          return;
        }
        
        const restaurant = await apiClient.restaurants.getById(restaurantId);
        
        // Check if the user is an owner or admin
        setIsOwner(
          user.role === 'admin' || 
          (user.role === 'restaurant_owner' && restaurant.user_id === user.id)
        );
      } catch (error) {
        console.error('Error checking restaurant ownership:', error);
        toast({
          title: 'Erreur',
          description: "Impossible de vérifier les droits d'accès",
          variant: 'destructive'
        });
        setIsOwner(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkOwnership();
  }, [restaurantId, toast]);
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!isOwner) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center p-8 border rounded-md">
            <h2 className="text-xl font-bold mb-2">Accès non autorisé</h2>
            <p className="text-gray-600">
              Vous n'avez pas les permissions nécessaires pour gérer ce restaurant.
            </p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Gestion du Restaurant</h1>
        
        <Tabs defaultValue="status" className="space-y-8">
          <TabsList className="bg-muted mb-6">
            <TabsTrigger value="status">Statut Restaurant</TabsTrigger>
            <TabsTrigger value="menu">Disponibilité Menu</TabsTrigger>
            <TabsTrigger value="hours">Horaires Spéciaux</TabsTrigger>
            <TabsTrigger value="inventory">Inventaire</TabsTrigger>
          </TabsList>
          
          <TabsContent value="status" className="space-y-6">
            <RestaurantStatusManager restaurantId={restaurantId || ''} isOwner={isOwner} />
          </TabsContent>
          
          <TabsContent value="menu" className="space-y-6">
            <MenuAvailabilityManager restaurantId={restaurantId || ''} isOwner={isOwner} />
          </TabsContent>
          
          <TabsContent value="hours" className="space-y-6">
            <SpecialHoursManager restaurantId={restaurantId || ''} isOwner={isOwner} />
          </TabsContent>
          
          <TabsContent value="inventory" className="space-y-6">
            <MenuItemAvailabilityManager restaurantId={restaurantId || ''} isOwner={isOwner} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
