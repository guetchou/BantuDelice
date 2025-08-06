#!/usr/bin/env node

/**
 * Script de test pour le système de confirmation d'expédition
 * Teste les différentes fonctionnalités et valide le bon fonctionnement
 */

import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3001/api';
const FRONTEND_URL = 'http://localhost:9595';

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}`)
};

// Données de test
const testExpeditionData = {
  trackingNumber: 'BD123456789',
  expeditionId: 'EXP-TEST-001',
  paymentMethod: 'MTN_MOBILE_MONEY',
  paymentReference: 'MTN_1754261884762',
  expeditionData: {
    sender: 'Jean Dupont',
    recipient: 'Marie Martin',
    origin: 'Brazzaville',
    destination: 'Pointe-Noire',
    amount: 15000,
    recipientEmail: 'test@example.com',
    recipientPhone: '061234567'
  }
};

/**
 * Test de connectivité backend
 */
async function testBackendConnectivity() {
  log.title('🔍 TEST DE CONNECTIVITÉ BACKEND');
  
  try {
    const response = await fetch(`${API_BASE_URL}/colis/health`);
    const data = await response.json();
    
    if (data.success) {
      log.success('Backend accessible et opérationnel');
      return true;
    } else {
      log.error('Backend accessible mais non opérationnel');
      return false;
    }
  } catch (error) {
    log.error(`Erreur de connexion backend: ${error.message}`);
    return false;
  }
}

/**
 * Test de création d'expédition
 */
async function testExpeditionCreation() {
  log.title('📦 TEST DE CRÉATION D\'EXPÉDITION');
  
  try {
    const response = await fetch(`${API_BASE_URL}/colis/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        senderName: testExpeditionData.expeditionData.sender,
        recipientName: testExpeditionData.expeditionData.recipient,
        recipientAddress: `${testExpeditionData.expeditionData.destination}, Congo`,
        packageType: 'standard',
        weightKg: 2.5,
        trackingNumber: testExpeditionData.trackingNumber
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      log.success('Expédition créée avec succès');
      return true;
    } else {
      log.error(`Erreur création expédition: ${data.message}`);
      return false;
    }
  } catch (error) {
    log.error(`Erreur lors de la création: ${error.message}`);
    return false;
  }
}

/**
 * Test de confirmation d'expédition
 */
async function testExpeditionConfirmation() {
  log.title('✅ TEST DE CONFIRMATION D\'EXPÉDITION');
  
  try {
    const response = await fetch(`${API_BASE_URL}/colis/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        trackingNumber: testExpeditionData.trackingNumber,
        expeditionId: testExpeditionData.expeditionId,
        paymentMethod: testExpeditionData.paymentMethod,
        paymentReference: testExpeditionData.paymentReference
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      log.success('Expédition confirmée avec succès');
      return true;
    } else {
      log.error(`Erreur confirmation: ${data.message}`);
      return false;
    }
  } catch (error) {
    log.error(`Erreur lors de la confirmation: ${error.message}`);
    return false;
  }
}

/**
 * Test de vérification de statut
 */
async function testStatusCheck() {
  log.title('🔍 TEST DE VÉRIFICATION DE STATUT');
  
  try {
    const response = await fetch(`${API_BASE_URL}/colis/track/${testExpeditionData.trackingNumber}`);
    const data = await response.json();
    
    if (data.success) {
      log.success('Statut récupéré avec succès');
      log.info(`Statut: ${data.data?.status || 'N/A'}`);
      return true;
    } else {
      log.error(`Erreur récupération statut: ${data.message}`);
      return false;
    }
  } catch (error) {
    log.error(`Erreur lors de la vérification: ${error.message}`);
    return false;
  }
}

/**
 * Test de notifications
 */
async function testNotifications() {
  log.title('📧 TEST DE NOTIFICATIONS');
  
  try {
    const response = await fetch(`${API_BASE_URL}/colis/notifications/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        trackingNumber: testExpeditionData.trackingNumber,
        senderPhone: '061234567',
        senderEmail: 'expediteur@test.com',
        recipientPhone: testExpeditionData.expeditionData.recipientPhone,
        recipientEmail: testExpeditionData.expeditionData.recipientEmail,
        fromCity: testExpeditionData.expeditionData.origin,
        toCity: testExpeditionData.expeditionData.destination,
        amount: testExpeditionData.expeditionData.amount
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      log.success('Notifications envoyées avec succès');
      return true;
    } else {
      log.error(`Erreur envoi notifications: ${data.message}`);
      return false;
    }
  } catch (error) {
    log.error(`Erreur lors de l'envoi: ${error.message}`);
    return false;
  }
}

