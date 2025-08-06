import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdvancedTrackingSystem } from '@/utils/advancedTrackingSystem';
import { ProfessionalPDFGenerator } from '@/utils/professionalPDFGenerator';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info,
  Download,
  FileText,
  CreditCard,
  Share2,
  Phone,
  Mail,
  Bell,
  QrCode
} from 'lucide-react';

interface TestResult {
  test: string;
  expected: boolean;
  actual: boolean;
  passed: boolean;
  details?: string;
}

const ColisTrackingTest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const testCases = [
    { number: 'BD123456', expected: true, description: 'Format national valide' },
    { number: 'BD999999', expected: false, description: 'Numéro non trouvé (simulation)' },
    { number: 'DHL123456789', expected: true, description: 'Format international DHL valide' },
    { number: 'UPS123456789', expected: true, description: 'Format international UPS valide' },
    { number: 'DHL999999999', expected: false, description: 'Erreur réseau (simulation)' },
    { number: 'ABC123', expected: false, description: 'Format invalide' },
    { number: 'BD12345', expected: false, description: 'Format national incomplet' },
    { number: 'DHL123', expected: false, description: 'Format international incomplet' },
  ];

  const runAllTests = async () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    // Test 1: Validation des numéros de tracking
    console.log('🧪 Test 1: Validation des numéros de tracking');
    for (const testCase of testCases) {
      const isValid = AdvancedTrackingSystem.validateTrackingNumber(testCase.number);
      const passed = isValid === testCase.expected;
      
      results.push({
        test: `Validation: ${testCase.number}`,
        expected: testCase.expected,
        actual: isValid,
        passed,
        details: testCase.description
      });

      console.log(`  ${passed ? '✅' : '❌'} ${testCase.number}: ${passed ? 'PASS' : 'FAIL'} (${testCase.description})`);
    }

    // Test 2: Détection des transporteurs
    console.log('\n🧪 Test 2: Détection des transporteurs');
    const carrierTests = [
      { number: 'BD123456', expected: 'BantuDelice' },
      { number: 'DHL123456789', expected: 'DHL Express' },
      { number: '1Z999AA1234567890', expected: 'UPS' },
    ];

    for (const testCase of carrierTests) {
      const carrier = AdvancedTrackingSystem.detectCarrier(testCase.number);
      const passed = carrier?.name === testCase.expected;
      
      results.push({
        test: `Détection transporteur: ${testCase.number}`,
        expected: true,
        actual: passed,
        passed,
        details: `Attendu: ${testCase.expected}, Obtenu: ${carrier?.name || 'null'}`
      });

      console.log(`  ${passed ? '✅' : '❌'} ${testCase.number}: ${passed ? 'PASS' : 'FAIL'} (${carrier?.name || 'null'})`);
    }

    // Test 3: Génération de numéros de tracking
    console.log('\n🧪 Test 3: Génération de numéros de tracking');
    const nationalNumber = AdvancedTrackingSystem.generateTrackingNumber('national');
    const internationalNumber = AdvancedTrackingSystem.generateTrackingNumber('international');
    
    const nationalValid = AdvancedTrackingSystem.validateTrackingNumber(nationalNumber);
    const internationalValid = AdvancedTrackingSystem.validateTrackingNumber(internationalNumber);
    
    results.push({
      test: 'Génération numéro national',
      expected: true,
      actual: nationalValid,
      passed: nationalValid,
      details: `Généré: ${nationalNumber}`
    });

    results.push({
      test: 'Génération numéro international',
      expected: true,
      actual: internationalValid,
      passed: internationalValid,
      details: `Généré: ${internationalNumber}`
    });

    console.log(`  ✅ National: ${nationalNumber} (${nationalValid ? 'VALID' : 'INVALID'})`);
    console.log(`  ✅ International: ${internationalNumber} (${internationalValid ? 'VALID' : 'INVALID'})`);

    // Test 4: Tracking de colis
    console.log('\n🧪 Test 4: Tracking de colis');
    try {
      const trackingInfo = await AdvancedTrackingSystem.trackParcel('BD123456');
      const passed = trackingInfo && trackingInfo.trackingNumber === 'BD123456';
      
      results.push({
        test: 'Tracking BD123456',
        expected: true,
        actual: passed,
        passed,
        details: `Statut: ${trackingInfo?.status.description}, Type: ${trackingInfo?.type}`
      });

      console.log(`  ✅ Tracking BD123456: ${passed ? 'PASS' : 'FAIL'} (${trackingInfo?.status.description})`);
    } catch (error) {
      results.push({
        test: 'Tracking BD123456',
        expected: true,
        actual: false,
        passed: false,
        details: `Erreur: ${error}`
      });
      console.log(`  ❌ Tracking BD123456: FAIL (${error})`);
    }

    // Test 5: Calculs de tarifs
    console.log('\n🧪 Test 5: Calculs de tarifs');
    const nationalPricing = ProfessionalPDFGenerator.calculatePricing('Standard', 2.5, 'national');
    const internationalPricing = ProfessionalPDFGenerator.calculatePricing('Express', 1.0, 'international');
    
    const nationalValidPricing = nationalPricing.total > 0 && nationalPricing.currency === 'FCFA';
    const internationalValidPricing = internationalPricing.total > 0 && internationalPricing.currency === 'FCFA';
    
    results.push({
      test: 'Calcul tarif national',
      expected: true,
      actual: nationalValidPricing,
      passed: nationalValidPricing,
      details: `Total: ${nationalPricing.total.toLocaleString()} ${nationalPricing.currency}`
    });

    results.push({
      test: 'Calcul tarif international',
      expected: true,
      actual: internationalValidPricing,
      passed: internationalValidPricing,
      details: `Total: ${internationalPricing.total.toLocaleString()} ${internationalPricing.currency}`
    });

    console.log(`  ✅ Tarif national: ${nationalPricing.total.toLocaleString()} ${nationalPricing.currency}`);
    console.log(`  ✅ Tarif international: ${internationalPricing.total.toLocaleString()} ${internationalPricing.currency}`);

    // Test 6: Génération PDF
    console.log('\n🧪 Test 6: Génération PDF');
    try {
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
        pricing: nationalPricing
      };

      const labelContent = ProfessionalPDFGenerator.generateLabelContent(pdfData);
      const receiptContent = ProfessionalPDFGenerator.generateReceiptContent(pdfData);
      const invoiceContent = ProfessionalPDFGenerator.generateInvoice(pdfData);
      
      const labelValid = labelContent.includes('ÉTIQUETTE D\'EXPÉDITION') && labelContent.includes('BD123456');
      const receiptValid = receiptContent.includes('REÇU D\'EXPÉDITION') && receiptContent.includes('DÉTAIL DES TARIFS');
      const invoiceValid = invoiceContent.includes('FACTURE D\'EXPÉDITION') && invoiceContent.includes('TOTAL TTC');
      
      results.push({
        test: 'Génération étiquette PDF',
        expected: true,
        actual: labelValid,
        passed: labelValid,
        details: `Longueur: ${labelContent.length} caractères`
      });

      results.push({
        test: 'Génération reçu PDF',
        expected: true,
        actual: receiptValid,
        passed: receiptValid,
        details: `Longueur: ${receiptContent.length} caractères`
      });

      results.push({
        test: 'Génération facture PDF',
        expected: true,
        actual: invoiceValid,
        passed: invoiceValid,
        details: `Longueur: ${invoiceContent.length} caractères`
      });

      console.log(`  ✅ Étiquette PDF: ${labelValid ? 'PASS' : 'FAIL'} (${labelContent.length} caractères)`);
      console.log(`  ✅ Reçu PDF: ${receiptValid ? 'PASS' : 'FAIL'} (${receiptContent.length} caractères)`);
      console.log(`  ✅ Facture PDF: ${invoiceValid ? 'PASS' : 'FAIL'} (${invoiceContent.length} caractères)`);
    } catch (error) {
      results.push({
        test: 'Génération PDF',
        expected: true,
        actual: false,
        passed: false,
        details: `Erreur: ${error}`
      });
      console.log(`  ❌ Génération PDF: FAIL (${error})`);
    }

    setTestResults(results);
    setIsRunning(false);

    // Résumé final
    const passedTests = results.filter(r => r.passed).length;
    const totalTests = results.length;
    const successRate = ((passedTests / totalTests) * 100).toFixed(1);
    
    console.log(`\n📊 RÉSUMÉ DES TESTS:`);
    console.log(`  ✅ Tests réussis: ${passedTests}/${totalTests} (${successRate}%)`);
    console.log(`  ❌ Tests échoués: ${totalTests - passedTests}/${totalTests}`);
    
    if (passedTests === totalTests) {
      console.log(`  🎉 TOUS LES TESTS SONT PASSÉS !`);
    } else {
      console.log(`  ⚠️  Certains tests ont échoué. Vérifiez les détails ci-dessus.`);
    }
  };

  const downloadTestReport = () => {
    const report = `
RAPPORT DE TEST - SYSTÈME DE TRACKING BANTUDELICE
================================================

Date: ${new Date().toLocaleString('fr-FR')}
Tests exécutés: ${testResults.length}

RÉSULTATS DÉTAILLÉS:
${testResults.map((result, index) => `
${index + 1}. ${result.test}
   Statut: ${result.passed ? '✅ PASS' : '❌ FAIL'}
   Attendu: ${result.expected}
   Obtenu: ${result.actual}
   Détails: ${result.details || 'Aucun'}
`).join('')}

RÉSUMÉ:
- Tests réussis: ${testResults.filter(r => r.passed).length}/${testResults.length}
- Taux de succès: ${((testResults.filter(r => r.passed).length / testResults.length) * 100).toFixed(1)}%
- Statut global: ${testResults.every(r => r.passed) ? '✅ TOUS LES TESTS PASSÉS' : '❌ CERTAINS TESTS ÉCHOUÉS'}

RECOMMANDATIONS:
${testResults.filter(r => !r.passed).length > 0 ? 
  testResults.filter(r => !r.passed).map(r => `- Corriger: ${r.test}`).join('\n') : 
  '- Aucune correction nécessaire, tous les tests sont passés !'
}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `test-report-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const passedTests = testResults.filter(r => r.passed).length;
  const totalTests = testResults.length;
  const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : '0';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Test du Système de Tracking BantuDelice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Tests Automatisés</h3>
                <p className="text-gray-600">
                  Ce composant teste toutes les fonctionnalités du système de tracking et de génération PDF.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{successRate}%</div>
                <div className="text-sm text-gray-600">
                  {passedTests}/{totalTests} tests passés
                </div>
              </div>
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
                    Exécution des tests...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Lancer tous les tests
                  </>
                )}
              </Button>

              {testResults.length > 0 && (
                <Button variant="outline" onClick={downloadTestReport}>
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
                        result.passed 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {result.passed ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="font-medium">{result.test}</span>
                            <Badge variant={result.passed ? 'default' : 'destructive'}>
                              {result.passed ? 'PASS' : 'FAIL'}
                            </Badge>
                          </div>
                          {result.details && (
                            <div className="text-sm text-gray-600 ml-6">
                              {result.details}
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

      {/* Instructions de test manuel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Tests Manuels à Effectuer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">1. Test de la page de tracking</h4>
              <div className="space-y-2 text-sm">
                <div>• Aller sur <code>/colis/tracking</code></div>
                <div>• Tester les numéros : <code>BD123456</code>, <code>DHL123456789</code></div>
                <div>• Vérifier que le texte est lisible dans le champ de saisie</div>
                <div>• Tester les messages d'erreur avec des numéros invalides</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">2. Test des actions</h4>
              <div className="space-y-2 text-sm">
                <div>• Cliquer sur "Scanner QR" → Doit afficher un message</div>
                <div>• Cliquer sur "Étiquette" → Doit télécharger un fichier</div>
                <div>• Cliquer sur "Reçu" → Doit télécharger un fichier</div>
                <div>• Cliquer sur "Facture" → Doit télécharger un fichier</div>
                <div>• Cliquer sur "Partager" → Doit copier le lien</div>
                <div>• Cliquer sur "Support" → Doit ouvrir la page support</div>
                <div>• Cliquer sur "Email" → Doit ouvrir le client email</div>
                <div>• Cliquer sur "Notifications" → Doit afficher un message</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">3. Test des fonctionnalités avancées</h4>
              <div className="space-y-2 text-sm">
                <div>• Vérifier l'affichage des informations d'assurance</div>
                <div>• Vérifier l'affichage des instructions de livraison</div>
                <div>• Vérifier la timeline avec les icônes</div>
                <div>• Vérifier les badges de statut colorés</div>
                <div>• Vérifier la détection automatique du transporteur</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColisTrackingTest; 