#!/usr/bin/env node

const API_BASE = 'http://localhost:3001';
const TRACKING_NUMBER = 'BD101477';

// Route plus détaillée pour un test plus réaliste
const detailedRoute = [
  { lat: -4.2634, lng: 15.2429, desc: 'Brazzaville - Départ' },
  { lat: -4.2600, lng: 15.2450, desc: 'Sortie de Brazzaville' },
  { lat: -4.2500, lng: 15.2500, desc: 'Route nationale' },
  { lat: -4.2400, lng: 15.2600, desc: 'En direction du sud' },
  { lat: -4.2300, lng: 15.2700, desc: 'Approche de la forêt' },
  { lat: -4.2200, lng: 15.2800, desc: 'Traversée de la forêt' },
  { lat: -4.2100, lng: 15.2900, desc: 'Sortie de la forêt' },
  { lat: -4.2000, lng: 15.3000, desc: 'Mi-chemin' },
  { lat: -4.1900, lng: 15.3100, desc: 'Approche de la côte' },
  { lat: -4.1800, lng: 15.3200, desc: 'Route côtière' },
  { lat: -4.1700, lng: 15.3300, desc: 'Approche Pointe-Noire' },
  { lat: -4.1600, lng: 15.3400, desc: 'Entrée Pointe-Noire' },
  { lat: -4.1500, lng: 15.3500, desc: 'Centre-ville Pointe-Noire' },
  { lat: -4.8167, lng: 11.8500, desc: 'Pointe-Noire - Arrivée' }
];

async function testFrontendRealtime() {
  console.log('🎯 TEST FRONTEND EN TEMPS RÉEL');
  console.log(`📦 Colis: ${TRACKING_NUMBER}`);
  console.log('📍 Simulation de livraison Brazzaville → Pointe-Noire\n');

  try {
    // Démarrer le tracking
    console.log('🚀 Démarrage du tracking...');
    const startResponse = await fetch(`${API_BASE}/tracking/start/${TRACKING_NUMBER}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driverId: 'driver-001' })
    });

    if (!startResponse.ok) {
      throw new Error('Erreur démarrage tracking');
    }

    console.log('✅ Tracking démarré\n');

    // Simuler le déplacement détaillé
    for (let i = 0; i < detailedRoute.length; i++) {
      const pos = detailedRoute[i];
      
      console.log(`📍 Position ${i + 1}/${detailedRoute.length}: ${pos.desc}`);
      console.log(`   Coordonnées: ${pos.lat}, ${pos.lng}`);
      
      // Envoyer la position GPS
      const locationResponse = await fetch(`${API_BASE}/tracking/${TRACKING_NUMBER}/location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: pos.lat,
          longitude: pos.lng,
          accuracy: 5 + Math.random() * 10,
          speed: 25 + Math.random() * 30,
          heading: 90 + Math.random() * 180,
          altitude: 300 + Math.random() * 100
        })
      });

      if (locationResponse.ok) {
        const result = await locationResponse.json();
        console.log(`   ✅ Position mise à jour: ${result.data.timestamp}`);
        
        // Vérifier les informations de tracking
        const trackingResponse = await fetch(`${API_BASE}/tracking/${TRACKING_NUMBER}`);
        if (trackingResponse.ok) {
          const trackingData = await trackingResponse.json();
          console.log(`   📊 Statut: ${trackingData.data.status}`);
          console.log(`   🎯 Position actuelle: ${trackingData.data.currentLocation.latitude}, ${trackingData.data.currentLocation.longitude}`);
        }
      } else {
        console.log(`   ❌ Erreur mise à jour position`);
      }

      // Attendre 2 secondes entre chaque position
      console.log(`   ⏳ Attente 2 secondes...\n`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('🎉 Test terminé !');
    console.log('\n📋 INSTRUCTIONS POUR LE TEST FRONTEND:');
    console.log('1. Ouvrez votre navigateur sur: http://localhost:9595');
    console.log('2. Allez sur la page de tracking des colis');
    console.log('3. Entrez le numéro de tracking: BD101477');
    console.log('4. Cliquez sur "Rechercher"');
    console.log('5. Activez le tracking en temps réel');
    console.log('6. Observez le marqueur se déplacer sur la carte !');
    console.log('\n🔗 URL directe: http://localhost:9595/colis/tracking?code=BD101477');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

// Lancer le test
testFrontendRealtime(); 