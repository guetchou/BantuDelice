import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Bell, 
  TrendingUp, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  ShoppingCart,
  Plus,
  Eye,
  Download,
  RefreshCw,
  Settings,
  BarChart3,
  Globe,
  Truck
} from 'lucide-react';

const ColisDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications] = useState([
    {
      id: 1,
      type: 'delivery',
      message: 'Votre colis BD12345678 a été livré',
      time: 'Il y a 2 heures',
      read: false
    },
    {
      id: 2,
      type: 'update',
      message: 'Mise à jour du statut pour BD87654321',
      time: 'Il y a 4 heures',
      read: false
    },
    {
      id: 3,
      type: 'reminder',
      message: 'N\'oubliez pas de récupérer votre colis BD11223344',
      time: 'Il y a 1 jour',
      read: true
    }
  ]);

  const [recentColis] = useState([
    {
      id: 'BD12345678',
      type: 'national',
      status: 'Livré',
      from: 'Brazzaville',
      to: 'Pointe-Noire',
      date: '2024-07-15',
      price: 2500
    },
    {
      id: 'BD87654321',
      type: 'international',
      status: 'En transit',
      from: 'Brazzaville',
      to: 'Paris',
      date: '2024-07-10',
      price: 15000
    },
    {
      id: 'BD11223344',
      type: 'national',
      status: 'En cours de livraison',
      from: 'Brazzaville',
      to: 'Dolisie',
      date: '2024-07-18',
      price: 3000
    }
  ]);

  const [stats] = useState({
    totalColis: 25,
    delivered: 18,
    inTransit: 5,
    pending: 2,
    totalSpent: 125000,
    thisMonth: 8,
    national: 15,
    international: 10
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-100 to-yellow-200">
      {/* Header avec navigation */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/images/logo/logo.png" alt="BantuDelice" className="h-10 w-10 rounded-full border-2 border-yellow-400 shadow" />
              <span className="font-bold text-orange-700 text-xl">BantuDelice Colis</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/colis" className="text-orange-700 hover:text-orange-900 font-medium">Accueil</Link>
              <Link to="/colis/tracking" className="text-orange-700 hover:text-orange-900 font-medium">Suivi</Link>
              <Link to="/colis/tarifs" className="text-orange-700 hover:text-orange-900 font-medium">Tarifs</Link>
              <Link to="/colis/expedier" className="text-orange-700 hover:text-orange-900 font-medium">Expédier</Link>
              <Link to="/colis/historique" className="text-orange-700 hover:text-orange-900 font-medium">Historique</Link>
            </nav>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                    {notifications.filter(n => !n.read).length}
                  </Badge>
                )}
              </Button>
              <Button asChild className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-bold">
                <Link to="/colis/expedier">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau colis
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Dashboard */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-orange-700 mb-2">Tableau de bord</h1>
          <p className="text-gray-600">Gérez vos colis et suivez vos statistiques</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/90 backdrop-blur border-0 shadow-xl sticky top-24">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'overview' 
                        ? 'bg-orange-100 text-orange-700 font-medium' 
                        : 'text-gray-600 hover:text-orange-700'
                    }`}
                  >
                    <BarChart3 className="h-4 w-4 inline mr-2" />
                    Vue d'ensemble
                  </button>
                  <button
                    onClick={() => setActiveTab('colis')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'colis' 
                        ? 'bg-orange-100 text-orange-700 font-medium' 
                        : 'text-gray-600 hover:text-orange-700'
                    }`}
                  >
                    <Package className="h-4 w-4 inline mr-2" />
                    Mes colis
                  </button>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'notifications' 
                        ? 'bg-orange-100 text-orange-700 font-medium' 
                        : 'text-gray-600 hover:text-orange-700'
                    }`}
                  >
                    <Bell className="h-4 w-4 inline mr-2" />
                    Notifications
                  </button>
                  <button
                    onClick={() => setActiveTab('ecommerce')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'ecommerce' 
                        ? 'bg-orange-100 text-orange-700 font-medium' 
                        : 'text-gray-600 hover:text-orange-700'
                    }`}
                  >
                    <ShoppingCart className="h-4 w-4 inline mr-2" />
                    E-commerce
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'settings' 
                        ? 'bg-orange-100 text-orange-700 font-medium' 
                        : 'text-gray-600 hover:text-orange-700'
                    }`}
                  >
                    <Settings className="h-4 w-4 inline mr-2" />
                    Paramètres
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3 space-y-8">
            {/* Vue d'ensemble */}
            {activeTab === 'overview' && (
              <>
                {/* Statistiques principales */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total colis</p>
                          <p className="text-2xl font-bold text-orange-600">{stats.totalColis}</p>
                        </div>
                        <Package className="h-8 w-8 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Livrés</p>
                          <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
                        </div>
                        <Truck className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">En transit</p>
                          <p className="text-2xl font-bold text-blue-600">{stats.inTransit}</p>
                        </div>
                        <Clock className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Dépensé</p>
                          <p className="text-2xl font-bold text-purple-600">{stats.totalSpent.toLocaleString()}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Graphiques et détails */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-700">
                        <TrendingUp className="h-5 w-5" />
                        Activité ce mois
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Colis envoyés</span>
                          <span className="font-semibold">{stats.thisMonth}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">National</span>
                          <span className="font-semibold text-orange-600">{stats.national}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">International</span>
                          <span className="font-semibold text-blue-600">{stats.international}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-700">
                        <Bell className="h-5 w-5" />
                        Notifications récentes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {notifications.slice(0, 3).map((notification) => (
                          <div key={notification.id} className={`p-3 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-orange-50'}`}>
                            <p className="text-sm font-medium text-gray-800">{notification.message}</p>
                            <p className="text-xs text-gray-500">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Colis récents */}
                <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-700">
                      <Package className="h-5 w-5" />
                      Colis récents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentColis.map((colis) => (
                        <div key={colis.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Package className="h-5 w-5 text-orange-500" />
                              <span className="font-bold">{colis.id}</span>
                            </div>
                            <Badge className={colis.type === 'national' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}>
                              {colis.type === 'national' ? 'National' : 'International'}
                            </Badge>
                            <Badge className={
                              colis.status === 'Livré' ? 'bg-green-100 text-green-800' :
                              colis.status === 'En transit' ? 'bg-blue-100 text-blue-800' :
                              'bg-orange-100 text-orange-800'
                            }>
                              {colis.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm text-gray-600">{colis.from} → {colis.to}</div>
                              <div className="text-sm font-medium">{colis.price.toLocaleString()} FCFA</div>
                            </div>
                            <Button asChild size="sm" className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white">
                              <Link to={`/colis/tracking?number=${colis.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Mes colis */}
            {activeTab === 'colis' && (
              <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <Package className="h-5 w-5" />
                    Mes colis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentColis.map((colis) => (
                      <div key={colis.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Package className="h-6 w-6 text-orange-500" />
                            <div>
                              <h3 className="font-bold text-lg">{colis.id}</h3>
                              <p className="text-sm text-gray-600">{colis.from} → {colis.to}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={colis.type === 'national' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}>
                              {colis.type === 'national' ? 'National' : 'International'}
                            </Badge>
                            <Badge className={
                              colis.status === 'Livré' ? 'bg-green-100 text-green-800' :
                              colis.status === 'En transit' ? 'bg-blue-100 text-blue-800' :
                              'bg-orange-100 text-orange-800'
                            }>
                              {colis.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <span className="text-sm text-gray-500">Date d'envoi</span>
                            <div className="font-medium">{colis.date}</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Prix</span>
                            <div className="font-medium">{colis.price.toLocaleString()} FCFA</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Statut</span>
                            <div className="font-medium">{colis.status}</div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button asChild size="sm" className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white">
                            <Link to={`/colis/tracking?number=${colis.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              Suivre
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" className="border-orange-300 text-orange-700">
                            <Download className="h-4 w-4 mr-2" />
                            Étiquette
                          </Button>
                          <Button size="sm" variant="outline" className="border-blue-300 text-blue-700">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Réexpédier
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`p-4 rounded-lg border ${notification.read ? 'bg-gray-50 border-gray-200' : 'bg-orange-50 border-orange-200'}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{notification.message}</p>
                            <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
                          </div>
                          {!notification.read && (
                            <Badge className="bg-orange-500 text-white text-xs">Nouveau</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* E-commerce */}
            {activeTab === 'ecommerce' && (
              <div className="space-y-8">
                <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-700">
                      <ShoppingCart className="h-5 w-5" />
                      Intégration E-commerce
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Widget de suivi</h3>
                        <div className="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto">
                          <pre className="text-sm">{`<script src="https://widget.bantudelice.com/colis.js"></script>
<div id="tracking-widget" 
     data-tracking-number="BD12345678"
     data-api-key="YOUR_API_KEY"
     data-theme="light">
</div>`}</pre>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">API pour boutiques</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-800 mb-2">WooCommerce</h4>
                            <p className="text-sm text-blue-700 mb-3">Plugin WordPress pour l'intégration automatique</p>
                            <Button size="sm" className="bg-blue-600 text-white">Installer</Button>
                          </div>
                          <div className="bg-green-50 rounded-lg p-4">
                            <h4 className="font-semibold text-green-800 mb-2">Shopify</h4>
                            <p className="text-sm text-green-700 mb-3">App pour Shopify avec suivi automatique</p>
                            <Button size="sm" className="bg-green-600 text-white">Installer</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Paramètres */}
            {activeTab === 'settings' && (
              <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <Settings className="h-5 w-5" />
                    Paramètres
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>Notifications par email</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Notifications push</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>SMS pour livraison</span>
                          <input type="checkbox" className="rounded" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Préférences</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
                          <Select defaultValue="fr">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fr">Français</SelectItem>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="ln">Lingala</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Devise</label>
                          <Select defaultValue="fcf">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fcf">FCFA</SelectItem>
                              <SelectItem value="eur">EUR</SelectItem>
                              <SelectItem value="usd">USD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Sécurité</h3>
                      <div className="space-y-3">
                        <Button variant="outline" className="border-orange-300 text-orange-700">
                          Changer le mot de passe
                        </Button>
                        <Button variant="outline" className="border-orange-300 text-orange-700">
                          Régénérer la clé API
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColisDashboardPage; 