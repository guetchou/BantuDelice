
import { configService } from '@/utils/config';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  is_open?: boolean;
}

export async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const config = configService.getConfig();
  const baseUrl = config.api.baseUrl;
  
  // Récupérer le token d'authentification depuis localStorage ou d'ailleurs
  const authToken = localStorage.getItem('auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : Record<string, unknown>),
    ...(options.headers || {}),
  };
  
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
