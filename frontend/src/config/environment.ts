// Configuration d'environnement centralisée
export const environment = {
  // Mode d'environnement
  mode: import.meta.env.MODE || 'development',
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',
  
  // URLs de base selon l'environnement
  api: {
    baseUrl: (() => {
      // Priorité aux variables d'environnement
      if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
      }
      
      // Fallback selon l'environnement
      if (import.meta.env.MODE === 'development') {
        return 'http://localhost:3001/api';
      }
      
      // Production - URL par défaut (à adapter selon votre backend)
      return 'https://api.bantudelice.com/api';
    })(),
    
    // Endpoints spécifiques
    endpoints: {
      colis: '/colis',
      tracking: '/tracking',
      payments: '/payments',
      notifications: '/notifications',
      stats: '/stats',
      expeditions: '/expeditions'
    }
  },
  
  // WebSocket configuration
  websocket: {
    url: (() => {
      if (import.meta.env.VITE_WS_URL) {
        return import.meta.env.VITE_WS_URL;
      }
      
      if (import.meta.env.MODE === 'development') {
        return 'ws://localhost:9595';
      }
      
      return 'wss://api.bantudelice.com/ws';
    })(),
    
    options: {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    }
  },
  
  // Configuration de l'application
  app: {
    url: import.meta.env.VITE_APP_URL || (() => {
      if (import.meta.env.MODE === 'development') {
        return 'http://localhost:9595';
      }
      return 'https://bantudelice.com';
    })(),
    
    name: 'BantuDelice',
    version: '1.0.0'
  },
  
  // Configuration des services externes
  services: {
    mapbox: {
      token: import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiZGVmYXVsdCIsImEiOiJleGFtcGxlIn0.default'
    },
    
    payments: {
      providers: ['mtn_momo', 'airtel_money', 'card', 'cash'],
      currency: 'FCFA'
    }
  },
  
  // Configuration des fonctionnalités
  features: {
    notifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false',
    geolocation: import.meta.env.VITE_ENABLE_GEOLOCATION !== 'false',
    tracking: true,
    payments: true
  },
  
  // Configuration du debug
  debug: {
    enabled: import.meta.env.VITE_DEBUG === 'true',
    level: import.meta.env.VITE_LOG_LEVEL || 'info',
    apiLogging: import.meta.env.MODE === 'development'
  }
};

// Types TypeScript
export interface Environment {
  mode: string;
  isDevelopment: boolean;
  isProduction: boolean;
  api: {
    baseUrl: string;
    endpoints: Record<string, string>;
  };
  websocket: {
    url: string;
    options: {
      autoConnect: boolean;
      reconnection: boolean;
      reconnectionAttempts: number;
      reconnectionDelay: number;
    };
  };
  app: {
    url: string;
    name: string;
    version: string;
  };
  services: {
    mapbox: {
      token: string;
    };
    payments: {
      providers: string[];
      currency: string;
    };
  };
  features: {
    notifications: boolean;
    geolocation: boolean;
    tracking: boolean;
    payments: boolean;
  };
  debug: {
    enabled: boolean;
    level: string;
    apiLogging: boolean;
  };
}

export default environment; 