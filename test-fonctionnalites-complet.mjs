#!/usr/bin/env node

/**
 * Test Complet des Fonctionnalités BantuDelice
 * Vérifie l'authentification, les APIs, le tracking et le dashboard
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001/api';
const FRONTEND_URL = 'http://localhost:9595';

// Couleurs pour les logs
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, success, details = '') {
  const status = success ? '✅ PASS' : '❌ FAIL';
  const color = success ? 'green' : 'red';
  log(`${status} ${testName}`, color);
  if (details) {
    log(`   ${details}`, 'yellow');
  }
}

async function testAPI(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function testFrontendPage(path) {
  try {
    const response = await fetch(`${FRONTEND_URL}${path}`);
    return {
      success: response.ok,
      status: response.status,
      hasContent: response.headers.get('content-type')?.includes('text/html')
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function runTests() {
  log('🚀 Test Complet des Fonctionnalités BantuDelice', 'bold');
  log('='.repeat(60), 'blue');
  
  // Test 1: Santé du Backend
  log('\n📊 Test 1: Santé du Backend', 'bold');
  const healthTest = await testAPI('/colis/health');
  logTest('Backend Health Check', healthTest.success, 
    healthTest.success ? 'Service opérationnel' : healthTest.error);
  
  // Test 2: API Notifications
  log('\n📱 Test 2: API Notifications', 'bold');
  const notificationsTest = await testAPI('/colis/notifications');
  logTest('Notifications API', notificationsTest.success,
    notificationsTest.success ? 'Notifications récupérées' : 'Erreur notifications');
  
  // Test 3: API Statistiques
  log('\n📈 Test 3: API Statistiques', 'bold');
  const statsTest = await testAPI('/colis/stats');
  logTest('Statistiques API', statsTest.success,
    statsTest.success ? `Total colis: ${statsTest.data?.data?.totalColis || 0}` : 'Erreur stats');
  
  // Test 4: API Expéditions
  log('\n📦 Test 4: API Expéditions', 'bold');
  const expeditionsTest = await testAPI('/colis/expeditions');
  logTest('Expéditions API', expeditionsTest.success,
    expeditionsTest.success ? `${expeditionsTest.data?.data?.length || 0} expéditions trouvées` : 'Erreur expéditions');
  
  // Test 5: API Tracking
  log('\n📍 Test 5: API Tracking', 'bold');
  const trackingTest = await testAPI('/tracking/BD123456');
  logTest('Tracking API', trackingTest.success,
    trackingTest.success ? `Status: ${trackingTest.data?.data?.status || 'N/A'}` : 'Erreur tracking');
  
  // Test 6: API Historique Tracking
  log('\n📋 Test 6: API Historique Tracking', 'bold');
  const historyTest = await testAPI('/tracking/BD123456/history');
  logTest('Historique Tracking API', historyTest.success,
    historyTest.success ? `${historyTest.data?.data?.length || 0} événements` : 'Erreur historique');
  
  // Test 7: API Paiements
  log('\n💳 Test 7: API Paiements', 'bold');
  const paymentTest = await testAPI('/payments/process', 'POST', {
    amount: 5000,
    method: 'mtn_momo',
    phone: '242064352209'
  });
  logTest('Paiements API', paymentTest.success,
    paymentTest.success ? 'Paiement traité' : paymentTest.data?.message || 'Erreur paiement');
  
  // Test 8: Frontend - Page d'accueil
  log('\n🌐 Test 8: Frontend - Page d\'accueil', 'bold');
  const homeTest = await testFrontendPage('/');
  logTest('Page d\'accueil', homeTest.success && homeTest.hasContent,
    homeTest.success ? 'Page accessible' : 'Page non accessible');
  
  // Test 9: Frontend - Page Colis
  log('\n📦 Test 9: Frontend - Page Colis', 'bold');
  const colisTest = await testFrontendPage('/colis');
  logTest('Page Colis', colisTest.success && colisTest.hasContent,
    colisTest.success ? 'Page accessible' : 'Page non accessible');
  
  // Test 10: Frontend - Page Auth
  log('\n🔐 Test 10: Frontend - Page Auth', 'bold');
  const authTest = await testFrontendPage('/colis/auth');
  logTest('Page Auth', authTest.success && authTest.hasContent,
    authTest.success ? 'Page accessible' : 'Page non accessible');
  
  // Test 11: Frontend - Dashboard
  log('\n📊 Test 11: Frontend - Dashboard', 'bold');
  const dashboardTest = await testFrontendPage('/colis/dashboard');
  logTest('Dashboard', dashboardTest.success && dashboardTest.hasContent,
    dashboardTest.success ? 'Page accessible' : 'Page non accessible');
  
  // Test 12: Frontend - Expédition
  log('\n🚚 Test 12: Frontend - Expédition', 'bold');
  const expeditionTest = await testFrontendPage('/colis/expedition');
  logTest('Page Expédition', expeditionTest.success && expeditionTest.hasContent,
    expeditionTest.success ? 'Page accessible' : 'Page non accessible');
  
  // Résumé
  log('\n' + '='.repeat(60), 'blue');
  log('📋 Résumé des Tests', 'bold');
  log('='.repeat(60), 'blue');
  
  const totalTests = 12;
  const passedTests = [
    healthTest.success,
    notificationsTest.success,
    statsTest.success,
    expeditionsTest.success,
    trackingTest.success,
    historyTest.success,
    paymentTest.success,
    homeTest.success && homeTest.hasContent,
    colisTest.success && colisTest.hasContent,
    authTest.success && authTest.hasContent,
    dashboardTest.success && dashboardTest.hasContent,
    expeditionTest.success && expeditionTest.hasContent
  ].filter(Boolean).length;
  
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);
  
  log(`Tests réussis: ${passedTests}/${totalTests} (${successRate}%)`, 
    passedTests === totalTests ? 'green' : 'yellow');
  
  if (passedTests === totalTests) {
    log('🎉 Toutes les fonctionnalités fonctionnent correctement !', 'green');
  } else {
    log('⚠️  Certaines fonctionnalités nécessitent une attention', 'yellow');
  }
  
  log('\n🔧 Recommandations:', 'bold');
  if (!healthTest.success) {
    log('   - Vérifier que le backend est démarré sur le port 3001', 'yellow');
  }
  if (!homeTest.success) {
    log('   - Vérifier que le frontend est démarré sur le port 9595', 'yellow');
  }
  if (!trackingTest.success) {
    log('   - Vérifier la configuration des routes de tracking', 'yellow');
  }
  if (!paymentTest.success) {
    log('   - Vérifier la configuration des paiements', 'yellow');
  }
}

// Exécuter les tests
runTests().catch(console.error); 