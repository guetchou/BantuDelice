
import pb from '@/lib/pocketbase';
import { ClientResponseError } from 'pocketbase';
import { toast } from 'sonner';

/**
 * Adaptateur pour standardiser les appels API entre Supabase et PocketBase
 * Permet une migration progressive sans casser l'interface existante
 */

// Type standard pour les réponses d'API
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  count?: number;
  totalItems?: number;
}

// Fonctions d'aide pour formater les réponses
const formatSuccess = <T>(data: T, count?: number): ApiResponse<T> => ({
  data,
  error: null,
  count,
  totalItems: count
});

const formatError = <T>(error: any): ApiResponse<T> => ({
  data: null,
  error: error instanceof Error ? error : new Error(String(error)),
});

// Wrapper pour les appels PocketBase avec gestion d'erreur standardisée
export const pbWrapper = async <T>(
  operation: () => Promise<T>,
  errorMessage: string = "Une erreur est survenue"
): Promise<ApiResponse<T>> => {
  try {
    const result = await operation();
    return formatSuccess(result);
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    
    // Afficher un toast pour les erreurs
    if (error instanceof ClientResponseError) {
      toast.error(error.message);
    } else {
      toast.error(errorMessage);
    }
    
    return formatError<T>(error);
  }
};

// Adaptateur pour la collection PocketBase
export const createCollection = <T extends Record<string, any>>(collectionName: string) => {
  return {
    getList: async (
      page: number = 1,
      perPage: number = 20,
      options: Record<string, any> = {}
    ): Promise<ApiResponse<T[]>> => {
      return pbWrapper(async () => {
        const result = await pb.collection(collectionName).getList(page, perPage, options);
        const items = result.items as unknown as T[];
        return {
          data: items,
          totalItems: result.totalItems,
          count: result.items.length
        };
      }, `Impossible de récupérer les données de ${collectionName}`);
    },
    
    getOne: async (id: string): Promise<ApiResponse<T>> => {
      return pbWrapper(
        async () => {
          const record = await pb.collection(collectionName).getOne(id);
          return record as unknown as T;
        },
        `Impossible de récupérer l'élément de ${collectionName}`
      );
    },
    
    create: async (data: Record<string, any>): Promise<ApiResponse<T>> => {
      return pbWrapper(
        async () => {
          const record = await pb.collection(collectionName).create(data);
          return record as unknown as T;
        },
        `Impossible de créer l'élément dans ${collectionName}`
      );
    },
    
    update: async (id: string, data: Record<string, any>): Promise<ApiResponse<T>> => {
      return pbWrapper(
        async () => {
          const record = await pb.collection(collectionName).update(id, data);
          return record as unknown as T;
        },
        `Impossible de mettre à jour l'élément dans ${collectionName}`
      );
    },
    
    delete: async (id: string): Promise<ApiResponse<boolean>> => {
      return pbWrapper(async () => {
        await pb.collection(collectionName).delete(id);
        return true;
      }, `Impossible de supprimer l'élément de ${collectionName}`);
    },
    
    // Méthodes spécifiques pour faciliter la migration depuis Supabase
    getByField: async (field: string, value: any): Promise<ApiResponse<T>> => {
      return pbWrapper(async () => {
        const result = await pb.collection(collectionName).getFirstListItem(`${field}="${value}"`);
        return result as unknown as T;
      }, `Impossible de trouver l'élément dans ${collectionName}`);
    },
    
    getByFilter: async (filter: string, options: Record<string, any> = {}): Promise<ApiResponse<T[]>> => {
      return pbWrapper(async () => {
        const result = await pb.collection(collectionName).getList(1, 50, {
          filter,
          ...options
        });
        const items = result.items as unknown as T[];
        return {
          data: items,
          totalItems: result.totalItems,
          count: result.items.length
        };
      }, `Impossible de filtrer les données de ${collectionName}`);
    }
  };
};

// Service d'authentification standardisé
export const authAdapter = {
  getCurrentUser: async (): Promise<ApiResponse<any>> => {
    return pbWrapper(async () => {
      if (!pb.authStore.isValid) {
        return null;
      }
      return pb.authStore.model;
    }, "Impossible de récupérer l'utilisateur actuel");
  },
  
  login: async (email: string, password: string): Promise<ApiResponse<any>> => {
    return pbWrapper(async () => {
      const authData = await pb.collection('users').authWithPassword(email, password);
      return authData.record;
    }, "Échec de connexion");
  },
  
  register: async (email: string, password: string, userData: Record<string, any>): Promise<ApiResponse<any>> => {
    return pbWrapper(async () => {
      const data = {
        email,
        password,
        passwordConfirm: password,
        ...userData
      };
      const record = await pb.collection('users').create(data);
      return record;
    }, "Échec d'inscription");
  },
  
  logout: (): ApiResponse<boolean> => {
    pb.authStore.clear();
    return formatSuccess(true);
  },
  
  resetPassword: async (email: string): Promise<ApiResponse<boolean>> => {
    return pbWrapper(async () => {
      await pb.collection('users').requestPasswordReset(email);
      return true;
    }, "Échec de réinitialisation du mot de passe");
  }
};
