
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { restaurantApi } from '@/integrations/api/restaurants';
import { MenuItem } from '@/types/restaurant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const MenuManagement = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');

  useEffect(() => {
    if (restaurantId) {
      fetchMenuItems();
    }
  }, [restaurantId]);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const response = await restaurantApi.getMenuItems(restaurantId);
      if (Array.isArray(response)) {
        setMenuItems(response);
      } else if (response && Array.isArray(response.data)) {
        setMenuItems(response.data);
      } else {
        setMenuItems([]);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilityChange = async (itemId: string, available: boolean) => {
    try {
      await restaurantApi.updateMenuItemAvailability(itemId, available);
      setMenuItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, available } : item
        )
      );
      toast.success(`Item ${itemId} availability updated`);
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Failed to update availability');
    }
  };

  const handleStockChange = async (itemId: string, stock: number) => {
    try {
      await restaurantApi.updateMenuItemStock(itemId, stock);
      setMenuItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, stock } : item
        )
      );
      toast.success(`Item ${itemId} stock updated`);
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock');
    }
  };

  const handleAddItem = async () => {
    // Implement logic to add a new item
    console.log('Adding new item:', {
      name: newItemName,
      price: newItemPrice,
      description: newItemDescription,
      category: newItemCategory
    });
    // After successful addition, refresh the menu items
    fetchMenuItems();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Menu Management</h1>

      {loading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Price: ${item.price}</p>
                <p>Category: {item.category}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Label htmlFor={`available-${item.id}`}>Available:</Label>
                  <Input
                    type="checkbox"
                    id={`available-${item.id}`}
                    checked={item.available}
                    onChange={(e) => handleAvailabilityChange(item.id, e.target.checked)}
                  />
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Label htmlFor={`stock-${item.id}`}>Stock:</Label>
                  <Input
                    type="number"
                    id={`stock-${item.id}`}
                    value={item.stock}
                    onChange={(e) => handleStockChange(item.id, Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Add New Item</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="newItemName">Name:</Label>
            <Input
              type="text"
              id="newItemName"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="newItemPrice">Price:</Label>
            <Input
              type="number"
              id="newItemPrice"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="newItemDescription">Description:</Label>
            <Input
              type="text"
              id="newItemDescription"
              value={newItemDescription}
              onChange={(e) => setNewItemDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="newItemCategory">Category:</Label>
            <Input
              type="text"
              id="newItemCategory"
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
            />
          </div>
        </div>
        <Button className="mt-4" onClick={handleAddItem}>
          Add Item
        </Button>
      </div>
    </div>
  );
};

export default MenuManagement;
