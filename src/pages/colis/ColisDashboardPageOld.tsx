import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  BarChart3,
  Calendar,
  Plus,
  Search,
  Filter,
  Download,
  Share2,
  Bell,
  Settings,
  Loader2
} from 'lucide-react';
import ColisStatus from '@/components/colis/ColisStatus';
import NotificationSystem from '@/components/colis/NotificationSystem';
import AuthGate from '@/components/auth/AuthGate';
import { useColisAuth } from '@/context/ColisAuthContext';
import { toast } from 'sonner';

interface ColisItem {
  id: string;
  status: 'pending' | 'confirmed' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
  steps: any[];
  sender: {
    name: string;
    phone: string;
  };
  recipient: {
    name: string;
    phone: string;
    address: string;
  };
  package: {
    weight: number;
    description: string;
    declaredValue: number;
  };
  price: number;
  createdAt: string;
  estimatedDelivery?: string;
}

const ColisDashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useColisAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [colisItems, setColisItems] = useState<ColisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0,
    totalValue: 0
  });

  // Charger les vraies données de l'utilisateur connecté
  useEffect(() => {
    const loadUserData = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Récupérer l'historique des colis de l'utilisateur
        const response = await fetch(`/api/colis/history/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setColisItems(data.data || []);
          
          // Calculer les statistiques
          const total = data.data?.length || 0;
          const pending = data.data?.filter((colis: any) => colis.status === 'pending').length || 0;
          const inTransit = data.data?.filter((colis: any) => colis.status === 'in_transit').length || 0;
          const delivered = data.data?.filter((colis: any) => colis.status === 'delivered').length || 0;
          const totalValue = data.data?.reduce((sum: number, colis: any) => sum + (colis.totalPrice || 0), 0) || 0;
          
          setStats({
            total,
            pending,
            inTransit,
            delivered,
            totalValue
          });
        } else {
          // Si pas de données, utiliser des données par défaut
          setColisItems([]);
          setStats({
            total: 0,
            pending: 0,
            inTransit: 0,
            delivered: 0,
            totalValue: 0
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast.error('Erreur lors du chargement des données');
        setColisItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [isAuthenticated, user]);
      
      
  }, []);

  const handleViewDetails = (colisId: string) => {
    console.log('Voir détails du colis:', colisId);
    // Navigation vers la page de détails
  };

  const handleDownloadLabel = (colisId: string) => {
    console.log('Télécharger étiquette:', colisId);
    // Logique de téléchargement
  };

  const handleShare = (colisId: string) => {
    console.log('Partager colis:', colisId);
    // Logique de partage
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-200">
                <Package className="h-4 w-4 mr-2" />
                Tableau de bord Colis
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <AuthGate modalTitle="Connectez-vous pour expédier">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel envoi
                </Button>
              </AuthGate>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Total Colis</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600">En attente</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">En transit</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.inTransit}</p>
                </div>
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Livrés</p>
                  <p className="text-2xl font-bold text-green-900">{stats.delivered}</p>
                </div>
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600">Valeur totale</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {stats.totalValue.toLocaleString()} FCFA
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets principaux */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="colis">Mes Colis</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Activité récente */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Activité récente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {colisItems.slice(0, 3).map((colis) => (
                      <div key={colis.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="p-2 bg-orange-100 rounded-full">
                          <Package className="h-4 w-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Colis #{colis.id}</p>
                          <p className="text-sm text-gray-600">
                            {colis.recipient.name} • {colis.recipient.address}
                          </p>
                        </div>
                        <Badge className={colis.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                          {colis.status === 'delivered' ? 'Livré' : 'En cours'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions rapides */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Actions rapides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <AuthGate modalTitle="Connectez-vous pour expédier">
                    <Button className="w-full justify-start">
                      <Package className="h-4 w-4 mr-2" />
                      Expédier un colis
                    </Button>
                  </AuthGate>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="h-4 w-4 mr-2" />
                    Suivre un colis
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger étiquettes
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Share2 className="h-4 w-4 mr-2" />
                    Partager un suivi
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Mes Colis */}
          <TabsContent value="colis" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Mes Colis</h2>
                <p className="text-gray-600">Suivez tous vos envois en temps réel</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </Button>
                <AuthGate modalTitle="Connectez-vous pour expédier">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvel envoi
                  </Button>
                </AuthGate>
              </div>
            </div>

            <ColisStatus
              items={colisItems}
              onViewDetails={handleViewDetails}
              onDownloadLabel={handleDownloadLabel}
              onShare={handleShare}
            />
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <NotificationSystem userId="user_123" />
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Statistiques mensuelles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Colis expédiés</span>
                      <span className="font-bold">24</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Colis livrés</span>
                      <span className="font-bold text-green-600">22</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>En transit</span>
                      <span className="font-bold text-blue-600">2</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Valeur totale</span>
                      <span className="font-bold">84 500 FCFA</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Taux de livraison</span>
                      <span className="font-bold text-green-600">91.7%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Délai moyen</span>
                      <span className="font-bold">2.3 jours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Satisfaction client</span>
                      <span className="font-bold text-green-600">4.8/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ColisDashboardPage; 