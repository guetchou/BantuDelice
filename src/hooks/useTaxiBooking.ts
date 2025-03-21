
import { useTaxiBookingCreate } from './taxi/useTaxiBookingCreate';
import { useTaxiBookingManage } from './taxi/useTaxiBookingManage';
import { useTaxiBookingQuery } from './taxi/useTaxiBookingQuery';

export function useTaxiBooking() {
  const { isLoading: isCreateLoading, createBooking } = useTaxiBookingCreate();
  const { isLoading: isManageLoading, cancelBooking } = useTaxiBookingManage();
  const { isLoading: isQueryLoading, getUserRides, getRideDetails } = useTaxiBookingQuery();

  // Combined loading state
  const isLoading = isCreateLoading || isManageLoading || isQueryLoading;

  return {
    isLoading,
    createBooking,
    cancelBooking,
    getUserRides,
    getRideDetails
  };
}
