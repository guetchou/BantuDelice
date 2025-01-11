import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
}

const RestaurantMenu = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (restaurantId) {
      fetchMenuItems();
    }
  }, [restaurantId]);

  const fetchMenuItems = async () => {
    try {
      console.log("Fetching menu items for restaurant:", restaurantId);
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .eq("available", true);

      if (error) {
        console.error("Error fetching menu items:", error);
        throw error;
      }
      console.log("Fetched menu items:", data);
      setMenuItems(data || []);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le menu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    // TODO: Implement cart functionality
    toast({
      title: "Ajouté au panier",
      description: `${item.name} a été ajouté à votre panier`,
    });
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Menu</h1>
      {menuItems.length === 0 ? (
        <div className="text-center text-gray-500">Aucun plat disponible</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Card key={item.id} className="p-6">
              <div className="flex flex-col h-full">
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                  {item.description && (
                    <p className="text-gray-600 mb-4">{item.description}</p>
                  )}
                  <p className="text-lg font-medium">
                    {(item.price / 100).toFixed(2)} €
                  </p>
                </div>
                <Button 
                  className="w-full mt-4"
                  onClick={() => addToCart(item)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter au panier
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;