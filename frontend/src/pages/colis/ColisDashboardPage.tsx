import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Loader2,
  Eye,
  FileText,
  Calculator,
  Home,
  LogOut,
  RefreshCw,
  Target,
  Zap,
  Award,
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useColisAuth } from '@/context/ColisAuthContext';
import { toast } from 'sonner';
import QRScanner from '@/components/ui/qr-scanner';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

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
  deliveredAt?: string;
}

interface EnhancedStats {
  total: number;
  pending: number;
  inTransit: number;
  delivered: number;
  cancelled: number;
  totalValue: number;
  avgDeliveryTime: number;
  onTimeDeliveryRate: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  growthRate: number;
}

// Composant de métrique KPI amélioré
const KPICard = React.memo<{
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description?: string;
}>(({ title, value, change, changeType, icon: Icon, color, description }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {change && (
            <div className="flex items-center mt-1">
              {changeType === 'positive' ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : changeType === 'negative' ? (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              ) : (
                <Activity className="h-3 w-3 text-gray-500 mr-1" />
              )}
              <span className={`text-xs ${changeType === 'positive' ? 'text-green-600' : changeType === 'negative' ? 'text-red-600' : 'text-gray-600'}`}>
                {change}
              </span>
            </div>
          )}
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className="p-2 rounded-lg bg-gray-50">
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </CardContent>
  </Card>
));

