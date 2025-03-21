
import { 
  useDriverDetails,
  useDriverFinder,
  useDriverRequests,
  useRideCreation,
  useTaxiBooking,
  useTaxiBookingCreate,
  useTaxiBookingManage,
  useTaxiBookingQuery
} from './taxi/index';

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

// Exporter une API combinée pour faciliter l'utilisation
export const useTaxiBookingSystem = () => {
  const driverDetails = useDriverDetails();
  const driverFinder = useDriverFinder();
  const driverRequests = useDriverRequests();
  const rideCreation = useRideCreation();
  const taxiBooking = useTaxiBooking();
  const taxiBookingCreate = useTaxiBookingCreate();
  const taxiBookingManage = useTaxiBookingManage();
  const taxiBookingQuery = useTaxiBookingQuery();

  return {
    drivers: {
      ...driverDetails,
      ...driverFinder,
      ...driverRequests
    },
    rides: {
      ...rideCreation,
      ...taxiBooking,
      ...taxiBookingCreate,
      ...taxiBookingManage,
      ...taxiBookingQuery
    }
  };
};
