
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { Car } from "lucide-react";
import LocationSection from './LocationSection';
import RideSharing from './RideSharing';
import NearbyDrivers from './NearbyDrivers';
import { calculateDistance } from '@/utils/deliveryOptimization';
import StepIndicator from './StepIndicator';
import EnhancedVehicleSection from './EnhancedVehicleSection';
import EnhancedPickupTimeSection from './EnhancedPickupTimeSection';
import EnhancedPaymentSection from './EnhancedPaymentSection';
import BookingExtras from './BookingExtras';
import PriceEstimation from './PriceEstimation';

interface BookingFormState {
  pickupAddress: string;
  pickupLatitude: number | null;
  pickupLongitude: number | null;
  destinationAddress: string;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
  vehicleType: string;
  paymentMethod: string;
  pickupTime: 'now' | 'scheduled';
  scheduledTime: string;
  specialInstructions: string;
  isSharedRide: boolean;
  maxPassengers: number;
  promoCode: string;
}

export default function TaxiBookingForm() {
  const navigate = useNavigate();
  
  const [formState, setFormState] = useState<BookingFormState>({
    pickupAddress: '',
    pickupLatitude: null,
    pickupLongitude: null,
    destinationAddress: '',
    destinationLatitude: null,
    destinationLongitude: null,
    vehicleType: 'standard',
    paymentMethod: 'cash',
    pickupTime: 'now',
    scheduledTime: new Date(Date.now() + 30 * 60000).toISOString().slice(0, 16),
    specialInstructions: '',
    isSharedRide: false,
    maxPassengers: 0,
    promoCode: ''
  });

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [createdRideId, setCreatedRideId] = useState<string | null>(null);
  
  // Update estimated price when relevant fields change
  useEffect(() => {
    calculateEstimatedPrice();
  }, [
    formState.pickupLatitude, 
    formState.pickupLongitude, 
    formState.destinationLatitude, 
    formState.destinationLongitude,
    formState.vehicleType,
    formState.isSharedRide,
    formState.maxPassengers
  ]);
  
  const calculateEstimatedPrice = () => {
    if (
      formState.pickupLatitude && 
      formState.pickupLongitude && 
      formState.destinationLatitude && 
      formState.destinationLongitude
    ) {
      // Calculate distance
      const distance = calculateDistance(
        formState.pickupLatitude,
        formState.pickupLongitude,
        formState.destinationLatitude,
        formState.destinationLongitude
      );
      
      // Base price calculations
      let basePrice = 1000; // Base fare
      
      // Add distance-based fare
      const farePerKm = {
        standard: 300,
        comfort: 400,
        premium: 600,
        van: 700
      };
      
      const rate = farePerKm[formState.vehicleType as keyof typeof farePerKm] || farePerKm.standard;
      const distanceFare = distance * rate;
      
      // Calculate total
      let totalPrice = basePrice + distanceFare;
      
      // Apply shared ride discount if applicable
      if (formState.isSharedRide) {
        const discountPercentage = 15 + (formState.maxPassengers * 5); // 15% base + 5% per additional passenger
        totalPrice = totalPrice * (1 - (discountPercentage / 100));
      }
      
      // Round to nearest 100
      totalPrice = Math.ceil(totalPrice / 100) * 100;
      
      setEstimatedPrice(totalPrice);
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
      
      if (isPickup) {
        setFormState(prev => ({
          ...prev,
          pickupAddress: address,
          pickupLatitude: coords.lat,
          pickupLongitude: coords.lng
        }));
      } else {
        setFormState(prev => ({
          ...prev,
          destinationAddress: address,
          destinationLatitude: coords.lat,
          destinationLongitude: coords.lng
        }));
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
          
          // In a real app, we would use reverse geocoding here
          // For this demo, we'll set a placeholder address
          setFormState(prev => ({
            ...prev,
            pickupAddress: "Ma position actuelle",
            pickupLatitude: latitude,
            pickupLongitude: longitude
          }));
          
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
  
  const updateFormState = (updates: Partial<BookingFormState>) => {
    setFormState(prev => ({
      ...prev,
      ...updates
    }));
  };
  
  const handleSharingEnabled = (enabled: boolean, maxPassengers: number) => {
    updateFormState({ 
      isSharedRide: enabled,
      maxPassengers: enabled ? maxPassengers : 0
    });
  };
  
  const handleSelectDriver = (driver: any) => {
    setSelectedDriver(driver);
  };
  
  const getDistanceEstimate = () => {
    if (
      formState.pickupLatitude && 
      formState.pickupLongitude && 
      formState.destinationLatitude && 
      formState.destinationLongitude
    ) {
      return calculateDistance(
        formState.pickupLatitude,
        formState.pickupLongitude,
        formState.destinationLatitude,
        formState.destinationLongitude
      );
    }
    return null;
  };
  
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

  // Render different content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Location
        return (
          <LocationSection
            pickupAddress={formState.pickupAddress}
            setPickupAddress={(val) => updateFormState({ pickupAddress: val })}
            destinationAddress={formState.destinationAddress}
            setDestinationAddress={(val) => updateFormState({ destinationAddress: val })}
            onLocationSelect={handleLocationSelect}
            onUseCurrentLocation={handleUseCurrentLocation}
          />
        );
      case 2: // Vehicle Selection
        return (
          <div className="space-y-6">
            <EnhancedVehicleSection
              selectedVehicleType={formState.vehicleType}
              onVehicleSelect={(val) => updateFormState({ vehicleType: val })}
            />
            
            <Separator />
            
            <RideSharing
              rideId={createdRideId}
              onSharingEnabled={handleSharingEnabled}
              initialPrice={estimatedPrice}
            />
            
            {formState.pickupLatitude && formState.destinationLatitude && (
              <PriceEstimation 
                estimatedPrice={estimatedPrice} 
                distance={getDistanceEstimate() || undefined}
              />
            )}
          </div>
        );
      case 3: // Time and Payment
        return (
          <div className="space-y-6">
            <EnhancedPickupTimeSection
              pickupTime={formState.pickupTime}
              scheduledTime={formState.scheduledTime}
              onPickupTimeChange={(val) => updateFormState({ pickupTime: val })}
              onScheduledTimeChange={(val) => updateFormState({ scheduledTime: val })}
            />
            
            <Separator />
            
            <EnhancedPaymentSection
              paymentMethod={formState.paymentMethod}
              onPaymentMethodChange={(val) => updateFormState({ paymentMethod: val })}
              estimatedPrice={estimatedPrice}
            />
            
            <BookingExtras
              specialInstructions={formState.specialInstructions}
              promoCode={formState.promoCode}
              onSpecialInstructionsChange={(val) => updateFormState({ specialInstructions: val })}
              onPromoCodeChange={(val) => updateFormState({ promoCode: val })}
              onApplyPromoCode={() => {
                if (formState.promoCode) {
                  toast.info("Vérification du code promo...");
                  // Implementation for promo code validation would go here
                }
              }}
            />
          </div>
        );
      case 4: // Driver Selection
        return createdRideId ? (
          <div className="space-y-6">
            <NearbyDrivers
              pickupLatitude={formState.pickupLatitude!}
              pickupLongitude={formState.pickupLongitude!}
              destinationLatitude={formState.destinationLatitude!}
              destinationLongitude={formState.destinationLongitude!}
              vehicleType={formState.vehicleType}
              onSelectDriver={handleSelectDriver}
              rideId={createdRideId}
            />
            
            <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
              <p className="text-sm text-blue-700">
                Si vous ne sélectionnez pas de chauffeur, le système en attribuera un automatiquement.
              </p>
            </div>
          </div>
        ) : (
          <div>Une erreur est survenue lors de la création de la course.</div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5 text-primary" />
          Réservation de taxi
        </CardTitle>
        <CardDescription>
          Remplissez le formulaire ci-dessous pour réserver votre course
        </CardDescription>
        
        <StepIndicator currentStep={currentStep} totalSteps={4} />
      </CardHeader>
      
      <CardContent>
        {renderStepContent()}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-6">
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={loading}
          >
            Retour
          </Button>
        )}
        
        {currentStep < 4 ? (
          <Button
            onClick={handleNextStep}
            disabled={!validateCurrentStep() || loading}
            className={currentStep === 1 ? "w-full" : ""}
          >
            {loading ? "Chargement..." : "Continuer"}
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Chargement..." : "Confirmer la réservation"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
