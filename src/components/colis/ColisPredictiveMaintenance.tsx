import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Wrench, 
  Car, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Settings,
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Shield,
  Zap,
  Brain,
  Eye,
  Edit,
  Trash2,
  Plus,
  Save,
  RefreshCw,
  Calendar,
  DollarSign,
  MapPin,
  Truck,
  Users,
  FileText,
  Download,
  Share2,
  MoreHorizontal,
  Gauge,
  Thermometer,
  Droplets,
  Battery,
  Fuel,
  Circle,
  Cog,
  Lightbulb,
  AlertCircle,
  Info,
  Hammer,
  Filter
} from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  type: 'truck' | 'van' | 'car';
  licensePlate: string;
  model: string;
  year: number;
  mileage: number;
  status: 'active' | 'maintenance' | 'repair' | 'inactive';
  healthScore: number;
  lastMaintenance: Date;
  nextMaintenance: Date;
  driver: string;
  location: string;
}

interface MaintenanceAlert {
  id: string;
  vehicleId: string;
  type: 'preventive' | 'predictive' | 'urgent' | 'scheduled';
  component: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  predictedDate: Date;
  confidence: number;
  estimatedCost: number;
  status: 'pending' | 'scheduled' | 'in-progress' | 'completed';
  priority: number;
}

interface ComponentHealth {
  name: string;
  health: number;
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  lastCheck: Date;
  nextCheck: Date;
  wearLevel: number;
  efficiency: number;
  recommendations: string[];
}

