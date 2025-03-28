
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
  
  const { handleLocationSelect: locationSelectHandler, handleUseCurrentLocation: currentLocationHandler } = useLocationHandler();
  const { selectedDriver, handleSelectDriver } = useDriverSelection();
  const { loading, createdRideId, bookingSuccess, createInitialRide, handleSubmit: submitRide } = useRideCreation();
  const { validateStep } = useFormValidation();
  
  const handleLocationSelect = async (address: string, isPickup: boolean) => {
    await locationSelectHandler(address, isPickup, updateFormState);
  };
  
  const handleUseCurrentLocation = () => {
    currentLocationHandler(updateFormState);
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
            setCurrentStep(prev => prev + 1);
          }
        });
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
  
  const handleSubmit = async () => {
    await submitRide(createdRideId, selectedDriver);
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
    validateCurrentStep
  };
}
