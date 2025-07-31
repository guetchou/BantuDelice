
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TaxiDriver, TaxiVehicleType, PaymentMethod } from '@/types/taxi';

export interface BookingFormState {
  pickupAddress: string;
  pickupCoordinates?: [number, number];
  destinationAddress: string;
  destinationCoordinates?: [number, number];
  vehicleType: TaxiVehicleType;
  pickupTime: 'now' | 'scheduled';
  scheduledTime: string;
  paymentMethod: PaymentMethod;
  promoCode: string;
  contactName: string;
  contactPhone: string;
  specialInstructions: string;
  selectedDriver: TaxiDriver | null;
  estimatedPrice: number;
  estimatedDistance: number;
  estimatedDuration: number;
}

interface BookingFormContextType {
  formState: BookingFormState;
  setFormState: React.Dispatch<React.SetStateAction<BookingFormState>>;
  updateFormField: <K extends keyof BookingFormState>(
    field: K, 
    value: BookingFormState[K]
  ) => void;
}

const BookingFormContext = createContext<BookingFormContextType | undefined>(undefined);

export const initialFormState: BookingFormState = {
  pickupAddress: '',
  pickupCoordinates: undefined,
  destinationAddress: '',
  destinationCoordinates: undefined,
  vehicleType: 'standard',
  pickupTime: 'now',
  scheduledTime: new Date(Date.now() + 30 * 60 * 1000).toISOString().slice(0, 16),
  paymentMethod: 'cash',
  promoCode: '',
  contactName: '',
  contactPhone: '',
  specialInstructions: '',
  selectedDriver: null,
  estimatedPrice: 0,
  estimatedDistance: 0,
  estimatedDuration: 0
};

export const BookingFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formState, setFormState] = useState<BookingFormState>(initialFormState);

  const updateFormField = <K extends keyof BookingFormState>(
    field: K, 
    value: BookingFormState[K]
  ) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <BookingFormContext.Provider value={{ formState, setFormState, updateFormField }}>
      {children}
    </BookingFormContext.Provider>
  );
};

export const useBookingForm = () => {
  const context = useContext(BookingFormContext);
  if (context === undefined) {
    throw new Error('useBookingForm must be used within a BookingFormProvider');
  }
  return context;
};
