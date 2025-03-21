
import { BookingFormState } from './types';
import { calculateDistance } from '@/utils/deliveryOptimization';

export const initialBookingFormState: BookingFormState = {
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
