
import { useRestaurantDetails } from "./useRestaurantDetails";
import { useRestaurantTables } from "./useRestaurantTables";
import { useRestaurantReservations } from "./useRestaurantReservations";

export const useRestaurant = (restaurantId: string | undefined) => {
  const { 
    restaurant, 
    isLoading: isLoadingDetails, 
    error: detailsError,
    updateRestaurant 
  } = useRestaurantDetails(restaurantId);

  const {
    tables,
    isLoading: isLoadingTables,
    error: tablesError
  } = useRestaurantTables(restaurantId);

  const {
    reservations,
    isLoading: isLoadingReservations,
    error: reservationsError,
    checkTableAvailability,
    createReservation,
    updateReservation
  } = useRestaurantReservations(restaurantId);

  return {
    restaurant,
    tables,
    reservations,
    isLoading: isLoadingDetails || isLoadingTables || isLoadingReservations,
    error: detailsError || tablesError || reservationsError,
    updateRestaurant,
    checkTableAvailability,
    createReservation,
    updateReservation
  };
};
