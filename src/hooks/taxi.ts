
// Fonctions d'utilités pour éviter les importations circulaires
const useDriverDetails = () => ({
  isLoading: false,
  getDriverDetails: async () => null
});

const useDriverFinder = () => ({
  isLoading: false,
  findOptimalDrivers: async () => []
});

const useDriverRequests = () => ({
  isLoading: false,
  requestDriver: async () => null
});

const useRideCreation = () => ({
  isLoading: false,
  createRide: async () => null
});

// Version simplifiée du hook useTaxiBooking pour éviter les dépendances circulaires
const useTaxiBooking = () => ({
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
});

const useTaxiBookingCreate = () => ({
  isLoading: false,
  createBooking: async () => null
});

const useTaxiBookingManage = () => ({
  isLoading: false,
  cancelRide: async () => null
});

const useTaxiBookingQuery = () => ({
  isLoading: false,
  getAllRides: async () => []
});

export {
  useDriverDetails,
  useDriverFinder,
  useDriverRequests,
  useRideCreation,
  useTaxiBooking,
  useTaxiBookingCreate,
  useTaxiBookingManage,
  useTaxiBookingQuery
};

// Exporte une API combinée simplifiée
export const useTaxiBookingSystem = () => {
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
