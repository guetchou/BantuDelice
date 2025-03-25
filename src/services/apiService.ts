
import { pbWrapper, createCollection, authAdapter } from '@/adapters/pocketbaseAdapter';
import pb from '@/lib/pocketbase';
import { CartItem } from '@/types/cart';

// Services spécifiques pour les différentes entités
export const userService = {
  getCurrentUser: authAdapter.getCurrentUser,
  login: authAdapter.login,
  register: authAdapter.register,
  logout: authAdapter.logout,
  resetPassword: authAdapter.resetPassword
};

export const restaurantService = {
  // Méthodes principales pour les restaurants
  getAll: (filters?: any) => createCollection('restaurants').getList(1, 50, filters),
  getById: (id: string) => createCollection('restaurants').getOne(id),
  
  // Méthodes pour les menus
  getMenuItems: (restaurantId: string) => 
    createCollection('menu_items').getByFilter(`restaurant_id="${restaurantId}"`),
  
  getMenu: (restaurantId: string) => 
    createCollection('menus').getByFilter(`restaurant_id="${restaurantId}"`),
  
  // Méthodes pour la gestion des articles du menu
  updateMenuItemAvailability: (itemId: string, available: boolean) => 
    createCollection('menu_items').update(itemId, { available }),
  
  updateMenuItemStock: (itemId: string, stockLevel: number) => 
    createCollection('menu_items').update(itemId, { stock_level: stockLevel })
};

export const orderService = {
  // Méthodes pour les commandes
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
    items: CartItem[],
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
    const orderItems = [];
    for (const item of data.items) {
      const orderItemResult = await createCollection('order_items').create({
        order_id: orderResult.data.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.price,
        options: JSON.stringify(item.options || [])
      });
      
      if (orderItemResult.error) {
        return orderItemResult;
      }
      
      orderItems.push(orderItemResult.data);
    }
    
    // Retourner la commande avec ses articles
    return {
      ...orderResult,
      data: {
        ...orderResult.data,
        items: orderItems
      }
    };
  },
  
  updateOrderStatus: (orderId: string, status: string) => 
    createCollection('orders').update(orderId, { status }),
  
  cancelOrder: (orderId: string, reason: string) => 
    createCollection('orders').update(orderId, { 
      status: 'cancelled',
      cancellation_reason: reason,
      cancelled_at: new Date().toISOString()
    })
};

export const paymentService = {
  // Méthodes pour les paiements
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
        const newWallet = await createCollection('wallets').create({
          user_id: userId,
          balance: 0,
          created_at: new Date().toISOString()
        });
        
        return newWallet;
      }
      
      return walletResult;
    }
    
    return walletResult;
  },
  
  updateWalletBalance: (walletId: string, newBalance: number) => 
    createCollection('wallets').update(walletId, { balance: newBalance })
};

export const deliveryService = {
  // Méthodes pour les livraisons
  getOrderDeliveryStatus: (orderId: string) => 
    createCollection('delivery_tracking').getByField('order_id', orderId),
  
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
  }),
  
  assignDriver: (deliveryId: string, driverId: string) => 
    createCollection('delivery_requests').update(deliveryId, { 
      driver_id: driverId,
      status: 'assigned',
      assigned_at: new Date().toISOString()
    })
};

// Service d'authentification en temps réel
export const realTimeService = {
  subscribeToCollection: (collectionName: string, recordId: string, callback: (data: any) => void) => {
    return pb.collection(collectionName).subscribe(recordId, callback);
  },
  
  unsubscribeFromCollection: (collectionName: string, recordId: string) => {
    pb.collection(collectionName).unsubscribe(recordId);
  }
};

// Export d'un service API unifié
export const api = {
  auth: userService,
  restaurants: restaurantService,
  orders: orderService,
  payments: paymentService,
  delivery: deliveryService,
  realTime: realTimeService
};
