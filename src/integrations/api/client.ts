
/**
 * Custom backend API client for the application
 * This replaces the Supabase client with your own backend implementation
 */

interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

interface AuthUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  user_metadata?: {
    full_name?: string;
  };
}

interface LoginResponse {
  user: AuthUser;
  token: string;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
}

// Base API URL - replace with your own backend URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to make API requests
const fetchApi = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  try {
    const token = localStorage.getItem('auth_token');
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: options.method || 'GET',
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.message || 'Une erreur est survenue');
    }
    
    return { data: responseData, error: null };
  } catch (error) {
    console.error('API request error:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Une erreur est survenue') 
    };
  }
};

// Auth API
export const authApi = {
  async getUser(): Promise<AuthUser | null> {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;
    
    const { data, error } = await fetchApi<AuthUser>('/auth/me');
    if (error) {
      console.error('Error getting user:', error);
      return null;
    }
    
    return data;
  },
  
  async getSession() {
    const token = localStorage.getItem('auth_token');
    if (!token) return { data: { session: null }, error: null };
    
    return { 
      data: { 
        session: { 
          access_token: token,
          expires_at: Date.now() + 3600000 // 1 hour expiry by default
        } 
      }, 
      error: null 
    };
  },
  
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data, error } = await fetchApi<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    
    if (error) throw error;
    if (!data) throw new Error('Échec de la connexion');
    
    // Store auth token
    localStorage.setItem('auth_token', data.token);
    
    return data;
  },
  
  async register(email: string, password: string, firstName?: string, lastName?: string) {
    const { data, error } = await fetchApi<LoginResponse>('/auth/register', {
      method: 'POST',
      body: { email, password, firstName, lastName },
    });
    
    if (error) throw error;
    if (!data) throw new Error('Échec de l\'inscription');
    
    // Store auth token
    localStorage.setItem('auth_token', data.token);
    
    return data;
  },
  
  logout() {
    localStorage.removeItem('auth_token');
  },
  
  async resetPassword(email: string) {
    const { data, error } = await fetchApi('/auth/reset-password', {
      method: 'POST',
      body: { email },
    });
    
    if (error) throw error;
    return data;
  }
};

// Restaurants API
export const restaurantsApi = {
  async getAll(filters?: any) {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return await fetchApi('/restaurants' + queryParams);
  },
  
  async getById(id: string) {
    return await fetchApi(`/restaurants/${id}`);
  },
  
  async getMenuItems(restaurantId: string) {
    return await fetchApi(`/restaurants/${restaurantId}/menu-items`);
  },
  
  async updateRestaurant(id: string, data: any) {
    return await fetchApi(`/restaurants/${id}`, {
      method: 'PUT',
      body: data,
    });
  },
  
  async createMenuItem(data: any) {
    return await fetchApi('/menu-items', {
      method: 'POST',
      body: data,
    });
  },
  
  async updateMenuItem(id: string, data: any) {
    return await fetchApi(`/menu-items/${id}`, {
      method: 'PUT',
      body: data,
    });
  },
  
  async deleteMenuItem(id: string) {
    return await fetchApi(`/menu-items/${id}`, {
      method: 'DELETE',
    });
  }
};

// Orders API
export const ordersApi = {
  async getAll() {
    return await fetchApi('/orders');
  },
  
  async getById(id: string) {
    return await fetchApi(`/orders/${id}`);
  },
  
  async create(data: any) {
    return await fetchApi('/orders', {
      method: 'POST',
      body: data,
    });
  },
  
  async update(id: string, data: any) {
    return await fetchApi(`/orders/${id}`, {
      method: 'PUT',
      body: data,
    });
  }
};

// User profile API
export const userApi = {
  async getProfile() {
    return await fetchApi('/user/profile');
  },
  
  async updateProfile(data: any) {
    return await fetchApi('/user/profile', {
      method: 'PUT',
      body: data,
    });
  },
  
  async getFavorites() {
    return await fetchApi('/user/favorites');
  },
  
  async addFavorite(menuItemId: string) {
    return await fetchApi('/user/favorites', {
      method: 'POST',
      body: { menuItemId },
    });
  },
  
  async removeFavorite(id: string) {
    return await fetchApi(`/user/favorites/${id}`, {
      method: 'DELETE',
    });
  }
};

