
import { useState, useEffect } from 'react';

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
        
        // Mock data
        const mockMenuItems: MenuItem[] = [
          {
            id: '1',
            name: 'Fufu & Poisson',
            description: 'Fufu traditionnel avec poisson braisé',
            price: 5000,
            image_url: '/images/fufu.jpg',
            category: 'Plats principaux',
            restaurant_id: restaurantId,
            available: true,
            created_at: new Date().toISOString(),
            rating: 4.7,
            preparation_time: 25,
            dietary_preferences: ['poisson'],
          },
          {
            id: '2',
            name: 'Saka Saka',
            description: 'Plat de feuilles de manioc avec viande',
            price: 4500,
            image_url: '/images/saka-saka.jpg',
            category: 'Plats principaux',
            restaurant_id: restaurantId,
            available: true,
            created_at: new Date().toISOString(),
            rating: 4.5,
            preparation_time: 30,
            dietary_preferences: ['viande'],
          },
          {
            id: '3',
            name: 'Jus de Gingembre',
            description: 'Boisson rafraîchissante au gingembre',
            price: 1500,
            image_url: '/images/ginger-juice.jpg',
            category: 'Boissons',
            restaurant_id: restaurantId,
            available: true,
            created_at: new Date().toISOString(),
            rating: 4.8,
            preparation_time: 10,
            dietary_preferences: ['végétalien'],
          }
        ];
        
        setData(mockMenuItems);
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
