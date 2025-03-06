
import React, { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { 
  Users, 
  ShoppingBag, 
  Utensils, 
  Car, 
  DollarSign,
  CircleUser,
  Settings,
  Database
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminDashboard = () => {
  const { user, isAdmin } = useUser();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirection si l'utilisateur n'est pas admin
  if (!user || !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  // Données factices pour le tableau de bord
  const ordersByDay = [
    { name: 'Lun', orders: 12 },
    { name: 'Mar', orders: 19 },
    { name: 'Mer', orders: 15 },
    { name: 'Jeu', orders: 22 },
    { name: 'Ven', orders: 30 },
    { name: 'Sam', orders: 40 },
    { name: 'Dim', orders: 25 },
  ];

  const usersBySource = [
    { name: 'Direct', value: 400 },
    { name: 'Réseaux sociaux', value: 300 },
    { name: 'Référence', value: 200 },
    { name: 'Recherche', value: 150 },
    { name: 'Autres', value: 50 },
  ];

  const stats = [
    { 
      title: 'Utilisateurs',
      value: '5,231',
      change: '+12.5%',
      icon: <Users className="h-6 w-6 text-blue-500" />,
      description: 'Depuis le mois dernier'
    },
    { 
      title: 'Commandes',
      value: '1,789',
      change: '+18.2%',
      icon: <ShoppingBag className="h-6 w-6 text-green-500" />,
      description: 'Depuis le mois dernier'
    },
    { 
      title: 'Restaurants',
      value: '42',
      change: '+2.4%',
      icon: <Utensils className="h-6 w-6 text-orange-500" />,
      description: 'Depuis le mois dernier'
    },
    { 
      title: 'Courses de taxi',
      value: '935',
      change: '+8.1%',
      icon: <Car className="h-6 w-6 text-purple-500" />,
      description: 'Depuis le mois dernier'
    },
    { 
      title: 'Revenu',
      value: '32,450 €',
      change: '+15.3%',
      icon: <DollarSign className="h-6 w-6 text-red-500" />,
      description: 'Depuis le mois dernier'
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Administration</CardTitle>
              <CardDescription>
                Bienvenue, {user.first_name}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <nav className="flex flex-col space-y-1">
                <TabsList className="grid grid-cols-1 h-auto bg-transparent border-e-0">
                  <TabsTrigger 
                    value="overview" 
                    className="justify-start px-2 data-[state=active]:bg-muted data-[state=active]:shadow-none"
                    onClick={() => setActiveTab('overview')}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Vue d'ensemble
                  </TabsTrigger>
                  <TabsTrigger 
                    value="users" 
                    className="justify-start px-2 data-[state=active]:bg-muted data-[state=active]:shadow-none"
                    onClick={() => setActiveTab('users')}
                  >
                    <CircleUser className="h-4 w-4 mr-2" />
                    Utilisateurs
                  </TabsTrigger>
                  <TabsTrigger 
                    value="restaurants" 
                    className="justify-start px-2 data-[state=active]:bg-muted data-[state=active]:shadow-none"
                    onClick={() => setActiveTab('restaurants')}
                  >
                    <Utensils className="h-4 w-4 mr-2" />
                    Restaurants
                  </TabsTrigger>
                  <TabsTrigger 
                    value="orders" 
                    className="justify-start px-2 data-[state=active]:bg-muted data-[state=active]:shadow-none"
                    onClick={() => setActiveTab('orders')}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Commandes
                  </TabsTrigger>
                  <TabsTrigger 
                    value="taxi" 
                    className="justify-start px-2 data-[state=active]:bg-muted data-[state=active]:shadow-none"
                    onClick={() => setActiveTab('taxi')}
                  >
                    <Car className="h-4 w-4 mr-2" />
                    Taxis
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings" 
                    className="justify-start px-2 data-[state=active]:bg-muted data-[state=active]:shadow-none"
                    onClick={() => setActiveTab('settings')}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres
                  </TabsTrigger>
                </TabsList>
              </nav>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex-1">
          <Tabs value={activeTab} className="space-y-6">
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vue d'ensemble</CardTitle>
                  <CardDescription>
                    Statistiques et analyses de la plateforme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stats.map((stat, index) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                              </p>
                              <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                            {stat.icon}
                          </div>
                          <div className="mt-4 flex items-center text-sm">
                            <span className={`font-medium ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                              {stat.change}
                            </span>
                            <span className="text-muted-foreground ml-2">
                              {stat.description}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Commandes par jour</CardTitle>
                    <CardDescription>
                      Derniers 7 jours
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={ordersByDay}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="orders" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Utilisateurs par source</CardTitle>
                    <CardDescription>
                      Répartition des utilisateurs
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={usersBySource}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {usersBySource.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des utilisateurs</CardTitle>
                  <CardDescription>
                    Voir et gérer les utilisateurs de la plateforme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Fonctionnalité en développement</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="restaurants">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des restaurants</CardTitle>
                  <CardDescription>
                    Voir et gérer les restaurants partenaires
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Fonctionnalité en développement</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des commandes</CardTitle>
                  <CardDescription>
                    Voir et gérer les commandes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Fonctionnalité en développement</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="taxi">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des taxis</CardTitle>
                  <CardDescription>
                    Voir et gérer les courses de taxi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Fonctionnalité en développement</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres</CardTitle>
                  <CardDescription>
                    Configurer les paramètres de la plateforme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Fonctionnalité en développement</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
