import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  MapPin, 
  Package, 
  Users, 
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Zap,
  Brain,
  Eye,
  Activity,
  Thermometer,
  Gauge
} from 'lucide-react';

interface PredictiveMetric {
  name: string;
  current: number;
  predicted: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  unit: string;
}

interface PredictionModel {
  id: string;
  name: string;
  accuracy: number;
  lastUpdated: string;
  status: 'active' | 'training' | 'error';
  predictions: number;
}

const ColisPredictiveAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<string>('delivery_time');

  const predictiveMetrics: PredictiveMetric[] = [
    {
      name: 'Temps de Livraison',
      current: 2.3,
      predicted: 2.1,
      change: -8.7,
      trend: 'up',
      confidence: 94,
      unit: 'jours'
    },
    {
      name: 'Taux de Livraison',
      current: 96.8,
      predicted: 97.2,
      change: 0.4,
      trend: 'up',
      confidence: 89,
      unit: '%'
    },
    {
      name: 'Coût de Livraison',
      current: 4500,
      predicted: 4200,
      change: -6.7,
      trend: 'up',
      confidence: 92,
      unit: 'FCFA'
    },
    {
      name: 'Satisfaction Client',
      current: 4.6,
      predicted: 4.7,
      change: 2.2,
      trend: 'up',
      confidence: 87,
      unit: '/5'
    },
    {
      name: 'Volume de Colis',
      current: 1247,
      predicted: 1380,
      change: 10.7,
      trend: 'up',
      confidence: 91,
      unit: 'colis'
    },
    {
      name: 'Taux d\'Annulation',
      current: 3.2,
      predicted: 2.8,
      change: -12.5,
      trend: 'up',
      confidence: 85,
      unit: '%'
    }
  ];

  const predictionModels: PredictionModel[] = [
    {
      id: 'delivery-time',
      name: 'Modèle de Temps de Livraison',
      accuracy: 94.2,
      lastUpdated: '2024-01-15',
      status: 'active',
      predictions: 15420
    },
    {
      id: 'demand-forecast',
      name: 'Modèle de Prévision de Demande',
      accuracy: 87.6,
      lastUpdated: '2024-01-14',
      status: 'active',
      predictions: 8920
    },
    {
      id: 'route-optimization',
      name: 'Modèle d\'Optimisation de Route',
      accuracy: 91.8,
      lastUpdated: '2024-01-13',
      status: 'training',
      predictions: 12340
    },
    {
      id: 'customer-churn',
      name: 'Modèle de Churn Client',
      accuracy: 82.3,
      lastUpdated: '2024-01-12',
      status: 'active',
      predictions: 5670
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string, change: number) => {
    if (trend === 'up') {
      return change > 0 ? 'text-green-600' : 'text-red-600';
    }
    return change > 0 ? 'text-red-600' : 'text-green-600';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Actif</Badge>;
      case 'training':
        return <Badge className="bg-blue-100 text-blue-800"><Activity className="h-3 w-3 mr-1" />Entraînement</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Erreur</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Prédictives</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Utilisez l'intelligence artificielle pour prédire les tendances futures 
          et optimiser vos opérations de livraison.
        </p>
      </div>

      {/* Contrôles */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={(value: unknown) => setTimeRange(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 jours</SelectItem>
              <SelectItem value="30d">30 jours</SelectItem>
              <SelectItem value="90d">90 jours</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Métrique" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="delivery_time">Temps de Livraison</SelectItem>
              <SelectItem value="delivery_rate">Taux de Livraison</SelectItem>
              <SelectItem value="cost">Coût de Livraison</SelectItem>
              <SelectItem value="satisfaction">Satisfaction Client</SelectItem>
              <SelectItem value="volume">Volume de Colis</SelectItem>
              <SelectItem value="cancellation">Taux d'Annulation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="flex items-center gap-2">
          <Brain className="h-4 w-4" />
          Rafraîchir les Prédictions
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="predictions">Prédictions</TabsTrigger>
          <TabsTrigger value="models">Modèles IA</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Métriques prédictives */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictiveMetrics.map((metric, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{metric.name}</CardTitle>
                    {getTrendIcon(metric.trend)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {metric.current}{metric.unit}
                      </p>
                      <p className="text-sm text-gray-500">Valeur actuelle</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${getTrendColor(metric.trend, metric.change)}`}>
                        {metric.predicted}{metric.unit}
                      </p>
                      <p className="text-sm text-gray-500">Prédiction</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Changement prévu</span>
                      <span className={`font-medium ${getTrendColor(metric.trend, metric.change)}`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                    <Progress value={Math.abs(metric.change) * 2} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Confiance</span>
                    <span className="font-medium text-gray-900">{metric.confidence}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Résumé des prédictions */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Résumé des Prédictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">94.2%</div>
                  <p className="text-sm text-gray-600">Précision moyenne des modèles</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">+12.5%</div>
                  <p className="text-sm text-gray-600">Amélioration prévue de l'efficacité</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">-8.7%</div>
                  <p className="text-sm text-gray-600">Réduction prévue des coûts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graphique de prédiction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Évolution Prédictive - {selectedMetric}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>Graphique interactif des prédictions</p>
                    <p className="text-sm">Intégration avec bibliothèque de graphiques</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Détails des prédictions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Détails des Prédictions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Facteurs d'influence</span>
                    <Badge variant="outline">12 facteurs</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Données d'entraînement</span>
                    <Badge variant="outline">45K échantillons</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Mise à jour</span>
                    <Badge variant="outline">Quotidienne</Badge>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Recommandations IA</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Optimiser les routes pour réduire les temps de livraison</li>
                    <li>• Augmenter la capacité pendant les pics de demande</li>
                    <li>• Améliorer la communication client pour réduire les annulations</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {predictionModels.map((model) => (
              <Card key={model.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      {getStatusBadge(model.status)}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{model.accuracy}%</div>
                      <p className="text-sm text-gray-500">Précision</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Prédictions générées</span>
                      <span className="font-medium">{model.predictions.toLocaleString()}</span>
                    </div>
                    <Progress value={model.accuracy} className="h-2" />
                  </div>

                  <div className="text-sm text-gray-500">
                    Dernière mise à jour: {new Date(model.lastUpdated).toLocaleDateString()}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Détails</Button>
                    <Button size="sm" variant="outline">Réentraîner</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Performance des modèles */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Performance des Modèles IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">4</div>
                  <p className="text-sm text-gray-600">Modèles actifs</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">89.0%</div>
                  <p className="text-sm text-gray-600">Précision moyenne</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">42.3K</div>
                  <p className="text-sm text-gray-600">Prédictions totales</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">24h</div>
                  <p className="text-sm text-gray-600">Temps de réponse</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Insights automatiques */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Insights Automatiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <h4 className="font-semibold text-yellow-800">Pic de Demande Détecté</h4>
                    <p className="text-sm text-yellow-700">
                      Augmentation de 25% prévue pour la semaine prochaine. 
                      Recommandation: Augmenter la capacité de 20%.
                    </p>
                  </div>

                  <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
                    <h4 className="font-semibold text-green-800">Optimisation de Route</h4>
                    <p className="text-sm text-green-700">
                      Nouvelle route identifiée pour réduire le temps de livraison 
                      de 15% sur les trajets Brazzaville-Pointe-Noire.
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <h4 className="font-semibold text-blue-800">Tendance Client</h4>
                    <p className="text-sm text-blue-700">
                      Augmentation de 30% des commandes express. 
                      Considérer l'expansion de ce service.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions recommandées */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Actions Recommandées
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Augmenter la capacité</h4>
                      <p className="text-sm text-gray-600">Impact élevé • 2 jours</p>
                    </div>
                    <Button size="sm">Appliquer</Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Optimiser les routes</h4>
                      <p className="text-sm text-gray-600">Impact moyen • 1 jour</p>
                    </div>
                    <Button size="sm">Appliquer</Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Améliorer la communication</h4>
                      <p className="text-sm text-gray-600">Impact faible • 3 jours</p>
                    </div>
                    <Button size="sm">Appliquer</Button>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Impact Prévisionnel</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-purple-700">Efficacité:</span>
                      <span className="font-medium text-purple-900 ml-2">+15%</span>
                    </div>
                    <div>
                      <span className="text-purple-700">Coûts:</span>
                      <span className="font-medium text-purple-900 ml-2">-8%</span>
                    </div>
                    <div>
                      <span className="text-purple-700">Satisfaction:</span>
                      <span className="font-medium text-purple-900 ml-2">+12%</span>
                    </div>
                    <div>
                      <span className="text-purple-700">ROI:</span>
                      <span className="font-medium text-purple-900 ml-2">+23%</span>
                    </div>
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

export default ColisPredictiveAnalytics; 