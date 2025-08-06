import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Settings,
  Plus,
  UserPlus,
  CreditCard,
  FileText,
  Download,
  Calendar,
  Target,
  BarChart3,
  Shield,
  Star
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface B2BAccount {
  id: string;
  companyName: string;
  plan: 'starter' | 'professional' | 'enterprise';
  monthlySpend: number;
  activeUsers: number;
  totalOrders: number;
  savings: number;
  status: 'active' | 'pending' | 'suspended';
  nextBilling: string;
  features: string[];
}

interface B2BUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  department: string;
  lastActive: string;
  ordersThisMonth: number;
  status: 'active' | 'inactive';
}

interface B2BOrder {
  id: string;
  date: string;
  user: string;
  items: string[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  savings: number;
}

const B2BDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [showNewUserModal, setShowNewUserModal] = useState(false);

  // Mock data
  const b2bAccounts: B2BAccount[] = [
    {
      id: '1',
      companyName: 'TechCorp Congo',
      plan: 'enterprise',
      monthlySpend: 2500000,
      activeUsers: 45,
      totalOrders: 156,
      savings: 375000,
      status: 'active',
      nextBilling: '2024-02-15',
      features: ['API Access', 'Priority Support', 'Custom Integration', 'Analytics Dashboard']
    },
    {
      id: '2',
      companyName: 'Logistics Plus',
      plan: 'professional',
      monthlySpend: 1200000,
      activeUsers: 23,
      totalOrders: 89,
      savings: 180000,
      status: 'active',
      nextBilling: '2024-02-20',
      features: ['API Access', 'Priority Support', 'Analytics Dashboard']
    },
    {
      id: '3',
      companyName: 'Startup Innov',
      plan: 'starter',
      monthlySpend: 450000,
      activeUsers: 8,
      totalOrders: 34,
      savings: 45000,
      status: 'pending',
      nextBilling: '2024-02-25',
      features: ['Basic Support', 'Analytics Dashboard']
    }
  ];

  const b2bUsers: B2BUser[] = [
    {
      id: '1',
      name: 'Jean-Pierre Mbemba',
      email: 'jp.mbemba@techcorp.cg',
      role: 'admin',
      department: 'IT',
      lastActive: '2024-01-30',
      ordersThisMonth: 12,
      status: 'active'
    },
    {
      id: '2',
      name: 'Marie-Louise Nzouzi',
      email: 'ml.nzouzi@techcorp.cg',
      role: 'manager',
      department: 'RH',
      lastActive: '2024-01-29',
      ordersThisMonth: 8,
      status: 'active'
    },
    {
      id: '3',
      name: 'André Kimbouala',
      email: 'a.kimbouala@techcorp.cg',
      role: 'user',
      department: 'Marketing',
      lastActive: '2024-01-28',
      ordersThisMonth: 5,
      status: 'active'
    }
  ];

