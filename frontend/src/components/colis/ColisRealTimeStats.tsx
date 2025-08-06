import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, CheckCircle, Clock, TrendingUp, Users, Globe } from 'lucide-react';

interface RealTimeStat {
  id: string;
  label: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'stable';
  icon: React.ComponentType<unknown>;
  color: string;
  bgColor: string;
}

interface ColisRealTimeStatsProps {
  refreshInterval?: number; // en millisecondes
  showAnimations?: boolean;
}

const ColisRealTimeStats: React.FC<ColisRealTimeStatsProps> = ({
  refreshInterval = 30000, // 30 secondes par défaut
  showAnimations = true
}) => {
  const [stats, setStats] = useState<RealTimeStat[]>([
    {
      id: 'total-shipments',
      label: 'Total Expéditions',
      value: 1247,
      change: 12,
      changeType: 'increase',
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      id: 'in-transit',
      label: 'En Transit',
      value: 89,
      change: -3,
      changeType: 'decrease',
      icon: Truck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'delivered',
      label: 'Livrés Aujourd\'hui',
      value: 156,
      change: 8,
      changeType: 'increase',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 'pending',
      label: 'En Attente',
      value: 23,
      change: 0,
      changeType: 'stable',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      id: 'revenue',
      label: 'Revenus (FCFA)',
      value: 2847500,
      change: 15,
      changeType: 'increase',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 'active-users',
      label: 'Utilisateurs Actifs',
      value: 342,
      change: 5,
      changeType: 'increase',
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ]);

  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isUpdating, setIsUpdating] = useState(false);

  // Simulation de mises à jour en temps réel
  const updateStats = () => {
    setIsUpdating(true);
    
    // Simuler un délai de mise à jour
    setTimeout(() => {
      setStats(prevStats => 
        prevStats.map(stat => ({
          ...stat,
          value: stat.value + Math.floor(Math.random() * 10) - 5, // Changement aléatoire
          change: Math.floor(Math.random() * 20) - 10,
          changeType: Math.random() > 0.5 ? 'increase' : 'decrease'
        }))
      );
      setLastUpdate(new Date());
      setIsUpdating(false);
    }, 1000);
  };

  useEffect(() => {
    const interval = setInterval(updateStats, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const formatValue = (value: number, label: string) => {
    if (label.includes('Revenus')) {
      return `${value.toLocaleString('fr-FR')} FCFA`;
    }
    return value.toLocaleString('fr-FR');
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'decrease':
        return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      default:
        return <div className="h-3 w-3" />;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec indicateur de mise à jour */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Statistiques en Temps Réel</h2>
          <p className="text-gray-600">Dernière mise à jour : {lastUpdate.toLocaleTimeString('fr-FR')}</p>
        </div>
        <div className="flex items-center gap-2">
          {isUpdating && (
            <div className="flex items-center gap-2 text-orange-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
              <span className="text-sm">Mise à jour...</span>
            </div>
          )}
          <Badge variant="outline" className="border-orange-300 text-orange-700">
            <Globe className="h-3 w-3 mr-1" />
            En direct
          </Badge>
        </div>
      </div>

      {/* Grille de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.id} 
              className={`bg-white/90 backdrop-blur border-0 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                showAnimations && isUpdating ? 'animate-pulse' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className="flex items-center gap-1">
                    {getChangeIcon(stat.changeType)}
                    <span className={`text-xs font-medium ${getChangeColor(stat.changeType)}`}>
                      {stat.change > 0 ? '+' : ''}{stat.change}%
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {formatValue(stat.value, stat.label)}
                  </p>
                  
                  {/* Barre de progression */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        stat.changeType === 'increase' ? 'bg-green-500' : 
                        stat.changeType === 'decrease' ? 'bg-red-500' : 'bg-gray-400'
                      }`}
                      style={{ 
                        width: `${Math.min(100, Math.max(0, 50 + (stat.change * 2)))}%` 
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Indicateurs de performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Taux de livraison</p>
                <p className="text-2xl font-bold text-green-800">98.5%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Temps moyen</p>
                <p className="text-2xl font-bold text-blue-800">2.3 jours</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Satisfaction</p>
                <p className="text-2xl font-bold text-orange-800">4.8/5</p>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique de tendance (simplifié) */}
      <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            Tendances des 7 derniers jours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-end justify-between gap-2">
            {[...Array(7)].map((_, i) => {
              const height = Math.random() * 60 + 20;
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-orange-400 to-orange-300 rounded-t transition-all duration-500"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-gray-500 mt-2">
                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i]}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColisRealTimeStats; 