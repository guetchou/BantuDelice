
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Car, User, MapPin, Clock, Users, CreditCard, Search, Star, Plus, Minus, Route, TrendingUp, Leaf, Repeat } from "lucide-react";
import { useRidesharing } from "@/hooks/useRidesharing";
import { RidesharingSearchFilters, RidesharingTrip } from "@/types/ridesharing";
import TripCard from "@/components/ridesharing/TripCard";
import TripSearchForm from "@/components/ridesharing/TripSearchForm";
import CreateTripForm from "@/components/ridesharing/CreateTripForm";
import BookingModal from "@/components/ridesharing/BookingModal";
import RecurringTripsTab from "@/components/ridesharing/RecurringTripsTab";
import { usePageTitle } from '@/hooks/usePageTitle';
import { useUser } from '@/hooks/useUser';

export default function Covoiturage() {
  usePageTitle({ title: "Covoiturage" });
  
  const { user } = useUser();
  const ridesharing = useRidesharing();
  const [activeTab, setActiveTab] = useState("search");
  const [selectedTrip, setSelectedTrip] = useState<RidesharingTrip | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  
  // Mock driver data (in a real app this would come from the backend)
  const driverData = {
    "d1": { name: "Thomas Mbengue", avatar: "https://randomuser.me/api/portraits/men/32.jpg", rating: 4.8, trips: 127 },
    "d2": { name: "Marie Loemba", avatar: "https://randomuser.me/api/portraits/women/44.jpg", rating: 4.9, trips: 89 },
    "d3": { name: "Paul Moukala", avatar: "https://randomuser.me/api/portraits/men/22.jpg", rating: 4.7, trips: 53 },
    "d4": { name: "Sandrine Loubota", avatar: "https://randomuser.me/api/portraits/women/28.jpg", rating: 4.6, trips: 32 },
  };

  // Handle search
  const handleSearch = async (filters: RidesharingSearchFilters) => {
    // Si l'utilisateur recherche des trajets récurrents, aller à l'onglet récurrent
    if (filters.recurringTrip) {
      setActiveTab("recurring");
      await ridesharing.findRecurringTripMatches(filters);
    } else {
      // Sinon, rechercher des trajets normaux
      await ridesharing.searchTrips(filters);
      setActiveTab("results");
    }
  };
  
  // Handle trip creation
  const handleCreateTrip = async (tripData: Omit<RidesharingTrip, 'id' | 'driver_id' | 'status' | 'created_at'>) => {
    const trip = await ridesharing.createTrip(tripData);
    if (trip) {
      if (trip.is_recurring) {
        setActiveTab("recurring");
      } else {
        setActiveTab("myTrips");
      }
      await ridesharing.fetchMyTrips();
    }
  };
  
  // Handle trip booking
  const handleOpenBooking = (trip: RidesharingTrip) => {
    if (!user) {
      toast.error("Vous devez être connecté pour réserver un trajet");
      return;
    }
    setSelectedTrip(trip);
    setBookingModalOpen(true);
  };
  
  const handleBookTrip = async (seatsCount: number, specialRequests?: string, paymentMethod?: string) => {
    if (!selectedTrip) return;
    
    const booking = await ridesharing.bookTrip(selectedTrip.id, seatsCount, specialRequests);
    if (booking) {
      setBookingModalOpen(false);
      setActiveTab("myBookings");
      await ridesharing.fetchMyBookings();
    }
  };
  
  // Handle viewing trip details
  const handleViewTripDetails = (trip: RidesharingTrip) => {
    toast.info("Détails du trajet", {
      description: `${trip.origin_address} → ${trip.destination_address} le ${trip.departure_date}`
    });
    // In a real application, we'd navigate to a trip details page
  };
  
  // Ensure my trips and bookings are loaded
  const loadMyTripsAndBookings = async () => {
    if (user) {
      if (activeTab === "myTrips" && ridesharing.myTrips.length === 0) {
        await ridesharing.fetchMyTrips();
      } else if (activeTab === "myBookings" && ridesharing.myBookings.length === 0) {
        await ridesharing.fetchMyBookings();
      }
    } else {
      toast.error("Vous devez être connecté pour accéder à vos trajets et réservations");
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Covoiturage</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trouvez un trajet partagé ou proposez le vôtre
          </p>
        </motion.div>

        <Card className="mb-10">
          <CardContent className="p-6">
            <Tabs 
              defaultValue="search" 
              value={activeTab} 
              onValueChange={(tab) => {
                setActiveTab(tab);
                if (tab === "myTrips" || tab === "myBookings") {
                  loadMyTripsAndBookings();
                }
              }}
            >
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger value="search">
                  Rechercher
                </TabsTrigger>
                <TabsTrigger value="offer">
                  Proposer
                </TabsTrigger>
                <TabsTrigger value="recurring" className="flex items-center gap-1">
                  <Repeat className="h-4 w-4" />
                  <span>Trajets réguliers</span>
                </TabsTrigger>
                <TabsTrigger value="myTrips">
                  Mes trajets
                </TabsTrigger>
                <TabsTrigger value="myBookings">
                  Mes réservations
                </TabsTrigger>
              </TabsList>

              <TabsContent value="search" className="mt-0">
                <TripSearchForm 
                  onSearch={handleSearch} 
                  isLoading={ridesharing.isLoading}
                />
              </TabsContent>

              <TabsContent value="offer" className="mt-0">
                <CreateTripForm 
                  onCreateTrip={handleCreateTrip} 
                  isLoading={ridesharing.isLoading}
                />
              </TabsContent>
              
              <TabsContent value="recurring" className="mt-0">
                <RecurringTripsTab 
                  onNavigateToSearch={() => setActiveTab("search")}
                  onNavigateToCreate={() => setActiveTab("offer")}
                />
              </TabsContent>

              <TabsContent value="results" className="mt-0">
                {ridesharing.trips.length > 0 ? (
                  <div className="space-y-4">
                    {ridesharing.trips.map(trip => {
                      const driver = driverData[trip.driver_id as keyof typeof driverData];
                      return (
                        <TripCard
                          key={trip.id}
                          trip={trip}
                          driverName={driver?.name || "Chauffeur"}
                          driverAvatar={driver?.avatar}
                          driverRating={driver?.rating || 4.5}
                          totalTrips={driver?.trips || 0}
                          onBookTrip={() => handleOpenBooking(trip)}
                          onViewDetails={() => handleViewTripDetails(trip)}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Car className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Aucun trajet trouvé</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Essayez de modifier vos critères de recherche ou proposez votre propre trajet.
                    </p>
                    <Button 
                      className="mt-6"
                      onClick={() => setActiveTab("offer")}
                    >
                      Proposer un trajet
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="myTrips" className="mt-0">
                {!user ? (
                  <div className="text-center py-12">
                    <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">Vous n'êtes pas connecté</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Connectez-vous pour voir vos trajets.
                    </p>
                    <Button className="mt-6">
                      Se connecter
                    </Button>
                  </div>
                ) : ridesharing.myTrips.length > 0 ? (
                  <div className="space-y-4">
                    {ridesharing.myTrips.map(trip => (
                      <Card key={trip.id} className="overflow-hidden hover:shadow-md transition-all">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant={trip.status === 'active' ? 'default' : 'destructive'}>
                                  {trip.status === 'active' ? 'Actif' : trip.status === 'completed' ? 'Terminé' : 'Annulé'}
                                </Badge>
                                {trip.is_recurring && (
                                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                    <Repeat className="mr-1 h-3 w-3" />
                                    Récurrent
                                  </Badge>
                                )}
                                <span className="text-sm text-gray-500">
                                  ID: {trip.id}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                  <div className="flex items-start mb-2">
                                    <MapPin className="h-5 w-5 text-primary mr-2 mt-1" />
                                    <div>
                                      <p className="text-gray-500 text-sm">Départ</p>
                                      <p className="font-medium">{trip.origin_address}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-start">
                                    <MapPin className="h-5 w-5 text-red-500 mr-2 mt-1" />
                                    <div>
                                      <p className="text-gray-500 text-sm">Arrivée</p>
                                      <p className="font-medium">{trip.destination_address}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="flex items-center mb-1">
                                    <Clock className="h-5 w-5 text-gray-500 mr-2" />
                                    {trip.is_recurring ? (
                                      <span>
                                        {trip.recurrence_pattern?.days_of_week?.map(day => day.substring(0, 3)).join(', ')} à {trip.departure_time}
                                      </span>
                                    ) : (
                                      <span>{trip.departure_date} à {trip.departure_time}</span>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center mb-1">
                                    <Users className="h-5 w-5 text-gray-500 mr-2" />
                                    <span>{trip.available_seats} place(s) disponible(s)</span>
                                  </div>
                                  
                                  <div className="flex items-center mb-1">
                                    <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
                                    <span>{trip.price_per_seat.toLocaleString()} FCFA par personne</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col justify-between mt-4 md:mt-0 md:ml-6">
                              <p className="text-lg font-semibold">{trip.price_per_seat.toLocaleString()} FCFA</p>
                              
                              <div className="flex flex-col space-y-2 mt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewTripDetails(trip)}
                                >
                                  Détails
                                </Button>
                                
                                {trip.status === 'active' && (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={async () => {
                                      const confirmed = window.confirm("Êtes-vous sûr de vouloir annuler ce trajet ?");
                                      if (confirmed) {
                                        await ridesharing.cancelTrip(trip.id);
                                      }
                                    }}
                                  >
                                    Annuler
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">Vous n'avez pas encore proposé de trajets</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Commencez à partager vos trajets et économisez de l'argent tout en réduisant votre empreinte carbone.
                    </p>
                    <Button 
                      className="mt-6"
                      onClick={() => setActiveTab("offer")}
                    >
                      Proposer un trajet
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="myBookings" className="mt-0">
                {!user ? (
                  <div className="text-center py-12">
                    <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">Vous n'êtes pas connecté</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Connectez-vous pour voir vos réservations.
                    </p>
                    <Button className="mt-6">
                      Se connecter
                    </Button>
                  </div>
                ) : ridesharing.myBookings.length > 0 ? (
                  <div className="space-y-4">
                    {ridesharing.myBookings.map(booking => {
                      const trip = booking.trip;
                      const driver = driverData[trip.driver_id as keyof typeof driverData];
                      
                      return (
                        <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-all">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Badge variant={booking.booking_status === 'confirmed' ? 'default' : booking.booking_status === 'completed' ? 'outline' : 'destructive'}>
                                    {booking.booking_status === 'confirmed' ? 'Confirmé' : booking.booking_status === 'completed' ? 'Terminé' : 'Annulé'}
                                  </Badge>
                                  <Badge variant={booking.payment_status === 'completed' ? 'outline' : 'secondary'}>
                                    {booking.payment_status === 'pending' ? 'Paiement en attente' : booking.payment_status === 'partial' ? 'Partiellement payé' : booking.payment_status === 'completed' ? 'Payé' : 'Remboursé'}
                                  </Badge>
                                  
                                  {booking.is_recurring && (
                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                      <Repeat className="mr-1 h-3 w-3" />
                                      Récurrent
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="flex items-center mt-2 mb-4">
                                  <div className="flex items-center">
                                    <User className="h-4 w-4 text-gray-500 mr-1" />
                                    <span className="text-sm">{driver?.name || "Chauffeur"}</span>
                                  </div>
                                  <div className="flex items-center ml-4">
                                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                    <span className="text-sm">{driver?.rating || 4.5}</span>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <div className="flex items-start mb-2">
                                      <MapPin className="h-5 w-5 text-primary mr-2 mt-1" />
                                      <div>
                                        <p className="text-gray-500 text-sm">Départ</p>
                                        <p className="font-medium">{trip.origin_address}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-start">
                                      <MapPin className="h-5 w-5 text-red-500 mr-2 mt-1" />
                                      <div>
                                        <p className="text-gray-500 text-sm">Arrivée</p>
                                        <p className="font-medium">{trip.destination_address}</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <div className="flex items-center mb-1">
                                      <Clock className="h-5 w-5 text-gray-500 mr-2" />
                                      {booking.is_recurring ? (
                                        <span>
                                          {booking.booking_days?.map((day: string) => day.substring(0, 3)).join(', ')} à {trip.departure_time}
                                        </span>
                                      ) : (
                                        <span>{trip.departure_date} à {trip.departure_time}</span>
                                      )}
                                    </div>
                                    
                                    <div className="flex items-center mb-1">
                                      <Users className="h-5 w-5 text-gray-500 mr-2" />
                                      <span>{booking.seats_booked} place(s) réservée(s)</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-col justify-between mt-4 md:mt-0 md:ml-6">
                                <p className="text-lg font-semibold">{booking.total_price?.toLocaleString()} FCFA</p>
                                
                                <div className="flex flex-col space-y-2 mt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewTripDetails(trip)}
                                  >
                                    Détails
                                  </Button>
                                  
                                  {booking.booking_status === 'confirmed' && (
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={async () => {
                                        const confirmed = window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?");
                                        if (confirmed) {
                                          await ridesharing.cancelBooking(booking.id);
                                        }
                                      }}
                                    >
                                      Annuler
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Route className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">Vous n'avez pas encore réservé de trajets</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Réservez un trajet pour commencer à économiser sur vos déplacements.
                    </p>
                    <Button 
                      className="mt-6"
                      onClick={() => setActiveTab("search")}
                    >
                      Rechercher un trajet
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-semibold mb-6">Trajets populaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { from: "Brazzaville", to: "Pointe-Noire", count: 127, image: "https://images.unsplash.com/photo-1629969387384-56cfdd8c8206?q=80&w=500&auto=format&fit=crop" },
              { from: "Brazzaville", to: "Dolisie", count: 68, image: "https://images.unsplash.com/photo-1590613607026-15c463e30ca5?q=80&w=500&auto=format&fit=crop" },
              { from: "Pointe-Noire", to: "Brazzaville", count: 114, image: "https://images.unsplash.com/photo-1555881400-58903881a25e?q=80&w=500&auto=format&fit=crop" },
              { from: "Brazzaville", to: "Oyo", count: 42, image: "https://images.unsplash.com/photo-1573806706598-7f1641f7db46?q=80&w=500&auto=format&fit=crop" }
            ].map((route, index) => (
              <Card key={index} className="overflow-hidden cursor-pointer hover:shadow-md transition-all">
                <div className="h-36 relative">
                  <img 
                    src={route.image} 
                    alt={`${route.from} - ${route.to}`} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold">{route.from} → {route.to}</h3>
                    <p className="text-sm text-gray-300">{route.count} trajets</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Comment ça marche ?</CardTitle>
            <CardDescription>
              Participez à des trajets partagés en toute simplicité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">1. Trouvez un trajet</h3>
                <p className="text-gray-500">
                  Indiquez votre lieu de départ, votre destination et vos dates pour trouver des conducteurs qui font le même trajet.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">2. Réservez et payez</h3>
                <p className="text-gray-500">
                  Réservez votre place en toute sécurité via notre système de paiement mobile ou en ligne.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Car className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">3. Voyagez ensemble</h3>
                <p className="text-gray-500">
                  Rencontrez le conducteur au lieu de rendez-vous et profitez du trajet tout en partageant les frais.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <p className="text-gray-600">
              Vous avez une voiture ? Proposez des trajets et gagnez de l'argent en partageant vos frais !
            </p>
            <Button 
              onClick={() => setActiveTab("offer")}
            >
              Proposer un trajet
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Leaf className="h-5 w-5 text-green-500 mr-2" />
              Avantages du covoiturage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="font-medium">Économies</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Réduisez vos frais de transport de 50% à 75% en partageant les coûts avec d'autres passagers.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center mb-2">
                  <Leaf className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="font-medium">Écologie</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Moins de voitures sur la route = moins de pollution. Un trajet partagé peut économiser jusqu'à 2,6 kg de CO2 par 10 km.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center mb-2">
                  <Users className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="font-medium">Convivialité</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Faites de nouvelles rencontres et partagez des moments agréables pendant vos trajets.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Booking Modal */}
      {selectedTrip && (
        <BookingModal
          trip={selectedTrip}
          driverName={driverData[selectedTrip.driver_id as keyof typeof driverData]?.name || "Chauffeur"}
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          onBook={handleBookTrip}
          isLoading={ridesharing.isLoading}
        />
      )}
    </div>
  );
}
