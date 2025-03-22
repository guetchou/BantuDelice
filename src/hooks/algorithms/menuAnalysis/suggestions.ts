
/**
 * Module pour les suggestions de menu
 */

import { MenuItem } from '@/types/menu';
import { calculatePriceStats } from './stats';

/**
 * Génère des suggestions pour les prix des articles
 */
export const generatePriceSuggestions = (items: MenuItem[]) => {
  const suggestions = [];
  const priceStats = calculatePriceStats(items);

  // Analyse des prix pour les articles sur/sous-évalués
  for (const item of items) {
    // Articles significativement plus chers que la moyenne
    if (item.price > priceStats.average * 1.5) {
      suggestions.push({
        id: `price-high-${item.id}`,
        type: 'price' as const,
        message: `"${item.name}" est 50% plus cher que la moyenne de sa catégorie. Envisagez de réduire le prix ou d'ajouter plus de valeur.`,
        importance: 'medium' as const,
        itemId: item.id
      });
    }
    
    // Articles significativement moins chers que la moyenne
    if (item.price < priceStats.average * 0.7 && item.price > 0) {
      suggestions.push({
        id: `price-low-${item.id}`,
        type: 'price' as const,
        message: `"${item.name}" est 30% moins cher que la moyenne. Vous pourriez envisager d'augmenter légèrement le prix.`,
        importance: 'low' as const,
        itemId: item.id
      });
    }
  }

  return suggestions;
};

/**
 * Génère des suggestions pour la disponibilité des articles
 */
export const generateAvailabilitySuggestions = (items: MenuItem[]) => {
  const suggestions = [];
  
  // Trouver les articles populaires mais non disponibles
  const popularUnavailable = items.filter(item => 
    !item.available && 
    (item.popularity_score || 0) > 7
  );
  
  for (const item of popularUnavailable) {
    suggestions.push({
      id: `availability-popular-${item.id}`,
      type: 'availability' as const,
      message: `"${item.name}" est très populaire mais actuellement indisponible. Envisagez de le rendre disponible pour augmenter les ventes.`,
      importance: 'high' as const,
      itemId: item.id
    });
  }

  return suggestions;
};

/**
 * Génère des suggestions pour l'équilibre du menu
 */
export const generateBalanceSuggestions = (items: MenuItem[]) => {
  const suggestions = [];
  const categories = [...new Set(items.map(item => item.category))];
  
  for (const category of categories) {
    const categoryItems = items.filter(item => item.category === category);
    
    // Catégories avec trop peu d'options
    if (categoryItems.length < 3) {
      suggestions.push({
        id: `balance-few-${category}`,
        type: 'add' as const,
        message: `La catégorie "${category}" a seulement ${categoryItems.length} options. Envisagez d'ajouter plus de variété.`,
        importance: 'medium' as const
      });
    }
    
    // Catégories sans options végétariennes
    const hasVegetarian = categoryItems.some(item => item.is_vegetarian);
    if (!hasVegetarian && categoryItems.length >= 4) {
      suggestions.push({
        id: `balance-veg-${category}`,
        type: 'add' as const,
        message: `La catégorie "${category}" n'a pas d'options végétariennes. Envisagez d'ajouter au moins une option végétarienne.`,
        importance: 'medium' as const
      });
    }
  }

  return suggestions;
};

/**
 * Génère des suggestions pour les articles peu performants
 */
export const generatePerformanceSuggestions = (items: MenuItem[]) => {
  const suggestions = [];
  
  // Articles ayant à la fois un prix élevé et une popularité faible
  const lowPerformers = items.filter(item => 
    (item.popularity_score || 0) < 3 && 
    item.price > calculatePriceStats(items).average
  );
  
  for (const item of lowPerformers) {
    suggestions.push({
      id: `performance-low-${item.id}`,
      type: 'modify' as const,
      message: `"${item.name}" a un prix supérieur à la moyenne mais une popularité faible. Envisagez de le modifier ou de le remplacer.`,
      importance: 'high' as const,
      itemId: item.id
    });
  }

  return suggestions;
};
