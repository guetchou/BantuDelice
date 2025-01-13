import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RestaurantFiltersProps {
  priceRange: string;
  setPriceRange: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}

const RestaurantFilters = ({
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy
}: RestaurantFiltersProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filtres
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filtres</SheetTitle>
          <SheetDescription>
            Affinez votre recherche de restaurants
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Gamme de prix
            </label>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une gamme de prix" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les prix</SelectItem>
                <SelectItem value="low">€ (Moins de 5000 XAF)</SelectItem>
                <SelectItem value="medium">€€ (5000-15000 XAF)</SelectItem>
                <SelectItem value="high">€€€ (Plus de 15000 XAF)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">
              Trier par
            </label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un critère de tri" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Note</SelectItem>
                <SelectItem value="preparation_time">Temps de préparation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RestaurantFilters;