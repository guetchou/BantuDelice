
import { MenuItem } from '@/types/menu';

export interface MenuSuggestion {
  id: string;
  type: 'add' | 'modify' | 'remove' | 'price' | 'availability';
  message: string;
  importance: 'high' | 'medium' | 'low';
  itemId?: string;
  category?: string;
}

/**
 * Génère des suggestions intelligentes pour optimiser le menu
 * @param items Éléments du menu à analyser
 * @returns Liste de suggestions avec niveau d'importance
 */
export const generateMenuSuggestions = (items: MenuItem[]): MenuSuggestion[] => {
  if (!items || items.length === 0) {
    return [];
  }

  const suggestions: MenuSuggestion[] = [];

  // Analyser l'équilibre du menu
  analyzeMenuBalance(items, suggestions);
  
  // Analyser la tarification
  analyzePricing(items, suggestions);
  
  // Analyser la popularité
  analyzePopularity(items, suggestions);
  
  // Analyser la disponibilité
  analyzeAvailability(items, suggestions);
  
  // Analyser les options diététiques
  analyzeDietaryOptions(items, suggestions);

  return suggestions;
};

/**
 * Analyse l'équilibre du menu entre différentes catégories
 */
const analyzeMenuBalance = (items: MenuItem[], suggestions: MenuSuggestion[]) => {
  const categoryDistribution = new Map<string, MenuItem[]>();
  
  // Grouper par catégorie
  items.forEach(item => {
    if (!categoryDistribution.has(item.category)) {
      categoryDistribution.set(item.category, []);
    }
    categoryDistribution.get(item.category)?.push(item);
  });
  
  const categories = Array.from(categoryDistribution.keys());
  const avgItemsPerCategory = items.length / categories.length;
  
  // Vérifier les déséquilibres
  categoryDistribution.forEach((categoryItems, category) => {
    const categorySize = categoryItems.length;
    
    // Catégorie trop grande
    if (categorySize > avgItemsPerCategory * 1.5 && categorySize > 5) {
      suggestions.push({
        id: `balance-large-category-${category}`,
        type: 'modify',
        message: `La catégorie "${category}" contient ${categorySize} items, ce qui est beaucoup plus que la moyenne. Envisagez de la subdiviser.`,
        importance: 'medium',
        category
      });
    }
    
    // Catégorie trop petite
    if (categorySize < 2 && categories.length > 3) {
      suggestions.push({
        id: `balance-small-category-${category}`,
        type: 'modify',
        message: `La catégorie "${category}" ne contient que ${categorySize} item(s). Ajoutez plus d'options ou fusionnez-la avec une autre catégorie.`,
        importance: 'low',
        category
      });
    }
  });
};

/**
 * Analyse la stratégie de tarification
 */
const analyzePricing = (items: MenuItem[], suggestions: MenuSuggestion[]) => {
  const prices = items.map(item => item.price);
  const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const priceRange = maxPrice - minPrice;
  
  // Faible variance des prix
  if (priceRange < avgPrice * 0.3 && items.length > 5) {
    suggestions.push({
      id: 'pricing-low-variance',
      type: 'price',
      message: `La gamme de prix du menu est étroite. Envisagez d'ajouter des options premium et économiques pour élargir votre clientèle.`,
      importance: 'medium'
    });
  }
  
  // Analyse individuelle des prix
  items.forEach(item => {
    // Détection d'anomalies de prix
    if (item.price > avgPrice * 2) {
      suggestions.push({
        id: `pricing-anomaly-high-${item.id}`,
        type: 'price',
        message: `"${item.name}" est beaucoup plus cher (${item.price.toLocaleString()} FCFA) que la moyenne du menu (${avgPrice.toLocaleString()} FCFA). Vérifiez que sa valeur perçue justifie ce prix.`,
        importance: 'medium',
        itemId: item.id
      });
    }
    
    if (item.price < avgPrice * 0.4 && item.price > 0) {
      suggestions.push({
        id: `pricing-anomaly-low-${item.id}`,
        type: 'price',
        message: `"${item.name}" est beaucoup moins cher que la moyenne. Vérifiez sa rentabilité ou utilisez-le comme produit d'appel.`,
        importance: 'low',
        itemId: item.id
      });
    }
  });
};

/**
 * Analyse la popularité des items du menu
 */
