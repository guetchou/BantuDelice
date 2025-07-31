import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Calendar,
  Download,
  RefreshCw,
  Eye,
  Users,
  Package,
  DollarSign,
  Clock
} from 'lucide-react';

interface AnalyticsData {
  period: string;
  totalShipments: number;
  totalRevenue: number;
  averageDeliveryTime: number;
  customerSatisfaction: number;
  activeUsers: number;
  growthRate: number;
  topCities: Array<{ city: string; shipments: number; revenue: number }>;
  shipmentTypes: Array<{ type: string; count: number; percentage: number }>;
  revenueByMonth: Array<{ month: string; revenue: number }>;
}

interface ColisAnalyticsProps {
  data?: AnalyticsData;
  onPeriodChange?: (period: string) => void;
  onExport?: () => void;
}

const ColisAnalytics: React.FC<ColisAnalyticsProps> = ({
  data,
  onPeriodChange,
  onExport
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);

  const defaultData: AnalyticsData = {
    period: '30d',
    totalShipments: 1247,
    totalRevenue: 2847500,
    averageDeliveryTime: 2.3,
    customerSatisfaction: 4.8,
    activeUsers: 342,
    growthRate: 15.2,
    topCities: [
      { city: 'Brazzaville', shipments: 456, revenue: 1200000 },
      { city: 'Pointe-Noire', shipments: 389, revenue: 980000 },
      { city: 'Dolisie', shipments: 234, revenue: 520000 },
      { city: 'N\'kayi', shipments: 168, revenue: 380000 }
    ],
    shipmentTypes: [
      { type: 'National', count: 892, percentage: 71.5 },
      { type: 'International', count: 355, percentage: 28.5 }
    ],
    revenueByMonth: [
      { month: 'Jan', revenue: 2100000 },
      { month: 'Fév', revenue: 1950000 },
      { month: 'Mar', revenue: 2200000 },
      { month: 'Avr', revenue: 2400000 },
      { month: 'Mai', revenue: 2600000 },
      { month: 'Juin', revenue: 2847500 }
    ]
  };

  const analyticsData = data || defaultData;

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    onPeriodChange?.(period);
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const getGrowthIcon = (rate: number) => {
    return rate > 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getGrowthColor = (rate: number) => {
    return rate > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header avec contrôles */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Analytics & Rapports</h2>
          <p className="text-gray-600">Données et insights de votre activité</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 jours</SelectItem>
              <SelectItem value="30d">30 jours</SelectItem>
              <SelectItem value="90d">90 jours</SelectItem>
              <SelectItem value="1y">1 an</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
            className="border-orange-300 text-orange-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="border-blue-300 text-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Expéditions</p>
                <p className="text-2xl font-bold text-blue-800">
                  {analyticsData.totalShipments.toLocaleString('fr-FR')}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {getGrowthIcon(analyticsData.growthRate)}
                  <span className={`text-sm font-medium ${getGrowthColor(analyticsData.growthRate)}`}>
                    +{analyticsData.growthRate}%
                  </span>
                </div>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Revenus Totaux</p>
                <p className="text-2xl font-bold text-green-800">
                  {analyticsData.totalRevenue.toLocaleString('fr-FR')} FCFA
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {getGrowthIcon(12.5)}
                  <span className="text-sm font-medium text-green-600">+12.5%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Temps de Livraison</p>
                <p className="text-2xl font-bold text-orange-800">
                  {analyticsData.averageDeliveryTime} jours
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">-8.2%</span>
                </div>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Satisfaction Client</p>
                <p className="text-2xl font-bold text-purple-800">
                  {analyticsData.customerSatisfaction}/5
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">+2.1%</span>
                </div>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques et tableaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenus par mois */}
        <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <BarChart3 className="h-5 w-5 text-orange-500" />
              Évolution des revenus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {analyticsData.revenueByMonth.map((item, index) => {
                const maxRevenue = Math.max(...analyticsData.revenueByMonth.map(r => r.revenue));
                const height = (item.revenue / maxRevenue) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-orange-400 to-orange-300 rounded-t transition-all duration-500"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-gray-500 mt-2">{item.month}</span>
                    <span className="text-xs text-gray-600 font-medium">
                      {(item.revenue / 1000000).toFixed(1)}M
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Types d'expédition */}
        <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <PieChart className="h-5 w-5 text-blue-500" />
              Répartition par type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.shipmentTypes.map((type, index) => (
                <div key={type.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${
                      index === 0 ? 'bg-orange-500' : 'bg-blue-500'
                    }`} />
                    <span className="text-sm font-medium text-gray-700">{type.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{type.count}</span>
                    <Badge className="bg-gray-100 text-gray-700 text-xs">
                      {type.percentage}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top villes */}
      <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Users className="h-5 w-5 text-green-500" />
            Top villes par activité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analyticsData.topCities.map((city, index) => (
              <div key={city.city} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">{city.city}</span>
                  <Badge className={`text-xs ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    index === 2 ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    #{index + 1}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    {city.shipments.toLocaleString('fr-FR')} expéditions
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {city.revenue.toLocaleString('fr-FR')} FCFA
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights et recommandations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-green-800 mb-3">Insights positifs</h3>
            <ul className="space-y-2 text-sm text-green-700">
              <li>• Croissance de 15.2% des expéditions ce mois</li>
              <li>• Satisfaction client en hausse de 2.1%</li>
              <li>• Temps de livraison réduit de 8.2%</li>
              <li>• 342 utilisateurs actifs ce mois</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-orange-800 mb-3">Recommandations</h3>
            <ul className="space-y-2 text-sm text-orange-700">
              <li>• Développer les services express</li>
              <li>• Améliorer la couverture à N'kayi</li>
              <li>• Lancer des promotions saisonnières</li>
              <li>• Optimiser les routes de livraison</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ColisAnalytics; 