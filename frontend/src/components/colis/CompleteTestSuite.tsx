import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AdvancedTrackingSystem } from '@/utils/advancedTrackingSystem';
import { ProfessionalPDFGenerator } from '@/utils/professionalPDFGenerator';
import { BackendTester } from '@/utils/backendTest';
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
  RefreshCw
} from 'lucide-react';

interface TestSuiteResult {
  category: string;
  tests: {
    name: string;
    status: 'pending' | 'running' | 'passed' | 'failed';
    duration?: number;
    error?: string;
    details?: string;
  }[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    duration: number;
  };
}

const CompleteTestSuite: React.FC = () => {
  const [results, setResults] = useState<TestSuiteResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [overallProgress, setOverallProgress] = useState(0);

  const testSuites = [
    {
      category: 'Frontend - Validation',
      tests: [
        { name: 'Validation numéros nationaux', test: () => AdvancedTrackingSystem.validateTrackingNumber('BD123456') },
        { name: 'Validation numéros internationaux', test: () => AdvancedTrackingSystem.validateTrackingNumber('DHL123456789') },
        { name: 'Rejet numéros invalides', test: () => !AdvancedTrackingSystem.validateTrackingNumber('ABC123') },
        { name: 'Détection transporteur DHL', test: () => AdvancedTrackingSystem.detectCarrier('DHL123456789')?.name === 'DHL Express' },
        { name: 'Détection transporteur UPS', test: () => AdvancedTrackingSystem.detectCarrier('1Z999AA1234567890')?.name === 'UPS' },
        { name: 'Détection transporteur national', test: () => AdvancedTrackingSystem.detectCarrier('BD123456')?.name === 'BantuDelice' },
      ]
    },
    {
      category: 'Frontend - Tracking',
      tests: [
        { name: 'Tracking national valide', test: async () => {
          const info = await AdvancedTrackingSystem.trackParcel('BD123456');
          return info && info.trackingNumber === 'BD123456' && info.type === 'national';
        }},
        { name: 'Tracking international valide', test: async () => {
          const info = await AdvancedTrackingSystem.trackParcel('DHL123456789');
          return info && info.trackingNumber === 'DHL123456789' && info.type === 'international';
        }},
        { name: 'Gestion erreur NOT_FOUND', test: async () => {
          try {
            await AdvancedTrackingSystem.trackParcel('BD999999');
            return false;
          } catch (error: unknown) {
            return error.message === 'NOT_FOUND';
          }
        }},
        { name: 'Gestion erreur NETWORK_ERROR', test: async () => {
          try {
            await AdvancedTrackingSystem.trackParcel('DHL999999999');
            return false;
          } catch (error: unknown) {
            return error.message === 'NETWORK_ERROR';
          }
        }},
      ]
    },
    {
      category: 'Frontend - PDF Generation',
      tests: [
        { name: 'Calcul tarif national', test: () => {
          const pricing = ProfessionalPDFGenerator.calculatePricing('Standard', 2.5, 'national');
          return pricing.total > 0 && pricing.currency === 'FCFA';
        }},
        { name: 'Calcul tarif international', test: () => {
          const pricing = ProfessionalPDFGenerator.calculatePricing('Express', 1.0, 'international');
          return pricing.total > 0 && pricing.currency === 'FCFA';
        }},
        { name: 'Génération étiquette', test: () => {
          const pdfData = {
            trackingNumber: 'BD123456',
            type: 'label' as const,
            carrier: 'BantuDelice',
            service: 'Standard',
            date: new Date().toLocaleDateString('fr-FR'),
            sender: {
              name: 'Jean Dupont',
              company: 'Entreprise ABC',
              address: '123 Avenue de la Paix',
              city: 'Brazzaville',
              state: '',
              postalCode: 'BZV',
              country: 'Congo',
              phone: '+242 06 123 456',
              email: 'jean.dupont@email.com'
            },
            recipient: {
              name: 'Marie Martin',
              company: 'Société XYZ',
              address: '456 Boulevard du Commerce',
              city: 'Pointe-Noire',
              state: '',
              postalCode: 'PNR',
              country: 'Congo',
              phone: '+242 06 789 012',
              email: 'marie.martin@email.com'
            },
            package: {
              weight: 2.5,
              dimensions: '30x20x15 cm',
              contents: 'Documents et échantillons',
              pieces: 1
            },
            pricing: ProfessionalPDFGenerator.calculatePricing('Standard', 2.5, 'national')
          };
          
          const content = ProfessionalPDFGenerator.generateLabelContent(pdfData);
          return content.includes('ÉTIQUETTE D\'EXPÉDITION') && content.includes('BD123456');
        }},
        { name: 'Génération reçu', test: () => {
          const pdfData = {
            trackingNumber: 'BD123456',
            type: 'receipt' as const,
            carrier: 'BantuDelice',
            service: 'Standard',
            date: new Date().toLocaleDateString('fr-FR'),
            sender: {
              name: 'Jean Dupont',
              company: 'Entreprise ABC',
              address: '123 Avenue de la Paix',
              city: 'Brazzaville',
              state: '',
              postalCode: 'BZV',
              country: 'Congo',
              phone: '+242 06 123 456',
              email: 'jean.dupont@email.com'
            },
            recipient: {
              name: 'Marie Martin',
              company: 'Société XYZ',
              address: '456 Boulevard du Commerce',
              city: 'Pointe-Noire',
              state: '',
              postalCode: 'PNR',
              country: 'Congo',
              phone: '+242 06 789 012',
              email: 'marie.martin@email.com'
            },
            package: {
              weight: 2.5,
              dimensions: '30x20x15 cm',
              contents: 'Documents et échantillons',
              pieces: 1
            },
            pricing: ProfessionalPDFGenerator.calculatePricing('Standard', 2.5, 'national')
          };
          
          const content = ProfessionalPDFGenerator.generateReceiptContent(pdfData);
          return content.includes('REÇU D\'EXPÉDITION') && content.includes('DÉTAIL DES TARIFS');
        }},
        { name: 'Génération facture', test: () => {
          const pdfData = {
            trackingNumber: 'BD123456',
            type: 'invoice' as const,
            carrier: 'BantuDelice',
            service: 'Standard',
            date: new Date().toLocaleDateString('fr-FR'),
            sender: {
              name: 'Jean Dupont',
              company: 'Entreprise ABC',
              address: '123 Avenue de la Paix',
              city: 'Brazzaville',
              state: '',
              postalCode: 'BZV',
              country: 'Congo',
              phone: '+242 06 123 456',
              email: 'jean.dupont@email.com'
            },
            recipient: {
              name: 'Marie Martin',
              company: 'Société XYZ',
              address: '456 Boulevard du Commerce',
              city: 'Pointe-Noire',
              state: '',
              postalCode: 'PNR',
              country: 'Congo',
              phone: '+242 06 789 012',
              email: 'marie.martin@email.com'
            },
            package: {
              weight: 2.5,
              dimensions: '30x20x15 cm',
              contents: 'Documents et échantillons',
              pieces: 1
            },
            pricing: ProfessionalPDFGenerator.calculatePricing('Standard', 2.5, 'national')
          };
          
          const content = ProfessionalPDFGenerator.generateInvoice(pdfData);
          return content.includes('FACTURE D\'EXPÉDITION') && content.includes('TOTAL TTC');
        }},
      ]
    },
    {
      category: 'Backend - Connectivité',
      tests: [
        { name: 'Endpoint /health', test: async () => {
          const result = await BackendTester.testEndpoint('/health');
          return result.success && result.statusCode === 200;
        }},
        { name: 'Endpoint /', test: async () => {
          const result = await BackendTester.testEndpoint('/');
          return result.success;
        }},
        { name: 'Endpoint /api', test: async () => {
          const result = await BackendTester.testEndpoint('/api');
          return result.success;
        }},
      ]
    },
    {
      category: 'Backend - API Colis',
      tests: [
        { name: 'API colis national valide', test: async () => {
          const result = await BackendTester.testEndpoint('/colis-national/BD123456');
          return result.success;
        }},
        { name: 'API colis international valide', test: async () => {
          const result = await BackendTester.testEndpoint('/colis-international/DHL123456789');
          return result.success;
        }},
        { name: 'API suivi universel', test: async () => {
          const result = await BackendTester.testEndpoint('/colis/BD123456');
          return result.success;
        }},
        { name: 'API calcul tarifs', test: async () => {
          const result = await BackendTester.testEndpoint('/colis/tarifs', 'POST', {
            from: 'Brazzaville',
            to: 'Pointe-Noire',
            weight: 2.5,
            service: 'standard'
          });
          return result.success;
        }},
      ]
    },
    {
      category: 'Backend - Base de données',
      tests: [
        { name: 'Statut base de données', test: async () => {
          const result = await BackendTester.testEndpoint('/admin/db/status');
          return result.success;
        }},
        { name: 'Tables disponibles', test: async () => {
          const result = await BackendTester.testEndpoint('/admin/db/tables');
          return result.success;
        }},
        { name: 'Statistiques DB', test: async () => {
          const result = await BackendTester.testEndpoint('/admin/db/stats');
          return result.success;
        }},
      ]
    },
    {
      category: 'Backend - Autres API',
      tests: [
        { name: 'API utilisateurs', test: async () => {
          const result = await BackendTester.testEndpoint('/users');
          return result.success;
        }},
        { name: 'API commandes', test: async () => {
          const result = await BackendTester.testEndpoint('/orders');
          return result.success;
        }},
        { name: 'API restaurants', test: async () => {
          const result = await BackendTester.testEndpoint('/restaurants');
          return result.success;
        }},
        { name: 'API paiements', test: async () => {
          const result = await BackendTester.testEndpoint('/payments');
          return result.success;
        }},
        { name: 'API notifications', test: async () => {
          const result = await BackendTester.testEndpoint('/notifications');
          return result.success;
        }},
        { name: 'API tracking', test: async () => {
          const result = await BackendTester.testEndpoint('/tracking');
          return result.success;
        }},
      ]
    },
  ];

  const runTestSuite = async (suiteIndex: number) => {
    const suite = testSuites[suiteIndex];
    const suiteResults = {
      category: suite.category,
      tests: suite.tests.map(test => ({
        name: test.name,
        status: 'pending' as const
      })),
      summary: { total: suite.tests.length, passed: 0, failed: 0, duration: 0 }
    };

    setResults(prev => {
      const newResults = [...prev];
      newResults[suiteIndex] = suiteResults;
      return newResults;
    });

    let suiteDuration = 0;
    let passed = 0;
    let failed = 0;

    for (let testIndex = 0; testIndex < suite.tests.length; testIndex++) {
      const test = suite.tests[testIndex];
      const startTime = Date.now();
      
      setCurrentTest(`${suite.category} - ${test.name}`);
      
      // Mettre à jour le statut du test
      setResults(prev => {
        const newResults = [...prev];
        newResults[suiteIndex].tests[testIndex].status = 'running';
        return newResults;
      });

      try {
        const result = await test.test();
        const duration = Date.now() - startTime;
        suiteDuration += duration;

        if (result) {
          passed++;
          setResults(prev => {
            const newResults = [...prev];
            newResults[suiteIndex].tests[testIndex] = {
              name: test.name,
              status: 'passed',
              duration,
              details: `Test réussi en ${duration}ms`
            };
            newResults[suiteIndex].summary = { total: suite.tests.length, passed, failed, duration: suiteDuration };
            return newResults;
          });
        } else {
          failed++;
          setResults(prev => {
            const newResults = [...prev];
            newResults[suiteIndex].tests[testIndex] = {
              name: test.name,
              status: 'failed',
              duration,
              error: 'Test a échoué',
              details: `Test échoué en ${duration}ms`
            };
            newResults[suiteIndex].summary = { total: suite.tests.length, passed, failed, duration: suiteDuration };
            return newResults;
          });
        }
      } catch (error) {
        const duration = Date.now() - startTime;
        suiteDuration += duration;
        failed++;
        
        setResults(prev => {
          const newResults = [...prev];
          newResults[suiteIndex].tests[testIndex] = {
            name: test.name,
            status: 'failed',
            duration,
            error: error instanceof Error ? error.message : 'Erreur inconnue',
            details: `Erreur en ${duration}ms: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
          };
          newResults[suiteIndex].summary = { total: suite.tests.length, passed, failed, duration: suiteDuration };
          return newResults;
        });
      }

      // Mettre à jour le progrès global
      const totalTests = testSuites.reduce((sum, s) => sum + s.tests.length, 0);
      const completedTests = results.reduce((sum, r) => 
        sum + r.tests.filter(t => t.status === 'passed' || t.status === 'failed').length, 0
      ) + (passed + failed);
      setOverallProgress((completedTests / totalTests) * 100);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setOverallProgress(0);
    setResults([]);

    for (let i = 0; i < testSuites.length; i++) {
      await runTestSuite(i);
    }

    setIsRunning(false);
    setCurrentTest('');
  };

  const stopTests = () => {
    setIsRunning(false);
    setCurrentTest('');
  };

  const downloadReport = () => {
    const totalTests = results.reduce((sum, r) => sum + r.summary.total, 0);
    const totalPassed = results.reduce((sum, r) => sum + r.summary.passed, 0);
    const totalFailed = results.reduce((sum, r) => sum + r.summary.failed, 0);
    const totalDuration = results.reduce((sum, r) => sum + r.summary.duration, 0);

    const report = `
RAPPORT COMPLET DE TESTS - BANTUDELICE
=====================================

Date: ${new Date().toLocaleString('fr-FR')}
Tests exécutés: ${totalTests}
Tests réussis: ${totalPassed}
Tests échoués: ${totalFailed}
Durée totale: ${totalDuration}ms
Taux de succès: ${((totalPassed / totalTests) * 100).toFixed(1)}%

RÉSULTATS PAR CATÉGORIE:
${results.map(suite => `
${suite.category}:
  - Total: ${suite.summary.total}
  - Réussis: ${suite.summary.passed}
  - Échoués: ${suite.summary.failed}
  - Durée: ${suite.summary.duration}ms
  - Taux: ${((suite.summary.passed / suite.summary.total) * 100).toFixed(1)}%

  Tests:
${suite.tests.map(test => `    ${test.status === 'passed' ? '✅' : '❌'} ${test.name} (${test.duration}ms)${test.error ? ` - ${test.error}` : ''}`).join('\n')}
`).join('')}

RÉSUMÉ GLOBAL:
- Frontend: ${results.filter(r => r.category.startsWith('Frontend')).reduce((sum, r) => sum + r.summary.passed, 0)}/${results.filter(r => r.category.startsWith('Frontend')).reduce((sum, r) => sum + r.summary.total, 0)} tests passés
- Backend: ${results.filter(r => r.category.startsWith('Backend')).reduce((sum, r) => sum + r.summary.passed, 0)}/${results.filter(r => r.category.startsWith('Backend')).reduce((sum, r) => sum + r.summary.total, 0)} tests passés

RECOMMANDATIONS:
${totalFailed > 0 ? 
  results.flatMap(suite => 
    suite.tests.filter(test => test.status === 'failed').map(test => 
      `- Corriger: ${suite.category} - ${test.name} (${test.error})`
    )
  ).join('\n') : 
  '- Tous les tests sont passés ! Système opérationnel.'
}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `complete-test-report-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const totalTests = results.reduce((sum, r) => sum + r.summary.total, 0);
  const totalPassed = results.reduce((sum, r) => sum + r.summary.passed, 0);
  const totalFailed = results.reduce((sum, r) => sum + r.summary.failed, 0);
  const successRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : '0';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Suite de Tests Complète - BantuDelice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Tests Automatisés Complets</h3>
                <p className="text-gray-600">
                  Teste toutes les fonctionnalités frontend et backend du système de tracking.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{successRate}%</div>
                <div className="text-sm text-gray-600">
                  {totalPassed}/{totalTests} tests passés
                </div>
                {totalTests > 0 && (
                  <div className="text-xs text-gray-500">
                    {totalFailed} échecs
                  </div>
                )}
              </div>
            </div>

            {/* Progrès global */}
            {isRunning && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progrès global</span>
                  <span>{overallProgress.toFixed(1)}%</span>
                </div>
                <Progress value={overallProgress} className="w-full" />
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
                  onClick={runAllTests}
                  className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Lancer tous les tests
                </Button>
              ) : (
                <Button 
                  onClick={stopTests}
                  variant="destructive"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Arrêter les tests
                </Button>
              )}

              {results.length > 0 && (
                <Button variant="outline" onClick={downloadReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le rapport
                </Button>
              )}
            </div>

            {/* Résultats par catégorie */}
            {results.length > 0 && (
              <div className="space-y-4">
                {results.map((suite, suiteIndex) => (
                  <Card key={suiteIndex}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          {suite.category.startsWith('Frontend') ? (
                            <Package className="h-4 w-4" />
                          ) : (
                            <Server className="h-4 w-4" />
                          )}
                          {suite.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge variant={suite.summary.passed === suite.summary.total ? 'default' : 'destructive'}>
                            {suite.summary.passed}/{suite.summary.total}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {((suite.summary.passed / suite.summary.total) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {suite.tests.map((test, testIndex) => (
                          <div 
                            key={testIndex}
                            className={`p-2 rounded border ${
                              test.status === 'passed' 
                                ? 'bg-green-50 border-green-200' 
                                : test.status === 'failed'
                                ? 'bg-red-50 border-red-200'
                                : test.status === 'running'
                                ? 'bg-blue-50 border-blue-200'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {test.status === 'passed' ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : test.status === 'failed' ? (
                                  <XCircle className="h-4 w-4 text-red-600" />
                                ) : test.status === 'running' ? (
                                  <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
                                ) : (
                                  <Clock className="h-4 w-4 text-gray-400" />
                                )}
                                <span className="text-sm">{test.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {test.duration && (
                                  <span className="text-xs text-gray-500">
                                    {test.duration}ms
                                  </span>
                                )}
                                <Badge variant={test.status === 'passed' ? 'default' : test.status === 'failed' ? 'destructive' : 'secondary'}>
                                  {test.status === 'passed' ? 'PASS' : test.status === 'failed' ? 'FAIL' : test.status === 'running' ? 'RUN' : 'PENDING'}
                                </Badge>
                              </div>
                            </div>
                            {test.details && (
                              <div className="text-xs text-gray-600 mt-1 ml-6">
                                {test.details}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteTestSuite; 