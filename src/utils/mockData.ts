
// Mock data utility to replace Supabase
export const mockData = {
  // Mock authentication data
  auth: {
    user: {
      id: 'mock-user-id',
      email: 'user@example.com',
      user_metadata: {
        full_name: 'Mock User'
      }
    },
    session: {
      access_token: 'mock-token',
      expires_at: Date.now() + 3600000
    }
  },
  
  // Mock restaurant data
  restaurants: [
    {
      id: '1',
      name: 'Restaurant Kinshasa',
      description: 'Spécialités congolaises',
      address: '123 Avenue Lumumba, Kinshasa',
      image_url: '/images/restaurant1.jpg',
      cuisine_type: 'Congolaise',
      average_rating: 4.7,
      open_time: '08:00',
      close_time: '22:00',
      latitude: -4.325,
      longitude: 15.322,
      phone: '+243123456789',
      website: 'https://example.com',
      is_featured: true
    },
    {
      id: '2',
      name: 'Saveurs du Congo',
      description: 'Cuisine traditionnelle',
      address: '45 Boulevard du 30 Juin, Kinshasa',
      image_url: '/images/restaurant2.jpg',
      cuisine_type: 'Congolaise',
      average_rating: 4.5,
      open_time: '10:00',
      close_time: '23:00',
      latitude: -4.326,
      longitude: 15.315,
      phone: '+243987654321',
      website: 'https://example.com',
      is_featured: true
    }
  ],
  
  // Mock delivery drivers
  delivery_drivers: [
    {
      id: '1',
      user_id: 'driver-1',
      name: 'Jean Doe',
      phone: '+243111222333',
      current_latitude: -4.325,
      current_longitude: 15.322,
      is_available: true,
      status: 'online',
      average_rating: 4.8,
      total_deliveries: 150,
      total_earnings: 45000,
      commission_rate: 10,
      created_at: '2023-01-15T09:00:00Z',
      updated_at: '2023-07-20T15:30:00Z',
      last_location_update: '2023-07-20T15:30:00Z'
    }
  ],
  
  // Mock menu items
  menu_items: [
    {
      id: '1',
      name: 'Fufu & Poisson',
      description: 'Fufu traditionnel avec poisson braisé',
      price: 5000,
      image_url: '/images/fufu.jpg',
      category: 'Plats principaux',
      restaurant_id: '1',
      available: true,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Saka Saka',
      description: 'Plat de feuilles de manioc avec viande',
      price: 4500,
      image_url: '/images/saka-saka.jpg',
      category: 'Plats principaux',
      restaurant_id: '1',
      available: true,
      created_at: new Date().toISOString()
    }
  ],
  
  // Mock orders
  orders: [
    {
      id: '1',
      user_id: 'mock-user-id',
      restaurant_id: '1',
      status: 'pending',
      total_amount: 9500,
      items: [
        { id: '1', quantity: 1, name: 'Fufu & Poisson', price: 5000 },
        { id: '2', quantity: 1, name: 'Saka Saka', price: 4500 }
      ],
      created_at: new Date().toISOString(),
      delivery_address: '123 Avenue de la Paix, Kinshasa'
    }
  ],
  
  // Mock favorites
  favorites: [
    {
      id: '1',
      user_id: 'mock-user-id',
      restaurant_id: '1',
      created_at: new Date().toISOString(),
      restaurants: { id: '1', name: 'Restaurant Kinshasa' }
    }
  ],
  
  // Mock inventories
  inventory_levels: [
    {
      id: '1',
      menu_item_id: '1',
      current_stock: 50,
      reserved_stock: 5,
      min_stock_level: 10
    },
    {
      id: '2',
      menu_item_id: '2',
      current_stock: 20,
      reserved_stock: 2,
      min_stock_level: 5
    }
  ]
};

// Mock API client to replace Supabase
export const mockApi = {
  auth: {
    getUser: async () => ({ data: { user: mockData.auth.user }, error: null }),
    getSession: async () => ({ data: { session: mockData.auth.session }, error: null }),
    signInWithPassword: async (credentials: any) => ({
      data: {
        user: mockData.auth.user,
        session: mockData.auth.session
      },
      error: null
    }),
    signUp: async (credentials: any) => ({
      data: {
        user: mockData.auth.user,
        session: mockData.auth.session
      },
      error: null
    }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: (callback: any) => {
      // Mock subscription
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    }
  },
  
  from: (table: string) => ({
    select: (query: string = '*') => ({
      eq: (field: string, value: any) => ({
        single: async () => {
          const items = mockData[table as keyof typeof mockData] as any[];
          const item = items?.find(item => item[field] === value);
          return { data: item || null, error: null };
        },
        order: (column: string, { ascending = true } = {}) => ({
          limit: (limit: number) => ({
            maybeSingle: async () => {
              const items = mockData[table as keyof typeof mockData] as any[];
              const filtered = items?.filter(item => item[field] === value);
              return { data: filtered?.[0] || null, error: null };
            },
            data: async () => {
              const items = mockData[table as keyof typeof mockData] as any[];
              const filtered = items?.filter(item => item[field] === value);
              const sorted = [...filtered].sort((a, b) => {
                return ascending 
                  ? a[column] > b[column] ? 1 : -1 
                  : a[column] < b[column] ? 1 : -1;
              });
              return { data: sorted.slice(0, limit), error: null };
            }
          }),
          data: async () => {
            const items = mockData[table as keyof typeof mockData] as any[];
            const filtered = items?.filter(item => item[field] === value);
            return { data: filtered, error: null };
          }
        }),
        data: async () => {
          const items = mockData[table as keyof typeof mockData] as any[];
          const filtered = items?.filter(item => item[field] === value);
          return { data: filtered, error: null };
        }
      }),
      in: (field: string, values: any[]) => ({
        order: (column: string, { ascending = true } = {}) => ({
          data: async () => {
            const items = mockData[table as keyof typeof mockData] as any[];
            const filtered = items?.filter(item => values.includes(item[field]));
            return { data: filtered, error: null };
          }
        }),
        data: async () => {
          const items = mockData[table as keyof typeof mockData] as any[];
          const filtered = items?.filter(item => values.includes(item[field]));
          return { data: filtered, error: null };
        }
      }),
      order: (column: string, { ascending = true } = {}) => ({
        limit: (limit: number) => ({
          data: async () => {
            const items = mockData[table as keyof typeof mockData] as any[];
            const sorted = [...items].sort((a, b) => {
              return ascending 
                ? a[column] > b[column] ? 1 : -1 
                : a[column] < b[column] ? 1 : -1;
            });
            return { data: sorted.slice(0, limit), error: null };
          }
        }),
        data: async () => {
          const items = mockData[table as keyof typeof mockData] as any[];
          return { data: items, error: null };
        }
      }),
      data: async () => {
        return { 
          data: mockData[table as keyof typeof mockData] || [], 
          error: null 
        };
      }
    }),
    insert: async (data: any) => ({ data, error: null }),
    update: (data: any) => ({
      eq: (field: string, value: any) => ({
        data: async () => {
          return { data, error: null };
        }
      })
    }),
    delete: () => ({
      eq: (field: string, value: any) => ({
        data: async () => {
          return { data: null, error: null };
        }
      })
    })
  }),
  
  channel: (name: string) => ({
    on: (event: string, config: any, callback: any) => ({
      subscribe: () => {}
    })
  }),
  
  removeChannel: (channel: any) => {}
};

// Replace Supabase client with mock API
export const supabase = mockApi;
