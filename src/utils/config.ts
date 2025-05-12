
/**
 * Service de configuration pour gérer les clés API et autres paramètres d'application
 */

// Configuration par défaut
const defaultConfig = {
  // API Keys
  mapboxApiKey: '',
  
  // Endpoints
  apiBaseUrl: 'https://api.buntudelice.com',
  
  // Feature flags
  enableDebugMode: false,
  enableNewMapFeatures: true,
};

// Type for configuration
export interface AppConfig {
  mapboxApiKey: string;
  apiBaseUrl: string;
  enableDebugMode: boolean;
  enableNewMapFeatures: boolean;
}

class ConfigService {
  private config: AppConfig;

  constructor() {
    // Initialiser avec les valeurs par défaut
    this.config = { ...defaultConfig };

    // Charger les valeurs depuis le localStorage si elles existent
    this.loadFromStorage();
  }

  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }

  set<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void {
    this.config[key] = value;
    this.saveToStorage();
  }

  getAll(): AppConfig {
    return { ...this.config };
  }

  private loadFromStorage() {
    // Charger les éléments individuels du localStorage
    Object.keys(this.config).forEach((key) => {
      const storedValue = localStorage.getItem(`config_${key}`);
      if (storedValue !== null) {
        try {
          (this.config as any)[key] = JSON.parse(storedValue);
        } catch (e) {
          console.error(`Error parsing stored config for ${key}:`, e);
        }
      }
    });
  }

  private saveToStorage() {
    // Stocker chaque élément individuellement dans localStorage
    Object.entries(this.config).forEach(([key, value]) => {
      localStorage.setItem(`config_${key}`, JSON.stringify(value));
    });
  }

  // Méthode utilitaire pour l'API Mapbox
  getMapboxToken(): string {
    return this.config.mapboxApiKey || '';
  }

  setMapboxToken(token: string): void {
    this.set('mapboxApiKey', token);
  }
}

export const configService = new ConfigService();
