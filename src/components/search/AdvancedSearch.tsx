import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFilters {
  query: string;
  category: string;
  priceRange: string;
  rating: string;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
}

const AdvancedSearch = ({ onSearch }: AdvancedSearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    priceRange: 'all',
    rating: 'all'
  });

  const handleSearch = () => {
    console.log('Searching with filters:', filters);
    onSearch(filters);
  };

  return (
    <div className="p-4 space-y-4 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          placeholder="Rechercher..."
          value={filters.query}
          onChange={(e) => setFilters({ ...filters, query: e.target.value })}
          className="bg-white/10 border-white/20"
        />
        
        <Select
          value={filters.category}
          onValueChange={(value) => setFilters({ ...filters, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            <SelectItem value="restaurant">Restaurants</SelectItem>
            <SelectItem value="plat">Plats</SelectItem>
            <SelectItem value="service">Services</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.priceRange}
          onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Prix" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les prix</SelectItem>
            <SelectItem value="low">FCFA  (&lt; 5000 FCFA)</SelectItem>
            <SelectItem value="medium">FCFA FCFA  (5000-15000 FCFA)</SelectItem>
            <SelectItem value="high">FCFA FCFA FCFA  (&gt; 15000 FCFA)</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.rating}
          onValueChange={(value) => setFilters({ ...filters, rating: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Note" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les notes</SelectItem>
            <SelectItem value="4">4+ étoiles</SelectItem>
            <SelectItem value="3">3+ étoiles</SelectItem>
            <SelectItem value="2">2+ étoiles</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        onClick={handleSearch}
        className="w-full md:w-auto bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
      >
        Rechercher
      </Button>
    </div>
  );
};

export default AdvancedSearch;