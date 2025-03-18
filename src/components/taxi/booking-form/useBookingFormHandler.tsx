
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useBookingForm } from './BookingFormContext';

export function useBookingFormHandler() {
  const navigate = useNavigate();
  const { formState, estimatedPrice } = useBookingForm();
  
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [createdRideId, setCreatedRideId] = useState<string | null>(null);
  
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: // Location
        return formState.pickupAddress && 
               formState.destinationAddress && 
               formState.pickupLatitude !== null && 
               formState.pickupLongitude !== null &&
               formState.destinationLatitude !== null && 
               formState.destinationLongitude !== null;
      case 2: // Vehicle
        return formState.vehicleType;
      case 3: // Time and Payment
        if (formState.pickupTime === 'scheduled') {
          return formState.scheduledTime && formState.paymentMethod;
        }
        return formState.paymentMethod;
      case 4: // Driver selection
        return true; // Optional step
      default:
        return true;
    }
  };
  
  const handleLocationSelect = async (address: string, isPickup: boolean) => {
    if (!address) return;
    
    try {
      // In a real app, we would use a geocoding service here
      // For this demo, we'll simulate with random coordinates
      const simulateGeocode = () => {
        const baseLat = 4.2634; // Base coordinates for Brazzaville
        const baseLng = 15.2429;
        
        // Add some random offset (within ~5km)
        const latOffset = (Math.random() * 0.05) - 0.025;
        const lngOffset = (Math.random() * 0.05) - 0.025;
        
        return {
          lat: baseLat + latOffset,
          lng: baseLng + lngOffset
        };
      };
      
      const coords = simulateGeocode();
      const { updateFormState } = useBookingForm();
      
      if (isPickup) {
        updateFormState({
          pickupAddress: address,
          pickupLatitude: coords.lat,
          pickupLongitude: coords.lng
        });
      } else {
        updateFormState({
          destinationAddress: address,
          destinationLatitude: coords.lat,
          destinationLongitude: coords.lng
        });
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      toast.error("Impossible de localiser cette adresse");
    }
  };
  
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const { updateFormState } = useBookingForm();
          
          // In a real app, we would use reverse geocoding here
          // For this demo, we'll set a placeholder address
          updateFormState({
            pickupAddress: "Ma position actuelle",
            pickupLatitude: latitude,
            pickupLongitude: longitude
          });
          
          toast.success("Position actuelle détectée");
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error("Impossible d'obtenir votre position actuelle");
        }
      );
    } else {
      toast.error("La géolocalisation n'est pas prise en charge par votre appareil");
    }
  };
  
  const handleSelectDriver = (driver: any) => {
    setSelectedDriver(driver);
  };
  
  const handleNextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep === 1) {
        // Create the initial ride when moving from step 1 to 2
        createInitialRide();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    } else {
      toast.error("Veuillez remplir tous les champs obligatoires");
    }
  };
  
  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  const createInitialRide = async () => {
    try {
      setLoading(true);
      
      // Create the ride
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour réserver un taxi");
        return;
      }
      
      const newRideData = {
        user_id: user.id,
        pickup_address: formState.pickupAddress,
        destination_address: formState.destinationAddress,
        pickup_latitude: formState.pickupLatitude,
        pickup_longitude: formState.pickupLongitude,
        destination_latitude: formState.destinationLatitude,
        destination_longitude: formState.destinationLongitude,
        pickup_time: formState.pickupTime === 'now' 
          ? new Date().toISOString() 
          : formState.scheduledTime,
        status: 'pending',
        vehicle_type: formState.vehicleType,
        payment_method: formState.paymentMethod,
        estimated_price: estimatedPrice,
        payment_status: 'pending',
        is_shared_ride: formState.isSharedRide,
        max_passengers: formState.maxPassengers,
        special_instructions: formState.specialInstructions
      };
      
      const { data, error } = await supabase
        .from('taxi_rides')
        .insert(newRideData)
        .select()
        .single();
        
      if (error) throw error;
      
      setCreatedRideId(data.id);
      setCurrentStep(prev => prev + 1);
      
      toast.success("Votre réservation a été créée");
    } catch (error) {
      console.error('Error creating ride:', error);
      toast.error("Une erreur est survenue lors de la création de la réservation");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async () => {
    if (!createdRideId) {
      toast.error("Erreur: identifiant de course manquant");
      return;
    }
    
    try {
      setLoading(true);
      
      // If a driver was selected, request that driver
      if (selectedDriver) {
        const { error } = await supabase
          .from('taxi_ride_requests')
          .insert({
            ride_id: createdRideId,
            driver_id: selectedDriver.id,
            status: 'pending',
            requested_at: new Date().toISOString()
          });
          
        if (error) throw error;
      }
      
      toast.success("Réservation confirmée", {
        description: selectedDriver 
          ? "Le chauffeur a été notifié de votre demande" 
          : "Recherche d'un chauffeur en cours..."
      });
      
      // Navigate to the ride status page
      navigate(`/taxi/ride/${createdRideId}`);
    } catch (error) {
      console.error('Error finalizing booking:', error);
      toast.error("Une erreur est survenue lors de la finalisation de la réservation");
    } finally {
      setLoading(false);
    }
  };

  return {
    currentStep,
    loading,
    createdRideId,
    selectedDriver,
    handleNextStep,
    handlePrevStep,
    handleLocationSelect,
    handleUseCurrentLocation,
    handleSelectDriver,
    handleSubmit,
    validateCurrentStep
  };
}
