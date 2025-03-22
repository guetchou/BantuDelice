
/**
 * API Client pour l'application
 * 
 * Cette implémentation fournit une API compatible avec le backend personnalisé
 */

import { mockData } from '@/utils/mockData';

interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

export class MockApiClient {
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
            expires_at: Date.now() + 3600000,
            user: this.auth.user
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
    let tableData = [] as any[];

    // Get data from the mockData based on the table name
    switch (table) {
      case 'restaurants':
        tableData = mockData.restaurants || [];
        break;
      case 'menu_items':
        tableData = mockData.menu_items || [];
        break;
      case 'orders':
        tableData = mockData.orders || [];
        break;
      case 'restaurant_tables':
        tableData = mockData.tables || [];
        break;
      case 'profiles':
        tableData = mockData.profiles || [];
        break;
      case 'wallets':
        tableData = mockData.wallets || [];
        break;
      case 'loyalty_points':
        tableData = mockData.loyalty_points || [];
        break;
      case 'delivery_drivers':
        tableData = mockData.delivery_drivers || [];
        break;
      default:
        tableData = [];
    }

    return {
      select: (columns = "*") => {
        return this.buildQueryObject(tableData);
      },
      insert: (data: any[], options = {}) => {
        return Promise.resolve({
          data: data,
          error: null
        });
      },
      update: (data: any, options = {}) => {
        return this.buildQueryObject(tableData);
      },
      delete: (options = {}) => {
        return this.buildQueryObject(tableData);
      },
      upsert: (data: any[], options = {}) => {
        return Promise.resolve({
          data: data,
          error: null
        });
      },
      // Méthodes de filtrage de base
      eq: (field: string, value: any) => {
        const filteredData = tableData.filter(item => item[field] === value);
        return this.buildQueryObject(filteredData);
      },
      neq: (field: string, value: any) => {
        const filteredData = tableData.filter(item => item[field] !== value);
        return this.buildQueryObject(filteredData);
      },
      gt: (field: string, value: any) => {
        const filteredData = tableData.filter(item => item[field] > value);
        return this.buildQueryObject(filteredData);
      },
      gte: (field: string, value: any) => {
        const filteredData = tableData.filter(item => item[field] >= value);
        return this.buildQueryObject(filteredData);
      },
      lt: (field: string, value: any) => {
        const filteredData = tableData.filter(item => item[field] < value);
        return this.buildQueryObject(filteredData);
      },
      lte: (field: string, value: any) => {
        const filteredData = tableData.filter(item => item[field] <= value);
        return this.buildQueryObject(filteredData);
      },
      in: (field: string, values: any[]) => {
        const filteredData = tableData.filter(item => values.includes(item[field]));
        return this.buildQueryObject(filteredData);
      },
      or: (filters: string) => {
        // Simplified implementation
        return this.buildQueryObject(tableData);
      },
      textSearch: (column: string, query: string) => {
        const filteredData = tableData.filter(item => 
          item[column] && item[column].toString().toLowerCase().includes(query.toLowerCase())
        );
        return this.buildQueryObject(filteredData);
      },
      // Méthodes de récupération
      single: () => {
        return Promise.resolve({
          data: tableData.length > 0 ? tableData[0] : null,
          error: null
        });
      },
      maybeSingle: () => {
        return Promise.resolve({
          data: tableData.length > 0 ? tableData[0] : null,
          error: null
        });
      },
      // Méthodes de tri et de pagination
      order: (column: string, { ascending = true }) => {
        const sortedData = [...tableData].sort((a, b) => {
          if (ascending) {
            return a[column] > b[column] ? 1 : -1;
          } else {
            return a[column] < b[column] ? 1 : -1;
          }
        });
        return {
          limit: (limit: number) => {
            return this.buildQueryObject(sortedData.slice(0, limit));
          },
          ...this.buildQueryObject(sortedData)
        };
      },
      limit: (limit: number) => {
        return this.buildQueryObject(tableData.slice(0, limit));
      }
    };
  }

  private buildQueryObject(data: any[] = []) {
    return {
      eq: (field: string, value: any) => {
        const filteredData = data.filter(item => item[field] === value);
        return this.buildQueryObject(filteredData);
      },
      neq: (field: string, value: any) => {
        const filteredData = data.filter(item => item[field] !== value);
        return this.buildQueryObject(filteredData);
      },
      gt: (field: string, value: any) => {
        const filteredData = data.filter(item => item[field] > value);
        return this.buildQueryObject(filteredData);
      },
      gte: (field: string, value: any) => {
        const filteredData = data.filter(item => item[field] >= value);
        return this.buildQueryObject(filteredData);
      },
      lt: (field: string, value: any) => {
        const filteredData = data.filter(item => item[field] < value);
        return this.buildQueryObject(filteredData);
      },
      lte: (field: string, value: any) => {
        const filteredData = data.filter(item => item[field] <= value);
        return this.buildQueryObject(filteredData);
      },
      in: (field: string, values: any[]) => {
        const filteredData = data.filter(item => values.includes(item[field]));
        return this.buildQueryObject(filteredData);
      },
      or: (filters: string) => {
        return this.buildQueryObject(data);
      },
      is: (field: string, value: any) => {
        const filteredData = data.filter(item => item[field] === value);
        return this.buildQueryObject(filteredData);
      },
      match: (patterns: Record<string, any>) => {
        const filteredData = data.filter(item => {
          for (const [key, value] of Object.entries(patterns)) {
            if (item[key] !== value) return false;
          }
          return true;
        });
        return this.buildQueryObject(filteredData);
      },
      single: () => {
        return Promise.resolve({
          data: data.length > 0 ? data[0] : null,
          error: null
        });
      },
      maybeSingle: () => {
        return Promise.resolve({
          data: data.length > 0 ? data[0] : null,
          error: null
        });
      },
      order: (column: string, { ascending = true }) => {
        const sortedData = [...data].sort((a, b) => {
          if (ascending) {
            return a[column] > b[column] ? 1 : -1;
          } else {
            return a[column] < b[column] ? 1 : -1;
          }
        });
        return {
          limit: (limit: number) => {
            return this.buildQueryObject(sortedData.slice(0, limit));
          },
          ...this.buildQueryObject(sortedData)
        };
      },
      limit: (limit: number) => {
        return this.buildQueryObject(data.slice(0, limit));
      },
      select: (columns: string) => {
        // Simplified implementation
        return Promise.resolve({
          data: data,
          error: null
        });
      },
      then: (callback: (result: { data: any[], error: null }) => void) => {
        callback({ data: data, error: null });
        return Promise.resolve({ data: data, error: null });
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

  // Méthodes pour realtime subscription
  channel(channelName: string) {
    return {
      on: (event: string, schema: any, callback: Function) => {
        // Register the callback for this channel
        console.log(`Subscribed to ${channelName} for ${event}`);
        return this;
      },
      subscribe: (callback?: Function) => {
        if (callback) callback();
        return this;
      }
    };
  }

  removeChannel(channel: any) {
    console.log('Removing channel');
    return Promise.resolve();
  }

  // API methods for specific entities
  restaurants = {
    getAll: async (filters?: any): Promise<ApiResponse<any>> => {
      return { data: mockData.restaurants || [], error: null };
    },
    getById: async (id: string): Promise<ApiResponse<any>> => {
      const restaurant = mockData.restaurants?.find(r => r.id === id);
      return { data: restaurant || null, error: restaurant ? null : new Error('Restaurant not found') };
    },
    getMenuItems: async (restaurantId: string): Promise<ApiResponse<any>> => {
      const items = mockData.menu_items?.filter(item => item.restaurant_id === restaurantId);
      return { data: items || [], error: null };
    }
  };

  // Custom method to perform RPC (Remote Procedure Call) operations
  rpc(functionName: string, params: any) {
    console.log(`Mock RPC call to ${functionName} with params:`, params);
    
    return Promise.resolve({
      data: [],
      error: null
    });
  }
}

// Create and export the mock API client
export const mockApi = new MockApiClient();
