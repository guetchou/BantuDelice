
import { BookingFormState } from './types';
import { calculateDistance } from '@/utils/locationUtils';

export const initialBookingFormState: BookingFormState = {
  pickupAddress: '',
  pickupLatitude: null,
  pickupLongitude: null,
  destinationAddress: '',
  destinationLatitude: null,
  destinationLongitude: null,
  pickupTime: 'now',
  scheduledTime: new Date(Date.now() + 30 * 60 * 1000).toISOString().slice(0, 16),
  vehicleType: 'standard',
  paymentMethod: 'cash',
  specialInstructions: '',
  promoCode: '',
  isSharedRide: false,
  maxPassengers: 1
};

export const getDistanceEstimate = (formState: BookingFormState): number | null => {
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
