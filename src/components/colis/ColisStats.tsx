import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  DollarSign,
  Globe,
  MapPin
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'orange' | 'green' | 'blue' | 'yellow' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  color = 'orange' 
}) => {
  const colorClasses = {
    orange: 'text-orange-600 bg-orange-100',
    green: 'text-green-600 bg-green-100',
    blue: 'text-blue-600 bg-blue-100',
    yellow: 'text-yellow-600 bg-yellow-100',
    purple: 'text-purple-600 bg-purple-100'
  };

  return (
    <Card className="bg-white/40 backdrop-blur-md border border-white/30 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {description && (
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <TrendingUp className={`h-3 w-3 mr-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`} />
            <span className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface ColisStatsProps {
  stats?: {
    totalColis: number;
    delivered: number;
    inTransit: number;
    pending: number;
    totalSpent: number;
    thisMonth: number;
    national: number;
    international: number;
  };
}

const ColisStats: React.FC<ColisStatsProps> = ({ 
  stats = {
    totalColis: 25,
    delivered: 18,
    inTransit: 5,
    pending: 2,
    totalSpent: 125000,
    thisMonth: 8,
    national: 15,
    international: 10
  }
}) => {
  const statCards = [
    {
      title: 'Total Colis',
      value: stats.totalColis,
      description: 'Tous les colis',
      icon: Package,
      color: 'orange' as const,
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Livrés',
      value: stats.delivered,
      description: 'Colis livrés avec succès',
      icon: CheckCircle,
      color: 'green' as const,
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'En Transit',
      value: stats.inTransit,
      description: 'Colis en cours de livraison',
      icon: Truck,
      color: 'blue' as const
    },
    {
      title: 'En Attente',
      value: stats.pending,
      description: 'Colis en attente de traitement',
      icon: Clock,
      color: 'yellow' as const
    },
    {
      title: 'Dépensé Total',
      value: `${stats.totalSpent.toLocaleString()} FCFA`,
      description: 'Montant total dépensé',
      icon: DollarSign,
      color: 'purple' as const,
      trend: { value: 15, isPositive: true }
    },
    {
      title: 'Ce Mois',
      value: stats.thisMonth,
      description: 'Colis envoyés ce mois',
      icon: TrendingUp,
      color: 'green' as const
    },
    {
      title: 'National',
      value: stats.national,
      description: 'Colis nationaux',
      icon: MapPin,
      color: 'orange' as const
    },
    {
      title: 'International',
      value: stats.international,
      description: 'Colis internationaux',
      icon: Globe,
      color: 'blue' as const
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Statistiques</h2>
        <Badge className="bg-orange-100 text-orange-800">
          Mis à jour à l'instant
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default ColisStats; 