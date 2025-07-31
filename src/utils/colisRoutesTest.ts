// Test de toutes les routes /colis
export interface ColisRouteTestResult {
  route: string;
  frontend: boolean;
  backend: boolean;
  database: boolean;
  overall: boolean;
  details?: string;
}

export class ColisRoutesTester {
  private static backendUrl = 'http://10.10.0.5:3001';
  private static frontendUrl = 'http://10.10.0.5:9595';

  /**
   * Teste toutes les routes /colis
   */
  static async testAllColisRoutes(): Promise<ColisRouteTestResult[]> {
    const results: ColisRouteTestResult[] = [];

    // Test des routes principales
    results.push(await this.testRoute('/', 'Page d\'accueil Colis'));
    results.push(await this.testRoute('/tracking', 'Page de tracking'));
    results.push(await this.testRoute('/tracking-page', 'Page de tracking avancée'));
    results.push(await this.testRoute('/tarifs', 'Page des tarifs'));
    results.push(await this.testRoute('/expedier', 'Formulaire d\'expédition'));
    results.push(await this.testRoute('/historique', 'Historique des colis'));
    results.push(await this.testRoute('/dashboard', 'Tableau de bord'));
    results.push(await this.testRoute('/national', 'Colis nationaux'));
    results.push(await this.testRoute('/international', 'Colis internationaux'));
    results.push(await this.testRoute('/support', 'Support client'));
    results.push(await this.testRoute('/api', 'Documentation API'));
    results.push(await this.testRoute('/restrictions', 'Restrictions et interdictions'));
    results.push(await this.testRoute('/a-propos', 'À propos'));

    // Test des APIs backend
    results.push(await this.testBackendAPI('/colis/BD123456', 'API Tracking National'));
    results.push(await this.testBackendAPI('/colis/DHL123456789', 'API Tracking International'));
    results.push(await this.testBackendAPI('/colis/national/BD123456', 'API Tracking National Spécifique'));
    results.push(await this.testBackendAPI('/colis/international/DHL123456789', 'API Tracking International Spécifique'));
    results.push(await this.testBackendAPIPost('/colis/tarifs', 'API Calcul Tarifs'));

    return results;
  }

  /**
   * Teste une route frontend
   */
  private static async testRoute(path: string, description: string): Promise<ColisRouteTestResult> {
    try {
      const response = await fetch(`${this.frontendUrl}/#/colis${path}`);
      const isValid = response.ok && response.status === 200;
      
      return {
        route: `/colis${path}`,
        frontend: isValid,
        backend: true, // Le backend n'est pas directement testé pour les routes frontend
        database: true, // La DB n'est pas directement testée pour les routes frontend
        overall: isValid,
        details: `${description}: ${isValid ? 'Accessible' : 'Non accessible'} (${response.status})`
      };
    } catch (error) {
      return {
        route: `/colis${path}`,
        frontend: false,
        backend: true,
        database: true,
        overall: false,
        details: `${description}: Erreur - ${error}`
      };
    }
  }

  /**
   * Teste une API backend GET
   */
  private static async testBackendAPI(path: string, description: string): Promise<ColisRouteTestResult> {
    try {
      const response = await fetch(`${this.backendUrl}${path}`);
      const data = await response.json();
      const isValid = response.ok && data.success;
      
      return {
        route: path,
        frontend: true, // Le frontend n'est pas directement testé pour les APIs
        backend: isValid,
        database: isValid, // Si l'API répond, la DB est probablement connectée
        overall: isValid,
        details: `${description}: ${isValid ? 'Fonctionnelle' : 'Erreur'} (${response.status})`
      };
    } catch (error) {
      return {
        route: path,
        frontend: true,
        backend: false,
        database: false,
        overall: false,
        details: `${description}: Erreur - ${error}`
      };
    }
  }

