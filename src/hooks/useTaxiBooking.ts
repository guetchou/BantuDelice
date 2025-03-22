
// Simple function to avoid circular dependencies
export const useTaxiBooking = () => {
  return {
    drivers: {
      findDrivers: async () => [],
      requestDriver: async () => null,
      getDriverDetails: async () => null,
    },
    rides: {
      createRide: async () => null,
      getRideDetails: async () => null,
      cancelRide: async () => null,
      getAllRides: async () => [],
      createBooking: async () => null,
      isLoading: false,
    }
  };
};
