
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, addDays, isSameDay } from 'date-fns';

/**
 * Hook pour obtenir des analytics avancés du restaurant
 */
export const useRestaurantAnalytics = (restaurantId: string) => {
  const [dateRange, setDateRange] = useState({
    start: subDays(new Date(), 30),
    end: new Date()
  });

  const [compareMode, setCompareMode] = useState(false);
  const [comparisonRange, setComparisonRange] = useState({
    start: subDays(subDays(new Date(), 30), 30),
    end: subDays(new Date(), 30)
  });
  
  // Requête pour obtenir les données de commandes
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['restaurant-analytics', restaurantId, dateRange],
    queryFn: async () => {
      // Dans un environnement de production, nous ferions un appel API réel ici
      // Pour la démo, générons des données de test
      return generateMockOrderData(restaurantId, dateRange.start, dateRange.end);
    },
    enabled: !!restaurantId
  });
  
  // Requête pour les données de comparaison (période précédente)
  const { data: comparisonData, isLoading: comparisonLoading } = useQuery({
    queryKey: ['restaurant-analytics-comparison', restaurantId, comparisonRange],
    queryFn: async () => {
      return generateMockOrderData(restaurantId, comparisonRange.start, comparisonRange.end);
    },
    enabled: !!restaurantId && compareMode
  });
  
  // Calculer les KPIs importants
  const kpis = calculateKPIs(ordersData, comparisonData, compareMode);
  
  // Préparer les données pour les graphiques
  const chartData = prepareChartData(ordersData, comparisonData, compareMode);
  
  // Générer des insights basés sur l'IA
  const insights = generateAIInsights(ordersData, comparisonData, compareMode);
  
  return {
    dateRange,
    setDateRange,
    compareMode,
    setCompareMode,
    comparisonRange,
    setComparisonRange,
    isLoading: ordersLoading || (compareMode && comparisonLoading),
    kpis,
    chartData,
    insights
  };
};

// Fonction pour générer des données de commande simulées
function generateMockOrderData(restaurantId: string, startDate: Date, endDate: Date) {
  const days = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    // Générer des ventes basées sur le jour de la semaine (plus élevées le week-end)
    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseOrders = isWeekend ? 15 + Math.random() * 10 : 8 + Math.random() * 5;
    const randomFactor = 0.8 + Math.random() * 0.4; // Entre 0.8 et 1.2
    
    // Ajouter une tendance à la hausse au fil du temps
    const daysPassed = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const trendFactor = 1 + (daysPassed * 0.005); // Augmentation de 0.5% par jour
    
    const orderCount = Math.floor(baseOrders * randomFactor * trendFactor);
    const averageOrderValue = Math.floor(7000 + Math.random() * 3000);
    const totalRevenue = orderCount * averageOrderValue;
    
    // Générer des données de performance par catégorie
    const categories = ['Entrées', 'Plats', 'Desserts', 'Boissons'];
    const categoryData = categories.map(cat => ({
      name: cat,
      sales: Math.floor(totalRevenue * (0.1 + Math.random() * 0.4)),
      orders: Math.floor(orderCount * (0.1 + Math.random() * 0.4))
    }));
    
    days.push({
      date: format(currentDate, 'yyyy-MM-dd'),
      orderCount,
      averageOrderValue,
      totalRevenue,
      categories: categoryData,
      customerCount: Math.floor(orderCount * (1 + Math.random() * 0.5)), // Certains clients partagent des commandes
      newCustomerPercentage: 10 + Math.random() * 20,
      preparationTime: 15 + Math.random() * 10
    });
    
    currentDate = addDays(currentDate, 1);
  }
  
  return {
    restaurantId,
    period: {
      start: format(startDate, 'yyyy-MM-dd'),
      end: format(endDate, 'yyyy-MM-dd')
    },
    days
  };
}

