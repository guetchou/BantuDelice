
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useAppNavigation } from '@/utils/navigation';
import { ChevronRight, Calendar, Clock, MapPin, Users, PlusCircle, AlertTriangle, Car, CreditCard } from 'lucide-react';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import SEO from '@/components/SEO';

interface Ride {
  id: string;
  type: 'driver' | 'passenger';
  pickup: string;
  destination: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  price: number;
  availableSeats?: number;
  bookedSeats?: number;
  passengerCount?: number;
}

const MyRides: React.FC = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const { navigate } = useAppNavigation();
  
  useEffect(() => {
    // Simuler le chargement des trajets depuis un API
    setTimeout(() => {
      const mockRides: Ride[] = [
        {
          id: "ride1",
          type: 'driver',
          pickup: "Gombe, Avenue du Commerce",
          destination: "Bandal, Avenue Wenge",
          date: "2023-10-15",
          time: "08:30",
          status: "upcoming",
          price: 3000,
          availableSeats: 3,
          bookedSeats: 1
        },
        {
          id: "ride2",
          type: 'passenger',
          pickup: "Lemba, UNIKIN",
          destination: "Centre-ville",
          date: "2023-10-17",
          time: "17:15",
          status: "upcoming",
          price: 2500,
          passengerCount: 2
        },
        {
          id: "ride3",
          type: 'driver',
          pickup: "Aéroport de N'Djili",
          destination: "Hôtel Memling",
          date: "2023-10-10",
          time: "14:00",
          status: "completed",
          price: 5000,
          availableSeats: 4,
          bookedSeats: 4
        },
        {
          id: "ride4",
          type: 'passenger',
          pickup: "Matete",
          destination: "Kintambo",
          date: "2023-10-08",
          time: "09:45",
          status: "cancelled",
          price: 2000,
          passengerCount: 1
        },
      ];
      
      setRides(mockRides);
      setLoading(false);
    }, 1000);
  }, []);
  
  const filteredRides = rides.filter(ride => {
    if (activeTab === "upcoming") return ride.status === "upcoming";
    if (activeTab === "completed") return ride.status === "completed";
    if (activeTab === "cancelled") return ride.status === "cancelled";
    return true;
  });
  
  const handleCancelRide = (rideId: string) => {
    // Simule une annulation de trajet
    setRides(rides.map(ride => 
      ride.id === rideId ? { ...ride, status: 'cancelled' } : ride
    ));
    
    toast({
      title: "Trajet annulé",
      description: "Votre trajet a été annulé avec succès.",
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
      case 'completed':
        return <Badge className="bg-green-500">Terminé</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Annulé</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <SEO 
        title="Mes trajets de covoiturage | Buntudelice"
        description="Gérez vos trajets de covoiturage, consultez vos réservations et votre historique."
        keywords="covoiturage, trajets, réservations, historique, Brazzaville"
      />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <Breadcrumb items={[
            { label: 'Accueil', path: '/' },
            { label: 'Covoiturage', path: '/covoiturage' },
            { label: 'Mes trajets', path: '/covoiturage/mes-trajets' },
          ]} />
          
          <h1 className="text-2xl font-bold mt-4">Mes trajets</h1>
        </div>
        
        <Button asChild>
          <Link to="/covoiturage" className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouveau trajet
          </Link>
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="upcoming">À venir</TabsTrigger>
          <TabsTrigger value="completed">Terminés</TabsTrigger>
          <TabsTrigger value="cancelled">Annulés</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <span className="ml-3">Chargement...</span>
            </div>
          ) : filteredRides.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700">Aucun trajet trouvé</h3>
              <p className="text-gray-500 mt-2">
                Vous n'avez pas de trajet {activeTab === "upcoming" ? "à venir" : activeTab === "completed" ? "terminé" : "annulé"}.
              </p>
              <Button className="mt-4" asChild>
                <Link to="/covoiturage">Trouver ou publier un trajet</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredRides.map((ride) => (
                <Card key={ride.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 flex-row justify-between items-center py-4">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full ${ride.type === 'driver' ? 'bg-primary/10' : 'bg-orange-100'} mr-3`}>
                        {ride.type === 'driver' ? (
                          <Car className="h-5 w-5 text-primary" />
                        ) : (
                          <Users className="h-5 w-5 text-orange-500" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {ride.type === 'driver' ? 'Conducteur' : 'Passager'}
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          Trajet #{ride.id.substring(ride.id.length - 4)}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(ride.status)}
                  </CardHeader>
                  
                  <CardContent className="py-4">
                    <div className="mb-4">
                      <div className="flex items-start mb-3">
                        <div className="min-w-8 mt-1">
                          <div className="w-2 h-2 rounded-full bg-green-500 mx-auto"></div>
                          <div className="w-[1px] h-12 bg-gray-300 mx-auto"></div>
                        </div>
                        <div className="ml-2">
                          <p className="text-sm text-gray-500">Point de départ</p>
                          <p className="font-medium">{ride.pickup}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="min-w-8 mt-1">
                          <div className="w-2 h-2 rounded-full bg-red-500 mx-auto"></div>
                        </div>
                        <div className="ml-2">
                          <p className="text-sm text-gray-500">Destination</p>
                          <p className="font-medium">{ride.destination}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">{formatDate(ride.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">{ride.time}</span>
                      </div>
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">{ride.price} XAF</span>
                      </div>
                    </div>
                    
                    {ride.type === 'driver' && (
                      <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm">
                          <span className="font-medium">Places réservées:</span> {ride.bookedSeats}/{ride.availableSeats}
                        </p>
                      </div>
                    )}
                    
                    {ride.type === 'passenger' && ride.passengerCount && (
                      <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm">
                          <span className="font-medium">Nombre de passagers:</span> {ride.passengerCount}
                        </p>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="bg-gray-50 justify-between">
                    {ride.status === "upcoming" && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCancelRide(ride.id)}
                        >
                          Annuler
                        </Button>
                        <Button size="sm" asChild>
                          <Link to={`/covoiturage/details/${ride.id}`}>
                            Détails
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </>
                    )}
                    
                    {ride.status === "completed" && (
                      <Button size="sm" className="ml-auto" asChild>
                        <Link to={`/covoiturage/details/${ride.id}`}>
                          Voir détails
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    
                    {ride.status === "cancelled" && (
                      <Button size="sm" className="ml-auto" asChild>
                        <Link to="/covoiturage">
                          Publier à nouveau
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyRides;
