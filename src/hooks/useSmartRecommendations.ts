
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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

const analyzeUserBehavior = async (orders: Order[]): Promise<UserPreferences> => {
  const preferences: UserPreferences = {
    dietaryPreferences: [],
    favoriteCategories: [],
    priceRange: { min: 0, max: 100000 },
    previousOrders: []
  };

  orders.forEach(order => {
    // Analyse des préférences basée sur l'historique des commandes
    if (order.items) {
      order.items.forEach((item: any) => {
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

  // Calcul de la fourchette de prix
  const prices = orders.map(order => order.total_amount);
  if (prices.length > 0) {
    preferences.priceRange.min = Math.min(...prices) * 0.8;
    preferences.priceRange.max = Math.max(...prices) * 1.2;
  }

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
  // Calcul du score basé sur plusieurs facteurs
  const scoredItems = menuItems.map(item => {
    let score = 0;
    
    // Recommandations basées sur l'heure
    if (timeOfDay === 'morning' && item.category?.toLowerCase().includes('breakfast')) {
      score += 20;
    } else if (timeOfDay === 'afternoon' && item.category?.toLowerCase().includes('lunch')) {
      score += 20;
    } else if (timeOfDay === 'evening' && item.category?.toLowerCase().includes('dinner')) {
      score += 20;
    }

    // Correspondance des préférences alimentaires
    if (item.dietary_preferences && userPrefs.dietaryPreferences.some(pref => 
      item.dietary_preferences?.includes(pref))) {
      score += 15;
    }

    // Correspondance de la fourchette de prix
    if (item.price >= userPrefs.priceRange.min && 
        item.price <= userPrefs.priceRange.max) {
      score += 10;
    }

    // Préférences de catégorie
    if (userPrefs.favoriteCategories.includes(item.category || '')) {
      score += 15;
    }

    // Influence du score de popularité
    score += (item.popularity_score || 0) * 0.2;

    // Boost pour les commandes précédentes
    if (userPrefs.previousOrders.includes(item.id)) {
      score += 5;
    }

    return { ...item, score };
  });

  // Tri par score et retour des meilleures recommandations
  return scoredItems
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 6)
    .map(({ score, ...item }) => item);
};

export const useSmartRecommendations = (restaurantId: string) => {
  return useQuery({
    queryKey: ['smartRecommendations', restaurantId],
    queryFn: async () => {
      // Récupération des données nécessaires
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Récupération de l'historique des commandes
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Récupération des plats du menu
      const { data: menuItems, error: menuError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('available', true);

      if (menuError) throw menuError;

      // Analyse du comportement utilisateur
      const userPreferences = await analyzeUserBehavior(orders || []);

      // Détermination de l'heure de la journée
      const hour = new Date().getHours();
      const timeOfDay = hour < 11 ? 'morning' : hour < 16 ? 'afternoon' : 'evening';

      // Génération des recommandations
      return getSmartRecommendations(menuItems || [], userPreferences, timeOfDay);
    },
    meta: {
      errorMessage: "Impossible de charger les recommandations"
    }
  });
};