/**
 * Test de connectivité frontend
 */
async function testFrontendConnectivity() {
  log.title('🌐 TEST DE CONNECTIVITÉ FRONTEND');
  
  try {
    const response = await fetch(FRONTEND_URL);
    
    if (response.ok) {
      log.success('Frontend accessible et opérationnel');
      return true;
    } else {
      log.error(`Frontend accessible mais erreur ${response.status}`);
      return false;
    }
  } catch (error) {
    log.error(`Erreur de connexion frontend: ${error.message}`);
    return false;
  }
}

/**
 * Test de simulation d'erreur
 */
async function testErrorHandling() {
  log.title('⚠️  TEST DE GESTION D\'ERREURS');
  
  try {
    // Test avec un numéro de tracking invalide
    const response = await fetch(`${API_BASE_URL}/colis/track/INVALID-TRACKING`);
    const data = await response.json();
    
    if (!data.success) {
      log.success('Gestion d\'erreur fonctionnelle (erreur attendue)');
      log.info(`Message d'erreur: ${data.message}`);
      return true;
    } else {
      log.warning('Erreur non détectée pour un tracking invalide');
      return false;
    }
  } catch (error) {
    log.error(`Erreur lors du test: ${error.message}`);
    return false;
  }
}

/**
 * Test de performance
 */
async function testPerformance() {
  log.title('⚡ TEST DE PERFORMANCE');
  
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${API_BASE_URL}/colis/health`);
    const data = await response.json();
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (data.success && duration < 1000) {
      log.success(`Réponse rapide: ${duration}ms`);
      return true;
    } else if (data.success) {
      log.warning(`Réponse lente: ${duration}ms`);
      return false;
    } else {
      log.error('Erreur lors du test de performance');
      return false;
    }
  } catch (error) {
    log.error(`Erreur performance: ${error.message}`);
    return false;
  }
}

/**
 * Fonction principale de test
 */
async function runAllTests() {
  log.title('🚀 DÉBUT DES TESTS DE CONFIRMATION D\'EXPÉDITION');
  
  const tests = [
    { name: 'Connectivité Backend', fn: testBackendConnectivity },
    { name: 'Connectivité Frontend', fn: testFrontendConnectivity },
    { name: 'Création d\'Expédition', fn: testExpeditionCreation },
    { name: 'Confirmation d\'Expédition', fn: testExpeditionConfirmation },
    { name: 'Vérification de Statut', fn: testStatusCheck },
    { name: 'Envoi de Notifications', fn: testNotifications },
    { name: 'Gestion d\'Erreurs', fn: testErrorHandling },
    { name: 'Performance', fn: testPerformance }
  ];
  
  const results = [];
  
  for (const test of tests) {
    log.info(`\n🧪 Test: ${test.name}`);
    try {
      const result = await test.fn();
      results.push({ name: test.name, success: result });
    } catch (error) {
      log.error(`Erreur dans le test ${test.name}: ${error.message}`);
      results.push({ name: test.name, success: false, error: error.message });
    }
  }
  
  // Résumé des résultats
  log.title('📊 RÉSUMÉ DES TESTS');
  
  const successfulTests = results.filter(r => r.success).length;
  const totalTests = results.length;
  
  results.forEach(result => {
    if (result.success) {
      log.success(`${result.name}: PASSÉ`);
    } else {
      log.error(`${result.name}: ÉCHOUÉ${result.error ? ` - ${result.error}` : ''}`);
    }
  });
  
  console.log(`\n${colors.bright}${colors.cyan}📈 RÉSULTATS FINAUX:${colors.reset}`);
  console.log(`${colors.green}✅ Tests réussis: ${successfulTests}/${totalTests}${colors.reset}`);
  console.log(`${colors.red}❌ Tests échoués: ${totalTests - successfulTests}/${totalTests}${colors.reset}`);
  
  const successRate = (successfulTests / totalTests) * 100;
  console.log(`${colors.yellow}📊 Taux de réussite: ${successRate.toFixed(1)}%${colors.reset}`);
  
  if (successRate >= 80) {
    log.success('🎉 Système de confirmation d\'expédition opérationnel !');
  } else {
    log.error('⚠️  Des problèmes ont été détectés dans le système');
  }
  
  return results;
}

// Exécution des tests si le script est lancé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(error => {
    log.error(`Erreur fatale: ${error.message}`);
    process.exit(1);
  });
}

export { runAllTests, testExpeditionConfirmation }; 