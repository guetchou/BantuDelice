
/**
 * Supabase client replacement with mock functionality
 * 
 * This is a replacement for the Supabase client that uses our own API client
 * This maintains the same interface while switching the implementation
 */

import { mockApi } from '../api/client';

// Export the mock implementation with the same interface as Supabase
export const supabase = mockApi;