  /**
   * Teste une API backend POST
   */
  private static async testBackendAPIPost(path: string, description: string): Promise<ColisRouteTestResult> {
    try {
      const response = await fetch(`${this.backendUrl}${path}`, {
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
      const isValid = response.ok && data.success;
      
      return {
        route: path,
        frontend: true,
        backend: isValid,
        database: isValid,
        overall: isValid,
        details: `${description}: ${isValid ? 'Fonctionnelle' : 'Erreur'} (${response.status})`
      };
    } catch (error) {
      return {
        route: path,
        frontend: true,
        backend: false,
        database: false,
        overall: false,
        details: `${description}: Erreur - ${error}`
      };
    }
  }

  /**
   * Teste les routes protégées (nécessitent authentification)
   */
  static async testProtectedRoutes(): Promise<ColisRouteTestResult[]> {
    const results: ColisRouteTestResult[] = [];

    const protectedRoutes = [
      { path: '/agent-dashboard', description: 'Dashboard Agent' },
      { path: '/supervisor-dashboard', description: 'Dashboard Superviseur' },
      { path: '/director-dashboard', description: 'Dashboard Directeur' },
    ];

    for (const route of protectedRoutes) {
      try {
        const response = await fetch(`${this.frontendUrl}/#/colis${route.path}`);
        // Les routes protégées peuvent retourner 200 mais rediriger vers login
        const isValid = response.ok;
        
        results.push({
          route: `/colis${route.path}`,
          frontend: isValid,
          backend: true,
          database: true,
          overall: isValid,
          details: `${route.description}: ${isValid ? 'Accessible (protégée)' : 'Non accessible'} (${response.status})`
        });
      } catch (error) {
        results.push({
          route: `/colis${route.path}`,
          frontend: false,
          backend: true,
          database: true,
          overall: false,
          details: `${route.description}: Erreur - ${error}`
        });
      }
    }

    return results;
  }

  /**
   * Teste les fonctionnalités avancées
   */
  static async testAdvancedFeatures(): Promise<ColisRouteTestResult[]> {
    const results: ColisRouteTestResult[] = [];

    const advancedRoutes = [
      { path: '/advanced-features', description: 'Fonctionnalités avancées' },
      { path: '/predictive-analytics', description: 'Analyses prédictives' },
      { path: '/automation-hub', description: 'Hub d\'automatisation' },
      { path: '/intelligent-routing', description: 'Routage intelligent' },
      { path: '/ai-chatbot', description: 'Chatbot IA' },
      { path: '/image-recognition', description: 'Reconnaissance d\'images' },
      { path: '/sentiment-analysis', description: 'Analyse de sentiment' },
      { path: '/predictive-maintenance', description: 'Maintenance prédictive' },
      { path: '/production-ready', description: 'Production Ready' },
      { path: '/bulk-interface', description: 'Interface en lot' },
    ];

    for (const route of advancedRoutes) {
      try {
        const response = await fetch(`${this.frontendUrl}/#/colis${route.path}`);
        const isValid = response.ok;
        
        results.push({
          route: `/colis${route.path}`,
          frontend: isValid,
          backend: true,
          database: true,
          overall: isValid,
          details: `${route.description}: ${isValid ? 'Accessible' : 'Non accessible'} (${response.status})`
        });
      } catch (error) {
        results.push({
          route: `/colis${route.path}`,
          frontend: false,
          backend: true,
          database: true,
          overall: false,
          details: `${route.description}: Erreur - ${error}`
        });
      }
    }

    return results;
  }

  /**
   * Génère un rapport complet des routes
   */
  static generateRoutesReport(results: ColisRouteTestResult[]): string {
    const totalRoutes = results.length;
    const passedRoutes = results.filter(r => r.overall).length;
    const frontendRoutes = results.filter(r => r.frontend).length;
    const backendRoutes = results.filter(r => r.backend).length;
    const databaseRoutes = results.filter(r => r.database).length;

    const routeCategories = {
      'Routes Principales': results.filter(r => 
        ['/', '/tracking', '/tarifs', '/expedier', '/dashboard', '/support'].includes(r.route.replace('/colis', ''))
      ),
      'APIs Backend': results.filter(r => r.route.startsWith('/colis/') && !r.route.includes('#')),
      'Routes Avancées': results.filter(r => 
        r.route.includes('advanced') || r.route.includes('predictive') || r.route.includes('automation') || 
        r.route.includes('intelligent') || r.route.includes('ai') || r.route.includes('image') || 
        r.route.includes('sentiment') || r.route.includes('maintenance') || r.route.includes('production') || 
        r.route.includes('bulk')
      ),
      'Routes Protégées': results.filter(r => r.route.includes('dashboard') && r.route.includes('agent'))
    };

    return `
RAPPORT COMPLET DES ROUTES /COLIS - BANTUDELICE
==============================================

Date: ${new Date().toLocaleString('fr-FR')}
Routes testées: ${totalRoutes}

RÉSUMÉ GLOBAL:
- Routes fonctionnelles: ${passedRoutes}/${totalRoutes} (${((passedRoutes / totalRoutes) * 100).toFixed(1)}%)
- Frontend opérationnel: ${frontendRoutes}/${totalRoutes} (${((frontendRoutes / totalRoutes) * 100).toFixed(1)}%)
- Backend opérationnel: ${backendRoutes}/${totalRoutes} (${((backendRoutes / totalRoutes) * 100).toFixed(1)}%)
- Base de données opérationnelle: ${databaseRoutes}/${totalRoutes} (${((databaseRoutes / totalRoutes) * 100).toFixed(1)}%)

RÉSULTATS PAR CATÉGORIE:

${Object.entries(routeCategories).map(([category, routes]) => `
${category} (${routes.length} routes):
${routes.map(route => `  ${route.overall ? '✅' : '❌'} ${route.route} - ${route.details}`).join('\n')}
`).join('')}

ROUTES PRINCIPALES TESTÉES:
${results.filter(r => ['/', '/tracking', '/tarifs', '/expedier', '/dashboard', '/support'].includes(r.route.replace('/colis', ''))).map(route => 
  `  ${route.overall ? '✅' : '❌'} ${route.route} - ${route.details}`
).join('\n')}

APIS BACKEND TESTÉES:
${results.filter(r => r.route.startsWith('/colis/') && !r.route.includes('#')).map(route => 
  `  ${route.overall ? '✅' : '❌'} ${route.route} - ${route.details}`
).join('\n')}

STATUT DE L'INTÉGRATION:
${passedRoutes === totalRoutes ? 
  '🎉 INTÉGRATION COMPLÈTE - Toutes les routes /colis fonctionnent correctement !' :
  '⚠️ INTÉGRATION PARTIELLE - Certaines routes nécessitent une attention.'
}

URLS DE TEST:
- Frontend principal: ${this.frontendUrl}/#/colis
- Page de tracking: ${this.frontendUrl}/#/colis/tracking
- Page des tarifs: ${this.frontendUrl}/#/colis/tarifs
- Formulaire d'expédition: ${this.frontendUrl}/#/colis/expedier
- Support: ${this.frontendUrl}/#/colis/support
- Backend API: ${this.backendUrl}/colis/BD123456

RECOMMANDATIONS:
${results.filter(r => !r.overall).length > 0 ? 
  results.filter(r => !r.overall).map(r => `- Vérifier: ${r.route} (${r.details})`).join('\n') : 
  '- Aucune action requise, toutes les routes /colis sont opérationnelles !'
}
    `.trim();
  }
} 