
/**
 * Configuration service for managing application settings
 */
export const configService = {
  /**
   * Get the Mapbox API key
   */
  getMapboxToken: () => {
    return 'pk.eyJ1IjoiYW1iYW5ndWUtZ2VuIiwiYSI6ImNtY3ltcWxkdDBpZ3Iya3B0d3plZnlmOTAifQ.3vE9ABAWFFITz0uknCk2LQ';
  },
  
  /**
   * Get the base API URL
   */
  getApiBaseUrl: () => {
    return import.meta.env?.VITE_API_URL || 'https://api.buntudelice.com';
  },
  
  /**
   * Get environment name
   */
  getEnvironment: () => {
    return import.meta.env?.MODE || 'development';
  },
  
  /**
   * Check if in development environment
   */
  isDevelopment: () => {
    return (import.meta.env?.MODE || 'development') === 'development';
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
