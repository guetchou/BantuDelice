import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  Package, 
  Truck,
  DollarSign,
  Users,
  Globe,
  MapPin,
  RefreshCw,
  Play,
  Pause
} from 'lucide-react';

interface LiveMetric {
  id: string;
  label: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'stable';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  unit?: string;
}

interface LiveActivity {
  id: string;
  type: 'delivery' | 'pickup' | 'update' | 'alert';
  message: string;
  time: string;
  colisId?: string;
  location?: string;
}

interface ColisLiveDashboardProps {
  className?: string;
}

const ColisLiveDashboard: React.FC<ColisLiveDashboardProps> = ({ className = "" }) => {
  const [isLive, setIsLive] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [metrics, setMetrics] = useState<LiveMetric[]>([
    {
      id: '1',
      label: 'Colis en transit',
      value: 156,
      change: 12,
      changeType: 'increase',
      icon: Truck,
      color: 'text-blue-600',
      unit: 'colis'
    },
    {
      id: '2',
      label: 'Livraisons aujourd\'hui',
      value: 89,
      change: -5,
      changeType: 'decrease',
      icon: Package,
      color: 'text-green-600',
      unit: 'livraisons'
    },
    {
      id: '3',
      label: 'Chiffre d\'affaires',
      value: 1250000,
      change: 8.5,
      changeType: 'increase',
      icon: DollarSign,
      color: 'text-purple-600',
      unit: 'FCFA'
    },
    {
      id: '4',
      label: 'Clients actifs',
      value: 234,
      change: 3,
      changeType: 'increase',
      icon: Users,
      color: 'text-orange-600',
      unit: 'clients'
    },
    {
      id: '5',
      label: 'Temps moyen de livraison',
      value: 2.4,
      change: -0.3,
      changeType: 'decrease',
      icon: Clock,
      color: 'text-indigo-600',
      unit: 'jours'
    },
    {
      id: '6',
      label: 'Couverture géographique',
      value: 15,
      change: 1,
      changeType: 'increase',
      icon: Globe,
      color: 'text-teal-600',
      unit: 'villes'
    }
  ]);

  const [activities, setActivities] = useState<LiveActivity[]>([
    {
      id: '1',
      type: 'delivery',
      message: 'Colis BD12345678 livré à Pointe-Noire',
      time: 'Il y a 2 minutes',
      colisId: 'BD12345678',
      location: 'Pointe-Noire'
    },
    {
      id: '2',
      type: 'pickup',
      message: 'Nouveau colis ramassé à Brazzaville',
      time: 'Il y a 5 minutes',
      colisId: 'BD87654321',
      location: 'Brazzaville'
    },
    {
      id: '3',
      type: 'update',
      message: 'Mise à jour du statut pour BD11223344',
      time: 'Il y a 8 minutes',
      colisId: 'BD11223344',
      location: 'Dolisie'
    },
    {
      id: '4',
      type: 'alert',
      message: 'Retard signalé sur le colis BD99887766',
      time: 'Il y a 12 minutes',
      colisId: 'BD99887766',
      location: 'Nkayi'
    }
  ]);

  // Mise à jour en temps réel
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simuler des mises à jour de métriques
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.value + Math.floor(Math.random() * 3) - 1,
        change: metric.change + (Math.random() > 0.5 ? 1 : -1) * 0.1
      })));

      // Ajouter de nouvelles activités
      const newActivity: LiveActivity = {
        id: Date.now().toString(),
        type: ['delivery', 'pickup', 'update', 'alert'][Math.floor(Math.random() * 4)] as any,
        message: `Activité automatique ${Date.now()}`,
        time: 'À l\'instant',
        colisId: `BD${Math.floor(Math.random() * 100000000)}`,
        location: ['Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi'][Math.floor(Math.random() * 4)]
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getActivityIcon = (type: LiveActivity['type']) => {
    switch (type) {
      case 'delivery':
        return <Package className="h-4 w-4 text-green-600" />;
      case 'pickup':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'update':
        return <Activity className="h-4 w-4 text-orange-600" />;
      case 'alert':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
  };

  const getActivityColor = (type: LiveActivity['type']) => {
    switch (type) {
      case 'delivery':
        return 'border-green-200 bg-green-50';
      case 'pickup':
        return 'border-blue-200 bg-blue-50';
      case 'update':
        return 'border-orange-200 bg-orange-50';
      case 'alert':
        return 'border-red-200 bg-red-50';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête avec contrôles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <h2 className="text-2xl font-bold text-gray-900">Tableau de bord en temps réel</h2>
          </div>
          <Badge className={isLive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
            {isLive ? 'EN DIRECT' : 'PAUSÉ'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">
            Dernière mise à jour: {currentTime.toLocaleTimeString('fr-FR')}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="border-orange-300 text-orange-700"
          >
            {isLive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isLive ? 'Pause' : 'Reprendre'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="border-orange-300 text-orange-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Métriques en temps réel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.id} className="bg-white/90 backdrop-blur border-0 shadow-xl hover:shadow-2xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${metric.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                    <Icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                  <div className="flex items-center gap-1">
                    {metric.changeType === 'increase' ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : metric.changeType === 'decrease' ? (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    ) : (
                      <Activity className="h-4 w-4 text-gray-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      metric.changeType === 'increase' ? 'text-green-600' :
                      metric.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{metric.label}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {metric.unit === 'FCFA' ? metric.value.toLocaleString() : metric.value}
                    {metric.unit && <span className="text-lg text-gray-500 ml-1">{metric.unit}</span>}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activités en temps réel */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Activity className="h-5 w-5" />
              Activités récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className={`p-4 rounded-lg border ${getActivityColor(activity.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {activity.message}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{activity.time}</span>
                        {activity.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{activity.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Carte de couverture */}
        <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Globe className="h-5 w-5" />
              Couverture géographique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">12</div>
                  <div className="text-sm text-gray-600">Villes nationales</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">8</div>
                  <div className="text-sm text-gray-600">Pays internationaux</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800">Villes principales</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Brazzaville</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Pointe-Noire</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Dolisie</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Nkayi</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ColisLiveDashboard; 