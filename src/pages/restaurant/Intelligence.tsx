
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from '@/components/Layout';
import RestaurantAnalytics from '@/components/restaurant/RestaurantAnalytics';
import RestaurantOptimizer from '@/components/restaurant/RestaurantOptimizer';
import MenuManagement from '@/components/restaurant/MenuManagement';
import { useRestaurantData } from '@/hooks/useRestaurantData';
import { Brain, ChartBarIcon, PieChart, TrendingUp, Zap, Sparkles, BookOpen } from 'lucide-react';

const RestaurantIntelligence = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('analytics');
  
  const { useRestaurant } = useRestaurantData();
  const { data: restaurant, isLoading, error } = useRestaurant(id);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !restaurant) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h2 className="text-2xl font-bold text-red-600 mb-2">Erreur</h2>
              <p className="text-gray-500">Impossible de charger les informations du restaurant.</p>
              <Button className="mt-4" onClick={() => window.history.back()}>
                Retour
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{restaurant.name}</h1>
            <p className="text-gray-500">Intelligence et optimisation avancée</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => window.history.back()}>
              Retour
            </Button>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Brain className="h-7 w-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Intelligence</h3>
                  <p className="text-sm text-gray-500">
                    Analysez vos données et obtenez des insights stratégiques
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                  <Sparkles className="h-7 w-7 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Optimisation</h3>
                  <p className="text-sm text-gray-500">
                    Optimisez vos opérations avec des algorithmes avancés
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-7 w-7 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Croissance</h3>
                  <p className="text-sm text-gray-500">
                    Des stratégies personnalisées pour développer votre activité
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full">
            <TabsTrigger value="analytics" className="flex gap-2 items-center">
              <PieChart className="h-4 w-4" />
              Analytiques
            </TabsTrigger>
            <TabsTrigger value="optimizer" className="flex gap-2 items-center">
              <Zap className="h-4 w-4" />
              Optimiseur IA
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex gap-2 items-center">
              <BookOpen className="h-4 w-4" />
              Gestion du Menu
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics">
            <RestaurantAnalytics restaurantId={id || ''} />
          </TabsContent>
          
          <TabsContent value="optimizer">
            <RestaurantOptimizer restaurantId={id || ''} />
          </TabsContent>
          
          <TabsContent value="menu">
            <MenuManagement restaurantId={id || ''} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default RestaurantIntelligence;
