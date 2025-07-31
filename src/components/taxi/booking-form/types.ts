
export interface BookingFormState {
  pickupAddress: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  destinationAddress: string;
  destinationLatitude?: number;
  destinationLongitude?: number;
  pickupTime: 'now' | 'scheduled';
  scheduledTime?: string;
  vehicleType: string;
  paymentMethod: string;
  promoCode?: string;
  specialInstructions?: string;
  isSharedRide: boolean;
}

export interface BookingFormContextType {
  formState: BookingFormState;
  updateFormState: (updates: Partial<BookingFormState>) => void;
  estimatedPrice: number;
  handleSharingEnabled: (enabled: boolean) => void;
  getDistanceEstimate: () => number | null;
}
