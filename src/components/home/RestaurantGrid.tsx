import RestaurantCard from "../restaurants/RestaurantCard";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import type { Restaurant } from '@/types/globalTypes';

interface RestaurantGridProps {
  restaurants: Restaurant[];
  isLoading: boolean;
  onRestaurantClick: (id: string) => void;
  columns?: number;
}

export default function RestaurantGrid({
  restaurants,
  isLoading,
  onRestaurantClick,
  columns = 3
}: RestaurantGridProps) {
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="h-[400px] rounded-lg overflow-hidden">
            <Skeleton className="w-full h-48" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!restaurants.length) {
    return (
      <div className="text-center py-12">
        <p className="text-white text-xl">Aucun restaurant ne correspond à vos critères</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}
    >
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          onClick={onRestaurantClick}
        />
      ))}
    </motion.div>
  );
}
