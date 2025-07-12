
import { useMemo } from 'react';
import { MenuItem } from '@/types/menu';

interface ComboSuggestion {
  mainItem: MenuItem;
  suggestedItems: MenuItem[];
}

/**
 * Hook pour générer des suggestions de combos basés sur les items du menu
 */
export const useMenuCombos = (menuItems: MenuItem[] = []) => {
  // Groupe les items par catégorie
  const itemsByCategory = useMemo(() => {
    const groupedItems: Record<string, MenuItem[]> = {};
    
    menuItems.forEach(item => {
      if (!groupedItems[item.category]) {
        groupedItems[item.category] = [];
      }
      groupedItems[item.category].push(item);
    });
    
    return groupedItems;
  }, [menuItems]);

  // Définit les combinaisons de catégories qui forment de bons combos
  const comboPairs = useMemo(() => {
    return [
      { main: 'Plat principal', complementary: ['Boisson', 'Dessert', 'Entrée'] },
      { main: 'Burger', complementary: ['Frites', 'Boisson', 'Dessert'] },
      { main: 'Pizza', complementary: ['Entrée', 'Boisson', 'Dessert'] },
      { main: 'Sandwich', complementary: ['Frites', 'Boisson'] },
      { main: 'Salade', complementary: ['Boisson', 'Pain'] },
      // Versions en anglais pour la compatibilité
      { main: 'Main dish', complementary: ['Drink', 'Dessert', 'Starter'] },
      { main: 'Burger', complementary: ['Fries', 'Drink', 'Dessert'] },
      { main: 'Pizza', complementary: ['Starter', 'Drink', 'Dessert'] },
      { main: 'Sandwich', complementary: ['Fries', 'Drink'] },
      { main: 'Salad', complementary: ['Drink', 'Bread'] },
    ];
  }, []);

  /**
   * Génère des suggestions de combos pour un item donné
   */
  const getSuggestionsForItem = (item: MenuItem): MenuItem[] => {
    // Vérifier si l'item est déjà un combo
    if (item.is_combo) return [];
    
    // Trouver les catégories complémentaires pour cette catégorie principale
    const matchingCombo = comboPairs.find(combo => 
      combo.main.toLowerCase() === item.category.toLowerCase() ||
      combo.main.toLowerCase() === item.cuisine_type?.toLowerCase()
    );
    
    if (!matchingCombo) return [];
    
    // Récupérer les items des catégories complémentaires
    const suggestedItems: MenuItem[] = [];
    
    matchingCombo.complementary.forEach(complementaryCategory => {
      // Chercher des items correspondants par nom de catégorie (approximatif)
      const matchingCategories = Object.keys(itemsByCategory).filter(
        category => category.toLowerCase().includes(complementaryCategory.toLowerCase()) ||
                  complementaryCategory.toLowerCase().includes(category.toLowerCase())
      );
      
      matchingCategories.forEach(category => {
        // Ajouter les items disponibles (limités à 2 par catégorie)
        const availableItems = itemsByCategory[category]
          .filter(complementaryItem => complementaryItem.available && complementaryItem.id !== item.id)
          .slice(0, 2);
        
        suggestedItems.push(...availableItems);
      });
    });
    
    // Limiter à un maximum de 3 suggestions
    return suggestedItems.slice(0, 3);
  };

  /**
   * Génère des suggestions de combos pour tous les items du menu
   */
  const generateComboSuggestions = (): ComboSuggestion[] => {
    return menuItems
      .filter(item => item.available && !item.is_combo)
      .map(item => {
        const suggestedItems = getSuggestionsForItem(item);
        return {
          mainItem: item,
          suggestedItems
        };
      })
      .filter(combo => combo.suggestedItems.length > 0);
  };

  return {
    getSuggestionsForItem,
    generateComboSuggestions
  };
};
