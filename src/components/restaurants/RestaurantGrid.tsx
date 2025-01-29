import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import RestaurantCard from "./RestaurantCard";

interface RestaurantGridProps {
  searchQuery: string;
  selectedCategory: string;
  priceRange: string;
  sortBy: string;
}

const RestaurantGrid = ({ searchQuery, selectedCategory, priceRange, sortBy }: RestaurantGridProps) => {
  const navigate = useNavigate();

  const { data: restaurants, isLoading } = useQuery({
    queryKey: ["restaurants", searchQuery, selectedCategory, priceRange, sortBy],
    queryFn: async () => {
      let query = supabase
        .from("restaurants")
        .select("*");

      if (searchQuery) {
        query = query.textSearch("search_vector", searchQuery);
      }

      if (selectedCategory !== "Tout") {
        query = query.eq("cuisine_type", selectedCategory);
      }

      if (priceRange !== "all") {
        // Add price range filter logic here
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Chargement des restaurants...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants?.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          onClick={(id) => navigate(`/menu/${id}`)}
        />
      ))}
    </div>
  );
};

export default RestaurantGrid;