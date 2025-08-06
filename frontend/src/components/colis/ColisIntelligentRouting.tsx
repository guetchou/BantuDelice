import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Fuel, 
  Car, 
  Users, 
  Package, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Settings,
  RefreshCw,
  Play,
  Pause,
  Eye,
  BarChart3,
  Thermometer,
  Cloud,
  Wind,
  Sun,
  CloudRain,
  Zap,
  Target,
  Route,
  Compass,
  Globe,
  Smartphone,
  Wifi,
  Signal,
  Activity,
  Gauge,
  Timer,
  DollarSign,
  ArrowRight
} from 'lucide-react';

interface RouteOptimization {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'optimizing' | 'completed' | 'error';
  currentRoute: RouteInfo;
  optimizedRoute: RouteInfo;
  improvements: RouteImprovement[];
  factors: OptimizationFactor[];
  lastUpdated: string;
}

interface RouteInfo {
  distance: number;
  duration: number;
  fuelCost: number;
  tolls: number;
  stops: number;
  waypoints: Waypoint[];
}

interface Waypoint {
  id: string;
  name: string;
  coordinates: [number, number];
  type: 'pickup' | 'delivery' | 'waypoint';
  estimatedTime: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface RouteImprovement {
  type: 'time' | 'cost' | 'efficiency' | 'safety';
  value: number;
  unit: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

interface OptimizationFactor {
  name: string;
  weight: number;
  enabled: boolean;
  currentValue: number;
  optimalValue: number;
  unit: string;
}

interface TrafficCondition {
  level: 'low' | 'medium' | 'high' | 'severe';
  description: string;
  impact: number;
  color: string;
}

interface WeatherCondition {
  type: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  temperature: number;
  windSpeed: number;
  visibility: number;
  impact: 'positive' | 'negative' | 'neutral';
}

const ColisIntelligentRouting: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState<string>('route-1');
  const [optimizationMode, setOptimizationMode] = useState<'auto' | 'manual'>('auto');
  const [realTimeUpdates, setRealTimeUpdates] = useState<boolean>(true);

  const routeOptimizations: RouteOptimization[] = [
    {
      id: 'route-1',
      name: 'Brazzaville → Pointe-Noire',
      description: 'Route principale avec 15 points de livraison',
      status: 'active',
      currentRoute: {
        distance: 512,
        duration: 8.5,
        fuelCost: 45000,
        tolls: 15000,
        stops: 15,
        waypoints: [
          { id: '1', name: 'Brazzaville Centre', coordinates: [15.2832, -4.2634], type: 'pickup', estimatedTime: '08:00', status: 'completed' },
          { id: '2', name: 'Dolisie', coordinates: [12.6667, -4.2000], type: 'delivery', estimatedTime: '10:30', status: 'in-progress' },
          { id: '3', name: 'Nkayi', coordinates: [13.2833, -4.1833], type: 'delivery', estimatedTime: '12:15', status: 'pending' },
          { id: '4', name: 'Pointe-Noire', coordinates: [11.8667, -4.7833], type: 'delivery', estimatedTime: '16:30', status: 'pending' }
        ]
      },
      optimizedRoute: {
        distance: 498,
        duration: 7.8,
        fuelCost: 42000,
        tolls: 12000,
        stops: 15,
        waypoints: [
          { id: '1', name: 'Brazzaville Centre', coordinates: [15.2832, -4.2634], type: 'pickup', estimatedTime: '08:00', status: 'completed' },
          { id: '2', name: 'Dolisie', coordinates: [12.6667, -4.2000], type: 'delivery', estimatedTime: '10:15', status: 'in-progress' },
          { id: '3', name: 'Nkayi', coordinates: [13.2833, -4.1833], type: 'delivery', estimatedTime: '11:45', status: 'pending' },
          { id: '4', name: 'Pointe-Noire', coordinates: [11.8667, -4.7833], type: 'delivery', estimatedTime: '15:20', status: 'pending' }
        ]
      },
      improvements: [
        { type: 'time', value: 8.2, unit: '%', description: 'Réduction du temps de trajet', impact: 'high' },
        { type: 'cost', value: 6.7, unit: '%', description: 'Économies de carburant', impact: 'medium' },
        { type: 'efficiency', value: 12.5, unit: '%', description: 'Amélioration de l\'efficacité', impact: 'high' }
      ],
      factors: [
        { name: 'Trafic', weight: 0.3, enabled: true, currentValue: 65, optimalValue: 45, unit: '%' },
        { name: 'Météo', weight: 0.2, enabled: true, currentValue: 85, optimalValue: 90, unit: '%' },
        { name: 'Carburant', weight: 0.25, enabled: true, currentValue: 78, optimalValue: 85, unit: '%' },
        { name: 'Distance', weight: 0.15, enabled: true, currentValue: 92, optimalValue: 95, unit: '%' },
        { name: 'Sécurité', weight: 0.1, enabled: true, currentValue: 88, optimalValue: 90, unit: '%' }
      ],
      lastUpdated: '2024-01-15T11:30:00Z'
    }
  ];

  const trafficConditions: TrafficCondition[] = [
    { level: 'low', description: 'Circulation fluide', impact: 0, color: 'bg-green-500' },
    { level: 'medium', description: 'Trafic modéré', impact: 15, color: 'bg-yellow-500' },
    { level: 'high', description: 'Trafic dense', impact: 30, color: 'bg-orange-500' },
    { level: 'severe', description: 'Embouteillages', impact: 50, color: 'bg-red-500' }
  ];

  const weatherConditions: WeatherCondition[] = [
    { type: 'sunny', temperature: 28, windSpeed: 12, visibility: 95, impact: 'positive' },
    { type: 'cloudy', temperature: 25, windSpeed: 18, visibility: 85, impact: 'neutral' },
    { type: 'rainy', temperature: 22, windSpeed: 25, visibility: 60, impact: 'negative' },
    { type: 'stormy', temperature: 20, windSpeed: 35, visibility: 40, impact: 'negative' }
  ];

  const currentRoute = routeOptimizations.find(r => r.id === selectedRoute);
  const currentTraffic = trafficConditions[1]; // medium
  const currentWeather = weatherConditions[0]; // sunny

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><Activity className="h-3 w-3 mr-1" />Actif</Badge>;
      case 'optimizing':
        return <Badge className="bg-blue-100 text-blue-800"><RefreshCw className="h-3 w-3 mr-1 animate-spin" />Optimisation</Badge>;
      case 'completed':
        return <Badge className="bg-purple-100 text-purple-800"><CheckCircle className="h-3 w-3 mr-1" />Terminé</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Erreur</Badge>;
      default:
        return null;
    }
  };

  const getWeatherIcon = (type: string) => {
    switch (type) {
      case 'sunny':
        return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-5 w-5 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="h-5 w-5 text-blue-500" />;
      case 'stormy':
        return <CloudRain className="h-5 w-5 text-gray-700" />;
      default:
        return <Sun className="h-5 w-5" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Routage Intelligent</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Optimisez vos routes en temps réel avec l'IA, en tenant compte du trafic, 
          de la météo et des conditions routières pour maximiser l'efficacité.
        </p>
      </div>

      {/* Contrôles principaux */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex gap-4">
          <Select value={selectedRoute} onValueChange={setSelectedRoute}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Sélectionner une route" />
            </SelectTrigger>
            <SelectContent>
              {routeOptimizations.map(route => (
                <SelectItem key={route.id} value={route.id}>
                  {route.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={optimizationMode} onValueChange={(value: unknown) => setOptimizationMode(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Automatique</SelectItem>
              <SelectItem value="manual">Manuel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={realTimeUpdates}
              onCheckedChange={setRealTimeUpdates}
            />
            <Label>Mises à jour temps réel</Label>
          </div>
          <Button className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Optimiser Maintenant
          </Button>
        </div>
      </div>

      {/* Statistiques de routage */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Routes Optimisées</p>
                <p className="text-2xl font-bold text-blue-900">24/30</p>
              </div>
              <Route className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Temps Économisé</p>
                <p className="text-2xl font-bold text-green-900">-12.5%</p>
              </div>
              <Timer className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Carburant Économisé</p>
                <p className="text-2xl font-bold text-purple-900">-8.7%</p>
              </div>
              <Fuel className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Efficacité</p>
                <p className="text-2xl font-bold text-orange-900">94.2%</p>
              </div>
              <Gauge className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {currentRoute && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="optimization">Optimisation</TabsTrigger>
            <TabsTrigger value="conditions">Conditions</TabsTrigger>
            <TabsTrigger value="waypoints">Points de passage</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Comparaison des routes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5" />
                    Comparaison des Routes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Distance</p>
                        <p className="text-lg font-bold text-gray-900">
                          {currentRoute.currentRoute.distance} km
                        </p>
                        <p className="text-xs text-green-600">
                          <ArrowRight className="inline h-4 w-4 mx-1" /> {currentRoute.optimizedRoute.distance} km
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Durée</p>
                        <p className="text-lg font-bold text-gray-900">
                          {currentRoute.currentRoute.duration}h
                        </p>
                        <p className="text-xs text-green-600">
                          <ArrowRight className="inline h-4 w-4 mx-1" /> {currentRoute.optimizedRoute.duration}h
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Coût</p>
                        <p className="text-lg font-bold text-gray-900">
                          {currentRoute.currentRoute.fuelCost.toLocaleString()} FCFA
                        </p>
                        <p className="text-xs text-green-600">
                          <ArrowRight className="inline h-4 w-4 mx-1" /> {currentRoute.optimizedRoute.fuelCost.toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Péages</span>
                        <span>{currentRoute.currentRoute.tolls.toLocaleString()} <ArrowRight className="inline h-4 w-4 mx-1" /> {currentRoute.optimizedRoute.tolls.toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Arrêts</span>
                        <span>{currentRoute.currentRoute.stops} <ArrowRight className="inline h-4 w-4 mx-1" /> {currentRoute.optimizedRoute.stops}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Améliorations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Améliorations Apportées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentRoute.improvements.map((improvement, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{improvement.description}</p>
                          <p className="text-sm text-gray-500">
                            {improvement.type === 'time' && <Clock className="h-3 w-3 inline mr-1" />}
                            {improvement.type === 'cost' && <DollarSign className="h-3 w-3 inline mr-1" />}
                            {improvement.type === 'efficiency' && <Zap className="h-3 w-3 inline mr-1" />}
                            {improvement.type === 'safety' && <Shield className="h-3 w-3 inline mr-1" />}
                            {improvement.value}{improvement.unit}
                          </p>
                        </div>
                        <Badge className={`${getImpactColor(improvement.impact)}`}>
                          {improvement.impact}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Carte de route */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Carte de Route
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Navigation className="h-12 w-12 mx-auto mb-2" />
                    <p>Carte interactive de la route optimisée</p>
                    <p className="text-sm">Intégration avec service de cartographie</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Facteurs d'optimisation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Facteurs d'Optimisation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentRoute.factors.map((factor, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Switch checked={factor.enabled} />
                            <span className="font-medium">{factor.name}</span>
                            <Badge variant="outline" className="text-xs">
                              Poids: {factor.weight * 100}%
                            </Badge>
                          </div>
                          <span className="text-sm text-gray-500">
                            {factor.currentValue} → {factor.optimalValue} {factor.unit}
                          </span>
                        </div>
                        <Progress value={factor.currentValue} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance de l'optimisation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance de l'Optimisation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">94.2%</div>
                        <p className="text-sm text-blue-700">Précision</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">2.3s</div>
                        <p className="text-sm text-green-700">Temps de calcul</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Dernière optimisation</span>
                        <span>{new Date(currentRoute.lastUpdated).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Prochaine optimisation</span>
                        <span>Dans 15 minutes</span>
                      </div>
                    </div>

                    <Button className="w-full" variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Forcer l'Optimisation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="conditions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Conditions de trafic */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Conditions de Trafic
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${currentTraffic.color}`}></div>
                        <div>
                          <p className="font-medium">{currentTraffic.description}</p>
                          <p className="text-sm text-gray-500">Impact: +{currentTraffic.impact}% sur le temps</p>
                        </div>
                      </div>
                      <Badge variant="outline">{currentTraffic.level}</Badge>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Conditions par zone:</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Brazzaville Centre</span>
                          <Badge className="bg-green-100 text-green-800">Fluide</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Route Nationale 1</span>
                          <Badge className="bg-yellow-100 text-yellow-800">Modéré</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Pointe-Noire</span>
                          <Badge className="bg-orange-100 text-orange-800">Dense</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Conditions météo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5" />
                    Conditions Météo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getWeatherIcon(currentWeather.type)}
                        <div>
                          <p className="font-medium">{currentWeather.temperature}°C</p>
                          <p className="text-sm text-gray-500">
                            Vent: {currentWeather.windSpeed} km/h • Visibilité: {currentWeather.visibility}%
                          </p>
                        </div>
                      </div>
                      <Badge className={currentWeather.impact === 'positive' ? 'bg-green-100 text-green-800' : 
                                       currentWeather.impact === 'negative' ? 'bg-red-100 text-red-800' : 
                                       'bg-gray-100 text-gray-800'}>
                        {currentWeather.impact}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Prévisions:</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {weatherConditions.map((weather, index) => (
                          <div key={index} className="text-center p-2 bg-gray-50 rounded">
                            <div className="flex justify-center mb-1">
                              {getWeatherIcon(weather.type)}
                            </div>
                            <p className="text-xs font-medium">{weather.temperature}°C</p>
                            <p className="text-xs text-gray-500">{weather.type}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="waypoints" className="space-y-6">
            <div className="space-y-4">
              {currentRoute.optimizedRoute.waypoints.map((waypoint, index) => (
                <Card key={waypoint.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                            waypoint.status === 'completed' ? 'bg-green-500' :
                            waypoint.status === 'in-progress' ? 'bg-blue-500' :
                            'bg-gray-300'
                          }`}>
                            {index + 1}
                          </div>
                          {index < currentRoute.optimizedRoute.waypoints.length - 1 && (
                            <div className="w-0.5 h-8 bg-gray-300 mt-1"></div>
                          )}
                        </div>
                        
                        <div>
                          <h4 className="font-medium">{waypoint.name}</h4>
                          <p className="text-sm text-gray-500">
                            {waypoint.type === 'pickup' && <Package className="h-3 w-3 inline mr-1" />}
                            {waypoint.type === 'delivery' && <MapPin className="h-3 w-3 inline mr-1" />}
                            {waypoint.type === 'waypoint' && <Navigation className="h-3 w-3 inline mr-1" />}
                            {waypoint.type === 'pickup' ? 'Point de collecte' :
                             waypoint.type === 'delivery' ? 'Point de livraison' : 'Point de passage'}
                          </p>
                          <p className="text-xs text-gray-400">
                            ETA: {waypoint.estimatedTime}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <Badge className={
                          waypoint.status === 'completed' ? 'bg-green-100 text-green-800' :
                          waypoint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {waypoint.status === 'completed' ? 'Terminé' :
                           waypoint.status === 'in-progress' ? 'En cours' : 'En attente'}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {waypoint.coordinates[0].toFixed(4)}, {waypoint.coordinates[1].toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ColisIntelligentRouting; 