import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface OrderStats {
  total_orders: number;
  total_spent: number;
  average_order_value: number;
  monthly_stats: {
    month: string;
    orders: number;
    spent: number;
  }[];
}

const UserStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['userStats'],
    queryFn: async () => {
      console.log('Fetching user stats');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Récupérer les statistiques globales
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id);

      if (!orders) return null;

      // Calculer les statistiques
      const total_orders = orders.length;
      const total_spent = orders.reduce((sum, order) => sum + order.total_amount, 0);
      const average_order_value = total_spent / total_orders;

      // Calculer les statistiques mensuelles
      const monthly_stats = orders.reduce((acc: any[], order) => {
        const month = new Date(order.created_at).toLocaleString('fr-FR', { month: 'long' });
        const existingMonth = acc.find(m => m.month === month);
        
        if (existingMonth) {
          existingMonth.orders += 1;
          existingMonth.spent += order.total_amount;
        } else {
          acc.push({ month, orders: 1, spent: order.total_amount });
        }
        
        return acc;
      }, []);

      return {
        total_orders,
        total_spent,
        average_order_value,
        monthly_stats
      } as OrderStats;
    }
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse">Chargement des statistiques...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Aucune statistique disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mes Statistiques</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Commandes totales</h3>
          <p className="text-3xl font-bold mt-2">{stats.total_orders}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Montant total dépensé</h3>
          <p className="text-3xl font-bold mt-2">{stats.total_spent.toLocaleString()} FCFA</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Valeur moyenne/commande</h3>
          <p className="text-3xl font-bold mt-2">{stats.average_order_value.toLocaleString()} FCFA</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Évolution mensuelle</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.monthly_stats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="spent" 
                stroke="#f97316" 
                name="Montant dépensé"
              />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="#ec4899" 
                name="Nombre de commandes"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default UserStats;