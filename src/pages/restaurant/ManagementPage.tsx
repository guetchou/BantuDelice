
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import MenuItemAvailabilityManager from '@/components/restaurant/MenuItemAvailabilityManager';
import RestaurantAvailabilityManager from '@/components/restaurant/RestaurantAvailabilityManager';
import DeliveryManagement from '@/components/restaurant/DeliveryManagement';
import DeliverySettings from '@/components/restaurant/DeliverySettings';
import RestaurantPromotionsManager from '@/components/restaurant/RestaurantPromotionsManager';
import MenuAvailabilityManager from '@/components/restaurant/MenuAvailabilityManager';
import RestaurantStatusManager from '@/components/restaurant/RestaurantStatusManager';
import SpecialHoursManager from '@/components/restaurant/SpecialHoursManager';

const ManagementPage = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        if (!id) return;
        
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        setRestaurant(data);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        toast({
          title: "Error",
          description: "Could not fetch restaurant information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurant();
  }, [id, toast]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!restaurant) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Restaurant Not Found</h1>
          <p className="text-gray-600">The restaurant you're looking for doesn't exist or you don't have permission to manage it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Restaurant Management: {restaurant.name}</h1>
      
      <Tabs defaultValue="status" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="special-hours">Special Hours</TabsTrigger>
          <TabsTrigger value="menu">Menu Items</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Management</TabsTrigger>
          <TabsTrigger value="delivery-settings">Delivery Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="status" className="space-y-4">
          <RestaurantStatusManager restaurant={restaurant} />
        </TabsContent>
        
        <TabsContent value="availability" className="space-y-4">
          <RestaurantAvailabilityManager restaurant={restaurant} />
        </TabsContent>
        
        <TabsContent value="special-hours" className="space-y-4">
          <SpecialHoursManager restaurant={restaurant} />
        </TabsContent>
        
        <TabsContent value="menu" className="space-y-4">
          <MenuAvailabilityManager restaurantId={restaurant.id} />
          <MenuItemAvailabilityManager restaurantId={restaurant.id} />
        </TabsContent>
        
        <TabsContent value="promotions" className="space-y-4">
          <RestaurantPromotionsManager restaurantId={restaurant.id} />
        </TabsContent>
        
        <TabsContent value="delivery" className="space-y-4">
          <DeliveryManagement restaurantId={restaurant.id} />
        </TabsContent>
        
        <TabsContent value="delivery-settings" className="space-y-4">
          <DeliverySettings restaurantId={restaurant.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagementPage;
