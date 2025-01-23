import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const restaurants = [
  {
    id: 1,
    name: 'Le Petit Kinois',
    time: '25 min',
    address: 'Avenue du Commerce 123, Brazzaville',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5'
  },
  {
    id: 2,
    name: 'Saveurs Congolaises',
    time: '30 min',
    address: 'Boulevard Lumumba 456, Brazzaville',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0'
  },
  {
    id: 3,
    name: 'La Table Gourmande',
    time: '20 min',
    address: 'Rue de la Paix 789, Brazzaville',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'
  }
];

export default function RestaurantCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative py-8">
      <h2 className="text-2xl font-bold mb-6 text-white">Restaurants Populaires</h2>
      
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {restaurants.map((restaurant) => (
            <Card 
              key={restaurant.id}
              className="flex-none w-80 overflow-hidden bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {restaurant.name}
                </h3>
                <div className="flex items-center text-gray-200 mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{restaurant.time}</span>
                </div>
                <div className="flex items-center text-gray-200">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{restaurant.address}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}