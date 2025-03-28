
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { calculateDistance } from '@/utils/locationUtils';
import { TaxiVehicleType, PaymentMethod } from '@/types/taxi';
import { useTaxiPricing } from '@/hooks/taxi/useTaxiPricing';

// Interface pour l'état du formulaire
interface BookingFormState {
  pickupAddress: string;
  pickupLatitude: number | null;
  pickupLongitude: number | null;
  destinationAddress: string;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
  pickupTime: 'now' | 'scheduled';
  scheduledTime: string;
  vehicleType: TaxiVehicleType;
  paymentMethod: PaymentMethod;
  specialInstructions: string;
  promoCode: string;
  isRoundTrip: boolean;
  returnTime: string;
  isSharingEnabled: boolean;
  maxPassengers: number;
}

// Valeurs par défaut
const defaultFormState: BookingFormState = {
  pickupAddress: '',
  pickupLatitude: null,
  pickupLongitude: null,
  destinationAddress: '',
  destinationLatitude: null,
  destinationLongitude: null,
  pickupTime: 'now',
  scheduledTime: '',
  vehicleType: 'standard',
  paymentMethod: 'cash',
  specialInstructions: '',
  promoCode: '',
  isRoundTrip: false,
  returnTime: '',
  isSharingEnabled: false,
  maxPassengers: 1
};

// Interface du contexte
interface BookingFormContextType {
  formState: BookingFormState;
  estimatedPrice: number;
  updateFormState: (update: Partial<BookingFormState>) => void;
  resetForm: () => void;
  getDistanceEstimate: () => number | null;
  handleSharingEnabled: (enabled: boolean) => void;
}

// Création du contexte
const BookingFormContext = createContext<BookingFormContextType | undefined>(undefined);

// Props du provider
interface BookingFormProviderProps {
  children: ReactNode;
}

// Provider du contexte
export const BookingFormProvider: React.FC<BookingFormProviderProps> = ({ children }) => {
  const [formState, setFormState] = useState<BookingFormState>(defaultFormState);
  const { calculatePrice } = useTaxiPricing();
  
  // Met à jour l'état du formulaire
  const updateFormState = (update: Partial<BookingFormState>) => {
    setFormState(prevState => ({ ...prevState, ...update }));
  };
  
  // Réinitialise le formulaire
  const resetForm = () => {
    setFormState(defaultFormState);
  };
  
  // Calcule la distance estimée entre les points de départ et d'arrivée
  const getDistanceEstimate = (): number | null => {
    const { pickupLatitude, pickupLongitude, destinationLatitude, destinationLongitude } = formState;
    
    if (
      pickupLatitude !== null && 
      pickupLongitude !== null && 
      destinationLatitude !== null && 
      destinationLongitude !== null
    ) {
      return calculateDistance(
        pickupLatitude,
        pickupLongitude,
        destinationLatitude,
        destinationLongitude
      );
    }
    
    return null;
  };
  
  // Gère l'activation du partage de trajet
  const handleSharingEnabled = (enabled: boolean) => {
    updateFormState({ 
      isSharingEnabled: enabled,
      maxPassengers: enabled ? 2 : 1 // Par défaut, partagé avec 1 autre personne
    });
  };
  
  // Calcule le prix estimé
  const distance = getDistanceEstimate();
  const estimatedPrice = distance 
    ? calculatePrice(distance, formState.vehicleType) 
    : 0;
  
  // Valeur du contexte
  const contextValue: BookingFormContextType = {
    formState,
    estimatedPrice,
    updateFormState,
    resetForm,
    getDistanceEstimate,
    handleSharingEnabled
  };
  
  return (
    <BookingFormContext.Provider value={contextValue}>
      {children}
    </BookingFormContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useBookingForm = (): BookingFormContextType => {
  const context = useContext(BookingFormContext);
  
  if (context === undefined) {
    throw new Error('useBookingForm must be used within a BookingFormProvider');
  }
  
  return context;
};
