import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  MapPin,
  Users,
  Package,
  DollarSign,
  Globe,
  Activity,
  Award,
  Target,
  Calendar,
  FileText,
  Download,
  Eye,
  Settings,
  LogOut,
  Building,
  Truck,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface RegionalMetrics {
  region: string;
  colis: number;
  revenue: number;
  growth: number;
  agents: number;
  deliveryRate: number;
}

interface FinancialMetrics {
  revenue: number;
  expenses: number;
  profit: number;
  growth: number;
  projections: number[];
}

interface OperationalMetrics {
  totalColis: number;
  deliveredColis: number;
  pendingColis: number;
  returnRate: number;
  averageDeliveryTime: number;
  customerSatisfaction: number;
}

const DirectorDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('month');
  const [regionalData, setRegionalData] = useState<RegionalMetrics[]>([]);
  const [financialData, setFinancialData] = useState<FinancialMetrics>({
    revenue: 45000000,
    expenses: 28000000,
    profit: 17000000,
    growth: 12.5,
    projections: [42000000, 45000000, 48000000, 52000000]
  });
  const [operationalData, setOperationalData] = useState<OperationalMetrics>({
    totalColis: 15420,
    deliveredColis: 14850,
    pendingColis: 570,
    returnRate: 2.3,
    averageDeliveryTime: 2.8,
    customerSatisfaction: 94.2
  });

  useEffect(() => {
    // Simuler le chargement des données régionales
    const mockRegionalData: RegionalMetrics[] = [
      {
        region: 'Brazzaville',
        colis: 8540,
        revenue: 25000000,
        growth: 15.2,
        agents: 45,
        deliveryRate: 96.5
      },
      {
        region: 'Pointe-Noire',
        colis: 4320,
        revenue: 12500000,
        growth: 8.7,
        agents: 28,
        deliveryRate: 94.2
      },
      {
        region: 'Dolisie',
        colis: 1560,
        revenue: 4500000,
        growth: 22.1,
        agents: 12,
        deliveryRate: 91.8
      },
      {
        region: 'Autres',
        colis: 1000,
        revenue: 3000000,
        growth: 5.4,
        agents: 8,
        deliveryRate: 89.5
      }
    ];
    setRegionalData(mockRegionalData);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const OverviewPanel = () => (
    <div className="space-y-6">
      {/* KPIs Principaux */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Chiffre d'affaires</p>
                <p className="text-2xl font-bold">{formatCurrency(financialData.revenue)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+{financialData.growth}%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Colis traités</p>
                <p className="text-2xl font-bold">{operationalData.totalColis.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-600">+8.3%</span>
                </div>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux de livraison</p>
                <p className="text-2xl font-bold">{operationalData.deliveredColis / operationalData.totalColis * 100}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Excellente</span>
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Satisfaction client</p>
                <p className="text-2xl font-bold">{operationalData.customerSatisfaction}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-600">Très bon</span>
                </div>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Évolution du CA (6 derniers mois)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Graphique d'évolution du chiffre d'affaires</p>
                <p className="text-sm">Intégration Chart.js en cours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Répartition par région
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <PieChart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Répartition géographique des activités</p>
                <p className="text-sm">Intégration Chart.js en cours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const RegionalAnalysis = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Performance par Région
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {regionalData.map((region, index) => (
              <div key={region.region} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium">{region.region}</div>
                    <div className="text-sm text-gray-600">{region.agents} agents</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-medium">{region.colis.toLocaleString()} colis</div>
                    <div className="text-sm text-gray-600">{formatCurrency(region.revenue)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{region.deliveryRate}%</div>
                    <div className="text-sm text-gray-600">Livraison</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${region.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {region.growth > 0 ? '+' : ''}{region.growth}%
                    </div>
                    <div className="text-sm text-gray-600">Croissance</div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const FinancialAnalysis = () => (
    <div className="space-y-6">
      {/* Métriques financières */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Revenus</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(financialData.revenue)}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">+{financialData.growth}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Dépenses</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(financialData.expenses)}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600">+5.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Bénéfice net</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(financialData.profit)}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-600">+18.7%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Projections Financières
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Projections financières 2024-2025</p>
              <p className="text-sm">Intégration Chart.js en cours</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const OperationalMetrics = () => (
    <div className="space-y-6">
      {/* Métriques opérationnelles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Temps de livraison moyen</p>
              <p className="text-2xl font-bold">{operationalData.averageDeliveryTime} jours</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-600">Objectif: 2.5j</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Taux de retour</p>
              <p className="text-2xl font-bold">{operationalData.returnRate}%</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-orange-600">Objectif: 2%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Colis en attente</p>
              <p className="text-2xl font-bold">{operationalData.pendingColis}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Package className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-600">À traiter</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Efficacité globale</p>
              <p className="text-2xl font-bold">94.2%</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Award className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">Excellente</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau de bord opérationnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Tableau de Bord Opérationnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Indicateurs de Performance</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Taux de livraison à temps</span>
                  <Badge className="bg-green-100 text-green-800">96.3%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Satisfaction client</span>
                  <Badge className="bg-blue-100 text-blue-800">94.2%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Efficacité des agents</span>
                  <Badge className="bg-purple-100 text-purple-800">91.8%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Taux de résolution incidents</span>
                  <Badge className="bg-orange-100 text-orange-800">98.7%</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Objectifs 2024</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Croissance du CA</span>
                  <Badge className="bg-green-100 text-green-800">+15% ✓</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Réduction des coûts</span>
                  <Badge className="bg-blue-100 text-blue-800">-8% ✓</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Expansion géographique</span>
                  <Badge className="bg-yellow-100 text-yellow-800">+3 villes</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Digitalisation</span>
                  <Badge className="bg-purple-100 text-purple-800">85% ✓</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50">
      {/* En-tête Direction */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Building className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="font-semibold text-gray-900">Direction Générale - Poste Congo</h1>
                  <p className="text-sm text-gray-600">Tableau de bord stratégique</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sélecteur de période */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <span className="font-medium">Période :</span>
            <select 
              value={timeframe} 
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md"
            >
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
            </select>
          </div>
        </div>

        {/* Onglets principaux */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="regional">Analyse régionale</TabsTrigger>
            <TabsTrigger value="financial">Analyse financière</TabsTrigger>
            <TabsTrigger value="operational">Métriques opérationnelles</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewPanel />
          </TabsContent>

          <TabsContent value="regional">
            <RegionalAnalysis />
          </TabsContent>

          <TabsContent value="financial">
            <FinancialAnalysis />
          </TabsContent>

          <TabsContent value="operational">
            <OperationalMetrics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DirectorDashboardPage; 