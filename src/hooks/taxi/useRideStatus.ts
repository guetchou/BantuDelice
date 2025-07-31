
import { useState, useEffect } from 'react';
import { TaxiRide, TaxiDriver } from '@/types/taxi';
import { useToast } from '@/hooks/use-toast';

export const useRideStatus = (rideId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ride, setRide] = useState<TaxiRide | null>(null);
  const [driver, setDriver] = useState<TaxiDriver | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (rideId) {
      // Mock data for demo
      const mockRide: TaxiRide = {
        id: rideId,
        pickup_address: 'Centre-ville, Brazzaville',
        destination_address: 'Aéroport International, Brazzaville',
        status: 'in_progress',
        price: 5000,
        distance: 15,
        duration: 30,
        created_at: new Date().toISOString(),
        estimated_price: 5000,
        payment_status: 'pending',
        vehicle_type: 'standard',
        payment_method: 'cash',
        special_instructions: 'Merci d\'appeler à l\'arrivée'
      };

      const mockDriver: TaxiDriver = {
        id: 'driver-123',
        name: 'Jean Dupont',
        rating: 4.8,
        profile_image: 'https://randomuser.me/api/portraits/men/32.jpg',
        vehicle_model: 'Toyota Camry',
        license_plate: 'BZ 1234 AB',
        years_experience: 5,
        languages: ['Français', 'Lingala'],
        current_latitude: -4.2634,
        current_longitude: 15.2429
      };

      setTimeout(() => {
        setRide(mockRide);
        setDriver(mockDriver);
        setLoading(false);
      }, 1000);
    }
  }, [rideId]);

  const openRating = () => setIsRatingOpen(true);
  const closeRating = () => setIsRatingOpen(false);

  const cancelRide = async () => {
    setIsCancelling(true);
    try {
      // Mock cancellation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Course annulée",
        description: "Votre course a été annulée avec succès",
      });
      if (ride) {
        setRide({ ...ride, status: 'cancelled' });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la course",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const submitRating = async (rating: number, comment: string) => {
    setIsRatingSubmitting(true);
    try {
      // Mock rating submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Merci pour votre évaluation",
        description: "Votre avis nous aide à améliorer notre service",
      });
      closeRating();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de soumettre l'évaluation",
        variant: "destructive",
      });
    } finally {
      setIsRatingSubmitting(false);
    }
  };

  const refreshRide = async () => {
    // Mock refresh
    console.log('Refreshing ride data...');
  };

  const contactDriver = () => {
    toast({
      title: "Message envoyé",
      description: "Votre message a été envoyé au chauffeur",
    });
  };

  return {
    loading,
    error,
    ride,
    driver,
    isCancelling,
    isRatingSubmitting,
    isRatingOpen,
    openRating,
    closeRating,
    cancelRide,
    submitRating,
    refreshRide,
    contactDriver
  };
};
