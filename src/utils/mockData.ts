/**
 * Mock data for development and testing
 */
export const mockData = {
  // Mock API that mimics Supabase client interface
  mockApi: {
    // Auth related mock methods
    auth: {
      getUser: async () => ({ 
        data: { 
          user: { 
            id: 'mock-user-id', 
            email: 'user@example.com',
            user_metadata: { full_name: 'Mock User' }
          } 
        }, 
        error: null 
      }),
      getSession: async () => ({ 
        data: { 
          session: { 
            access_token: 'mock-token', 
            expires_at: Date.now() + 3600000 
          } 
        }, 
        error: null 
      }),
      signInWithPassword: async (credentials: any) => ({ 
        data: { 
          user: { 
            id: 'mock-user-id', 
            email: credentials.email 
          }, 
          session: { 
            access_token: 'mock-token' 
          } 
        }, 
        error: null 
      }),
      signUp: async (credentials: any) => ({ 
        data: { 
          user: { 
            id: 'mock-user-id', 
            email: credentials.email 
          }, 
          session: { 
            access_token: 'mock-token' 
          } 
        }, 
        error: null 
      }),
      signOut: async () => ({ error: null })
    },

    // Mock database operations
    from: (table: string) => ({
      select: (query?: string) => ({
        eq: (field: string, value: any) => ({
          single: () => {
            const items = mockData[table] || [];
            const item = items.find((i: any) => i[field] === value);
            return { data: item || null, error: null };
          },
          order: (column: string, { ascending }: { ascending: boolean } = { ascending: true }) => ({
            data: () => {
              const items = mockData[table] || [];
              const filtered = items.filter((i: any) => i[field] === value);
              return { 
                data: filtered.sort((a: any, b: any) => {
                  return ascending ? 
                    (a[column] > b[column] ? 1 : -1) : 
                    (a[column] < b[column] ? 1 : -1);
                }), 
                error: null 
              };
            }
          })
        }),
        limit: (limit: number) => ({
          maybeSingle: () => {
            const items = mockData[table] || [];
            return { data: items[0] || null, error: null };
          },
          data: () => {
            const items = mockData[table] || [];
            return { data: items.slice(0, limit), error: null };
          }
        }),
        data: () => {
          const items = mockData[table] || [];
          return { data: items, error: null };
        }
      }),
      insert: (data: any) => {
        const items = mockData[table] || [];
        const newItem = { id: `mock-id-${Date.now()}`, ...data };
        items.push(newItem);
        mockData[table] = items;
        return { data: newItem, error: null };
      },
      update: (data: any) => ({
        eq: (field: string, value: any) => {
          const items = mockData[table] || [];
          const index = items.findIndex((i: any) => i[field] === value);
          if (index >= 0) {
            items[index] = { ...items[index], ...data };
          }
          return { data: items[index], error: null };
        }
      }),
      delete: () => ({
        eq: (field: string, value: any) => {
          const items = mockData[table] || [];
          const index = items.findIndex((i: any) => i[field] === value);
          let removed = null;
          if (index >= 0) {
            removed = items.splice(index, 1)[0];
          }
          return { data: removed, error: null };
        }
      })
    }),

    // Default tables with mock data
    users: [
      {
        id: 'user-1',
        email: 'user@example.com',
        password: 'password123',
        first_name: 'Regular',
        last_name: 'User',
        role: 'user',
        status: 'active',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg',
        phone: '+24300000001',
        last_login: '2023-07-01T00:00:00Z'
      },
      {
        id: 'admin-1',
        email: 'admin@example.com',
        password: 'adminpass',
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin',
        status: 'active',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        avatar_url: 'https://randomuser.me/api/portraits/women/1.jpg',
        phone: '+24300000002',
        last_login: '2023-07-01T00:00:00Z'
      },
      {
        id: 'superadmin-1',
        email: 'superadmin@example.com',
        password: 'superadminpass',
        first_name: 'Super',
        last_name: 'Admin',
        role: 'superadmin',
        status: 'active',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        avatar_url: 'https://randomuser.me/api/portraits/men/2.jpg',
        phone: '+24300000003',
        last_login: '2023-07-01T00:00:00Z'
      },
      {
        id: 'restaurant-1',
        email: 'restaurant@example.com',
        password: 'restaurantpass',
        first_name: 'Restaurant',
        last_name: 'Owner',
        role: 'restaurant_owner',
        status: 'active',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        avatar_url: 'https://randomuser.me/api/portraits/women/2.jpg',
        phone: '+24300000004',
        last_login: '2023-07-01T00:00:00Z'
      },
      {
        id: 'driver-1',
        email: 'driver@example.com',
        password: 'driverpass',
        first_name: 'Delivery',
        last_name: 'Driver',
        role: 'driver',
        status: 'active',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        avatar_url: 'https://randomuser.me/api/portraits/men/3.jpg',
        phone: '+24300000005',
        last_login: '2023-07-01T00:00:00Z'
      }
    ],

    // Add more mock collections as needed
    menu_items: [
      // Example menu items
    ],
    inventory_levels: [
      // Example inventory items
    ],
    
    // Other mock data and methods can be added here
  }
};
