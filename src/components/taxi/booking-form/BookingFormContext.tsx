
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { calculateDistance } from '@/utils/deliveryOptimization';

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

interface BookingFormContextType {
  formState: BookingFormState;
  estimatedPrice: number;
  updateFormState: (updates: Partial<BookingFormState>) => void;
  handleSharingEnabled: (enabled: boolean, maxPassengers: number) => void;
  getDistanceEstimate: () => number | null;
}

const initialState: BookingFormState = {
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
};

const BookingFormContext = createContext<BookingFormContextType | undefined>(undefined);

export const useBookingForm = () => {
  const context = useContext(BookingFormContext);
  if (!context) {
    throw new Error('useBookingForm must be used within a BookingFormProvider');
  }
  return context;
};

export const BookingFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formState, setFormState] = useState<BookingFormState>(initialState);
  const [estimatedPrice, setEstimatedPrice] = useState(0);

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

  // Update estimated price when relevant fields change
  React.useEffect(() => {
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

  return (
    <BookingFormContext.Provider 
      value={{ 
        formState, 
        estimatedPrice,
        updateFormState, 
        handleSharingEnabled,
        getDistanceEstimate
      }}
    >
      {children}
    </BookingFormContext.Provider>
  );
};
