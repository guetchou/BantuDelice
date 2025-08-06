
import { MenuItem } from '@/types/menu';
import { Restaurant } from '@/types/restaurant';
import { MenuStatistics, MenuRecommendation } from '@/types/menu';
import { RestaurantAnalytics } from '@/types/analytics';
import apiService from '@/services/api';

// Fonction avancée 1: Analyse de rentabilité du menu
export const analyzeMenuProfitability = async (restaurantId: string): Promise<MenuStatistics | null> => {
  try {
    const { data: menuItems, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId);
      
    if (error) throw error;
    if (!menuItems || menuItems.length === 0) return null;
    
    const items = menuItems as MenuItem[];
    
    // Calculer les statistiques
    const totalItems = items.length;
    
    // Comptage par catégorie
    const categoryCounts = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Calcul du prix moyen
    const averagePrice = items.reduce((sum, item) => sum + item.price, 0) / totalItems;
    
    // Temps de préparation moyen
    const averagePrepTime = items.reduce((sum, item) => {
      return sum + (item.preparation_time || 15); // Valeur par défaut si non définie
    }, 0) / totalItems;
    
    // Trouver la catégorie la plus populaire
    const mostPopularCategory = Object.entries(categoryCounts)
      .sort(([, countA], [, countB]) => countB - countA)[0][0];
    
    // Item le plus populaire (basé sur le score de popularité)
    const mostPopularItem = items
      .sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0))[0]?.name || '';
    
    // Item avec la marge la plus élevée
    const highestMarginItem = items
      .filter(item => item.profit_margin !== undefined)
      .sort((a, b) => (b.profit_margin || 0) - (a.profit_margin || 0))[0]?.name || '';
    
    // Comptage des options diététiques
    const vegetarianCount = items.filter(item => item.is_vegetarian).length;
    const veganCount = items.filter(item => item.is_vegan).length;
    const glutenFreeCount = items.filter(item => item.is_gluten_free).length;
    
    return {
      totalItems,
      categoryCounts,
      averagePrice,
      averagePrepTime,
      mostPopularCategory,
      mostPopularItem,
      highestMarginItem,
      vegetarianCount,
      veganCount,
      glutenFreeCount
    };
  } catch (err) {
    console.error('Error analyzing menu profitability:', err);
    return null;
  }
};

// Fonction avancée 2: Génération de recommandations pour le menu
export const generateMenuRecommendations = async (restaurantId: string): Promise<MenuRecommendation[]> => {
  try {
    const { data: menuItems, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId);
      
    if (error) throw error;
    
    const items = menuItems as MenuItem[];
    if (!items || items.length === 0) return [];
    
    const recommendations: MenuRecommendation[] = [];
    
    // Recommandation 1: Identifier les éléments à faible popularité et marge élevée
    const puzzles = items
      .filter(item => 
        (item.popularity_score || 0) < 0.3 && 
        (item.profit_margin || 0) > 0.4)
      .slice(0, 2);
      
    puzzles.forEach(item => {
      recommendations.push({
        type: 'modify',
        itemId: item.id,
        itemName: item.name,
        reason: 'Plat à haute marge mais faible popularité',
        impact: 'Augmenter la visibilité pourrait améliorer les revenus',
        confidence: 'medium',
        details: 'Envisagez de mettre en avant ce plat dans votre menu ou d\'offrir une promotion temporaire.'
      });
    });
    
    // Recommandation 2: Identifier les éléments à forte popularité mais marge faible
    const plowhorses = items
      .filter(item => 
        (item.popularity_score || 0) > 0.7 && 
        (item.profit_margin || 0) < 0.2)
      .slice(0, 2);
      
    plowhorses.forEach(item => {
      recommendations.push({
        type: 'price',
        itemId: item.id,
        itemName: item.name,
        reason: 'Plat populaire mais à faible marge',
        impact: 'Une légère augmentation de prix pourrait améliorer significativement la rentabilité',
        confidence: 'high',
        details: 'Une augmentation de 5-10% du prix pourrait être acceptable pour les clients vu la popularité du plat.'
      });
    });
    
    // Recommandation 3: Identifier les éléments à faible popularité et faible marge
    const dogs = items
      .filter(item => 
        (item.popularity_score || 0) < 0.2 && 
        (item.profit_margin || 0) < 0.2)
      .slice(0, 2);
      
    dogs.forEach(item => {
      recommendations.push({
        type: 'remove',
        itemId: item.id,
        itemName: item.name,
        reason: 'Plat à faible popularité et faible marge',
        impact: 'Supprimer ce plat pourrait optimiser vos opérations',
        confidence: 'medium',
        details: 'Ce plat n\'est ni rentable ni populaire, envisagez de le remplacer.'
      });
    });
    
    // Recommandation 4: Suggérer de nouveaux plats
    // Analyse des catégories sous-représentées
    const categoryCount = {};
    items.forEach(item => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    });
    
    const avgItemsPerCategory = items.length / Object.keys(categoryCount).length;
    const underrepresentedCategories = Object.entries(categoryCount)
      .filter(([_, count]) => count < avgItemsPerCategory * 0.7)
      .map(([category]) => category);
      
    if (underrepresentedCategories.length > 0) {
      recommendations.push({
        type: 'add',
        reason: `Catégorie(s) sous-représentée(s): ${underrepresentedCategories.join(', ')}`,
        impact: 'Diversifier votre menu pourrait attirer plus de clients',
        confidence: 'medium',
        details: 'Ajoutez de nouveaux plats dans ces catégories pour équilibrer votre offre.'
      });
    }
    
    return recommendations;
  } catch (err) {
    console.error('Error generating menu recommendations:', err);
    return [];
  }
};

