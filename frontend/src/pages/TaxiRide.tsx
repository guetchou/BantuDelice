
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useTaxiBooking } from '@/hooks/useTaxiBooking';
import { TaxiRide } from '@/types/taxi';
import { MapPin, Clock, Car, User, Phone, CreditCard, ArrowLeft, Ban, Star, MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';

// Fake driver data for demo
const driverData = {
  id: 'driver-123',
  name: 'Jean Dupont',
  phone: '+242 06 123 4567',
  vehicle: 'Toyota Camry',
  license_plate: 'BZ 1234 AB',
  rating: 4.8,
  photo: 'https://randomuser.me/api/portraits/men/32.jpg'
};

export default function TaxiRidePage() {
  const { rideId } = useParams<{ rideId: string }>();
  const navigate = useNavigate();
  const { cancelBooking, getRideDetails, isLoading } = useTaxiBooking();
  const [ride, setRide] = useState<TaxiRide | null>(null);
  const [rideStatus, setRideStatus] = useState<'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'>('pending');
  const [driverAssigned, setDriverAssigned] = useState(false);
  const [rating, setRating] = useState(0);
  
  useEffect(() => {
    if (rideId) {
      // In a real app, we'd fetch real data
      // getRideDetails(rideId).then(data => {
      //   if (data) setRide(data);
      // });
      
      // For demo, create fake ride data
      const fakeRide: TaxiRide = {
        id: rideId,
        user_id: 'user-123',
        pickup_address: 'Centre-ville, Brazzaville',
        destination_address: 'Aéroport International, Brazzaville',
        pickup_time: new Date().toISOString(),
        status: 'pending',
        driver_id: undefined,
        estimated_price: 5000,
        actual_price: undefined,
        payment_status: 'pending',
        vehicle_type: 'standard',
        payment_method: 'cash',
        pickup_latitude: 0,
        pickup_longitude: 0,
        destination_latitude: 0,
        destination_longitude: 0
      };
      
      setRide(fakeRide);
      
      // Simulate driver assignment and ride progression for demo
      setTimeout(() => {
        setRideStatus('accepted');
        setDriverAssigned(true);
        toast.success("Chauffeur trouvé", {
          description: "Jean Dupont arrive dans 3 minutes"
        });
      }, 5000);
      
      setTimeout(() => {
        setRideStatus('in_progress');
        toast.success("Trajet en cours", {
          description: "Vous êtes en route vers votre destination"
        });
      }, 10000);
      
      setTimeout(() => {
        setRideStatus('completed');
        toast.success("Trajet terminé", {
          description: "Vous êtes arrivé à destination"
        });
      }, 15000);
    }
  }, [rideId]);
  
  const handleCancelRide = async () => {
    if (!ride) return;
    
    if (window.confirm("Êtes-vous sûr de vouloir annuler cette course ?")) {
      // In a real app, we would call the actual cancelBooking function
      // const success = await cancelBooking(ride.id);
      
      // For demo purposes
      toast.success("Course annulée", {
        description: "Votre course a été annulée avec succès"
      });
      setRideStatus('cancelled');
    }
  };
  
  const handleRatingSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast.success("Merci pour votre évaluation", {
      description: "Votre avis nous aide à améliorer notre service"
    });
  };
  
  const handleContactDriver = () => {
    toast.success("Message envoyé", {
      description: "Votre message a été envoyé au chauffeur"
    });
  };
  
  const getStatusColor = () => {
    switch (rideStatus) {
      case 'pending': return 'bg-yellow-500';
      case 'accepted': return 'bg-blue-500';
      case 'in_progress': return 'bg-green-500';
      case 'completed': return 'bg-green-700';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getStatusText = () => {
    switch (rideStatus) {
      case 'pending': return 'En attente de chauffeur';
      case 'accepted': return 'Chauffeur en route';
      case 'in_progress': return 'Trajet en cours';
      case 'completed': return 'Trajet terminé';
      case 'cancelled': return 'Trajet annulé';
      default: return 'Statut inconnu';
    }
  };
  
  if (!ride) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <Button 
          variant="ghost" 
          className="mb-6 text-white hover:text-primary hover:bg-white/5"
          onClick={() => navigate('/taxi')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main ride info */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white/10 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white flex items-center">
                      <Car className="mr-2 h-5 w-5 text-primary" />
                      Course #{ride.id.substring(0, 8)}
                    </CardTitle>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor()}`}>
                      {getStatusText()}
                    </div>
                  </div>
                  <CardDescription className="text-gray-400">
                    Réservée le {new Date(ride.pickup_time).toLocaleDateString('fr-FR')} à {new Date(ride.pickup_time).toLocaleTimeString('fr-FR')}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Departure and arrival */}
                  <div className="relative pl-6 space-y-6">
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent"></div>
                    
                    <div className="relative">
                      <div className="absolute left-[-24px] top-0 w-4 h-4 rounded-full bg-primary"></div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-400">DÉPART</p>
                        <p className="text-white font-medium">{ride.pickup_address}</p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute left-[-24px] top-0 w-4 h-4 rounded-full bg-primary/60"></div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-400">ARRIVÉE</p>
                        <p className="text-white font-medium">{ride.destination_address}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Ride details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Type de véhicule</p>
                      <p className="text-white capitalize">{ride.vehicle_type}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Mode de paiement</p>
                      <p className="text-white capitalize">
                        {ride.payment_method === 'cash' && 'Espèces'}
                        {ride.payment_method === 'card' && 'Carte bancaire'}
                        {ride.payment_method === 'mobile_money' && 'Mobile Money'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Prix estimé</p>
                      <p className="text-white font-bold">{ride.estimated_price} FCFA</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Prix final</p>
                      <p className="text-white font-bold">
                        {rideStatus === 'completed' ? `${ride.estimated_price} FCFA` : 'En attente'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    {rideStatus === 'pending' && (
                      <Button 
                        variant="destructive" 
                        onClick={handleCancelRide}
                        className="flex-1"
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        Annuler la course
                      </Button>
                    )}
                    
                    {rideStatus === 'completed' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="flex-1">
                            <Star className="mr-2 h-4 w-4" />
                            Évaluer le trajet
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-800 text-white border-gray-700">
                          <DialogHeader>
                            <DialogTitle>Évaluer votre course</DialogTitle>
                            <DialogDescription className="text-gray-400">
                              Partagez votre expérience pour aider notre chauffeur à s'améliorer
                            </DialogDescription>
                          </DialogHeader>
                          
                          <form onSubmit={handleRatingSubmit} className="space-y-4 py-2">
                            <div className="space-y-2">
                              <Label htmlFor="rating">Note globale</Label>
                              <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none"
                                    onClick={() => setRating(star)}
                                  >
                                    <Star
                                      className={`h-8 w-8 ${
                                        rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="comment">Commentaire (facultatif)</Label>
                              <Textarea
                                id="comment"
                                placeholder="Partagez votre expérience..."
                                className="bg-gray-700 border-gray-600"
                              />
                            </div>
                            
                            <DialogFooter>
                              <Button type="submit">Soumettre l'évaluation</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    )}
                    
                    {driverAssigned && rideStatus !== 'completed' && rideStatus !== 'cancelled' && (
                      <>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="flex-1 border-white/20 hover:bg-white/10">
                              <MessageCircle className="mr-2 h-4 w-4" />
                              Contacter le chauffeur
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-800 text-white border-gray-700">
                            <DialogHeader>
                              <DialogTitle>Contacter le chauffeur</DialogTitle>
                              <DialogDescription className="text-gray-400">
                                Envoyez un message à votre chauffeur
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4 py-2">
                              <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                  id="message"
                                  placeholder="Votre message..."
                                  className="bg-gray-700 border-gray-600"
                                />
                              </div>
                              
                              <DialogFooter>
                                <Button onClick={handleContactDriver}>Envoyer</Button>
                              </DialogFooter>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          variant="outline"
                          className="border-white/20 hover:bg-white/10"
                          onClick={() => {window.location.href = `tel:${driverData.phone}`;}}
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          Appeler
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Driver info */}
          <div>
            {driverAssigned ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-white/10 border-white/10 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-white">Votre chauffeur</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <div className="mr-4">
                        <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-primary">
                          <img 
                            src={driverData.photo} 
                            alt={driverData.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-white">{driverData.name}</h3>
                        <div className="flex items-center text-yellow-400">
                          <Star className="fill-yellow-400 h-4 w-4 mr-1" /> 
                          <span>{driverData.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center">
                        <Car className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-400">Véhicule</p>
                          <p className="text-white">{driverData.vehicle}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-400">Immatriculation</p>
                          <p className="text-white">{driverData.license_plate}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-400">Téléphone</p>
                          <p className="text-white">{driverData.phone}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-white/10 border-white/10 backdrop-blur-md">
                  <CardContent className="py-8">
                    <div className="text-center space-y-4">
                      <div className="animate-pulse flex justify-center mb-4">
                        <div className="bg-primary/30 rounded-full h-16 w-16 flex items-center justify-center">
                          <Car className="h-8 w-8 text-primary/70" />
                        </div>
                      </div>
                      
                      <h3 className="text-white text-lg font-medium">Recherche d'un chauffeur</h3>
                      <p className="text-gray-400 text-sm">Nous recherchons le chauffeur le plus proche pour vous...</p>
                      
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
