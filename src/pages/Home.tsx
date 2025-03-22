
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Star, Clock, TrendingUp, Award, Heart } from 'lucide-react';

const Home: React.FC = () => {
  const popularRestaurants = [
    { id: '1', name: 'Restaurant Africain', cuisine: 'Africaine', rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=387&ixlib=rb-4.0.3' },
    { id: '2', name: 'Chez Bunturise', cuisine: 'Fusion', rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1160&ixlib=rb-4.0.3' },
    { id: '3', name: 'Saveurs Exotiques', cuisine: 'Créole', rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&q=80&w=1170&ixlib=rb-4.0.3' },
    { id: '4', name: 'Délices du Congo', cuisine: 'Congolaise', rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&q=80&w=1935&ixlib=rb-4.0.3' },
  ];

  const popularDishes = [
    { id: '1', name: 'Poulet Yassa', restaurant: 'Restaurant Africain', price: 1299, imageUrl: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&q=80&w=1935&ixlib=rb-4.0.3' },
    { id: '2', name: 'Mafé', restaurant: 'Chez Bunturise', price: 1499, imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3' },
    { id: '3', name: 'Thieboudienne', restaurant: 'Saveurs Exotiques', price: 1699, imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3' },
  ];

  const services = [
    { icon: <MapPin className="h-6 w-6" />, title: 'Livraison rapide', description: 'Vos plats africains livrés en 30 minutes' },
    { icon: <Star className="h-6 w-6" />, title: 'Restaurants de qualité', description: 'Cuisiniers africains authentiques' },
    { icon: <Clock className="h-6 w-6" />, title: 'Commande facile', description: 'Commandez en quelques clics sur notre application' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-orange-400 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold text-white mb-4 md:text-5xl lg:text-6xl animate-fade-in">
              Savourez l'Afrique <br/>à votre porte
            </h1>
            <p className="text-lg text-white/90 mb-8 max-w-lg">
              Découvrez les meilleurs restaurants africains et commandez facilement vos plats préférés.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-white/90">
                <Link to="/restaurants">Explorer les restaurants</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link to="/specialties">Découvrir les spécialités</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir Buntudelice?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 mb-4">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Popular Restaurants Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Restaurants populaires</h2>
            <Link to="/restaurants" className="text-orange-500 hover:text-orange-600 font-medium">
              Voir tout →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularRestaurants.map((restaurant) => (
              <Link key={restaurant.id} to={`/restaurants/${restaurant.id}`}>
                <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all hover:-translate-y-1 duration-200">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={restaurant.imageUrl} 
                      alt={restaurant.name} 
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-semibold">{restaurant.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                        <span className="text-sm font-medium">{restaurant.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Popular Dishes Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Plats tendance</h2>
            <Link to="/specialties" className="text-orange-500 hover:text-orange-600 font-medium">
              Voir tout →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularDishes.map((dish) => (
              <div key={dish.id} className="rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-all hover:-translate-y-1 duration-200">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={dish.imageUrl} 
                    alt={dish.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 right-0 m-3">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/90 hover:bg-white">
                      <Heart className="h-4 w-4 text-orange-500" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{dish.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{dish.restaurant}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-orange-500">{(dish.price / 100).toFixed(2)} €</span>
                    <Button variant="outline" size="sm" className="text-xs">
                      Commander
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:max-w-lg">
              <h2 className="text-3xl font-bold mb-4">Téléchargez notre application</h2>
              <p className="text-white/90 mb-6">
                Commandez facilement, suivez vos livraisons en temps réel et bénéficiez d'offres exclusives. Téléchargez notre application dès maintenant !
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-white text-orange-600 hover:bg-white/90">
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.707,9.293l-5-5c-0.391-0.391-1.023-0.391-1.414,0l-5,5c-0.391,0.391-0.391,1.023,0,1.414 s1.023,0.391,1.414,0L12,7.414l4.293,4.293C16.488,11.902,16.744,12,17,12s0.512-0.098,0.707-0.293 C18.098,11.316,18.098,10.684,17.707,9.293z"/>
                        <path d="M12,18c-0.553,0-1-0.447-1-1V8c0-0.553,0.447-1,1-1s1,0.447,1,1v9C13,17.553,12.553,18,12,18z"/>
                      </svg>
                      App Store
                    </span>
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3,20.5C3,21.3 3.8,22 4.5,22H6V10H3V20.5M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z"/>
                      </svg>
                      Play Store
                    </span>
                  </a>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-64 h-96 bg-black rounded-3xl border-8 border-gray-900 shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 opacity-90"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-white z-10">
                  <h3 className="text-xl font-bold mb-2">Buntudelice</h3>
                  <p className="text-sm text-center mb-4">Votre app de livraison de cuisine africaine</p>
                  <div className="w-full h-40 bg-white/10 backdrop-blur-sm rounded-lg mb-4"></div>
                  <div className="w-full h-12 bg-white/10 backdrop-blur-sm rounded-lg mb-2"></div>
                  <div className="w-full h-12 bg-white/10 backdrop-blur-sm rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
