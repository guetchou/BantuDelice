import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  useWebSocket, 
  useRealTimeTracking, 
  useRealTimeNotifications, 
  useRealTimeStats,
  usePerformanceMetrics,
  useOptimizedColis,
  useValidation,
  useSecurity,
  colisApiMock,
  colisPerformance,
  colisValidation
} from '@/services';
import { 
  Wifi, 
  WifiOff, 
  Activity, 
  Shield, 
  Zap, 
  any, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Bell,
  Package,
  BarChart3
} from 'lucide-react';

const ColisAdvancedFeatures: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState('BD12345678');
  const [testData, setTestData] = useState<unknown>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Hooks WebSocket
  const { 
    isConnected: wsConnected, 
    lastMessage, 
    connect: wsConnect, 
    disconnect: wsDisconnect 
  } = useWebSocket();

  // Hooks temps réel
  const { trackingUpdates, isConnected: trackingConnected } = useRealTimeTracking(trackingNumber);
  const { notifications, isConnected: notificationsConnected } = useRealTimeNotifications();
  const { stats, isConnected: statsConnected } = useRealTimeStats();

  // Hooks performance
  const { metrics, clearCache, clearLogs, generateReport } = usePerformanceMetrics();
  const { data: optimizedColis, loading: optimizedLoading } = useOptimizedColis(trackingNumber);

  // Hooks validation et sécurité
  const { 
    errors, 
    validateCreateColis, 
    validateTrackingNumber, 
    clearErrors, 
    getFieldError,
    hasErrors 
  } = useValidation();
  
  const { 
    isRateLimited, 
    checkRateLimit, 
    sanitizeInput, 
    sanitizeObject 
  } = useSecurity();

  // Test des fonctionnalités
  const testWebSocket = () => {
    if (wsConnected) {
      wsDisconnect();
    } else {
      wsConnect();
    }
  };

  const testMockApi = async () => {
    try {
      const result = await colisApiMock.getColis('BD12345678');
      setTestData(result);
    } catch (error) {
      console.error('Erreur mock API:', error);
    }
  };

  const testPerformance = () => {
    colisPerformance.preloadColisData(['BD12345678', 'BD87654321']);
  };

  const testValidation = () => {
    const testData = {
      sender: {
        name: 'Test',
        phone: '061234567',
        email: 'test@example.com',
        address: '123 Test Street',
        city: 'Brazzaville'
      },
      recipient: {
        name: 'Test2',
        phone: '062345678',
        email: 'test2@example.com',
        address: '456 Test Avenue',
        city: 'Pointe-Noire'
      },
      package: {
        type: 'document',
        weight: 1.5,
        description: 'Test package'
      },
      service: {
        type: 'standard',
        insurance: true,
        fragile: false,
        express: false
      }
    };

    const isValid = validateCreateColis(testData);
    if (!isValid) {
      setValidationErrors(errors.map(e => `${e.field}: ${e.message}`));
    } else {
      setValidationErrors([]);
    }
  };

  const testRateLimit = () => {
    const allowed = checkRateLimit('test-client');
    console.log('Rate limit check:', allowed);
  };

  const testSanitization = () => {
    const dirtyInput = '<script>alert("xss")</script>Test Input';
    const cleanInput = sanitizeInput(dirtyInput);
    console.log('Sanitization test:', { dirty: dirtyInput, clean: cleanInput });
  };

  const generatePerformanceReport = () => {
    const report = generateReport();
    console.log('Performance Report:', report);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-200 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Fonctionnalités Avancées
          </h1>
          <p className="text-gray-600">
            Démonstration des services avancés : WebSocket, Performance, Validation, Sécurité
          </p>
        </div>

        {/* Statut des connexions */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {wsConnected ? (
                  <Wifi className="h-5 w-5 text-green-500" />
                ) : (
                  <WifiOff className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <p className="font-medium text-gray-800">WebSocket</p>
                  <p className="text-sm text-gray-600">
                    {wsConnected ? 'Connecté' : 'Déconnecté'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {trackingConnected ? (
                  <Package className="h-5 w-5 text-green-500" />
                ) : (
                  <Package className="h-5 w-5 text-gray-400" />
                )}
                <div>
                  <p className="font-medium text-gray-800">Suivi RT</p>
                  <p className="text-sm text-gray-600">
                    {trackingConnected ? 'Actif' : 'Inactif'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {notificationsConnected ? (
                  <Bell className="h-5 w-5 text-green-500" />
                ) : (
                  <Bell className="h-5 w-5 text-gray-400" />
                )}
                <div>
                  <p className="font-medium text-gray-800">Notifications</p>
                  <p className="text-sm text-gray-600">
                    {notificationsConnected ? 'Actif' : 'Inactif'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {statsConnected ? (
                  <BarChart3 className="h-5 w-5 text-green-500" />
                ) : (
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                )}
                <div>
                  <p className="font-medium text-gray-800">Stats RT</p>
                  <p className="text-sm text-gray-600">
                    {statsConnected ? 'Actif' : 'Inactif'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* WebSocket et Temps Réel */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* WebSocket */}
          <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                WebSocket
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  onClick={testWebSocket}
                  className={wsConnected ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                >
                  {wsConnected ? 'Déconnecter' : 'Connecter'}
                </Button>
                <Button 
                  onClick={() => wsConnected && colisWebSocket.subscribeToTracking(trackingNumber)}
                  disabled={!wsConnected}
                  variant="outline"
                >
                  S'abonner
                </Button>
              </div>

              {lastMessage && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Dernier message:</p>
                  <p className="text-xs text-blue-600 mt-1">
                    {JSON.stringify(lastMessage, null, 2)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Suivi en Temps Réel */}
          <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-orange-500" />
                Suivi Temps Réel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Numéro de suivi"
              />

              <div className="space-y-2">
                {trackingUpdates.slice(-3).map((update, index) => (
                  <div key={index} className="p-2 bg-orange-50 rounded text-sm">
                    <p className="font-medium text-orange-800">{update.status}</p>
                    <p className="text-orange-600">{update.location}</p>
                    <p className="text-orange-500 text-xs">{update.timestamp}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance et Cache */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Métriques de Performance */}
          <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-800">Requêtes</p>
                  <p className="text-gray-600">{metrics.requestCount}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Succès</p>
                  <p className="text-green-600">{metrics.successCount}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Erreurs</p>
                  <p className="text-red-600">{metrics.errorCount}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Temps moyen</p>
                  <p className="text-gray-600">{metrics.averageResponseTime.toFixed(2)}ms</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={testPerformance} size="sm" variant="outline">
                  Précharger
                </Button>
                <Button onClick={clearCache} size="sm" variant="outline">
                  Vider Cache
                </Button>
                <Button onClick={generatePerformanceReport} size="sm" variant="outline">
                  Rapport
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cache Optimisé */}
          <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <any className="h-5 w-5 text-purple-500" />
                Cache Optimisé
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {optimizedLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                  <span className="text-sm text-gray-600">Chargement optimisé...</span>
                </div>
              ) : optimizedColis ? (
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="font-medium text-purple-800">{optimizedColis.trackingNumber}</p>
                  <p className="text-purple-600 text-sm">{optimizedColis.status}</p>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Aucun colis chargé</p>
              )}

              <div className="text-xs text-gray-500">
                Cache size: {colisPerformance.getCacheSize()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Validation et Sécurité */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Validation */}
          <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Validation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={testValidation} size="sm">
                  Tester Validation
                </Button>
                <Button onClick={clearErrors} size="sm" variant="outline">
                  Effacer Erreurs
                </Button>
              </div>

              {validationErrors.length > 0 && (
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-sm font-medium text-red-800 mb-2">Erreurs de validation:</p>
                  <ul className="text-xs text-red-600 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {hasErrors() && (
                <div className="p-2 bg-yellow-50 rounded text-sm">
                  <p className="text-yellow-800">Erreurs actives: {errors.length}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sécurité */}
          <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={testRateLimit} size="sm" variant="outline">
                  Test Rate Limit
                </Button>
                <Button onClick={testSanitization} size="sm" variant="outline">
                  Test Sanitization
                </Button>
              </div>

              {isRateLimited && (
                <div className="p-2 bg-red-50 rounded text-sm">
                  <p className="text-red-800">Rate limit atteint!</p>
                </div>
              )}

              <div className="text-xs text-gray-500 space-y-1">
                <p>• Rate limiting: {checkRateLimit('test') ? 'OK' : 'Limité'}</p>
                <p>• Sanitization: Activé</p>
                <p>• Validation: Activée</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mock API et Tests */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Mock API */}
          <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <any className="h-5 w-5 text-indigo-500" />
                Mock API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={testMockApi} size="sm">
                Tester Mock API
              </Button>

              {testData && (
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <p className="text-sm font-medium text-indigo-800">Résultat Mock:</p>
                  <p className="text-xs text-indigo-600 mt-1">
                    {testData.success ? 'Succès' : 'Erreur'}
                  </p>
                  {testData.data && (
                    <p className="text-xs text-indigo-600">
                      {testData.data.trackingNumber}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notifications Temps Réel */}
          <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-pink-500" />
                Notifications RT
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {notifications.slice(0, 3).map((notification, index) => (
                  <div key={index} className="p-2 bg-pink-50 rounded text-sm">
                    <p className="font-medium text-pink-800">{notification.title}</p>
                    <p className="text-pink-600 text-xs">{notification.message}</p>
                    <Badge className={`mt-1 ${
                      notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                      notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {notification.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistiques Temps Réel */}
        <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Statistiques Temps Réel
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats ? (
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.totalShipments.toLocaleString('fr-FR')}
                  </div>
                  <div className="text-sm text-green-700">Total Expéditions</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.delivered.toLocaleString('fr-FR')}
                  </div>
                  <div className="text-sm text-blue-700">Livrés</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.totalRevenue.toLocaleString('fr-FR')}
                  </div>
                  <div className="text-sm text-orange-700">FCFA</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.customerSatisfaction}/5
                  </div>
                  <div className="text-sm text-purple-700">Satisfaction</div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Aucune donnée de statistiques disponible
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informations techniques */}
        <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Informations Techniques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Services Actifs:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• WebSocket: {wsConnected ? '✅' : '❌'}</li>
                  <li>• Suivi RT: {trackingConnected ? '✅' : '❌'}</li>
                  <li>• Notifications RT: {notificationsConnected ? '✅' : '❌'}</li>
                  <li>• Stats RT: {statsConnected ? '✅' : '❌'}</li>
                  <li>• Cache optimisé: ✅</li>
                  <li>• Validation: ✅</li>
                  <li>• Sécurité: ✅</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Métriques:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Requêtes: {metrics.requestCount}</li>
                  <li>• Taux de succès: {metrics.totalRequests > 0 ? ((metrics.successCount / metrics.totalRequests) * 100).toFixed(1) : 0}%</li>
                  <li>• Temps moyen: {metrics.averageResponseTime.toFixed(2)}ms</li>
                  <li>• Cache size: {colisPerformance.getCacheSize()}</li>
                  <li>• Erreurs actives: {errors.length}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ColisAdvancedFeatures; 