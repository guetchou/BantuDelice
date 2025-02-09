
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryList from '@/components/restaurants/CategoryList';
import RestaurantGrid from '@/components/restaurants/RestaurantGrid';
import RestaurantFilters from '@/components/restaurants/RestaurantFilters';
import SearchBar from '@/components/home/SearchBar';
import { ChefHat, Coffee, Pizza, Soup, UtensilsCrossed, TrendingUp, Star, Clock, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const categories = [
  { id: 'Tout', label: 'Tout', icon: ChefHat },
  { id: 'Congolais', label: 'Congolais', icon: UtensilsCrossed },
  { id: 'Africain', label: 'Africain', icon: Soup },
  { id: 'International', label: 'International', icon: Pizza },
  { id: 'Café', label: 'Café', icon: Coffee }
];

const highlights = [
  {
    title: "Restaurants Populaires",
    description: "Découvrez les restaurants les mieux notés",
    icon: Star,
    color: "text-yellow-500"
  },
  {
    title: "Tendances",
    description: "Les restaurants qui font le buzz",
    icon: TrendingUp,
    color: "text-blue-500"
  },
  {
    title: "Livraison Rapide",
    description: "Moins de 30 minutes",
    icon: Clock,
    color: "text-green-500"
  },
  {
    title: "Favoris",
    description: "Vos restaurants préférés",
    icon: Heart,
    color: "text-red-500"
  }
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
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Restaurants à Brazzaville
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Découvrez une sélection unique de restaurants, des saveurs locales aux cuisines internationales
          </p>
        </motion.div>

        {/* Highlights Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {highlights.map((highlight, index) => (
            <motion.div
              key={highlight.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white/5 backdrop-blur-lg border-gray-800 hover:bg-white/10 transition-all duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <highlight.icon className={`w-8 h-8 ${highlight.color}`} />
                  <div>
                    <CardTitle className="text-white">{highlight.title}</CardTitle>
                    <p className="text-sm text-gray-400">{highlight.description}</p>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
        
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <RestaurantGrid
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            priceRange={priceRange}
            sortBy={sortBy}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Restaurants;
