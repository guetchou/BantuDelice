import { useEffect } from "react";
import { Heart } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import FavoritesList from "@/components/favorites/FavoritesList";

export default function Favorites() {
  usePageTitle({ title: "Favoris" });

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <Heart className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Mes favoris</h1>
      </div>
      
      <FavoritesList />
    </div>
  );
}