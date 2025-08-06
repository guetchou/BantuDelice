import apiService from '@/services/api';

export interface DemoData {
  id: string;
  type: 'restaurant' | 'user' | 'order' | 'driver' | 'review' | 'promotion';
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
  data: unknown;
}

export interface RestaurantDemo {
  name: string;
  description: string;
  cuisine_type: string;
  address: string;
  phone: string;
  email: string;
  image_url: string;
  latitude: number;
  longitude: number;
  delivery_radius: number;
  min_order_amount: number;
  avg_preparation_time: number;
  is_open: boolean;
  opening_hours: unknown;
}

export interface UserDemo {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  role: string;
}

export interface DriverDemo {
  name: string;
  phone: string;
  email: string;
  vehicle_type: string;
  status: string;
  current_latitude: number;
  current_longitude: number;
  average_rating: number;
  total_deliveries: number;
}

export interface OrderDemo {
  user_id: number;
  restaurant_id: number;
  total_amount: number;
  status: string;
  payment_status: string;
  delivery_address: string;
  items: unknown[];
}

export interface ReviewDemo {
  user_id: number;
  restaurant_id: number;
  rating: number;
  comment: string;
}

export interface PromotionDemo {
  name: string;
  description: string;
  discount_type: string;
  discount_value: number;
  min_order_amount: number;
  start_date: string;
  end_date: string;
  code: string;
  is_active: boolean;
  usage_limit: number;
  current_usage: number;
}

class DemoDataService {
  private tableName = 'demo_data';

  // Initialiser la table demo_data si elle n'existe pas
  async initializeTable() {
    try {
      const { error } = await apiService.rpc('create_demo_data_table_if_not_exists');
      if (error) {
        console.warn('Table demo_data pourrait déjà exister:', error.message);
      }
    } catch (error) {
      console.warn('Erreur lors de l\'initialisation de la table:', error);
    }
  }

