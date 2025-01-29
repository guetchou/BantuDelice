import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryList from '@/components/restaurants/CategoryList';
import RestaurantGrid from '@/components/restaurants/RestaurantGrid';
import RestaurantFilters from '@/components/restaurants/RestaurantFilters';
import SearchBar from '@/components/home/SearchBar';

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
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Rechercher un restaurant..."
          />
        </div>

        <CategoryList
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <RestaurantFilters
          priceRange={priceRange}
          sortBy={sortBy}
          onPriceRangeChange={setPriceRange}
          onSortByChange={setSortBy}
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