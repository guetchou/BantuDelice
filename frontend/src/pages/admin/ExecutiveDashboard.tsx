import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Users, 
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Target,
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ExecutiveMetrics {
  revenue: {
    current: number;
    previous: number;
    growth: number;
    trend: 'up' | 'down' | 'stable';
  };
  orders: {
    current: number;
    previous: number;
    growth: number;
    trend: 'up' | 'down' | 'stable';
  };
  customers: {
    current: number;
    previous: number;
    growth: number;
    trend: 'up' | 'down' | 'stable';
  };
  deliveryPerformance: {
    averageTime: number;
    onTimeRate: number;
    trend: 'up' | 'down' | 'stable';
  };
  topProducts: Array<{
    name: string;
    revenue: number;
    orders: number;
    growth: number;
  }>;
  topRestaurants: Array<{
    name: string;
    revenue: number;
    orders: number;
    rating: number;
  }>;
  regionalPerformance: Array<{
    region: string;
    revenue: number;
    orders: number;
    growth: number;
  }>;
  predictions: {
    nextMonthRevenue: number;
    nextMonthOrders: number;
    confidence: number;
  };
}

const ExecutiveDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [metrics, setMetrics] = useState<ExecutiveMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - En production, cela viendrait de l'API
  const mockMetrics: ExecutiveMetrics = {
    revenue: {
      current: 12500000,
      previous: 11800000,
      growth: 5.9,
      trend: 'up'
    },
    orders: {
      current: 2847,
      previous: 2654,
      growth: 7.3,
      trend: 'up'
    },
    customers: {
      current: 1247,
      previous: 1189,
      growth: 4.9,
      trend: 'up'
    },
    deliveryPerformance: {
      averageTime: 28,
      onTimeRate: 94.2,
      trend: 'up'
    },
    topProducts: [
      { name: 'Poulet Braisé', revenue: 2850000, orders: 456, growth: 12.5 },
      { name: 'Poisson Braisé', revenue: 2240000, orders: 389, growth: 8.7 },
      { name: 'Maboké', revenue: 1980000, orders: 312, growth: 15.2 },
      { name: 'Saka-Saka', revenue: 1650000, orders: 298, growth: 6.8 },
      { name: 'Foufou', revenue: 1420000, orders: 267, growth: 9.3 }
    ],
    topRestaurants: [
      { name: 'Le Gourmet Congolais', revenue: 2850000, orders: 456, rating: 4.8 },
      { name: 'Chez Mama', revenue: 2240000, orders: 389, rating: 4.6 },
      { name: 'Restaurant Brazza', revenue: 1980000, orders: 312, rating: 4.7 },
      { name: 'Le Petit Paris', revenue: 1650000, orders: 298, rating: 4.5 },
      { name: 'Cuisine Traditionnelle', revenue: 1420000, orders: 267, rating: 4.4 }
    ],
    regionalPerformance: [
      { region: 'Brazzaville Centre', revenue: 4850000, orders: 987, growth: 8.2 },
      { region: 'Pointe-Noire', revenue: 3240000, orders: 654, growth: 12.1 },
      { region: 'Dolisie', revenue: 1980000, orders: 423, growth: 6.8 },
      { region: 'Nkayi', revenue: 1240000, orders: 287, growth: 4.5 },
      { region: 'Autres', revenue: 1190000, orders: 496, growth: 3.2 }
    ],
    predictions: {
      nextMonthRevenue: 13800000,
      nextMonthOrders: 3150,
      confidence: 87.5
    }
  };

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setMetrics(mockMetrics);
      setIsLoading(false);
    }, 1000);
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Chargement du tableau de bord exécutif...</span>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tableau de Bord Exécutif</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble stratégique et prédictions business
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 derniers jours</SelectItem>
              <SelectItem value="30d">30 derniers jours</SelectItem>
              <SelectItem value="90d">90 derniers jours</SelectItem>
              <SelectItem value="1y">Année</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPIs Principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.revenue.current)}</div>
            <div className={`flex items-center text-sm ${getTrendColor(metrics.revenue.trend)}`}>
              {getTrendIcon(metrics.revenue.trend)}
              <span className="ml-1">+{metrics.revenue.growth}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.orders.current.toLocaleString()}</div>
            <div className={`flex items-center text-sm ${getTrendColor(metrics.orders.trend)}`}>
              {getTrendIcon(metrics.orders.trend)}
              <span className="ml-1">+{metrics.orders.growth}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.customers.current.toLocaleString()}</div>
            <div className={`flex items-center text-sm ${getTrendColor(metrics.customers.trend)}`}>
              {getTrendIcon(metrics.customers.trend)}
              <span className="ml-1">+{metrics.customers.growth}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Livraison</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.deliveryPerformance.onTimeRate}%</div>
            <div className="text-sm text-muted-foreground">
              {metrics.deliveryPerformance.averageTime} min en moyenne
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prédictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Prédictions IA - Prochain Mois
          </CardTitle>
          <CardDescription>
            Prédictions basées sur l'analyse des tendances et l'IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(metrics.predictions.nextMonthRevenue)}
              </div>
              <div className="text-sm text-muted-foreground">Revenus Prédits</div>
              <Badge variant="secondary" className="mt-2">
                Confiance: {metrics.predictions.confidence}%
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {metrics.predictions.nextMonthOrders.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Commandes Prédites</div>
              <Badge variant="secondary" className="mt-2">
                +{((metrics.predictions.nextMonthOrders - metrics.orders.current) / metrics.orders.current * 100).toFixed(1)}%
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {((metrics.predictions.nextMonthRevenue - metrics.revenue.current) / metrics.revenue.current * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Croissance Prédite</div>
              <Badge variant="outline" className="mt-2">
                <TrendingUp className="w-3 h-3 mr-1" />
                Tendance Positive
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Graphiques */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Évolution Revenus</TabsTrigger>
          <TabsTrigger value="products">Top Produits</TabsTrigger>
          <TabsTrigger value="regions">Performance Régionale</TabsTrigger>
          <TabsTrigger value="restaurants">Top Restaurants</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[
                  { month: 'Jan', revenue: 8500000 },
                  { month: 'Fév', revenue: 9200000 },
                  { month: 'Mar', revenue: 9800000 },
                  { month: 'Avr', revenue: 10500000 },
                  { month: 'Mai', revenue: 11200000 },
                  { month: 'Juin', revenue: 11800000 },
                  { month: 'Juil', revenue: 12500000 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Line type="monotone" dataKey="revenue" stroke="#00C49A" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Produits par Revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metrics.topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="revenue" fill="#00C49A" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance par Région</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={metrics.regionalPerformance}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ region, percent }) => `${region} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenue"
                  >
                    {metrics.regionalPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#00C49A', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restaurants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Restaurants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.topRestaurants.map((restaurant, index) => (
                  <div key={restaurant.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{restaurant.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {restaurant.orders} commandes • ⭐ {restaurant.rating}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(restaurant.revenue)}</div>
                      <div className="text-sm text-muted-foreground">
                        {((restaurant.revenue / metrics.revenue.current) * 100).toFixed(1)}% du CA
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Alertes et Recommandations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Alertes et Recommandations IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-semibold text-green-800">Performance Excellente</div>
                <div className="text-sm text-green-700">
                  Croissance de {metrics.revenue.growth}% ce mois. Recommandation: Maintenir la stratégie marketing actuelle.
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-semibold text-yellow-800">Opportunité d'Amélioration</div>
                <div className="text-sm text-yellow-700">
                  La région "Autres" a une croissance faible (3.2%). Recommandation: Développer la présence dans ces zones.
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Target className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-semibold text-blue-800">Prédiction IA</div>
                <div className="text-sm text-blue-700">
                  Prédiction de croissance de {((metrics.predictions.nextMonthRevenue - metrics.revenue.current) / metrics.revenue.current * 100).toFixed(1)}% le mois prochain. 
                  Recommandation: Préparer l'équipe pour la hausse de demande.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveDashboard; 