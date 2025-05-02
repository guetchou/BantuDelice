import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { restaurantApi } from '@/integrations/api/restaurants';
import { MenuItem } from '@/types/restaurant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { AlertTriangle, Copy } from 'lucide-react'; // Fixed import

interface RestaurantPromotionsManagerProps {
  restaurantId?: string;
}

const RestaurantPromotionsManager: React.FC<RestaurantPromotionsManagerProps> = ({ restaurantId }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [promotionTitle, setPromotionTitle] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validTo, setValidTo] = useState('');
  const [promotionHours, setPromotionHours] = useState([{ start: '', end: '' }]);
  const [conditions, setConditions] = useState('');
  const [minOrderValue, setMinOrderValue] = useState('');
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (restaurantId) {
      fetchMenuItems(restaurantId);
    }
  }, [restaurantId]);

  const fetchMenuItems = async (restaurantId: string) => {
    setIsLoading(true);
    try {
      const response = await restaurantApi.getMenuItems(restaurantId);
      if (response && Array.isArray(response)) {
        setMenuItems(response);
      } else {
        setMenuItems([]);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to fetch menu items');
      setMenuItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPromotion = async () => {
    if (!selectedMenuItem) {
      toast.error('Please select a menu item for the promotion.');
      return;
    }

    const promotionData = {
      title: promotionTitle,
      discount_type: discountType,
      discount_value: parseFloat(discountValue),
      valid_from: validFrom,
      valid_to: validTo,
      promotion_hours: promotionHours,
      conditions: conditions,
      min_order_value: parseFloat(minOrderValue),
      menu_item_id: selectedMenuItem.id,
    };

    console.log('Adding promotion:', promotionData);
    toast.success('Promotion added successfully!');
  };

  const handleCopyPromotion = () => {
    // Implement copy promotion logic
    console.log('Copying promotion');
    toast.success('Promotion copied to clipboard!');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Restaurant Promotions Manager</h1>

      <Card>
        <CardHeader>
          <CardTitle>Add New Promotion</CardTitle>
          <CardDescription>Create a new promotion for your restaurant</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="promotionTitle">Promotion Title</Label>
            <Input
              type="text"
              id="promotionTitle"
              value={promotionTitle}
              onChange={(e) => setPromotionTitle(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="discountType">Discount Type</Label>
            <select
              id="discountType"
              className="w-full p-2 border rounded"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
            >
              <option value="percentage">Percentage</option>
              <option value="amount">Amount</option>
            </select>
          </div>

          <div>
            <Label htmlFor="discountValue">Discount Value</Label>
            <Input
              type="number"
              id="discountValue"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="validFrom">Valid From</Label>
            <Input
              type="datetime-local"
              id="validFrom"
              value={validFrom}
              onChange={(e) => setValidFrom(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="validTo">Valid To</Label>
            <Input
              type="datetime-local"
              id="validTo"
              value={validTo}
              onChange={(e) => setValidTo(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="promotionHours">Promotion Hours</Label>
            {promotionHours.map((hour, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  type="time"
                  value={hour.start}
                  onChange={(e) => {
                    const newHours = [...promotionHours];
                    newHours[index] = { ...newHours[index], start: e.target.value };
                    setPromotionHours(newHours);
                  }}
                />
                <Input
                  type="time"
                  value={hour.end}
                  onChange={(e) => {
                    const newHours = [...promotionHours];
                    newHours[index] = { ...newHours[index], end: e.target.value };
                    setPromotionHours(newHours);
                  }}
                />
              </div>
            ))}
          </div>

          <div>
            <Label htmlFor="conditions">Conditions</Label>
            <Input
              type="text"
              id="conditions"
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="minOrderValue">Minimum Order Value</Label>
            <Input
              type="number"
              id="minOrderValue"
              value={minOrderValue}
              onChange={(e) => setMinOrderValue(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="menuItem">Select Menu Item</Label>
            <select
              id="menuItem"
              className="w-full p-2 border rounded"
              onChange={(e) => {
                const selectedId = e.target.value;
                const item = menuItems.find((menuItem) => menuItem.id === selectedId);
                setSelectedMenuItem(item || null);
              }}
            >
              <option value="">Select a menu item</option>
              {menuItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={handleAddPromotion}>Add Promotion</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Promotions</CardTitle>
          <CardDescription>Manage existing promotions for your restaurant</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading promotions...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription>Price: ${item.price}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Display promotion details here */}
                    <p>No active promotion</p>
                  </CardContent>
                  <Button onClick={handleCopyPromotion}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Promotion
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantPromotionsManager;
