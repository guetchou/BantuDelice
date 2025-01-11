import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Restaurant {
  id: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
}

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*");

      if (error) throw error;
      setRestaurants(data || []);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les restaurants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Restaurants à proximité</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{restaurant.address}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>25-35 min</span>
                  <Star className="w-4 h-4 ml-4 mr-1 text-yellow-400" />
                  <span>4.5</span>
                </div>
              </div>
            </div>
            <Button 
              className="w-full"
              onClick={() => navigate(`/restaurant/${restaurant.id}/menu`)}
            >
              Voir le menu
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Restaurants;