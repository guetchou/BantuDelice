const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3001';

async function testUserRoles() {
  console.log('🧪 Test des Rôles Utilisateurs BantuDelice\n');

  const testUsers = [
    {
      name: 'Client Test',
      email: 'client@bantudelice.com',
      password: 'password123',
      role: 'USER'
    },
    {
      name: 'Chauffeur Test',
      email: 'driver@bantudelice.com',
      password: 'password123',
      role: 'DRIVER'
    },
    {
      name: 'Restaurant Test',
      email: 'restaurant@bantudelice.com',
      password: 'password123',
      role: 'RESTAURANT_OWNER'
    },
    {
      name: 'Admin Test',
      email: 'admin@bantudelice.com',
      password: 'password123',
      role: 'ADMIN'
    }
  ];

  for (const testUser of testUsers) {
    console.log(`\n👤 Test du rôle: ${testUser.role}`);
    console.log('=' .repeat(50));

    try {
      // 1. Inscription
      console.log('1. Inscription...');
      const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: testUser.name,
          email: testUser.email,
          password: testUser.password
        })
      });

      if (registerResponse.ok) {
        const registerData = await registerResponse.json();
        console.log('✅ Inscription réussie');
        console.log(`   Utilisateur: ${registerData.user.name}`);
        console.log(`   Rôle: ${registerData.user.role}`);
        console.log(`   Permissions: ${registerData.user.permissions.length} permissions`);
      } else {
        const errorData = await registerResponse.json();
        console.log('⚠️ Erreur d\'inscription:', errorData.message);
        continue;
      }

      // 2. Connexion
      console.log('\n2. Connexion...');
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ Connexion réussie');
        console.log(`   Token reçu: ${loginData.access_token ? 'Oui' : 'Non'}`);
        console.log(`   Rôle: ${loginData.user.role}`);
        console.log(`   Permissions: ${loginData.user.permissions.join(', ')}`);

        // 3. Test du profil
        console.log('\n3. Test du profil...');
        const profileResponse = await fetch(`${API_BASE_URL}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${loginData.access_token}`
          }
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log('✅ Profil accessible');
          console.log(`   Nom: ${profileData.name}`);
          console.log(`   Rôle: ${profileData.role}`);
        } else {
          console.log('❌ Erreur d\'accès au profil');
        }

        // 4. Test des endpoints spécifiques au rôle
        console.log('\n4. Test des endpoints spécifiques...');
        await testRoleSpecificEndpoints(testUser.role, loginData.access_token);

      } else {
        const errorData = await loginResponse.json();
        console.log('❌ Erreur de connexion:', errorData.message);
      }

    } catch (error) {
      console.error('❌ Erreur:', error.message);
    }
  }

  console.log('\n🎉 Tests des rôles terminés !');
}

async function testRoleSpecificEndpoints(role, token) {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const endpoints = {
    USER: [
      { url: '/users/profile', method: 'GET', name: 'Profil utilisateur' },
      { url: '/orders/my-orders', method: 'GET', name: 'Mes commandes' },
      { url: '/services', method: 'GET', name: 'Services disponibles' }
    ],
    DRIVER: [
      { url: '/drivers/orders', method: 'GET', name: 'Commandes chauffeur' },
      { url: '/drivers/routes', method: 'GET', name: 'Itinéraires' },
      { url: '/drivers/location', method: 'POST', name: 'Mise à jour position' }
    ],
    RESTAURANT_OWNER: [
      { url: '/restaurants/my-restaurant', method: 'GET', name: 'Mon restaurant' },
      { url: '/restaurants/my-restaurant/menu', method: 'GET', name: 'Mon menu' },
      { url: '/restaurants/my-restaurant/orders', method: 'GET', name: 'Commandes restaurant' }
    ],
    ADMIN: [
      { url: '/admin/dashboard', method: 'GET', name: 'Dashboard admin' },
      { url: '/admin/users', method: 'GET', name: 'Gestion utilisateurs' },
      { url: '/admin/services', method: 'GET', name: 'Gestion services' },
      { url: '/admin/analytics', method: 'GET', name: 'Analytics globales' }
    ]
  };

  const roleEndpoints = endpoints[role] || [];

  for (const endpoint of roleEndpoints) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint.url}`, {
        method: endpoint.method,
        headers
      });

      if (response.ok) {
        console.log(`   ✅ ${endpoint.name}: Accessible`);
      } else {
        console.log(`   ❌ ${endpoint.name}: Accès refusé (${response.status})`);
      }
    } catch (error) {
      console.log(`   ⚠️ ${endpoint.name}: Erreur - ${error.message}`);
    }
  }
}

// Fonction pour changer le rôle d'un utilisateur (admin seulement)
async function changeUserRole(userId, newRole, adminToken) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role: newRole })
    });

    if (response.ok) {
      console.log(`✅ Rôle changé vers ${newRole}`);
    } else {
      console.log(`❌ Erreur lors du changement de rôle`);
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

// Exécuter les tests
testUserRoles(); 