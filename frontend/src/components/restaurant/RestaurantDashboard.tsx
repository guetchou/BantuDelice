
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMenuEnhanced } from '@/hooks/useMenuEnhanced';
import { useRestaurant } from '@/components/restaurant/useRestaurant';
import RestaurantAnalytics from '@/components/restaurant/RestaurantAnalytics';
import MenuOptimizer from '@/components/restaurant/MenuOptimizer';
import RestaurantMenu from '@/components/restaurant/RestaurantMenu';
import { Gauge, Calendar, PieChart, FileText, Settings, LayoutDashboard } from 'lucide-react';

interface RestaurantDashboardProps {
  restaurantId: string;
}

const RestaurantDashboard: React.FC<RestaurantDashboardProps> = ({ restaurantId }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { data: restaurant, isLoading: restaurantLoading } = useRestaurant(restaurantId);
  const { menuAnalysis, isLoading: menuLoading } = useMenuEnhanced(restaurantId);

  if (restaurantLoading || menuLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-2">Chargement des données...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Restaurant non trouvé</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <p className="text-muted-foreground">{restaurant.address}</p>
        </div>
        <div className="grid grid-cols-2 md:flex gap-2">
          <Card className="bg-primary/10 p-2">
            <div className="flex gap-2 items-center">
              <Gauge className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">Score: {restaurant.average_rating?.toFixed(1) || "N/A"}</span>
            </div>
          </Card>
          <Card className="bg-primary/10 p-2">
            <div className="flex gap-2 items-center">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">
                {restaurant.is_open ? "Ouvert" : "Fermé"}
              </span>
            </div>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList className="grid grid-cols-3 md:grid-cols-5 md:w-auto">
            <TabsTrigger value="overview" className="flex items-center justify-center md:justify-start gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden md:inline">Vue d'ensemble</span>
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex items-center justify-center md:justify-start gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Menu</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center justify-center md:justify-start gap-2">
              <PieChart className="h-4 w-4" />
              <span className="hidden md:inline">Analyses</span>
            </TabsTrigger>
            <TabsTrigger value="optimizer" className="flex items-center justify-center md:justify-start gap-2">
              <Gauge className="h-4 w-4" />
              <span className="hidden md:inline">Optimisation</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center justify-center md:justify-start gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">Paramètres</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Résumé du restaurant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <h3 className="text-2xl font-bold">{menuAnalysis?.totalItems || 0}</h3>
                    <p className="text-sm text-muted-foreground">Plats au menu</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <h3 className="text-2xl font-bold">{menuAnalysis?.priceStats?.average.toFixed(0) || 0} FCFA</h3>
                    <p className="text-sm text-muted-foreground">Prix moyen</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <h3 className="text-2xl font-bold">{menuAnalysis?.dietaryOptions?.vegetarianPercentage.toFixed(0) || 0}%</h3>
                    <p className="text-sm text-muted-foreground">Options végétariennes</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm">Suggestions d'amélioration</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <ul className="space-y-2">
                    {menuAnalysis?.menuSuggestions?.map((suggestion, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{suggestion.message}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu">
          <RestaurantMenu restaurantId={restaurantId} />
        </TabsContent>

        <TabsContent value="analytics">
          <RestaurantAnalytics restaurantId={restaurantId} />
        </TabsContent>

        <TabsContent value="optimizer">
          <MenuOptimizer restaurantId={restaurantId} />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du restaurant</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Configuration avancée du restaurant (à venir)
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RestaurantDashboard;
