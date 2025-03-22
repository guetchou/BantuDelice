// Mock data for development and testing

export const mockData = {
  // Utilisateurs
  users: [
    {
      id: 'user-1',
      email: 'admin@example.com',
      password: 'admin123',
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      status: 'active',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      avatar_url: 'https://i.pravatar.cc/150?img=1',
      phone: '+242 123 456 789',
      last_login: '2023-07-01T10:15:00Z'
    },
    {
      id: 'user-2',
      email: 'user@example.com',
      password: 'user123',
      first_name: 'Normal',
      last_name: 'User',
      role: 'user',
      status: 'active',
      created_at: '2023-01-02T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z',
      avatar_url: 'https://i.pravatar.cc/150?img=2',
      phone: '+242 234 567 890',
      last_login: '2023-06-28T14:45:00Z'
    },
    {
      id: 'user-3',
      email: 'resto@example.com',
      password: 'resto123',
      first_name: 'Restaurant',
      last_name: 'Owner',
      role: 'restaurant_owner',
      status: 'active',
      created_at: '2023-01-03T00:00:00Z',
      updated_at: '2023-01-03T00:00:00Z',
      avatar_url: 'https://i.pravatar.cc/150?img=3',
      phone: '+242 345 678 901',
      last_login: '2023-06-30T09:20:00Z'
    },
    {
      id: 'user-4',
      email: 'driver@example.com',
      password: 'driver123',
      first_name: 'Delivery',
      last_name: 'Driver',
      role: 'driver',
      status: 'active',
      created_at: '2023-01-04T00:00:00Z',
      updated_at: '2023-01-04T00:00:00Z',
      avatar_url: 'https://i.pravatar.cc/150?img=4',
      phone: '+242 456 789 012',
      last_login: '2023-07-02T08:30:00Z'
    },
    {
      id: 'user-5',
      email: 'superadmin@example.com',
      password: 'admin123',
      first_name: 'Super',
      last_name: 'Admin',
      role: 'superadmin',
      status: 'active',
      created_at: '2023-01-05T00:00:00Z',
      updated_at: '2023-01-05T00:00:00Z',
      avatar_url: 'https://i.pravatar.cc/150?img=5',
      phone: '+242 567 890 123',
      last_login: '2023-07-03T11:05:00Z'
    },
    {
      id: 'user-6',
      email: 'inactive@example.com',
      password: 'user123',
      first_name: 'Inactive',
      last_name: 'User',
      role: 'user',
      status: 'inactive',
      created_at: '2023-02-01T00:00:00Z',
      updated_at: '2023-03-15T00:00:00Z',
      avatar_url: 'https://i.pravatar.cc/150?img=6',
      phone: '+242 678 901 234',
      last_login: '2023-03-15T16:30:00Z'
    },
    {
      id: 'user-7',
      email: 'pending@example.com',
      password: 'user123',
      first_name: 'Pending',
      last_name: 'Approval',
      role: 'restaurant_owner',
      status: 'pending',
      created_at: '2023-06-10T00:00:00Z',
      updated_at: '2023-06-10T00:00:00Z',
      avatar_url: 'https://i.pravatar.cc/150?img=7',
      phone: '+242 789 012 345',
      last_login: null
    },
    {
      id: 'user-8',
      email: 'suspended@example.com',
      password: 'user123',
      first_name: 'Suspended',
      last_name: 'Driver',
      role: 'driver',
      status: 'suspended',
      created_at: '2023-03-20T00:00:00Z',
      updated_at: '2023-06-25T00:00:00Z',
      avatar_url: 'https://i.pravatar.cc/150?img=8',
      phone: '+242 890 123 456',
      last_login: '2023-06-20T14:15:00Z'
    },
    {
      id: 'user-9',
      email: 'client1@example.com',
      password: 'client123',
      first_name: 'Jean',
      last_name: 'Dupont',
      role: 'user',
      status: 'active',
      created_at: '2023-04-15T00:00:00Z',
      updated_at: '2023-04-15T00:00:00Z',
      avatar_url: 'https://i.pravatar.cc/150?img=9',
      phone: '+242 901 234 567',
      last_login: '2023-07-01T19:25:00Z'
    },
    {
      id: 'user-10',
      email: 'client2@example.com',
      password: 'client123',
      first_name: 'Marie',
      last_name: 'Leclerc',
      role: 'user',
      status: 'active',
      created_at: '2023-05-01T00:00:00Z',
      updated_at: '2023-05-01T00:00:00Z',
      avatar_url: 'https://i.pravatar.cc/150?img=10',
      phone: '+242 012 345 678',
      last_login: '2023-07-02T12:40:00Z'
    }
  ],

  // Identifiants de connexion pour l'authentification
  auth: {
    user: {
      id: 'user-1',
      email: 'admin@example.com',
      user_metadata: {
        full_name: 'Admin User'
      }
    }
  },

  // Menu items for restaurants
  menu_items: [
    {
      id: "item-1",
      name: "Pizza Margherita",
      description: "Classic pizza with tomato sauce, mozzarella, and basil",
      price: 12.99,
      image_url: "https://picsum.photos/seed/pizza1/300/200",
      category: "pizza",
      restaurant_id: "resto-1",
      available: true,
      created_at: "2023-01-01T10:00:00Z",
      ingredients: ["tomato sauce", "mozzarella", "basil"],
      rating: 4.5,
      preparation_time: 15,
      dietary_preferences: ["vegetarian"]
    },
    {
      id: "item-2",
      name: "Spaghetti Carbonara",
      description: "Pasta with egg, cheese, pancetta, and pepper",
      price: 14.99,
      image_url: "https://picsum.photos/seed/pasta1/300/200",
      category: "pasta",
      restaurant_id: "resto-1",
      available: true,
      created_at: "2023-01-01T10:05:00Z",
      ingredients: ["spaghetti", "egg", "pecorino cheese", "pancetta", "pepper"],
      rating: 4.7,
      preparation_time: 20,
      dietary_preferences: []
    },
    {
      id: "item-3",
      name: "Caesar Salad",
      description: "Romaine lettuce, croutons, parmesan, and Caesar dressing",
      price: 9.99,
      image_url: "https://picsum.photos/seed/salad1/300/200",
      category: "salad",
      restaurant_id: "resto-1",
      available: true,
      created_at: "2023-01-01T10:10:00Z",
      ingredients: ["romaine lettuce", "croutons", "parmesan", "caesar dressing"],
      rating: 4.3,
      preparation_time: 10,
      dietary_preferences: ["vegetarian"]
    },
    {
      id: "item-4",
      name: "Tiramisu",
      description: "Coffee-flavored Italian dessert",
      price: 7.99,
      image_url: "https://picsum.photos/seed/dessert1/300/200",
      category: "dessert",
      restaurant_id: "resto-1",
      available: true,
      created_at: "2023-01-01T10:15:00Z",
      ingredients: ["ladyfingers", "coffee", "mascarpone", "cocoa"],
      rating: 4.9,
      preparation_time: 30,
      dietary_preferences: ["vegetarian"]
    },
    {
      id: "item-5",
      name: "Beef Burger",
      description: "Premium beef patty with lettuce, tomato, and special sauce",
      price: 13.99,
      image_url: "https://picsum.photos/seed/burger1/300/200",
      category: "burgers",
      restaurant_id: "resto-2",
      available: true,
      created_at: "2023-01-02T09:00:00Z",
      ingredients: ["beef patty", "lettuce", "tomato", "onion", "special sauce", "brioche bun"],
      rating: 4.6,
      preparation_time: 18,
      dietary_preferences: []
    },
    {
      id: "item-6",
      name: "French Fries",
      description: "Crispy golden fries with sea salt",
      price: 4.99,
      image_url: "https://picsum.photos/seed/fries1/300/200",
      category: "sides",
      restaurant_id: "resto-2",
      available: true,
      created_at: "2023-01-02T09:05:00Z",
      ingredients: ["potatoes", "sea salt", "vegetable oil"],
      rating: 4.4,
      preparation_time: 12,
      dietary_preferences: ["vegetarian", "vegan"]
    },
    {
      id: "item-7",
      name: "Chocolate Milkshake",
      description: "Creamy chocolate shake with whipped cream",
      price: 5.99,
      image_url: "https://picsum.photos/seed/shake1/300/200",
      category: "drinks",
      restaurant_id: "resto-2",
      available: true,
      created_at: "2023-01-02T09:10:00Z",
      ingredients: ["milk", "chocolate ice cream", "chocolate syrup", "whipped cream"],
      rating: 4.8,
      preparation_time: 5,
      dietary_preferences: ["vegetarian"]
    }
  ],

  // Inventory levels
  inventory_levels: [
    {
      id: "inv-1",
      menu_item_id: "item-1",
      current_stock: 20,
      reserved_stock: 2,
      min_stock_level: 5
    },
    {
      id: "inv-2",
      menu_item_id: "item-2",
      current_stock: 15,
      reserved_stock: 0,
      min_stock_level: 3
    },
    {
      id: "inv-3",
      menu_item_id: "item-3",
      current_stock: 25,
      reserved_stock: 1,
      min_stock_level: 4
    },
    {
      id: "inv-4",
      menu_item_id: "item-4",
      current_stock: 12,
      reserved_stock: 0,
      min_stock_level: 2
    },
    {
      id: "inv-5",
      menu_item_id: "item-5",
      current_stock: 30,
      reserved_stock: 3,
      min_stock_level: 5
    }
  ],

  // Fake api response
  mockApi: {
    auth: {
      getUser: async () => {
        return {
          data: {
            user: {
              id: 'user-1',
              email: 'admin@example.com',
              user_metadata: {
                full_name: 'Admin User'
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
              access_token: 'fake-token-xyz',
              expires_at: new Date().getTime() + 3600000 // 1 hour from now
            }
          },
          error: null
        };
      },
      signInWithPassword: async (credentials: any) => {
        // Simulate a successful login
        await new Promise(resolve => setTimeout(resolve, 800));
        
        return {
          data: {
            user: {
              id: 'user-1',
              email: credentials.email,
              user_metadata: {
                full_name: 'Admin User'
              }
            },
            session: {
              access_token: 'fake-token-xyz',
              expires_at: new Date().getTime() + 3600000 // 1 hour from now
            }
          },
          error: null
        };
      },
      signUp: async (credentials: any) => {
        // Simulate a successful registration
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          data: {
            user: {
              id: 'user-new',
              email: credentials.email,
              user_metadata: {
                full_name: credentials.options?.data?.first_name + ' ' + credentials.options?.data?.last_name
              }
            },
            session: {
              access_token: 'fake-token-xyz',
              expires_at: new Date().getTime() + 3600000 // 1 hour from now
            }
          },
          error: null
        };
      },
      signOut: async () => {
        // Simulate signout
        await new Promise(resolve => setTimeout(resolve, 300));
        
        return {
          error: null
        };
      }
    },
    from: (table: string) => {
      // Fake implementation for querying tables
      return {
        select: (query?: string) => {
          // Return different results based on the table
          return {
            eq: (field: string, value: any) => {
              // Simulate filtering
              const filtered = mockData.menu_items.filter(item => item[field] === value);
              
              return {
                single: () => {
                  return {
                    data: filtered[0] || null,
                    error: null
                  };
                },
                order: (column: string, { ascending = true } = {}) => {
                  // Simulate sorting
                  return {
                    limit: (limit: number) => {
                      return {
                        maybeSingle: () => {
                          return {
                            data: filtered.slice(0, limit)[0] || null,
                            error: null
                          };
                        },
                        data: () => {
                          return {
                            data: filtered.slice(0, limit),
                            error: null
                          };
                        }
                      };
                    },
                    data: () => {
                      return {
                        data: filtered,
                        error: null
                      };
                    }
                  };
                },
                data: () => {
                  return {
                    data: filtered,
                    error: null
                  };
                },
              };
            },
            in: (field: string, values: any[]) => {
              // Simulate filtering with IN clause
              const filtered = mockData.menu_items.filter(item => values.includes(item[field]));
              
              return {
                single: () => {
                  return {
                    data: filtered[0] || null,
                    error: null
                  };
                },
                order: (column: string, { ascending = true } = {}) => {
                  // Simulate sorting
                  return {
                    limit: (limit: number) => {
                      return {
                        data: () => {
                          return {
                            data: filtered.slice(0, limit),
                            error: null
                          };
                        }
                      };
                    },
                    data: () => {
                      return {
                        data: filtered,
                        error: null
                      };
                    }
                  };
                },
                data: () => {
                  return {
                    data: filtered,
                    error: null
                  };
                }
              };
            }
          };
        },
        order: (column: string, { ascending = true } = {}) => {
          // Simulate ordering
          return {
            data: () => {
              return {
                data: mockData.menu_items,
                error: null
              };
            }
          };
        },
        limit: (limit: number) => {
          return {
            maybeSingle: () => {
              return {
                data: mockData.menu_items[0] || null,
                error: null
              };
            },
            data: () => {
              return {
                data: mockData.menu_items.slice(0, limit),
                error: null
              };
            }
          };
        },
        data: () => {
          return {
            data: mockData.menu_items,
            error: null
          };
        }
      };
    }
  }
};
