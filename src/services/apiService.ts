
import { createCollection, ApiResponse } from '@/adapters/pocketbaseAdapter';
import { toast } from 'sonner';

// Types de services API
interface ApiService<T> {
  getAll: (filters?: any) => Promise<ApiResponse<T[]>>;
  getById: (id: string) => Promise<ApiResponse<T>>;
  create: (data: Partial<T>) => Promise<ApiResponse<T>>;
  update: (id: string, data: Partial<T>) => Promise<ApiResponse<T>>;
  delete: (id: string) => Promise<ApiResponse<boolean>>;
}

// Factory de services API
export function createApiService<T extends Record<string, any>>(
  collectionName: string
): ApiService<T> {
  const collection = createCollection<T>(collectionName);
  
  return {
    getAll: async (filters?: any) => {
      try {
        if (filters) {
          return await collection.getByFilter(
            Object.entries(filters)
              .map(([key, value]) => `${key}="${value}"`)
              .join(' && ')
          );
        }
        return await collection.getList();
      } catch (error) {
        console.error(`Erreur lors de la récupération des ${collectionName}:`, error);
        toast.error(`Impossible de récupérer les ${collectionName}`);
        return { data: null, error: error as Error };
      }
    },
    
    getById: async (id: string) => {
      try {
        return await collection.getOne(id);
      } catch (error) {
        console.error(`Erreur lors de la récupération de ${collectionName}:`, error);
        toast.error(`Impossible de récupérer le ${collectionName}`);
        return { data: null, error: error as Error };
      }
    },
    
    create: async (data: Partial<T>) => {
      try {
        return await collection.create(data as Record<string, any>);
      } catch (error) {
        console.error(`Erreur lors de la création de ${collectionName}:`, error);
        toast.error(`Impossible de créer le ${collectionName}`);
        return { data: null, error: error as Error };
      }
    },
    
    update: async (id: string, data: Partial<T>) => {
      try {
        return await collection.update(id, data as Record<string, any>);
      } catch (error) {
        console.error(`Erreur lors de la mise à jour de ${collectionName}:`, error);
        toast.error(`Impossible de mettre à jour le ${collectionName}`);
        return { data: null, error: error as Error };
      }
    },
    
    delete: async (id: string) => {
      try {
        return await collection.delete(id);
      } catch (error) {
        console.error(`Erreur lors de la suppression de ${collectionName}:`, error);
        toast.error(`Impossible de supprimer le ${collectionName}`);
        return { data: null, error: error as Error };
      }
    }
  };
}

// Services pré-configurés
export const restaurantService = createApiService('restaurants');
export const menuItemService = createApiService('menu_items');
export const orderService = createApiService('orders');
export const userService = createApiService('users');
export const paymentService = createApiService('payments');
export const loyaltyService = createApiService('loyalty_points');
export const deliveryService = createApiService('deliveries');
