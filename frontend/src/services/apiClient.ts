import { environment } from '@/config/environment';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error?: string;
  message?: string;
  status?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = environment.api.baseUrl;
  }

  /**
   * Effectue une requête HTTP simple et efficace
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Log de la requête en mode debug
    if (environment.debug.apiLogging) {
      console.log(`🌐 API Request: ${url}`, {
        method: config.method || 'GET',
        headers: config.headers,
      });
    }

    try {
      const response = await fetch(url, config);

      // Gestion des erreurs HTTP
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (parseError) {
          console.warn('Impossible de parser la réponse d\'erreur:', parseError);
        }
        
        if (environment.debug.apiLogging) {
          console.error(`❌ API Error (${endpoint}):`, errorMessage);
        }
        
        return {
          success: false,
          data: null as T,
          error: errorMessage,
          message: `Erreur lors de l'appel à ${endpoint}`,
          status: response.status,
        };
      }

      // Parser la réponse JSON
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error(`❌ JSON Parse Error (${endpoint}):`, parseError);
        return {
          success: false,
          data: null as T,
          error: 'Réponse invalide du serveur',
          message: 'Impossible de lire la réponse du serveur',
        };
      }

      if (environment.debug.apiLogging) {
        console.log(`✅ API Success (${endpoint}):`, data);
      }

      return {
        success: true,
        data,
        status: response.status,
      };

    } catch (error) {
      // Gestion des erreurs réseau
      if (environment.debug.apiLogging) {
        console.error(`❌ Network Error (${endpoint}):`, error);
      }

      let errorMessage = 'Erreur de connexion';
      let userMessage = 'Impossible de se connecter au serveur';

      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Erreur réseau';
        userMessage = 'Vérifiez votre connexion internet';
      } else if (error instanceof Error) {
        errorMessage = error.message;
        userMessage = 'Une erreur inattendue s\'est produite';
      }

      return {
        success: false,
        data: null as T,
        error: errorMessage,
        message: userMessage,
      };
    }
  }

  // Méthodes HTTP
  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // Méthodes utilitaires
  getBaseUrl(): string {
    return this.baseUrl;
  }

  isOnline(): boolean {
    return navigator.onLine;
  }

  // Méthode pour tester la connectivité
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.get('/health');
      return response.success;
    } catch {
      return false;
    }
  }
}

// Instance singleton
export const apiClient = new ApiClient();

export default apiClient; 