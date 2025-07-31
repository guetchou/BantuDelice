import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Loader2,
  Eye,
  FileText,
  Calculator,
  Home,
  LogOut
} from 'lucide-react';
import { useColisAuth } from '@/context/ColisAuthContext';
import { toast } from 'sonner';
import QRScanner from '@/components/ui/qr-scanner';

interface ColisItem {
  id: string;
  trackingNumber: string;
  status: 'pending' | 'confirmed' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
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
  totalPrice: number;
  createdAt: string;
  estimatedDelivery?: string;
}

interface Stats {
  total: number;
  pending: number;
  inTransit: number;
  delivered: number;
  totalValue: number;
}

// Composant de statistiques mémorisé
const StatsCard = React.memo<{
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  iconColor: string;
}>(({ title, value, icon: Icon, color, iconColor }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${iconColor}`} />
      </div>
    </CardContent>
  </Card>
));

// Composant de carte de colis mémorisé
const ColisCard = React.memo<{
  colis: ColisItem;
  onViewDetails: (trackingNumber: string) => void;
  onDownloadLabel: (colisId: string) => void;
  onShare: (colisId: string) => void;
}>(({ colis, onViewDetails, onDownloadLabel, onShare }) => {
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case 'delivered': return 'Livré';
      case 'in_transit': return 'En transit';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  }, []);

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Badge className={getStatusColor(colis.status)}>
            {getStatusText(colis.status)}
          </Badge>
          <span className="font-mono text-sm text-gray-600">
            {colis.trackingNumber}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(colis.trackingNumber)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownloadLabel(colis.id)}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onShare(colis.id)}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <p className="font-medium text-gray-900">Expéditeur</p>
          <p className="text-gray-600">{colis.sender?.name || 'N/A'}</p>
          <p className="text-gray-500">{colis.sender?.phone || 'N/A'}</p>
        </div>
        <div>
          <p className="font-medium text-gray-900">Destinataire</p>
          <p className="text-gray-600">{colis.recipient?.name || 'N/A'}</p>
          <p className="text-gray-500">{colis.recipient?.phone || 'N/A'}</p>
        </div>
        <div>
          <p className="font-medium text-gray-900">Détails</p>
          <p className="text-gray-600">{colis.package?.weight || 0}kg</p>
          <p className="text-gray-500">{(colis.totalPrice || 0).toLocaleString()} FCFA</p>
        </div>
      </div>
    </div>
  );
});

// Composant de navigation mémorisé
const DashboardNavbar = React.memo<{
  user: any;
  onLogout: () => void;
}>(({ user, onLogout }) => (
  <nav className="bg-white border-b border-gray-200 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold text-gray-900">BantuDelice</span>
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">Accueil</Link>
            <Link to="/colis/dashboard" className="text-orange-600 font-medium">Dashboard</Link>
            <Link to="/colis/expedition" className="text-gray-600 hover:text-gray-900">Nouvelle expédition</Link>
            <Link to="/colis/tracking" className="text-gray-600 hover:text-gray-900">Suivi colis</Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Bonjour, {user?.name}</span>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>
    </div>
  </nav>
));

// Composant de statistiques détaillées mémorisé
const DetailedStats = React.memo<{
  stats: Stats;
}>(({ stats }) => (
  <Card>
    <CardHeader>
      <CardTitle>Statistiques</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Taux de livraison</span>
        <span className="font-semibold">
          {stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0}%
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">En transit</span>
        <span className="font-semibold text-blue-600">{stats.inTransit}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Valeur moyenne</span>
        <span className="font-semibold">
          {stats.total > 0 ? Math.round(stats.totalValue / stats.total).toLocaleString() : 'N/A'} FCFA
        </span>
      </div>
    </CardContent>
  </Card>
));

const ColisDashboardPage: React.FC = React.memo(() => {
  const { user, isAuthenticated, logout } = useColisAuth();
  const [colisItems, setColisItems] = useState<ColisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0,
    totalValue: 0
  });

  // Calcul des statistiques mémorisé
  const calculatedStats = useMemo(() => {
    const total = colisItems.length;
    const pending = colisItems.filter(colis => colis.status === 'pending').length;
    const inTransit = colisItems.filter(colis => colis.status === 'in_transit').length;
    const delivered = colisItems.filter(colis => colis.status === 'delivered').length;
    const totalValue = colisItems.reduce((sum, colis) => {
      const price = typeof colis.totalPrice === 'string' ? parseFloat(colis.totalPrice) : (colis.totalPrice || 0);
      return sum + (isNaN(price) ? 0 : price);
    }, 0);

    return { total, pending, inTransit, delivered, totalValue };
  }, [colisItems]);

  // Mise à jour des stats quand les données changent
  useEffect(() => {
    setStats(calculatedStats);
  }, [calculatedStats]);

  // Charger les vraies données de l'utilisateur connecté
  const loadUserData = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`/api/colis/history/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setColisItems(data.data || []);
      } else {
        setColisItems([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Erreur lors du chargement des données');
      setColisItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Handlers mémorisés
  const handleViewDetails = useCallback((trackingNumber: string) => {
    window.open(`/colis/tracking/${trackingNumber}`, '_blank');
  }, []);

  const handleDownloadLabel = useCallback((colisId: string) => {
    toast.info('Téléchargement de l\'étiquette...');
  }, []);

  const handleShare = useCallback((colisId: string) => {
    const colis = colisItems.find(c => c.id === colisId);
    if (colis && navigator.share) {
      navigator.share({
        title: `Suivi de mon colis ${colis.trackingNumber}`,
        text: `Suivez mon colis ${colis.trackingNumber} sur BantuDelice`,
        url: `${window.location.origin}/colis/tracking/${colis.trackingNumber}`
      });
    } else {
      toast.info('Partage non supporté sur ce navigateur');
    }
  }, [colisItems]);

  const handleQRScan = useCallback((trackingNumber: string) => {
    window.open(`/colis/tracking/${trackingNumber}`, '_blank');
    toast.success(`Suivi du colis ${trackingNumber}`);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    toast.success('Déconnexion réussie');
  }, [logout]);

  const toggleQRScanner = useCallback(() => {
    setShowQRScanner(prev => !prev);
  }, []);

  // Données des cartes de statistiques mémorisées
  const statsCardsData = useMemo(() => [
    {
      title: 'Total Colis',
      value: stats.total,
      icon: Package,
      color: '',
      iconColor: 'text-orange-500'
    },
    {
      title: 'En transit',
      value: stats.inTransit,
      icon: Truck,
      color: 'text-blue-600',
      iconColor: 'text-blue-500'
    },
    {
      title: 'Livrés',
      value: stats.delivered,
      icon: BarChart3,
      color: 'text-green-600',
      iconColor: 'text-green-500'
    },
    {
      title: 'En attente',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-600',
      iconColor: 'text-yellow-500'
    },
    {
      title: 'Valeur totale',
      value: stats.totalValue > 0 ? `${stats.totalValue.toLocaleString()} FCFA` : '0 FCFA',
      icon: DollarSign,
      color: 'text-purple-600',
      iconColor: 'text-purple-500'
    }
  ], [stats]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-orange-500" />
            <h2 className="text-xl font-semibold mb-2">Accès requis</h2>
            <p className="text-gray-600 mb-4">Connectez-vous pour accéder à votre dashboard</p>
            <Link to="/colis/auth">
              <Button className="w-full">Se connecter</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <DashboardNavbar user={user} onLogout={handleLogout} />

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard Colis
              </h1>
              <p className="text-gray-600">
                Bienvenue {user?.name}, voici un aperçu de vos expéditions
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/colis/expedition">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle expédition
                </Button>
              </Link>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {statsCardsData.map((cardData, index) => (
              <StatsCard key={index} {...cardData} />
            ))}
          </div>

          {/* Contenu principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Liste des colis */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Mes Colis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mt-6">
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                        <span className="ml-2">Chargement...</span>
                      </div>
                    ) : colisItems.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Aucun colis trouvé
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Vous n'avez pas encore créé d'expéditions
                        </p>
                        <Link to="/colis/expedition">
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Créer votre première expédition
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {colisItems.map((colis) => (
                          <ColisCard
                            key={colis.id}
                            colis={colis}
                            onViewDetails={handleViewDetails}
                            onDownloadLabel={handleDownloadLabel}
                            onShare={handleShare}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions rapides */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/colis/expedition">
                    <Button className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle expédition
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={toggleQRScanner}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Scanner QR Code
                  </Button>
                  <Link to="/colis/tracking">
                    <Button variant="outline" className="w-full justify-start">
                      <Search className="h-4 w-4 mr-2" />
                      Suivre un colis
                    </Button>
                  </Link>
                  <Link to="/colis/tarification">
                    <Button variant="outline" className="w-full justify-start">
                      <Calculator className="h-4 w-4 mr-2" />
                      Calculer un tarif
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Notifications récentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Aucune notification</p>
                  </div>
                </CardContent>
              </Card>

              {/* Statistiques détaillées */}
              <DetailedStats stats={stats} />
            </div>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={showQRScanner}
        onScan={handleQRScan}
        onClose={toggleQRScanner}
      />
    </div>
  );
});

ColisDashboardPage.displayName = 'ColisDashboardPage';

export default ColisDashboardPage; 