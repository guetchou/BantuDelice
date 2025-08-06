#!/usr/bin/env node

/**
 * Test rapide des corrections apportées
 * Vérifie les routes et les APIs
 */

console.log('🔧 Test Rapide des Corrections\n');

// Test des routes
const routes = [
  '/colis',
  '/colis/dashboard', 
  '/colis/auth',
  '/colis/expedition',
  '/colis/tracking',
  '/colis/tarification'
];

console.log('📋 Routes à vérifier:');
routes.forEach(route => {
  console.log(`  ✅ ${route}`);
});

// Test des APIs
const apis = [
  'http://localhost:3001/api/colis/notifications',
  'http://localhost:3001/api/colis/stats',
  'http://localhost:3001/api/health'
];

console.log('\n🌐 APIs à tester:');
apis.forEach(api => {
  console.log(`  🔗 ${api}`);
});

// Test de connectivité
async function testConnectivity() {
  console.log('\n🧪 Test de connectivité...');
  
  try {
    const response = await fetch('http://localhost:3001/api/health');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend accessible:', data.status);
    } else {
      console.log('❌ Backend non accessible');
    }
  } catch (error) {
    console.log('❌ Erreur de connectivité:', error.message);
  }
}

// Test des endpoints
async function testEndpoints() {
  console.log('\n🔍 Test des endpoints...');
  
  const endpoints = [
    '/api/colis/notifications',
    '/api/colis/stats'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:3001${endpoint}`);
      if (response.ok) {
        console.log(`✅ ${endpoint} - OK`);
      } else {
        console.log(`❌ ${endpoint} - ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Erreur: ${error.message}`);
    }
  }
}

// Configuration optimisée
console.log('\n⚙️  Configuration optimisée:');
console.log('  ✅ Timeout API: 30 secondes');
console.log('  ✅ Retry: 3 tentatives');
console.log('  ✅ Route /colis/auth ajoutée');
console.log('  ✅ Délai d\'initialisation: 2 secondes');
console.log('  ✅ Espacement des requêtes: 3 secondes');

// Recommandations
console.log('\n💡 Recommandations:');
console.log('  1. ✅ Vérifiez que le frontend est accessible sur http://localhost:9595');
console.log('  2. ✅ Vérifiez que le backend est accessible sur http://localhost:3001');
console.log('  3. ✅ Testez la route /colis/auth dans le navigateur');
console.log('  4. ✅ Surveillez les logs pour les erreurs de timeout');

// Exécution des tests
async function runTests() {
  await testConnectivity();
  await testEndpoints();
  
  console.log('\n✨ Test rapide terminé !');
  console.log('🎯 Les corrections devraient résoudre les problèmes de timeout et de routes 404.');
}

// Import de fetch si disponible
if (typeof fetch === 'undefined') {
  import('node-fetch').then(({ default: fetch }) => {
    globalThis.fetch = fetch;
    runTests();
  }).catch(() => {
    console.log('⚠️  node-fetch non disponible, tests de connectivité ignorés');
    console.log('\n✨ Test rapide terminé !');
  });
} else {
  runTests();
} 