// Fonction avancée 3: Prévisions de ventes basées sur l'historique
export const generateSalesForecast = async (restaurantId: string, days: number = 7): Promise<unknown> => {
  // Simulé - dans un environnement réel, nous utiliserions des données historiques
  const mockForecast = {
    dailyRevenue: Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
      prediction: 50000 + Math.random() * 20000,
      lowerBound: 45000 + Math.random() * 10000,
      upperBound: 60000 + Math.random() * 15000
    })),
    totalPrediction: 350000 + Math.random() * 50000,
    confidence: 0.85,
    factors: [
      {
        name: 'Jour de semaine',
        impact: 'Vendredi et samedi montrent des pics de revenus'
      },
      {
        name: 'Météo',
        impact: 'Les journées ensoleillées augmentent le trafic de 15%'
      },
      {
        name: 'Événements locaux',
        impact: 'Les événements à proximité peuvent augmenter les ventes de 30%'
      }
    ]
  };
  
  return mockForecast;
};

// Fonction avancée 4: Optimisation des prix basée sur l'élasticité
export const optimizePricing = async (restaurantId: string): Promise<unknown> => {
  try {
    const { data: menuItems, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId);
      
    if (error) throw error;
    
    const items = menuItems as MenuItem[];
    if (!items || items.length === 0) return null;
    
    // Calculs simulés d'optimisation des prix
    const priceRecommendations = items.map(item => {
      // Simuler une élasticité des prix
      const elasticity = Math.random() * 0.5 + 0.5; // Entre 0.5 et 1
      
      // Plus l'élasticité est élevée, plus la demande est sensible au prix
      let priceAdjustment = 0;
      let expectedImpact = 0;
      
      // Si le plat est populaire avec une marge faible, augmenter le prix
      if ((item.popularity_score || 0) > 0.7 && (item.profit_margin || 0) < 0.3) {
        const increaseFactor = Math.min(0.1, (1 - elasticity) * 0.15);
        priceAdjustment = item.price * increaseFactor;
        expectedImpact = item.price * increaseFactor * 0.85; // Impact sur la marge
      } 
      // Si le plat est peu populaire mais avec une bonne marge, réduire légèrement le prix
      else if ((item.popularity_score || 0) < 0.3 && (item.profit_margin || 0) > 0.4) {
        const decreaseFactor = Math.min(0.08, elasticity * 0.12);
        priceAdjustment = -item.price * decreaseFactor;
        expectedImpact = item.price * 0.15; // Impact estimé sur la popularité
      }
      
      return {
        itemId: item.id,
        name: item.name,
        currentPrice: item.price,
        recommendedPrice: Math.round(item.price + priceAdjustment),
        priceAdjustment: priceAdjustment.toFixed(2),
        expectedImpact: expectedImpact.toFixed(2),
        elasticity: elasticity.toFixed(2)
      };
    }).filter(rec => rec.priceAdjustment !== '0.00');
    
    return {
      recommendations: priceRecommendations,
      summary: {
        totalItems: priceRecommendations.length,
        averageAdjustment: priceRecommendations.reduce((sum, rec) => sum + parseFloat(rec.priceAdjustment), 0) / priceRecommendations.length,
        potentialRevenue: priceRecommendations.reduce((sum, rec) => sum + parseFloat(rec.expectedImpact), 0)
      }
    };
  } catch (err) {
    console.error('Error optimizing pricing:', err);
    return null;
  }
};

