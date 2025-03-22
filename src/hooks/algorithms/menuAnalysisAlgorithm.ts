
import { MenuItem } from '@/types/menu';

export interface MenuAnalysisResult {
  totalItems: number;
  categoriesCount: number;
  categories: string[];
  priceStats: {
    min: number;
    max: number;
    average: number;
    median: number;
  };
  dietaryOptions: {
    vegetarianCount: number;
    vegetarianPercentage: number;
    veganCount: number;
    veganPercentage: number;
    glutenFreeCount: number;
    glutenFreePercentage: number;
  };
  popularityStats: {
    mostPopular: MenuItem[];
    leastPopular: MenuItem[];
    averagePopularity: number;
  };
  availability: {
    availableCount: number;
    availablePercentage: number;
  };
  menuSuggestions: {
    id: string;
    type: 'add' | 'modify' | 'remove' | 'price' | 'availability';
    message: string;
    importance: 'high' | 'medium' | 'low';
    itemId?: string;
  }[];
}

/**
 * Analyse un menu et génère des statistiques et des suggestions
 * @param items Éléments du menu à analyser
 * @returns Résultat de l'analyse avec statistiques et suggestions
 */
export const analyzeMenu = (items: MenuItem[]): MenuAnalysisResult => {
  if (!items || items.length === 0) {
    return createEmptyAnalysis();
  }

  // Données de base
  const totalItems = items.length;
  const categories = Array.from(new Set(items.map(item => item.category)));
  const categoriesCount = categories.length;

  // Statistiques de prix
  const prices = items.map(item => item.price).filter(price => price > 0);
  const priceStats = {
    min: Math.min(...prices),
    max: Math.max(...prices),
    average: prices.reduce((sum, price) => sum + price, 0) / prices.length,
    median: getMedian(prices)
  };

  // Options diététiques
  const vegetarianItems = items.filter(item => item.is_vegetarian);
  const veganItems = items.filter(item => item.is_vegan);
  const glutenFreeItems = items.filter(item => item.is_gluten_free);

  const dietaryOptions = {
    vegetarianCount: vegetarianItems.length,
    vegetarianPercentage: (vegetarianItems.length / totalItems) * 100,
    veganCount: veganItems.length,
    veganPercentage: (veganItems.length / totalItems) * 100,
    glutenFreeCount: glutenFreeItems.length,
    glutenFreePercentage: (glutenFreeItems.length / totalItems) * 100
  };

  // Statistiques de popularité
  const itemsWithPopularity = items.filter(item => item.popularity_score !== undefined);
  const sortedByPopularity = [...itemsWithPopularity].sort((a, b) => 
    (b.popularity_score || 0) - (a.popularity_score || 0)
  );

  const popularityStats = {
    mostPopular: sortedByPopularity.slice(0, 5),
    leastPopular: sortedByPopularity.slice(-5).reverse(),
    averagePopularity: itemsWithPopularity.reduce((sum, item) => sum + (item.popularity_score || 0), 0) / 
      (itemsWithPopularity.length || 1)
  };

  // Disponibilité
  const availableItems = items.filter(item => item.available);
  const availability = {
    availableCount: availableItems.length,
    availablePercentage: (availableItems.length / totalItems) * 100
  };

  // Générer des suggestions
  const menuSuggestions = generateSuggestions(items, {
    priceStats,
    categories,
    popularityStats,
    dietaryOptions
  });

  return {
    totalItems,
    categoriesCount,
    categories,
    priceStats,
    dietaryOptions,
    popularityStats,
    availability,
    menuSuggestions
  };
};

// Fonction pour obtenir la médiane d'un tableau de nombres
const getMedian = (numbers: number[]): number => {
  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  
  return sorted[middle];
};

// Générer des suggestions d'optimisation du menu
const generateSuggestions = (
  items: MenuItem[], 
  stats: any
): { id: string; type: string; message: string; importance: string; itemId?: string }[] => {
  const suggestions = [];
  
  // Vérifier l'équilibre des catégories
  const categoryDistribution = new Map<string, number>();
  items.forEach(item => {
    categoryDistribution.set(
      item.category,
      (categoryDistribution.get(item.category) || 0) + 1
    );
  });
  
  // Trouver des catégories surreprésentées ou sous-représentées
  const avgItemsPerCategory = items.length / stats.categories.length;
  categoryDistribution.forEach((count, category) => {
    if (count > avgItemsPerCategory * 2) {
      suggestions.push({
        id: `category-overrepresented-${category}`,
        type: 'modify',
        message: `La catégorie "${category}" contient beaucoup d'items (${count}). Envisagez de la subdiviser en sous-catégories.`,
        importance: 'medium'
      });
    } else if (count <= 2 && items.length > 10) {
      suggestions.push({
        id: `category-underrepresented-${category}`,
        type: 'add',
        message: `La catégorie "${category}" ne contient que ${count} item(s). Envisagez d'ajouter plus d'options ou de fusionner avec une autre catégorie.`,
        importance: 'low'
      });
    }
  });
  
  // Vérifier les options végétariennes/véganes
  if (stats.dietaryOptions.vegetarianPercentage < 20 && items.length >= 10) {
    suggestions.push({
      id: 'add-vegetarian-options',
      type: 'add',
      message: `Seulement ${stats.dietaryOptions.vegetarianPercentage.toFixed(0)}% des plats sont végétariens. Ajoutez plus d'options pour cette clientèle.`,
      importance: 'high'
    });
  }
  
  // Analyser les prix
  items.forEach(item => {
    if (item.price > stats.priceStats.average * 2) {
      suggestions.push({
        id: `high-price-${item.id}`,
        type: 'price',
        message: `"${item.name}" est considérablement plus cher que la moyenne. Assurez-vous que la qualité justifie ce prix.`,
        importance: 'medium',
        itemId: item.id
      });
    }
  });
  
  // Vérifier les items peu populaires avec prix élevés
  stats.popularityStats.leastPopular.forEach(item => {
    if (item.price > stats.priceStats.average) {
      suggestions.push({
        id: `unpopular-expensive-${item.id}`,
        type: 'modify',
        message: `"${item.name}" est peu populaire mais coûteux. Envisagez de réviser son prix ou sa recette.`,
        importance: 'high',
        itemId: item.id
      });
    }
  });
  
  return suggestions;
};

// Créer une analyse vide pour les cas où il n'y a pas d'éléments
const createEmptyAnalysis = (): MenuAnalysisResult => {
  return {
    totalItems: 0,
    categoriesCount: 0,
    categories: [],
    priceStats: {
      min: 0,
      max: 0,
      average: 0,
      median: 0
    },
    dietaryOptions: {
      vegetarianCount: 0,
      vegetarianPercentage: 0,
      veganCount: 0,
      veganPercentage: 0,
      glutenFreeCount: 0,
      glutenFreePercentage: 0
    },
    popularityStats: {
      mostPopular: [],
      leastPopular: [],
      averagePopularity: 0
    },
    availability: {
      availableCount: 0,
      availablePercentage: 0
    },
    menuSuggestions: []
  };
};
