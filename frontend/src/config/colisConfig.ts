// Configuration pour le module Colis
import { environment } from './environment';

export const colisConfig = {
  // API Endpoints avec URL dynamique selon l'environnement
  api: {
    baseUrl: environment.api.baseUrl,
    endpoints: {
      colis: '/colis',
      tracking: '/tracking',
      national: '/colis/national',
      international: '/colis/international',
      tarifs: '/colis/tarifs',
      notifications: '/colis/notifications'
    }
  },

  // Configuration des villes
  cities: {
    national: [
      'Brazzaville',
      'Pointe-Noire', 
      'Dolisie',
      'Nkayi',
      'Ouesso',
      'Owando',
      'Madingou',
      'Loango',
      'Impfondo',
      'Ewo',
      'Kinkala',
      'Mossendjo',
      'Gamboma',
      'Djambala',
      'Sibiti'
    ],
    international: [
      'Brazzaville',
      'Lyon',
      'Marseille',
      'Bruxelles',
      'Amsterdam',
      'Berlin',
      'Londres',
      'New York',
      'Montréal',
      'Dakar',
      'Abidjan',
      'Lagos',
      'Nairobi',
      'Johannesburg',
      'Le Caire'
    ]
  },

  // Types de colis
  packageTypes: [
    { label: 'Document', value: 'DOCUMENT', maxWeight: 1 },
    { label: 'Petit colis', value: 'SMALL_PACKAGE', maxWeight: 5 },
    { label: 'Moyen colis', value: 'MEDIUM_PACKAGE', maxWeight: 15 },
    { label: 'Gros colis', value: 'LARGE_PACKAGE', maxWeight: 30 },
    { label: 'Fragile', value: 'FRAGILE', maxWeight: 10 },
    { label: 'Électronique', value: 'ELECTRONICS', maxWeight: 20 },
    { label: 'Vêtements', value: 'CLOTHING', maxWeight: 25 },
    { label: 'Autre', value: 'OTHER', maxWeight: 50 }
  ],

  // Vitesses de livraison
  deliverySpeeds: [
    { label: 'Économique', value: 'ECONOMY', multiplier: 1.0, days: '5-7 jours' },
    { label: 'Standard', value: 'STANDARD', multiplier: 1.5, days: '3-5 jours' },
    { label: 'Express', value: 'EXPRESS', multiplier: 2.5, days: '1-2 jours' },
    { label: 'Urgent', value: 'URGENT', multiplier: 4.0, days: 'Même jour' }
  ],

  // Partenaires de livraison
  partners: [
    { name: 'Congo Express', value: 'congo_express', rating: 4.8 },
    { name: 'Taxi Colis', value: 'taxi_colis', rating: 4.5 },
    { name: 'Colis Rapide', value: 'colis_rapide', rating: 4.7 },
    { name: 'Express Congo', value: 'express_congo', rating: 4.6 }
  ],

  // Tarifs de base (en FCFA)
  basePricing: {
    national: {
      base: 2500, // Corrigé pour correspondre à l'interface
      perKg: 500,
      insurance: 2000,
      express: 5000,
      fragile: 1000,
      signature: 1500
    },
    international: {
      base: 15000,
      perKg: 2000,
      insurance: 5000,
      express: 15000,
      fragile: 3000
    }
  },

  // Configuration des notifications
  notifications: {
    types: ['delivery', 'update', 'reminder', 'alert', 'info'],
    retentionDays: 30,
    maxUnread: 50
  },

  // Configuration du suivi
  tracking: {
    updateInterval: 30000, // 30 secondes
    maxRetries: 3,
    statuses: [
      'pending',
      'confirmed',
      'in_transit',
      'out_for_delivery',
      'delivered',
      'cancelled',
      'returned'
    ]
  },

  // Configuration des paiements
  payments: {
    providers: [
      { name: 'MTN MoMo', value: 'mtn_momo', enabled: true },
      { name: 'Airtel Money', value: 'airtel_money', enabled: true },
      { name: 'Carte bancaire', value: 'card', enabled: false },
      { name: 'Espèces', value: 'cash', enabled: true }
    ],
    currencies: ['FCFA', 'USD', 'EUR']
  },

  // Configuration de l'interface
  ui: {
    theme: {
      primary: '#f97316', // orange-500
      secondary: '#fbbf24', // amber-400
      accent: '#f59e0b', // amber-500
      background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fef3c7 100%)'
    },
    animations: {
      duration: 300,
      easing: 'ease-in-out'
    },
    responsive: {
      breakpoints: {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280
      }
    }
  },

  // Configuration des erreurs
  errors: {
    messages: {
      network: 'Erreur de connexion. Veuillez réessayer.',
      notFound: 'Colis non trouvé. Vérifiez le numéro de suivi.',
      unauthorized: 'Accès non autorisé. Veuillez vous connecter.',
      validation: 'Veuillez vérifier les informations saisies.',
      server: 'Erreur serveur. Veuillez réessayer plus tard.'
    }
  },

  // Configuration des tests
  testing: {
    mockData: {
      enabled: import.meta.env?.MODE === 'development',
      delay: 1000
    }
  }
};

// Types TypeScript pour la configuration
export interface ColisConfig {
  api: {
    baseUrl: string;
    endpoints: Record<string, string>;
  };
  cities: {
    national: string[];
    international: string[];
  };
  packageTypes: Array<{
    label: string;
    value: string;
    maxWeight: number;
  }>;
  deliverySpeeds: Array<{
    label: string;
    value: string;
    multiplier: number;
    days: string;
  }>;
  partners: Array<{
    name: string;
    value: string;
    rating: number;
  }>;
  basePricing: {
    national: Record<string, number>;
    international: Record<string, number>;
  };
  notifications: {
    types: string[];
    retentionDays: number;
    maxUnread: number;
  };
  tracking: {
    updateInterval: number;
    maxRetries: number;
    statuses: string[];
  };
  payments: {
    providers: Array<{
      name: string;
      value: string;
      enabled: boolean;
    }>;
    currencies: string[];
  };
  ui: {
    theme: Record<string, string>;
    animations: Record<string, any>;
    responsive: Record<string, any>;
  };
  errors: {
    messages: Record<string, string>;
  };
  testing: {
    mockData: {
      enabled: boolean;
      delay: number;
    };
  };
}

export default colisConfig; 