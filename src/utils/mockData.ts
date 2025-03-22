
/**
 * Mock data for development and testing
 */

export const mockData = {
  auth: {
    user: {
      id: 'mock-user-id',
      email: 'user@example.com',
      user_metadata: {
        full_name: 'John Doe'
      }
    }
  },
  restaurants: [
    {
      id: 'restaurant-1',
      name: 'Le Gourmet',
      description: 'Fine cuisine française',
      address: '123 Avenue des Champs-Élysées',
      latitude: 48.8566,
      longitude: 2.3522,
      cuisine_type: 'French',
      rating: 4.7,
      is_open: true
    }
  ],
  menu_items: [
    {
      id: 'item-1',
      name: 'Coq au Vin',
      description: 'Traditional French dish',
      price: 18.95,
      restaurant_id: 'restaurant-1',
      available: true,
      category: 'Main',
      created_at: '2023-01-01T12:00:00Z'
    }
  ],
  orders: [
    {
      id: 'order-1',
      user_id: 'mock-user-id',
      restaurant_id: 'restaurant-1',
      status: 'pending',
      total_amount: 23.95,
      created_at: '2023-07-15T14:30:00Z'
    }
  ],
  tables: [
    {
      id: 'table-1',
      restaurant_id: 'restaurant-1',
      name: 'Table 1',
      capacity: 4,
      location: 'Inside'
    }
  ],
  profiles: [
    {
      id: 'mock-user-id',
      dietary_preferences: ['vegetarian'],
      addresses: ['123 Main St, Anytown']
    }
  ],
  wallets: [
    {
      id: 'wallet-1',
      user_id: 'mock-user-id',
      balance: 100,
      total_earnings: 150
    }
  ],
  delivery_drivers: [
    {
      id: 'driver-1',
      user_id: 'driver-user-1',
      name: 'Jean Conducteur',
      phone: '+3366778899',
      vehicle_type: 'car',
      average_rating: 4.8,
      profile_picture: 'https://example.com/profile.jpg',
      verification_status: 'verified',
      is_external: false,
      current_latitude: 48.8566,
      current_longitude: 2.3522,
      max_concurrent_deliveries: 3,
      languages: ['French', 'English']
    }
  ],
  loyalty_points: [
    {
      user_id: 'mock-user-id',
      points: 150,
      tier_name: 'Silver',
      points_to_next_tier: 350,
      benefits: ['10% discount', 'Free delivery']
    }
  ]
};
