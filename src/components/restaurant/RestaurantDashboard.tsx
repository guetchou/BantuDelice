
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from '@/hooks/use-toast';
import { useRestaurantData } from '@/hooks/useRestaurantData';
import { 
  TrendingUp, BarChart2, PieChart, Settings, 
  Utensils, Book, Calendar, Users, AlertCircle, CheckCircle2,
  ChevronDown, ChevronUp, DollarSign, Clock, RefreshCcw, ShoppingCart
} from 'lucide-react';
import EnhancedMenuView from './EnhancedMenuView';
import AdvancedAnalytics from './AdvancedAnalytics';

interface RestaurantDashboardProps {
  restaurantId: string;
}

const RestaurantDashboard: React.FC<RestaurantDashboardProps> = ({ restaurantId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const { useRestaurant, useMenuItems, useManageItemAvailability } = useRestaurantData();
  
  const { data: restaurant, isLoading: restaurantLoading } = useRestaurant(restaurantId);
  const { data: menuItems, isLoading: menuLoading } = useMenuItems(restaurantId);
  const { mutate: updateItemAvailability } = useManageItemAvailability();
  
  const isLoading = restaurantLoading || menuLoading;
  
  // Calcul de quelques métriques simples
  const totalMenuItems = menuItems?.length || 0;
  const availableItems = menuItems?.filter(item => item.available).length || 0;
  const unavailableItems = totalMenuItems - availableItems;
  
  // Simulation des données d'aujourd'hui
  const todayStats = {
    orders: Math.floor(Math.random() * 30) + 20,
    revenue: (Math.floor(Math.random() * 400) + 150) * 1000,
    newCustomers: Math.floor(Math.random() * 10) + 5,
    averageRating: 4 + Math.random()
  };
  
  // Simulation des données de tendance
  const trendData = {
    ordersTrend: Math.random() > 0.5 ? Math.random() * 15 : -Math.random() * 10,
    revenueTrend: Math.random() > 0.6 ? Math.random() * 20 : -Math.random() * 15,
    customersTrend: Math.random() > 0.7 ? Math.random() * 12 : -Math.random() * 8
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }
  
  if (!restaurant) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-xl font-medium mb-2">Restaurant non trouvé</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Impossible de charger les informations du restaurant. Veuillez vérifier l'identifiant ou réessayer ultérieurement.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  const toggleItemAvailability = (itemId: string, currentStatus: boolean) => {
    updateItemAvailability({ itemId, available: !currentStatus });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <p className="text-muted-foreground">Tableau de bord de gestion</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge 
            variant={restaurant.is_open ? "success" : "destructive"}
            className="text-xs px-2 py-1 h-6"
          >
            {restaurant.is_open ? 'Ouvert' : 'Fermé'}
          </Badge>
          
          <Button variant="outline" size="sm" className="h-9 gap-1">
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline">Paramètres</span>
          </Button>
        </div>
      </div>
      
      {/* Métriques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Commandes aujourd'hui</p>
                <p className="text-2xl font-bold">{todayStats.orders}</p>
              </div>
              <div className={`rounded-full p-3 ${
                trendData.ordersTrend >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <ShoppingCart className={`h-5 w-5 ${
                  trendData.ordersTrend >= 0 ? 'text-green-700' : 'text-red-700'
                }`} />
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs mt-2">
              {trendData.ordersTrend >= 0 ? 
                <ChevronUp className="h-3 w-3 text-green-700" /> : 
                <ChevronDown className="h-3 w-3 text-red-700" />
              }
              <span className={
                trendData.ordersTrend >= 0 ? 'text-green-700' : 'text-red-700'
              }>
                {Math.abs(trendData.ordersTrend).toFixed(1)}% vs hier
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chiffre d'affaires</p>
                <p className="text-2xl font-bold">{todayStats.revenue.toLocaleString('fr-FR')} FCFA</p>
              </div>
              <div className={`rounded-full p-3 ${
                trendData.revenueTrend >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <DollarSign className={`h-5 w-5 ${
                  trendData.revenueTrend >= 0 ? 'text-green-700' : 'text-red-700'
                }`} />
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs mt-2">
              {trendData.revenueTrend >= 0 ? 
                <ChevronUp className="h-3 w-3 text-green-700" /> : 
                <ChevronDown className="h-3 w-3 text-red-700" />
              }
              <span className={
                trendData.revenueTrend >= 0 ? 'text-green-700' : 'text-red-700'
              }>
                {Math.abs(trendData.revenueTrend).toFixed(1)}% vs hier
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Temps moyen de préparation</p>
                <p className="text-2xl font-bold">{restaurant.average_prep_time || "25"} min</p>
              </div>
              <div className="rounded-full p-3 bg-amber-100">
                <Clock className="h-5 w-5 text-amber-700" />
              </div>
            </div>
            <div className="text-xs mt-2 text-muted-foreground">
              Basé sur les 30 dernières commandes
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Disponibilité du menu</p>
                <p className="text-2xl font-bold">{availableItems}/{totalMenuItems}</p>
              </div>
              <div className="rounded-full p-3 bg-blue-100">
                <Utensils className="h-5 w-5 text-blue-700" />
              </div>
            </div>
            <div className="text-xs mt-2 text-muted-foreground">
              {unavailableItems} articles non disponibles
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 w-full">
          <TabsTrigger value="overview" className="flex gap-2 items-center">
            <BarChart2 className="h-4 w-4" />
            Aperçu
          </TabsTrigger>
          <TabsTrigger value="menu" className="flex gap-2 items-center">
            <Book className="h-4 w-4" />
            Menu
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex gap-2 items-center">
            <PieChart className="h-4 w-4" />
            Analytiques
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex gap-2 items-center">
            <ShoppingCart className="h-4 w-4" />
            Commandes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Aperçu du restaurant</CardTitle>
              <CardDescription>
                Vue d'ensemble des performances de votre restaurant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Informations générales</h3>
                    <dl className="space-y-3">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Adresse</dt>
                        <dd className="font-medium">{restaurant.address}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Téléphone</dt>
                        <dd className="font-medium">{restaurant.phone}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Email</dt>
                        <dd className="font-medium">{restaurant.email}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Type de cuisine</dt>
                        <dd className="font-medium">
                          {Array.isArray(restaurant.cuisine_type) 
                            ? restaurant.cuisine_type.join(', ') 
                            : restaurant.cuisine_type}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Prix moyen</dt>
                        <dd className="font-medium">
                          {Array(restaurant.price_range).fill("₣").join("")}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Statistiques rapides</h3>
                    <dl className="space-y-3">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Commandes totales (mois)</dt>
                        <dd className="font-medium">{Math.floor(Math.random() * 300) + 150}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Note moyenne</dt>
                        <dd className="font-medium flex items-center">
                          {restaurant.average_rating || 4.5}
                          <span className="ml-1 text-yellow-500">
                            <Star className="h-4 w-4 inline" />
                          </span>
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Délai de livraison</dt>
                        <dd className="font-medium">{restaurant.estimated_delivery_time || 35} min</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Nombre d'articles au menu</dt>
                        <dd className="font-medium">{totalMenuItems}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Commande minimum</dt>
                        <dd className="font-medium">
                          {restaurant.minimum_order ? `${restaurant.minimum_order.toLocaleString('fr-FR')} FCFA` : 'Aucun minimum'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Alertes et notifications</h3>
                  
                  <div className="space-y-2">
                    {unavailableItems > 0 && (
                      <Card className="bg-amber-50">
                        <CardContent className="p-4 flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-amber-800">
                              {unavailableItems} articles marqués comme indisponibles
                            </p>
                            <p className="text-sm text-amber-700 mt-0.5">
                              Cela pourrait affecter les commandes et la satisfaction des clients.
                            </p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2 bg-white border-amber-300 text-amber-800"
                              onClick={() => setActiveTab('menu')}
                            >
                              Gérer le menu
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    <Card className="bg-blue-50">
                      <CardContent className="p-4 flex items-start gap-3">
                        <RefreshCcw className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-800">
                            Mise à jour des données analytiques disponible
                          </p>
                          <p className="text-sm text-blue-700 mt-0.5">
                            Les nouvelles données de performances sont prêtes à être consultées.
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2 bg-white border-blue-300 text-blue-800"
                            onClick={() => setActiveTab('analytics')}
                          >
                            Voir les analytiques
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="menu" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Gestion du menu</CardTitle>
                  <CardDescription>
                    {totalMenuItems} articles dont {availableItems} disponibles
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un article
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <EnhancedMenuView 
                restaurantId={restaurantId}
                mode="manager"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <AdvancedAnalytics restaurantId={restaurantId} />
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des commandes</CardTitle>
              <CardDescription>
                Suivi et gestion des commandes en cours et passées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>Fonctionnalité en cours de développement</p>
                <p className="text-sm mt-2">Cette section sera bientôt disponible</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Star = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
      clipRule="evenodd"
    />
  </svg>
);

export default RestaurantDashboard;
