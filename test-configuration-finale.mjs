#!/usr/bin/env node

/**
 * Script de test final pour vérifier la configuration d'environnement
 * Teste les URLs, la connectivité et les endpoints
 */

// Import de fetch pour Node.js
import('node-fetch').then(({ default: fetch }) => {
  globalThis.fetch = fetch;
  runTests();
}).catch(() => {
  console.log('⚠️  node-fetch non disponible, tests de connectivité ignorés');
  runTests();
});

console.log('🔧 Test Final de la Configuration d\'Environnement\n');

// Configuration de test
const testConfigs = [
  {
    name: 'Développement',
    env: {
      MODE: 'development',
      VITE_API_URL: 'http://localhost:3001/api',
      VITE_WS_URL: 'ws://localhost:9595',
      VITE_APP_URL: 'http://localhost:9595'
    }
  },
  {
    name: 'Production',
    env: {
      MODE: 'production',
      VITE_API_URL: 'https://api.bantudelice.com/api',
      VITE_WS_URL: 'wss://api.bantudelice.com/ws',
      VITE_APP_URL: 'https://bantudelice.com'
    }
  }
];

// Simulation de la configuration d'environnement
function simulateEnvironmentConfig(env) {
  const mode = env.MODE || 'development';
  const isDevelopment = mode === 'development';
  const isProduction = mode === 'production';
  
  const api = {
    baseUrl: env.VITE_API_URL || (isDevelopment ? 'http://localhost:3001/api' : 'https://api.bantudelice.com/api'),
    endpoints: {
      colis: '/colis',
      tracking: '/tracking',
      payments: '/payments',
      notifications: '/notifications',
      stats: '/stats',
      expeditions: '/expeditions',
      health: '/health'
    }
  };
  
  const websocket = {
    url: env.VITE_WS_URL || (isDevelopment ? 'ws://localhost:9595' : 'wss://api.bantudelice.com/ws')
  };
  
  const app = {
    url: env.VITE_APP_URL || (isDevelopment ? 'http://localhost:9595' : 'https://bantudelice.com')
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

// Test de connectivité HTTP
async function testHttpConnectivity(url, timeout = 5000) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent': 'BantuDelice-Test/1.0'
      }
    });
    
    clearTimeout(timeoutId);
    
    return {
      success: true,
      status: response.status,
      statusText: response.statusText,
      url: url
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      url: url
    };
  }
}

// Test des endpoints API
async function testApiEndpoints(baseUrl, endpoints) {
  const results = {};
  
  for (const [name, endpoint] of Object.entries(endpoints)) {
    const url = `${baseUrl}${endpoint}`;
    results[name] = await testHttpConnectivity(url, 3000);
  }
  
  return results;
}

// Test de la configuration complète
async function testConfiguration(config) {
  console.log(`📋 Test: ${config.name}`);
  console.log('─'.repeat(60));
  
  console.log(`Mode: ${config.mode}`);
  console.log(`Développement: ${config.isDevelopment}`);
  console.log(`Production: ${config.isProduction}`);
  console.log(`API Base URL: ${config.api.baseUrl}`);
  console.log(`WebSocket URL: ${config.websocket.url}`);
  console.log(`App URL: ${config.app.url}`);
  
  // Test de connectivité de base
  console.log('\n🔗 Test de connectivité de base:');
  const baseConnectivity = await testHttpConnectivity(config.app.url);
  if (baseConnectivity.success) {
    console.log(`✅ App accessible: ${config.app.url} (${baseConnectivity.status})`);
  } else {
    console.log(`❌ App non accessible: ${config.app.url} - ${baseConnectivity.error}`);
  }
  
  // Test des endpoints API
  console.log('\n🌐 Test des endpoints API:');
  const apiResults = await testApiEndpoints(config.api.baseUrl, config.api.endpoints);
  
  let successCount = 0;
  let totalCount = 0;
  
  for (const [endpoint, result] of Object.entries(apiResults)) {
    totalCount++;
    const status = result.success ? '✅' : '❌';
    const details = result.success 
      ? `(${result.status})` 
      : `- ${result.error}`;
    
    console.log(`${status} ${endpoint}: ${config.api.baseUrl}${config.api.endpoints[endpoint]} ${details}`);
    
    if (result.success) {
      successCount++;
    }
  }
  
  // Résumé
  console.log(`\n📊 Résumé API: ${successCount}/${totalCount} endpoints accessibles`);
  
  // Test de validation des URLs
  console.log('\n🔍 Validation des URLs:');
  
  const urlValidation = {
    api: config.api.baseUrl.startsWith(config.isDevelopment ? 'http://' : 'https://'),
    websocket: config.websocket.url.startsWith(config.isDevelopment ? 'ws://' : 'wss://'),
    app: config.app.url.startsWith(config.isDevelopment ? 'http://' : 'https://')
  };
  
  console.log(`${urlValidation.api ? '✅' : '❌'} API URL protocol: ${config.api.baseUrl.split('://')[0]}`);
  console.log(`${urlValidation.websocket ? '✅' : '❌'} WebSocket URL protocol: ${config.websocket.url.split('://')[0]}`);
  console.log(`${urlValidation.app ? '✅' : '❌'} App URL protocol: ${config.app.url.split('://')[0]}`);
  
  // Score global
  const globalScore = Math.round((successCount / totalCount) * 100);
  console.log(`\n🎯 Score global: ${globalScore}%`);
  
  if (globalScore >= 80) {
    console.log('✅ Configuration excellente !');
  } else if (globalScore >= 60) {
    console.log('⚠️  Configuration acceptable avec quelques problèmes');
  } else {
    console.log('❌ Configuration problématique, vérification requise');
  }
  
  console.log('\n' + '─'.repeat(60) + '\n');
  
  return {
    config: config.name,
    score: globalScore,
    apiResults,
    urlValidation
  };
}

