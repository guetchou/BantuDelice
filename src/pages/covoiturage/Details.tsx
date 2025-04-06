
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';
import { useAppNavigation } from '@/utils/navigation';
import { Calendar, Clock, MapPin, Users, Star, Phone, MessageCircle, CreditCard, User, Car, ChevronLeft, Shield } from 'lucide-react';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import SEO from '@/components/SEO';
import RidesharingMap from '@/components/covoiturage/RidesharingMap';

interface Driver {
  id: string;
  name: string;
  rating: number;
  totalRides: number;
  joinDate: string;
  avatarUrl?: string;
  carModel?: string;
  carColor?: string;
  licensePlate?: string;
  verified: boolean;
}

interface Ride {
  id: string;
  type: 'driver' | 'passenger';
  driver: Driver;
  pickup: string;
  destination: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'ongoing';
  price: number;
  availableSeats: number;
  bookedSeats: number;
  pickupCoordinates: [number, number];
  destinationCoordinates: [number, number];
  passengers: {
    id: string;
    name: string;
    avatarUrl?: string;
    pickupPoint: string;
  }[];
  description: string;
  preferences: string[];
}

const RideDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { navigate } = useAppNavigation();
  
  useEffect(() => {
    // Simuler le chargement des détails du trajet depuis une API
    setTimeout(() => {
      // Mock data
      const mockRide: Ride = {
        id: id || "ride1",
        type: 'driver',
        driver: {
          id: "driver1",
          name: "Jean Dupont",
          rating: 4.8,
          totalRides: 124,
          joinDate: "2022-06-15",
          avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=3&w=300&h=300&q=80",
          carModel: "Toyota Corolla",
          carColor: "Bleu",
          licensePlate: "ABC-123",
          verified: true
        },
        pickup: "Gombe, Avenue du Commerce",
        destination: "Bandal, Avenue Wenge",
        date: "2023-10-15",
        time: "08:30",
        status: "upcoming",
        price: 3000,
        availableSeats: 3,
        bookedSeats: 1,
        pickupCoordinates: [15.2986, -4.3089], // Gombe
        destinationCoordinates: [15.3233, -4.3506], // Bandal
        passengers: [
          {
            id: "passenger1",
            name: "Marie Konde",
            avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=3&w=300&h=300&q=80",
            pickupPoint: "Gombe, Rond-point Victoire"
          }
        ],
        description: "Trajet régulier du lundi au vendredi. Je peux faire un petit détour si nécessaire.",
        preferences: ["Non-fumeur", "Pas d'animaux", "Conversation ok"]
      };
      
      setRide(mockRide);
      setLoading(false);
    }, 1000);
  }, [id]);
  
  const handleCancelBooking = () => {
    toast({
      title: "Réservation annulée",
      description: "Votre réservation a été annulée avec succès.",
      variant: "default",
    });
    
    setTimeout(() => {
      navigate('/covoiturage/mes-trajets');
    }, 1500);
  };
  
  const handleContactDriver = () => {
    toast({
      title: "Message envoyé",
      description: "Votre message a été envoyé au conducteur.",
      variant: "default",
    });
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-500">À venir</Badge>;
      case 'ongoing':
        return <Badge className="bg-amber-500">En cours</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Terminé</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Annulé</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-3">Chargement des détails du trajet...</span>
        </div>
      </div>
    );
  }
  
  if (!ride) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Trajet introuvable</h2>
          <p className="mb-6">Le trajet que vous recherchez n'existe pas ou a été supprimé.</p>
          <Button asChild>
            <Link to="/covoiturage">Retour aux trajets</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <SEO 
        title={`Trajet de ${ride.pickup} à ${ride.destination} | Covoiturage Buntudelice`}
        description={`Détails du trajet de covoiturage de ${ride.pickup} à ${ride.destination} le ${formatDate(ride.date)}.`}
        keywords={`covoiturage, trajet, ${ride.pickup}, ${ride.destination}, partage`}
      />
      
      <div className="mb-6">
        <Breadcrumb items={[
          { label: 'Accueil', path: '/' },
          { label: 'Covoiturage', path: '/covoiturage' },
          { label: 'Détails du trajet', path: `/covoiturage/details/${id}` },
        ]} />
        
        <div className="flex items-center mt-4">
          <Button variant="ghost" className="p-0 mr-3" asChild>
            <Link to="/covoiturage">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Retour
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Détails du trajet</h1>
          {getStatusBadge(ride.status)}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Map Section */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle>Itinéraire</CardTitle>
            </CardHeader>
            <CardContent className="p-3 h-[300px]">
              <RidesharingMap
                pickupCoordinates={ride.pickupCoordinates}
                destinationCoordinates={ride.destinationCoordinates}
                onPickupSelect={() => {}}
                onDestinationSelect={() => {}}
                isSelectingPickup={false}
                isSelectingDestination={false}
                routeVisible={true}
              />
            </CardContent>
          </Card>
          
          {/* Ride Details Section */}
          <Card>
            <CardHeader>
              <CardTitle>Détails du trajet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row md:space-x-6">
                <div className="mb-4 md:mb-0 md:w-1/2">
                  <div className="flex items-start mb-6">
                    <div className="min-w-8 mt-1">
                      <div className="w-3 h-3 rounded-full bg-green-500 ring-4 ring-green-100"></div>
                      <div className="w-[2px] h-14 bg-gray-300 mx-auto"></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Point de départ</p>
                      <p className="font-medium">{ride.pickup}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        <Clock className="inline h-3 w-3 mr-1" />
                        {ride.time}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="min-w-8 mt-1">
                      <div className="w-3 h-3 rounded-full bg-red-500 ring-4 ring-red-100"></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Destination</p>
                      <p className="font-medium">{ride.destination}</p>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <p className="text-sm text-gray-500">Date</p>
                    </div>
                    <p className="font-medium">{formatDate(ride.date)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                      <p className="text-sm text-gray-500">Prix par passager</p>
                    </div>
                    <p className="font-medium">{ride.price} XAF</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <p className="text-sm text-gray-500">Places</p>
                    </div>
                    <p className="font-medium">
                      {ride.bookedSeats} réservées / {ride.availableSeats} disponibles
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Car className="h-4 w-4 mr-2 text-gray-500" />
                      <p className="text-sm text-gray-500">Véhicule</p>
                    </div>
                    <p className="font-medium">
                      {ride.driver.carModel} ({ride.driver.carColor})
                    </p>
                  </div>
                </div>
              </div>
              
              {ride.description && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-medium mb-2">Description</p>
                  <p className="text-gray-700">{ride.description}</p>
                </div>
              )}
              
              {ride.preferences && ride.preferences.length > 0 && (
                <div>
                  <p className="font-medium mb-2">Préférences</p>
                  <div className="flex flex-wrap gap-2">
                    {ride.preferences.map((preference, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-100">
                        {preference}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Passengers Section */}
          <Card>
            <CardHeader>
              <CardTitle>Passagers ({ride.passengers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {ride.passengers.length === 0 ? (
                <p className="text-gray-500">Aucun passager pour le moment.</p>
              ) : (
                <div className="space-y-4">
                  {ride.passengers.map(passenger => (
                    <div key={passenger.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={passenger.avatarUrl} alt={passenger.name} />
                          <AvatarFallback>{passenger.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{passenger.name}</p>
                          <p className="text-sm text-gray-500">
                            <MapPin className="inline h-3 w-3 mr-1" />
                            {passenger.pickupPoint}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            {ride.type === 'driver' && ride.status === 'upcoming' && ride.availableSeats > ride.bookedSeats && (
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to={`/covoiturage/invite/${ride.id}`}>
                    <Users className="mr-2 h-4 w-4" />
                    Inviter des passagers
                  </Link>
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Driver Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>{ride.type === 'driver' ? 'Conducteur' : 'Passager'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarImage src={ride.driver.avatarUrl} alt={ride.driver.name} />
                  <AvatarFallback>{ride.driver.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <p className="font-medium text-lg">{ride.driver.name}</p>
                    {ride.driver.verified && (
                      <Shield className="h-4 w-4 ml-1 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="mr-1">{ride.driver.rating}</span>
                    <span className="text-sm text-gray-500">({ride.driver.totalRides} trajets)</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Membre depuis {new Date(ride.driver.joinDate).getFullYear()}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium mb-2">Véhicule</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Modèle</p>
                    <p>{ride.driver.carModel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Couleur</p>
                    <p>{ride.driver.carColor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Plaque</p>
                    <p>{ride.driver.licensePlate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex space-x-3">
              <Button className="flex-1" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Appeler
              </Button>
              <Button className="flex-1" onClick={handleContactDriver}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
            </CardFooter>
          </Card>
          
          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ride.status === 'upcoming' && (
                <Button 
                  variant="destructive" 
                  className="w-full mb-3"
                  onClick={handleCancelBooking}
                >
                  Annuler la réservation
                </Button>
              )}
              
              {ride.status === 'ongoing' && (
                <div className="bg-blue-50 p-4 rounded-lg mb-3 text-center">
                  <p className="font-medium text-blue-700">Trajet en cours</p>
                  <p className="text-sm text-blue-600 mt-1">
                    Le conducteur est en route. Suivez sa progression sur la carte.
                  </p>
                </div>
              )}
              
              {ride.status === 'completed' && (
                <div className="bg-green-50 p-4 rounded-lg mb-3 text-center">
                  <p className="font-medium text-green-700">Trajet terminé</p>
                  <p className="text-sm text-green-600 mt-1">
                    Ce trajet a été effectué le {formatDate(ride.date)}.
                  </p>
                </div>
              )}
              
              <Button asChild className="w-full" variant="outline">
                <Link to={`/covoiturage/partager/${ride.id}`}>
                  Partager ce trajet
                </Link>
              </Button>
              
              <Button asChild className="w-full" variant="outline">
                <Link to="/support">
                  Contacter le support
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RideDetails;