  const b2bOrders: B2BOrder[] = [
    {
      id: 'B2B-001',
      date: '2024-01-30',
      user: 'Jean-Pierre Mbemba',
      items: ['Poulet Braisé x5', 'Poisson Braisé x3', 'Boissons x8'],
      total: 45000,
      status: 'delivered',
      savings: 6750
    },
    {
      id: 'B2B-002',
      date: '2024-01-29',
      user: 'Marie-Louise Nzouzi',
      items: ['Maboké x4', 'Saka-Saka x2', 'Foufou x2'],
      total: 28000,
      status: 'delivered',
      savings: 4200
    },
    {
      id: 'B2B-003',
      date: '2024-01-28',
      user: 'André Kimbouala',
      items: ['Poulet Braisé x2', 'Boissons x4'],
      total: 18000,
      status: 'confirmed',
      savings: 2700
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800';
      case 'professional':
        return 'bg-blue-100 text-blue-800';
      case 'starter':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalMonthlySpend = b2bAccounts.reduce((sum, account) => sum + account.monthlySpend, 0);
  const totalSavings = b2bAccounts.reduce((sum, account) => sum + account.savings, 0);
  const totalOrders = b2bAccounts.reduce((sum, account) => sum + account.totalOrders, 0);
  const totalUsers = b2bAccounts.reduce((sum, account) => sum + account.activeUsers, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard B2B</h1>
          <p className="text-muted-foreground">
            Gestion des comptes entreprises et analytics B2B
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter Rapport
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Compte B2B
          </Button>
        </div>
      </div>

      {/* KPIs B2B */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'Affaires B2B</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalMonthlySpend)}</div>
            <p className="text-xs text-muted-foreground">
              +12% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Économies Réalisées</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalSavings)}</div>
            <p className="text-xs text-muted-foreground">
              15% d'économies en moyenne
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes B2B</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {totalUsers} utilisateurs actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comptes Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{b2bAccounts.length}</div>
            <p className="text-xs text-muted-foreground">
              {b2bAccounts.filter(a => a.status === 'active').length} actifs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'Ensemble</TabsTrigger>
          <TabsTrigger value="accounts">Comptes B2B</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
        </TabsList>

        {/* Vue d'Ensemble */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graphique Évolution B2B */}
            <Card>
              <CardHeader>
                <CardTitle>Évolution des Revenus B2B</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { month: 'Août', revenue: 1800000 },
                    { month: 'Sept', revenue: 2100000 },
                    { month: 'Oct', revenue: 1950000 },
                    { month: 'Nov', revenue: 2300000 },
                    { month: 'Déc', revenue: 2800000 },
                    { month: 'Jan', revenue: 4150000 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Line type="monotone" dataKey="revenue" stroke="#00C49A" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Répartition par Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { plan: 'Starter', accounts: 1, revenue: 450000 },
                    { plan: 'Professional', accounts: 1, revenue: 1200000 },
                    { plan: 'Enterprise', accounts: 1, revenue: 2500000 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="plan" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="revenue" fill="#00C49A" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Comptes B2B */}
          <Card>
            <CardHeader>
              <CardTitle>Top Comptes B2B</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {b2bAccounts
                  .sort((a, b) => b.monthlySpend - a.monthlySpend)
                  .map((account, index) => (
                    <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold">{account.companyName}</div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getPlanColor(account.plan)}>
                              {account.plan}
                            </Badge>
                            <Badge className={getStatusColor(account.status)}>
                              {account.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(account.monthlySpend)}</div>
                        <div className="text-sm text-muted-foreground">
                          {account.activeUsers} utilisateurs • {account.totalOrders} commandes
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comptes B2B */}
        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gestion des Comptes B2B</CardTitle>
                  <CardDescription>
                    Gérez les comptes entreprises et leurs paramètres
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau Compte
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {b2bAccounts.map((account) => (
                  <div key={account.id} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{account.companyName}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getPlanColor(account.plan)}>
                            {account.plan}
                          </Badge>
                          <Badge className={getStatusColor(account.status)}>
                            {account.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{formatCurrency(account.monthlySpend)}</div>
                        <div className="text-sm text-green-600">
                          Économies: {formatCurrency(account.savings)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{account.activeUsers}</div>
                        <div className="text-sm text-muted-foreground">Utilisateurs Actifs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{account.totalOrders}</div>
                        <div className="text-sm text-muted-foreground">Commandes Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{account.nextBilling}</div>
                        <div className="text-sm text-muted-foreground">Prochaine Facturation</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Fonctionnalités Incluses:</h4>
                      <div className="flex flex-wrap gap-2">
                        {account.features.map((feature) => (
                          <Badge key={feature} variant="outline">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-2" />
                          Paramètres
                        </Button>
                        <Button variant="outline" size="sm">
                          <Users className="w-4 h-4 mr-2" />
                          Gérer Utilisateurs
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          Factures
                        </Button>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Exporter Données
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Utilisateurs */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gestion des Utilisateurs B2B</CardTitle>
                  <CardDescription>
                    Gérez les utilisateurs de tous les comptes B2B
                  </CardDescription>
                </div>
                <Button onClick={() => setShowNewUserModal(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Nouvel Utilisateur
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {b2bUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{user.role}</Badge>
                          <Badge variant="outline">{user.department}</Badge>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{user.ordersThisMonth} commandes</div>
                      <div className="text-sm text-muted-foreground">
                        Dernière activité: {user.lastActive}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commandes */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commandes B2B</CardTitle>
              <CardDescription>
                Suivi des commandes entreprises et économies réalisées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {b2bOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{order.id}</h3>
                        <div className="text-sm text-muted-foreground">
                          {order.date} • {order.user}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(order.total)}</div>
                        <div className="text-sm text-green-600">
                          Économies: {formatCurrency(order.savings)}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="text-sm font-medium mb-1">Articles:</div>
                      <div className="text-sm text-muted-foreground">
                        {order.items.join(', ')}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Voir Détails
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BDashboard; 