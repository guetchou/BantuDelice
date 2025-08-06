#!/usr/bin/env node

/**
 * Test WebSocket Simple pour BantuDelice
 * Diagnostic du problème de connexion
 */

import { io } from 'socket.io-client';

const BACKEND_URL = 'http://localhost:3001';

console.log('🔍 Test WebSocket Simple BantuDelice');
console.log('=====================================');

// Test 1: Vérifier que le serveur répond
console.log('\n1. Test de connectivité HTTP...');
try {
  const response = await fetch(`${BACKEND_URL}/api/tracking/BD123456`);
  if (response.ok) {
    console.log('✅ Serveur HTTP accessible');
  } else {
    console.log('❌ Serveur HTTP non accessible');
  }
} catch (error) {
  console.log('❌ Erreur HTTP:', error.message);
}

// Test 2: Test WebSocket simple
console.log('\n2. Test WebSocket...');
try {
  console.log('📡 Tentative de connexion WebSocket...');
  
  const socket = io(`${BACKEND_URL}/tracking`, {
    transports: ['websocket', 'polling'],
    timeout: 10000,
    forceNew: true
  });
  
  socket.on('connect', () => {
    console.log('✅ WebSocket connecté!');
    console.log('   Client ID:', socket.id);
    console.log('   Transport:', socket.io.engine.transport.name);
    
    // Test simple
    socket.emit('ping');
    
    socket.on('pong', (data) => {
      console.log('✅ Pong reçu:', data);
      socket.disconnect();
    });
  });
  
  socket.on('connect_error', (error) => {
    console.log('❌ Erreur de connexion WebSocket:', error.message);
    console.log('   Détails:', error);
  });
  
  socket.on('disconnect', (reason) => {
    console.log('📴 WebSocket déconnecté:', reason);
  });
  
  // Timeout après 10 secondes
  setTimeout(() => {
    if (socket.connected) {
      console.log('⏰ Timeout - WebSocket toujours connecté');
    } else {
      console.log('⏰ Timeout - WebSocket non connecté');
    }
    socket.disconnect();
  }, 10000);
  
} catch (error) {
  console.log('❌ Erreur lors du test WebSocket:', error.message);
}

console.log('\n🔧 Diagnostic:');
console.log('- Vérifiez que le backend est démarré sur le port 3001');
console.log('- Vérifiez que le TrackingGateway est chargé');
console.log('- Vérifiez les logs du serveur pour les erreurs WebSocket'); 