// Calculer les KPIs basés sur les données
function calculateKPIs(currentData, previousData, compareMode) {
  if (!currentData) return null;
  
  // Calculer les KPIs pour la période actuelle
  const totalOrders = currentData.days.reduce((sum, day) => sum + day.orderCount, 0);
  const totalRevenue = currentData.days.reduce((sum, day) => sum + day.totalRevenue, 0);
  const averageOrderValue = totalRevenue / totalOrders;
  const totalCustomers = currentData.days.reduce((sum, day) => sum + day.customerCount, 0);
  const newCustomers = currentData.days.reduce((sum, day) => 
    sum + (day.customerCount * day.newCustomerPercentage / 100), 0);
  const averagePreparationTime = currentData.days.reduce((sum, day) => 
    sum + day.preparationTime, 0) / currentData.days.length;
  
  const result = {
    totalOrders: {
      value: totalOrders,
      change: 0,
      trend: 'stable'
    },
    totalRevenue: {
      value: totalRevenue,
      change: 0,
      trend: 'stable'
    },
    averageOrderValue: {
      value: averageOrderValue,
      change: 0,
      trend: 'stable'
    },
    totalCustomers: {
      value: totalCustomers,
      change: 0,
      trend: 'stable'
    },
    newCustomers: {
      value: newCustomers,
      change: 0,
      trend: 'stable'
    },
    newCustomerPercentage: {
      value: (newCustomers / totalCustomers) * 100,
      change: 0,
      trend: 'stable'
    },
    averagePreparationTime: {
      value: averagePreparationTime,
      change: 0,
      trend: 'stable'
    }
  };
  
  // Si en mode comparaison, calculer les changements par rapport à la période précédente
  if (compareMode && previousData) {
    const prevTotalOrders = previousData.days.reduce((sum, day) => sum + day.orderCount, 0);
    const prevTotalRevenue = previousData.days.reduce((sum, day) => sum + day.totalRevenue, 0);
    const prevAvgOrderValue = prevTotalRevenue / prevTotalOrders;
    const prevTotalCustomers = previousData.days.reduce((sum, day) => sum + day.customerCount, 0);
    const prevNewCustomers = previousData.days.reduce((sum, day) => 
      sum + (day.customerCount * day.newCustomerPercentage / 100), 0);
    const prevAvgPrepTime = previousData.days.reduce((sum, day) => 
      sum + day.preparationTime, 0) / previousData.days.length;
    
    // Calculer les changements en pourcentage
    result.totalOrders.change = calculatePercentChange(totalOrders, prevTotalOrders);
    result.totalOrders.trend = result.totalOrders.change > 0 ? 'up' : result.totalOrders.change < 0 ? 'down' : 'stable';
    
    result.totalRevenue.change = calculatePercentChange(totalRevenue, prevTotalRevenue);
    result.totalRevenue.trend = result.totalRevenue.change > 0 ? 'up' : result.totalRevenue.change < 0 ? 'down' : 'stable';
    
    result.averageOrderValue.change = calculatePercentChange(averageOrderValue, prevAvgOrderValue);
    result.averageOrderValue.trend = result.averageOrderValue.change > 0 ? 'up' : result.averageOrderValue.change < 0 ? 'down' : 'stable';
    
    result.totalCustomers.change = calculatePercentChange(totalCustomers, prevTotalCustomers);
    result.totalCustomers.trend = result.totalCustomers.change > 0 ? 'up' : result.totalCustomers.change < 0 ? 'down' : 'stable';
    
    result.newCustomers.change = calculatePercentChange(newCustomers, prevNewCustomers);
    result.newCustomers.trend = result.newCustomers.change > 0 ? 'up' : result.newCustomers.change < 0 ? 'down' : 'stable';
    
    const prevNewCustomerPercentage = (prevNewCustomers / prevTotalCustomers) * 100;
    result.newCustomerPercentage.change = calculatePercentChange(result.newCustomerPercentage.value, prevNewCustomerPercentage);
    result.newCustomerPercentage.trend = result.newCustomerPercentage.change > 0 ? 'up' : result.newCustomerPercentage.change < 0 ? 'down' : 'stable';
    
    result.averagePreparationTime.change = calculatePercentChange(averagePreparationTime, prevAvgPrepTime);
    result.averagePreparationTime.trend = result.averagePreparationTime.change < 0 ? 'up' : result.averagePreparationTime.change > 0 ? 'down' : 'stable';
  }
  
  return result;
}

// Calculer le changement en pourcentage entre deux valeurs
function calculatePercentChange(currentValue, previousValue) {
  if (!previousValue) return 0;
  return ((currentValue - previousValue) / previousValue) * 100;
}

// Préparer les données pour les graphiques
function prepareChartData(currentData, previousData, compareMode) {
  if (!currentData) return null;
  
  // Données pour le graphique des revenus journaliers
  const revenueData = currentData.days.map(day => ({
    date: day.date,
    current: day.totalRevenue,
    previous: 0
  }));
  
  // Données pour le graphique des commandes journalières
  const ordersData = currentData.days.map(day => ({
    date: day.date,
    current: day.orderCount,
    previous: 0
  }));
  
  // Si en mode comparaison, ajouter les données de la période précédente
  if (compareMode && previousData) {
    previousData.days.forEach(prevDay => {
      const currentIndex = currentData.days.findIndex((_, index) => 
        index < currentData.days.length && 
        isSameDay(
          new Date(prevDay.date), 
          addDays(new Date(currentData.days[0].date), index)
        )
      );
      
      if (currentIndex >= 0 && currentIndex < revenueData.length) {
        revenueData[currentIndex].previous = prevDay.totalRevenue;
        ordersData[currentIndex].previous = prevDay.orderCount;
      }
    });
  }
  
  // Données pour le graphique des catégories
  const categoryData = [];
  if (currentData.days.length > 0) {
    const categories = currentData.days[0].categories;
    categories.forEach(cat => {
      let totalSales = 0;
      currentData.days.forEach(day => {
        const catData = day.categories.find(c => c.name === cat.name);
        if (catData) {
          totalSales += catData.sales;
        }
      });
      categoryData.push({
        name: cat.name,
        value: totalSales
      });
    });
  }
  
  return {
    revenue: revenueData,
    orders: ordersData,
    categories: categoryData
  };
}

