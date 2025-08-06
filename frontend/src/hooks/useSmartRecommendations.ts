
import { useQuery } from '@tanstack/react-query';
import apiService from '@/services/api';
import type { MenuItem } from '@/types/menu';
import type { Order } from '@/types/order';

interface UserPreferences {
  dietaryPreferences: string[];
  favoriteCategories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  previousOrders: string[];
}

const analyzeUserBehavior = (orders: Order[]): UserPreferences => {
  const preferences: UserPreferences = {
    dietaryPreferences: [],
    favoriteCategories: [],
    priceRange: { min: 0, max: 100000 },
    previousOrders: []
  };

  // Analyze order history
  orders.forEach(order => {
    // Extract dietary preferences and categories from order items if available
    if (order.order_items) {
      order.order_items.forEach((item: unknown) => {
        if (item.dietary_preferences) {
          preferences.dietaryPreferences = [
            ...new Set([...preferences.dietaryPreferences, ...item.dietary_preferences])
          ];
        }
        if (item.category) {
          preferences.favoriteCategories.push(item.category);
        }
        preferences.previousOrders.push(item.id);
      });
    }
  });

  // Calculate price range based on order history
  const prices = orders.map(order => order.total_amount);
  if (prices.length > 0) {
    preferences.priceRange.min = Math.min(...prices) * 0.8;
    preferences.priceRange.max = Math.max(...prices) * 1.2;
  }

  // Get top categories by frequency
  const categoryCount = preferences.favoriteCategories.reduce((acc, cat) => {
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  preferences.favoriteCategories = Object.entries(categoryCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([category]) => category);

  return preferences;
};

const getSmartRecommendations = (
  menuItems: MenuItem[],
  userPrefs: UserPreferences,
  timeOfDay: string
): MenuItem[] => {
  // Score calculation based on multiple factors
  const scoredItems = menuItems.map(item => {
    let score = 0;
    
    // Time-based recommendations
    if (timeOfDay === 'morning' && item.category?.toLowerCase().includes('breakfast')) {
      score += 20;
    } else if (timeOfDay === 'afternoon' && item.category?.toLowerCase().includes('lunch')) {
      score += 20;
    } else if (timeOfDay === 'evening' && item.category?.toLowerCase().includes('dinner')) {
      score += 20;
    }

    // Dietary preferences matching
    if (userPrefs.dietaryPreferences.some(pref => 
      item.dietary_preferences?.includes(pref))) {
      score += 15;
    }

    // Price range matching
    if (item.price >= userPrefs.priceRange.min && 
        item.price <= userPrefs.priceRange.max) {
      score += 10;
    }

    // Category preferences
    if (userPrefs.favoriteCategories.includes(item.category || '')) {
      score += 15;
    }

    // Popularity score influence
    score += (item.popularity_score || 0) * 0.2;

    // Previous orders boost
    if (userPrefs.previousOrders.includes(item.id)) {
      score += 5;
    }

    return { ...item, score };
  });

  // Sort by score and return top recommendations
  return scoredItems
    .sort((a: unknown, b: unknown) => b.score - a.score)
    .slice(0, 6)
    .map(({ score, ...item }: unknown) => item);
};

export const useSmartRecommendations = (restaurantId: string) => {
  return useQuery({
    queryKey: ['smartRecommendations', restaurantId],
    queryFn: async () => {
      try {
        // Récupération des données nécessaires
        const { data: { user } } = await apiService.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Récupération de l'historique des commandes
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        const orders = ordersData || [];

        // Récupération des plats du menu
        const { data: menuItems, error: menuError } = await supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .eq('available', true);

        if (menuError) throw menuError;

        // Analyse du comportement utilisateur
        const userPreferences = analyzeUserBehavior(orders as Order[]);

        // Détermination de l'heure de la journée
        const hour = new Date().getHours();
        const timeOfDay = hour < 11 ? 'morning' : hour < 16 ? 'afternoon' : 'evening';

        // Génération des recommandations
        return getSmartRecommendations(menuItems || [], userPreferences, timeOfDay);
      } catch (error) {
        console.error('Error getting smart recommendations:', error);
        return [];
      }
    },
    meta: {
      errorMessage: "Impossible de charger les recommandations"
    }
  });
};
