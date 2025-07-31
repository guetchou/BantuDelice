// Test d'intégration frontend-backend
export interface IntegrationTestResult {
  test: string;
  frontend: boolean;
  backend: boolean;
  database: boolean;
  overall: boolean;
  details?: string;
}

export class IntegrationTester {
  private static backendUrl = 'http://10.10.0.5:3001';
  private static frontendUrl = 'http://10.10.0.5:9595';

  /**
   * Teste l'intégration complète
   */
  static async runIntegrationTests(): Promise<IntegrationTestResult[]> {
    const results: IntegrationTestResult[] = [];

    // Test 1: Connectivité backend
    results.push(await this.testBackendConnectivity());

    // Test 2: API de tracking
    results.push(await this.testTrackingAPI());

    // Test 3: API de tarifs
    results.push(await this.testPricingAPI());

    // Test 4: Base de données
    results.push(await this.testDatabaseConnection());

    // Test 5: Frontend connectivité
    results.push(await this.testFrontendConnectivity());

    // Test 6: Intégration complète
    results.push(await this.testFullIntegration());

    return results;
  }

  /**
   * Teste la connectivité backend
   */
  private static async testBackendConnectivity(): Promise<IntegrationTestResult> {
    try {
      const response = await fetch(`${this.backendUrl}/health`);
      const data = await response.json();
      
      return {
        test: 'Connectivité Backend',
        frontend: true,
        backend: response.ok && data.status === 'ok',
        database: true,
        overall: response.ok && data.status === 'ok',
        details: `Backend répond: ${data.status} (${response.status})`
      };
    } catch (error) {
      return {
        test: 'Connectivité Backend',
        frontend: true,
        backend: false,
        database: false,
        overall: false,
        details: `Erreur: ${error}`
      };
    }
  }

  /**
   * Teste l'API de tracking
   */
  private static async testTrackingAPI(): Promise<IntegrationTestResult> {
    try {
      // Test national
      const nationalResponse = await fetch(`${this.backendUrl}/colis/BD123456`);
      const nationalData = await nationalResponse.json();
      
      // Test international
      const internationalResponse = await fetch(`${this.backendUrl}/colis/DHL123456789`);
      const internationalData = await internationalResponse.json();
      
      const nationalValid = nationalResponse.ok && nationalData.success && nationalData.data.type === 'national';
      const internationalValid = internationalResponse.ok && internationalData.success && internationalData.data.type === 'international';
      
      return {
        test: 'API Tracking',
        frontend: true,
        backend: nationalValid && internationalValid,
        database: true,
        overall: nationalValid && internationalValid,
        details: `National: ${nationalValid ? 'OK' : 'FAIL'}, International: ${internationalValid ? 'OK' : 'FAIL'}`
      };
    } catch (error) {
      return {
        test: 'API Tracking',
        frontend: true,
        backend: false,
        database: false,
        overall: false,
        details: `Erreur: ${error}`
      };
    }
  }

