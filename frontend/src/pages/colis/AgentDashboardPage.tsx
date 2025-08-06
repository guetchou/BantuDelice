import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Package, 
  MapPin, 
  CreditCard, 
  User, 
  Phone,
  Camera,
  Printer,
  Bell,
  Edit,
  Search,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Settings,
  LogOut,
  QrCode,
  FileText,
  Truck,
  DollarSign,
  Smartphone
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'busy';
  lastActivity: string;
}

interface Colis {
  id: string;
  trackingNumber: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'returned';
  sender: string;
  recipient: string;
  weight: number;
  price: number;
  createdAt: string;
}

interface DailyStats {
  totalColis: number;
  totalRevenue: number;
  deliveryRate: number;
  pendingColis: number;
}

const AgentDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('expeditions');
  const [agent, setAgent] = useState<Agent>({
    id: 'AG-254',
    name: 'Agent N°BD-254',
    location: 'Agence Bacongo, Brazzaville',
    status: 'online',
    lastActivity: '2 min'
  });
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    totalColis: 24,
    totalRevenue: 158000,
    deliveryRate: 92,
    pendingColis: 3
  });
  const [colisList, setColisList] = useState<Colis[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simuler le chargement des données
    const mockColis: Colis[] = [
      {
        id: '1',
        trackingNumber: 'BD123456',
        status: 'pending',
        sender: 'Jean Dupont',
        recipient: 'Marie Martin',
        weight: 2.5,
        price: 3500,
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        trackingNumber: 'BD789012',
        status: 'in_transit',
        sender: 'Pierre Durand',
        recipient: 'Sophie Bernard',
        weight: 1.8,
        price: 2800,
        createdAt: '2024-01-15T09:15:00Z'
      }
    ];
    setColisList(mockColis);
  }, []);

  const quickActions = [
    { id: 'new_expedition', label: 'Nouvelle expédition', icon: Package, color: 'bg-blue-600' },
    { id: 'search_colis', label: 'Recherche colis', icon: Search, color: 'bg-green-600' },
    { id: 'close_day', label: 'Clôturer journée', icon: CheckCircle, color: 'bg-orange-600' }
  ];

  const paymentMethods = [
    { id: 'cash', label: 'Espèces', icon: DollarSign },
    { id: 'airtel', label: 'Airtel Money', icon: Smartphone },
    { id: 'card', label: 'Carte Pro', icon: CreditCard }
  ];

  const packagePresets = [
    { label: 'Document A4', weight: 0.2, dimensions: '30x21x1' },
    { label: 'Colis Standard', weight: 5, dimensions: '40x30x20' },
    { label: 'Petit colis', weight: 2, dimensions: '25x20x15' }
  ];

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'new_expedition':
        setActiveTab('expeditions');
        break;
      case 'search_colis':
        setActiveTab('tracking');
        break;
      case 'close_day':
        // Logique de clôture de journée
        console.log('Clôture de journée');
        break;
    }
  };

  const ExpeditionManager = () => (
    <div className="space-y-6">
      {/* Saisie rapide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Saisie Rapide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Téléphone client</label>
              <div className="flex gap-2">
                <Input
                  placeholder="06 12 34 56 78"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Présets d'emballage</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">Sélectionner un preset</option>
                {packagePresets.map((preset) => (
                  <option key={preset.label} value={preset.label}>
                    {preset.label} ({preset.weight}kg, {preset.dimensions}cm)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Poids (kg)</label>
              <Input type="number" step="0.1" placeholder="0.0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Dimensions (cm)</label>
              <Input placeholder="L x l x H" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Prix (FCFA)</label>
              <Input type="number" placeholder="0" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">
              <Camera className="h-4 w-4 mr-2" />
              Scan CNI
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Upload reçu
            </Button>
            <Button className="flex-1">
              <Package className="h-4 w-4 mr-2" />
              Créer l'expédition
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des expéditions du jour */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Expéditions du jour ({colisList.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {colisList.map((colis) => (
              <div key={colis.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Package className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium">{colis.trackingNumber}</div>
                    <div className="text-sm text-gray-600">
                      {colis.sender} → {colis.recipient}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={colis.status === 'pending' ? 'secondary' : 'default'}>
                    {colis.status === 'pending' ? 'En attente' : 
                     colis.status === 'in_transit' ? 'En transit' : 'Livré'}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Printer className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const TrackingTool = () => (
    <div className="space-y-6">
      {/* Carte de suivi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Suivi en Temps Réel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Carte interactive des colis</p>
              <p className="text-sm">Intégration GPS en cours</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions de suivi */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start">
              <Bell className="h-4 w-4 mr-2" />
              Notifier le client
            </Button>
            <Button variant="outline" className="justify-start">
              <Edit className="h-4 w-4 mr-2" />
              Modifier l'adresse
            </Button>
            <Button variant="outline" className="justify-start">
              <QrCode className="h-4 w-4 mr-2" />
              Scanner code-barres
            </Button>
            <Button variant="outline" className="justify-start">
              <Truck className="h-4 w-4 mr-2" />
              Marquer comme livré
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const CashRegister = () => (
    <div className="space-y-6">
      {/* Méthodes de paiement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Méthodes de Paiement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {paymentMethods.map((method) => (
              <Button
                key={method.id}
                variant="outline"
                className="h-20 flex-col gap-2"
              >
                <method.icon className="h-6 w-6" />
                <span className="text-sm">{method.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transactions du jour */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions du jour</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <div className="font-medium">BD123456</div>
                <div className="text-sm text-gray-600">Espèces</div>
              </div>
              <div className="text-right">
                <div className="font-medium">3 500 FCFA</div>
                <div className="text-sm text-green-600">Payé</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="font-medium">BD789012</div>
                <div className="text-sm text-gray-600">Airtel Money</div>
              </div>
              <div className="text-right">
                <div className="font-medium">2 800 FCFA</div>
                <div className="text-sm text-blue-600">En attente</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Impression */}
      <Card>
        <CardHeader>
          <CardTitle>Impression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Imprimer reçu
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Générer étiquette
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50">
      {/* En-tête Agent */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h1 className="font-semibold text-gray-900">{agent.name}</h1>
                  <p className="text-sm text-gray-600">{agent.location}</p>
                </div>
              </div>
              <Badge className={agent.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {agent.status === 'online' ? 'En ligne' : 'Hors ligne'}
              </Badge>
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
        {/* Actions rapides */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              className={`${action.color} hover:opacity-90 text-white h-16`}
              onClick={() => handleQuickAction(action.id)}
            >
              <action.icon className="h-5 w-5 mr-2" />
              {action.label}
            </Button>
          ))}
        </div>

        {/* Statistiques journalières */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Colis aujourd'hui</p>
                  <p className="text-2xl font-bold">{dailyStats.totalColis}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Chiffre journalier</p>
                  <p className="text-2xl font-bold">{dailyStats.totalRevenue.toLocaleString()} FCFA</p>
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
                  <p className="text-2xl font-bold">{dailyStats.deliveryRate}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En attente</p>
                  <p className="text-2xl font-bold">{dailyStats.pendingColis}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets principaux */}
        <Tabs defaultValue={activeTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="expeditions">Expéditions</TabsTrigger>
            <TabsTrigger value="tracking">Suivi</TabsTrigger>
            <TabsTrigger value="cash">Caisse</TabsTrigger>
          </TabsList>

          <TabsContent value="expeditions">
            <ExpeditionManager />
          </TabsContent>

          <TabsContent value="tracking">
            <TrackingTool />
          </TabsContent>

          <TabsContent value="cash">
            <CashRegister />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgentDashboardPage; 