
/**
 * API Client pour remplacer Supabase
 * 
 * Cette implémentation fournit une API compatible avec l'interface Supabase
 * tout en utilisant une API personnalisée
 */

interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

class MockApiClient {
  auth = {
    user: {
      id: "mock-user-id",
      email: "user@example.com",
      user_metadata: {
        full_name: "Utilisateur Test"
      }
    },
    getUser: async () => {
      return {
        data: { 
          user: this.auth.user
        },
        error: null
      };
    },
    getSession: async () => {
      return {
        data: { 
          session: {
            access_token: "mock-token",
            expires_at: Date.now() + 3600000
          }
        },
        error: null
      };
    },
    signInWithPassword: async (credentials: any) => {
      return {
        data: {
          user: this.auth.user,
          session: {
            access_token: "mock-token",
            expires_at: Date.now() + 3600000
          }
        },
        error: null
      };
    },
    signUp: async (credentials: any) => {
      return {
        data: {
          user: this.auth.user,
          session: {
            access_token: "mock-token",
            expires_at: Date.now() + 3600000
          }
        },
        error: null
      };
    },
    signOut: async () => {
      return {
        error: null
      };
    },
    resetPasswordForEmail: async (email: any) => {
      return {
        data: {},
        error: null
      };
    }
  };

  // Méthode générique pour simuler une requête à la base de données
  from(table: string) {
    return {
      select: (columns = "*") => {
        return this.buildQueryObject();
      },
      insert: (data: any[], options = {}) => {
        return Promise.resolve({
          data: data,
          error: null
        });
      },
      update: (data: any, options = {}) => {
        return this.buildQueryObject();
      },
      delete: (options = {}) => {
        return this.buildQueryObject();
      },
      upsert: (data: any[], options = {}) => {
        return Promise.resolve({
          data: data,
          error: null
        });
      },
      // Méthodes de filtrage de base
      eq: (field: string, value: any) => {
        return this.buildQueryObject();
      },
      neq: (field: string, value: any) => {
        return this.buildQueryObject();
      },
      gt: (field: string, value: any) => {
        return this.buildQueryObject();
      },
      gte: (field: string, value: any) => {
        return this.buildQueryObject();
      },
      lt: (field: string, value: any) => {
        return this.buildQueryObject();
      },
      lte: (field: string, value: any) => {
        return this.buildQueryObject();
      },
      in: (field: string, values: any[]) => {
        return this.buildQueryObject();
      },
      or: (filters: string) => {
        return this.buildQueryObject();
      },
      textSearch: (column: string, query: string) => {
        return this.buildQueryObject();
      },
      // Méthodes de récupération
      single: () => {
        return Promise.resolve({
          data: {},
          error: null
        });
      },
      maybeSingle: () => {
        return Promise.resolve({
          data: {},
          error: null
        });
      },
      // Méthodes de tri et de pagination
      order: (column: string, { ascending = true }) => {
        return {
          limit: (limit: number) => {
            return this.buildQueryObject();
          },
          ...this.buildQueryObject()
        };
      },
      limit: (limit: number) => {
        return this.buildQueryObject();
      }
    };
  }

  private buildQueryObject() {
    return {
      eq: (field: string, value: any) => {
        return this.buildQueryObject();
      },
      neq: (field: string, value: any) => {
        return this.buildQueryObject();
      },
      gt: (field: string, value: any) => {
        return this.buildQueryObject();
      },
      gte: (field: string, value: any) => {
        return this.buildQueryObject();
      },
      lt: (field: string, value: any) => {
        return this.buildQueryObject();
      },
      lte: (field: string, value: any) => {
        return this.buildQueryObject();
      },
      in: (field: string, values: any[]) => {
        return this.buildQueryObject();
      },
      single: () => {
        return Promise.resolve({
          data: {},
          error: null
        });
      },
      maybeSingle: () => {
        return Promise.resolve({
          data: {},
          error: null
        });
      },
      order: (column: string, { ascending = true }) => {
        return {
          limit: (limit: number) => {
            return this.buildQueryObject();
          },
          ...this.buildQueryObject()
        };
      },
      limit: (limit: number) => {
        return this.buildQueryObject();
      },
      then: (callback: any) => {
        // Utiliser setTimeout pour simuler une réponse asynchrone
        setTimeout(() => {
          callback({
            data: [],
            error: null
          });
        }, 100);
        return this.buildQueryObject();
      }
    };
  }

  // Storage methods
  storage = {
    from: (bucket: string) => {
      return {
        upload: async (path: string, file: File) => {
          return {
            data: { path },
            error: null
          };
        },
        getPublicUrl: (path: string) => {
          return {
            data: { publicUrl: `https://example.com/storage/${bucket}/${path}` },
            error: null
          };
        },
        download: async (path: string) => {
          return {
            data: new Blob(),
            error: null
          };
        },
        remove: async (paths: string[]) => {
          return {
            data: { count: paths.length },
            error: null
          };
        },
        list: async (prefix: string) => {
          return {
            data: [],
            error: null
          };
        }
      };
    }
  };

  // Méthodes pour le restaurant API
  restaurants = {
    getAll: async (filters?: any): Promise<ApiResponse<unknown>> => {
      return { data: [], error: null };
    },
    getById: async (id: string): Promise<ApiResponse<unknown>> => {
      return { data: { id, name: "Restaurant Test" }, error: null };
    },
    getMenuItems: async (restaurantId: string): Promise<ApiResponse<unknown>> => {
      return { data: [], error: null };
    },
    updateRestaurant: async (id: string, data: any): Promise<ApiResponse<unknown>> => {
      return { data: { ...data, id }, error: null };
    },
    createMenuItem: async (data: any): Promise<ApiResponse<unknown>> => {
      return { data: { ...data, id: "new-item-" + Date.now() }, error: null };
    },
    updateMenuItem: async (id: string, data: any): Promise<ApiResponse<unknown>> => {
      return { data: { ...data, id }, error: null };
    },
    deleteMenuItem: async (id: string): Promise<ApiResponse<unknown>> => {
      return { data: { id }, error: null };
    }
  };

  // Méthodes pour réaliser des requêtes personnalisées
  rpc(functionName: string, params: any) {
    return Promise.resolve({
      data: [],
      error: null
    });
  }

  channel(channelName: string) {
    return {
      on: (event: string, schema: any, callback: Function) => {
        return this;
      },
      subscribe: () => {
        return this;
      }
    };
  }

  removeChannel(channel: any) {
    return Promise.resolve();
  }
}

// Exporter l'instance mockAPI
export const mockApi = new MockApiClient();
