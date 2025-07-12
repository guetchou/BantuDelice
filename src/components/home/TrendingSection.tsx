
import React from 'react';

const TrendingSection = () => {
  const trendingItems = [
    {
      id: 1,
      name: 'Poulet Braisé',
      restaurant: 'Le Gourmet Congolais',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1925&auto=format&fit=crop',
      price: '5000 FCFA',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Fufu & Eru',
      restaurant: 'Saveurs d\'Afrique',
      image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=1780&auto=format&fit=crop',
      price: '3500 FCFA',
      rating: 4.6
    },
    {
      id: 3,
      name: 'Maboke',
      restaurant: 'Chez Matou',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1934&auto=format&fit=crop',
      price: '4500 FCFA',
      rating: 4.7
    }
  ];

  return (
    <section className="py-16 bg-white/5 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">À la une</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Découvrez les plats les plus populaires du moment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendingItems.map((item) => (
            <div key={item.id} className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 group">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                  <span className="text-orange-500 font-bold">{item.price}</span>
                </div>
                <p className="text-white/70 text-sm mb-3">{item.restaurant}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="text-white text-sm">{item.rating}</span>
                  </div>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm transition-colors">
                    Commander
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

export default TrendingSection;
