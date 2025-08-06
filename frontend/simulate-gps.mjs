#!/usr/bin/env node

const API_BASE = 'http://localhost:3001';
const TRACKING_NUMBER = 'BD630790';

// Route de Brazzaville à Pointe-Noire
const route = [
  { lat: -4.2634, lng: 15.2429, desc: 'Brazzaville - Départ' },
  { lat: -4.2500, lng: 15.2500, desc: 'En route vers Pointe-Noire' },
  { lat: -4.2000, lng: 15.3000, desc: 'Mi-chemin' },
  { lat: -4.1500, lng: 15.3500, desc: 'Approche Pointe-Noire' },
  { lat: -4.8167, lng: 11.8500, desc: 'Pointe-Noire - Arrivée' }
];

async function simulateGPSMovement() {
  console.log('🚗 SIMULATION GPS EN TEMPS RÉEL');
  console.log(`📦 Colis: ${TRACKING_NUMBER}`);
  console.log('📍 Déplacement de Brazzaville vers Pointe-Noire\n');

  try {
    // Simuler le déplacement
    for (let i = 0; i < route.length; i++) {
      const pos = route[i];
      
      console.log(`📍 Position ${i + 1}: ${pos.desc}`);
      console.log(`   Coordonnées: ${pos.lat}, ${pos.lng}`);
      
      // Envoyer la position GPS
      const locationResponse = await fetch(`${API_BASE}/tracking/${TRACKING_NUMBER}/location`, {
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

      if (locationResponse.ok) {
        const result = await locationResponse.json();
        console.log(`   ✅ Position mise à jour: ${result.data.timestamp}`);
      } else {
        console.log(`   ❌ Erreur mise à jour position`);
      }

      // Attendre 3 secondes entre chaque position
      console.log(`   ⏳ Attente 3 secondes...\n`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    console.log('🎉 Simulation terminée !');
    console.log('\n📋 INSTRUCTIONS POUR LE TEST:');
    console.log('1. Ouvrez votre navigateur sur: http://localhost:9595');
    console.log('2. Allez sur la page de tracking');
    console.log(`3. Entrez le numéro de tracking: ${TRACKING_NUMBER}`);
    console.log('4. Observez le marqueur se déplacer sur la carte en temps réel !');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

// Lancer la simulation
simulateGPSMovement(); 