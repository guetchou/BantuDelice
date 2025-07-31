
import { mockData } from './mockData';
import { MockApiClient } from '../integrations/api/client';

/**
 * Creates a mock API client that mimics the database client interface
 * but uses local mock data instead of actual API calls.
 */
export function createMockApi(): MockApiClient {
  // Create a new instance of the mock API client
  return new MockApiClient();
}
