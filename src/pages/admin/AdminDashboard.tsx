
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import DashboardBarChart from '@/components/DashboardBarChart';
import DashboardChart from '@/components/DashboardChart';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Store, 
  ShoppingBag, 
  Truck, 
  ArrowUpRight, 
  ArrowDownRight,
  List,
  KeyRound
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, isSuperAdmin } = useAdminAuth();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Bienvenue, {user?.first_name || 'Admin'} ! Voici vos statistiques d'aujourd'hui.
          </p>
        </div>
        
        {isSuperAdmin && (
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => navigate('/admin/user-credentials')}
              className="flex items-center gap-1"
            >
              <KeyRound size={18} />
              <span>Identifiants de test</span>
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardMetricCard 
          title="Utilisateurs"
          value="1,248"
          trend="up"
          trendValue="12%"
          icon={<Users size={20} />}
        />
        <DashboardMetricCard 
          title="Restaurants"
          value="84"
          trend="up"
          trendValue="8%"
          icon={<Store size={20} />}
        />
        <DashboardMetricCard 
          title="Commandes"
          value="536"
          trend="down"
          trendValue="3%"
          icon={<ShoppingBag size={20} />}
        />
        <DashboardMetricCard 
          title="Livraisons"
          value="489"
          trend="up"
          trendValue="16%"
          icon={<Truck size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Commandes par jour</CardTitle>
            <CardDescription>Évolution sur les 7 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardBarChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Répartition par catégorie</CardTitle>
            <CardDescription>Commandes par type de cuisine</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Dernières inscriptions</CardTitle>
            <CardDescription>10 derniers utilisateurs inscrits</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users size={15} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Utilisateur #{i+1}</p>
                      <p className="text-xs text-muted-foreground">Il y a {i+1} heures</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <span>Détails</span>
                    <List size={14} />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={() => navigate('/admin/users')}>
              Voir tous les utilisateurs
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dernières commandes</CardTitle>
            <CardDescription>10 dernières commandes passées</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <ShoppingBag size={15} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Commande #{1000 + i}</p>
                      <p className="text-xs text-muted-foreground">Restaurant {i+1} • {25 + i*2}€</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <span>Détails</span>
                    <List size={14} />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline">
              Voir toutes les commandes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

interface DashboardMetricCardProps {
  title: string;
  value: string;
  trend: 'up' | 'down';
  trendValue: string;
  icon: React.ReactNode;
}

const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({ 
  title, 
  value, 
  trend, 
  trendValue,
  icon 
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div className="mt-4">
          <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            trend === 'up' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span className="ml-1">{trendValue} depuis le mois dernier</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
