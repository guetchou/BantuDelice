
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { userService } from '@/services/userService';
import { User, UserRole } from '@/types/user';
import {
  Users, FileText, ShoppingBag, TrendingUp, User as UserIcon, 
  ShieldCheck, Truck, Coffee
} from 'lucide-react';
import { DashboardBarChart } from '@/components/DashboardBarChart';
import { DashboardChart } from '@/components/DashboardChart';

export default function AdminDashboard() {
  const { user } = useAdminAuth();
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Statistiques utilisateurs
  const userStats = React.useMemo(() => {
    const totalUsers = users.length;
    const roleCount: Record<UserRole, number> = {
      user: 0,
      admin: 0,
      superadmin: 0,
      restaurant_owner: 0,
      driver: 0
    };

    const statusCount = {
      active: 0,
      inactive: 0,
      pending: 0,
      suspended: 0
    };

    users.forEach(user => {
      roleCount[user.role]++;
      statusCount[user.status]++;
    });

    return {
      totalUsers,
      roleCount,
      statusCount,
      newUsersToday: 0, // Dans un vrai système, on calculerait cela
      newUsersThisWeek: 2,
      newUsersThisMonth: 5
    };
  }, [users]);

  // Données fictives pour les graphiques
  const orderData = [
    { name: 'Lun', value: 12 },
    { name: 'Mar', value: 19 },
    { name: 'Mer', value: 15 },
    { name: 'Jeu', value: 22 },
    { name: 'Ven', value: 28 },
    { name: 'Sam', value: 35 },
    { name: 'Dim', value: 30 }
  ];

  const revenueData = [
    { name: 'Jan', value: 4000 },
    { name: 'Fév', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Avr', value: 4500 },
    { name: 'Mai', value: 6000 },
    { name: 'Juin', value: 5500 }
  ];

  const userRoleData = [
    { name: 'Utilisateurs', value: userStats.roleCount.user },
    { name: 'Admins', value: userStats.roleCount.admin },
    { name: 'Super Admins', value: userStats.roleCount.superadmin },
    { name: 'Restaurants', value: userStats.roleCount.restaurant_owner },
    { name: 'Chauffeurs', value: userStats.roleCount.driver }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            Bienvenue, {user?.first_name} {user?.last_name}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {user?.role === 'superadmin' ? 'Super Administrateur' : 'Administrateur'}
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.totalUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +{userStats.newUsersThisMonth} ce mois-ci
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Commandes</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +32 cette semaine
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Restaurants</CardTitle>
                <Coffee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +2 ce mois-ci
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Revenus</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,458 €</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +8.2% par rapport au mois dernier
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Activité des commandes</CardTitle>
              </CardHeader>
              <CardContent>
                <DashboardBarChart data={orderData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Revenus mensuels</CardTitle>
              </CardHeader>
              <CardContent>
                <DashboardChart data={revenueData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                <UserIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.roleCount.user}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Admins</CardTitle>
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userStats.roleCount.admin + userStats.roleCount.superadmin}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Restaurants</CardTitle>
                <Coffee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.roleCount.restaurant_owner}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Chauffeurs</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.roleCount.driver}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Répartition des utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <DashboardBarChart data={userRoleData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques des commandes</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Contenu à venir...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restaurants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques des restaurants</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Contenu à venir...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
