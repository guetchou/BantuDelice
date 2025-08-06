import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Phone, 
  MessageSquare, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Activity,
  Headphones,
  Mail,
  Smartphone
} from 'lucide-react';
import CallCenterTicketList from './CallCenterTicketList';
import { CallCenterAgentList } from './CallCenterAgentList';
import { CallCenterChannelList } from './CallCenterChannelList';
import { CallCenterOrderList } from './CallCenterOrderList';

interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  totalOrders: number;
  pendingOrders: number;
  activeAgents: number;
  averageResponseTime: number;
}

const CallCenterDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Simulation des données - à remplacer par l'appel API réel
      const mockStats: DashboardStats = {
        totalTickets: 156,
        openTickets: 23,
        resolvedTickets: 133,
        totalOrders: 89,
        pendingOrders: 12,
        activeAgents: 8,
        averageResponseTime: 4.2
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Call Center</h1>
          <p className="text-gray-600">Gestion multicanal des demandes clients</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Headphones className="h-4 w-4" />
            Nouveau Ticket
          </Button>
          <Button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500">
            <Phone className="h-4 w-4" />
            Appel Entrant
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Ouverts</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.openTickets}</div>
            <p className="text-xs text-muted-foreground">
              +2 depuis hier
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Résolus</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.resolvedTickets}</div>
            <p className="text-xs text-muted-foreground">
              +15 cette semaine
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agents Actifs</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats?.activeAgents}</div>
            <p className="text-xs text-muted-foreground">
              Sur 12 agents total
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps de Réponse</CardTitle>
            <Clock className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats?.averageResponseTime}min</div>
            <p className="text-xs text-muted-foreground">
              Moyenne actuelle
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Canaux actifs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Canaux Actifs
          </CardTitle>
          <CardDescription>
            Statut des différents canaux de communication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Phone className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-sm">Téléphone</p>
                <Badge variant="secondary" className="text-xs">En ligne</Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-sm">WhatsApp</p>
                <Badge variant="secondary" className="text-xs">En ligne</Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <Smartphone className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-sm">SMS</p>
                <Badge variant="secondary" className="text-xs">En ligne</Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Mail className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium text-sm">Email</p>
                <Badge variant="secondary" className="text-xs">En ligne</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets principaux */}
      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Tickets
          </TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Agents
          </TabsTrigger>
          <TabsTrigger value="channels" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Canaux
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Commandes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <CallCenterTicketList />
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <CallCenterAgentList />
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <CallCenterChannelList />
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <CallCenterOrderList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CallCenterDashboard; 