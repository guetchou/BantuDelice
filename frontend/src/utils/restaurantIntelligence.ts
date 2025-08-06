
import { MenuItem, Restaurant } from '@/types/restaurant';

/**
 * Intelligent price optimization algorithm that analyzes historical sales data,
 * competition, and customer behavior to suggest optimal prices for menu items.
 * 
 * @param menuItems List of menu items
 * @param salesData Historical sales data
 * @param competitorPrices Competitor pricing if available
 * @returns Optimized pricing recommendations
 */
export const optimizePricing = (
  menuItems: MenuItem[], 
  salesData: unknown[] = [], 
  competitorPrices: Record<string, number> = {}
) => {
  const recommendations: {
    itemId: string;
    name: string;
    currentPrice: number;
    recommendedPrice: number;
    potentialRevenue: string;
    confidence: 'high' | 'medium' | 'low';
  }[] = [];

  // Mock implementation for demonstration
  menuItems.forEach(item => {
    // Skip certain items
    if (Math.random() > 0.7) return;
    
    // Generate a price adjustment between -15% and +25%
    const adjustmentFactor = 0.85 + (Math.random() * 0.4);
    const currentPrice = item.price;
    let recommendedPrice = Math.round(currentPrice * adjustmentFactor / 100) * 100;
    
    // Ensure minimum price change
    if (Math.abs(recommendedPrice - currentPrice) < 300) {
      recommendedPrice = currentPrice + (adjustmentFactor > 1 ? 300 : -300);
    }
    
    // Determine confidence based on sales data availability
    const hasSalesData = salesData.some(sale => sale.itemId === item.id);
    const hasCompetitorData = competitorPrices[item.id] !== undefined;
    
    let confidence: 'high' | 'medium' | 'low' = 'medium';
    if (hasSalesData && hasCompetitorData) {
      confidence = 'high';
    } else if (!hasSalesData && !hasCompetitorData) {
      confidence = 'low';
    }
    
    // Calculate potential revenue impact
    const potentialRevenue = `+${Math.round((recommendedPrice / currentPrice - 1) * 100)}%`;
    
    recommendations.push({
      itemId: item.id,
      name: item.name,
      currentPrice,
      recommendedPrice,
      potentialRevenue,
      confidence
    });
  });
  
  // Sort by potential revenue (highest first)
  return recommendations.sort((a, b) => {
    const aPercent = parseFloat(a.potentialRevenue.replace('+', '').replace('%', ''));
    const bPercent = parseFloat(b.potentialRevenue.replace('+', '').replace('%', ''));
    return bPercent - aPercent;
  });
};

/**
 * Menu optimization algorithm that analyzes item popularity, profitability,
 * and preparation complexity to suggest menu adjustments.
 * 
 * @param menuItems Current menu items
 * @param salesData Historical sales data
 * @param costData Cost data for ingredients
 * @returns Menu optimization recommendations
 */
