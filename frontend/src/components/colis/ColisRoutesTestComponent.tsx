import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ColisRoutesTester, ColisRouteTestResult } from '@/utils/colisRoutesTest';
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
  Route,
  Link,
  Shield
} from 'lucide-react';

const ColisRoutesTestComponent: React.FC = () => {
  const [testResults, setTestResults] = useState<ColisRouteTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');

  const runAllRoutesTests = async () => {
    setIsRunning(true);
    setCurrentTest('Tests de toutes les routes /colis');
    
    try {
      const results = await ColisRoutesTester.testAllColisRoutes();
      setTestResults(results);
    } catch (error) {
      console.error('Erreur lors des tests de routes:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const runProtectedRoutesTests = async () => {
    setIsRunning(true);
    setCurrentTest('Tests des routes protégées');
    
    try {
      const results = await ColisRoutesTester.testProtectedRoutes();
      setTestResults(results);
    } catch (error) {
      console.error('Erreur lors des tests de routes protégées:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const runAdvancedFeaturesTests = async () => {
    setIsRunning(true);
    setCurrentTest('Tests des fonctionnalités avancées');
    
    try {
      const results = await ColisRoutesTester.testAdvancedFeatures();
      setTestResults(results);
    } catch (error) {
      console.error('Erreur lors des tests de fonctionnalités avancées:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const downloadReport = () => {
    const report = ColisRoutesTester.generateRoutesReport(testResults);
    const blob = new Blob([report], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `colis-routes-test-report-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const totalRoutes = testResults.length;
  const passedRoutes = testResults.filter(r => r.overall).length;
  const frontendRoutes = testResults.filter(r => r.frontend).length;
  const backendRoutes = testResults.filter(r => r.backend).length;
  const databaseRoutes = testResults.filter(r => r.database).length;
  
  const successRate = totalRoutes > 0 ? ((passedRoutes / totalRoutes) * 100).toFixed(1) : '0';
  const frontendRate = totalRoutes > 0 ? ((frontendRoutes / totalRoutes) * 100).toFixed(1) : '0';
  const backendRate = totalRoutes > 0 ? ((backendRoutes / totalRoutes) * 100).toFixed(1) : '0';
  const databaseRate = totalRoutes > 0 ? ((databaseRoutes / totalRoutes) * 100).toFixed(1) : '0';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Test de Toutes les Routes /colis - BantuDelice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Tests de Routes</h3>
                <p className="text-gray-600">
                  Vérifie l'accessibilité de toutes les routes /colis et leur intégration.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{successRate}%</div>
                <div className="text-sm text-gray-600">
                  {passedRoutes}/{totalRoutes} routes fonctionnelles
                </div>
              </div>
            </div>

            {/* Statistiques par composant */}
            {totalRoutes > 0 && (
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <Globe className="h-4 w-4" />
                    <span className="font-medium">Frontend</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">{frontendRate}%</div>
                  <div className="text-sm text-blue-600">{frontendRoutes}/{totalRoutes} routes</div>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <Server className="h-4 w-4" />
                    <span className="font-medium">Backend</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900">{backendRate}%</div>
                  <div className="text-sm text-green-600">{backendRoutes}/{totalRoutes} routes</div>
                </div>
                
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-2 text-purple-700 mb-2">
                    <any className="h-4 w-4" />
                    <span className="font-medium">Base de données</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-900">{databaseRate}%</div>
                  <div className="text-sm text-purple-600">{databaseRoutes}/{totalRoutes} routes</div>
                </div>
              </div>
            )}

            {/* Progrès */}
            {isRunning && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tests de routes en cours</span>
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
                <>
                  <Button 
                    onClick={runAllRoutesTests}
                    className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Toutes les routes
                  </Button>
                  
                  <Button 
                    onClick={runProtectedRoutesTests}
                    variant="outline"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Routes protégées
                  </Button>
                  
                  <Button 
                    onClick={runAdvancedFeaturesTests}
                    variant="outline"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Fonctionnalités avancées
                  </Button>
                </>
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
                            <span className="font-medium">{result.route}</span>
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

      {/* Informations sur les routes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Routes /colis Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Routes Principales</h4>
                <div className="space-y-2 text-sm">
                  <div>• <strong>/colis</strong> - Page d'accueil</div>
                  <div>• <strong>/colis/tracking</strong> - Suivi de colis</div>
                  <div>• <strong>/colis/tarifs</strong> - Calcul de tarifs</div>
                  <div>• <strong>/colis/expedition</strong> - Formulaire d'expédition</div>
                  <div>• <strong>/colis/dashboard</strong> - Tableau de bord</div>
                  <div>• <strong>/colis/support</strong> - Support client</div>
                  <div>• <strong>/colis/national</strong> - Colis nationaux</div>
                  <div>• <strong>/colis/international</strong> - Colis internationaux</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">APIs Backend</h4>
                <div className="space-y-2 text-sm">
                  <div>• <strong>GET /colis/:tracking</strong> - Suivi universel</div>
                  <div>• <strong>GET /colis/national/:tracking</strong> - Suivi national</div>
                  <div>• <strong>GET /colis/international/:tracking</strong> - Suivi international</div>
                  <div>• <strong>POST /colis/tarifs</strong> - Calcul de tarifs</div>
                  <div>• <strong>POST /colis/expedition</strong> - Création d'expédition</div>
                  <div>• <strong>POST /colis/:id/tracking</strong> - Ajout événement</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Routes Avancées</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div>• <strong>/colis/advanced-features</strong></div>
                  <div>• <strong>/colis/predictive-analytics</strong></div>
                  <div>• <strong>/colis/automation-hub</strong></div>
                </div>
                <div>
                  <div>• <strong>/colis/intelligent-routing</strong></div>
                  <div>• <strong>/colis/ai-chatbot</strong></div>
                  <div>• <strong>/colis/image-recognition</strong></div>
                </div>
                <div>
                  <div>• <strong>/colis/sentiment-analysis</strong></div>
                  <div>• <strong>/colis/predictive-maintenance</strong></div>
                  <div>• <strong>/colis/bulk-interface</strong></div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Routes Protégées</h4>
              <div className="space-y-2 text-sm">
                <div>• <strong>/colis/agent-dashboard</strong> - Dashboard Agent (rôle: agent)</div>
                <div>• <strong>/colis/supervisor-dashboard</strong> - Dashboard Superviseur (rôle: supervisor)</div>
                <div>• <strong>/colis/director-dashboard</strong> - Dashboard Directeur (rôle: director)</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Statut de l'Intégration</h4>
              <div className="space-y-2 text-sm">
                {totalRoutes === 0 ? (
                  <div className="text-gray-600">Aucun test exécuté. Lancez les tests pour vérifier l'intégration des routes.</div>
                ) : passedRoutes === totalRoutes ? (
                  <div className="text-green-700 font-medium">✅ Intégration complète - Toutes les routes /colis fonctionnent correctement !</div>
                ) : (
                  <div className="text-orange-700 font-medium">⚠️ Intégration partielle - Certaines routes nécessitent une attention.</div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColisRoutesTestComponent; 