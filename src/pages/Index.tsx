import { Users, DollarSign, Target, Award, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import DashboardCard from "@/components/DashboardCard";
import DashboardChart from "@/components/DashboardChart";
import DashboardBarChart from "@/components/DashboardBarChart";
import Navbar from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface IndexProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

interface Order {
  id: string;
  status: string;
  delivery_address: string;
  total_amount: number;
  created_at: string;
  rating?: number;
}

const Index = ({ isCollapsed, setIsCollapsed }: IndexProps) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeDeliveries: 0,
    completionRate: 0,
    averageRating: 0
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch orders and set up real-time subscription
  useEffect(() => {
    if (!session) return;

    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les commandes",
        });
      }
    };

    fetchOrders();

    // Set up real-time subscription
    const channel = supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchOrders(); // Refresh orders when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, toast]);

  // Calculate stats
  useEffect(() => {
    if (!orders.length) return;

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + order.total_amount, 0);
    const activeDeliveries = orders.filter(o => ['pending', 'accepted', 'preparing'].includes(o.status)).length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const completionRate = Math.round((completedOrders / totalOrders) * 100);
    const ratings = orders.filter(o => o.rating).map(o => o.rating as number);
    const averageRating = ratings.length 
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
      : 0;

    setStats({
      totalOrders,
      totalRevenue,
      activeDeliveries,
      completionRate,
      averageRating
    });
  }, [orders]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'accepted': return 'bg-blue-500';
      case 'preparing': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-emerald-900 to-cyan-900">
        <h1 className="text-3xl font-bold text-white mb-8">Buntudelice</h1>
        <div className="w-full max-w-md glass-effect p-8 rounded-lg">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#10b981',
                    brandAccent: '#059669',
                  },
                },
              },
            }}
            providers={[]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-cyan-900 flex relative">
      <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className={`flex-1 p-4 sm:p-8 transition-all duration-300 ${
        isCollapsed ? 'ml-[60px]' : 'ml-[60px] sm:ml-64'
      }`}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
          <p className="text-emerald-200 mt-1">Bienvenue ! Voici votre aperçu en temps réel.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <DashboardCard
            title="Commandes Totales"
            value={stats.totalOrders.toString()}
            icon={<Users className="h-6 w-6" />}
            trend={{ value: 12, isPositive: true }}
          />
          <DashboardCard
            title="Revenu"
            value={`${stats.totalRevenue.toLocaleString()} FCFA`}
            icon={<DollarSign className="h-6 w-6" />}
            trend={{ value: 8, isPositive: true }}
          />
          <DashboardCard
            title="Livraisons Actives"
            value={stats.activeDeliveries.toString()}
            icon={<Target className="h-6 w-6" />}
            trend={{ value: 5, isPositive: true }}
          />
          <DashboardCard
            title="Taux de Complétion"
            value={`${stats.completionRate}%`}
            icon={<Award className="h-6 w-6" />}
            trend={{ value: 3, isPositive: true }}
          />
          <DashboardCard
            title="Note Moyenne"
            value={`${stats.averageRating}/5`}
            icon={<Star className="h-6 w-6" />}
            trend={{ value: 2, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DashboardChart />
          <DashboardBarChart />
        </div>

        <div className="glass-effect rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Commandes en Temps Réel</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono">{order.id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.delivery_address}</TableCell>
                    <TableCell>{order.total_amount.toLocaleString()} FCFA</TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      {order.rating ? `${order.rating}/5` : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;