// Récupérer des données analytiques complètes
export const getRestaurantAnalytics = async (restaurantId: string): Promise<Partial<RestaurantAnalytics> | null> => {
  try {
    // Pour la démonstration, nous retournons des données simulées
    // Dans un environnement réel, cela serait basé sur des données historiques
    
    return {
      revenue: {
        total: 1250000,
        previousPeriod: 1100000,
        changePercentage: 13.64,
        byDay: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
          revenue: 150000 + Math.random() * 50000,
          orderCount: 80 + Math.floor(Math.random() * 40),
          averageOrderValue: 1800 + Math.random() * 500
        })),
        byCategory: [
          { category: 'Plats principaux', revenue: 600000, percentage: 48, previousPeriod: 550000, changePercentage: 9.1 },
          { category: 'Entrées', revenue: 200000, percentage: 16, previousPeriod: 180000, changePercentage: 11.1 },
          { category: 'Desserts', revenue: 180000, percentage: 14.4, previousPeriod: 160000, changePercentage: 12.5 },
          { category: 'Boissons', revenue: 270000, percentage: 21.6, previousPeriod: 210000, changePercentage: 28.6 }
        ],
        byPaymentMethod: [
          { method: 'Carte bancaire', revenue: 750000, percentage: 60 },
          { method: 'Espèces', revenue: 250000, percentage: 20 },
          { method: 'Mobile Money', revenue: 200000, percentage: 16 },
          { method: 'Autres', revenue: 50000, percentage: 4 }
        ],
        averageOrderValue: 3570,
        forecastNextWeek: 1350000,
        revenuePerTable: 12500,
        revenuePerHour: {
          '12-14': 350000,
          '14-17': 150000,
          '17-20': 300000,
          '20-22': 450000
        }
      },
      orders: {
        total: 350,
        completed: 330,
        cancelled: 12,
        inProgress: 8,
        averagePreparationTime: 21,
        byHour: Array.from({ length: 12 }, (_, i) => ({
          hour: i + 11,
          count: 10 + Math.floor(Math.random() * 40),
          revenue: 30000 + Math.random() * 50000
        })),
        byDay: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
          count: 40 + Math.floor(Math.random() * 20),
          revenue: 150000 + Math.random() * 50000
        })),
        popularItems: [
          { id: 'item1', name: 'Poulet Yassa', orderCount: 95, percentage: 27.1, revenue: 380000 },
          { id: 'item2', name: 'Tiéboudienne', orderCount: 72, percentage: 20.6, revenue: 288000 },
          { id: 'item3', name: 'Mafé', orderCount: 43, percentage: 12.3, revenue: 172000 },
          { id: 'item4', name: 'Thiakry', orderCount: 37, percentage: 10.6, revenue: 92500 }
        ],
        deliveryPercentage: 35,
        pickupPercentage: 15,
        dineInPercentage: 50
      },
      menu: {
        itemPerformance: Array.from({ length: 10 }, (_, i) => ({
          id: `item${i+1}`,
          name: `Item ${i+1}`,
          orderCount: 15 + Math.floor(Math.random() * 85),
          revenue: 40000 + Math.random() * 200000,
          profit: 20000 + Math.random() * 100000,
          costPercentage: 25 + Math.random() * 20,
          wastePercentage: 3 + Math.random() * 7,
          category: ['Entrées', 'Plats principaux', 'Desserts', 'Boissons'][Math.floor(Math.random() * 4)],
          trendDirection: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
          trendPercentage: Math.floor(Math.random() * 20)
        })),
        categoryPerformance: [
          { category: 'Plats principaux', itemCount: 15, orderCount: 220, revenue: 600000, profit: 300000, averagePreparationTime: 25 },
          { category: 'Entrées', itemCount: 8, orderCount: 150, revenue: 200000, profit: 120000, averagePreparationTime: 15 },
          { category: 'Desserts', itemCount: 6, orderCount: 110, revenue: 180000, profit: 100000, averagePreparationTime: 10 },
          { category: 'Boissons', itemCount: 12, orderCount: 180, revenue: 270000, profit: 180000, averagePreparationTime: 5 }
        ],
        menuEngineering: {
          stars: ['item1', 'item3', 'item8'],
          plowhorses: ['item2', 'item5'],
          puzzles: ['item4', 'item9'],
          dogs: ['item6', 'item7', 'item10']
        },
        priceAnalysis: Array.from({ length: 5 }, (_, i) => ({
          id: `item${i+1}`,
          name: `Item ${i+1}`,
          currentPrice: 2000 + Math.random() * 8000,
          recommendedPrice: 2500 + Math.random() * 8000,
          elasticity: 0.4 + Math.random() * 0.6,
          competitiveIndex: 0.8 + Math.random() * 0.4,
          lastPriceChange: new Date(Date.now() - Math.random() * 90 * 86400000).toISOString().split('T')[0],
          priceChangeImpact: Math.random() * 20 - 5
        }))
      }
    };
  } catch (err) {
    console.error('Error fetching restaurant analytics:', err);
    return null;
  }
};
