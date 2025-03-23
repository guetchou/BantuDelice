
// Mock taxi booking functionality
export const useTaxiBooking = () => {
  return {
    drivers: {
      findDrivers: async () => {
        console.log('Finding available drivers...');
        return [];
      },
      requestDriver: async () => {
        console.log('Requesting driver...');
        return null;
      },
      getDriverDetails: async () => {
        console.log('Getting driver details...');
        return null;
      },
    },
    rides: {
      createRide: async () => {
        console.log('Creating ride...');
        return { id: 'ride-' + Math.random().toString(36).substring(2, 9) };
      },
      getRideDetails: async (rideId) => {
        console.log('Getting ride details for ride:', rideId);
        return {
          id: rideId,
          status: 'pending',
          pickup_address: 'Centre-ville, Brazzaville',
          destination_address: 'Aéroport Maya-Maya, Brazzaville',
          estimated_price: 5000,
          created_at: new Date().toISOString(),
        };
      },
      cancelRide: async (rideId) => {
        console.log('Cancelling ride:', rideId);
        return { success: true };
      },
      getAllRides: async () => {
        console.log('Getting all rides...');
        return [];
      },
      createBooking: async (bookingData) => {
        console.log('Creating booking with data:', bookingData);
        return { id: 'booking-' + Math.random().toString(36).substring(2, 9) };
      },
      isLoading: false,
    }
  };
};
