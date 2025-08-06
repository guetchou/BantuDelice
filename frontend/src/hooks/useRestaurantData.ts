
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantService } from '@/services/restaurantService';
import { Restaurant, RestaurantFilters } from '@/types/restaurant';
import { MenuItem } from '@/types/menu';
import apiService from '@/services/api';
import { toast } from 'sonner';

export const useRestaurantData = () => {
  const queryClient = useQueryClient();

  // Get all restaurants with optional filters
  const useRestaurants = (filters?: RestaurantFilters) => {
    return useQuery({
      queryKey: ['restaurants', filters],
      queryFn: () => restaurantService.getAllRestaurants(filters),
    });
  };

  // Get a single restaurant by ID
  const useRestaurant = (id?: string) => {
    return useQuery({
      queryKey: ['restaurant', id],
      queryFn: async () => {
        if (!id) throw new Error('Restaurant ID is required');
        return restaurantService.getRestaurantById(id);
      },
      enabled: !!id,
    });
  };

  // Get menu items for a restaurant
  const useMenuItems = (restaurantId?: string) => {
    return useQuery({
      queryKey: ['menu-items', restaurantId],
      queryFn: async () => {
        if (!restaurantId) throw new Error('Restaurant ID is required');
        return restaurantService.getMenuItems(restaurantId);
      },
      enabled: !!restaurantId,
    });
  };

  // Update restaurant details
  const useUpdateRestaurant = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<Restaurant> }) => 
        restaurantService.updateRestaurant(id, data),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['restaurant', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      }
    });
  };

  // Create a menu item
  const useCreateMenuItem = () => {
    return useMutation({
      mutationFn: ({ menuItem }: { menuItem: Omit<MenuItem, 'id' | 'created_at'> }) => 
        restaurantService.createMenuItem(menuItem),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['menu-items', data.restaurant_id] });
        }
      }
    });
  };

  // Update a menu item
  const useUpdateMenuItem = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<MenuItem> }) => 
        restaurantService.updateMenuItem(id, data),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['menu-items', data.restaurant_id] });
        }
      }
    });
  };

  // Delete a menu item
  const useDeleteMenuItem = () => {
    return useMutation({
      mutationFn: (id: string) => restaurantService.deleteMenuItem(id),
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      }
    });
  };
  
  // NOUVELLES FONCTIONNALITÉS
  
  // Fonction avancée 1: Obtenir les recommandations intelligentes pour le menu
  const useMenuRecommendations = (restaurantId?: string) => {
    return useQuery({
      queryKey: ['menu-recommendations', restaurantId],
      queryFn: async () => {
        if (!restaurantId) throw new Error('Restaurant ID is required');
        try {
          // Fetch menu items using API service
          const items = await apiService.getMenuItems(restaurantId);
          
          // Exemple simple d'analyse de menu
          const totalItems = items.length;
          const categories = {};
          let totalPrice = 0;
          
          items.forEach((item: MenuItem) => {
            categories[item.category] = (categories[item.category] || 0) + 1;
            totalPrice += item.price;
          });
          
          const avgPrice = totalPrice / totalItems;
          
          // Génération de recommandations
          const recommendations = [];
          
          // 1. Recherche de catégories sous-représentées
          const avgItemsPerCategory = totalItems / Object.keys(categories).length;
          const underrepresentedCategories = Object.entries(categories)
            .filter(([_, count]) => count < avgItemsPerCategory * 0.7)
            .map(([category]) => category);
            
          if (underrepresentedCategories.length > 0) {
            recommendations.push({
              type: 'category_balance',
              title: 'Équilibrez votre menu',
              description: `Ajoutez plus d'options dans: ${underrepresentedCategories.join(', ')}`,
              impact: 'Amélioration de la diversité du menu',
              priority: 'medium'
            });
          }
          
          // 2. Analyse des prix
          const priceRange = {
            low: items.filter((item: MenuItem) => item.price < avgPrice * 0.7).length,
            medium: items.filter((item: MenuItem) => item.price >= avgPrice * 0.7 && item.price <= avgPrice * 1.3).length,
            high: items.filter((item: MenuItem) => item.price > avgPrice * 1.3).length
          };
          
          if (priceRange.medium < totalItems * 0.3) {
            recommendations.push({
              type: 'price_distribution',
              title: 'Optimisez votre gamme de prix',
              description: 'Ajoutez plus d\'options à prix moyen dans votre menu',
              impact: 'Meilleure accessibilité pour différents clients',
              priority: 'high'
            });
          }
          
          // 3. Analyse des options diététiques (si disponibles)
          const vegetarianCount = items.filter((item: MenuItem) => item.is_vegetarian).length;
          if (vegetarianCount < totalItems * 0.2) {
            recommendations.push({
              type: 'dietary_options',
              title: 'Diversifiez les options alimentaires',
              description: 'Ajoutez plus d\'options végétariennes à votre menu',
              impact: 'Attirer une clientèle plus diverse',
              priority: 'medium'
            });
          }
          
          return {
            stats: {
              totalItems,
              categories,
              avgPrice,
              priceDistribution: priceRange
            },
            recommendations
          };
          
        } catch (err) {
          console.error('Error fetching menu recommendations:', err);
          toast.error('Impossible de générer les recommandations');
          return { stats: Record<string, unknown>, recommendations: [] };
        }
      },
      enabled: !!restaurantId
    });
  };
  
  // Fonction avancée 2: Optimiser les prix des plats
  const useOptimizePricing = (restaurantId?: string) => {
    return useQuery({
      queryKey: ['pricing-optimization', restaurantId],
      queryFn: async () => {
        if (!restaurantId) throw new Error('Restaurant ID is required');
        try {
          // Récupération des éléments du menu via API
          const items = await apiService.getMenuItems(restaurantId);
          
          // Exemple simple d'optimisation des prix
          // Dans un contexte réel, cela serait basé sur des données historiques,
          // la concurrence, et des études de marché
          
          const priceRecommendations = items.map((item: MenuItem) => {
            // Simuler une élasticité des prix (sensibilité des clients aux changements de prix)
            const elasticity = Math.random() * 0.5 + 0.5; // entre 0.5 et 1
            
            // Plus l'élasticité est élevée, plus la demande est sensible au prix
            let recommendedPrice = item.price;
            let expectedRevenue = item.price;
            let reasoning = '';
            
            // Si le plat est populaire (popularity_score > 0.7) avec une marge faible
            if ((item.popularity_score || 0) > 0.7 && (item.profit_margin || 0) < 0.3) {
              const increasePercentage = Math.min(10, (1 - elasticity) * 15);
              recommendedPrice = Math.round(item.price * (1 + increasePercentage / 100));
              expectedRevenue = recommendedPrice * 0.95 * (item.popularity_score || 1);
              reasoning = 'Plat populaire avec marge faible - opportunité d\'augmenter le prix';
            } 
            // Si le plat est peu populaire mais a une marge élevée
            else if ((item.popularity_score || 0) < 0.3 && (item.profit_margin || 0) > 0.4) {
              const decreasePercentage = Math.min(8, elasticity * 12);
              recommendedPrice = Math.round(item.price * (1 - decreasePercentage / 100));
              expectedRevenue = recommendedPrice * 1.15 * (item.popularity_score || 0.2);
              reasoning = 'Plat peu populaire à marge élevée - réduire le prix pourrait augmenter les ventes';
            } else {
              reasoning = 'Prix optimal actuellement';
            }
            
            return {
              itemId: item.id,
              name: item.name,
              currentPrice: item.price,
              recommendedPrice: recommendedPrice,
              priceDifference: recommendedPrice - item.price,
              percentageChange: ((recommendedPrice - item.price) / item.price * 100).toFixed(1) + '%',
              expectedRevenueChange: expectedRevenue - item.price,
              reasoning
            };
          });
          
          // Filtrer uniquement les éléments ayant des recommandations de changement
          const relevantRecommendations = priceRecommendations.filter(
            rec => rec.currentPrice !== rec.recommendedPrice
          );
          
          // Résumé des optimisations
          const totalPriceChanges = relevantRecommendations.length;
          const avgPercentageChange = relevantRecommendations.length > 0
            ? relevantRecommendations.reduce((sum, rec) => sum + parseFloat(rec.percentageChange), 0) / relevantRecommendations.length
            : 0;
          const potentialRevenueIncrease = relevantRecommendations.reduce(
            (sum, rec) => sum + rec.expectedRevenueChange, 0
          );
          
          return {
            recommendations: relevantRecommendations,
            summary: {
              totalItems: items.length,
              totalPriceChanges,
              avgPercentageChange: avgPercentageChange.toFixed(1) + '%',
              potentialRevenueIncrease
            }
          };
          
        } catch (err) {
          console.error('Error optimizing pricing:', err);
          toast.error('Impossible de générer l\'optimisation des prix');
          return { recommendations: [], summary: Record<string, unknown> };
        }
      },
      enabled: !!restaurantId
    });
  };
  
  // Fonction avancée 3: Analyse des performances du restaurant
  const useRestaurantPerformance = (restaurantId?: string, period: 'day' | 'week' | 'month' = 'week') => {
    return useQuery({
      queryKey: ['restaurant-performance', restaurantId, period],
      queryFn: async () => {
        if (!restaurantId) throw new Error('Restaurant ID is required');
        try {
          // Dans un contexte réel, ces données viendraient d'une analyse de la base de données
          // Pour cet exemple, nous générons des données simulées
          
          // Déterminer la plage de dates en fonction de la période
          const endDate = new Date();
          const startDate = new Date();
          
          switch (period) {
            case 'day':
              startDate.setDate(endDate.getDate() - 1);
              break;
            case 'week':
              startDate.setDate(endDate.getDate() - 7);
              break;
            case 'month':
              startDate.setMonth(endDate.getMonth() - 1);
              break;
          }
          
          // Générer des données simulées
          const daysInPeriod = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          
          // Données de revenus quotidiens
          const revenueData = Array.from({ length: daysInPeriod }, (_, i) => {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            // Variation basée sur le jour de la semaine (plus élevée le weekend)
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const baseSales = isWeekend ? 180000 : 120000;
            
            return {
              date: date.toISOString().split('T')[0],
              revenue: Math.round(baseSales + (Math.random() * 60000 - 30000)),
              orders: Math.round(isWeekend ? 60 + Math.random() * 30 : 40 + Math.random() * 20)
            };
          });
          
          // Calculer les totaux
          const totalRevenue = revenueData.reduce((sum, day) => sum + day.revenue, 0);
          const totalOrders = revenueData.reduce((sum, day) => sum + day.orders, 0);
          const averageOrderValue = Math.round(totalRevenue / totalOrders);
          
          // Simuler les données des périodes précédentes pour la comparaison
          const previousPeriodRevenue = totalRevenue * (0.8 + Math.random() * 0.3);
          const revenueGrowth = ((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100;
          
          // Simuler les heures de pointe
          const peakHours = [
            { hour: '12-13', orders: 52, revenue: 156000 },
            { hour: '13-14', orders: 48, revenue: 144000 },
            { hour: '19-20', orders: 63, revenue: 189000 },
            { hour: '20-21', orders: 57, revenue: 171000 }
          ];
          
          // Simuler les plats les plus vendus
          const topItems = [
            { id: 'item1', name: 'Poulet Yassa', orders: Math.round(totalOrders * 0.12), revenue: Math.round(totalRevenue * 0.14) },
            { id: 'item2', name: 'Tiéboudienne', orders: Math.round(totalOrders * 0.09), revenue: Math.round(totalRevenue * 0.11) },
            { id: 'item3', name: 'Mafé', orders: Math.round(totalOrders * 0.08), revenue: Math.round(totalRevenue * 0.09) },
            { id: 'item4', name: 'Riz au poisson', orders: Math.round(totalOrders * 0.07), revenue: Math.round(totalRevenue * 0.08) },
            { id: 'item5', name: 'Thiakry', orders: Math.round(totalOrders * 0.06), revenue: Math.round(totalRevenue * 0.05) }
          ];
          
          return {
            period: {
              start: startDate.toISOString().split('T')[0],
              end: endDate.toISOString().split('T')[0],
              days: daysInPeriod
            },
            summary: {
              totalRevenue,
              totalOrders,
              averageOrderValue,
              revenueGrowth: revenueGrowth.toFixed(1)
            },
            dailyData: revenueData,
            peakHours,
            topItems,
            insights: [
              {
                title: 'Heures de pointe',
                description: 'Le service entre 19h et 21h génère 30% de votre chiffre d\'affaires',
                recommendation: 'Assurez-vous d\'avoir suffisamment de personnel pendant ces périodes'
              },
              {
                title: 'Articles populaires',
                description: `Le ${topItems[0].name} représente ${(topItems[0].orders / totalOrders * 100).toFixed(1)}% de vos commandes`,
                recommendation: 'Assurez-vous d\'avoir suffisamment de stock pour cet article populaire'
              },
              {
                title: 'Croissance',
                description: `Votre chiffre d\'affaires a ${revenueGrowth >= 0 ? 'augmenté' : 'diminué'} de ${Math.abs(revenueGrowth).toFixed(1)}% par rapport à la période précédente`,
                recommendation: revenueGrowth >= 0 ? 'Continuez vos stratégies actuelles' : 'Analysez les facteurs qui ont pu causer cette baisse'
              }
            ]
          };
          
        } catch (err) {
          console.error('Error fetching restaurant performance:', err);
          toast.error('Impossible de générer l\'analyse de performance');
          return null;
        }
      },
      enabled: !!restaurantId
    });
  };
  
  // Fonction avancée 4: Gestion des disponibilités des plats
  const useManageItemAvailability = () => {
    return useMutation({
      mutationFn: async ({ itemId, available }: { itemId: string; available: boolean }) => {
        try {
          const data = await apiService.updateMenuItem('restaurantId', itemId, { available });
          return data;
        } catch (err) {
          console.error('Error updating item availability:', err);
          throw err;
        }
      },
      onSuccess: (data) => {
        if (data) {
          const statusText = data.available ? 'disponible' : 'indisponible';
          toast.success(`${data.name} est maintenant ${statusText}`);
          queryClient.invalidateQueries({ queryKey: ['menu-items', data.restaurant_id] });
        }
      },
      onError: (error) => {
        toast.error('Impossible de mettre à jour la disponibilité du plat');
      }
    });
  };

  return {
    useRestaurants,
    useRestaurant,
    useMenuItems,
    useUpdateRestaurant,
    useCreateMenuItem,
    useUpdateMenuItem,
    useDeleteMenuItem,
    // Nouvelles fonctionnalités
    useMenuRecommendations,
    useOptimizePricing,
    useRestaurantPerformance,
    useManageItemAvailability
  };
};

