interface OrderHistory {
  menu_item_id: string;
  rating?: number;
  created_at: string;
}

interface MenuItem {
  id: string;
  category: string;
  cuisine_type: string;
  price: number;
  popularity_score: number;
}

export const calculateRecommendationScore = (
  menuItem: MenuItem,
  userHistory: OrderHistory[],
  userPreferences: string[]
): number => {
  let score = 0;
  
  // Score de base basé sur la popularité (0-30 points)
  score += (menuItem.popularity_score / 100) * 30;
  
  // Analyse de l'historique des commandes
  const userOrders = userHistory.filter(order => order.menu_item_id === menuItem.id);
  if (userOrders.length > 0) {
    // Fréquence de commande (0-20 points)
    const orderFrequency = userOrders.length / userHistory.length;
    score += orderFrequency * 20;
    
    // Moyenne des notes (0-30 points)
    const averageRating = userOrders
      .filter(order => order.rating)
      .reduce((sum, order) => sum + (order.rating || 0), 0) / userOrders.length;
    score += (averageRating / 5) * 30;
  }
  
  // Bonus pour les préférences alimentaires (0-20 points)
  if (userPreferences.length > 0) {
    const matchingPreferences = userPreferences.filter(pref => 
      menuItem.category.toLowerCase().includes(pref.toLowerCase()) ||
      menuItem.cuisine_type.toLowerCase().includes(pref.toLowerCase())
    );
    score += (matchingPreferences.length / userPreferences.length) * 20;
  }
  
  return Math.min(100, score);
};

export const getPersonalizedRecommendations = (
  menuItems: MenuItem[],
  userHistory: OrderHistory[],
  userPreferences: string[],
  limit: number = 5
): MenuItem[] => {
  // Calculer les scores pour chaque plat
  const scoredItems = menuItems.map(item => ({
    ...item,
    score: calculateRecommendationScore(item, userHistory, userPreferences)
  }));
  
  // Trier par score et retourner les meilleurs
  return scoredItems
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score, ...item }) => item);
};