// Générer des insights basés sur les données
function generateAIInsights(currentData, previousData, compareMode) {
  if (!currentData) return [];
  
  const insights = [];
  
  // Insight 1: Tendance générale
  const firstDayRevenue = currentData.days[0]?.totalRevenue || 0;
  const lastDayRevenue = currentData.days[currentData.days.length - 1]?.totalRevenue || 0;
  const revenueTrend = calculatePercentChange(lastDayRevenue, firstDayRevenue);
  
  if (revenueTrend > 10) {
    insights.push({
      type: 'positive',
      title: 'Forte croissance des revenus',
      description: `Vos revenus ont augmenté de ${revenueTrend.toFixed(1)}% sur la période analysée.`,
      recommendation: 'Continuez à analyser ce qui fonctionne et investissez davantage dans ces domaines.'
    });
  } else if (revenueTrend < -10) {
    insights.push({
      type: 'negative',
      title: 'Baisse des revenus',
      description: `Vos revenus ont diminué de ${Math.abs(revenueTrend).toFixed(1)}% sur la période analysée.`,
      recommendation: 'Examinez vos stratégies de marketing et votre menu pour identifier les points à améliorer.'
    });
  }
  
  // Insight 2: Performance du week-end vs semaine
  const weekdayOrders = currentData.days
    .filter(day => {
      const date = new Date(day.date);
      const dayOfWeek = date.getDay();
      return dayOfWeek >= 1 && dayOfWeek <= 5;
    })
    .reduce((sum, day) => sum + day.orderCount, 0);
  
  const weekendOrders = currentData.days
    .filter(day => {
      const date = new Date(day.date);
      const dayOfWeek = date.getDay();
      return dayOfWeek === 0 || dayOfWeek === 6;
    })
    .reduce((sum, day) => sum + day.orderCount, 0);
  
  const weekdayCount = currentData.days.filter(day => {
    const date = new Date(day.date);
    const dayOfWeek = date.getDay();
    return dayOfWeek >= 1 && dayOfWeek <= 5;
  }).length;
  
  const weekendCount = currentData.days.filter(day => {
    const date = new Date(day.date);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  }).length;
  
  const avgWeekdayOrders = weekdayCount > 0 ? weekdayOrders / weekdayCount : 0;
  const avgWeekendOrders = weekendCount > 0 ? weekendOrders / weekendCount : 0;
  const weekendVsWeekdayChange = calculatePercentChange(avgWeekendOrders, avgWeekdayOrders);
  
  if (weekendVsWeekdayChange > 30) {
    insights.push({
      type: 'neutral',
      title: 'Performance forte le week-end',
      description: `Vos commandes le week-end sont en moyenne ${weekendVsWeekdayChange.toFixed(1)}% plus élevées que la semaine.`,
      recommendation: 'Envisagez d\'augmenter votre personnel pendant les week-ends et de proposer des promotions spéciales en semaine.'
    });
  }
  
  // Insight 3: Temps de préparation
  const avgPrepTime = currentData.days.reduce((sum, day) => sum + day.preparationTime, 0) / currentData.days.length;
  
  if (avgPrepTime > 25) {
    insights.push({
      type: 'negative',
      title: 'Temps de préparation élevé',
      description: `Votre temps de préparation moyen est de ${avgPrepTime.toFixed(1)} minutes, ce qui est au-dessus de la moyenne du secteur.`,
      recommendation: 'Optimisez vos processus de cuisine et envisagez une réorganisation du personnel aux heures de pointe.'
    });
  } else if (avgPrepTime < 15) {
    insights.push({
      type: 'positive',
      title: 'Excellent temps de préparation',
      description: `Votre temps de préparation moyen est de ${avgPrepTime.toFixed(1)} minutes, ce qui est excellent.`,
      recommendation: 'Maintenez cette efficacité et mettez-la en avant dans votre marketing.'
    });
  }
  
  return insights;
}
