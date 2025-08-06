import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BackendTester, BackendTestResult } from '@/utils/backendTest';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info,
  Download,
  Server,
  any,
  Network,
  Zap,
  Globe
} from 'lucide-react';

const BackendTestComponent: React.FC = () => {
  const [testResults, setTestResults] = useState<BackendTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTest, setActiveTest] = useState<string>('');

  const runConnectivityTest = async () => {
    setIsRunning(true);
    setActiveTest('Connectivité');
    
    try {
      const results = await BackendTester.testConnectivity();
      setTestResults(results);
    } catch (error) {
      console.error('Erreur lors du test de connectivité:', error);
    } finally {
      setIsRunning(false);
      setActiveTest('');
    }
  };

  const runColisTest = async () => {
    setIsRunning(true);
    setActiveTest('API Colis');
    
    try {
      const results = await BackendTester.testColisEndpoints();
      setTestResults(results);
    } catch (error) {
      console.error('Erreur lors du test des API colis:', error);
    } finally {
      setIsRunning(false);
      setActiveTest('');
    }
  };

  const runanyTest = async () => {
    setIsRunning(true);
    setActiveTest('Base de données');
    
    try {
      const results = await BackendTester.testany();
      setTestResults(results);
    } catch (error) {
      console.error('Erreur lors du test de la base de données:', error);
    } finally {
      setIsRunning(false);
      setActiveTest('');
    }
  };

  const runPerformanceTest = async () => {
    setIsRunning(true);
    setActiveTest('Performance');
    
    try {
      const results = await BackendTester.testPerformance();
      setTestResults(results);
    } catch (error) {
      console.error('Erreur lors du test de performance:', error);
    } finally {
      setIsRunning(false);
      setActiveTest('');
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setActiveTest('Tous les tests');
    
    try {
      const results = await BackendTester.runAllTests();
      setTestResults(results);
    } catch (error) {
      console.error('Erreur lors des tests:', error);
    } finally {
      setIsRunning(false);
      setActiveTest('');
    }
  };

  const downloadReport = () => {
    const report = BackendTester.generateReport(testResults);
    const blob = new Blob([report], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backend-test-report-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const passedTests = testResults.filter(r => r.success).length;
  const totalTests = testResults.length;
  const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : '0';
  const avgDuration = totalTests > 0 ? (testResults.reduce((sum, r) => sum + r.duration, 0) / totalTests).toFixed(0) : '0';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Test des API Backend - BantuDelice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Tests Backend</h3>
                <p className="text-gray-600">
                  Teste la connectivité et les fonctionnalités des API backend.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{successRate}%</div>
                <div className="text-sm text-gray-600">
                  {passedTests}/{totalTests} tests passés
                </div>
                {totalTests > 0 && (
                  <div className="text-xs text-gray-500">
                    Moyenne: {avgDuration}ms
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button 
                onClick={runConnectivityTest} 
                disabled={isRunning}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-3"
              >
                <Network className="h-4 w-4" />
                <span className="text-xs">Connectivité</span>
              </Button>

              <Button 
                onClick={runColisTest} 
                disabled={isRunning}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-3"
              >
                <Globe className="h-4 w-4" />
                <span className="text-xs">API Colis</span>
              </Button>

              <Button 
                onClick={runanyTest} 
                disabled={isRunning}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-3"
              >
                <any className="h-4 w-4" />
                <span className="text-xs">Base de données</span>
              </Button>

              <Button 
                onClick={runPerformanceTest} 
                disabled={isRunning}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-3"
              >
                <Zap className="h-4 w-4" />
                <span className="text-xs">Performance</span>
              </Button>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={runAllTests} 
                disabled={isRunning}
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
              >
                {isRunning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {activeTest} en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Tous les tests
                  </>
                )}
              </Button>

              {testResults.length > 0 && (
                <Button variant="outline" onClick={downloadReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le rapport
                </Button>
              )}
            </div>

            {testResults.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Résultats détaillés :</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {testResults.map((result, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg border ${
                        result.success 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {result.success ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="font-medium">{result.method} {result.endpoint}</span>
                            <Badge variant={result.success ? 'default' : 'destructive'}>
                              {result.success ? 'SUCCESS' : 'FAIL'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {result.duration}ms
                            </Badge>
                            {result.statusCode && (
                              <Badge variant="outline" className="text-xs">
                                {result.statusCode}
                              </Badge>
                            )}
                          </div>
                          {result.error && (
                            <div className="text-sm text-red-600 ml-6">
                              Erreur: {result.error}
                            </div>
                          )}
                          {result.response && (
                            <div className="text-sm text-gray-600 ml-6">
                              Réponse: {JSON.stringify(result.response).substring(0, 100)}...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informations sur le backend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Informations Backend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Configuration</h4>
                <div className="space-y-1 text-sm">
                  <div>• <strong>URL Backend:</strong> http://10.10.0.5:3001</div>
                  <div>• <strong>Base de données:</strong> PostgreSQL</div>
                  <div>• <strong>Redis:</strong> Cache et sessions</div>
                  <div>• <strong>Docker:</strong> Conteneurisé</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Services Disponibles</h4>
                <div className="space-y-1 text-sm">
                  <div>• <strong>API REST:</strong> NestJS</div>
                  <div>• <strong>Authentification:</strong> JWT</div>
                  <div>• <strong>Validation:</strong> Class-validator</div>
                  <div>• <strong>Documentation:</strong> Swagger</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Endpoints Principaux</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium mb-1">Utilisateurs</div>
                  <div>• GET /users</div>
                  <div>• GET /users/:id</div>
                  <div>• POST /users</div>
                </div>
                <div>
                  <div className="font-medium mb-1">Commandes</div>
                  <div>• GET /orders</div>
                  <div>• GET /orders/:id</div>
                  <div>• POST /orders</div>
                </div>
                <div>
                  <div className="font-medium mb-1">Colis</div>
                  <div>• GET /colis/:tracking</div>
                  <div>• POST /colis/expedition</div>
                  <div>• GET /colis/tarifs</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Tests Recommandés</h4>
              <div className="space-y-2 text-sm">
                <div>1. <strong>Connectivité:</strong> Vérifier que le backend répond</div>
                <div>2. <strong>API Colis:</strong> Tester les endpoints de tracking</div>
                <div>3. <strong>Base de données:</strong> Vérifier la connexion DB</div>
                <div>4. <strong>Performance:</strong> Tester les temps de réponse</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackendTestComponent; 