
import { mockData } from '@/utils/mockData';

/**
 * Creates a mock API client that mimics the Supabase client interface
 * This implementation allows us to work with a consistent API while using mock data
 */
export const supabase = mockData.mockApi;
