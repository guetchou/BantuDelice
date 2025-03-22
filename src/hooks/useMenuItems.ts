
import { useState, useEffect } from 'react';
import { mockData } from '@/utils/mockData';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  restaurant_id: string;
  available: boolean;
  created_at: string;
  ingredients?: string[];
  rating?: number;
  preparation_time?: number;
  dietary_preferences?: string[];
  customization_options?: Record<string, any>;
}

export const useMenuItems = (restaurantId: string) => {
  const [data, setData] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Filter menu items by restaurant ID
        const menuItems = mockData.menu_items.filter(
          item => item.restaurant_id === restaurantId
        ) as MenuItem[];
        
        setData(menuItems);
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, [restaurantId]);

  return {
    data,
    isLoading,
    error
  };
};
