import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
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
import type { RestaurantFilters } from "@/types/restaurant";

const CUISINE_TYPES = [
  "Tout",
  "Congolais",
  "Africain",
  "International",
  "Fast Food",
  "Café",
  "Végétarien"
];

interface RestaurantFiltersProps {
  filters: RestaurantFilters;
  onChange: (filters: RestaurantFilters) => void;
}

export interface RestaurantFilters {
  cuisine_type?: string | null;
  price_range?: number | null;
  distance?: number | null;
  isOpen?: boolean;
  hasDelivery?: boolean;
}

export default function RestaurantFilters({
  filters,
  onChange
}: RestaurantFiltersProps) {
  const updateFilter = (key: keyof RestaurantFilters, value: any) => {
    onChange({
      ...filters,
      [key]: value
    });
  };

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

        <div className="space-y-6 mt-6">
          <div className="space-y-4">
            <Label>Type de cuisine</Label>
            <Select 
              value={filters.cuisine_type?.[0] || "all"}
              onValueChange={(value) => updateFilter('cuisine_type', value === "all" ? [] : [value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type de cuisine" />
              </SelectTrigger>
              <SelectContent>
                {CUISINE_TYPES.map((type) => (
                  <SelectItem key={type} value={type === "Tout" ? "all" : type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>Gamme de prix</Label>
            <Select 
              value={filters.price_range?.toString() || "all"}
              onValueChange={(value) => updateFilter('price_range', value === "all" ? [] : value)}
            >
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

          <div className="space-y-4">
            <Label>Distance maximum (km)</Label>
            <Slider
              value={[filters.distance || 10]}
              onValueChange={([value]) => updateFilter('distance', value)}
              min={1}
              max={20}
              step={1}
            />
            <div className="text-sm text-gray-500 text-center">
              {filters.distance || 10} km
            </div>
          </div>

          <div className="space-y-4">
            <Label>Note minimum</Label>
            <Slider
              value={[filters.rating || 0]}
              onValueChange={([value]) => updateFilter('rating', value)}
              min={0}
              max={5}
              step={0.5}
            />
            <div className="text-sm text-gray-500 text-center">
              {filters.rating || 0} étoiles
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label>Uniquement restaurants ouverts</Label>
            <Switch
              checked={filters.isOpen}
              onCheckedChange={(checked) => updateFilter('isOpen', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Propose la livraison</Label>
            <Switch
              checked={filters.hasDelivery}
              onCheckedChange={(checked) => updateFilter('hasDelivery', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>À emporter disponible</Label>
            <Switch
              checked={filters.hasPickup}
              onCheckedChange={(checked) => updateFilter('hasPickup', checked)}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
