
import React from 'react';

interface Restaurant {
  id: string;
  name: string;
  cuisine_type: string;
  banner_image_url: string;
  average_rating: number;
  delivery_fee: number;
  average_prep_time: number;
}

interface NearbyRestaurantsSectionProps {
  restaurants: Restaurant[];
}

const NearbyRestaurantsSection: React.FC<NearbyRestaurantsSectionProps> = ({ restaurants }) => {
  return (
    <section className="py-16 bg-white/5 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Restaurants à proximité</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Découvrez les meilleurs restaurants près de chez vous
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 group cursor-pointer">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={restaurant.banner_image_url} 
                  alt={restaurant.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{restaurant.name}</h3>
                <p className="text-white/70 text-sm mb-3">{restaurant.cuisine_type}</p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="text-white text-sm">{restaurant.average_rating}</span>
                  </div>
                  <span className="text-white/70 text-sm">{restaurant.average_prep_time} min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">
                    Livraison: {restaurant.delivery_fee === 0 ? 'Gratuite' : `${restaurant.delivery_fee} FCFA`}
                  </span>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm transition-colors">
                    Voir le menu
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NearbyRestaurantsSection;