  // Charger toutes les données de démonstration
  async loadAllDemoData(): Promise<DemoData[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des données:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      return [];
    }
  }

  // Charger les données de démonstration par type
  async loadDemoDataByType(type: string): Promise<DemoData[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('type', type)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des données:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      return [];
    }
  }

  // Créer de nouvelles données de démonstration
  async createDemoData(demoData: Omit<DemoData, 'id' | 'created_at' | 'updated_at'>): Promise<DemoData | null> {
    try {
      const newData = {
        ...demoData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from(this.tableName)
        .insert([newData])
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      return null;
    }
  }

  // Mettre à jour les données de démonstration
  async updateDemoData(id: string, updates: Partial<DemoData>): Promise<DemoData | null> {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from(this.tableName)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      return null;
    }
  }

  // Supprimer des données de démonstration
  async deleteDemoData(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la suppression:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      return false;
    }
  }

  // Actions en masse
  async bulkUpdateStatus(ids: string[], status: 'active' | 'inactive' | 'pending'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .in('id', ids);

      if (error) {
        console.error('Erreur lors de la mise à jour en masse:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour en masse:', error);
      return false;
    }
  }

  async bulkDelete(ids: string[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .in('id', ids);

      if (error) {
        console.error('Erreur lors de la suppression en masse:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression en masse:', error);
      return false;
    }
  }

  // Insérer des données de démonstration pré-configurées
  async insertPreconfiguredData(): Promise<boolean> {
    try {
      const preconfiguredData = this.getPreconfiguredData();
      
      const { error } = await supabase
        .from(this.tableName)
        .insert(preconfiguredData);

      if (error) {
        console.error('Erreur lors de l\'insertion des données pré-configurées:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'insertion des données pré-configurées:', error);
      return false;
    }
  }

  // Obtenir les données pré-configurées
  private getPreconfiguredData(): Omit<DemoData, 'id' | 'created_at' | 'updated_at'>[] {
    const now = new Date().toISOString();
    
    const demoRestaurants: RestaurantDemo[] = [
      {
        name: "Délices Congolais",
        description: "Cuisine traditionnelle congolaise authentique",
        cuisine_type: "Congolais",
        address: "123 Avenue de la Paix, Brazzaville",
        phone: "+242 123 456 789",
        email: "contact@delicescongolais.com",
        image_url: "/images/restaurants/delices-congolais.jpg",
        latitude: 4.2634,
        longitude: 15.2429,
        delivery_radius: 10,
        min_order_amount: 2000,
        avg_preparation_time: 30,
        is_open: true,
        opening_hours: {
          monday: { open: "08:00", close: "22:00" },
          tuesday: { open: "08:00", close: "22:00" },
          wednesday: { open: "08:00", close: "22:00" },
          thursday: { open: "08:00", close: "22:00" },
          friday: { open: "08:00", close: "23:00" },
          saturday: { open: "09:00", close: "23:00" },
          sunday: { open: "10:00", close: "21:00" }
        }
      },
      {
        name: "Mami Wata",
        description: "Restaurant de fruits de mer avec vue sur le fleuve",
        cuisine_type: "Poisson",
        address: "45 Boulevard Marien Ngouabi, Brazzaville",
        phone: "+242 987 654 321",
        email: "info@mamiwata.com",
        image_url: "/images/restaurants/mami-wata.jpg",
        latitude: 4.2680,
        longitude: 15.2855,
        delivery_radius: 8,
        min_order_amount: 3000,
        avg_preparation_time: 25,
        is_open: true,
        opening_hours: {
          monday: { open: "07:00", close: "21:00" },
          tuesday: { open: "07:00", close: "21:00" },
          wednesday: { open: "07:00", close: "21:00" },
          thursday: { open: "07:00", close: "21:00" },
          friday: { open: "07:00", close: "22:00" },
          saturday: { open: "08:00", close: "22:00" },
          sunday: { open: "09:00", close: "20:00" }
        }
      },
      {
        name: "Le Poulet Moambe",
        description: "Spécialiste du poulet moambe et plats traditionnels",
        cuisine_type: "Congolais",
        address: "78 Rue de la Révolution, Brazzaville",
        phone: "+242 555 123 456",
        email: "contact@pouletmoambe.com",
        image_url: "/images/restaurants/poulet-moambe.jpg",
        latitude: 4.2650,
        longitude: 15.2450,
        delivery_radius: 12,
        min_order_amount: 1500,
        avg_preparation_time: 35,
        is_open: true,
        opening_hours: {
          monday: { open: "09:00", close: "21:00" },
          tuesday: { open: "09:00", close: "21:00" },
          wednesday: { open: "09:00", close: "21:00" },
          thursday: { open: "09:00", close: "21:00" },
          friday: { open: "09:00", close: "22:00" },
          saturday: { open: "10:00", close: "22:00" },
          sunday: { open: "11:00", close: "20:00" }
        }
      }
    ];

    const demoUsers: UserDemo[] = [
      {
        email: "john.doe@example.com",
        first_name: "John",
        last_name: "Doe",
        phone: "+242 111 222 333",
        address: "15 Rue de la République, Brazzaville",
        role: "user"
      },
      {
        email: "marie.ngouabi@example.com",
        first_name: "Marie",
        last_name: "Ngouabi",
        phone: "+242 444 555 666",
        address: "32 Avenue de l'Indépendance, Brazzaville",
        role: "user"
      },
      {
        email: "pierre.mabiala@example.com",
        first_name: "Pierre",
        last_name: "Mabiala",
        phone: "+242 777 888 999",
        address: "8 Boulevard de la Paix, Brazzaville",
        role: "user"
      }
    ];

    const demoDrivers: DriverDemo[] = [
      {
        name: "Jean-Baptiste Kimbouala",
        phone: "+242 123 456 789",
        email: "jean.kimbouala@example.com",
        vehicle_type: "motorcycle",
        status: "available",
        current_latitude: 4.2634,
        current_longitude: 15.2429,
        average_rating: 4.8,
        total_deliveries: 156
      },
      {
        name: "Marie-Louise Nzila",
        phone: "+242 987 654 321",
        email: "marie.nzila@example.com",
        vehicle_type: "car",
        status: "available",
        current_latitude: 4.2680,
        current_longitude: 15.2855,
        average_rating: 4.6,
        total_deliveries: 89
      },
      {
        name: "André Mpassi",
        phone: "+242 555 123 456",
        email: "andre.mpassi@example.com",
        vehicle_type: "motorcycle",
        status: "busy",
        current_latitude: 4.2650,
        current_longitude: 15.2450,
        average_rating: 4.9,
        total_deliveries: 234
      }
    ];

    const demoOrders: OrderDemo[] = [
      {
        user_id: 1,
        restaurant_id: 1,
        total_amount: 4500,
        status: "delivered",
        payment_status: "completed",
        delivery_address: "15 Rue de la République, Brazzaville",
        items: [
          { name: "Poulet Moambe", quantity: 2, price: 2000 },
          { name: "Fufu", quantity: 1, price: 500 }
        ]
      },
      {
        user_id: 2,
        restaurant_id: 2,
        total_amount: 3200,
        status: "preparing",
        payment_status: "completed",
        delivery_address: "32 Avenue de l'Indépendance, Brazzaville",
        items: [
          { name: "Poisson Braisé", quantity: 1, price: 2500 },
          { name: "Attieke", quantity: 1, price: 700 }
        ]
      }
    ];

    const demoReviews: ReviewDemo[] = [
      {
        user_id: 1,
        restaurant_id: 1,
        rating: 5,
        comment: "Excellent poulet moambe, très authentique !"
      },
      {
        user_id: 2,
        restaurant_id: 2,
        rating: 4,
        comment: "Bon poisson, livraison rapide"
      },
      {
        user_id: 3,
        restaurant_id: 3,
        rating: 5,
        comment: "Service impeccable, nourriture délicieuse"
      }
    ];

    const demoPromotions: PromotionDemo[] = [
      {
        name: "Offre de Bienvenue",
        description: "20% de réduction sur votre première commande",
        discount_type: "percentage",
        discount_value: 20,
        min_order_amount: 3000,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        code: "BIENVENUE20",
        is_active: true,
        usage_limit: 1000,
        current_usage: 156
      },
      {
        name: "Livraison Gratuite",
        description: "Livraison gratuite pour les commandes de plus de 5000 FCFA",
        discount_type: "free_delivery",
        discount_value: 0,
        min_order_amount: 5000,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        code: "LIVRAISON0",
        is_active: true,
        usage_limit: 500,
        current_usage: 89
      }
    ];

    return [
      ...demoRestaurants.map((restaurant, index) => ({
        type: 'restaurant' as const,
        name: restaurant.name,
        description: restaurant.description,
        status: 'active' as const,
        data: restaurant
      })),
      ...demoUsers.map((user, index) => ({
        type: 'user' as const,
        name: `${user.first_name} ${user.last_name}`,
        description: user.email,
        status: 'active' as const,
        data: user
      })),
      ...demoDrivers.map((driver, index) => ({
        type: 'driver' as const,
        name: driver.name,
        description: `${driver.vehicle_type} - ${driver.status}`,
        status: 'active' as const,
        data: driver
      })),
      ...demoOrders.map((order, index) => ({
        type: 'order' as const,
        name: `Commande #${index + 1}`,
        description: `${order.total_amount} FCFA - ${order.status}`,
        status: 'active' as const,
        data: order
      })),
      ...demoReviews.map((review, index) => ({
        type: 'review' as const,
        name: `Avis #${index + 1}`,
        description: `${review.rating}/5 étoiles`,
        status: 'active' as const,
        data: review
      })),
      ...demoPromotions.map((promo, index) => ({
        type: 'promotion' as const,
        name: promo.name,
        description: promo.description,
        status: 'active' as const,
        data: promo
      }))
    ];
  }

  // Synchroniser les données de démonstration avec les vraies tables
  async syncWithRealTables(): Promise<boolean> {
    try {
      const demoData = await this.loadAllDemoData();
      
      for (const item of demoData) {
        if (item.status === 'active') {
          await this.syncItemToRealTable(item);
        }
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      return false;
    }
  }

  private async syncItemToRealTable(item: DemoData): Promise<void> {
    try {
      switch (item.type) {
        case 'restaurant':
          await this.syncRestaurant(item.data);
          break;
        case 'user':
          await this.syncUser(item.data);
          break;
        case 'driver':
          await this.syncDriver(item.data);
          break;
        case 'order':
          await this.syncOrder(item.data);
          break;
        case 'review':
          await this.syncReview(item.data);
          break;
        case 'promotion':
          await this.syncPromotion(item.data);
          break;
      }
    } catch (error) {
      console.error(`Erreur lors de la synchronisation de ${item.type}:`, error);
    }
  }

  private async syncRestaurant(data: RestaurantDemo): Promise<void> {
    const { error } = await supabase
      .from('restaurants')
      .upsert([data], { onConflict: 'name' });

    if (error) {
      console.error('Erreur lors de la synchronisation du restaurant:', error);
    }
  }

  private async syncUser(data: UserDemo): Promise<void> {
    const { error } = await supabase
      .from('users')
      .upsert([data], { onConflict: 'email' });

    if (error) {
      console.error('Erreur lors de la synchronisation de l\'utilisateur:', error);
    }
  }

  private async syncDriver(data: DriverDemo): Promise<void> {
    const { error } = await supabase
      .from('delivery_drivers')
      .upsert([data], { onConflict: 'email' });

    if (error) {
      console.error('Erreur lors de la synchronisation du livreur:', error);
    }
  }

  private async syncOrder(data: OrderDemo): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .upsert([data], { onConflict: 'id' });

    if (error) {
      console.error('Erreur lors de la synchronisation de la commande:', error);
    }
  }

  private async syncReview(data: ReviewDemo): Promise<void> {
    const { error } = await supabase
      .from('reviews')
      .upsert([data], { onConflict: 'id' });

    if (error) {
      console.error('Erreur lors de la synchronisation de l\'avis:', error);
    }
  }

  private async syncPromotion(data: PromotionDemo): Promise<void> {
    const { error } = await supabase
      .from('promotions')
      .upsert([data], { onConflict: 'code' });

    if (error) {
      console.error('Erreur lors de la synchronisation de la promotion:', error);
    }
  }
}

export const demoDataService = new DemoDataService(); 