
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Truck, 
  Users, 
  DollarSign,
  Clock,
  MapPin,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('week');

  const stats = [
    {
      title: 'Livraisons totales',
      value: '1,247',
      change: '+12.5%',
      trend: 'up',
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: 'Revenus',
      value: '2.4M FCFA',
      change: '+8.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Clients actifs',
      value: '892',
      change: '+5.7%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Temps moyen',
      value: '2.3h',
      change: '-15.2%',
      trend: 'down',
      icon: Clock,
      color: 'text-orange-600'
    }
  ];

  const recentOrders = [
    {
      id: '#BD-001',
      customer: 'Marie Nzamba',
      destination: 'Brazzaville Centre',
      status: 'En cours',
      amount: '15,000 FCFA',
      time: 'Il y a 2h'
    },
    {
      id: '#BD-002',
      customer: 'Jean Mbeki',
      destination: 'Pointe-Noire',
      status: 'Livré',
      amount: '25,000 FCFA',
      time: 'Il y a 4h'
    },
    {
      id: '#BD-003',
      customer: 'Sarah Kimbembe',
      destination: 'Dolisie',
      status: 'En transit',
      amount: '18,500 FCFA',
      time: 'Il y a 6h'
    },
    {
      id: '#BD-004',
      customer: 'Pierre Lounda',
      destination: 'Nkayi',
      status: 'En cours',
      amount: '12,000 FCFA',
      time: 'Il y a 8h'
    }
  ];

  const topCities = [
    { city: 'Brazzaville', deliveries: 456, percentage: 85 },
    { city: 'Pointe-Noire', deliveries: 234, percentage: 65 },
    { city: 'Dolisie', deliveries: 189, percentage: 45 },
    { city: 'Nkayi', deliveries: 156, percentage: 35 },
    { city: 'Ouesso', deliveries: 98, percentage: 25 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="text-gray-600">Vue d'ensemble de vos activités</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={timeRange === 'week' ? 'default' : 'outline'}
              onClick={() => setTimeRange('week')}
            >
              Semaine
            </Button>
            <Button 
              variant={timeRange === 'month' ? 'default' : 'outline'}
              onClick={() => setTimeRange('month')}
            >
              Mois
            </Button>
            <Button 
              variant={timeRange === 'year' ? 'default' : 'outline'}
              onClick={() => setTimeRange('year')}
            >
              Année
            </Button>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs période précédente</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Commandes récentes */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Commandes récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <Truck className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-600">{order.customer}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{order.destination}</span>
                        </div>
                        <Badge 
                          variant={
                            order.status === 'Livré' ? 'default' : 
                            order.status === 'En cours' ? 'secondary' : 'outline'
                          }
                          className="mb-1"
                        >
                          {order.status}
                        </Badge>
                        <p className="text-sm font-medium text-gray-900">{order.amount}</p>
                        <p className="text-xs text-gray-500">{order.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button variant="outline">Voir toutes les commandes</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top villes */}
          <div>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Top villes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCities.map((city, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-900">{city.city}</span>
                        <span className="text-sm text-gray-600">{city.deliveries} livraisons</span>
                      </div>
                      <Progress value={city.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activité récente */}
            <Card className="border-0 shadow-lg mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Activité récente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Nouvelle commande #BD-005</p>
                      <p className="text-xs text-gray-500">Il y a 5 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Livraison terminée #BD-002</p>
                      <p className="text-xs text-gray-500">Il y a 1 heure</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Nouveau client inscrit</p>
                      <p className="text-xs text-gray-500">Il y a 2 heures</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Mise à jour système</p>
                      <p className="text-xs text-gray-500">Il y a 3 heures</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Évolution des livraisons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Graphique des livraisons</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Répartition par type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Graphique de répartition</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