const ColisPredictiveMaintenance: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: '1',
      name: 'Camion Principal',
      type: 'truck',
      licensePlate: 'CG-1234-AB',
      model: 'Mercedes-Benz Actros',
      year: 2022,
      mileage: 125000,
      status: 'active',
      healthScore: 87,
      lastMaintenance: new Date('2024-01-01'),
      nextMaintenance: new Date('2024-02-15'),
      driver: 'Jean Dupont',
      location: 'Brazzaville'
    },
    {
      id: '2',
      name: 'Fourgon Express',
      type: 'van',
      licensePlate: 'CG-5678-CD',
      model: 'Ford Transit',
      year: 2023,
      mileage: 45000,
      status: 'maintenance',
      healthScore: 72,
      lastMaintenance: new Date('2024-01-10'),
      nextMaintenance: new Date('2024-01-25'),
      driver: 'Marie Martin',
      location: 'Pointe-Noire'
    },
    {
      id: '3',
      name: 'Voiture de Service',
      type: 'car',
      licensePlate: 'CG-9012-EF',
      model: 'Toyota Hilux',
      year: 2021,
      mileage: 89000,
      status: 'active',
      healthScore: 94,
      lastMaintenance: new Date('2024-01-05'),
      nextMaintenance: new Date('2024-03-01'),
      driver: 'Pierre Durand',
      location: 'Dolisie'
    }
  ]);

  const [maintenanceAlerts, setMaintenanceAlerts] = useState<MaintenanceAlert[]>([
    {
      id: '1',
      vehicleId: '2',
      type: 'predictive',
      component: 'Système de freinage',
      severity: 'high',
      description: 'Usure prédite des plaquettes de frein dans les 500 km',
      predictedDate: new Date('2024-01-25'),
      confidence: 92.5,
      estimatedCost: 45000,
      status: 'scheduled',
      priority: 8
    },
    {
      id: '2',
      vehicleId: '1',
      type: 'preventive',
      component: 'Vidange moteur',
      severity: 'medium',
      description: 'Vidange d\'huile recommandée selon le planning',
      predictedDate: new Date('2024-02-15'),
      confidence: 95.0,
      estimatedCost: 25000,
      status: 'pending',
      priority: 5
    },
    {
      id: '3',
      vehicleId: '3',
      type: 'predictive',
      component: 'Système de refroidissement',
      severity: 'low',
      description: 'Niveau de liquide de refroidissement à surveiller',
      predictedDate: new Date('2024-02-20'),
      confidence: 78.3,
      estimatedCost: 15000,
      status: 'pending',
      priority: 3
    }
  ]);

  const [selectedVehicle, setSelectedVehicle] = useState<string>('1');
  const [selectedAlert, setSelectedAlert] = useState<string>('all');

  const currentVehicle = vehicles.find(v => v.id === selectedVehicle);

  const componentHealthData: ComponentHealth[] = [
    {
      name: 'Moteur',
      health: 92,
      status: 'excellent',
      lastCheck: new Date('2024-01-15'),
      nextCheck: new Date('2024-02-15'),
      wearLevel: 8,
      efficiency: 95,
      recommendations: ['Vérifier le niveau d\'huile', 'Contrôler les filtres']
    },
    {
      name: 'Système de freinage',
      health: 65,
      status: 'fair',
      lastCheck: new Date('2024-01-10'),
      nextCheck: new Date('2024-01-25'),
      wearLevel: 35,
      efficiency: 78,
      recommendations: ['Remplacer les plaquettes', 'Vérifier les disques']
    },
    {
      name: 'Transmission',
      health: 88,
      status: 'good',
      lastCheck: new Date('2024-01-12'),
      nextCheck: new Date('2024-02-12'),
      wearLevel: 12,
      efficiency: 92,
      recommendations: ['Contrôler le niveau d\'huile']
    },
    {
      name: 'Système électrique',
      health: 95,
      status: 'excellent',
      lastCheck: new Date('2024-01-08'),
      nextCheck: new Date('2024-02-08'),
      wearLevel: 5,
      efficiency: 98,
      recommendations: ['Vérifier les connexions']
    },
    {
      name: 'Pneus',
      health: 75,
      status: 'good',
      lastCheck: new Date('2024-01-05'),
      nextCheck: new Date('2024-02-05'),
      wearLevel: 25,
      efficiency: 85,
      recommendations: ['Rotation des pneus', 'Vérifier la pression']
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Actif</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800"><Wrench className="h-3 w-3 mr-1" />Maintenance</Badge>;
      case 'repair':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Réparation</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800"><Clock className="h-3 w-3 mr-1" />Inactif</Badge>;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-600';
    if (health >= 75) return 'text-blue-600';
    if (health >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthStatus = (health: number) => {
    if (health >= 90) return 'excellent';
    if (health >= 75) return 'good';
    if (health >= 60) return 'fair';
    if (health >= 40) return 'poor';
    return 'critical';
  };

  const getComponentIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'moteur':
        return <Cog className="h-4 w-4" />;
      case 'système de freinage':
        return <Shield className="h-4 w-4" />;
      case 'transmission':
        return <Cog className="h-4 w-4" />;
      case 'système électrique':
        return <Zap className="h-4 w-4" />;
      case 'pneus':
        return <Circle className="h-4 w-4" />;
      default:
        return <Cog className="h-4 w-4" />;
    }
  };

  const filteredAlerts = selectedAlert === 'all' 
    ? maintenanceAlerts 
    : maintenanceAlerts.filter(alert => alert.vehicleId === selectedVehicle);

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Maintenance Prédictive</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Anticipez les pannes et optimisez la maintenance de votre flotte avec l'IA prédictive 
          pour maximiser la disponibilité et réduire les coûts.
        </p>
      </div>

      {/* Statistiques de maintenance */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Véhicules Actifs</p>
                <p className="text-2xl font-bold text-blue-900">
                  {vehicles.filter(v => v.status === 'active').length}/{vehicles.length}
                </p>
              </div>
              <Car className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Score de Santé Moyen</p>
                <p className="text-2xl font-bold text-green-900">
                  {Math.round(vehicles.reduce((acc, v) => acc + v.healthScore, 0) / vehicles.length)}%
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Alertes Actives</p>
                <p className="text-2xl font-bold text-orange-900">
                  {maintenanceAlerts.filter(a => a.status === 'pending' || a.status === 'scheduled').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Économies Prédites</p>
                <p className="text-2xl font-bold text-purple-900">
                  -35%
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="vehicles">Véhicules</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* État de la flotte */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  État de la Flotte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Car className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{vehicle.name}</h4>
                          <p className="text-sm text-gray-500">{vehicle.licensePlate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(vehicle.status)}
                          <span className={`font-semibold ${getHealthColor(vehicle.healthScore)}`}>
                            {vehicle.healthScore}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {vehicle.mileage.toLocaleString()} km
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alertes prioritaires */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Alertes Prioritaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {maintenanceAlerts
                    .filter(alert => alert.severity === 'high' || alert.severity === 'critical')
                    .sort((a, b) => b.priority - a.priority)
                    .slice(0, 3)
                    .map((alert) => {
                      const vehicle = vehicles.find(v => v.id === alert.vehicleId);
                      return (
                        <div key={alert.id} className="p-3 border-l-4 border-orange-400 bg-orange-50 rounded">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-orange-900">{alert.component}</h4>
                              <p className="text-sm text-orange-700">{alert.description}</p>
                              <p className="text-xs text-orange-600 mt-1">
                                {vehicle?.name} • {alert.predictedDate.toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prédictions IA */}
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Prédictions IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">94.2%</div>
                  <p className="text-sm text-indigo-700">Précision des prédictions</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">-45%</div>
                  <p className="text-sm text-purple-700">Réduction des pannes</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">+28%</div>
                  <p className="text-sm text-blue-700">Disponibilité des véhicules</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sélection du véhicule */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Sélectionner un Véhicule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {vehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedVehicle === vehicle.id
                            ? 'bg-orange-100 border-orange-300'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedVehicle(vehicle.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{vehicle.name}</h4>
                            <p className="text-sm text-gray-500">{vehicle.licensePlate}</p>
                          </div>
                          <span className={`font-semibold ${getHealthColor(vehicle.healthScore)}`}>
                            {vehicle.healthScore}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Détails du véhicule */}
            {currentVehicle && (
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Car className="h-5 w-5" />
                      {currentVehicle.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Informations générales */}
                      <div className="space-y-4">
                        <h4 className="font-medium">Informations Générales</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Modèle</span>
                            <span className="font-medium">{currentVehicle.model}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Année</span>
                            <span className="font-medium">{currentVehicle.year}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Kilométrage</span>
                            <span className="font-medium">{currentVehicle.mileage.toLocaleString()} km</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Chauffeur</span>
                            <span className="font-medium">{currentVehicle.driver}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Localisation</span>
                            <span className="font-medium">{currentVehicle.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Santé des composants */}
                      <div className="space-y-4">
                        <h4 className="font-medium">Santé des Composants</h4>
                        <div className="space-y-3">
                          {componentHealthData.map((component) => (
                            <div key={component.name} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {getComponentIcon(component.name)}
                                  <span className="text-sm font-medium">{component.name}</span>
                                </div>
                                <span className={`text-sm font-semibold ${getHealthColor(component.health)}`}>
                                  {component.health}%
                                </span>
                              </div>
                              <Progress value={component.health} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          {/* Filtres */}
          <div className="flex gap-4">
            <Select value={selectedAlert} onValueChange={setSelectedAlert}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par véhicule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les véhicules</SelectItem>
                {vehicles.map(vehicle => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Liste des alertes */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => {
              const vehicle = vehicles.find(v => v.id === alert.vehicleId);
              return (
                <Card key={alert.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Wrench className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{alert.component}</h4>
                          <p className="text-sm text-gray-500">{vehicle?.name} • {vehicle?.licensePlate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <Badge variant="outline">
                          Priorité: {alert.priority}/10
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-700">{alert.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Date prédite</p>
                        <p className="font-medium">{alert.predictedDate.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Confiance IA</p>
                        <p className="font-medium">{alert.confidence}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Coût estimé</p>
                        <p className="font-medium">{alert.estimatedCost.toLocaleString()} FCFA</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Statut</p>
                        <Badge variant="outline">{alert.status}</Badge>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Détails
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        Planifier
                      </Button>
                      <Button size="sm" variant="outline">
                        <Wrench className="h-3 w-3 mr-1" />
                        Démarrer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Coûts de maintenance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Coûts de Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">-35%</div>
                      <p className="text-sm text-green-700">Économies réalisées</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">2.3M</div>
                      <p className="text-sm text-blue-700">FCFA économisés</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Maintenance préventive</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Maintenance prédictive</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Réparations d'urgence</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance des prédictions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Performance des Prédictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Précision globale</span>
                      <span className="font-medium">94.2%</span>
                    </div>
                    <Progress value={94.2} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Détection précoce</span>
                      <span className="font-medium">89.7%</span>
                    </div>
                    <Progress value={89.7} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Faux positifs</span>
                      <span className="font-medium">5.8%</span>
                    </div>
                    <Progress value={5.8} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Temps de réponse</span>
                      <span className="font-medium">2.3s</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ColisPredictiveMaintenance; 