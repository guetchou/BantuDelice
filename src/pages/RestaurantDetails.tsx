
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, Mail, Globe, Clock, MapPin, Star, 
  DollarSign, Truck, Info, Menu as MenuIcon
} from "lucide-react";
import Layout from '@/components/Layout';
import RestaurantMenu from '@/components/restaurant/RestaurantMenu';
import { type Restaurant, type BusinessHours, type BusinessDay } from '@/types/restaurant';

function formatBusinessDay(day: BusinessDay): string {
  if (day.is_closed) return 'Fermé';
  return `${day.open} - ${day.close}`;
}

export default function RestaurantDetails() {
  const { id } = useParams<{ id: string }>();
  
  const { data: restaurant, isLoading, error } = useQuery<Restaurant>({
    queryKey: ['restaurant', id],
    queryFn: async () => {
      if (!id) throw new Error('Restaurant ID is required');
      
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      if (!data) throw new Error('Restaurant not found');
      
      return data as Restaurant;
    }
  });
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="text-center mt-4">Chargement du restaurant...</p>
        </div>
      </Layout>
    );
  }
  
  if (error || !restaurant) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Erreur</h2>
            <p className="mt-2">Ce restaurant n'a pas pu être chargé.</p>
            <Button asChild className="mt-4">
              <Link to="/">Retour à l'accueil</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  const businessHours = restaurant.business_hours as BusinessHours;
  
  return (
    <Layout backLink="/" backText="Retour aux restaurants">
      <div className="container mx-auto px-4 py-8">
        <div className="relative rounded-xl overflow-hidden h-56 mb-6">
          {restaurant.banner_image_url ? (
            <img
              src={restaurant.banner_image_url}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{restaurant.name}</span>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex items-center">
              {restaurant.logo_url && (
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white mr-3">
                  <img
                    src={restaurant.logo_url}
                    alt={`Logo de ${restaurant.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-white">{restaurant.name}</h1>
                <div className="flex items-center space-x-2 text-white/90">
                  <Badge variant={restaurant.is_open ? "success" : "destructive"} className="text-xs">
                    {restaurant.is_open ? 'Ouvert' : 'Fermé'}
                  </Badge>
                  {restaurant.average_rating > 0 && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span>{restaurant.average_rating.toFixed(1)}</span>
                      {restaurant.total_ratings > 0 && (
                        <span className="text-xs ml-1">({restaurant.total_ratings})</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="md:col-span-3">
            <CardContent className="p-6">
              <p className="text-gray-700 mb-4">{restaurant.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                  <p className="text-gray-700">{restaurant.address}</p>
                </div>
                
                {restaurant.phone && (
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-500 mr-2" />
                    <p className="text-gray-700">{restaurant.phone}</p>
                  </div>
                )}
                
                {restaurant.email && (
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-500 mr-2" />
                    <p className="text-gray-700">{restaurant.email}</p>
                  </div>
                )}
                
                {restaurant.website && (
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-gray-500 mr-2" />
                    <a 
                      href={restaurant.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {restaurant.website}
                    </a>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Truck className="w-5 h-5 text-gray-500 mr-2" />
                  <p className="text-gray-700">
                    Livraison: {restaurant.delivery_fee === 0 
                      ? 'Gratuite' 
                      : `${restaurant.delivery_fee.toLocaleString('fr-FR')} XAF`}
                  </p>
                </div>
                
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-gray-500 mr-2" />
                  <p className="text-gray-700">
                    {"Prix: "}
                    {Array(restaurant.price_range)
                      .fill(0)
                      .map((_, i) => "₣")
                      .join("")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <Clock className="w-5 h-5 text-gray-500 mr-2" />
                <h3 className="font-semibold">Horaires d'ouverture</h3>
              </div>
              
              {businessHours && businessHours.regular && (
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lundi</span>
                    <span>{formatBusinessDay(businessHours.regular.monday)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mardi</span>
                    <span>{formatBusinessDay(businessHours.regular.tuesday)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mercredi</span>
                    <span>{formatBusinessDay(businessHours.regular.wednesday)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jeudi</span>
                    <span>{formatBusinessDay(businessHours.regular.thursday)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vendredi</span>
                    <span>{formatBusinessDay(businessHours.regular.friday)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Samedi</span>
                    <span>{formatBusinessDay(businessHours.regular.saturday)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimanche</span>
                    <span>{formatBusinessDay(businessHours.regular.sunday)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="menu" className="space-y-4">
          <TabsList>
            <TabsTrigger value="menu" className="flex items-center">
              <MenuIcon className="mr-2 h-4 w-4" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center">
              <Info className="mr-2 h-4 w-4" />
              Informations
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu" className="space-y-4">
            <RestaurantMenu restaurantId={id as string} />
          </TabsContent>
          
          <TabsContent value="info">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Informations supplémentaires</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-700">Cuisine</h4>
                    <p className="text-gray-600">
                      {Array.isArray(restaurant.cuisine_type) 
                        ? restaurant.cuisine_type.join(', ') 
                        : restaurant.cuisine_type}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700">Commande minimum</h4>
                    <p className="text-gray-600">
                      {restaurant.minimum_order > 0 
                        ? `${restaurant.minimum_order.toLocaleString('fr-FR')} XAF` 
                        : 'Aucun minimum'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700">Temps de préparation moyen</h4>
                    <p className="text-gray-600">
                      {restaurant.average_prep_time} minutes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
