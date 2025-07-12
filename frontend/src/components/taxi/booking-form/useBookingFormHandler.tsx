
import { useState } from 'react';
import { useBookingForm } from './BookingFormContext';
import { useLocationHandler } from '@/hooks/taxi/useLocationHandler';
import { useDriverSelection } from '@/hooks/taxi/useDriverSelection';
import { useRideCreation } from '@/hooks/taxi/useRideCreation';
import { useFormValidation } from '@/hooks/taxi/useFormValidation';
import { toast } from 'sonner';

export function useBookingFormHandler() {
  const { formState, estimatedPrice, updateFormState } = useBookingForm();
  const [currentStep, setCurrentStep] = useState(1);
  
  const { handleLocationSelect: locationSelectHandler, handleUseCurrentLocation: currentLocationHandler, loadSavedAddresses } = useLocationHandler();
  const { selectedDriver, handleSelectDriver } = useDriverSelection();
  const { loading, createdRideId, bookingSuccess, createInitialRide, handleSubmit: submitRide } = useRideCreation();
  const { validateStep } = useFormValidation();
  
  // Location handling with improved error handling
  const handleLocationSelect = async (address: string, isPickup: boolean) => {
    try {
      await locationSelectHandler(address, isPickup, updateFormState);
      
      // If both pickup and destination are set, auto-validate and advance
      if (isPickup && formState.destinationAddress) {
        validateAndProceed();
      } else if (!isPickup && formState.pickupAddress) {
        validateAndProceed();
      }
    } catch (error) {
      console.error("Error selecting location:", error);
      toast.error("Une erreur est survenue lors de la sélection de l'adresse");
    }
  };
  
  // Improved current location handler with better user feedback
  const handleUseCurrentLocation = async () => {
    try {
      await currentLocationHandler(updateFormState);
      
      // If destination is also set, validate and proceed
      if (formState.destinationAddress) {
        validateAndProceed();
      }
    } catch (error) {
      console.error("Error using current location:", error);
      toast.error("Impossible d'utiliser votre position actuelle", {
        description: "Vérifiez que vous avez activé les services de localisation"
      });
    }
  };
  
  // Helper function to validate and proceed to next step if valid
  const validateAndProceed = () => {
    if (validateCurrentStep()) {
      handleNextStep();
    }
  };
  
  const validateCurrentStep = () => {
    return validateStep(currentStep, formState);
  };
  
  const handleNextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep === 1) {
        // Create the initial ride when moving from step 1 to 2
        createInitialRide(formState, estimatedPrice).then(success => {
          if (success) {
            // Show success toast and proceed to step 2
            toast.success("Adresses validées", {
              description: "Vous pouvez maintenant choisir votre véhicule"
            });
            setCurrentStep(prev => prev + 1);
          }
        });
      } else {
        setCurrentStep(prev => prev + 1);
      }
    } else {
      // Show more specific error messages based on what's missing
      if (currentStep === 1) {
        if (!formState.pickupAddress) {
          toast.error("Point de départ non défini", {
            description: "Veuillez indiquer votre point de départ"
          });
        } else if (!formState.destinationAddress) {
          toast.error("Destination non définie", {
            description: "Veuillez indiquer votre destination"
          });
        } else {
          toast.error("Veuillez remplir tous les champs obligatoires");
        }
      } else {
        toast.error("Veuillez remplir tous les champs obligatoires");
      }
    }
  };
  
  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  const handleSubmit = async () => {
    try {
      await submitRide(createdRideId, selectedDriver);
    } catch (error) {
      console.error("Error submitting ride:", error);
      toast.error("Une erreur est survenue lors de la soumission de votre réservation");
    }
  };

  // Function to handle user assistance request (chat or call)
  const handleAssistanceRequest = (type: 'chat' | 'call') => {
    if (type === 'chat') {
      toast.success("Demande d'assistance envoyée", {
        description: "Un agent vous contactera par chat pour préciser votre adresse."
      });
    } else {
      toast.success("Demande d'appel envoyée", {
        description: "Un agent vous appellera pour préciser votre adresse."
      });
    }
  };

  return {
    currentStep,
    loading,
    createdRideId,
    selectedDriver,
    bookingSuccess,
    handleNextStep,
    handlePrevStep,
    handleLocationSelect,
    handleUseCurrentLocation,
    handleSelectDriver,
    handleSubmit,
    validateCurrentStep,
    handleAssistanceRequest,
    loadSavedAddresses
  };
}
