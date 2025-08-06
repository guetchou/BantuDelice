import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { IntegrationTester, IntegrationTestResult } from '@/utils/integrationTest';
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
  Globe,
  Package,
  FileText,
  Clock,
  Users,
  Settings,
  Play,
  Square,
  RefreshCw,
  Link,
  Unlink
} from 'lucide-react';

const IntegrationTestComponent: React.FC = () => {
  const [testResults, setTestResults] = useState<IntegrationTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');

  const runIntegrationTests = async () => {
    setIsRunning(true);
    setCurrentTest('Tests d\'intégration');
    
    try {
      const results = await IntegrationTester.runIntegrationTests();
      setTestResults(results);
    } catch (error) {
      console.error('Erreur lors des tests d\'intégration:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const downloadReport = () => {
    const report = IntegrationTester.generateIntegrationReport(testResults);
    const blob = new Blob([report], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `integration-test-report-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
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
            <Link className="h-5 w-5" />
            Test d'Intégration Frontend-Backend - BantuDelice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Tests d'Intégration</h3>
                <p className="text-gray-600">
                  Vérifie la connectivité entre frontend, backend et base de données.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{successRate}%</div>
                <div className="text-sm text-gray-600">
                  {passedTests}/{totalTests} tests passés
                </div>
              </div>
            </div>

            {/* Statistiques par composant */}
            {totalTests > 0 && (
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <Globe className="h-4 w-4" />
                    <span className="font-medium">Frontend</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">{frontendRate}%</div>
                  <div className="text-sm text-blue-600">{frontendTests}/{totalTests} tests</div>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <Server className="h-4 w-4" />
                    <span className="font-medium">Backend</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900">{backendRate}%</div>
                  <div className="text-sm text-green-600">{backendTests}/{totalTests} tests</div>
                </div>
                
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-2 text-purple-700 mb-2">
                    <any className="h-4 w-4" />
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
                  <span>Tests d'intégration en cours</span>
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
                  onClick={runIntegrationTests}
                  className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Lancer les tests d'intégration
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

            {/* Résultats détaillés */}
            {testResults.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Résultats détaillés :</h4>
                <div className="space-y-3">
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
                            <Globe className="h-4 w-4" />
                            <span>Frontend:</span>
                            <Badge variant={result.frontend ? 'default' : 'secondary'}>
                              {result.frontend ? 'OK' : 'FAIL'}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Server className="h-4 w-4" />
                            <span>Backend:</span>
                            <Badge variant={result.backend ? 'default' : 'secondary'}>
                              {result.backend ? 'OK' : 'FAIL'}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <any className="h-4 w-4" />
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

      {/* Informations sur l'intégration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Architecture d'Intégration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Composants Testés</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <span><strong>Frontend:</strong> React + Vite (Port 9595)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-green-600" />
                    <span><strong>Backend:</strong> NestJS (Port 3001)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <any className="h-4 w-4 text-purple-600" />
                    <span><strong>Base de données:</strong> PostgreSQL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-orange-600" />
                    <span><strong>Cache:</strong> Redis</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">APIs Testées</h4>
                <div className="space-y-2 text-sm">
                  <div>• <strong>GET /health</strong> - Statut du backend</div>
                  <div>• <strong>GET /colis/:tracking</strong> - Suivi de colis</div>
                  <div>• <strong>POST /colis/tarifs</strong> - Calcul de tarifs</div>
                  <div>• <strong>GET /colis/national/:tracking</strong> - Suivi national</div>
                  <div>• <strong>GET /colis/international/:tracking</strong> - Suivi international</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Tests d'Intégration</h4>
              <div className="space-y-2 text-sm">
                <div>1. <strong>Connectivité Backend:</strong> Vérifie que le backend répond</div>
                <div>2. <strong>API Tracking:</strong> Teste les endpoints de suivi</div>
                <div>3. <strong>API Tarifs:</strong> Teste les calculs de tarifs</div>
                <div>4. <strong>Base de Données:</strong> Vérifie la connexion DB</div>
                <div>5. <strong>Connectivité Frontend:</strong> Vérifie l'accessibilité</div>
                <div>6. <strong>Intégration Complète:</strong> Teste le flux complet</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Statut de l'Intégration</h4>
              <div className="space-y-2 text-sm">
                {totalTests === 0 ? (
                  <div className="text-gray-600">Aucun test exécuté. Lancez les tests pour vérifier l'intégration.</div>
                ) : passedTests === totalTests ? (
                  <div className="text-green-700 font-medium">✅ Intégration complète - Tous les composants fonctionnent correctement !</div>
                ) : (
                  <div className="text-orange-700 font-medium">⚠️ Intégration partielle - Certains composants nécessitent une attention.</div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationTestComponent; 