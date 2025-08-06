import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Package, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  MapPin,
  Phone,
  MessageSquare,
  Headphones,
  Clock,
  CheckCircle,
  X,
  Eye,
  Settings,
  LogOut,
  Star,
  Award,
  Activity,
  Shield
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy';
  location: string;
  metrics: {
    colis: number;
    tauxErreurs: string;
    lastActivity: string;
    efficiency: number;
  };
}

interface Alert {
  id: string;
  type: 'retard' | 'incident' | 'performance' | 'system';
  agent: string;
  colis?: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
}

interface DailyMetrics {
  totalColis: number;
  totalRevenue: number;
  deliveryRate: number;
  activeAgents: number;
  incidents: number;
}

const SupervisorDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('agents');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dailyMetrics, setDailyMetrics] = useState<DailyMetrics>({
    totalColis: 143,
    totalRevenue: 2450000,
    deliveryRate: 94,
    activeAgents: 24,
    incidents: 3
  });

  useEffect(() => {
    // Simuler le chargement des données
    const mockAgents: Agent[] = [
      {
        id: 'AG-456',
        name: 'Jean Kimbou',
        status: 'online',
        location: 'Agence Bacongo',
        metrics: {
          colis: 18,
          tauxErreurs: '2%',
          lastActivity: '2 min',
          efficiency: 98
        }
      },
      {
        id: 'AG-789',
        name: 'Alice Mbou',
        status: 'busy',
        location: 'Agence Poto-Poto',
        metrics: {
          colis: 22,
          tauxErreurs: '1%',
          lastActivity: '5 min',
          efficiency: 99
        }
      },
      {
        id: 'AG-123',
        name: 'Pierre Nkounkou',
        status: 'offline',
        location: 'Agence Moungali',
        metrics: {
          colis: 15,
          tauxErreurs: '5%',
          lastActivity: '1h',
          efficiency: 85
        }
      }
    ];

    const mockAlerts: Alert[] = [
      {
        id: '1',
        type: 'retard',
        agent: 'AG-789',
        colis: 'BD-456-001',
        message: 'Retard livraison > 2h',
        priority: 'high',
        timestamp: '2024-01-15T14:30:00Z'
      },
      {
        id: '2',
        type: 'performance',
        agent: 'AG-123',
        message: 'Taux d\'erreurs élevé (5%)',
        priority: 'medium',
        timestamp: '2024-01-15T13:45:00Z'
      },
      {
        id: '3',
        type: 'system',
        message: 'Maintenance système prévue',
        priority: 'low',
        timestamp: '2024-01-15T12:00:00Z'
      }
    ];

    setAgents(mockAgents);
    setAlerts(mockAlerts);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-orange-100 text-orange-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const AgentMonitoringPanel = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Supervision des Agents ({agents.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium">{agent.name}</div>
                    <div className="text-sm text-gray-600">{agent.location}</div>
                  </div>
                </div>
                <Badge className={getStatusColor(agent.status)}>
                  {agent.status === 'online' ? 'En ligne' : 
                   agent.status === 'busy' ? 'Occupé' : 'Hors ligne'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-medium">{agent.metrics.colis} colis</div>
                  <div className="text-xs text-gray-600">Erreurs: {agent.metrics.tauxErreurs}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const AlertsManager = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Alertes & Interventions ({alerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
              <div className={`p-2 rounded-lg ${getPriorityColor(alert.priority)}`}>
                <AlertCircle className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{alert.message}</span>
                  <Badge className={getPriorityColor(alert.priority)}>
                    {alert.priority === 'high' ? 'Élevée' : 
                     alert.priority === 'medium' ? 'Moyenne' : 'Faible'}
                  </Badge>
                </div>
                {alert.agent && (
                  <div className="text-sm text-gray-600">Agent: {alert.agent}</div>
                )}
                <div className="text-xs text-gray-500">
                  {new Date(alert.timestamp).toLocaleString('fr-FR')}
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm">
                  <Headphones className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm">
                  <CheckCircle className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const PerformanceAnalytics = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Analytics de Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daily">Journalier</TabsTrigger>
            <TabsTrigger value="weekly">Hebdomadaire</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{dailyMetrics.totalColis}</div>
                  <div className="text-sm text-gray-600">Colis traités</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{dailyMetrics.deliveryRate}%</div>
                  <div className="text-sm text-gray-600">Taux de livraison</div>
                </div>
              </div>
              
              <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Graphique journalier</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="weekly">
            <div className="space-y-4">
              <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Tendances hebdomadaires</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Classement des agents */}
        <div className="mt-6">
          <h4 className="font-semibold mb-3">Top Agents</h4>
          <div className="space-y-2">
            {agents
              .sort((a, b) => b.metrics.efficiency - a.metrics.efficiency)
              .slice(0, 3)
              .map((agent, index) => (
                <div key={agent.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-orange-600">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{agent.name}</div>
                    <div className="text-sm text-gray-600">{agent.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{agent.metrics.efficiency}%</div>
                    <div className="text-xs text-gray-500">Efficacité</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      {/* En-tête Superviseur */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="font-semibold text-gray-900">Superviseur - Poste Congo</h1>
                  <p className="text-sm text-gray-600">Gestion des agents et opérations</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
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
        {/* Indicateurs temps réel */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Agents actifs</p>
                  <p className="text-2xl font-bold">{dailyMetrics.activeAgents}</p>
                </div>
                <User className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Colis aujourd'hui</p>
                  <p className="text-2xl font-bold">{dailyMetrics.totalColis}</p>
                </div>
                <Package className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Chiffre d'affaires</p>
                  <p className="text-2xl font-bold">{(dailyMetrics.totalRevenue / 1000000).toFixed(1)}M</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taux de livraison</p>
                  <p className="text-2xl font-bold">{dailyMetrics.deliveryRate}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Incidents</p>
                  <p className="text-2xl font-bold">{dailyMetrics.incidents}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne 1 : Supervision Agents */}
          <div className="lg:col-span-1">
            <AgentMonitoringPanel />
          </div>
          
          {/* Colonne 2 : Alertes & Interventions */}
          <div className="lg:col-span-1">
            <AlertsManager />
          </div>
          
          {/* Colonne 3 : Analytics */}
          <div className="lg:col-span-1">
            <PerformanceAnalytics />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboardPage; 