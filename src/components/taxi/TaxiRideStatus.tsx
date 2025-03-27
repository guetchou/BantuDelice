
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, MessageSquare, Star, Clock, Ban, Car, Mail, CreditCard } from "lucide-react";
import { formatPrice } from './booking-form/bookingFormUtils';
import { useTaxiRideTracking } from '@/hooks/taxi/useTaxiRideTracking';
import { taxiRideService, taxiRatingService } from '@/services/apiService';
import { toast } from 'sonner';

// Composant de statut de course
export default function TaxiRideStatus() {
  const { rideId } = useParams<{ rideId: string }>();
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);
  
  const {
    loading,
    error,
    ride,
    driver,
    refreshTracking,
    contactDriver
  } = useTaxiRideTracking(rideId);
  
  // Actualiser automatiquement les données de la course
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshTracking();
    }, 30000); // Rafraîchir toutes les 30 secondes
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Annuler une course
  const handleCancelRide = async () => {
    if (!ride || !rideId) return;
    
    setIsCancelling(true);
    try {
      const response = await taxiRideService.update(rideId, {
        status: 'cancelled',
        updated_at: new Date().toISOString()
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      toast.success("Course annulée", {
        description: "Votre course a été annulée avec succès"
      });
      
      // Rafraîchir les données
      refreshTracking();
    } catch (error) {
      toast.error("Erreur lors de l'annulation", {
        description: "Impossible d'annuler votre course"
      });
    } finally {
      setIsCancelling(false);
    }
  };
  
  // Soumettre une évaluation
  const handleSubmitRating = async () => {
    if (!ride || !rideId) return;
    
    setIsRatingSubmitting(true);
    try {
      const ratingData = {
        ride_id: rideId,
        rating,
        comment,
        created_at: new Date().toISOString()
      };
      
      const response = await taxiRatingService.create(ratingData);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      toast.success("Merci pour votre évaluation", {
        description: "Votre avis a été enregistré avec succès"
      });
      
      setIsRatingOpen(false);
    } catch (error) {
      toast.error("Erreur lors de l'évaluation", {
        description: "Impossible d'enregistrer votre évaluation"
      });
    } finally {
      setIsRatingSubmitting(false);
    }
  };
  
  // Afficher un message d'erreur
  if (error) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Ban className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold">Erreur de chargement</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={refreshTracking}>Réessayer</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Afficher un spinner de chargement
  if (loading && !ride) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Chargement des détails de la course...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Si pas de course trouvée
  if (!ride) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Ban className="h-12 w-12 text-yellow-500 mx-auto" />
            <h2 className="text-xl font-semibold">Course introuvable</h2>
            <p className="text-muted-foreground">Impossible de trouver les détails de cette course</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Définir le message et le pourcentage de progression selon le statut
  const getRideStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { badge: 'En attente', message: 'Recherche d\'un chauffeur...', progress: 10, color: 'bg-yellow-500', canCancel: true };
      case 'accepted':
        return { badge: 'Accepté', message: 'Chauffeur en route vers vous', progress: 25, color: 'bg-blue-500', canCancel: true };
      case 'arrived':
        return { badge: 'Arrivé', message: 'Chauffeur arrivé au point de prise en charge', progress: 50, color: 'bg-blue-500', canCancel: true };
      case 'en_route':
        return { badge: 'En cours', message: 'En route vers la destination', progress: 75, color: 'bg-blue-500', canCancel: false };
      case 'completed':
        return { badge: 'Terminé', message: 'Course terminée', progress: 100, color: 'bg-green-500', canCancel: false };
      case 'cancelled':
        return { badge: 'Annulé', message: 'Course annulée', progress: 100, color: 'bg-red-500', canCancel: false };
      default:
        return { badge: 'Inconnu', message: 'Statut inconnu', progress: 0, color: 'bg-gray-500', canCancel: false };
    }
  };
  
  const statusInfo = getRideStatusInfo(ride.status);

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Suivi de votre course</CardTitle>
          <Badge variant={ride.status === 'cancelled' ? 'destructive' : 'outline'} className="uppercase">
            {statusInfo.badge}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          #{ride.id.substring(0, 8)}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-4">
        {/* Barre de progression */}
        <div className="space-y-2">
          <Progress value={statusInfo.progress} className={statusInfo.color} />
          <p className="text-center text-sm font-medium">{statusInfo.message}</p>
        </div>
        
        {/* Adresses */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="mt-1">
              <div className="h-3 w-3 rounded-full bg-primary"></div>
              <div className="h-full w-0.5 bg-gray-200 mx-auto"></div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Départ</p>
              <p className="font-medium">{ride.pickup_address}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="mt-1">
              <div className="h-3 w-3 rounded-full bg-orange-500"></div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Destination</p>
              <p className="font-medium">{ride.destination_address}</p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Informations sur le chauffeur */}
        {driver && ride.status !== 'pending' && ride.status !== 'cancelled' && (
          <div className="space-y-4">
            <h3 className="font-medium">Détails du chauffeur</h3>
            
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={driver.photo_url} alt={driver.name} />
                <AvatarFallback>{driver.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <p className="font-medium">{driver.name}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  <span>{driver.rating}</span>
                  <span className="mx-1">•</span>
                  <span>{driver.vehicle_model}</span>
                </div>
                <p className="text-sm font-semibold mt-1">{driver.license_plate}</p>
              </div>
              
              <div className="flex gap-2">
                <Button size="icon" variant="outline" onClick={() => window.open(`tel:${driver.phone}`, '_blank')}>
                  <Phone className="h-4 w-4" />
                </Button>
                
                <Button size="icon" variant="outline" onClick={() => contactDriver("Bonjour, je suis votre passager.")}>
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Détails du trajet */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Type de véhicule</p>
            <p className="font-medium capitalize">{ride.vehicle_type}</p>
          </div>
          
          <div>
            <p className="text-muted-foreground">Méthode de paiement</p>
            <p className="font-medium capitalize">{
              ride.payment_method === 'cash' 
                ? 'Espèces' 
                : ride.payment_method === 'card' 
                  ? 'Carte' 
                  : 'Mobile Money'
            }</p>
          </div>
          
          <div>
            <p className="text-muted-foreground">Prix estimé</p>
            <p className="font-medium">{formatPrice(ride.estimated_price)}</p>
          </div>
          
          <div>
            <p className="text-muted-foreground">Heure de prise en charge</p>
            <p className="font-medium">{
              ride.pickup_time_type === 'now'
                ? 'Immédiat'
                : new Date(ride.pickup_time).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })
            }</p>
          </div>
        </div>
        
        {/* Instructions spéciales */}
        {ride.special_instructions && (
          <div className="bg-primary/5 p-3 rounded-md border border-primary/10 text-sm">
            <p className="font-medium mb-1">Instructions spéciales:</p>
            <p>{ride.special_instructions}</p>
          </div>
        )}
        
        {/* Section d'évaluation */}
        {ride.status === 'completed' && isRatingOpen && (
          <div className="space-y-4">
            <h3 className="font-medium">Évaluer votre course</h3>
            
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      rating >= star ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comment">Commentaire (optionnel)</Label>
              <Textarea
                id="comment"
                placeholder="Partagez votre expérience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsRatingOpen(false)}
                disabled={isRatingSubmitting}
              >
                Annuler
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmitRating}
                disabled={isRatingSubmitting}
              >
                {isRatingSubmitting ? (
                  <span className="flex items-center">
                    <span className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></span>
                    Envoi...
                  </span>
                ) : (
                  "Envoyer"
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-3 pt-0">
        {/* Boutons d'action selon le statut */}
        {ride.status === 'completed' && !isRatingOpen && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setIsRatingOpen(true)}
          >
            <Star className="h-4 w-4 mr-2" />
            Évaluer cette course
          </Button>
        )}
        
        {ride.status === 'completed' && ride.payment_status !== 'completed' && (
          <Button className="w-full">
            <CreditCard className="h-4 w-4 mr-2" />
            Payer maintenant
          </Button>
        )}
        
        {statusInfo.canCancel && (
          <Button 
            variant="outline" 
            className="w-full text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
            onClick={handleCancelRide}
            disabled={isCancelling}
          >
            {isCancelling ? (
              <span className="flex items-center">
                <span className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></span>
                Annulation...
              </span>
            ) : (
              <>
                <Ban className="h-4 w-4 mr-2" />
                Annuler la course
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
