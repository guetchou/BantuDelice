
/**
 * Configuration utilities for NestJS integration
 */

// Environment variables for NestJS
export const nestConfig = {
  apiUrl: import.meta.env.VITE_NESTJS_API_URL || 'http://localhost:3000/api',
  jwtSecret: import.meta.env.VITE_NESTJS_JWT_SECRET || 'your_jwt_secret',
  directusUrl: import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055',
}

// Helper function to check if NestJS integration is enabled
export const isNestJsEnabled = (): boolean => {
  return !!import.meta.env.VITE_USE_NESTJS_BACKEND === true;
}

// Helper to get the appropriate API URL based on configuration
export const getApiUrl = (endpoint: string): string => {
  return isNestJsEnabled() 
    ? `${nestConfig.apiUrl}${endpoint}` 
    : `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}${endpoint}`;
}
