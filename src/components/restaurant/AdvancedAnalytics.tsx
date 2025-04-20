import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRestaurantData } from '@/hooks/useRestaurantData';
import {
  AreaChart,
  BarChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  BarChart2,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  DollarSign,
  ShoppingBag,
  Users,
  Utensils,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';

const COLORS = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#6B7280'];

interface AdvancedAnalyticsProps {
  restaurantId: string;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ restaurantId }) => {
  const [timePeriod, setTimePeriod] = useState<'day' | 'week' | 'month'>('week');
  const { useRestaurantPerformance, useOptimizePricing, useMenuRecommendations } = useRestaurantData();
  
  const { data: performance, isLoading: performanceLoading } = useRestaurantPerformance(restaurantId, timePeriod);
  const { data: pricingOptimization, isLoading: pricingLoading } = useOptimizePricing(restaurantId);
  const { data: menuRecommendations, isLoading: menuRecsLoading } = useMenuRecommendations(restaurantId);
  
  const isLoading = performanceLoading || pricingLoading || menuRecsLoading;
  
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Analyse des données en cours...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold">Analyse Avancée</h2>
        
        <Select value={timePeriod} onValueChange={(value: 'day' | 'week' | 'month') => setTimePeriod(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner une période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Dernières 24 heures</SelectItem>
            <SelectItem value="week">Dernière semaine</SelectItem>
            <SelectItem value="month">Dernier mois</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {performance && (
        <>
          {/* Résumé des performances */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Chiffre d'affaires</p>
                    <p className="text-2xl font-bold">
                      {performance.summary.totalRevenue.toLocaleString('fr-FR')} FCFA
                    </p>
                  </div>
                  <div className={`rounded-full p-3 ${
                    parseFloat(performance.summary.revenueGrowth) >= 0 
                      ? 'bg-green-100' 
                      : 'bg-red-100'
                  }`}>
                    {parseFloat(performance.summary.revenueGrowth) >= 0 ? (
                      <TrendingUp className={`h-5 w-5 text-green-700`} />
                    ) : (
                      <TrendingDown className={`h-5 w-5 text-red-700`} />
                    )}
                  </div>
                </div>
                <div className={`text-xs mt-2 ${
                  parseFloat(performance.summary.revenueGrowth) >= 0 
                    ? 'text-green-700' 
                    : 'text-red-700'
                }`}>
                  {parseFloat(performance.summary.revenueGrowth) >= 0 ? '+' : ''}
                  {performance.summary.revenueGrowth}% vs période précédente
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Commandes</p>
                    <p className="text-2xl font-bold">
                      {performance.summary.totalOrders}
                    </p>
                  </div>
                  <div className="rounded-full p-3 bg-blue-100">
                    <ShoppingBag className="h-5 w-5 text-blue-700" />
                  </div>
                </div>
                <div className="text-xs mt-2 text-blue-700">
                  {(performance.summary.totalOrders / performance.period.days).toFixed(1)} commandes / jour
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Panier moyen</p>
                    <p className="text-2xl font-bold">
                      {performance.summary.averageOrderValue.toLocaleString('fr-FR')} FCFA
                    </p>
                  </div>
                  <div className="rounded-full p-3 bg-purple-100">
                    <DollarSign className="h-5 w-5 text-purple-700" />
                  </div>
                </div>
                <div className="text-xs mt-2 text-muted-foreground">
                  Par commande
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Heures de pointe</p>
                    <p className="text-2xl font-bold">
                      {performance.peakHours[0]?.hour || 'N/A'}
                    </p>
                  </div>
                  <div className="rounded-full p-3 bg-amber-100">
                    <Clock className="h-5 w-5 text-amber-700" />
                  </div>
                </div>
                <div className="text-xs mt-2 text-muted-foreground">
                  {performance.peakHours[0]?.orders || 0} commandes
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Graphiques de ventes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Revenus journaliers</CardTitle>
                <CardDescription>
                  Évolution du chiffre d'affaires sur la période
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={performance.dailyData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => {
                          const d = new Date(date);
                          return `${d.getDate()}/${d.getMonth() + 1}`;
                        }} 
                      />
                      <YAxis 
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`${value.toLocaleString('fr-FR')} FCFA`, 'Revenu']}
                        labelFormatter={(date) => {
                          const d = new Date(date);
                          const options: Intl.DateTimeFormatOptions = { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          };
                          return d.toLocaleDateString('fr-FR', options);
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#8B5CF6" 
                        fill="#8B5CF680" 
                        name="Revenu" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Heures de pointe</CardTitle>
                <CardDescription>
                  Distribution des commandes par heure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={performance.peakHours}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => [value, 'Commandes']}
                      />
                      <Bar 
                        dataKey="orders" 
                        fill="#8B5CF6" 
                        name="Commandes" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Articles les plus vendus</CardTitle>
                <CardDescription>
                  Répartition des ventes par article
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={performance.topItems}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="orders"
                        nameKey="name"
                      >
                        {performance.topItems.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [value, 'Commandes']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Insights et recommandations */}
          <Card>
            <CardHeader>
              <CardTitle>Insights et recommandations</CardTitle>
              <CardDescription>
                Analyse des tendances et recommandations pour améliorer vos performances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performance.insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-4 border-b pb-4 last:border-0">
                    <div className="rounded-full p-2 bg-primary/10">
                      {index === 0 ? (
                        <Clock className="h-5 w-5 text-primary" />
                      ) : index === 1 ? (
                        <ThumbsUp className="h-5 w-5 text-primary" />
                      ) : (
                        <TrendingUp className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                      <p className="text-sm text-primary mt-2">
                        <strong>Recommandation:</strong> {insight.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
      
      {/* Optimisation des prix */}
      {pricingOptimization && pricingOptimization.recommendations.length > 0 && (
        <Card className="border-primary/30">
          <CardHeader className="bg-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Optimisation des prix</CardTitle>
                <CardDescription>
                  Recommandations pour ajuster vos prix et maximiser les revenus
                </CardDescription>
              </div>
              <Badge className="bg-primary hover:bg-primary/90">
                {pricingOptimization.recommendations.length} recommandations
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {pricingOptimization.recommendations.slice(0, 5).map((recommendation, index) => (
                <div key={index} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 last:border-0">
                  <div className="flex-1">
                    <h4 className="font-medium">{recommendation.name}</h4>
                    <p className="text-sm text-muted-foreground">{recommendation.reasoning}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">Prix actuel:</span>
                        <span className="text-sm ml-1">{recommendation.currentPrice.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">Prix recommandé:</span>
                        <span className={`text-sm ml-1 ${
                          recommendation.priceDifference > 0 ? 'text-green-600' : 'text-amber-600'
                        }`}>
                          {recommendation.recommendedPrice.toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`
                      ${recommendation.priceDifference > 0 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}
                    `}>
                      {recommendation.percentageChange}
                    </Badge>
                    <Button size="sm">
                      Appliquer
                    </Button>
                  </div>
                </div>
              ))}
              
              {pricingOptimization.recommendations.length > 5 && (
                <Button variant="outline" className="w-full mt-2">
                  Voir les {pricingOptimization.recommendations.length - 5} autres recommandations
                </Button>
              )}
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 flex justify-between">
            <div>
              <span className="text-sm font-medium">Impact potentiel:</span>
              <span className="text-sm ml-2 text-green-600">
                +{formatPrice(priceChangeStats.potentialRevenueIncrease || 0)}
              </span>
            </div>
            <Button>
              Appliquer toutes les recommandations
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Recommandations de menu */}
      {menuRecommendations && menuRecommendations.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommandations pour votre menu</CardTitle>
            <CardDescription>
              Suggestions pour améliorer la composition et l'équilibre de votre menu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {menuRecommendations.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-4 border-b pb-4 last:border-0">
                  <div className={`rounded-full p-2 ${
                    recommendation.priority === 'high'
                      ? 'bg-red-100'
                      : recommendation.priority === 'medium'
                        ? 'bg-amber-100'
                        : 'bg-blue-100'
                  }`}>
                    <AlertCircle className={`h-5 w-5 ${
                      recommendation.priority === 'high'
                        ? 'text-red-700'
                        : recommendation.priority === 'medium'
                          ? 'text-amber-700'
                          : 'text-blue-700'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{recommendation.title}</h4>
                      <Badge variant={recommendation.priority === 'high' ? 'destructive' : 'outline'}>
                        {recommendation.priority === 'high' ? 'Haute priorité' : 
                          recommendation.priority === 'medium' ? 'Priorité moyenne' : 'Suggestion'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {recommendation.description}
                    </p>
                    <p className="text-sm text-primary mt-2">
                      <strong>Impact potentiel:</strong> {recommendation.impact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedAnalytics;