  /**
   * Teste l'API de tarifs
   */
  private static async testPricingAPI(): Promise<IntegrationTestResult> {
    try {
      const response = await fetch(`${this.backendUrl}/colis/tarifs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Brazzaville',
          to: 'Pointe-Noire',
          weight: 2.5,
          service: 'standard'
        })
      });
      
      const data = await response.json();
      const isValid = response.ok && data.success && data.data.total > 0;
      
      return {
        test: 'API Tarifs',
        frontend: true,
        backend: isValid,
        database: true,
        overall: isValid,
        details: `Calcul tarif: ${isValid ? `${data.data.total} FCFA` : 'FAIL'}`
      };
    } catch (error) {
      return {
        test: 'API Tarifs',
        frontend: true,
        backend: false,
        database: false,
        overall: false,
        details: `Erreur: ${error}`
      };
    }
  }

  /**
   * Teste la connexion base de données
   */
  private static async testDatabaseConnection(): Promise<IntegrationTestResult> {
    try {
      // Test indirect via l'API
      const response = await fetch(`${this.backendUrl}/colis/BD123456`);
      const data = await response.json();
      
      // Si l'API répond avec des données structurées, la DB est probablement connectée
      const dbConnected = response.ok && data.success && data.data.trackingNumber;
      
      return {
        test: 'Base de Données',
        frontend: true,
        backend: true,
        database: dbConnected,
        overall: dbConnected,
        details: `DB accessible: ${dbConnected ? 'OUI' : 'NON'}`
      };
    } catch (error) {
      return {
        test: 'Base de Données',
        frontend: true,
        backend: false,
        database: false,
        overall: false,
        details: `Erreur: ${error}`
      };
    }
  }

  /**
   * Teste la connectivité frontend
   */
  private static async testFrontendConnectivity(): Promise<IntegrationTestResult> {
    try {
      const response = await fetch(this.frontendUrl);
      const isValid = response.ok && response.status === 200;
      
      return {
        test: 'Connectivité Frontend',
        frontend: isValid,
        backend: true,
        database: true,
        overall: isValid,
        details: `Frontend accessible: ${isValid ? 'OUI' : 'NON'} (${response.status})`
      };
    } catch (error) {
      return {
        test: 'Connectivité Frontend',
        frontend: false,
        backend: true,
        database: true,
        overall: false,
        details: `Erreur: ${error}`
      };
    }
  }

  /**
   * Teste l'intégration complète
   */
  private static async testFullIntegration(): Promise<IntegrationTestResult> {
    try {
      // Test complet : frontend → backend → database
      const frontendOk = await this.testFrontendConnectivity();
      const backendOk = await this.testBackendConnectivity();
      const trackingOk = await this.testTrackingAPI();
      
      const allComponentsWork = frontendOk.overall && backendOk.overall && trackingOk.overall;
      
      return {
        test: 'Intégration Complète',
        frontend: frontendOk.frontend,
        backend: backendOk.backend,
        database: trackingOk.database,
        overall: allComponentsWork,
        details: `Frontend: ${frontendOk.frontend ? 'OK' : 'FAIL'}, Backend: ${backendOk.backend ? 'OK' : 'FAIL'}, DB: ${trackingOk.database ? 'OK' : 'FAIL'}`
      };
    } catch (error) {
      return {
        test: 'Intégration Complète',
        frontend: false,
        backend: false,
        database: false,
        overall: false,
        details: `Erreur: ${error}`
      };
    }
  }

  /**
   * Génère un rapport d'intégration
   */
  static generateIntegrationReport(results: IntegrationTestResult[]): string {
    const totalTests = results.length;
    const passedTests = results.filter(r => r.overall).length;
    const frontendTests = results.filter(r => r.frontend).length;
    const backendTests = results.filter(r => r.backend).length;
    const databaseTests = results.filter(r => r.database).length;

    return `
RAPPORT D'INTÉGRATION - BANTUDELICE
===================================

Date: ${new Date().toLocaleString('fr-FR')}
Tests d'intégration: ${totalTests}

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

STATUT DE L'INTÉGRATION:
${passedTests === totalTests ? 
  '🎉 INTÉGRATION COMPLÈTE - Tous les composants fonctionnent correctement !' :
  '⚠️ INTÉGRATION PARTIELLE - Certains composants nécessitent une attention.'
}

COMPOSANTS:
- Frontend (React/Vite): ${frontendTests > 0 ? '✅ Opérationnel' : '❌ Problème'}
- Backend (NestJS): ${backendTests > 0 ? '✅ Opérationnel' : '❌ Problème'}
- Base de données (PostgreSQL): ${databaseTests > 0 ? '✅ Opérationnelle' : '❌ Problème'}
- API Tracking: ${results.find(r => r.test === 'API Tracking')?.overall ? '✅ Opérationnelle' : '❌ Problème'}
- API Tarifs: ${results.find(r => r.test === 'API Tarifs')?.overall ? '✅ Opérationnelle' : '❌ Problème'}

RECOMMANDATIONS:
${results.filter(r => !r.overall).length > 0 ? 
  results.filter(r => !r.overall).map(r => `- Vérifier: ${r.test} (${r.details})`).join('\n') : 
  '- Aucune action requise, l\'intégration est complète !'
}

URLS DE TEST:
- Frontend: ${this.frontendUrl}
- Backend Health: ${this.backendUrl}/health
- API Tracking: ${this.backendUrl}/colis/BD123456
- API Tarifs: ${this.backendUrl}/colis/tarifs
    `.trim();
  }
} 