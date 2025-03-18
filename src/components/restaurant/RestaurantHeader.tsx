
import { useState } from 'react';
import { Star, Clock, MapPin, Phone, Globe, ShareIcon, Heart, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import type { Restaurant } from '@/types/restaurant';

interface RestaurantHeaderProps {
  restaurant: Restaurant;
}

const RestaurantHeader = ({ restaurant }: RestaurantHeaderProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: !isFavorite ? "Ajouté aux favoris" : "Retiré des favoris",
      description: !isFavorite 
        ? `${restaurant.name} a été ajouté à vos favoris` 
        : `${restaurant.name} a été retiré de vos favoris`,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: restaurant.name,
        text: `Découvrez ${restaurant.name} sur notre plateforme de restauration!`,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          toast({
            title: "Lien copié",
            description: "Le lien a été copié dans le presse-papiers",
          });
        })
        .catch((error) => {
          console.error('Failed to copy: ', error);
        });
    }
  };

  // Format business hours for display
  const formatBusinessHours = () => {
    if (!restaurant.business_hours || !restaurant.business_hours.regular) {
      return "Horaires non disponibles";
    }
    
    const now = new Date();
    const dayName = now.toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase();
    const hours = restaurant.business_hours.regular[dayName];
    
    if (!hours) return "Horaires non disponibles";
    
    if (hours.is_closed) return "Fermé aujourd'hui";
    
    return `${hours.open} - ${hours.close}`;
  };

  return (
    <div className="w-full">
      <div className="relative h-60 md:h-80 rounded-lg overflow-hidden">
        {/* Banner Image */}
        <img
          src={restaurant.banner_image_url || '/placeholder-restaurant-banner.jpg'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        {/* Restaurant Logo */}
        <div className="absolute left-6 bottom-6 flex items-end gap-4">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-lg overflow-hidden border-4 border-white shadow-lg">
            <img
              src={restaurant.logo_url || '/placeholder-restaurant-logo.jpg'}
              alt={`Logo ${restaurant.name}`}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="text-white">
            <h1 className="text-2xl md:text-3xl font-bold">{restaurant.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              {typeof restaurant.cuisine_type === 'string' ? (
                <Badge variant="secondary" className="bg-black/30 backdrop-blur-sm">{restaurant.cuisine_type}</Badge>
              ) : (
                restaurant.cuisine_type?.map((cuisine, index) => (
                  <Badge key={index} variant="secondary" className="bg-black/30 backdrop-blur-sm">{cuisine}</Badge>
                ))
              )}
              
              {restaurant.rating && (
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span>{restaurant.rating.toFixed(1)}</span>
                  {restaurant.total_ratings && (
                    <span className="text-gray-300 text-sm ml-1">({restaurant.total_ratings})</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-black/20 backdrop-blur-sm text-white hover:bg-black/40"
            onClick={handleFavoriteClick}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-black/20 backdrop-blur-sm text-white hover:bg-black/40"
            onClick={handleShare}
          >
            <ShareIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {/* Restaurant details below banner */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-gray-300 mb-4">{restaurant.description}</p>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="w-5 h-5" />
              <span>{restaurant.address}</span>
            </div>
            
            {restaurant.phone && (
              <div className="flex items-center gap-2 text-gray-300">
                <Phone className="w-5 h-5" />
                <a href={`tel:${restaurant.phone}`} className="hover:text-white">
                  {restaurant.phone}
                </a>
              </div>
            )}
            
            {restaurant.website && (
              <div className="flex items-center gap-2 text-gray-300">
                <Globe className="w-5 h-5" />
                <a 
                  href={restaurant.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white truncate"
                >
                  {restaurant.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Horaires d'ouverture</h3>
              <div className={`px-2 py-1 rounded text-xs ${restaurant.is_open ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {restaurant.is_open ? 'Ouvert' : 'Fermé'}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="w-5 h-5" />
              <span>Aujourd'hui: {formatBusinessHours()}</span>
            </div>
            
            <Button variant="ghost" className="flex items-center mt-2 text-sm text-gray-400">
              Voir tous les horaires
              <ChevronDown className="ml-1 w-4 h-4" />
            </Button>
            
            {restaurant.minimum_order > 0 && (
              <div className="mt-2 text-sm text-gray-300">
                Commande minimum: {restaurant.minimum_order.toLocaleString()} XAF
              </div>
            )}
            
            {typeof restaurant.delivery_fee !== 'undefined' && (
              <div className="mt-1 text-sm text-gray-300">
                Frais de livraison: {restaurant.delivery_fee === 0 
                  ? 'Gratuit' 
                  : `${restaurant.delivery_fee.toLocaleString()} XAF`
                }
              </div>
            )}
            
            {restaurant.average_prep_time && (
              <div className="mt-1 text-sm text-gray-300">
                Temps de préparation moyen: {restaurant.average_prep_time} min
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantHeader;
