
export interface BookingFormState {
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

export interface BookingFormContextType {
  formState: BookingFormState;
  estimatedPrice: number;
  updateFormState: (updates: Partial<BookingFormState>) => void;
  handleSharingEnabled: (enabled: boolean, maxPassengers: number) => void;
  getDistanceEstimate: () => number | null;
}
