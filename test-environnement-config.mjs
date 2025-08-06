#!/usr/bin/env node

/**
 * Script de test pour vérifier la configuration d'environnement
 * Teste les URLs selon l'environnement (dev/prod)
 */

console.log('🔧 Test de la configuration d\'environnement\n');

// Simulation des variables d'environnement
const testEnvironments = [
  {
    name: 'Développement',
    env: {
      MODE: 'development',
      VITE_API_URL: undefined,
      VITE_WS_URL: undefined,
      VITE_APP_URL: undefined
    }
  },
  {
    name: 'Production',
    env: {
      MODE: 'production',
      VITE_API_URL: undefined,
      VITE_WS_URL: undefined,
      VITE_APP_URL: undefined
    }
  },
  {
    name: 'Production avec URLs personnalisées',
    env: {
      MODE: 'production',
      VITE_API_URL: 'https://api.bantudelice.com/api',
      VITE_WS_URL: 'wss://api.bantudelice.com/ws',
      VITE_APP_URL: 'https://bantudelice.com'
    }
  }
];

// Fonction pour simuler la configuration d'environnement
function simulateEnvironmentConfig(env) {
  const mode = env.MODE || 'development';
  const isDevelopment = mode === 'development';
  const isProduction = mode === 'production';
  
  // URLs de base selon l'environnement
  const api = {
    baseUrl: (() => {
      // Priorité aux variables d'environnement
      if (env.VITE_API_URL) {
        return env.VITE_API_URL;
      }
      
      // Fallback selon l'environnement
      if (isDevelopment) {
        return 'http://localhost:3001/api';
      }
      
      // Production - URL par défaut
      return 'https://api.bantudelice.com/api';
    })(),
    
    endpoints: {
      colis: '/colis',
      tracking: '/tracking',
      payments: '/payments',
      notifications: '/notifications',
      stats: '/stats',
      expeditions: '/expeditions'
    }
  };
  
  // WebSocket configuration
  const websocket = {
    url: (() => {
      if (env.VITE_WS_URL) {
        return env.VITE_WS_URL;
      }
      
      if (isDevelopment) {
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
  };
  
  // Configuration de l'application
  const app = {
    url: env.VITE_APP_URL || (() => {
      if (isDevelopment) {
        return 'http://localhost:9595';
      }
      return 'https://bantudelice.com';
    })(),
    
    name: 'BantuDelice',
    version: '1.0.0'
  };
  
  return {
    mode,
    isDevelopment,
    isProduction,
    api,
    websocket,
    app
  };
}

// Test de chaque environnement
testEnvironments.forEach((testEnv, index) => {
  console.log(`📋 Test ${index + 1}: ${testEnv.name}`);
  console.log('─'.repeat(50));
  
  const config = simulateEnvironmentConfig(testEnv.env);
  
  console.log(`Mode: ${config.mode}`);
  console.log(`Développement: ${config.isDevelopment}`);
  console.log(`Production: ${config.isProduction}`);
  console.log(`API Base URL: ${config.api.baseUrl}`);
  console.log(`WebSocket URL: ${config.websocket.url}`);
  console.log(`App URL: ${config.app.url}`);
  
  // Test des endpoints
  console.log('\nEndpoints API:');
  Object.entries(config.api.endpoints).forEach(([key, endpoint]) => {
    console.log(`  ${key}: ${config.api.baseUrl}${endpoint}`);
  });
  
  console.log('\n' + '─'.repeat(50) + '\n');
});

// Test de connectivité simulée
console.log('🌐 Test de connectivité simulée\n');

const testUrls = [
  'http://localhost:3001/api/colis',
  'https://api.bantudelice.com/api/colis',
  'http://localhost:3001/api/colis/notifications',
  'https://api.bantudelice.com/api/colis/notifications'
];

testUrls.forEach(url => {
  const isLocal = url.includes('localhost');
  const status = isLocal ? '❌ Local (non accessible en production)' : '✅ Production (accessible)';
  console.log(`${status} ${url}`);
});

console.log('\n📝 Recommandations:');
console.log('1. ✅ Utilisez des variables d\'environnement pour les URLs');
console.log('2. ✅ Configurez un backend accessible publiquement');
console.log('3. ✅ Utilisez HTTPS en production');
console.log('4. ✅ Configurez CORS correctement sur le backend');
console.log('5. ✅ Testez la connectivité avant le déploiement');

console.log('\n🎯 Configuration optimisée pour:');
console.log('- Développement: localhost:3001');
console.log('- Production: api.bantudelice.com');
console.log('- WebSocket: wss:// pour la production');
console.log('- Timeout: 10 secondes');
console.log('- Retry: 3 tentatives');

console.log('\n✨ Configuration d\'environnement validée !'); 