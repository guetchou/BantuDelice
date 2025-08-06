// Utilitaire pour tester les API backend
export interface BackendTestResult {
  endpoint: string;
  method: string;
  success: boolean;
  statusCode?: number;
  response?: unknown;
  error?: string;
  duration: number;
}

export class BackendTester {
  private static baseUrl = import.meta.env?.VITE_API_URL || 'http://localhost:3001'; // URL du backend

  /**
   * Teste un endpoint API
   */
  static async testEndpoint(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: unknown
  ): Promise<BackendTestResult> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const duration = Date.now() - startTime;
      
      if (response.ok) {
        const data = await response.json();
        return {
          endpoint,
          method,
          success: true,
          statusCode: response.status,
          response: data,
          duration
        };
      } else {
        return {
          endpoint,
          method,
          success: false,
          statusCode: response.status,
          error: `HTTP ${response.status}: ${response.statusText}`,
          duration
        };
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        endpoint,
        method,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        duration
      };
    }
  }

  /**
   * Teste tous les endpoints principaux
   */
  static async runAllTests(): Promise<BackendTestResult[]> {
    const tests: Promise<BackendTestResult>[] = [
      // Test de santé
      this.testEndpoint('/health'),
      
      // Test des utilisateurs
      this.testEndpoint('/users'),
      this.testEndpoint('/users/1'),
      
      // Test des commandes
      this.testEndpoint('/orders'),
      this.testEndpoint('/orders/1'),
      
      // Test des restaurants
      this.testEndpoint('/restaurants'),
      this.testEndpoint('/restaurants/1'),
      
      // Test des paiements
      this.testEndpoint('/payments'),
      
      // Test des notifications
      this.testEndpoint('/notifications'),
      
      // Test du tracking
      this.testEndpoint('/tracking'),
      this.testEndpoint('/tracking/1'),
      
      // Test des services
      this.testEndpoint('/services'),
      
      // Test des chauffeurs
      this.testEndpoint('/drivers'),
      
      // Test du call center
      this.testEndpoint('/call-center'),
      
      // Test des statistiques
      this.testEndpoint('/admin/stats'),
    ];

    return Promise.all(tests);
  }

  /**
   * Teste spécifiquement les endpoints de colis
   */
  static async testColisEndpoints(): Promise<BackendTestResult[]> {
    const tests: Promise<BackendTestResult>[] = [
      // Test des colis nationaux
      this.testEndpoint('/colis-national/BD123456'),
      this.testEndpoint('/colis-national/BD999999'),
      
      // Test des colis internationaux
      this.testEndpoint('/colis-international/DHL123456789'),
      this.testEndpoint('/colis-international/DHL999999999'),
      
      // Test du suivi universel
      this.testEndpoint('/colis/BD123456'),
      this.testEndpoint('/colis/DHL123456789'),
      
      // Test des tarifs
      this.testEndpoint('/colis/tarifs', 'POST', {
        from: 'Brazzaville',
        to: 'Pointe-Noire',
        weight: 2.5,
        service: 'standard'
      }),
      
      // Test de création d'expédition
      this.testEndpoint('/colis/expedier', 'POST', {
        sender: {
          name: 'Jean Dupont',
          address: '123 Avenue de la Paix',
          city: 'Brazzaville',
          phone: '+242 06 123 456'
        },
        recipient: {
          name: 'Marie Martin',
          address: '456 Boulevard du Commerce',
          city: 'Pointe-Noire',
          phone: '+242 06 789 012'
        },
        package: {
          weight: 2.5,
          dimensions: '30x20x15 cm',
          contents: 'Documents'
        },
        service: 'standard'
      }),
    ];

    return Promise.all(tests);
  }

  /**
   * Teste la base de données
   */
  static async testany(): Promise<BackendTestResult[]> {
    const tests: Promise<BackendTestResult>[] = [
      // Test de connexion DB
      this.testEndpoint('/admin/db/status'),
      
      // Test des tables principales
      this.testEndpoint('/admin/db/tables'),
      
      // Test des statistiques DB
      this.testEndpoint('/admin/db/stats'),
    ];

    return Promise.all(tests);
  }

  /**
   * Génère un rapport de test
   */
  static generateReport(results: BackendTestResult[]): string {
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
    const avgDuration = totalDuration / results.length;

    return `
RAPPORT DE TEST BACKEND - BANTUDELICE
=====================================

Date: ${new Date().toLocaleString('fr-FR')}
Base URL: ${this.baseUrl}
Tests exécutés: ${results.length}

RÉSUMÉ:
- Tests réussis: ${successful.length}/${results.length} (${((successful.length / results.length) * 100).toFixed(1)}%)
- Tests échoués: ${failed.length}/${results.length}
- Durée totale: ${totalDuration}ms
- Durée moyenne: ${avgDuration.toFixed(0)}ms

ENDPOINTS RÉUSSIS (${successful.length}):
${successful.map(r => `✅ ${r.method} ${r.endpoint} (${r.statusCode}) - ${r.duration}ms`).join('\n')}

ENDPOINTS ÉCHOUÉS (${failed.length}):
${failed.map(r => `❌ ${r.method} ${r.endpoint} - ${r.error} (${r.duration}ms)`).join('\n')}

DÉTAILS PAR ENDPOINT:
${results.map(r => `
${r.success ? '✅' : '❌'} ${r.method} ${r.endpoint}
   Statut: ${r.statusCode || 'N/A'}
   Durée: ${r.duration}ms
   ${r.error ? `Erreur: ${r.error}` : `Réponse: ${JSON.stringify(r.response, null, 2).substring(0, 200)}...`}
`).join('')}

RECOMMANDATIONS:
${failed.length > 0 ? 
  failed.map(r => `- Vérifier: ${r.method} ${r.endpoint} (${r.error})`).join('\n') : 
  '- Tous les endpoints fonctionnent correctement !'
}

${failed.length > 0 ? `
PROBLÈMES IDENTIFIÉS:
${failed.map(r => `• ${r.endpoint}: ${r.error}`).join('\n')}
` : ''}
    `.trim();
  }

  /**
   * Teste la connectivité réseau
   */
  static async testConnectivity(): Promise<BackendTestResult[]> {
    const tests: Promise<BackendTestResult>[] = [
      // Test de connectivité de base
      this.testEndpoint('/'),
      this.testEndpoint('/api'),
      
      // Test avec timeout
      this.testEndpoint('/health'),
    ];

    return Promise.all(tests);
  }

  /**
   * Teste les performances
   */
  static async testPerformance(): Promise<BackendTestResult[]> {
    const tests: Promise<BackendTestResult>[] = [];
    
    // Test de charge simple
    for (let i = 0; i < 5; i++) {
      tests.push(this.testEndpoint('/health'));
    }

    return Promise.all(tests);
  }
} 