import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Restaurant, MenuItem } from "@/types/restaurant";
import { CartItem } from "@/types/cart";

interface RecommendationSectionProps {
  restaurant: Restaurant;
  onAddToCart: (item: CartItem) => void;
}

const RecommendationSection = ({ restaurant, onAddToCart }: RecommendationSectionProps) => {
  const [recommendedItems, setRecommendedItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    // Simulating fetching recommended items based on the restaurant
    // In a real application, you would fetch this data from an API
    const fetchRecommendedItems = async () => {
      // Replace this with your actual API call
      const items = restaurant.menu_items?.slice(0, 4) || [];
      setRecommendedItems(items);
    };

    fetchRecommendedItems();
  }, [restaurant]);

  const handleAddToCart = (item: MenuItem) => {
    onAddToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
      description: item.description,
      restaurant_id: item.restaurant_id,
      quantity: 1,
      menu_item_id: item.id,
      total: item.price,
      options: []
    });
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Nos Recommandations</CardTitle>
        <CardDescription>Découvrez nos suggestions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {recommendedItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{(item.price / 100).toFixed(2)} FCFA </p>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => handleAddToCart(item)}
                >
                  <Plus className="h-4 w-4 mr-2" /> Ajouter
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationSection;
