
import pb from '@/lib/pocketbase';
import { pbWrapper, createCollection, authAdapter } from '@/adapters/pocketbaseAdapter';

// Service d'authentification
export const authService = authAdapter;

// Services des restaurants
export const restaurantService = {
  getAll: (filters?: any) => createCollection('restaurants').getList(1, 50, filters),
  getById: (id: string) => createCollection('restaurants').getOne(id),
  getMenuItems: (restaurantId: string) => createCollection('menu_items').getByFilter(`restaurant_id="${restaurantId}"`),
  getMenu: (restaurantId: string) => createCollection('menus').getByFilter(`restaurant_id="${restaurantId}"`)
};

// Services des commandes
export const orderService = {
  getAll: (userId?: string, status?: string) => {
    const filter = [];
    if (userId) filter.push(`user_id="${userId}"`);
    if (status) filter.push(`status="${status}"`);
    
    return createCollection('orders').getByFilter(filter.join(' && '));
  },
  
  getById: (id: string) => createCollection('orders').getOne(id),
  
  createOrder: async (data: {
    user_id: string,
    restaurant_id: string,
    items: any[],
    delivery_address: string,
    payment_method: string,
    special_instructions?: string
  }) => {
    // Créer la commande
    const orderResult = await createCollection('orders').create({
      user_id: data.user_id,
      restaurant_id: data.restaurant_id,
      status: 'pending',
      total_amount: data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      delivery_address: data.delivery_address,
      payment_method: data.payment_method,
      special_instructions: data.special_instructions || '',
      created_at: new Date().toISOString()
    });
    
    if (orderResult.error || !orderResult.data) {
      return orderResult;
    }
    
    // Ajouter les articles de la commande
    for (const item of data.items) {
      await createCollection('order_items').create({
        order_id: orderResult.data.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.price,
        options: JSON.stringify(item.options || [])
      });
    }
    
    return orderResult;
  },
  
  updateOrderStatus: (orderId: string, status: string) => 
    createCollection('orders').update(orderId, { status })
};

// Services de paiement
export const paymentService = {
  createPayment: (data: {
    order_id: string,
    amount: number,
    payment_method: string,
    user_id: string
  }) => createCollection('payments').create({
    ...data,
    status: 'pending',
    created_at: new Date().toISOString()
  }),
  
  updatePaymentStatus: (paymentId: string, status: string) => 
    createCollection('payments').update(paymentId, { status }),
  
  getWalletBalance: async (userId: string) => {
    const walletResult = await createCollection('wallets').getByField('user_id', userId);
    
    if (walletResult.error || !walletResult.data) {
      // Créer un nouveau wallet si nécessaire
      if (walletResult.error) {
        return createCollection('wallets').create({
          user_id: userId,
          balance: 0,
          created_at: new Date().toISOString()
        });
      }
      
      return walletResult;
    }
    
    return walletResult;
  }
};

// Service de livraison
export const deliveryService = {
  getOrderDeliveryStatus: (orderId: string) => createCollection('delivery_tracking').getByField('order_id', orderId),
  
  updateDeliveryStatus: (deliveryId: string, status: string, location?: { latitude: number, longitude: number }) => {
    const updateData: Record<string, any> = { status };
    
    if (location) {
      updateData.current_latitude = location.latitude;
      updateData.current_longitude = location.longitude;
    }
    
    return createCollection('delivery_tracking').update(deliveryId, updateData);
  },
  
  createDeliveryRequest: (data: {
    order_id: string,
    pickup_address: string,
    delivery_address: string,
    estimated_delivery_time?: string
  }) => createCollection('delivery_requests').create({
    ...data,
    status: 'pending',
    created_at: new Date().toISOString()
  })
};

// Service de notifications
export const notificationService = {
  getAll: (userId: string) => createCollection('notifications').getByFilter(`user_id="${userId}"`),
  
  create: (data: {
    user_id: string,
    title: string,
    message: string,
    type: string,
    related_id?: string
  }) => createCollection('notifications').create({
    ...data,
    is_read: false,
    created_at: new Date().toISOString()
  }),
  
  markAsRead: (notificationId: string) => createCollection('notifications').update(notificationId, { is_read: true })
};

// Service en temps réel
export const realTimeService = {
  subscribeToCollection: (collectionName: string, recordId: string, callback: (data: any) => void) => {
    return pb.collection(collectionName).subscribe(recordId, callback);
  },
  
  unsubscribeFromCollection: (collectionName: string, recordId: string) => {
    pb.collection(collectionName).unsubscribe(recordId);
  }
};

// Export unifié de tous les services
export const pbService = {
  auth: authService,
  restaurants: restaurantService,
  orders: orderService,
  payments: paymentService,
  delivery: deliveryService,
  notifications: notificationService,
  realTime: realTimeService
};

export default pbService;
