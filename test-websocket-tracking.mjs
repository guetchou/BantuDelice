#!/usr/bin/env node

/**
 * Test WebSocket Tracking Temps Réel BantuDelice
 * Vérifie que le WebSocket backend fonctionne correctement
 */

import { io } from 'socket.io-client';

const BACKEND_URL = 'http://localhost:3001';
const TRACKING_NUMBER = 'BD123456';

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

async function testWebSocket() {
  log('🚀 Test WebSocket Tracking Temps Réel BantuDelice', 'bold');
  log('='.repeat(60), 'blue');
  
  let socket;
  let testsPassed = 0;
  let totalTests = 0;
  
  try {
    // Test 1: Connexion WebSocket
    log('\n📡 Test 1: Connexion WebSocket', 'bold');
    totalTests++;
    
    socket = io(`${BACKEND_URL}/tracking`, {
      transports: ['websocket', 'polling'],
      timeout: 5000
    });
    
    const connectionPromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout de connexion'));
      }, 5000);
      
      socket.on('connect', () => {
        clearTimeout(timeout);
        logTest('Connexion WebSocket', true, `Client ID: ${socket.id}`);
        testsPassed++;
        resolve();
      });
      
      socket.on('connect_error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
    
    await connectionPromise;
    
    // Test 2: Message de bienvenue
    log('\n👋 Test 2: Message de bienvenue', 'bold');
    totalTests++;
    
    const welcomePromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout message de bienvenue'));
      }, 3000);
      
      socket.on('connected', (data) => {
        clearTimeout(timeout);
        logTest('Message de bienvenue reçu', true, `Message: ${data.message}`);
        testsPassed++;
        resolve();
      });
    });
    
    await welcomePromise;
    
    // Test 3: Souscription au tracking
    log('\n📦 Test 3: Souscription au tracking', 'bold');
    totalTests++;
    
    const subscriptionPromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout souscription'));
      }, 3000);
      
      socket.on('subscriptionConfirmed', (data) => {
        clearTimeout(timeout);
        logTest('Souscription confirmée', true, `Tracking: ${data.trackingNumber}`);
        testsPassed++;
        resolve();
      });
      
      socket.on('subscriptionError', (data) => {
        clearTimeout(timeout);
        reject(new Error(`Erreur souscription: ${data.error}`));
      });
    });
    
    socket.emit('subscribeToTracking', {
      trackingNumber: TRACKING_NUMBER,
      userId: 'test-user-123'
    });
    
    await subscriptionPromise;
    
    // Test 4: Récupération des informations de tracking
    log('\n📍 Test 4: Informations de tracking', 'bold');
    totalTests++;
    
    const trackingInfoPromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout informations tracking'));
      }, 3000);
      
      socket.on('trackingInfo', (data) => {
        clearTimeout(timeout);
        logTest('Informations tracking reçues', true, `Status: ${data.status}`);
        testsPassed++;
        resolve();
      });
      
      socket.on('trackingInfoError', (data) => {
        clearTimeout(timeout);
        reject(new Error(`Erreur tracking info: ${data.error}`));
      });
    });
    
    socket.emit('getTrackingInfo', {
      trackingNumber: TRACKING_NUMBER
    });
    
    await trackingInfoPromise;
    
    // Test 5: Simulation mise à jour de position
    log('\n🔄 Test 5: Mise à jour de position', 'bold');
    totalTests++;
    
    const locationUpdatePromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout mise à jour position'));
      }, 3000);
      
      socket.on('locationUpdate', (data) => {
        clearTimeout(timeout);
        logTest('Mise à jour position reçue', true, `Lat: ${data.latitude}, Lng: ${data.longitude}`);
        testsPassed++;
        resolve();
      });
      
      socket.on('locationUpdateError', (data) => {
        clearTimeout(timeout);
        reject(new Error(`Erreur mise à jour: ${data.error}`));
      });
    });
    
    // Simuler une mise à jour de position
    socket.emit('updateLocation', {
      trackingNumber: TRACKING_NUMBER,
      latitude: -4.2634,
      longitude: 15.2429,
      accuracy: 10,
      speed: 25,
      heading: 90,
      timestamp: new Date().toISOString(),
      driverId: 'driver-123'
    });
    
    await locationUpdatePromise;
    
    // Test 6: Ping/Pong
    log('\n🏓 Test 6: Ping/Pong', 'bold');
    totalTests++;
    
    const pingPromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout ping/pong'));
      }, 3000);
      
      socket.on('pong', (data) => {
        clearTimeout(timeout);
        logTest('Pong reçu', true, `Timestamp: ${data.timestamp}`);
        testsPassed++;
        resolve();
      });
    });
    
    socket.emit('ping');
    
    await pingPromise;
    
    // Test 7: Désabonnement
    log('\n🚪 Test 7: Désabonnement', 'bold');
    totalTests++;
    
    const unsubscriptionPromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout désabonnement'));
      }, 3000);
      
      socket.on('unsubscriptionConfirmed', (data) => {
        clearTimeout(timeout);
        logTest('Désabonnement confirmé', true, `Tracking: ${data.trackingNumber}`);
        testsPassed++;
        resolve();
      });
      
      socket.on('unsubscriptionError', (data) => {
        clearTimeout(timeout);
        reject(new Error(`Erreur désabonnement: ${data.error}`));
      });
    });
    
    socket.emit('unsubscribeFromTracking', {
      trackingNumber: TRACKING_NUMBER,
      userId: 'test-user-123'
    });
    
    await unsubscriptionPromise;
    
  } catch (error) {
    log(`❌ Erreur lors du test: ${error.message}`, 'red');
  } finally {
    // Nettoyage
    if (socket) {
      socket.disconnect();
    }
    
    // Résumé
    log('\n' + '='.repeat(60), 'blue');
    log('📊 Résumé des Tests WebSocket', 'bold');
    log('='.repeat(60), 'blue');
    
    const successRate = ((testsPassed / totalTests) * 100).toFixed(1);
    
    log(`Tests réussis: ${testsPassed}/${totalTests} (${successRate}%)`, 
      testsPassed === totalTests ? 'green' : 'yellow');
    
    if (testsPassed === totalTests) {
      log('🎉 WebSocket Tracking Temps Réel parfaitement fonctionnel !', 'green');
    } else if (testsPassed >= totalTests * 0.8) {
      log('✅ WebSocket fonctionnel avec quelques améliorations mineures', 'green');
    } else if (testsPassed >= totalTests * 0.6) {
      log('⚠️  WebSocket partiellement fonctionnel, corrections nécessaires', 'yellow');
    } else {
      log('❌ WebSocket non fonctionnel, implémentation requise', 'red');
    }
    
    log('\n🔧 Recommandations:', 'bold');
    if (testsPassed < totalTests) {
      log('   - Vérifier que le backend est démarré sur le port 3001', 'yellow');
      log('   - Vérifier que le module TrackingGateway est chargé', 'yellow');
      log('   - Vérifier les logs du serveur pour les erreurs', 'yellow');
    }
    
    log('\n📈 Fonctionnalités Testées:', 'bold');
    log('   • Connexion WebSocket', testsPassed >= 1 ? 'green' : 'red');
    log('   • Souscription au tracking', testsPassed >= 3 ? 'green' : 'red');
    log('   • Mise à jour de position', testsPassed >= 5 ? 'green' : 'red');
    log('   • Communication temps réel', testsPassed >= 6 ? 'green' : 'red');
  }
}

// Exécuter les tests
testWebSocket().catch(console.error); 