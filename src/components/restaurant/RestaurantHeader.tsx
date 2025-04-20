import { useState } from 'react';
import { Star, Clock, MapPin, Phone, Globe, ShareIcon, Heart, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { Restaurant } from '@/types/restaurant';

interface RestaurantHeaderProps {
  restaurant: Restaurant;
}

const RestaurantHeader = ({ restaurant }: RestaurantHeaderProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showOpeningHours, setShowOpeningHours] = useState(false);

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

  const getWeekSchedule = () => {
    if (!restaurant.business_hours || !restaurant.business_hours.regular) {
      return [];
    }
    
    const days = [
      { key: 'monday', label: 'Lundi' },
      { key: 'tuesday', label: 'Mardi' },
      { key: 'wednesday', label: 'Mercredi' },
      { key: 'thursday', label: 'Jeudi' },
      { key: 'friday', label: 'Vendredi' },
      { key: 'saturday', label: 'Samedi' },
      { key: 'sunday', label: 'Dimanche' },
    ];
    
    return days.map(day => {
      const hours = restaurant.business_hours?.regular[day.key];
      return {
        dayName: day.label,
        hours: hours 
          ? hours.is_closed 
            ? "Fermé" 
            : `${hours.open} - ${hours.close}`
          : "Non renseigné"
      };
    });
  };

  return (
    <div className="w-full">
      <div className="relative h-60 md:h-80 rounded-lg overflow-hidden">
        <img
          src={restaurant.banner_image_url || '/placeholder-restaurant-banner.jpg'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
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
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-gray-300 mb-4">{restaurant.description}</p>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="w-5 h-5" />
              <span>Emplacement</span>
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
                  className="hover:text-white"
                >
                  {restaurant.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-5 h-5" />
                <span>{formatBusinessHours()}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-2 text-gray-300 hover:text-white"
                  onClick={() => setShowOpeningHours(!showOpeningHours)}
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${showOpeningHours ? 'rotate-180' : ''}`} />
                </Button>
              </div>
              
              {showOpeningHours && (
                <div className="mt-2 bg-gray-800 rounded-md p-3 text-sm text-gray-300">
                  <h4 className="font-medium mb-2">Horaires d'ouverture</h4>
                  <div className="space-y-1">
                    {getWeekSchedule().map((day, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="font-medium">{day.dayName}</span>
                        <span>{day.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-white mb-3">Informations pratiques</h3>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {restaurant.is_open ? (
                <Badge className="bg-green-600">Ouvert maintenant</Badge>
              ) : (
                <Badge variant="secondary" className="bg-red-600/80">Fermé</Badge>
              )}
              
              {restaurant.trending && (
                <Badge className="bg-orange-500">Tendance</Badge>
              )}
              
              {restaurant.average_prep_time && (
                <Badge variant="outline">Préparation ~{restaurant.average_prep_time} min</Badge>
              )}
              
              {restaurant.delivery_fee !== undefined && (
                <Badge variant="outline">
                  {restaurant.delivery_fee === 0 ? 'Livraison gratuite' : `Livraison ${restaurant.delivery_fee.toLocaleString()} XAF`}
                </Badge>
              )}
              
              {restaurant.min_order && (
                <div className="flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    Commande min.: {restaurant.min_order.toLocaleString()} XAF
                  </span>
                </div>
              )}
              
              {restaurant.special_features && restaurant.special_features.length > 0 && (
                <div>
                  <h4 className="text-white text-sm font-medium mb-2">Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {restaurant.special_features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-700">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {restaurant.payment_methods && restaurant.payment_methods.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Moyens de paiement</h3>
                  <div className="flex flex-wrap gap-2">
                    {restaurant.payment_methods.map((method) => (
                      <Badge key={method} variant="outline">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {restaurant.estimated_delivery_time && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Clock className="h-4 w-4" />
                  <span>Livraison estimée: {restaurant.estimated_delivery_time} min</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantHeader;
