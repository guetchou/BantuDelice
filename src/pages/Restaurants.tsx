import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryList from '@/components/restaurants/CategoryList';
import RestaurantGrid from '@/components/restaurants/RestaurantGrid';
import RestaurantFilters from '@/components/restaurants/RestaurantFilters';
import SearchBar from '@/components/home/SearchBar';
import { ChefHat } from 'lucide-react';

const categories = [
  { id: 'Tout', label: 'Tout', icon: ChefHat },
  { id: 'Congolais', label: 'Congolais', icon: ChefHat },
  { id: 'Africain', label: 'Africain', icon: ChefHat },
  { id: 'International', label: 'International', icon: ChefHat }
];

const Restaurants = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Restaurants</h1>
        
        <div className="mb-6">
          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <RestaurantFilters
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <RestaurantGrid
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          priceRange={priceRange}
          sortBy={sortBy}
        />
      </div>
    </div>
  );
};

export default Restaurants;