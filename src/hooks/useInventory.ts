
import { useState, useEffect } from 'react';

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
        
        // Simulating API call with timeout
        setTimeout(() => {
          // Mock data
          const mockInventory: InventoryLevel[] = [
            {
              id: '1',
              menu_item_id: 'menu-1',
              current_stock: 50,
              reserved_stock: 5,
              min_stock_level: 10
            },
            {
              id: '2',
              menu_item_id: 'menu-2',
              current_stock: 20,
              reserved_stock: 2,
              min_stock_level: 5
            }
          ];
          
          setInventoryLevels(mockInventory);
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