const analyzePopularity = (items: MenuItem[], suggestions: MenuSuggestion[]) => {
  const itemsWithPopularity = items.filter(item => item.popularity_score !== undefined);
  
  if (itemsWithPopularity.length < items.length / 2) {
    suggestions.push({
      id: 'popularity-data-missing',
      type: 'modify',
      message: `Des données de popularité manquent pour ${items.length - itemsWithPopularity.length} plats. Suivez les performances de tous vos plats pour une meilleure analyse.`,
      importance: 'medium'
    });
  }
  
  if (itemsWithPopularity.length > 0) {
    const sortedByPopularity = [...itemsWithPopularity].sort((a, b) => 
      (b.popularity_score || 0) - (a.popularity_score || 0)
    );
    
    // Plats les moins populaires
    const leastPopular = sortedByPopularity.slice(-3);
    leastPopular.forEach(item => {
      if ((item.popularity_score || 0) < 0.3) {
        suggestions.push({
          id: `popularity-low-${item.id}`,
          type: 'modify',
          message: `"${item.name}" est l'un des plats les moins populaires. Envisagez de le retirer, de le modifier ou de le mettre en avant.`,
          importance: 'high',
          itemId: item.id
        });
      }
    });
    
    // Plats populaires à mettre en avant
    const mostPopular = sortedByPopularity.slice(0, 3);
    mostPopular.forEach(item => {
      if ((item.popularity_score || 0) > 0.7) {
        suggestions.push({
          id: `popularity-high-${item.id}`,
          type: 'modify',
          message: `"${item.name}" est très populaire. Envisagez de le mettre en avant ou de créer des variantes.`,
          importance: 'medium',
          itemId: item.id
        });
      }
    });
  }
};

/**
 * Analyse la disponibilité des items
 */
const analyzeAvailability = (items: MenuItem[], suggestions: MenuSuggestion[]) => {
  const unavailableItems = items.filter(item => !item.available);
  const unavailablePercentage = (unavailableItems.length / items.length) * 100;
  
  if (unavailablePercentage > 15) {
    suggestions.push({
      id: 'availability-issues',
      type: 'availability',
      message: `${unavailableItems.length} plats (${unavailablePercentage.toFixed(0)}% du menu) sont indisponibles. Vérifiez votre approvisionnement.`,
      importance: 'high'
    });
  }
  
  const popularUnavailable = unavailableItems.filter(item => (item.popularity_score || 0) > 0.6);
  if (popularUnavailable.length > 0) {
    popularUnavailable.forEach(item => {
      suggestions.push({
        id: `availability-popular-${item.id}`,
        type: 'availability',
        message: `"${item.name}" est populaire mais actuellement indisponible. Prioritarisez son réapprovisionnement.`,
        importance: 'high',
        itemId: item.id
      });
    });
  }
};

/**
 * Analyse les options diététiques
 */
const analyzeDietaryOptions = (items: MenuItem[], suggestions: MenuSuggestion[]) => {
  // Compter les options pour chaque régime
  const vegetarianItems = items.filter(item => item.is_vegetarian);
  const veganItems = items.filter(item => item.is_vegan);
  const glutenFreeItems = items.filter(item => item.is_gluten_free);
  
  const vegetarianPercentage = (vegetarianItems.length / items.length) * 100;
  const veganPercentage = (veganItems.length / items.length) * 100;
  const glutenFreePercentage = (glutenFreeItems.length / items.length) * 100;
  
  // Suggestions basées sur les pourcentages
  if (vegetarianPercentage < 15 && items.length > 10) {
    suggestions.push({
      id: 'dietary-vegetarian',
      type: 'add',
      message: `Seulement ${vegetarianPercentage.toFixed(0)}% de votre menu est végétarien. Ajoutez plus d'options végétariennes pour attirer cette clientèle croissante.`,
      importance: 'high'
    });
  }
  
  if (veganPercentage < 5 && items.length > 15) {
    suggestions.push({
      id: 'dietary-vegan',
      type: 'add',
      message: `Très peu d'options véganes (${veganPercentage.toFixed(0)}%). Développez des plats véganes pour cette clientèle en croissance.`,
      importance: 'medium'
    });
  }
  
  if (glutenFreePercentage < 10 && items.length > 15) {
    suggestions.push({
      id: 'dietary-gluten-free',
      type: 'add',
      message: `Peu d'options sans gluten (${glutenFreePercentage.toFixed(0)}%). Envisagez d'adapter certains plats populaires en version sans gluten.`,
      importance: 'low'
    });
  }
  
  // Vérifier la distribution des options diététiques par catégorie
  const categoriesWithoutVegetarian = new Set<string>();
  
  items.forEach(item => {
    if (!item.is_vegetarian) {
      categoriesWithoutVegetarian.add(item.category);
    }
  });
  
  // Enlever les catégories qui ont déjà une option végétarienne
  vegetarianItems.forEach(item => {
    categoriesWithoutVegetarian.delete(item.category);
  });
  
  // Suggérer d'ajouter des options végétariennes dans les catégories qui n'en ont pas
  if (categoriesWithoutVegetarian.size > 0) {
    categoriesWithoutVegetarian.forEach(category => {
      suggestions.push({
        id: `dietary-category-${category}`,
        type: 'add',
        message: `La catégorie "${category}" ne contient aucune option végétarienne. Ajoutez-en au moins une pour satisfaire tous les clients.`,
        importance: 'medium',
        category
      });
    });
  }
};
