
import { createApiService } from './apiService';
import { toast } from 'sonner';
import { MenuItem } from '@/types/menu';

// Service de base pour les éléments de menu
const menuItemBaseService = createApiService<MenuItem>('menu_items');

// Service avancé pour la gestion des menus
export const menuService = {
  ...menuItemBaseService,
  
  // Récupérer tous les éléments de menu par restaurant
  getMenuByRestaurant: async (restaurantId: string) => {
    try {
      return await menuItemBaseService.getAll({ restaurant_id: restaurantId });
    } catch (error) {
      console.error('Erreur lors de la récupération du menu:', error);
      toast.error('Impossible de récupérer le menu');
      return { data: null, error: error as Error };
    }
  },
  
  // Récupérer les éléments de menu par catégorie
  getMenuByCategory: async (restaurantId: string, category: string) => {
    try {
      const result = await menuItemBaseService.getAll({ 
        restaurant_id: restaurantId,
        category
      });
      return result;
    } catch (error) {
      console.error('Erreur lors de la récupération de la catégorie:', error);
      toast.error('Impossible de récupérer la catégorie');
      return { data: null, error: error as Error };
    }
  },
  
  // Mettre à jour la disponibilité d'un élément de menu
  updateAvailability: async (itemId: string, available: boolean) => {
    try {
      const result = await menuItemBaseService.update(itemId, { 
        available
      });
      toast.success(`Menu item ${available ? 'available' : 'unavailable'}`);
      return result;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la disponibilité:', error);
      toast.error('Impossible de mettre à jour la disponibilité');
      return { data: null, error: error as Error };
    }
  },
  
  // Mettre à jour les stocks d'un élément de menu
  updateStock: async (itemId: string, stock: number) => {
    try {
      const inventoryService = createApiService('inventory_levels');
      
      // Vérifier si l'enregistrement d'inventaire existe déjà
      const inventoryResponse = await inventoryService.getAll({ item_id: itemId });
      
      if (inventoryResponse.data && inventoryResponse.data.length > 0) {
        // Mettre à jour l'inventaire existant
        const inventoryId = inventoryResponse.data[0].id;
        await inventoryService.update(inventoryId, {
          quantity: stock,
          updated_at: new Date().toISOString()
        });
      } else {
        // Créer un nouvel enregistrement d'inventaire
        await inventoryService.create({
          item_id: itemId,
          quantity: stock,
          low_stock_threshold: 5,
          updated_at: new Date().toISOString()
        });
      }
      
      toast.success(`Stock mis à jour: ${stock} unités`);
      return { data: { id: itemId, stock }, error: null };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du stock:', error);
      toast.error('Impossible de mettre à jour le stock');
      return { data: null, error: error as Error };
    }
  },
  
  // Ajouter une promotion à un élément de menu
  addPromotion: async (itemId: string, promotionData: {
    discount_type: 'percentage' | 'fixed_amount';
    discount_value: number;
    start_date: string;
    end_date: string;
  }) => {
    try {
      const result = await menuItemBaseService.update(itemId, {
        promotional_data: {
          is_on_promotion: true,
          ...promotionData
        }
      });
      
      toast.success('Promotion ajoutée avec succès');
      return result;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la promotion:', error);
      toast.error('Impossible d\'ajouter la promotion');
      return { data: null, error: error as Error };
    }
  },
  
  // Supprimer une promotion d'un élément de menu
  removePromotion: async (itemId: string) => {
    try {
      const result = await menuItemBaseService.update(itemId, {
        promotional_data: {
          is_on_promotion: false
        }
      });
      
      toast.success('Promotion supprimée avec succès');
      return result;
    } catch (error) {
      console.error('Erreur lors de la suppression de la promotion:', error);
      toast.error('Impossible de supprimer la promotion');
      return { data: null, error: error as Error };
    }
  }
};
