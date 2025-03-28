
import { TaxiVehicleType, PaymentMethod } from '@/types/taxi';

export interface BookingFormState {
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
  isSharedRide: boolean;
  maxPassengers: number;
}

export interface BookingFormContextType {
  formState: BookingFormState;
  estimatedPrice: number;
  updateFormState: (updates: Partial<BookingFormState>) => void;
  handleSharingEnabled: (enabled: boolean, maxPassengers: number) => void;
  getDistanceEstimate: () => number | null;
}
