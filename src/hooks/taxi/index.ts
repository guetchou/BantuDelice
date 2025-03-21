
import { useTaxiBookingCreate } from './useTaxiBookingCreate';
import { useTaxiBookingManage } from './useTaxiBookingManage';
import { useTaxiBookingQuery } from './useTaxiBookingQuery';
import { useDriverFinderState } from './useDriverFinderState';
import { useDriverSelectionState } from './useDriverSelectionState';
import { useTaxiDriverAvailability } from './useTaxiDriverAvailability';

export {
  useTaxiBookingCreate,
  useTaxiBookingManage,
  useTaxiBookingQuery,
  useDriverFinderState,
  useDriverSelectionState,
  useTaxiDriverAvailability
};

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
