#!/usr/bin/env node

const API_BASE = 'http://localhost:3001';
const TRACKING_NUMBER = 'BD101477';

async function testPublicTracking() {
  console.log('🌐 TEST PAGE PUBLIQUE DE TRACKING');
  console.log(`📦 Colis: ${TRACKING_NUMBER}`);
  console.log('📍 Test de la page publique accessible sans authentification\n');

  try {
    // Test 1: Vérifier l'endpoint de tracking public
    console.log('🔍 Test 1: Endpoint de tracking public');
    const trackingResponse = await fetch(`${API_BASE}/tracking/${TRACKING_NUMBER}`);
    
    if (trackingResponse.ok) {
      const trackingData = await trackingResponse.json();
      console.log('✅ Endpoint de tracking accessible');
      console.log(`   Statut: ${trackingData.data.status}`);
      console.log(`   Position: ${trackingData.data.currentLocation.latitude}, ${trackingData.data.currentLocation.longitude}`);
    } else {
      console.log(`❌ Erreur endpoint tracking: ${trackingResponse.status}`);
    }

    console.log('\n📋 INSTRUCTIONS POUR LE TEST FRONTEND:');
    console.log('1. Ouvrez votre navigateur sur: http://localhost:9595');
    console.log('2. Allez sur la page publique de tracking:');
    console.log(`   http://localhost:9595/colis/tracking/${TRACKING_NUMBER}`);
    console.log('3. Vérifiez que la page se charge sans authentification');
    console.log('4. Activez le suivi temps réel');
    console.log('5. Observez les informations du colis et la carte');

    console.log('\n🔗 URLs de test:');
    console.log(`   - Page publique: http://localhost:9595/colis/tracking/${TRACKING_NUMBER}`);
    console.log(`   - Avec token: http://localhost:9595/colis/tracking/${TRACKING_NUMBER}?token=test123`);
    console.log(`   - Page normale: http://localhost:9595/colis/tracking`);

    console.log('\n🎯 FONCTIONNALITÉS À TESTER:');
    console.log('✅ Page accessible sans authentification');
    console.log('✅ Affichage des informations du colis');
    console.log('✅ Carte en temps réel');
    console.log('✅ Mise à jour automatique');
    console.log('✅ Interface professionnelle');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

// Lancer le test
testPublicTracking(); 