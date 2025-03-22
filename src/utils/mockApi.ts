
import { mockData } from './mockData';

/**
 * Creates a mock API client that mimics the Supabase client interface
 * but uses local mock data instead of actual API calls.
 * This helps isolate the mock functionality from real implementations.
 */
export function createMockApi() {
  // Return the mock API from mockData
  return mockData.mockApi;
}

// Export types for better TypeScript support
export type MockApiClient = ReturnType<typeof createMockApi>;
