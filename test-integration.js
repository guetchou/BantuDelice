const fetch = require('node-fetch');

async function testBackend() {
  console.log('🧪 Test d\'intégration Frontend-Backend BantuDelice\n');

  try {
    // Test 1: Health Check
    console.log('1. Test Health Check...');
    const healthResponse = await fetch('http://localhost:3001/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData.status);
    console.log('   Service:', healthData.service);
    console.log('   Version:', healthData.version);
    console.log('   Timestamp:', healthData.timestamp);
    console.log('');

    // Test 2: Endpoint de base
    console.log('2. Test Endpoint de base...');
    const baseResponse = await fetch('http://localhost:3001/');
    const baseData = await baseResponse.text();
    console.log('✅ Endpoint de base:', baseData.trim());
    console.log('');

    // Test 3: Inscription utilisateur
    console.log('3. Test Inscription utilisateur...');
    const registerResponse = await fetch('http://localhost:3001/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@bantudelice.com',
        password: 'password123'
      })
    });

    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ Inscription réussie:', registerData.message);
    } else {
      const errorData = await registerResponse.json();
      console.log('⚠️ Erreur d\'inscription:', errorData.message);
    }
    console.log('');

    // Test 4: Connexion utilisateur
    console.log('4. Test Connexion utilisateur...');
    const loginResponse = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@bantudelice.com',
        password: 'password123'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Connexion réussie');
      console.log('   Token reçu:', loginData.access_token ? 'Oui' : 'Non');
      console.log('   Utilisateur:', loginData.user?.name);
    } else {
      const errorData = await loginResponse.json();
      console.log('⚠️ Erreur de connexion:', errorData.message);
    }
    console.log('');

    // Test 5: Frontend
    console.log('5. Test Frontend...');
    const frontendResponse = await fetch('http://localhost:9595/');
    if (frontendResponse.ok) {
      console.log('✅ Frontend accessible sur http://localhost:9595/');
    } else {
      console.log('❌ Frontend non accessible');
    }
    console.log('');

    console.log('🎉 Tests d\'intégration terminés !');
    console.log('\n📋 Résumé:');
    console.log('   Backend: http://localhost:3001/');
    console.log('   Frontend: http://localhost:9595/');
    console.log('   API Docs: http://localhost:3001/api');
    console.log('   Health: http://localhost:3001/health');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
  }
}

testBackend(); 