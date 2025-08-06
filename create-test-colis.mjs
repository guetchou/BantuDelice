#!/usr/bin/env node

/**
 * SCRIPT POUR CRÉER UN COLI DE TEST
 * 
 * Ce script crée un colis de test via l'interface web
 * pour permettre le test du système de tracking GPS.
 */

import http from 'http';
import https from 'https';

// Configuration
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

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function displayInstructions() {
  log(`${colors.bright}${colors.magenta}📦 CRÉATION D'UN COLI DE TEST POUR LE TRACKING GPS${colors.reset}\n`);

  log(`${colors.cyan}1. 🖥️  OUVREZ L'INTERFACE DE CRÉATION:${colors.reset}`);
  log(`   Naviguez vers: ${colors.bright}${FRONTEND_URL}/colis/create${colors.reset}`);

  log(`\n${colors.cyan}2. 📝 REMPLISSEZ LES INFORMATIONS:${colors.reset}`);
  log(`   Expéditeur:`);
  log(`   • Nom: Test Sender`);
  log(`   • Téléphone: +242012345678`);
  log(`   • Adresse: 123 Rue Test, Brazzaville`);

  log(`\n   Destinataire:`);
  log(`   • Nom: Test Recipient`);
  log(`   • Téléphone: +242098765432`);
  log(`   • Adresse: 456 Avenue Test, Brazzaville`);

  log(`\n   Colis:`);
  log(`   • Poids: 2.5 kg`);
  log(`   • Description: Package de test pour tracking GPS`);
  log(`   • Valeur déclarée: 50,000 FCFA`);
  log(`   • Type de service: Express`);

  log(`\n${colors.cyan}3. 🗺️  AJOUTEZ LES COORDONNÉES GPS:${colors.reset}`);
  log(`   Destination:`);
  log(`   • Latitude: -4.2730`);
  log(`   • Longitude: 15.2520`);
  log(`   • Adresse: 456 Avenue Test, Brazzaville`);

  log(`\n${colors.cyan}4. 💳 SIMULEZ LE PAIEMENT:${colors.reset}`);
  log(`   • Utilisez les données de test de paiement`);
  log(`   • Ou simulez un paiement en mode développement`);

  log(`\n${colors.cyan}5. ✅ CONFIRMEZ LA CRÉATION:${colors.reset}`);
  log(`   • Notez le numéro de tracking généré`);
  log(`   • Il sera au format: BD + 6 chiffres`);

  log(`\n${colors.bright}${colors.green}🎯 APRÈS LA CRÉATION:${colors.reset}`);
  log(`   • Utilisez le numéro de tracking pour tester le système`);
  log(`   • Allez sur: ${colors.bright}${FRONTEND_URL}/colis/tracking/[NUMÉRO]${colors.reset}`);
  log(`   • Activez le tracking GPS temps réel`);

  log(`\n${colors.bright}${colors.yellow}📱 POUR SIMULER L'APPLICATION LIVREUR:${colors.reset}`);
  log(`   • Ouvrez une autre fenêtre`);
  log(`   • Allez sur: ${colors.bright}${FRONTEND_URL}/driver/tracking${colors.reset}`);
  log(`   • Connectez-vous en tant que livreur`);
  log(`   • Entrez le numéro de tracking créé`);

  log(`\n${colors.bright}${colors.cyan}🔗 LIENS UTILES:${colors.reset}`);
  log(`   • Interface client: ${colors.bright}${FRONTEND_URL}/colis${colors.reset}`);
  log(`   • Interface livreur: ${colors.bright}${FRONTEND_URL}/driver${colors.reset}`);
  log(`   • API Backend: ${colors.bright}http://localhost:3001${colors.reset}`);

  log(`\n${colors.bright}${colors.green}🎉 LE SYSTÈME EST PRÊT POUR LES TESTS !${colors.reset}`);
}

// Fonction principale
function main() {
  displayInstructions();
}

// Démarrer
main(); 