// Composant de graphique amélioré avec recharts
const EnhancedChart = React.memo<{ 
  data: any[]; 
  title: string; 
  type: 'bar' | 'line' | 'pie';
  color?: string;
}>(({ data, title, type, color = '#f97316' }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        {type === 'bar' ? <BarChart3 className="h-4 w-4 mr-2" /> : 
         type === 'line' ? <TrendingUp className="h-4 w-4 mr-2" /> :
         <Activity className="h-4 w-4 mr-2" />}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="label" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={3}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: color }}
              />
            </LineChart>
          ) : type === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="label" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ label, percent }) => `${label} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#f97316', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'][index % 5]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
));

// Composant de notification d'alerte
const AlertCard = React.memo<{
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  action?: () => void;
  actionText?: string;
}>(({ type, title, message, action, actionText }) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'info': return <AlertCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'error': return 'border-red-200 bg-red-50';
      case 'info': return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <Card className={`border ${getColor()}`}>
      <CardContent className="pt-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
              </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
            {action && actionText && (
                  <Button
                    variant="outline"
                    size="sm"
                onClick={action}
                className="mt-2"
                  >
                {actionText}
                  </Button>
            )}
                </div>
    </div>
      </CardContent>
    </Card>
  );
});

const ColisDashboardPage: React.FC = () => {
  const { user, isAuthenticated, logout } = useColisAuth();
  const [colisItems, setColisItems] = useState<ColisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('overview');

  // Données de test pour démonstration
  const mockData: ColisItem[] = [
    {
      id: '1',
      trackingNumber: 'COL-2024-001',
      status: 'delivered',
      sender: { name: 'Jean Dupont', phone: '+242 06 123 4567' },
      recipient: { name: 'Marie Martin', phone: '+242 06 987 6543', address: 'Brazzaville, Centre-ville' },
      package: { weight: 2.5, description: 'Documents importants', declaredValue: 50000 },
      totalPrice: 15000,
      createdAt: '2024-01-15T10:30:00Z',
      deliveredAt: '2024-01-17T14:20:00Z'
    },
    {
      id: '2',
      trackingNumber: 'COL-2024-002',
      status: 'in_transit',
      sender: { name: 'Pierre Durand', phone: '+242 06 111 2222' },
      recipient: { name: 'Sophie Bernard', phone: '+242 06 333 4444', address: 'Pointe-Noire, Port' },
      package: { weight: 5.0, description: 'Équipements électroniques', declaredValue: 250000 },
      totalPrice: 35000,
      createdAt: '2024-01-16T09:15:00Z'
    },
    {
      id: '3',
      trackingNumber: 'COL-2024-003',
      status: 'pending',
      sender: { name: 'Luc Moreau', phone: '+242 06 555 6666' },
      recipient: { name: 'Anne Petit', phone: '+242 06 777 8888', address: 'Dolisie, Centre' },
      package: { weight: 1.8, description: 'Vêtements', declaredValue: 75000 },
      totalPrice: 12000,
      createdAt: '2024-01-17T11:45:00Z'
    },
    {
      id: '4',
      trackingNumber: 'COL-2024-004',
      status: 'delivered',
      sender: { name: 'Claire Roux', phone: '+242 06 999 0000' },
      recipient: { name: 'Thomas Leroy', phone: '+242 06 111 3333', address: 'Brazzaville, Bacongo' },
      package: { weight: 3.2, description: 'Livres et documents', declaredValue: 30000 },
      totalPrice: 18000,
      createdAt: '2024-01-14T16:20:00Z',
      deliveredAt: '2024-01-16T10:30:00Z'
    },
    {
      id: '5',
      trackingNumber: 'COL-2024-005',
      status: 'cancelled',
      sender: { name: 'Nicolas Blanc', phone: '+242 06 222 4444' },
      recipient: { name: 'Julie Noir', phone: '+242 06 555 7777', address: 'Brazzaville, Poto-Poto' },
      package: { weight: 4.5, description: 'Médicaments', declaredValue: 120000 },
      totalPrice: 25000,
      createdAt: '2024-01-13T08:30:00Z'
    }
  ];

  // Filtrage des données
  const filteredData = useMemo(() => {
    let filtered = colisItems;

    if (searchTerm) {
      filtered = filtered.filter(colis => 
        colis.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        colis.sender?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        colis.recipient?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(colis => colis.status === statusFilter);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      let startDate: Date;
      
      switch (dateFilter) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0);
      }
      
      filtered = filtered.filter(colis => 
        new Date(colis.createdAt) >= startDate
      );
    }

    return filtered;
  }, [colisItems, searchTerm, statusFilter, dateFilter]);

  // Calcul des statistiques avancées
  const enhancedStats = useMemo((): EnhancedStats => {
    const total = colisItems.length;
    const pending = colisItems.filter(colis => colis.status === 'pending').length;
    const inTransit = colisItems.filter(colis => colis.status === 'in_transit').length;
    const delivered = colisItems.filter(colis => colis.status === 'delivered').length;
    const cancelled = colisItems.filter(colis => colis.status === 'cancelled').length;
    
    const totalValue = colisItems.reduce((sum, colis) => {
      const price = typeof colis.totalPrice === 'string' ? parseFloat(colis.totalPrice) : (colis.totalPrice || 0);
      return sum + (isNaN(price) ? 0 : price);
    }, 0);

    const deliveredColis = colisItems.filter(colis => 
      colis.status === 'delivered' && colis.deliveredAt
    );
    
    const avgDeliveryTime = deliveredColis.length > 0 
      ? deliveredColis.reduce((sum, colis) => {
          const created = new Date(colis.createdAt);
          const delivered = new Date(colis.deliveredAt!);
          return sum + (delivered.getTime() - created.getTime());
        }, 0) / deliveredColis.length / (1000 * 60 * 60 * 24)
      : 0;

    const onTimeDeliveryRate = delivered > 0 ? Math.round((delivered / total) * 100) : 0;

    const thisMonth = colisItems.filter(colis => {
      const created = new Date(colis.createdAt);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    });
    
    const lastMonth = colisItems.filter(colis => {
      const created = new Date(colis.createdAt);
      const now = new Date();
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return created.getMonth() === lastMonthDate.getMonth() && created.getFullYear() === lastMonthDate.getFullYear();
    });

    const revenueThisMonth = thisMonth.reduce((sum, colis) => sum + (colis.totalPrice || 0), 0);
    const revenueLastMonth = lastMonth.reduce((sum, colis) => sum + (colis.totalPrice || 0), 0);
    
    const growthRate = revenueLastMonth > 0 
      ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100 
      : 0;

    return {
      total,
      pending,
      inTransit,
      delivered,
      cancelled,
      totalValue,
      avgDeliveryTime: Math.round(avgDeliveryTime * 10) / 10,
      onTimeDeliveryRate,
      revenueThisMonth,
      revenueLastMonth,
      growthRate: Math.round(growthRate * 10) / 10
    };
  }, [colisItems]);

  // Données pour les graphiques
  const chartData = useMemo(() => {
    const evolutionData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayColis = colisItems.filter(colis => {
        const created = new Date(colis.createdAt);
        return created.toDateString() === date.toDateString();
      });
      
      return {
        label: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        value: dayColis.length
      };
    });

    const statusData = [
      { label: 'En attente', value: enhancedStats.pending },
      { label: 'En transit', value: enhancedStats.inTransit },
      { label: 'Livré', value: enhancedStats.delivered },
      { label: 'Annulé', value: enhancedStats.cancelled }
    ];

    return { evolutionData, statusData };
  }, [colisItems, enhancedStats]);

  // Données des cartes KPI
  const kpiCardsData = useMemo(() => [
    {
      title: 'Total Expéditions',
      value: enhancedStats.total,
      icon: Package,
      color: 'text-orange-600',
      description: 'Toutes les expéditions'
    },
    {
      title: 'En Transit',
      value: enhancedStats.inTransit,
      icon: Truck,
      color: 'text-blue-600',
      description: 'Actuellement en cours'
    },
    {
      title: 'Taux de Livraison',
      value: `${enhancedStats.onTimeDeliveryRate}%`,
      icon: Target,
      color: 'text-green-600',
      description: 'Livraisons réussies'
    },
    {
      title: 'Revenus du Mois',
      value: `${enhancedStats.revenueThisMonth.toLocaleString()} FCFA`,
      change: `${enhancedStats.growthRate > 0 ? '+' : ''}${enhancedStats.growthRate}%`,
      changeType: (enhancedStats.growthRate > 0 ? 'positive' : 'negative') as 'positive' | 'negative',
      icon: DollarSign,
      color: 'text-purple-600',
      description: 'vs mois précédent'
    },
    {
      title: 'Temps Moyen',
      value: `${enhancedStats.avgDeliveryTime} jours`,
      icon: Clock,
      color: 'text-yellow-600',
      description: 'Délai de livraison'
    },
    {
      title: 'Valeur Totale',
      value: `${enhancedStats.totalValue.toLocaleString()} FCFA`,
      icon: Award,
      color: 'text-indigo-600',
      description: 'Valeur des expéditions'
    }
  ], [enhancedStats]);

  // Charger les données
  const loadUserData = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Utiliser les données de test pour la démonstration
      setTimeout(() => {
        setColisItems(mockData);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des données');
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
  };

  const toggleQRScanner = () => {
    setShowQRScanner(!showQRScanner);
  };

  const handleQRScan = (result: string) => {
    setSearchTerm(result);
    setShowQRScanner(false);
    toast.success('Code QR scanné avec succès');
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Tracking', 'Statut', 'Expéditeur', 'Destinataire', 'Prix', 'Date'],
      ...filteredData.map(colis => [
        colis.trackingNumber,
        colis.status,
        colis.sender.name,
        colis.recipient.name,
        colis.totalPrice.toString(),
        new Date(colis.createdAt).toLocaleDateString('fr-FR')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expeditions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Export CSV téléchargé');
  };

  const handleViewDetails = (trackingNumber: string) => {
    // Navigation vers la page de détails
    toast.info(`Affichage des détails pour ${trackingNumber}`);
  };

  const handleDownloadLabel = (colisId: string) => {
    toast.success('Étiquette téléchargée');
  };

  const handleShare = (colisId: string) => {
    toast.success('Lien partagé');
  };

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
      {/* Navigation */}
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
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard Professionnel
              </h1>
              <p className="text-gray-600">
                Vue d'ensemble complète de vos expéditions avec analyses avancées
              </p>
            </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Button variant="outline" onClick={loadUserData}>
              <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Link to="/colis/expedition">
              <Button>
                  <Plus className="h-4 w-4 mr-2" />
                + Nouvelle expédition
                </Button>
              </Link>
            </div>

          {/* Notifications */}
          <div className="mb-6 space-y-3">
            {enhancedStats.pending > 0 && (
              <AlertCard
                type="warning"
                title="Expéditions en attente"
                message={`${enhancedStats.pending} expédition(s) nécessitent votre attention`}
                action={() => setStatusFilter('pending')}
                actionText="Voir les détails"
              />
            )}
            {enhancedStats.growthRate > 0 && (
              <AlertCard
                type="success"
                title="Croissance positive"
                message={`Vos revenus ont augmenté de ${enhancedStats.growthRate}% ce mois-ci`}
              />
            )}
          </div>

          {/* Filtres */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Recherche
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher par tracking, nom..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Statut
                  </label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="in_transit">En transit</SelectItem>
                      <SelectItem value="delivered">Livré</SelectItem>
                      <SelectItem value="cancelled">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Période
                  </label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les dates" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les dates</SelectItem>
                      <SelectItem value="today">Aujourd'hui</SelectItem>
                      <SelectItem value="week">7 derniers jours</SelectItem>
                      <SelectItem value="month">30 derniers jours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={toggleQRScanner}
                    className="w-full"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Scanner QR
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="analytics">Analyses</TabsTrigger>
              <TabsTrigger value="data">Données</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kpiCardsData.map((cardData, index) => (
                  <KPICard key={index} {...cardData} />
                ))}
              </div>

              {/* Graphiques */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EnhancedChart data={chartData.evolutionData} title="Évolution des Expéditions" type="line" />
                <EnhancedChart data={chartData.statusData} title="Répartition par Statut" type="pie" />
              </div>

              {/* Actions rapides */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    Actions Rapides
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Link to="/colis/expedition">
                    <Button className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle expédition
                    </Button>
                  </Link>
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
                  <Button variant="outline" className="w-full justify-start" onClick={handleExportCSV}>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter les données
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EnhancedChart data={chartData.evolutionData} title="Évolution des Expéditions" type="line" />
                <EnhancedChart data={chartData.statusData} title="Répartition par Statut" type="pie" />
              </div>
            </TabsContent>

            <TabsContent value="data" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Données des Expéditions</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {filteredData.length} résultat{filteredData.length > 1 ? 's' : ''}
                      </span>
                      <Button variant="outline" size="sm" onClick={handleExportCSV}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                      <span className="ml-2">Chargement...</span>
                    </div>
                  ) : filteredData.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Aucun résultat trouvé
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Essayez de modifier vos critères de recherche
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3 font-medium">Tracking</th>
                            <th className="text-left p-3 font-medium">Statut</th>
                            <th className="text-left p-3 font-medium">Expéditeur</th>
                            <th className="text-left p-3 font-medium">Destinataire</th>
                            <th className="text-left p-3 font-medium">Prix</th>
                            <th className="text-left p-3 font-medium">Date</th>
                            <th className="text-left p-3 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredData.map((colis) => (
                            <tr key={colis.id} className="border-b hover:bg-gray-50">
                              <td className="p-3 font-medium">{colis.trackingNumber}</td>
                              <td className="p-3">
                                <Badge variant={colis.status === 'delivered' ? 'default' : 'secondary'}>
                                  {colis.status === 'delivered' ? 'Livré' : 
                                   colis.status === 'in_transit' ? 'En transit' :
                                   colis.status === 'pending' ? 'En attente' : 'Annulé'}
                                </Badge>
                              </td>
                              <td className="p-3">{colis.sender.name}</td>
                              <td className="p-3">{colis.recipient.name}</td>
                              <td className="p-3 font-medium">
                                {(colis.totalPrice || 0).toLocaleString()} FCFA
                              </td>
                              <td className="p-3 text-sm text-gray-600">
                                {new Date(colis.createdAt).toLocaleDateString('fr-FR')}
                              </td>
                              <td className="p-3">
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewDetails(colis.trackingNumber)}
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownloadLabel(colis.id)}
                                  >
                                    <Download className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleShare(colis.id)}
                                  >
                                    <Share2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
};

ColisDashboardPage.displayName = 'ColisDashboardPage';

export default ColisDashboardPage; 