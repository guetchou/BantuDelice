
import pb from '@/lib/pocketbase';
import { RecordModel } from 'pocketbase';

// Mock data for responses
const mockData = {
  notifications: [
    { 
      id: '1', 
      user_id: '123', 
      message: 'Votre commande est en cours de préparation', 
      type: 'order_update', 
      read: false, 
      created_at: new Date().toISOString() 
    },
    { 
      id: '2', 
      user_id: '123', 
      message: 'Nouveau code promo disponible: WELCOME10', 
      type: 'promo', 
      read: true, 
      created_at: new Date(Date.now() - 86400000).toISOString() 
    }
  ],
  chat_messages: []
};

// Helper to simulate async responses
const asyncResponse = <T>(data: T, delay: number = 300): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

// This adapter facilitates migration from Supabase to PocketBase
// by mimicking the Supabase interface to avoid breaking existing code
const supabase = {
  auth: {
    getUser: async () => {
      const user = pb.authStore.model;
      return { data: { user } };
    },
    signOut: async () => {
      pb.authStore.clear();
      return { error: null };
    }
  },
  from: (table: string) => {
    return {
      select: (columns = '*') => {
        return {
          eq: (column: string, value: any) => {
            return {
              order: (column: string, { ascending = true } = {}) => {
                return {
                  async then(callback: Function) {
                    // Mock data filtering
                    const filteredData = mockData[table as keyof typeof mockData] || [];
                    callback({ data: filteredData, error: null });
                  }
                };
              },
              single: () => asyncResponse({ data: null, error: null }),
              maybeSingle: () => asyncResponse({ data: null, error: null }),
              limit: () => asyncResponse({ data: [], error: null }),
              eq: () => asyncResponse({ data: [], error: null }),
              in: () => asyncResponse({ data: [], error: null }),
              or: () => asyncResponse({ data: [], error: null }),
              gt: () => asyncResponse({ data: [], error: null }),
              gte: () => asyncResponse({ data: [], error: null }),
              lt: () => asyncResponse({ data: [], error: null }),
              lte: () => asyncResponse({ data: [], error: null }),
            };
          },
          or: (query: string) => {
            return {
              order: (column: string, { ascending = true } = {}) => {
                return asyncResponse({ data: [], error: null });
              }
            };
          },
          in: (column: string, values: any[]) => {
            return asyncResponse({ data: [], error: null });
          },
          gte: (column: string, value: any) => {
            return asyncResponse({ data: [], error: null });
          },
          lte: (column: string, value: any) => {
            return asyncResponse({ data: [], error: null });
          },
          then: (callback: Function) => {
            callback({ data: [], error: null });
          }
        };
      },
      insert: (data: any) => {
        return {
          then: (callback: Function) => {
            callback({ data: { ...data, id: Date.now().toString() }, error: null });
          },
          select: () => {
            return {
              then: (callback: Function) => {
                callback({ data: { ...data, id: Date.now().toString() }, error: null });
              },
              single: () => {
                return {
                  then: (callback: Function) => {
                    callback({ data: { ...data, id: Date.now().toString() }, error: null });
                  }
                };
              }
            };
          }
        };
      },
      update: (data: any) => {
        return {
          eq: (column: string, value: any) => {
            return {
              then: (callback: Function) => {
                callback({ data: null, error: null });
              }
            };
          }
        };
      },
      delete: () => {
        return {
          eq: (column: string, value: any) => {
            return {
              then: (callback: Function) => {
                callback({ data: null, error: null });
              }
            };
          }
        };
      },
      upsert: (data: any) => {
        return {
          then: (callback: Function) => {
            callback({ data: null, error: null });
          }
        };
      }
    };
  },
  channel: (channel: string) => {
    return {
      on: (event: string, config: any, callback?: Function) => {
        return {
          subscribe: () => {
            // Return mock subscription
            console.log(`Subscribed to ${channel}`);
            // If callback exists, simulate event after a delay
            if (callback) {
              setTimeout(() => {
                callback({ 
                  new: { id: '3', message: 'New notification', type: 'info', read: false, created_at: new Date().toISOString() },
                  old: null
                });
              }, 5000);
            }
          }
        };
      }
    };
  },
  removeChannel: () => {
    console.log('Channel removed');
  },
  storage: {
    from: (bucket: string) => {
      return {
        upload: (path: string, file: File) => {
          return asyncResponse({ data: { path }, error: null });
        },
        getPublicUrl: (path: string) => {
          return { data: { publicUrl: `https://example.com/${path}` } };
        }
      };
    }
  }
};

export { supabase };
