
import { useState, useEffect } from 'react';

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
  action_link?: string;
  metadata?: Record<string, any>;
}

export const useRealTimeNotifications = (userId?: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock notification data
        const mockNotifications: Notification[] = [
          {
            id: '1',
            user_id: userId,
            message: 'Votre commande a été confirmée',
            type: 'success',
            read: false,
            created_at: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
          },
          {
            id: '2',
            user_id: userId,
            message: 'Nouvelle promotion disponible',
            type: 'info',
            read: true,
            created_at: new Date(Date.now() - 60 * 60000).toISOString(), // 1 hour ago
            action_link: '/promotions',
          }
        ];

        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Simulate real-time notifications with setInterval
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance of new notification
        const newNotification: Notification = {
          id: `new-${Date.now()}`,
          user_id: userId,
          message: 'Nouvelle mise à jour système',
          type: 'info',
          read: false,
          created_at: new Date().toISOString(),
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        console.log('New notification arrived');
      }
    }, 30000); // Check every 30 seconds

    return () => {
      clearInterval(interval);
    };
  }, [userId]);

  const markAsRead = async (notificationId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));

      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error };
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return { success: false };

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);

      return { success: true };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return { success: false, error };
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const deletedNotification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { success: false, error };
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};
