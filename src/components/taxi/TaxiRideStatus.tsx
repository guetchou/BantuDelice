
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DeliveryMap from "@/components/DeliveryMap";
import { Database } from "@/integrations/supabase/types";
import { logger } from '@/services/logger';
import { Clock, MapPin, User, Phone, Car, AlertCircle, MessageCircle, Star, CreditCard } from 'lucide-react';
import { TaxiRating } from '@/types/taxi';
import { toast } from 'sonner';

type TaxiRide = Database['public']['Tables']['taxi_rides']['Row'];
type TaxiDriver = Database['public']['Tables']['taxi_drivers']['Row'];

const TaxiRideStatus = () => {
  const { rideId } = useParams<{ rideId: string }>();
  const [ride, setRide] = useState<TaxiRide | null>(null);
  const [driver, setDriver] = useState<TaxiDriver | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [ratingValue, setRatingValue] = useState<number>(5);
  const [ratingComment, setRatingComment] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    const fetchRide = async () => {
      if (!rideId) {
        logger.error('No rideId provided in URL parameters');
        setError('Identifiant de course invalide');
        return;
      }

      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(rideId)) {
        logger.error('Invalid rideId format:', rideId);
        setError('Format d\'identifiant invalide');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('taxi_rides')
          .select()
          .match({ id: rideId })
          .maybeSingle();

        if (error) {
          logger.error('Error fetching ride:', error);
          setError('Erreur lors du chargement de la course');
          return;
        }

        if (!data) {
          logger.error('No ride found with id:', rideId);
          setError('Course non trouvée');
          return;
        }

        setRide(data);
        
        // Fetch driver if available
        if (data.driver_id) {
          fetchDriver(data.driver_id);
        }
        
        // Fetch chat messages
        fetchMessages();
      } catch (err) {
        logger.error('Unexpected error:', err);
        setError('Une erreur inattendue est survenue');
      }
    };

    const fetchDriver = async (driverId: string) => {
      try {
        const { data, error } = await supabase
          .from('taxi_drivers')
          .select('*')
          .eq('id', driverId)
          .single();
          
        if (error) {
          logger.error('Error fetching driver:', error);
          return;
        }
        
        setDriver(data);
      } catch (err) {
        logger.error('Error fetching driver details:', err);
      }
    };
    
    const fetchMessages = async () => {
      if (!rideId) return;
      
      try {
        const { data, error } = await supabase
          .from('taxi_messages')
          .select('*')
          .eq('ride_id', rideId)
          .order('created_at', { ascending: true });
          
        if (error) {
          logger.error('Error fetching messages:', error);
          return;
        }
        
        setMessages(data || []);
      } catch (err) {
        logger.error('Error fetching messages:', err);
      }
    };

    fetchRide();

    // Subscribe to changes
    const rideChannel = supabase
      .channel('taxi-ride-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'taxi_rides',
          filter: `id=eq.${rideId}`
        },
        (payload) => {
          logger.info('Ride update received:', payload);
          setRide(payload.new as TaxiRide);
          
          // If driver was assigned, fetch driver details
          if (payload.new.driver_id && (!ride?.driver_id || ride.driver_id !== payload.new.driver_id)) {
            fetchDriver(payload.new.driver_id);
          }
        }
      )
      .subscribe();
      
    // Subscribe to chat messages
    const chatChannel = supabase
      .channel('taxi-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'taxi_messages',
          filter: `ride_id=eq.${rideId}`
        },
        (payload) => {
          logger.info('New message received:', payload);
          setMessages(prev => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(rideChannel);
      supabase.removeChannel(chatChannel);
    };
  }, [rideId, ride?.driver_id]);

  const getStatusText = (status: string | null) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'accepted':
        return 'Acceptée';
      case 'in_progress':
        return 'En cours';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return 'Statut inconnu';
    }
  };
  
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-600';
      case 'accepted': return 'bg-blue-500/10 text-blue-600';
      case 'in_progress': return 'bg-green-500/10 text-green-600';
      case 'completed': return 'bg-green-500/10 text-green-600';
      case 'cancelled': return 'bg-red-500/10 text-red-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };
  
  const submitRating = async () => {
    if (!rideId) return;
    
    setLoadingAction(true);
    
    try {
      const ratingData: Partial<TaxiRating> = {
        ride_id: rideId,
        rating: ratingValue,
        comment: ratingComment
      };
      
      const { error } = await supabase
        .from('taxi_ratings')
        .insert(ratingData);
        
      if (error) throw error;
      
      toast.success("Merci pour votre évaluation !");
      setIsRatingOpen(false);
    } catch (err) {
      console.error('Error submitting rating:', err);
      toast.error("Erreur lors de l'envoi de l'évaluation");
    } finally {
      setLoadingAction(false);
    }
  };
  
  const sendMessage = async () => {
    if (!rideId || !chatMessage.trim()) return;
    
    setLoadingAction(true);
    
    try {
      const { error } = await supabase
        .from('taxi_messages')
        .insert({
          ride_id: rideId,
          sender_type: 'customer',
          message: chatMessage,
          created_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      setChatMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setLoadingAction(false);
    }
  };
  
  const cancelRide = async () => {
    if (!rideId) return;
    
    setLoadingAction(true);
    
    try {
      const { error } = await supabase
        .from('taxi_rides')
        .update({ status: 'cancelled' })
        .eq('id', rideId);
        
      if (error) throw error;
      
      toast.success("Votre course a été annulée");
    } catch (err) {
      console.error('Error cancelling ride:', err);
      toast.error("Erreur lors de l'annulation de la course");
    } finally {
      setLoadingAction(false);
    }
  };

  if (error) {
    return (
      <Card className="p-6 max-w-2xl mx-auto">
        <div className="flex flex-col items-center py-6">
          <AlertCircle className="h-12 w-12 text-red-500 mb-3" />
          <CardTitle className="text-xl mb-2">{error}</CardTitle>
          <CardDescription>
            Impossible de récupérer les informations de la course
          </CardDescription>
        </div>
      </Card>
    );
  }

  if (!ride) {
    return (
      <Card className="p-6 max-w-2xl mx-auto">
        <div className="flex justify-center p-6">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Suivi de votre course</CardTitle>
              <CardDescription>
                ID: {rideId?.substring(0, 8)}...
              </CardDescription>
            </div>
            <Badge className={getStatusColor(ride.status)}>
              {getStatusText(ride.status)}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Point de départ</h3>
                  <p className="text-gray-700">{ride.pickup_address}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Destination</h3>
                  <p className="text-gray-700">{ride.destination_address}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Heure de prise en charge</h3>
                  <p className="text-gray-700">{new Date(ride.pickup_time).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CreditCard className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Prix estimé</h3>
                  <p className="text-gray-700">{ride.estimated_price || '-'} FCFA</p>
                </div>
              </div>
            </div>
          </div>
          
          {driver && (
            <>
              <Separator />
              
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Informations du chauffeur
                </h3>
                
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex space-x-3">
                    <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden">
                      {driver.photo_url ? (
                        <img src={driver.photo_url} alt={driver.name} className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-full w-full p-4 text-gray-400" />
                      )}
                    </div>
                    
                    <div>
                      <p className="font-medium">{driver.name}</p>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>{driver.rating}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{driver.vehicle_model}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:items-end gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-2"
                      onClick={() => window.open(`tel:${driver.phone}`)}
                    >
                      <Phone className="h-4 w-4" />
                      <span>Appeler</span>
                    </Button>
                    
                    <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="gap-2">
                          <MessageCircle className="h-4 w-4" />
                          <span>Message</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Messages avec le chauffeur</DialogTitle>
                        </DialogHeader>
                        
                        <div className="h-64 overflow-y-auto p-3 bg-gray-50 rounded-md mb-3">
                          {messages.length === 0 ? (
                            <div className="text-center text-gray-500 py-6">
                              Pas encore de messages
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {messages.map((msg, i) => (
                                <div
                                  key={i}
                                  className={`p-2 rounded-lg max-w-[80%] ${
                                    msg.sender_type === 'customer' 
                                      ? 'ml-auto bg-primary text-white' 
                                      : 'bg-gray-200 text-gray-800'
                                  }`}
                                >
                                  {msg.message}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            placeholder="Écrivez votre message..."
                            className="flex-1 border rounded-md px-3 py-2"
                          />
                          <Button 
                            onClick={sendMessage} 
                            disabled={!chatMessage.trim() || loadingAction}
                          >
                            Envoyer
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </>
          )}
          
          <div className="h-64 md:h-72 overflow-hidden rounded-lg border">
            {(ride.pickup_latitude && ride.pickup_longitude) ? (
              <DeliveryMap
                latitude={ride.pickup_latitude}
                longitude={ride.pickup_longitude}
                orderId={ride.id}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <MapPin className="h-6 w-6 mr-2" />
                <span>Position non disponible</span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="bg-gray-50 flex justify-between">
          {ride.status === 'pending' && (
            <Button 
              variant="destructive" 
              onClick={cancelRide}
              disabled={loadingAction}
            >
              Annuler la course
            </Button>
          )}
          
          {ride.status === 'completed' && (
            <Dialog open={isRatingOpen} onOpenChange={setIsRatingOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Star className="h-4 w-4" />
                  <span>Noter le chauffeur</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Évaluer votre chauffeur</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="flex justify-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingValue(star)}
                        className="focus:outline-none"
                      >
                        <Star 
                          className={`h-8 w-8 ${
                            star <= ratingValue ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                  
                  <textarea
                    placeholder="Commentaire (facultatif)"
                    value={ratingComment}
                    onChange={(e) => setRatingComment(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsRatingOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button 
                    onClick={submitRating}
                    disabled={loadingAction}
                  >
                    Envoyer
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default TaxiRideStatus;