// Now let's create a mock implementation for testing
// This will mimic some of the Supabase client functionality
// until your real backend is implemented
export const mockApi = {
  auth: {
    getUser: async () => {
      return { 
        data: { 
          user: {
            id: 'mock-user-id',
            email: 'user@example.com',
            user_metadata: {
              full_name: 'Mock User'
            }
          } 
        }, 
        error: null 
      };
    },
    getSession: async () => {
      return { 
        data: { 
          session: {
            access_token: 'mock-token',
            expires_at: Date.now() + 3600000
          }
        }, 
        error: null 
      };
    },
    signInWithPassword: async (credentials: any) => {
      console.log('Mock: signInWithPassword called', credentials);
      return { 
        data: { 
          user: {
            id: 'mock-user-id',
            email: credentials.email,
            user_metadata: {
              full_name: 'Mock User'
            }
          }, 
          session: {
            access_token: 'mock-token'
          }
        }, 
        error: null 
      };
    },
    signUp: async (credentials: any) => {
      console.log('Mock: signUp called', credentials);
      return { 
        data: { 
          user: {
            id: 'mock-user-id',
            email: credentials.email,
            user_metadata: credentials.options?.data || {}
          },
          session: {
            access_token: 'mock-token'
          }
        }, 
        error: null 
      };
    },
    signOut: async () => {
      console.log('Mock: signOut called');
      return { error: null };
    },
    onAuthStateChange: (callback: any) => {
      console.log('Mock: onAuthStateChange called');
      return { 
        data: { 
          subscription: { 
            unsubscribe: () => {} 
          } 
        }
      };
    },
    resetPasswordForEmail: async (email: any) => {
      console.log('Mock: resetPasswordForEmail called', email);
      return { data: {}, error: null };
    }
  },
  from: (table: string) => {
    console.log(`Mock: accessing table "${table}"`);
    return {
      select: (columns: string = '*') => {
        console.log(`Mock: select "${columns}" from "${table}"`);
        return {
          eq: (field: string, value: any) => {
            console.log(`Mock: where ${field} = ${value}`);
            return {
              single: async () => {
                console.log(`Mock: returning single result from "${table}"`);
                return { data: null, error: null };
              },
              maybeSingle: async () => {
                console.log(`Mock: returning maybe single result from "${table}"`);
                return { data: null, error: null };
              },
              order: (column: string, { ascending }: { ascending: boolean }) => {
                console.log(`Mock: order by ${column} ${ascending ? 'ASC' : 'DESC'}`);
                return {
                  limit: (limit: number) => {
                    console.log(`Mock: limit ${limit}`);
                    return {
                      then: (callback: any) => callback({ data: [], error: null })
                    };
                  },
                  then: (callback: any) => callback({ data: [], error: null })
                };
              },
              then: (callback: any) => callback({ data: [], error: null })
            };
          },
          textSearch: (field: string, value: string) => {
            console.log(`Mock: text search on ${field} for "${value}"`);
            return {
              eq: (field: string, value: any) => {
                console.log(`Mock: where ${field} = ${value}`);
                return {
                  order: (column: string, { ascending }: { ascending: boolean }) => {
                    console.log(`Mock: order by ${column} ${ascending ? 'ASC' : 'DESC'}`);
                    return {
                      then: (callback: any) => callback({ data: [], error: null })
                    };
                  },
                  then: (callback: any) => callback({ data: [], error: null })
                };
              },
              order: (column: string, { ascending }: { ascending: boolean }) => {
                console.log(`Mock: order by ${column} ${ascending ? 'ASC' : 'DESC'}`);
                return {
                  then: (callback: any) => callback({ data: [], error: null })
                };
              },
              then: (callback: any) => callback({ data: [], error: null })
            };
          },
          order: (column: string, { ascending }: { ascending: boolean }) => {
            console.log(`Mock: order by ${column} ${ascending ? 'ASC' : 'DESC'}`);
            return {
              eq: (field: string, value: any) => {
                console.log(`Mock: where ${field} = ${value}`);
                return {
                  then: (callback: any) => callback({ data: [], error: null })
                };
              },
              then: (callback: any) => callback({ data: [], error: null })
            };
          },
          in: (field: string, values: any[]) => {
            console.log(`Mock: where ${field} in [${values.join(', ')}]`);
            return {
              then: (callback: any) => callback({ data: [], error: null })
            };
          },
          gt: (field: string, value: any) => {
            console.log(`Mock: where ${field} > ${value}`);
            return {
              then: (callback: any) => callback({ data: [], error: null })
            };
          },
          gte: (field: string, value: any) => {
            console.log(`Mock: where ${field} >= ${value}`);
            return {
              then: (callback: any) => callback({ data: [], error: null })
            };
          },
          lt: (field: string, value: any) => {
            console.log(`Mock: where ${field} < ${value}`);
            return {
              then: (callback: any) => callback({ data: [], error: null })
            };
          },
          lte: (field: string, value: any) => {
            console.log(`Mock: where ${field} <= ${value}`);
            return {
              then: (callback: any) => callback({ data: [], error: null })
            };
          },
          or: (condition: string, values: any[]) => {
            console.log(`Mock: or ${condition} in [${values.join(', ')}]`);
            return {
              then: (callback: any) => callback({ data: [], error: null })
            };
          },
          is: (field: string, value: any) => {
            console.log(`Mock: where ${field} is ${value}`);
            return {
              then: (callback: any) => callback({ data: [], error: null })
            };
          },
          then: (callback: any) => callback({ data: [], error: null }),
          limit: (limit: number) => {
            console.log(`Mock: limit ${limit}`);
            return {
              then: (callback: any) => callback({ data: [], error: null })
            };
          }
        };
      },
      insert: (records: any[]) => {
        console.log(`Mock: insert into "${table}"`, records);
        return {
          select: (columns: string = '*') => {
            console.log(`Mock: return columns "${columns}" after insert`);
            return {
              single: async () => {
                console.log(`Mock: returning single result after insert`);
                return { data: records[0], error: null };
              },
              then: (callback: any) => callback({ data: records, error: null })
            };
          },
          then: (callback: any) => callback({ data: null, error: null })
        };
      },
      update: (updates: any) => {
        console.log(`Mock: update "${table}"`, updates);
        return {
          eq: (field: string, value: any) => {
            console.log(`Mock: where ${field} = ${value}`);
            return {
              then: (callback: any) => callback({ data: null, error: null })
            };
          },
          then: (callback: any) => callback({ data: null, error: null })
        };
      },
      upsert: (records: any[]) => {
        console.log(`Mock: upsert into "${table}"`, records);
        return {
          select: (columns: string = '*') => {
            console.log(`Mock: return columns "${columns}" after upsert`);
            return {
              then: (callback: any) => callback({ data: records, error: null })
            };
          },
          then: (callback: any) => callback({ data: null, error: null })
        };
      },
      delete: () => {
        console.log(`Mock: delete from "${table}"`);
        return {
          eq: (field: string, value: any) => {
            console.log(`Mock: where ${field} = ${value}`);
            return {
              then: (callback: any) => callback({ data: null, error: null })
            };
          },
          then: (callback: any) => callback({ data: null, error: null })
        };
      },
      match: (conditions: Record<string, any>) => {
        console.log(`Mock: match conditions in "${table}"`, conditions);
        return {
          then: (callback: any) => callback({ data: [], error: null })
        };
      }
    };
  },
  channel: (name: string) => {
    console.log(`Mock: create channel "${name}"`);
    return {
      on: (event: string, config: any, callback: (payload: any) => void) => {
        console.log(`Mock: subscribe to ${event} on channel "${name}"`, config);
        return {
          subscribe: (callback2?: () => void) => {
            console.log(`Mock: subscribed to channel "${name}"`);
            if (callback2) callback2();
            return { unsubscribe: () => {} };
          }
        };
      },
      subscribe: () => {
        console.log(`Mock: subscribed to channel "${name}"`);
        return {
          unsubscribe: () => {
            console.log(`Mock: unsubscribed from channel "${name}"`);
          }
        };
      }
    };
  },
  removeChannel: (channel: any) => {
    console.log('Mock: remove channel');
    return Promise.resolve();
  },
  storage: {
    from: (bucket: string) => {
      return {
        upload: async (path: string, file: File) => {
          console.log(`Mock: uploading to ${bucket}/${path}`);
          return { data: { path }, error: null };
        },
        getPublicUrl: (path: string) => {
          return { data: { publicUrl: `https://mock-storage/${bucket}/${path}` } };
        }
      };
    }
  },
  rpc: (functionName: string, params: any) => {
    console.log(`Mock: calling RPC function ${functionName}`, params);
    return {
      then: (callback: any) => callback({ data: null, error: null })
    };
  }
};

// Export a default API client
export default {
  auth: authApi,
  restaurants: restaurantsApi,
  orders: ordersApi,
  user: userApi
};