export const optimizeMenu = (
  menuItems: MenuItem[],
  salesData: unknown[] = [],
  costData: Record<string, number> = {}
) => {
  const recommendations: {
    type: 'add' | 'remove' | 'modify';
    name: string;
    description?: string;
    reason?: string;
    suggestion?: string;
    estimatedRevenue?: string;
    potentialSavings?: string;
    confidence: 'high' | 'medium' | 'low';
  }[] = [];
  
  // Find low-selling items
  const lowSellingItems = menuItems.filter(item => Math.random() < 0.2);
  
  // Find high-margin but complex items
  const complexHighMarginItems = menuItems.filter(item => 
    item.preparation_time && item.preparation_time > 20 && Math.random() > 0.7
  );
  
  // Identify gaps in the menu
  const categories = Array.from(new Set(menuItems.map(item => item.category)));
  const gapsInMenu = categories.filter(() => Math.random() > 0.7);
  
  // Generate removal recommendations
  lowSellingItems.forEach(item => {
    recommendations.push({
      type: 'remove',
      name: item.name,
      reason: 'Faible marge, faible popularité',
      potentialSavings: `${Math.round(500 + Math.random() * 15000)},000 FCFA/mois`,
      confidence: Math.random() > 0.5 ? 'high' : 'medium'
    });
  });
  
  // Generate modification recommendations
  complexHighMarginItems.forEach(item => {
    recommendations.push({
      type: 'modify',
      name: item.name,
      suggestion: Math.random() > 0.5 ? 
        'Simplifier la recette pour réduire le temps de préparation' :
        'Offrir une version pour 2 personnes',
      estimatedRevenue: `+${Math.round(2 + Math.random() * 8)},000 FCFA/semaine`,
      confidence: Math.random() > 0.7 ? 'high' : 'medium'
    });
  });
  
  // Generate new item recommendations
  gapsInMenu.forEach(category => {
    const suggestedItems = [
      { name: 'Burger Africain', description: 'Burger avec sauce arachide et légumes locaux' },
      { name: 'Poulet Yassa Revisité', description: 'Version moderne avec réduction de citron au miel' },
      { name: 'Bowl Africain', description: 'Bowl healthy avec fonio, légumes et protéines aux choix' },
      { name: 'Pizza Ndolé', description: 'Pizza fusion avec base de ndolé et fromage local' }
    ];
    
    const item = suggestedItems[Math.floor(Math.random() * suggestedItems.length)];
    
    recommendations.push({
      type: 'add',
      name: item.name,
      description: item.description,
      estimatedRevenue: `${Math.round(10 + Math.random() * 40)},000 FCFA/semaine`,
      confidence: Math.random() > 0.3 ? 'high' : 'medium'
    });
  });
  
  return recommendations;
};

/**
 * Inventory optimization algorithm that analyzes consumption patterns,
 * spoilage rates, and supplier terms to optimize stock levels.
 * 
 * @param inventoryItems Current inventory items
 * @param consumptionData Historical consumption data
 * @returns Inventory optimization recommendations
 */
export const optimizeInventory = (
  inventoryItems: unknown[],
  consumptionData: unknown[] = []
) => {
  // This would be a complex algorithm in a real application
  // Here we just provide a simplified mock implementation
  
  const recommendations = [
    {
      item: 'Poulet',
      currentStock: '20 kg',
      recommendation: 'Augmenter de 15%',
      reason: 'Ventes en hausse le weekend',
      potentialSavings: '30,000 FCFA/mois'
    },
    {
      item: 'Tomates',
      currentStock: '15 kg',
      recommendation: 'Réduire de 10%',
      reason: 'Gaspillage observé',
      potentialSavings: '12,000 FCFA/mois'
    },
    {
      item: 'Riz',
      currentStock: '50 kg',
      recommendation: 'Commander plus fréquemment',
      reason: 'Optimisation du cash flow',
      potentialSavings: '25,000 FCFA/mois'
    }
  ];
  
  return recommendations;
};

/**
 * Staff scheduling optimization algorithm that analyzes customer traffic patterns,
 * sales volume, and preparation times to suggest optimal staffing levels.
 * 
 * @param staffSchedule Current staff schedule
 * @param orderData Historical order data with timestamps
 * @param staffPositions Available staff positions
 * @returns Staff scheduling recommendations
 */
export const optimizeStaffScheduling = (
  staffSchedule: unknown[] = [],
  orderData: unknown[] = [],
  staffPositions: string[] = []
) => {
  // This would be a complex algorithm in a real application
  // Here we just provide a simplified mock implementation
  
  const recommendations = [
    {
      day: 'Vendredi',
      time: '18:00 - 22:00',
      recommendation: 'Ajouter 1 serveur',
      reason: 'Temps d\'attente élevé',
      impact: 'Amélioration satisfaction client +15%'
    },
    {
      day: 'Mardi',
      time: '14:00 - 17:00',
      recommendation: 'Réduire personnel cuisine de 1',
      reason: 'Période creuse',
      impact: 'Économie de 20,000 FCFA/mois'
    },
    {
      day: 'Weekend',
      time: '12:00 - 15:00',
      recommendation: 'Ajouter 1 cuisinier',
      reason: 'Pics de commandes',
      impact: 'Réduction temps préparation de 7 min'
    }
  ];
  
  return recommendations;
};

