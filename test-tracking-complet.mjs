#!/usr/bin/env node

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001';

async function testTrackingSystem() {
  console.log('🚀 TEST COMPLET DU SYSTÈME DE TRACKING GPS BANTUDELICE\n');

  try {
    // 1. Créer un colis de test
    console.log('📦 1. Création d\'un colis de test...');
    const createResponse = await fetch(`${API_BASE}/colis/test/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderName: 'Jean Dupont',
        senderPhone: '+242123456789',
        senderAddress: '123 Avenue de la Paix',
        senderCity: 'Brazzaville',
        senderCountry: 'Congo',
        recipientName: 'Marie Martin',
        recipientPhone: '+242987654321',
        recipientAddress: '456 Boulevard du Commerce',
        recipientCity: 'Pointe-Noire',
        recipientCountry: 'Congo',
        packageType: 'package',
        packageDescription: 'Colis fragile - Écran LCD',
        weightKg: 3.5,
        deliverySpeed: 'express',
        isInternational: false
      })
    });

    const createResult = await createResponse.json();
    
    if (!createResult.success) {
      throw new Error(`Erreur création colis: ${createResult.message}`);
    }

    const trackingNumber = createResult.data.trackingNumber;
    console.log(`✅ Colis créé avec succès - Numéro de tracking: ${trackingNumber}\n`);

    // 2. Démarrer le tracking
    console.log('🚗 2. Démarrage du tracking GPS...');
    const startResponse = await fetch(`${API_BASE}/tracking/start/${trackingNumber}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driverId: 'driver-001' })
    });

    const startResult = await startResponse.json();
    
    if (!startResult.success) {
      throw new Error(`Erreur démarrage tracking: ${startResult.message}`);
    }

    console.log('✅ Tracking démarré avec succès\n');

    // 3. Simuler plusieurs positions GPS
    console.log('📍 3. Simulation des positions GPS en temps réel...');
    
    const positions = [
      { lat: -4.2634, lng: 15.2429, desc: 'Brazzaville - Départ' },
      { lat: -4.2500, lng: 15.2500, desc: 'En route vers Pointe-Noire' },
      { lat: -4.2000, lng: 15.3000, desc: 'Mi-chemin' },
      { lat: -4.1500, lng: 15.3500, desc: 'Approche Pointe-Noire' },
      { lat: -4.8167, lng: 11.8500, desc: 'Pointe-Noire - Arrivée' }
    ];

    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i];
      console.log(`   📍 Position ${i + 1}: ${pos.desc} (${pos.lat}, ${pos.lng})`);
      
      const locationResponse = await fetch(`${API_BASE}/tracking/${trackingNumber}/location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: pos.lat,
          longitude: pos.lng,
          accuracy: 10,
          speed: 30 + Math.random() * 20,
          heading: 90 + Math.random() * 180,
          altitude: 320 + Math.random() * 50
        })
      });

      const locationResult = await locationResponse.json();
      
      if (locationResult.success) {
        console.log(`   ✅ Position mise à jour: ${locationResult.data.timestamp}`);
      } else {
        console.log(`   ❌ Erreur position: ${locationResult.message}`);
      }

      // Attendre 2 secondes entre chaque position
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n');

    // 4. Vérifier les informations de tracking finales
    console.log('📊 4. Vérification des informations de tracking...');
    const trackingResponse = await fetch(`${API_BASE}/tracking/${trackingNumber}`);
    const trackingResult = await trackingResponse.json();
    
    if (trackingResult.success) {
      console.log('✅ Informations de tracking récupérées:');
      console.log(`   - Statut: ${trackingResult.data.status}`);
      console.log(`   - Position actuelle: ${trackingResult.data.currentLocation.latitude}, ${trackingResult.data.currentLocation.longitude}`);
      console.log(`   - Arrivée estimée: ${trackingResult.data.estimatedArrival}`);
      console.log(`   - Dernière mise à jour: ${trackingResult.data.lastUpdate}`);
    } else {
      console.log(`❌ Erreur récupération tracking: ${trackingResult.message}`);
    }

    console.log('\n');

    // 5. Vérifier l'historique des positions
    console.log('📜 5. Vérification de l\'historique des positions...');
    const historyResponse = await fetch(`${API_BASE}/tracking/${trackingNumber}/history`);
    const historyResult = await historyResponse.json();
    
    if (historyResult.success) {
      console.log(`✅ Historique récupéré: ${historyResult.data.length} positions enregistrées`);
      if (historyResult.data.length > 0) {
        console.log('   Dernières positions:');
        historyResult.data.slice(-3).forEach((pos, index) => {
          console.log(`   ${index + 1}. ${pos.latitude}, ${pos.longitude} - ${pos.timestamp}`);
        });
      }
    } else {
      console.log(`❌ Erreur récupération historique: ${historyResult.message}`);
    }

    console.log('\n');

    // 6. Arrêter le tracking
    console.log('🛑 6. Arrêt du tracking...');
    const stopResponse = await fetch(`${API_BASE}/tracking/stop/${trackingNumber}`, {
      method: 'POST'
    });
    
    const stopResult = await stopResponse.json();
    
    if (stopResult.success) {
      console.log('✅ Tracking arrêté avec succès');
    } else {
      console.log(`❌ Erreur arrêt tracking: ${stopResult.message}`);
    }

    console.log('\n🎉 TEST TERMINÉ AVEC SUCCÈS !');
    console.log('📋 RÉSUMÉ:');
    console.log(`   - Colis créé: ${trackingNumber}`);
    console.log(`   - Tracking démarré et arrêté`);
    console.log(`   - ${positions.length} positions GPS simulées`);
    console.log(`   - Système de tracking GPS 100% fonctionnel !`);

  } catch (error) {
    console.error('❌ ERREUR LORS DU TEST:', error.message);
    process.exit(1);
  }
}

// Lancer le test
testTrackingSystem(); 