import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Target,
  BarChart3,
  Activity,
  Zap,
  Eye,
  Shield,
  Lightbulb,
  RefreshCw,
  Download,
  Package
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PredictionData {
  date: string;
  actual: number;
  predicted: number;
  confidence: number;
}

interface FraudAlert {
  id: string;
  type: 'payment' | 'order' | 'user' | 'delivery';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  confidence: number;
  timestamp: string;
  status: 'pending' | 'investigating' | 'resolved' | 'false_positive';
}

interface StockPrediction {
  productId: string;
  productName: string;
  currentStock: number;
  predictedDemand: number;
  recommendedOrder: number;
  riskLevel: 'low' | 'medium' | 'high';
  nextRestockDate: string;
}

interface DemandForecast {
  productId: string;
  productName: string;
  currentWeek: number;
  nextWeek: number;
  nextMonth: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  seasonality: 'high' | 'medium' | 'low';
}

const PredictiveAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('demand');
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  const [stockPredictions, setStockPredictions] = useState<StockPrediction[]>([]);
  const [demandForecasts, setDemandForecasts] = useState<DemandForecast[]>([]);

  // Mock data
  const mockPredictions: PredictionData[] = [
    { date: '2024-01-25', actual: 125, predicted: 128, confidence: 87 },
    { date: '2024-01-26', actual: 142, predicted: 135, confidence: 89 },
    { date: '2024-01-27', actual: 138, predicted: 141, confidence: 91 },
    { date: '2024-01-28', actual: 156, predicted: 152, confidence: 88 },
    { date: '2024-01-29', actual: 149, predicted: 155, confidence: 85 },
    { date: '2024-01-30', actual: 167, predicted: 162, confidence: 92 },
    { date: '2024-01-31', actual: 175, predicted: 168, confidence: 90 }
  ];

  const mockFraudAlerts: FraudAlert[] = [
    {
      id: '1',
      type: 'payment',
      severity: 'high',
      description: 'Transaction suspecte: montant anormalement élevé',
      confidence: 94,
      timestamp: '2024-01-30 14:23',
      status: 'investigating'
    },
    {
      id: '2',
      type: 'order',
      severity: 'medium',
      description: 'Commande multiple depuis la même adresse IP',
      confidence: 78,
      timestamp: '2024-01-30 12:45',
      status: 'pending'
    },
    {
      id: '3',
      type: 'user',
      severity: 'low',
      description: 'Nouveau compte avec activité suspecte',
      confidence: 65,
      timestamp: '2024-01-30 10:12',
      status: 'resolved'
    }
  ];

  const mockStockPredictions: StockPrediction[] = [
    {
      productId: '1',
      productName: 'Poulet Braisé Premium',
      currentStock: 45,
      predictedDemand: 67,
      recommendedOrder: 25,
      riskLevel: 'medium',
      nextRestockDate: '2024-02-05'
    },
    {
      productId: '2',
      productName: 'Poisson Braisé Tilapia',
      currentStock: 12,
      predictedDemand: 34,
      recommendedOrder: 30,
      riskLevel: 'high',
      nextRestockDate: '2024-02-02'
    },
    {
      productId: '3',
      productName: 'Maboké de Manioc',
      currentStock: 89,
      predictedDemand: 78,
      recommendedOrder: 0,
      riskLevel: 'low',
      nextRestockDate: '2024-02-10'
    }
  ];

  const mockDemandForecasts: DemandForecast[] = [
    {
      productId: '1',
      productName: 'Poulet Braisé Premium',
      currentWeek: 125,
      nextWeek: 142,
      nextMonth: 598,
      trend: 'increasing',
      seasonality: 'high'
    },
    {
      productId: '2',
      productName: 'Poisson Braisé Tilapia',
      currentWeek: 89,
      nextWeek: 95,
      nextMonth: 412,
      trend: 'stable',
      seasonality: 'medium'
    },
    {
      productId: '3',
      productName: 'Maboké de Manioc',
      currentWeek: 156,
      nextWeek: 148,
      nextMonth: 634,
      trend: 'decreasing',
      seasonality: 'low'
    }
  ];

  useEffect(() => {
    setPredictions(mockPredictions);
    setFraudAlerts(mockFraudAlerts);
    setStockPredictions(mockStockPredictions);
    setDemandForecasts(mockDemandForecasts);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'decreasing':
        return <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const runPredictions = async () => {
    setIsLoading(true);
    // Simuler le traitement IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const accuracy = predictions.reduce((acc, pred) => {
    const error = Math.abs(pred.actual - pred.predicted) / pred.actual;
    return acc + (1 - error);
  }, 0) / predictions.length * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Brain className="w-6 h-6 mr-2 text-purple-600" />
            IA Prédictive Avancée
          </h2>
          <p className="text-muted-foreground">
            Prédictions intelligentes pour optimiser vos opérations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={runPredictions} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser Prédictions
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPIs IA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Précision IA</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accuracy.toFixed(1)}%</div>
            <Progress value={accuracy} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Précision moyenne des prédictions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes Fraude</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fraudAlerts.length}</div>
            <div className="text-xs text-muted-foreground">
              {fraudAlerts.filter(a => a.severity === 'high' || a.severity === 'critical').length} critiques
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimisation Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stockPredictions.filter(s => s.riskLevel === 'high').length}
            </div>
            <div className="text-xs text-muted-foreground">
              Produits à risque de rupture
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tendances Détectées</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {demandForecasts.filter(d => d.trend === 'increasing').length}
            </div>
            <div className="text-xs text-muted-foreground">
              Produits en croissance
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="demand">Prédiction Demande</TabsTrigger>
          <TabsTrigger value="fraud">Détection Fraude</TabsTrigger>
          <TabsTrigger value="stock">Optimisation Stock</TabsTrigger>
          <TabsTrigger value="insights">Insights IA</TabsTrigger>
        </TabsList>

        {/* Prédiction Demande */}
        <TabsContent value="demand" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Prédiction vs Réalité</CardTitle>
                <CardDescription>
                  Comparaison des prédictions IA avec les données réelles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={predictions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="actual" stackId="1" stroke="#00C49A" fill="#00C49A" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="predicted" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prévisions par Produit</CardTitle>
                <CardDescription>
                  Prédictions de demande pour les prochaines semaines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demandForecasts.map((forecast) => (
                    <div key={forecast.productId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{forecast.productName}</h4>
                        {getTrendIcon(forecast.trend)}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Cette semaine</div>
                          <div className="font-semibold">{forecast.currentWeek}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Semaine prochaine</div>
                          <div className="font-semibold">{forecast.nextWeek}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Mois prochain</div>
                          <div className="font-semibold">{forecast.nextMonth}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline">
                          Saisonnalité: {forecast.seasonality}
                        </Badge>
                        <Badge className={forecast.trend === 'increasing' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {forecast.trend}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Détection Fraude */}
        <TabsContent value="fraud" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Alertes de Fraude en Temps Réel
              </CardTitle>
              <CardDescription>
                Détection automatique des activités suspectes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fraudAlerts.map((alert) => (
                  <div key={alert.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`w-3 h-3 rounded-full mt-2 ${
                          alert.severity === 'critical' ? 'bg-red-500' :
                          alert.severity === 'high' ? 'bg-orange-500' :
                          alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold">{alert.description}</h4>
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Type: {alert.type} • Confiance: {alert.confidence}% • {alert.timestamp}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {alert.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Optimisation Stock */}
        <TabsContent value="stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Prédictions de Stock
              </CardTitle>
              <CardDescription>
                Recommandations IA pour optimiser les niveaux de stock
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stockPredictions.map((prediction) => (
                  <div key={prediction.productId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{prediction.productName}</h4>
                      <Badge className={getRiskColor(prediction.riskLevel)}>
                        Risque: {prediction.riskLevel}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Stock Actuel</div>
                        <div className="font-semibold">{prediction.currentStock}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Demande Prédite</div>
                        <div className="font-semibold">{prediction.predictedDemand}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Commande Recommandée</div>
                        <div className="font-semibold">{prediction.recommendedOrder}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Prochaine Restock</div>
                        <div className="font-semibold">{prediction.nextRestockDate}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Niveau de Stock</span>
                          <span>{prediction.currentStock}/{prediction.predictedDemand}</span>
                        </div>
                        <Progress 
                          value={(prediction.currentStock / prediction.predictedDemand) * 100} 
                          className="h-2"
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        Commander
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights IA */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Insights IA
                </CardTitle>
                <CardDescription>
                  Recommandations intelligentes basées sur l'analyse des données
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-semibold text-green-800">Opportunité de Croissance</div>
                      <div className="text-sm text-green-700">
                        Le "Poulet Braisé Premium" montre une tendance croissante de 15%. 
                        Recommandation: Augmenter la production de 20%.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="font-semibold text-yellow-800">Risque de Rupture</div>
                      <div className="text-sm text-yellow-700">
                        Le "Poisson Braisé Tilapia" risque la rupture de stock dans 3 jours. 
                        Recommandation: Commander 30 unités immédiatement.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-semibold text-blue-800">Optimisation Prix</div>
                      <div className="text-sm text-blue-700">
                        Analyse des prix concurrents suggère une augmentation de 5% 
                        pour le "Maboké de Manioc" sans impact sur la demande.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Métriques IA
                </CardTitle>
                <CardDescription>
                  Performance et précision des modèles IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Précision Prédictions</span>
                      <span>87.3%</span>
                    </div>
                    <Progress value={87.3} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Détection Fraude</span>
                      <span>94.1%</span>
                    </div>
                    <Progress value={94.1} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Optimisation Stock</span>
                      <span>91.7%</span>
                    </div>
                    <Progress value={91.7} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Prédiction Demande</span>
                      <span>89.2%</span>
                    </div>
                    <Progress value={89.2} className="h-2" />
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

export default PredictiveAnalytics; 