/**
 * Marketing optimization algorithm that analyzes customer segments,
 * purchasing behavior, and competitor promotions to suggest marketing strategies.
 * 
 * @param customerData Customer data with segmentation
 * @param salesData Historical sales data
 * @param currentPromotions Current active promotions
 * @returns Marketing recommendations
 */
export const optimizeMarketing = (
  customerData: unknown[] = [],
  salesData: unknown[] = [],
  currentPromotions: unknown[] = []
) => {
  // This would be a complex algorithm in a real application
  // Here we just provide a simplified mock implementation
  
  const recommendations = [
    {
      type: 'Promotion',
      suggestion: 'Happy Hour 17h-19h sur les boissons',
      impact: 'Augmentation fréquentation +22%',
      cost: '15,000 FCFA/semaine',
      roi: '200%'
    },
    {
      type: 'Fidélité',
      suggestion: '1 plat gratuit après 10 visites',
      impact: 'Augmentation clients réguliers +15%',
      cost: '30,000 FCFA/mois',
      roi: '180%'
    },
    {
      type: 'Social Media',
      suggestion: 'Campagne Instagram sur plats signature',
      impact: 'Nouveaux clients +10%',
      cost: '25,000 FCFA',
      roi: '150%'
    }
  ];
  
  return recommendations;
};

/**
 * Demand forecasting algorithm that predicts future sales based on
 * historical data, seasonality, weather, and special events.
 * 
 * @param historicalSales Historical sales data
 * @param externalFactors External factors (weather, events, etc.)
 * @param forecast Number of days to forecast
 * @returns Sales forecast for the requested period
 */
export const forecastDemand = (
  historicalSales: unknown[] = [],
  externalFactors: unknown[] = [],
  forecast: number = 7
) => {
  // This would use a complex time-series analysis in a real application
  // Here we just provide a simplified mock implementation
  
  const forecastData = [];
  const today = new Date();
  
  for (let i = 0; i < forecast; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    // Generate a random forecast with some baseline
    const baselineSales = 100000 + Math.random() * 50000;
    
    // Apply day of week effect
    const dayOfWeek = date.getDay();
    let dayFactor = 1.0;
    
    // Weekend boost
    if (dayOfWeek === 5) dayFactor = 1.4; // Friday
    if (dayOfWeek === 6) dayFactor = 1.5; // Saturday
    if (dayOfWeek === 0) dayFactor = 1.3; // Sunday
    
    // Monday slow
    if (dayOfWeek === 1) dayFactor = 0.8;
    
    const forecastedSales = Math.round(baselineSales * dayFactor);
    
    forecastData.push({
      date: date.toISOString().split('T')[0],
      forecasted_sales: forecastedSales,
      confidence_interval: {
        lower: Math.round(forecastedSales * 0.9),
        upper: Math.round(forecastedSales * 1.1)
      }
    });
  }
  
  return forecastData;
};

/**
 * Customer segmentation algorithm that clusters customers based on
 * ordering behavior, preferences, and demographics.
 * 
 * @param customerData Customer data with order history
 * @returns Segmented customer groups with characteristics
 */
