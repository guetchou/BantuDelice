
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
  },

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

  // Mock restaurant data
  restaurants: [
    {
      id: 'rest-1',
      name: 'Le Délice Africain',
      description: 'Restaurant authentique avec cuisine traditionnelle africaine revisitée.',
      address: 'Avenue de la Liberté, Brazzaville',
      latitude: 4.2634,
      longitude: 15.2429,
      phone: '+242 05 123 4567',
      email: 'contact@delice-africain.com',
      website: 'https://delice-africain.com',
      logo_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      banner_image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      cuisine_type: ['Africaine', 'Fusion'],
      price_range: 3,
      average_rating: 4.8,
      total_ratings: 243,
      featured: true,
      user_id: 'restaurant-1',
      created_at: '2023-01-15T00:00:00Z',
      updated_at: '2023-05-10T00:00:00Z',
      status: 'active',
      business_hours: {
        regular: {
          monday: { open: '10:00', close: '22:00', is_closed: false },
          tuesday: { open: '10:00', close: '22:00', is_closed: false },
          wednesday: { open: '10:00', close: '22:00', is_closed: false },
          thursday: { open: '10:00', close: '22:00', is_closed: false },
          friday: { open: '10:00', close: '00:00', is_closed: false },
          saturday: { open: '10:00', close: '00:00', is_closed: false },
          sunday: { open: '12:00', close: '22:00', is_closed: false }
        },
        special: []
      },
      delivery_radius: 10,
      minimum_order: 5000,
      payment_methods: ['cash', 'credit_card', 'mobile_money'],
      tags: ['African', 'Traditional', 'Modern'],
      opening_date: '2022-03-15T00:00:00Z',
      special_features: ['live_music', 'outdoor_seating', 'private_dining'],
      delivery_fee: 1500,
      free_delivery_min: 15000,
      contact_phone: '+242 05 123 4567',
      contact_email: 'contact@delice-africain.com',
      is_open: true,
      estimated_delivery_time: 45
    },
    {
      id: 'rest-2',
      name: 'La Terrasse du Congo',
      description: 'Un lieu chaleureux avec une vue panoramique sur le fleuve Congo.',
      address: 'Boulevard du Port, Brazzaville',
      latitude: 4.2689,
      longitude: 15.2910,
      phone: '+242 06 765 4321',
      email: 'info@terrasse-congo.com',
      website: 'https://terrasse-congo.com',
      logo_url: 'https://images.unsplash.com/photo-1586999768265-24af89630739?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      banner_image_url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      cuisine_type: ['Congolaise', 'Fruits de mer'],
      price_range: 4,
      average_rating: 4.5,
      total_ratings: 187,
      featured: true,
      user_id: 'restaurant-1',
      created_at: '2023-02-10T00:00:00Z',
      updated_at: '2023-06-15T00:00:00Z',
      status: 'active',
      business_hours: {
        regular: {
          monday: { open: '11:00', close: '23:00', is_closed: false },
          tuesday: { open: '11:00', close: '23:00', is_closed: false },
          wednesday: { open: '11:00', close: '23:00', is_closed: false },
          thursday: { open: '11:00', close: '23:00', is_closed: false },
          friday: { open: '11:00', close: '01:00', is_closed: false },
          saturday: { open: '11:00', close: '01:00', is_closed: false },
          sunday: { open: '12:00', close: '23:00', is_closed: false }
        },
        special: []
      },
      delivery_radius: 8,
      minimum_order: 8000,
      payment_methods: ['cash', 'credit_card', 'mobile_money'],
      tags: ['Congolese', 'Seafood', 'River view'],
      opening_date: '2021-11-20T00:00:00Z',
      special_features: ['river_view', 'live_music', 'cocktail_bar'],
      delivery_fee: 2000,
      free_delivery_min: 20000,
      contact_phone: '+242 06 765 4321',
      contact_email: 'info@terrasse-congo.com',
      is_open: true,
      estimated_delivery_time: 40
    },
    {
      id: 'rest-3',
      name: 'Saveurs d\'Afrique',
      description: 'Un voyage culinaire à travers les saveurs de toute l\'Afrique.',
      address: 'Rue des Martyrs, Brazzaville',
      latitude: 4.2751,
      longitude: 15.2662,
      phone: '+242 05 987 6543',
      email: 'contact@saveurs-afrique.com',
      website: 'https://saveurs-afrique.com',
      logo_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      banner_image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      cuisine_type: ['Panafricaine', 'Fusion'],
      price_range: 3,
      average_rating: 4.6,
      total_ratings: 215,
      featured: false,
      user_id: 'restaurant-1',
      created_at: '2023-03-05T00:00:00Z',
      updated_at: '2023-07-20T00:00:00Z',
      status: 'active',
      business_hours: {
        regular: {
          monday: { open: '10:30', close: '22:30', is_closed: true },
          tuesday: { open: '10:30', close: '22:30', is_closed: false },
          wednesday: { open: '10:30', close: '22:30', is_closed: false },
          thursday: { open: '10:30', close: '22:30', is_closed: false },
          friday: { open: '10:30', close: '23:30', is_closed: false },
          saturday: { open: '10:30', close: '23:30', is_closed: false },
          sunday: { open: '12:30', close: '22:30', is_closed: false }
        },
        special: []
      },
      delivery_radius: 12,
      minimum_order: 6000,
      payment_methods: ['cash', 'credit_card', 'mobile_money'],
      tags: ['Pan-African', 'Fusion', 'Authentic'],
      opening_date: '2022-05-10T00:00:00Z',
      special_features: ['cooking_classes', 'catering', 'private_events'],
      delivery_fee: 1800,
      free_delivery_min: 18000,
      contact_phone: '+242 05 987 6543',
      contact_email: 'contact@saveurs-afrique.com',
      is_open: false,
      estimated_delivery_time: 50
    }
  ],

  // Mock menu items
  menu_items: [
    {
      id: 'item-1',
      name: 'Poulet Yassa',
      description: 'Poulet mariné dans une sauce citron-oignon, servi avec du riz blanc.',
      price: 6500,
      image_url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      category: 'Plats principaux',
      restaurant_id: 'rest-1',
      available: true,
      created_at: '2023-01-20T00:00:00Z',
      ingredients: ['poulet', 'oignons', 'citron', 'moutarde', 'riz'],
      preparation_time: 30,
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: true,
      is_spicy: false,
      allergens: ['moutarde'],
      popularity_score: 85,
      profit_margin: 0.65,
      cost_price: 2275
    },
    {
      id: 'item-2',
      name: 'Tieboudienne',
      description: 'Plat national sénégalais avec riz, poisson et légumes.',
      price: 7000,
      image_url: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      category: 'Plats principaux',
      restaurant_id: 'rest-1',
      available: true,
      created_at: '2023-01-20T00:00:00Z',
      ingredients: ['riz', 'poisson', 'tomates', 'carottes', 'aubergines', 'chou'],
      preparation_time: 40,
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: true,
      is_spicy: false,
      allergens: ['poisson'],
      popularity_score: 78,
      profit_margin: 0.7,
      cost_price: 2100
    },
    {
      id: 'item-3',
      name: 'Ndolé',
      description: 'Ragoût de feuilles amères avec viande ou fruits de mer.',
      price: 6000,
      image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80',
      category: 'Plats principaux',
      restaurant_id: 'rest-1',
      available: true,
      created_at: '2023-01-20T00:00:00Z',
      ingredients: ['feuilles de ndolé', 'viande de bœuf', 'crevettes', 'arachides', 'huile de palme'],
      preparation_time: 45,
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: true,
      is_spicy: true,
      allergens: ['crustacés', 'arachides'],
      popularity_score: 72,
      profit_margin: 0.6,
      cost_price: 2400
    },
    {
      id: 'item-4',
      name: 'Salade de Papaye Verte',
      description: 'Salade fraîche et légèrement épicée, avec papaye verte râpée.',
      price: 4000,
      image_url: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1078&q=80',
      category: 'Entrées',
      restaurant_id: 'rest-1',
      available: true,
      created_at: '2023-01-20T00:00:00Z',
      ingredients: ['papaye verte', 'tomates', 'citron vert', 'piment', 'cacahuètes'],
      preparation_time: 15,
      is_vegetarian: true,
      is_vegan: true,
      is_gluten_free: true,
      is_spicy: true,
      allergens: ['arachides'],
      popularity_score: 65,
      profit_margin: 0.75,
      cost_price: 1000
    },
    {
      id: 'item-5',
      name: 'Jus de Bissap',
      description: 'Boisson rafraîchissante à base de fleurs d\'hibiscus.',
      price: 2000,
      image_url: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80',
      category: 'Boissons',
      restaurant_id: 'rest-1',
      available: true,
      created_at: '2023-01-20T00:00:00Z',
      ingredients: ['fleurs d\'hibiscus', 'sucre', 'eau', 'menthe'],
      preparation_time: 5,
      is_vegetarian: true,
      is_vegan: true,
      is_gluten_free: true,
      is_spicy: false,
      allergens: [],
      popularity_score: 90,
      profit_margin: 0.85,
      cost_price: 300
    },
    {
      id: 'item-6',
      name: 'Attiéké au Poisson Braisé',
      description: 'Semoule de manioc avec poisson braisé et légumes.',
      price: 6800,
      image_url: 'https://images.unsplash.com/photo-1530260626688-048151a14197?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1476&q=80',
      category: 'Plats principaux',
      restaurant_id: 'rest-2',
      available: true,
      created_at: '2023-02-15T00:00:00Z',
      ingredients: ['attiéké', 'poisson', 'tomates', 'oignons', 'piment'],
      preparation_time: 25,
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: true,
      is_spicy: true,
      allergens: ['poisson'],
      popularity_score: 82,
      profit_margin: 0.6,
      cost_price: 2720
    },
    {
      id: 'item-7',
      name: 'Cocktail Congo River',
      description: 'Cocktail signature à base de rhum, jus de fruits tropicaux et sirop de gingembre.',
      price: 4500,
      image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      category: 'Boissons',
      restaurant_id: 'rest-2',
      available: true,
      created_at: '2023-02-15T00:00:00Z',
      ingredients: ['rhum', 'ananas', 'fruit de la passion', 'gingembre', 'sucre'],
      preparation_time: 5,
      is_vegetarian: true,
      is_vegan: true,
      is_gluten_free: true,
      is_spicy: false,
      allergens: [],
      popularity_score: 88,
      profit_margin: 0.8,
      cost_price: 900
    },
    {
      id: 'item-8',
      name: 'Plateau de Fruits de Mer',
      description: 'Sélection de fruits de mer frais du jour.',
      price: 15000,
      image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1014&q=80',
      category: 'Plats principaux',
      restaurant_id: 'rest-2',
      available: true,
      created_at: '2023-02-15T00:00:00Z',
      ingredients: ['crevettes', 'crabes', 'langoustes', 'moules', 'citron'],
      preparation_time: 30,
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: true,
      is_spicy: false,
      allergens: ['crustacés', 'mollusques'],
      popularity_score: 70,
      profit_margin: 0.55,
      cost_price: 6750
    },
    {
      id: 'item-9',
      name: 'Couscous Royal',
      description: 'Couscous avec agneau, poulet, merguez et légumes.',
      price: 8500,
      image_url: 'https://images.unsplash.com/photo-1579888944880-d98341245702?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      category: 'Plats principaux',
      restaurant_id: 'rest-3',
      available: true,
      created_at: '2023-03-10T00:00:00Z',
      ingredients: ['semoule', 'agneau', 'poulet', 'merguez', 'carottes', 'courgettes', 'pois chiches'],
      preparation_time: 40,
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: false,
      is_spicy: false,
      allergens: ['gluten'],
      popularity_score: 80,
      profit_margin: 0.65,
      cost_price: 2975
    },
    {
      id: 'item-10',
      name: 'Tajine d\'Agneau aux Pruneaux',
      description: 'Tajine traditionnel avec agneau mijoté et pruneaux.',
      price: 7500,
      image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80',
      category: 'Plats principaux',
      restaurant_id: 'rest-3',
      available: true,
      created_at: '2023-03-10T00:00:00Z',
      ingredients: ['agneau', 'pruneaux', 'oignons', 'miel', 'cannelle', 'gingembre'],
      preparation_time: 50,
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: true,
      is_spicy: false,
      allergens: [],
      popularity_score: 75,
      profit_margin: 0.7,
      cost_price: 2250
    }
  ],

  // Add more mock collections as needed
  inventory_levels: [
    {
      id: 'inv-1',
      restaurant_id: 'rest-1',
      ingredient_id: 'ingr-1',
      ingredient_name: 'Poulet',
      current_stock: 25,
      unit: 'kg',
      min_stock_level: 10,
      max_stock_level: 50,
      last_restocked: '2023-07-25T00:00:00Z',
      restock_frequency: 'weekly',
      average_consumption: 5,
      cost_per_unit: 2500,
      status: 'ok',
      updated_at: '2023-07-25T00:00:00Z'
    },
    {
      id: 'inv-2',
      restaurant_id: 'rest-1',
      ingredient_id: 'ingr-2',
      ingredient_name: 'Riz',
      current_stock: 40,
      unit: 'kg',
      min_stock_level: 20,
      max_stock_level: 100,
      last_restocked: '2023-07-20T00:00:00Z',
      restock_frequency: 'monthly',
      average_consumption: 8,
      cost_per_unit: 800,
      status: 'ok',
      updated_at: '2023-07-25T00:00:00Z'
    }
  ],
  
  // Mock order data
  orders: [
    {
      id: 'order-1',
      user_id: 'user-1',
      restaurant_id: 'rest-1',
      status: 'completed',
      order_type: 'delivery',
      total_amount: 14500,
      delivery_fee: 1500,
      payment_method: 'cash',
      payment_status: 'paid',
      delivery_address: '123 Main St, Brazzaville',
      contact_phone: '+242 05 555 1234',
      created_at: '2023-07-25T12:30:00Z',
      completed_at: '2023-07-25T13:15:00Z',
      order_items: [
        {
          id: 'item-1',
          quantity: 2,
          price: 6500,
          notes: 'Extra spicy',
          name: 'Poulet Yassa'
        }
      ]
    }
  ]
};
