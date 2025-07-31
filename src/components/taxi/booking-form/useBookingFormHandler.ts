
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useBookingForm, initialFormState } from './BookingFormContext';
import { useTaxiPricing } from '@/hooks/useTaxiPricing';
import { TaxiDriver } from '@/types/taxi';
import { useDriverFinder } from '@/hooks/taxi/useDriverFinder';

export function useBookingFormHandler() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formState, setFormState, updateFormField } = useBookingForm();
  const { calculateQuickPrice } = useTaxiPricing();
  const { findOptimalDrivers } = useDriverFinder();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [createdRideId, setCreatedRideId] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [nearbyDrivers, setNearbyDrivers] = useState<TaxiDriver[]>([]);
  
  // Reset form when mounted
  useEffect(() => {
    setFormState(initialFormState);
  }, []);
  
  // Fetch nearby drivers when pickup and destination are set
  useEffect(() => {
    const fetchDrivers = async () => {
      if (
        formState.pickupCoordinates && 
        formState.destinationCoordinates && 
        currentStep === 2
      ) {
        try {
          const [pickupLng, pickupLat] = formState.pickupCoordinates;
          const [destLng, destLat] = formState.destinationCoordinates;
          
          const drivers = await findOptimalDrivers(
            pickupLat, 
            pickupLng, 
            destLat, 
            destLng, 
            formState.vehicleType
          );
          
          setNearbyDrivers(drivers);
        } catch (error) {
          console.error('Error fetching drivers:', error);
          toast({
            title: "Erreur",
            description: "Impossible de trouver des chauffeurs à proximité",
            variant: "destructive",
          });
        }
      }
    };
    
    fetchDrivers();
  }, [formState.pickupCoordinates, formState.destinationCoordinates, currentStep, formState.vehicleType]);
  
  // Update price estimate when relevant fields change
  useEffect(() => {
    if (
      formState.pickupCoordinates && 
      formState.destinationCoordinates &&
      formState.vehicleType
    ) {
      // Calculate distance in km between coordinates
      const [pickupLng, pickupLat] = formState.pickupCoordinates;
      const [destLng, destLat] = formState.destinationCoordinates;
      
      const distance = calculateDistance(
        pickupLat, pickupLng,
        destLat, destLng
      );
      
      // Estimate duration - rough approximation: 2 minutes per km plus 5 minutes
      const duration = Math.round(distance * 2) + 5;
      
      updateFormField('estimatedDistance', distance);
      updateFormField('estimatedDuration', duration);
      
      const price = calculateQuickPrice(distance, formState.vehicleType);
      updateFormField('estimatedPrice', price);
    }
  }, [formState.pickupCoordinates, formState.destinationCoordinates, formState.vehicleType]);
  
  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(3, prev + 1));
    } else {
      toast({
        title: "Champs incomplets",
        description: "Veuillez remplir tous les champs requis pour continuer.",
        variant: "destructive",
      });
    }
  };
  
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };
  
  const handleLocationSelect = (address: string, isPickup: boolean, coordinates?: [number, number]) => {
    if (isPickup) {
      updateFormField('pickupAddress', address);
      
      if (coordinates) {
        updateFormField('pickupCoordinates', coordinates);
      } else {
        // If no coordinates provided, try to geocode
        geocodeAddress(address, true);
      }
    } else {
      updateFormField('destinationAddress', address);
      
      if (coordinates) {
        updateFormField('destinationCoordinates', coordinates);
      } else {
        // If no coordinates provided, try to geocode
        geocodeAddress(address, false);
      }
    }
  };
  
  const geocodeAddress = async (address: string, isPickup: boolean) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoibGF1cmVudGRldm1vIiwiYSI6ImNsdTF2NnN6djJrbHkya24wZWJreTBhcGEifQ.3tdP2ZwJRrdGVouUYnHxFA`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        const coordinates: [number, number] = [lng, lat];
        
        if (isPickup) {
          updateFormField('pickupCoordinates', coordinates);
        } else {
          updateFormField('destinationCoordinates', coordinates);
        }
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };
  
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const coordinates: [number, number] = [longitude, latitude];
          
          // Reverse geocode to get address
          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=pk.eyJ1IjoibGF1cmVudGRldm1vIiwiYSI6ImNsdTF2NnN6djJrbHkya24wZWJreTBhcGEifQ.3tdP2ZwJRrdGVouUYnHxFA`
            );
            
            const data = await response.json();
            
            if (data.features && data.features.length > 0) {
              const address = data.features[0].place_name;
              updateFormField('pickupAddress', address);
              updateFormField('pickupCoordinates', coordinates);
            }
          } catch (error) {
            console.error('Reverse geocoding error:', error);
            updateFormField('pickupAddress', 'Position actuelle');
            updateFormField('pickupCoordinates', coordinates);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Erreur de localisation",
            description: "Impossible d'accéder à votre position actuelle.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Localisation non supportée",
        description: "Votre navigateur ne supporte pas la géolocalisation.",
        variant: "destructive",
      });
    }
  };
  
  const handleSelectDriver = (driver: TaxiDriver) => {
    updateFormField('selectedDriver', driver);
  };
  
  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      toast({
        title: "Champs incomplets",
        description: "Veuillez remplir tous les champs requis pour continuer.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create fake ride ID
      const rideId = `ride-${Math.random().toString(36).substring(2, 10)}`;
      setCreatedRideId(rideId);
      setBookingSuccess(true);
      
      toast({
        title: "Réservation effectuée",
        description: "Votre chauffeur sera bientôt en route !",
      });
      
      // Redirect to ride status page after a delay
      setTimeout(() => {
        navigate(`/taxi/ride/${rideId}`);
      }, 3000);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Erreur de réservation",
        description: "Une erreur est survenue lors de la réservation. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0: // Address step
        return !!(formState.pickupAddress && formState.destinationAddress);
      case 1: // Vehicle and time step
        if (formState.pickupTime === 'scheduled') {
          return !!formState.scheduledTime;
        }
        return true;
      case 2: // Driver step
        return !!formState.selectedDriver;
      case 3: // Payment and contact step
        return !!(formState.contactName && formState.contactPhone);
      default:
        return true;
    }
  };
  
  // Helper function to calculate distance between coordinates
  function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
    const R = 6371; // Earth's radius in km
    const dLat = deg2rad(lat2 - lat1);
    const dLng = deg2rad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    return parseFloat(distance.toFixed(1));
  }
  
  function deg2rad(deg: number) {
    return deg * (Math.PI/180);
  }
  
  return {
    currentStep,
    loading,
    createdRideId,
    bookingSuccess,
    formState,
    nearbyDrivers,
    handleNextStep,
    handlePrevStep,
    handleLocationSelect,
    handleUseCurrentLocation,
    handleSelectDriver,
    handleSubmit,
    validateCurrentStep,
    updateFormField
  };
}
