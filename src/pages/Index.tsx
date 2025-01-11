import { Users, DollarSign, Target, Award } from "lucide-react";
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

interface IndexProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const Index = ({ isCollapsed, setIsCollapsed }: IndexProps) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeDeliveries: 0,
    completionRate: 0
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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*');

        const { data: deliveries, error: deliveriesError } = await supabase
          .from('delivery_tracking')
          .select('*');

        if (ordersError || deliveriesError) {
          throw new Error('Error fetching data');
        }

        const totalOrders = orders?.length || 0;
        const totalRevenue = orders?.reduce((acc, order) => acc + order.total_amount, 0) || 0;
        const activeDeliveries = deliveries?.filter(d => d.status !== 'delivered').length || 0;
        const completedOrders = orders?.filter(o => o.status === 'completed').length || 0;
        const completionRate = totalOrders ? Math.round((completedOrders / totalOrders) * 100) : 0;

        setStats({
          totalOrders,
          totalRevenue,
          activeDeliveries,
          completionRate
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les statistiques",
        });
      }
    };

    if (session) {
      fetchStats();
    }
  }, [session, toast]);

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
          <p className="text-emerald-200 mt-1">Bienvenue ! Voici votre aperçu.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardChart />
          <DashboardBarChart />
        </div>
      </main>
    </div>
  );
};

export default Index;