// Fonction principale de test
async function runTests() {
  console.log('🚀 Démarrage des tests de configuration...\n');
  
  const results = [];
  
  // Test de chaque configuration
  for (const testConfig of testConfigs) {
    const config = simulateEnvironmentConfig(testConfig.env);
    const result = await testConfiguration(config);
    results.push(result);
  }
  
  // Résumé global
  console.log('📋 RÉSUMÉ GLOBAL DES TESTS');
  console.log('='.repeat(60));
  
  results.forEach(result => {
    const status = result.score >= 80 ? '✅' : result.score >= 60 ? '⚠️' : '❌';
    console.log(`${status} ${result.config}: ${result.score}%`);
  });
  
  // Recommandations
  console.log('\n💡 RECOMMANDATIONS:');
  console.log('─'.repeat(60));
  
  const devResult = results.find(r => r.config === 'Développement');
  const prodResult = results.find(r => r.config === 'Production');
  
  if (devResult && devResult.score < 80) {
    console.log('🔧 Pour le développement:');
    console.log('  - Vérifiez que le backend local est démarré sur le port 3001');
    console.log('  - Vérifiez que le frontend est accessible sur le port 9595');
    console.log('  - Vérifiez les logs du serveur de développement');
  }
  
  if (prodResult && prodResult.score < 80) {
    console.log('🌐 Pour la production:');
    console.log('  - Vérifiez que le backend est déployé et accessible');
    console.log('  - Vérifiez la configuration SSL/HTTPS');
    console.log('  - Vérifiez la configuration CORS');
    console.log('  - Utilisez le script de déploiement: ./scripts/deploy-production.sh');
  }
  
  // Tests de sécurité
  console.log('\n🔒 TESTS DE SÉCURITÉ:');
  console.log('─'.repeat(60));
  
  const securityChecks = [
    { name: 'HTTPS en production', check: prodResult?.urlValidation?.api },
    { name: 'WSS en production', check: prodResult?.urlValidation?.websocket },
    { name: 'URLs sécurisées', check: prodResult?.urlValidation?.app }
  ];
  
  securityChecks.forEach(check => {
    const status = check.check ? '✅' : '❌';
    console.log(`${status} ${check.name}`);
  });
  
  // Commandes utiles
  console.log('\n🛠️  COMMANDES UTILES:');
  console.log('─'.repeat(60));
  console.log('# Tester la connectivité manuellement:');
  console.log('curl -I http://localhost:3001/api/health');
  console.log('curl -I https://api.bantudelice.com/api/health');
  console.log('');
  console.log('# Vérifier les logs:');
  console.log('tail -f /var/log/nginx/error.log');
  console.log('journalctl -u nginx -f');
  console.log('');
  console.log('# Redémarrer les services:');
  console.log('sudo systemctl restart nginx');
  console.log('sudo systemctl restart backend-service');
  
  console.log('\n✨ Tests terminés !');
  
  // Code de sortie basé sur les résultats
  const hasErrors = results.some(r => r.score < 60);
  process.exit(hasErrors ? 1 : 0);
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Erreur non gérée:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Exception non capturée:', error);
  process.exit(1);
}); 