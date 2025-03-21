
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BookingFormState, BookingFormContextType } from './types';
import { initialBookingFormState, getDistanceEstimate } from './bookingFormUtils';
import { usePriceCalculation } from './usePriceCalculation';

const BookingFormContext = createContext<BookingFormContextType | undefined>(undefined);

export const useBookingForm = () => {
  const context = useContext(BookingFormContext);
  if (!context) {
    throw new Error('useBookingForm must be used within a BookingFormProvider');
  }
  return context;
};

export const BookingFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formState, setFormState] = useState<BookingFormState>(initialBookingFormState);
  const { estimatedPrice } = usePriceCalculation(formState);

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

  return (
    <BookingFormContext.Provider 
      value={{ 
        formState, 
        estimatedPrice,
        updateFormState, 
        handleSharingEnabled,
        getDistanceEstimate: () => getDistanceEstimate(formState)
      }}
    >
      {children}
    </BookingFormContext.Provider>
  );
};
