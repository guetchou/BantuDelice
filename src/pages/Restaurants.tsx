import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryList from '@/components/restaurants/CategoryList';
import RestaurantGrid from '@/components/restaurants/RestaurantGrid';
import RestaurantFilters from '@/components/restaurants/RestaurantFilters';
import SearchBar from '@/components/home/SearchBar';
import { ChefHat, Coffee, Pizza, Soup, UtensilsCrossed } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  { id: 'Tout', label: 'Tout', icon: ChefHat },
  { id: 'Congolais', label: 'Congolais', icon: UtensilsCrossed },
  { id: 'Africain', label: 'Africain', icon: Soup },
  { id: 'International', label: 'International', icon: Pizza },
  { id: 'Café', label: 'Café', icon: Coffee }
];

const Restaurants = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2 text-white">
            Restaurants à Brazzaville
          </h1>
          <p className="text-gray-400 mb-8">
            Découvrez les meilleurs restaurants de la ville
          </p>
        </motion.div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <RestaurantFilters
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>

        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
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