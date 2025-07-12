
import { MenuItem } from '@/types/menu';
import { MenuSuggestion } from './types';

/**
 * Generate price-related suggestions for a menu
 */
export const generatePriceSuggestions = (items: MenuItem[]): MenuSuggestion[] => {
  if (!items.length) return [];
  
  const suggestions: MenuSuggestion[] = [];
  const pricePoints = items.map(item => item.price);
  const avgPrice = pricePoints.reduce((sum, price) => sum + price, 0) / pricePoints.length;

  // Find items that are significantly more expensive than average
  const expensiveItems = items.filter(item => item.price > avgPrice * 1.5);
  if (expensiveItems.length > 0) {
    suggestions.push({
      type: 'price',
      priority: 'medium',
      message: `${expensiveItems.length} items are priced significantly higher than your menu average. Consider creating special value propositions for these items.`,
      affectedItems: expensiveItems.map(item => item.id)
    });
  }

  // Find items that are very inexpensive - potential for price increase
  const cheapItems = items.filter(item => item.price < avgPrice * 0.5);
  if (cheapItems.length > 0) {
    suggestions.push({
      type: 'price',
      priority: 'low',
      message: `${cheapItems.length} items are priced significantly lower than your menu average. You might be underpricing these items.`,
      affectedItems: cheapItems.map(item => item.id)
    });
  }

  // Check for price clustering
  const priceRanges = [0, 5000, 10000, 15000, 20000, Number.MAX_VALUE];
  const priceCounts = Array(priceRanges.length - 1).fill(0);
  
  items.forEach(item => {
    for (let i = 0; i < priceRanges.length - 1; i++) {
      if (item.price >= priceRanges[i] && item.price < priceRanges[i + 1]) {
        priceCounts[i]++;
        break;
      }
    }
  });
  
  // Check if more than 70% of items are in the same price range
  const maxCount = Math.max(...priceCounts);
  const maxIndex = priceCounts.indexOf(maxCount);
  if (maxCount > items.length * 0.7) {
    suggestions.push({
      type: 'price',
      priority: 'medium',
      message: `${maxCount} items (${Math.round(maxCount / items.length * 100)}%) are in the same price range (${priceRanges[maxIndex]}-${priceRanges[maxIndex + 1]} XAF). Consider diversifying your price points.`,
      affectedItems: []
    });
  }

  return suggestions;
};

/**
 * Generate availability-related suggestions for a menu
 */
export const generateAvailabilitySuggestions = (items: MenuItem[]): MenuSuggestion[] => {
  if (!items.length) return [];
  
  const suggestions: MenuSuggestion[] = [];
  const unavailableItems = items.filter(item => !item.available);
  
  if (unavailableItems.length > 0) {
    const unavailablePercentage = (unavailableItems.length / items.length) * 100;
    
    if (unavailablePercentage > 30) {
      suggestions.push({
        type: 'availability',
        priority: 'high',
        message: `${unavailableItems.length} items (${Math.round(unavailablePercentage)}%) are currently unavailable. This high percentage may disappoint customers.`,
        affectedItems: unavailableItems.map(item => item.id)
      });
    } else if (unavailablePercentage > 15) {
      suggestions.push({
        type: 'availability',
        priority: 'medium',
        message: `${unavailableItems.length} items (${Math.round(unavailablePercentage)}%) are currently unavailable. Consider updating your inventory or menu.`,
        affectedItems: unavailableItems.map(item => item.id)
      });
    }
  }

  return suggestions;
};

/**
 * Generate balance and diversity related suggestions for a menu
 */
export const generateBalanceSuggestions = (items: MenuItem[]): MenuSuggestion[] => {
  if (!items.length) return [];
  
  const suggestions: MenuSuggestion[] = [];
  
  // Check category balance
  const categories = items.map(item => item.category);
  const uniqueCategories = [...new Set(categories)];
  const categoryCounts = uniqueCategories.map(category => 
    categories.filter(cat => cat === category).length
  );
  
  const maxCategoryCount = Math.max(...categoryCounts);
  const maxCategory = uniqueCategories[categoryCounts.indexOf(maxCategoryCount)];
  const maxCategoryPercentage = (maxCategoryCount / items.length) * 100;
  
  if (maxCategoryPercentage > 50 && items.length >= 10) {
    suggestions.push({
      type: 'balance',
      priority: 'medium',
      message: `${maxCategoryCount} out of ${items.length} items (${Math.round(maxCategoryPercentage)}%) are in the "${maxCategory}" category. Consider expanding other categories for better menu balance.`,
      affectedItems: []
    });
  }
  
  // Check for dietary options
  const vegetarianCount = items.filter(item => item.is_vegetarian).length;
  const vegetarianPercentage = (vegetarianCount / items.length) * 100;
  
  if (vegetarianPercentage < 15 && items.length >= 10) {
    suggestions.push({
      type: 'balance',
      priority: 'medium',
      message: `Only ${vegetarianPercentage.toFixed(1)}% of your menu is vegetarian. Consider adding more vegetarian options to attract a wider customer base.`,
      affectedItems: []
    });
  }
  
  return suggestions;
};

/**
 * Generate performance-related suggestions for a menu
 */
export const generatePerformanceSuggestions = (items: MenuItem[]): MenuSuggestion[] => {
  if (!items.length) return [];
  
  const suggestions: MenuSuggestion[] = [];
  
  // Identify low performing items
  const lowPerforming = items
    .filter(item => item.popularity_score !== undefined && item.popularity_score < 2)
    .sort((a, b) => (a.popularity_score || 0) - (b.popularity_score || 0));
  
  if (lowPerforming.length > 0 && lowPerforming.length <= items.length * 0.2) {
    suggestions.push({
      type: 'performance',
      priority: 'high',
      message: `${lowPerforming.length} items have very low popularity scores. Consider revising these items or their placement on the menu.`,
      affectedItems: lowPerforming.map(item => item.id)
    });
  }
  
  // Check for high profit but low popularity items
  const highProfitLowPopularity = items
    .filter(item => 
      item.profit_margin !== undefined && 
      item.popularity_score !== undefined && 
      item.profit_margin > 0.4 && 
      item.popularity_score < 3
    );
  
  if (highProfitLowPopularity.length > 0) {
    suggestions.push({
      type: 'performance',
      priority: 'high',
      message: `${highProfitLowPopularity.length} high-profit items have low popularity. Consider featuring or repositioning these items to increase sales.`,
      affectedItems: highProfitLowPopularity.map(item => item.id)
    });
  }
  
  return suggestions;
};
