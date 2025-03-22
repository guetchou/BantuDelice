
/**
 * Version simplifiée du hook pour éviter les erreurs de compilation
 */
export function useTaxiDriverSelection() {
  return {
    isLoading: false,
    nearbyDrivers: [],
    selectedDriver: null,
    findOptimalDrivers: async () => [],
    getDriverDetails: async () => null,
    requestDriver: async () => null,
    handleSelectDriver: () => null
  };
}
