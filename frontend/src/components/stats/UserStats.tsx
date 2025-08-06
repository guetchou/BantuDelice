
import { useQuery } from '@tanstack/react-query';
import apiService from '@/services/api';
import { Card } from "@/components/ui/card";
import { formatCurrency } from '@/utils/formatUtils';

interface UserStatistics {
  totalOrders: number;
  totalSpent: number;
  favoriteRestaurant: string;
  loyaltyPoints: number;
  averageOrderValue: number;
}

const UserStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['userStats'],
    queryFn: async () => {
      console.log('Fetching user statistics');
      const { data: { user } } = await apiService.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id);

      const { data: loyalty } = await supabase
        .from('loyalty_points')
        .select('points')
        .eq('user_id', user.id)
        .single();

      // Calculate statistics
      const totalOrders = orders?.length || 0;
      const totalSpent = orders?.reduce((sum, order) => {
        const amount = typeof order.total_amount === 'number' ? order.total_amount : 
                       (typeof order.total_amount === 'string' ? parseFloat(order.total_amount) : 0);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0) || 0;
      
      // Ensure we have valid numbers for the division
      const averageOrderValue = totalOrders > 0 ? (totalSpent / totalOrders) : 0;

      // Find favorite restaurant
      const restaurantCounts = orders?.reduce((acc: Record<string, number>, order) => {
        if (order.restaurant_id) {
          acc[order.restaurant_id] = (acc[order.restaurant_id] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const favoriteRestaurantId = restaurantCounts && Object.entries(restaurantCounts).length > 0 
        ? Object.entries(restaurantCounts).sort(([,a], [,b]) => b - a)[0]?.[0]
        : null;

      let favoriteRestaurantName = 'Aucun';
      if (favoriteRestaurantId) {
        const { data: favoriteRestaurant } = await supabase
          .from('restaurants')
          .select('name')
          .eq('id', favoriteRestaurantId)
          .single();
        
        favoriteRestaurantName = favoriteRestaurant?.name || 'Aucun';
      }

      return {
        totalOrders,
        totalSpent,
        favoriteRestaurant: favoriteRestaurantName,
        loyaltyPoints: loyalty?.points || 0,
        averageOrderValue
      } as UserStatistics;
    }
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse">Chargement des statistiques...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Vos Statistiques</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Commandes Totales</h3>
          <p className="text-3xl font-bold">{stats?.totalOrders}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Montant Total Dépensé</h3>
          <p className="text-3xl font-bold">{formatCurrency(stats?.totalSpent || 0)}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Restaurant Favori</h3>
          <p className="text-3xl font-bold">{stats?.favoriteRestaurant}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Points de Fidélité</h3>
          <p className="text-3xl font-bold">{stats?.loyaltyPoints}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Valeur Moyenne des Commandes</h3>
          <p className="text-3xl font-bold">{formatCurrency(stats?.averageOrderValue || 0)}</p>
        </Card>
      </div>
    </div>
  );
};

export default UserStats;
