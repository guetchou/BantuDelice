#!/usr/bin/env node

/**
 * SCRIPT DE TEST COMPLET - SYSTÈME DE TRACKING GPS TEMPS RÉEL
 * 
 * Ce script teste toutes les fonctionnalités du système de tracking GPS :
 * 1. Création d'un colis de test
 * 2. Démarrage du tracking GPS
 * 3. Émission de coordonnées GPS simulées
 * 4. Vérification de l'affichage temps réel
 * 5. Vérification de l'enregistrement en base de données
 */

const io = require('socket.io-client');
const fetch = require('node-fetch');

// Configuration
const API_BASE_URL = 'http://localhost:3001';
const SOCKET_URL = 'http://localhost:3001';
const TEST_TRACKING_NUMBER = `BD${Date.now().toString().slice(-6)}`;

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

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${colors.bright}${colors.blue}=== ÉTAPE ${step}: ${message} ===${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Données de test
const testColisData = {
  senderName: "Test Sender",
  senderPhone: "+242012345678",
  senderAddress: "123 Rue Test, Brazzaville",
  recipientName: "Test Recipient", 
  recipientPhone: "+242098765432",
  recipientAddress: "456 Avenue Test, Brazzaville",
  packageWeight: 2.5,
  packageDescription: "Package de test pour tracking GPS",
  declaredValue: 50000,
  serviceType: "express"
};

// Coordonnées GPS simulées (trajet Brazzaville)
const gpsCoordinates = [
  { lat: -4.2634, lng: 15.2429, description: "Centre-ville Brazzaville" },
  { lat: -4.2650, lng: 15.2440, description: "Quartier Bacongo" },
  { lat: -4.2670, lng: 15.2460, description: "Avenue de la Paix" },
  { lat: -4.2690, lng: 15.2480, description: "Zone industrielle" },
  { lat: -4.2710, lng: 15.2500, description: "Périphérie nord" },
  { lat: -4.2730, lng: 15.2520, description: "Destination finale" }
];

class TrackingGPSTester {
  constructor() {
    this.socket = null;
    this.trackingNumber = TEST_TRACKING_NUMBER;
    this.locationUpdates = [];
    this.testResults = {
      colisCreated: false,
      trackingStarted: false,
      gpsEmitted: false,
      realTimeDisplay: false,
      databaseRecorded: false
    };
  }

  async runFullTest() {
    log(`${colors.bright}${colors.magenta}🚀 DÉMARRAGE DU TEST COMPLET - SYSTÈME DE TRACKING GPS TEMPS RÉEL${colors.reset}`);
    log(`${colors.cyan}Numéro de tracking de test: ${this.trackingNumber}${colors.reset}\n`);

    try {
      // ÉTAPE 1: Créer un colis de test
      await this.createTestColis();

      // ÉTAPE 2: Démarrer le tracking GPS
      await this.startTracking();

      // ÉTAPE 3: Émettre des coordonnées GPS simulées
      await this.emitGPSCoordinates();

      // ÉTAPE 4: Vérifier l'affichage temps réel
      await this.verifyRealTimeDisplay();

      // ÉTAPE 5: Vérifier l'enregistrement en base de données
      await this.verifyDatabaseRecording();

      // ÉTAPE 6: Afficher les résultats finaux
      this.displayFinalResults();

    } catch (error) {
      logError(`Erreur lors du test: ${error.message}`);
      process.exit(1);
    } finally {
      this.cleanup();
    }
  }

  async createTestColis() {
    logStep(1, "Création d'un colis de test");

    try {
      const response = await fetch(`${API_BASE_URL}/colis/test/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testColisData)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        this.trackingNumber = data.data.trackingNumber;
        this.testResults.colisCreated = true;
        logSuccess(`Colis créé avec succès: ${this.trackingNumber}`);
        logInfo(`Expéditeur: ${testColisData.senderName}`);
        logInfo(`Destinataire: ${testColisData.recipientName}`);
        logInfo(`Poids: ${testColisData.packageWeight} kg`);
      } else {
        throw new Error(data.message || 'Erreur lors de la création du colis');
      }
    } catch (error) {
      logError(`Échec de la création du colis: ${error.message}`);
      throw error;
    }
  }

  async startTracking() {
    logStep(2, "Démarrage du tracking GPS");

    try {
      // Initialiser la connexion WebSocket
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling']
      });

      return new Promise((resolve, reject) => {
        this.socket.on('connect', () => {
          logSuccess('Connexion WebSocket établie');
          
          // S'abonner au tracking
          this.socket.emit('subscribeToTracking', {
            trackingNumber: this.trackingNumber,
            userId: 'test-user-123'
          });

          this.socket.on('subscribed', (data) => {
            logSuccess(`Abonnement au tracking réussi: ${data.trackingNumber}`);
            this.testResults.trackingStarted = true;
            resolve();
          });

          this.socket.on('error', (error) => {
            logError(`Erreur WebSocket: ${error.message}`);
            reject(error);
          });

          // Timeout de sécurité
          setTimeout(() => {
            reject(new Error('Timeout lors du démarrage du tracking'));
          }, 10000);
        });

        this.socket.on('connect_error', (error) => {
          logError(`Erreur de connexion WebSocket: ${error.message}`);
          reject(error);
        });
      });
    } catch (error) {
      logError(`Échec du démarrage du tracking: ${error.message}`);
      throw error;
    }
  }

  async emitGPSCoordinates() {
    logStep(3, "Émission de coordonnées GPS simulées");

    try {
      for (let i = 0; i < gpsCoordinates.length; i++) {
        const coord = gpsCoordinates[i];
        
        // Simuler une mise à jour de position
        const locationUpdate = {
          trackingNumber: this.trackingNumber,
          latitude: coord.lat,
          longitude: coord.lng,
          accuracy: 5 + Math.random() * 10, // Précision 5-15m
          speed: 20 + Math.random() * 30, // Vitesse 20-50 km/h
          heading: Math.random() * 360, // Direction 0-360°
          timestamp: new Date().toISOString()
        };

        // Envoyer la position via WebSocket
        this.socket.emit('updateLocation', locationUpdate);
        
        this.locationUpdates.push(locationUpdate);
        
        logInfo(`Position émise: ${coord.description}`);
        logInfo(`  Lat: ${coord.lat}, Lng: ${coord.lng}`);
        logInfo(`  Précision: ±${locationUpdate.accuracy.toFixed(1)}m`);
        logInfo(`  Vitesse: ${locationUpdate.speed.toFixed(1)} km/h`);

        // Attendre 2 secondes entre chaque mise à jour
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      this.testResults.gpsEmitted = true;
      logSuccess(`${gpsCoordinates.length} positions GPS émises avec succès`);
    } catch (error) {
      logError(`Échec de l'émission GPS: ${error.message}`);
      throw error;
    }
  }

  async verifyRealTimeDisplay() {
    logStep(4, "Vérification de l'affichage temps réel");

    try {
      // Vérifier que les mises à jour sont reçues
      let updatesReceived = 0;
      
      return new Promise((resolve, reject) => {
        this.socket.on('locationUpdate', (data) => {
          updatesReceived++;
          logInfo(`Mise à jour reçue #${updatesReceived}: ${data.latitude}, ${data.longitude}`);
          
          if (updatesReceived >= gpsCoordinates.length) {
            this.testResults.realTimeDisplay = true;
            logSuccess(`Affichage temps réel vérifié: ${updatesReceived} mises à jour reçues`);
            resolve();
          }
        });

        // Timeout de sécurité
        setTimeout(() => {
          if (updatesReceived < gpsCoordinates.length) {
            reject(new Error(`Seulement ${updatesReceived}/${gpsCoordinates.length} mises à jour reçues`));
          }
        }, 15000);
      });
    } catch (error) {
      logError(`Échec de la vérification temps réel: ${error.message}`);
      throw error;
    }
  }

  async verifyDatabaseRecording() {
    logStep(5, "Vérification de l'enregistrement en base de données");

    try {
      // Attendre un peu pour que les données soient sauvegardées
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Récupérer l'historique de tracking
      const response = await fetch(`${API_BASE_URL}/tracking/${this.trackingNumber}/history`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        this.testResults.databaseRecorded = true;
        logSuccess(`Enregistrement en base vérifié: ${data.data.length} positions sauvegardées`);
        
        // Afficher les dernières positions
        const recentPositions = data.data.slice(-3);
        logInfo('Dernières positions enregistrées:');
        recentPositions.forEach((pos, index) => {
          logInfo(`  ${index + 1}. Lat: ${pos.latitude}, Lng: ${pos.longitude} - ${new Date(pos.timestamp).toLocaleTimeString()}`);
        });
      } else {
        throw new Error('Aucune position trouvée en base de données');
      }
    } catch (error) {
      logError(`Échec de la vérification base de données: ${error.message}`);
      throw error;
    }
  }

  displayFinalResults() {
    logStep(6, "Résultats finaux du test");

    const totalTests = Object.keys(this.testResults).length;
    const passedTests = Object.values(this.testResults).filter(Boolean).length;

    log(`${colors.bright}${colors.magenta}📊 RÉSULTATS DU TEST:${colors.reset}`);
    log(`Tests réussis: ${colors.green}${passedTests}/${totalTests}${colors.reset}`);

    Object.entries(this.testResults).forEach(([test, passed]) => {
      const status = passed ? `${colors.green}✅${colors.reset}` : `${colors.red}❌${colors.reset}`;
      const testName = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      log(`  ${status} ${testName}`);
    });

    if (passedTests === totalTests) {
      log(`\n${colors.bright}${colors.green}🎉 TOUS LES TESTS SONT PASSÉS !${colors.reset}`);
      log(`${colors.green}Le système de tracking GPS temps réel fonctionne parfaitement !${colors.reset}`);
    } else {
      log(`\n${colors.bright}${colors.red}⚠️  CERTAINS TESTS ONT ÉCHOUÉ${colors.reset}`);
      log(`${colors.yellow}Vérifiez les logs ci-dessus pour plus de détails.${colors.reset}`);
    }

    // Statistiques
    log(`\n${colors.cyan}📈 STATISTIQUES:${colors.reset}`);
    log(`  • Positions émises: ${this.locationUpdates.length}`);
    log(`  • Temps de test: ~${Math.round((Date.now() - this.startTime) / 1000)}s`);
    log(`  • Numéro de tracking: ${this.trackingNumber}`);
  }

  cleanup() {
    if (this.socket) {
      this.socket.disconnect();
      logInfo('Connexion WebSocket fermée');
    }
  }
}

// Fonction principale
async function main() {
  const tester = new TrackingGPSTester();
  tester.startTime = Date.now();
  
  try {
    await tester.runFullTest();
  } catch (error) {
    logError(`Test échoué: ${error.message}`);
    process.exit(1);
  }
}

// Vérifier que les dépendances sont installées
try {
  require('socket.io-client');
  require('node-fetch');
} catch (error) {
  logError('Dépendances manquantes. Installez-les avec:');
  logError('npm install socket.io-client node-fetch');
  process.exit(1);
}

// Démarrer le test
main(); 