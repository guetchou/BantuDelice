
/**
 * Configuration service for managing application settings
 */
export const configService = {
  /**
   * Get the Mapbox API key
   */
  getMapboxToken: () => {
    return 'pk.placeholder.replace.with.your.token'; // Replace with your actual token
  },
  
  /**
   * Get the base API URL
   */
  getApiBaseUrl: () => {
    return process.env.REACT_APP_API_URL || 'https://api.buntudelice.com';
  },
  
  /**
   * Get environment name
   */
  getEnvironment: () => {
    return process.env.NODE_ENV || 'development';
  },
  
  /**
   * Check if in development environment
   */
  isDevelopment: () => {
    return (process.env.NODE_ENV || 'development') === 'development';
  },
  
  /**
   * Get currency settings
   */
  getCurrencySettings: () => {
    return {
      code: 'XAF',
      symbol: 'FCFA',
      locale: 'fr-FR'
    };
  },
  
  /**
   * Get ride sharing settings
   */
  getRideSharingSettings: () => {
    return {
      minDistance: 1, // km
      maxDistance: 50, // km
      basePrice: 500, // FCFA
      pricePerKm: 150 // FCFA
    };
  }
};
