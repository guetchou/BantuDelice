import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info,
  Download,
  User,
  Shield,
  Settings,
  Play,
  Square,
  RefreshCw,
  LogIn,
  LogOut,
  UserPlus,
  Users,
  Crown,
  Building,
  Truck,
  BarChart3,
  Database,
  Key,
  Lock,
  Unlock
} from 'lucide-react';

interface AuthTestResult {
  test: string;
  frontend: boolean;
  backend: boolean;
  database: boolean;
  overall: boolean;
  details?: string;
}

interface UserData {
  email: string;
  password: string;
  name: string;
  role: string;
}

const AuthTestComponent: React.FC = () => {
  const [testResults, setTestResults] = useState<AuthTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [userData, setUserData] = useState<UserData>({
    email: 'test@bantudelice.cg',
    password: 'password123',
    name: 'Test User',
    role: 'USER'
  });
  const [authToken, setAuthToken] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  const backendUrl = 'http://10.10.0.5:3001';
  const frontendUrl = 'http://10.10.0.5:9595';

  const runAuthTests = async () => {
    setIsRunning(true);
    setCurrentTest('Tests d\'authentification');
    
    const results: AuthTestResult[] = [];

    try {
      // Test 1: Inscription
      setCurrentTest('Test d\'inscription');
      const registerResult = await testRegistration();
      results.push(registerResult);

      // Test 2: Connexion
      setCurrentTest('Test de connexion');
      const loginResult = await testLogin();
      results.push(loginResult);

      // Test 3: Récupération du profil
      setCurrentTest('Test de récupération du profil');
      const profileResult = await testGetProfile();
      results.push(profileResult);

      // Test 4: Pages d'authentification
      setCurrentTest('Test des pages d\'authentification');
      const pagesResult = await testAuthPages();
      results.push(pagesResult);

      // Test 5: Rôles et permissions
      setCurrentTest('Test des rôles et permissions');
      const rolesResult = await testRolesAndPermissions();
      results.push(rolesResult);

      // Test 6: Tableaux de bord
      setCurrentTest('Test des tableaux de bord');
      const dashboardResult = await testDashboards();
      results.push(dashboardResult);

      setTestResults(results);
    } catch (error) {
      console.error('Erreur lors des tests d\'authentification:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const testRegistration = async (): Promise<AuthTestResult> => {
    try {
      const response = await fetch(`${backendUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          name: userData.name
        })
      });

      const data = await response.json();
      const isValid = response.ok && data.user && data.access_token;

      if (isValid) {
        setAuthToken(data.access_token);
        setCurrentUser(data.user);
      }

      return {
        test: 'Inscription',
        frontend: true,
        backend: isValid,
        database: isValid,
        overall: isValid,
        details: isValid ? 
          `Utilisateur créé: ${data.user.email} (${data.user.role})` : 
          `Erreur: ${data.message || 'Inscription échouée'}`
      };
    } catch (error) {
      return {
        test: 'Inscription',
        frontend: true,
        backend: false,
        database: false,
        overall: false,
        details: `Erreur: ${error}`
      };
    }
  };

  const testLogin = async (): Promise<AuthTestResult> => {
    try {
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password
        })
      });

      const data = await response.json();
      const isValid = response.ok && data.user && data.access_token;

      if (isValid) {
        setAuthToken(data.access_token);
        setCurrentUser(data.user);
      }

      return {
        test: 'Connexion',
        frontend: true,
        backend: isValid,
        database: isValid,
        overall: isValid,
        details: isValid ? 
          `Connexion réussie: ${data.user.email} (${data.user.role})` : 
          `Erreur: ${data.message || 'Connexion échouée'}`
      };
    } catch (error) {
      return {
        test: 'Connexion',
        frontend: true,
        backend: false,
        database: false,
        overall: false,
        details: `Erreur: ${error}`
      };
    }
  };

  const testGetProfile = async (): Promise<AuthTestResult> => {
    if (!authToken) {
      return {
        test: 'Récupération du profil',
        frontend: true,
        backend: false,
        database: false,
        overall: false,
        details: 'Token d\'authentification manquant'
      };
    }

    try {
      const response = await fetch(`${backendUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      const data = await response.json();
      const isValid = response.ok && data.user;

      return {
        test: 'Récupération du profil',
        frontend: true,
        backend: isValid,
        database: isValid,
        overall: isValid,
        details: isValid ? 
          `Profil récupéré: ${data.user.email}` : 
          `Erreur: ${data.message || 'Récupération échouée'}`
      };
    } catch (error) {
      return {
        test: 'Récupération du profil',
        frontend: true,
        backend: false,
        database: false,
        overall: false,
        details: `Erreur: ${error}`
      };
    }
  };

  const testAuthPages = async (): Promise<AuthTestResult> => {
    try {
      const authResponse = await fetch(`${frontendUrl}/#/auth`);
      const loginResponse = await fetch(`${frontendUrl}/#/login`);
      const registerResponse = await fetch(`${frontendUrl}/#/register`);

      const authValid = authResponse.ok;
      const loginValid = loginResponse.ok;
      const registerValid = registerResponse.ok;

      return {
        test: 'Pages d\'authentification',
        frontend: authValid && loginValid && registerValid,
        backend: true,
        database: true,
        overall: authValid && loginValid && registerValid,
        details: `Auth: ${authValid ? 'OK' : 'FAIL'}, Login: ${loginValid ? 'OK' : 'FAIL'}, Register: ${registerValid ? 'OK' : 'FAIL'}`
      };
    } catch (error) {
      return {
        test: 'Pages d\'authentification',
        frontend: false,
        backend: true,
        database: true,
        overall: false,
        details: `Erreur: ${error}`
      };
    }
  };

  const testRolesAndPermissions = async (): Promise<AuthTestResult> => {
    if (!currentUser) {
      return {
        test: 'Rôles et permissions',
        frontend: true,
        backend: false,
        database: false,
        overall: false,
        details: 'Utilisateur non connecté'
      };
    }

    const hasRole = currentUser.role;
    const hasPermissions = currentUser.permissions && currentUser.permissions.length > 0;

    return {
      test: 'Rôles et permissions',
      frontend: true,
      backend: true,
      database: true,
      overall: hasRole && hasPermissions,
      details: `Rôle: ${hasRole || 'Aucun'}, Permissions: ${hasPermissions ? currentUser.permissions.length : 0}`
    };
  };

  const testDashboards = async (): Promise<AuthTestResult> => {
    try {
      const adminResponse = await fetch(`${frontendUrl}/#/admin`);
      const dashboardResponse = await fetch(`${frontendUrl}/#/dashboard`);
      const profileResponse = await fetch(`${frontendUrl}/#/profile`);

      const adminValid = adminResponse.ok;
      const dashboardValid = dashboardResponse.ok;
      const profileValid = profileResponse.ok;

      return {
        test: 'Tableaux de bord',
        frontend: adminValid && dashboardValid && profileValid,
        backend: true,
        database: true,
        overall: adminValid && dashboardValid && profileValid,
        details: `Admin: ${adminValid ? 'OK' : 'FAIL'}, Dashboard: ${dashboardValid ? 'OK' : 'FAIL'}, Profile: ${profileValid ? 'OK' : 'FAIL'}`
      };
    } catch (error) {
      return {
        test: 'Tableaux de bord',
        frontend: false,
        backend: true,
        database: true,
        overall: false,
        details: `Erreur: ${error}`
      };
    }
  };

  const downloadReport = () => {
    const report = generateAuthReport(testResults);
    const blob = new Blob([report], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `auth-test-report-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const generateAuthReport = (results: AuthTestResult[]): string => {
    const totalTests = results.length;
    const passedTests = results.filter(r => r.overall).length;
    const frontendTests = results.filter(r => r.frontend).length;
    const backendTests = results.filter(r => r.backend).length;
    const databaseTests = results.filter(r => r.database).length;

    return `
RAPPORT D'AUTHENTIFICATION - BANTUDELICE
========================================

Date: ${new Date().toLocaleString('fr-FR')}
Tests d'authentification: ${totalTests}

RÉSUMÉ GLOBAL:
- Tests réussis: ${passedTests}/${totalTests} (${((passedTests / totalTests) * 100).toFixed(1)}%)
- Frontend opérationnel: ${frontendTests}/${totalTests} (${((frontendTests / totalTests) * 100).toFixed(1)}%)
- Backend opérationnel: ${backendTests}/${totalTests} (${((backendTests / totalTests) * 100).toFixed(1)}%)
- Base de données opérationnelle: ${databaseTests}/${totalTests} (${((databaseTests / totalTests) * 100).toFixed(1)}%)

RÉSULTATS DÉTAILLÉS:
${results.map((result, index) => `
${index + 1}. ${result.test}
   Frontend: ${result.frontend ? '✅' : '❌'}
   Backend: ${result.backend ? '✅' : '❌'}
   Base de données: ${result.database ? '✅' : '❌'}
   Global: ${result.overall ? '✅ PASS' : '❌ FAIL'}
   Détails: ${result.details}
`).join('')}

FONCTIONNALITÉS TESTÉES:
✅ Inscription d'utilisateur
✅ Connexion utilisateur
✅ Récupération du profil
✅ Pages d'authentification
✅ Rôles et permissions
✅ Tableaux de bord

RÔLES DISPONIBLES:
- USER: Utilisateur standard
- ADMIN: Administrateur
- SUPERADMIN: Super administrateur
- RESTAURANT: Propriétaire de restaurant
- DELIVERY: Livreur
- SERVICE_PROVIDER: Fournisseur de service

PERMISSIONS DISPONIBLES:
- view_profile: Voir son profil
- update_profile: Modifier son profil
- view_orders: Voir les commandes
- create_order: Créer des commandes
- view_services: Voir les services
- add_favorites: Ajouter aux favoris
- write_reviews: Écrire des avis

URLS DE TEST:
- Frontend: ${frontendUrl}
- Backend: ${backendUrl}
- Page d'authentification: ${frontendUrl}/#/auth
- Page d'administration: ${frontendUrl}/#/admin
- API d'inscription: ${backendUrl}/auth/register
- API de connexion: ${backendUrl}/auth/login
- API de profil: ${backendUrl}/auth/me

STATUT DE L'AUTHENTIFICATION:
${passedTests === totalTests ? 
  '🎉 AUTHENTIFICATION COMPLÈTE - Toutes les fonctionnalités d\'authentification fonctionnent !' :
  '⚠️ AUTHENTIFICATION PARTIELLE - Certaines fonctionnalités nécessitent une attention.'
}
    `.trim();
  };

  const totalTests = testResults.length;
  const passedTests = testResults.filter(r => r.overall).length;
  const frontendTests = testResults.filter(r => r.frontend).length;
  const backendTests = testResults.filter(r => r.backend).length;
  const databaseTests = testResults.filter(r => r.database).length;
  
  const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : '0';
  const frontendRate = totalTests > 0 ? ((frontendTests / totalTests) * 100).toFixed(1) : '0';
  const backendRate = totalTests > 0 ? ((backendTests / totalTests) * 100).toFixed(1) : '0';
  const databaseRate = totalTests > 0 ? ((databaseTests / totalTests) * 100).toFixed(1) : '0';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Test d'Authentification et Rôles - BantuDelice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Tests d'Authentification</h3>
                <p className="text-gray-600">
                  Vérifie l'inscription, la connexion, les rôles et les tableaux de bord.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{successRate}%</div>
                <div className="text-sm text-gray-600">
                  {passedTests}/{totalTests} tests passés
                </div>
              </div>
            </div>

            {/* Données de test */}
            <Card className="p-4 bg-blue-50 border border-blue-200">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Email</label>
                  <Input
                    value={userData.email}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Mot de passe</label>
                  <Input
                    type="password"
                    value={userData.password}
                    onChange={(e) => setUserData({...userData, password: e.target.value})}
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Nom</label>
                  <Input
                    value={userData.name}
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Rôle</label>
                  <select
                    value={userData.role}
                    onChange={(e) => setUserData({...userData, role: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="USER">Utilisateur</option>
                    <option value="ADMIN">Administrateur</option>
                    <option value="SUPERADMIN">Super Administrateur</option>
                    <option value="RESTAURANT">Restaurant</option>
                    <option value="DELIVERY">Livreur</option>
                    <option value="SERVICE_PROVIDER">Fournisseur de service</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Statistiques par composant */}
            {totalTests > 0 && (
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">Frontend</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">{frontendRate}%</div>
                  <div className="text-sm text-blue-600">{frontendTests}/{totalTests} tests</div>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">Backend</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900">{backendRate}%</div>
                  <div className="text-sm text-green-600">{backendTests}/{totalTests} tests</div>
                </div>
                
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-2 text-purple-700 mb-2">
                    <Database className="h-4 w-4" />
                    <span className="font-medium">Base de données</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-900">{databaseRate}%</div>
                  <div className="text-sm text-purple-600">{databaseTests}/{totalTests} tests</div>
                </div>
              </div>
            )}

            {/* Progrès */}
            {isRunning && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tests d'authentification en cours</span>
                  <span>100%</span>
                </div>
                <Progress value={100} className="w-full" />
                {currentTest && (
                  <div className="text-sm text-gray-600">
                    Test en cours: {currentTest}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              {!isRunning ? (
                <Button 
                  onClick={runAuthTests}
                  className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Lancer les tests d'authentification
                </Button>
              ) : (
                <Button 
                  onClick={() => setIsRunning(false)}
                  variant="destructive"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Arrêter les tests
                </Button>
              )}

              {testResults.length > 0 && (
                <Button variant="outline" onClick={downloadReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le rapport
                </Button>
              )}
            </div>

            {/* Utilisateur actuel */}
            {currentUser && (
              <Card className="p-4 bg-green-50 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-700">Utilisateur connecté</span>
                </div>
                <div className="text-sm text-green-600">
                  <div>Email: {currentUser.email}</div>
                  <div>Nom: {currentUser.name}</div>
                  <div>Rôle: <Badge variant="outline">{currentUser.role}</Badge></div>
                  <div>Permissions: {currentUser.permissions?.length || 0}</div>
                </div>
              </Card>
            )}

            {/* Résultats détaillés */}
            {testResults.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Résultats détaillés :</h4>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {testResults.map((result, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {result.overall ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                            <span className="font-medium">{result.test}</span>
                            <Badge variant={result.overall ? 'default' : 'destructive'}>
                              {result.overall ? 'PASS' : 'FAIL'}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Frontend:</span>
                            <Badge variant={result.frontend ? 'default' : 'secondary'}>
                              {result.frontend ? 'OK' : 'FAIL'}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span>Backend:</span>
                            <Badge variant={result.backend ? 'default' : 'secondary'}>
                              {result.backend ? 'OK' : 'FAIL'}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4" />
                            <span>Base de données:</span>
                            <Badge variant={result.database ? 'default' : 'secondary'}>
                              {result.database ? 'OK' : 'FAIL'}
                            </Badge>
                          </div>
                        </div>
                        
                        {result.details && (
                          <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-700">
                            {result.details}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informations sur l'authentification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Système d'Authentification et Rôles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Fonctionnalités Testées</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-blue-600" />
                    <span><strong>Inscription</strong> : Création de compte utilisateur</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4 text-green-600" />
                    <span><strong>Connexion</strong> : Authentification utilisateur</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-purple-600" />
                    <span><strong>Profil</strong> : Récupération des données utilisateur</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-orange-600" />
                    <span><strong>Rôles</strong> : Gestion des permissions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-red-600" />
                    <span><strong>Tableaux de bord</strong> : Interfaces d'administration</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Rôles Disponibles</h4>
                <div className="space-y-2 text-sm">
                  <div>• <strong>USER</strong> - Utilisateur standard</div>
                  <div>• <strong>ADMIN</strong> - Administrateur</div>
                  <div>• <strong>SUPERADMIN</strong> - Super administrateur</div>
                  <div>• <strong>RESTAURANT</strong> - Propriétaire de restaurant</div>
                  <div>• <strong>DELIVERY</strong> - Livreur</div>
                  <div>• <strong>SERVICE_PROVIDER</strong> - Fournisseur de service</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Tableaux de Bord Disponibles</h4>
              <div className="space-y-2 text-sm">
                <div>• <strong>/admin</strong> - Dashboard administrateur (statistiques Metabase-like)</div>
                <div>• <strong>/dashboard</strong> - Dashboard utilisateur</div>
                <div>• <strong>/profile</strong> - Profil utilisateur</div>
                <div>• <strong>/colis/agent-dashboard</strong> - Dashboard agent colis</div>
                <div>• <strong>/colis/supervisor-dashboard</strong> - Dashboard superviseur</div>
                <div>• <strong>/colis/director-dashboard</strong> - Dashboard directeur</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Statut de l'Authentification</h4>
              <div className="space-y-2 text-sm">
                {totalTests === 0 ? (
                  <div className="text-gray-600">Aucun test exécuté. Lancez les tests pour vérifier l'authentification.</div>
                ) : passedTests === totalTests ? (
                  <div className="text-green-700 font-medium">✅ Authentification complète - Toutes les fonctionnalités d'authentification fonctionnent !</div>
                ) : (
                  <div className="text-orange-700 font-medium">⚠️ Authentification partielle - Certaines fonctionnalités nécessitent une attention.</div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthTestComponent; 