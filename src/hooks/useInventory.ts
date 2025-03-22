
import { useState, useEffect } from 'react';
import { mockData } from '@/utils/mockData';

interface InventoryLevel {
  id: string;
  menu_item_id: string;
  current_stock: number;
  reserved_stock: number;
  min_stock_level: number;
}

export const useInventory = (restaurantId: string) => {
  const [inventoryLevels, setInventoryLevels] = useState<InventoryLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call with timeout
        setTimeout(() => {
          setInventoryLevels(mockData.inventory_levels as InventoryLevel[]);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching inventory:', error);
        setIsLoading(false);
      }
    };
    
    fetchInventory();
  }, [restaurantId]);

  const updateStock = async ({ itemId, quantity }: { itemId: string, quantity: number }) => {
    try {
      // Simulating API call
      console.log(`Updating stock for item ${itemId} to ${quantity}`);
      
      // Update local state
      setInventoryLevels(prev => 
        prev.map(item => 
          item.menu_item_id === itemId 
            ? { ...item, current_stock: quantity }
            : item
        )
      );
      
      return true;
    } catch (error) {
      console.error('Error updating stock:', error);
      return false;
    }
  };

  return {
    inventoryLevels,
    isLoading,
    updateStock,
  };
};
