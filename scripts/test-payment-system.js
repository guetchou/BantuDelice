#!/usr/bin/env node

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001/api';

async function testPaymentSystem() {
  console.log('🧪 Test du système de paiement et notifications\n');

  try {
    // Test 1: Vérifier que le backend est accessible
    console.log('1️⃣ Test de connectivité backend...');
    const healthResponse = await fetch(`${BASE_URL}/colis/health`);
    const healthData = await healthResponse.json();
    
    if (healthData.success) {
      console.log('✅ Backend accessible');
    } else {
      throw new Error('Backend non accessible');
    }

    // Test 2: Test de paiement MTN Mobile Money
    console.log('\n2️⃣ Test de paiement MTN Mobile Money...');
    const paymentData = {
      amount: 5000,
      method: 'MTN_MOBILE_MONEY',
      phoneNumber: '061234567',
      orderId: 'TEST_ORDER_001',
      description: 'Test paiement MTN'
    };

    const paymentResponse = await fetch(`${BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });

    const paymentResult = await paymentResponse.json();
    console.log('📊 Résultat paiement:', paymentResult);

    if (paymentResult.success) {
      console.log('✅ Paiement MTN traité avec succès');
    } else {
      console.log('❌ Erreur paiement MTN');
    }

    // Test 3: Test de paiement Airtel Money
    console.log('\n3️⃣ Test de paiement Airtel Money...');
    const airtelPaymentData = {
      amount: 3000,
      method: 'AIRTEL_MONEY',
      phoneNumber: '051234567',
      orderId: 'TEST_ORDER_002',
      description: 'Test paiement Airtel'
    };

    const airtelResponse = await fetch(`${BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(airtelPaymentData)
    });

    const airtelResult = await airtelResponse.json();
    console.log('📊 Résultat paiement Airtel:', airtelResult);

    if (airtelResult.success) {
      console.log('✅ Paiement Airtel traité avec succès');
    } else {
      console.log('❌ Erreur paiement Airtel');
    }

    // Test 4: Test de notifications
    console.log('\n4️⃣ Test de notifications...');
    const notificationData = {
      trackingNumber: 'BD123456789',
      senderPhone: '061234567',
      senderEmail: 'expediteur@test.com',
      recipientPhone: '051234567',
      recipientEmail: 'destinataire@test.com',
      fromCity: 'Brazzaville',
      toCity: 'Pointe-Noire',
      amount: 5000
    };

    const notificationResponse = await fetch(`${BASE_URL}/colis/notifications/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationData)
    });

    const notificationResult = await notificationResponse.json();
    console.log('📊 Résultat notifications:', notificationResult);

    if (notificationResult.success) {
      console.log('✅ Notifications envoyées avec succès');
    } else {
      console.log('❌ Erreur notifications');
    }

    // Test 5: Test de création d'expédition
    console.log('\n5️⃣ Test de création d\'expédition...');
    const expeditionData = {
      serviceType: 'national',
      packageType: 'package',
      weight: '2.5',
      dimensions: { length: '30', width: '20', height: '15' },
      sender: {
        name: 'Test Expéditeur',
        phone: '061234567',
        email: 'expediteur@test.com',
        address: '123 Rue Test',
        city: 'Brazzaville',
        agency: 'Agence Centre',
        type: 'individual'
      },
      recipient: {
        name: 'Test Destinataire',
        phone: '051234567',
        email: 'destinataire@test.com',
        address: '456 Avenue Test',
        city: 'Pointe-Noire',
        country: 'Congo',
        deliveryType: 'agence',
        type: 'individual'
      },
      service: 'standard',
      insurance: false,
      insuranceValue: '',
      specialInstructions: 'Test instructions',
      paymentMethod: 'momo',
      phoneNumber: '061234567',
      paymentTransactionId: paymentResult.transactionId,
      totalAmount: 5000
    };

    const expeditionResponse = await fetch(`${BASE_URL}/colis/expedition`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expeditionData)
    });

    const expeditionResult = await expeditionResponse.json();
    console.log('📊 Résultat expédition:', expeditionResult);

    if (expeditionResult.success) {
      console.log('✅ Expédition créée avec succès');
      console.log(`📦 Numéro de tracking: ${expeditionResult.data.trackingNumber}`);
    } else {
      console.log('❌ Erreur création expédition');
    }

    // Résumé final
    console.log('\n🎯 RÉSUMÉ DES TESTS:');
    console.log('✅ Backend: Accessible');
    console.log(`✅ Paiement MTN: ${paymentResult.success ? 'OK' : 'ERREUR'}`);
    console.log(`✅ Paiement Airtel: ${airtelResult.success ? 'OK' : 'ERREUR'}`);
    console.log(`✅ Notifications: ${notificationResult.success ? 'OK' : 'ERREUR'}`);
    console.log(`✅ Expédition: ${expeditionResult.success ? 'OK' : 'ERREUR'}`);

    const successCount = [
      paymentResult.success,
      airtelResult.success,
      notificationResult.success,
      expeditionResult.success
    ].filter(Boolean).length;

    console.log(`\n🏆 Score: ${successCount}/4 tests réussis`);

    if (successCount === 4) {
      console.log('🎉 Tous les tests sont passés ! Le système fonctionne parfaitement.');
    } else {
      console.log('⚠️ Certains tests ont échoué. Vérifiez les logs ci-dessus.');
    }

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
    console.log('\n🔧 Vérifications à faire:');
    console.log('   - Le backend est-il démarré ? (docker-compose up)');
    console.log('   - Le port 3001 est-il accessible ?');
    console.log('   - Les services de paiement sont-ils configurés ?');
  }
}

// Lancer les tests
testPaymentSystem(); 