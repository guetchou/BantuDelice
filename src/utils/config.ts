
interface Config {
  mapbox: {
    accessToken: string;
  };
  api: {
    baseUrl: string;
  };
}

class ConfigService {
  private static instance: ConfigService;
  private config: Config;

  private constructor() {
    // Essayer de récupérer les valeurs depuis les variables d'environnement ou utiliser des valeurs par défaut
    const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || localStorage.getItem('mapbox_token') || '';
    
    this.config = {
      mapbox: {
        accessToken: mapboxToken,
      },
      api: {
        baseUrl: import.meta.env.VITE_API_URL || 'https://api.buntudelice.com',
      },
    };
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  public getConfig(): Config {
    return this.config;
  }

  public setMapboxToken(token: string): void {
    this.config.mapbox.accessToken = token;
    localStorage.setItem('mapbox_token', token);
  }
}

export const configService = ConfigService.getInstance();