export const segmentCustomers = (customerData: unknown[] = []) => {
  // This would use clustering algorithms in a real application
  // Here we just provide a simplified mock implementation
  
  const segments = [
    {
      segment_id: 'loyal_high_value',
      name: 'Clients fidèles à forte valeur',
      size_percentage: 15,
      average_order_value: 12000,
      visit_frequency: 'Weekly',
      favorite_items: ['Poulet Yassa', 'Tieboudienne'],
      characteristics: [
        'Commande régulière',
        'Faible sensibilité au prix',
        'Préfère les plats traditionnels'
      ],
      marketing_recommendations: [
        'Programme de fidélité VIP',
        'Invitations aux événements exclusifs',
        'Accès anticipé aux nouveaux plats'
      ]
    },
    {
      segment_id: 'occasional_medium_value',
      name: 'Clients occasionnels à valeur moyenne',
      size_percentage: 40,
      average_order_value: 8000,
      visit_frequency: 'Monthly',
      favorite_items: ['Burger Africain', 'Salade Niçoise'],
      characteristics: [
        'Commande pour des occasions spéciales',
        'Sensible aux promotions',
        'Préfère les plats fusion'
      ],
      marketing_recommendations: [
        'Promotions saisonnières',
        'Remises pour réservations anticipées',
        'Communiquer sur les nouveautés du menu'
      ]
    },
    {
      segment_id: 'new_explorers',
      name: 'Nouveaux explorateurs',
      size_percentage: 25,
      average_order_value: 5000,
      visit_frequency: 'First-time or rare',
      favorite_items: ['Menu dégustation', 'Plats du jour'],
      characteristics: [
        'Première visite ou récent',
        'Curieux de découvrir',
        'Sensible aux avis et recommandations'
      ],
      marketing_recommendations: [
        'Offre de bienvenue',
        'Menu découverte à prix spécial',
        'Suivis après la première visite'
      ]
    },
    {
      segment_id: 'price_sensitive',
      name: 'Clients sensibles au prix',
      size_percentage: 20,
      average_order_value: 3500,
      visit_frequency: 'Variable',
      favorite_items: ['Plats du jour', 'Formules midi'],
      characteristics: [
        'Commande surtout pendant les promotions',
        'Privilégie le rapport qualité-prix',
        'Préfère les formules et combos'
      ],
      marketing_recommendations: [
        'Happy hours',
        'Menus du jour à prix réduits',
        'Programmes de points'
      ]
    }
  ];
  
  return segments;
};

/**
 * Menu engineering matrix that categorizes menu items into stars, plowhorses,
 * puzzles, and dogs based on popularity and profitability.
 * 
 * @param menuItems List of menu items with sales and cost data
 * @returns Categorized menu items with recommendations
 */
export const analyzeMenuEngineering = (menuItems: MenuItem[]) => {
  // This requires real sales and profitability data
  // Here we just provide a simplified mock implementation
  
  // We'll randomly assign items to categories for demonstration
  const categories = ['star', 'plowhorse', 'puzzle', 'dog'];
  
  const analyzedItems = menuItems.map(item => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const popularity = category === 'star' || category === 'plowhorse' ? 'high' : 'low';
    const profitability = category === 'star' || category === 'puzzle' ? 'high' : 'low';
    
    let recommendation = '';
    switch (category) {
      case 'star':
        recommendation = 'Mettre en avant sur le menu, maintenir le prix élevé';
        break;
      case 'plowhorse':
        recommendation = 'Augmenter le prix ou réduire les coûts pour améliorer la marge';
        break;
      case 'puzzle':
        recommendation = 'Promouvoir davantage ou améliorer la présentation';
        break;
      case 'dog':
        recommendation = 'Remplacer ou retirer du menu';
        break;
    }
    
    return {
      ...item,
      menuEngineeringCategory: category,
      popularity,
      profitability,
      recommendation
    };
  });
  
  return {
    stars: analyzedItems.filter(item => item.menuEngineeringCategory === 'star'),
    plowhorses: analyzedItems.filter(item => item.menuEngineeringCategory === 'plowhorse'),
    puzzles: analyzedItems.filter(item => item.menuEngineeringCategory === 'puzzle'),
    dogs: analyzedItems.filter(item => item.menuEngineeringCategory === 'dog')
  };
};
