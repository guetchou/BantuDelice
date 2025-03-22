
/**
 * Backend API client for the application
 */

import { createMockApi } from '@/utils/mockApi';

// Export the mock API implementation to be used throughout the application
export const supabase = createMockApi();
