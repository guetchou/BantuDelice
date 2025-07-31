import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MenuItem } from "@/types/restaurant";
import { CartItem } from "@/types/cart";

interface MenuRecommendationsProps {
  restaurantId: string;
  currentItem?: MenuItem;
  onAddToCart: (item: CartItem) => void;
}

const MenuRecommendations = ({ restaurantId, currentItem, onAddToCart }: MenuRecommendationsProps) => {
  const [recommendedItems, setRecommendedItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        // Replace with your actual API endpoint for fetching recommendations
        const response = await fetch(`/api/restaurants/${restaurantId}/menu-items/recommendations?exclude=${currentItem?.id}`);
        if (response.ok) {
          const data = await response.json();
          setRecommendedItems(data);
        } else {
          console.error("Failed to fetch recommendations");
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [restaurantId, currentItem]);

  const handleAddToCart = (item: MenuItem) => {
    onAddToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      restaurant_id: item.restaurant_id,
      image_url: item.image_url,
      description: item.description,
      menu_item_id: item.id,
      total: item.price,
      options: []
    });
  };

  const handleAddComboToCart = (item: MenuItem) => {
    onAddToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      restaurant_id: item.restaurant_id,
      image_url: item.image_url,
      description: item.description,
      menu_item_id: item.id,
      total: item.price,
      options: []
    });
  };

  if (isLoading) {
    return <p>Chargement des recommendations...</p>;
  }

  if (!recommendedItems.length) {
    return <p>Aucune recommendation disponible pour le moment.</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Nos Recommandations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendedItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold">{(item.price / 100).toFixed(2)} FCFA </p>
              <Button onClick={() => handleAddToCart(item)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter au panier
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MenuRecommendations;
