import { colisApi, colisPerformance, colisAnalytics, colisOptimization } from './index';

// Types pour le déploiement
export interface DeploymentConfig {
  environment: 'development' | 'staging' | 'production';
  version: string;
  buildNumber: string;
  deploymentDate: string;
  enableMonitoring: boolean;
  enableErrorTracking: boolean;
  enablePerformanceMonitoring: boolean;
  enableUserAnalytics: boolean;
  enableHealthChecks: boolean;
}

export interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  lastCheck: string;
  error?: string;
}

export interface DeploymentMetrics {
  uptime: number;
  responseTime: number;
  errorRate: number;
  throughput: number;
  memoryUsage: number;
  cpuUsage: number;
  activeUsers: number;
}

export interface ErrorReport {
  id: string;
  type: 'api' | 'ui' | 'network' | 'validation' | 'performance';
  message: string;
  stack?: string;
  context: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class ColisDeploymentService {
  private config: DeploymentConfig;
  private healthChecks: Map<string, HealthCheck> = new Map();
  private errorReports: ErrorReport[] = [];
  private deploymentMetrics: DeploymentMetrics;
  private healthCheckInterval?: NodeJS.Timeout;
  private metricsInterval?: NodeJS.Timeout;
  private isMonitoring = false;

  constructor(config?: Partial<DeploymentConfig>) {
    this.config = {
      environment: import.meta.env?.MODE as 'development' | 'staging' | 'production' || 'development',
      version: import.meta.env?.VITE_APP_VERSION || '1.0.0',
      buildNumber: import.meta.env?.VITE_BUILD_NUMBER || '1',
      deploymentDate: new Date().toISOString(),
      enableMonitoring: true,
      enableErrorTracking: true,
      enablePerformanceMonitoring: true,
      enableUserAnalytics: true,
      enableHealthChecks: true,
      ...config
    };

    this.deploymentMetrics = {
      uptime: 0,
      responseTime: 0,
      errorRate: 0,
      throughput: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      activeUsers: 0
    };

    this.initialize();
  }

  private initialize(): void {
    this.setupErrorHandling();
    this.setupHealthChecks();
    this.setupMetricsCollection();
    this.setupPerformanceMonitoring();
    this.logDeployment();
  }

  // Configuration de la gestion d'erreurs
  private setupErrorHandling(): void {
    if (!this.config.enableErrorTracking) return;

    // Gestionnaire d'erreurs global
    window.addEventListener('error', (event) => {
      this.reportError({
        type: 'ui',
        message: event.message,
        stack: event.error?.stack,
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        },
        severity: 'high'
      });
    });

    // Gestionnaire d'erreurs de promesses non gérées
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        type: 'api',
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        context: {
          promise: event.promise
        },
        severity: 'high'
      });
    });

    // Intercepter les erreurs de l'API
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        if (!response.ok) {
          this.reportError({
            type: 'api',
            message: `HTTP ${response.status}: ${response.statusText}`,
            context: {
              url: args[0],
              method: args[1]?.method || 'GET',
              status: response.status
            },
            severity: response.status >= 500 ? 'high' : 'medium'
          });
        }
        
        return response;
      } catch (error) {
        this.reportError({
          type: 'network',
          message: error instanceof Error ? error.message : 'Network error',
          context: {
            url: args[0],
            method: args[1]?.method || 'GET'
          },
          severity: 'high'
        });
        throw error;
      }
    };
  }

  // Configuration des health checks
  private setupHealthChecks(): void {
    if (!this.config.enableHealthChecks) return;

    this.healthCheckInterval = setInterval(() => {
      this.performHealthChecks();
    }, 30000); // Toutes les 30 secondes
  }

  // Effectuer les health checks
  private async performHealthChecks(): Promise<void> {
    const services = [
      { name: 'api', url: '/api/health' },
      { name: 'database', url: '/api/db/health' },
      { name: 'cache', url: '/api/cache/health' }
    ];

    for (const service of services) {
      try {
        const startTime = Date.now();
        const response = await fetch(service.url);
        const responseTime = Date.now() - startTime;

        const healthCheck: HealthCheck = {
          service: service.name,
          status: response.ok ? 'healthy' : 'degraded',
          responseTime,
          lastCheck: new Date().toISOString(),
          error: response.ok ? undefined : `HTTP ${response.status}`
        };

        this.healthChecks.set(service.name, healthCheck);
      } catch (error) {
        const healthCheck: HealthCheck = {
          service: service.name,
          status: 'down',
          responseTime: 0,
          lastCheck: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error'
        };

        this.healthChecks.set(service.name, healthCheck);
      }
    }
  }

  // Configuration de la collecte de métriques
  private setupMetricsCollection(): void {
    if (!this.config.enableMonitoring) return;

    this.metricsInterval = setInterval(() => {
      this.collectMetrics();
    }, 60000); // Toutes les minutes
  }

  // Collecter les métriques
  private async collectMetrics(): Promise<void> {
    try {
      // Métriques de performance
      const performanceMetrics = await colisPerformance.getMetrics();
      
      // Métriques d'analytics
      const analyticsMetrics = await colisAnalytics.getPerformanceMetrics();

      // Métriques système
      const systemMetrics = this.getSystemMetrics();

      this.deploymentMetrics = {
        uptime: Date.now() - new Date(this.config.deploymentDate).getTime(),
        responseTime: performanceMetrics.averageResponseTime,
        errorRate: performanceMetrics.totalRequests > 0 ? 
          (performanceMetrics.errorCount / performanceMetrics.totalRequests) * 100 : 0,
        throughput: performanceMetrics.requestCount,
        memoryUsage: systemMetrics.memoryUsage,
        cpuUsage: systemMetrics.cpuUsage,
        activeUsers: this.getActiveUsers()
      };

      // Envoyer les métriques au serveur
      await this.sendMetricsToServer();
    } catch (error) {
      console.error('Failed to collect metrics:', error);
    }
  }

  // Obtenir les métriques système
  private getSystemMetrics(): { memoryUsage: number; cpuUsage: number } {
    let memoryUsage = 0;
    let cpuUsage = 0;

    // Métriques de mémoire
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      memoryUsage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
    }

    // Métriques CPU (estimation basée sur les performances)
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      cpuUsage = navigation.loadEventEnd - navigation.loadEventStart;
    }

    return { memoryUsage, cpuUsage };
  }

  // Obtenir le nombre d'utilisateurs actifs
  private getActiveUsers(): number {
    // En production, cela viendrait du serveur
    return Math.floor(Math.random() * 100) + 10; // Simulation
  }

  // Envoyer les métriques au serveur
  private async sendMetricsToServer(): Promise<void> {
    try {
      await fetch('/api/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          environment: this.config.environment,
          version: this.config.version,
          metrics: this.deploymentMetrics,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to send metrics:', error);
    }
  }

  // Configuration du monitoring des performances
  private setupPerformanceMonitoring(): void {
    if (!this.config.enablePerformanceMonitoring) return;

    // Observer les métriques de performance web
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            
            // Alerter si le temps de chargement est trop long
            if (navEntry.loadEventEnd - navEntry.loadEventStart > 5000) {
              this.reportError({
                type: 'performance',
                message: 'Page load time exceeded 5 seconds',
                context: {
                  loadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
                  domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart
                },
                severity: 'medium'
              });
            }
          }
        }
      });

      observer.observe({ entryTypes: ['navigation'] });
    }
  }

  // Logger le déploiement
  private logDeployment(): void {
    console.log('🚀 BantuDelice Colis déployé:', {
      environment: this.config.environment,
      version: this.config.version,
      buildNumber: this.config.buildNumber,
      deploymentDate: this.config.deploymentDate,
      features: {
        monitoring: this.config.enableMonitoring,
        errorTracking: this.config.enableErrorTracking,
        performanceMonitoring: this.config.enablePerformanceMonitoring,
        userAnalytics: this.config.enableUserAnalytics,
        healthChecks: this.config.enableHealthChecks
      }
    });
  }

  // Signaler une erreur
  reportError(error: Omit<ErrorReport, 'id' | 'timestamp'>): void {
    if (!this.config.enableErrorTracking) return;

    const errorReport: ErrorReport = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...error,
      timestamp: new Date().toISOString(),
      userId: this.getCurrentUserId(),
      sessionId: this.getCurrentSessionId()
    };

    this.errorReports.push(errorReport);

    // Envoyer l'erreur au serveur
    this.sendErrorToServer(errorReport);

    // Logger l'erreur
    console.error('Error reported:', errorReport);
  }

  // Obtenir l'ID utilisateur actuel
  private getCurrentUserId(): string | undefined {
    // En production, cela viendrait du contexte d'authentification
    return localStorage.getItem('userId') || undefined;
  }

  // Obtenir l'ID de session actuel
  private getCurrentSessionId(): string | undefined {
    // En production, cela viendrait du service d'analytics
    return sessionStorage.getItem('sessionId') || undefined;
  }

  // Envoyer l'erreur au serveur
  private async sendErrorToServer(errorReport: ErrorReport): Promise<void> {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorReport)
      });
    } catch (error) {
      console.error('Failed to send error report:', error);
    }
  }

  // Obtenir les health checks
  getHealthChecks(): HealthCheck[] {
    return Array.from(this.healthChecks.values());
  }

  // Obtenir les métriques de déploiement
  getDeploymentMetrics(): DeploymentMetrics {
    return { ...this.deploymentMetrics };
  }

  // Obtenir les rapports d'erreur
  getErrorReports(): ErrorReport[] {
    return [...this.errorReports];
  }

  // Obtenir le statut de santé global
  getOverallHealth(): 'healthy' | 'degraded' | 'down' {
    const healthChecks = this.getHealthChecks();
    
    if (healthChecks.length === 0) return 'healthy';
    
    const downServices = healthChecks.filter(h => h.status === 'down').length;
    const degradedServices = healthChecks.filter(h => h.status === 'degraded').length;
    
    if (downServices > 0) return 'down';
    if (degradedServices > 0) return 'degraded';
    return 'healthy';
  }

  // Générer un rapport de déploiement
  async generateDeploymentReport(): Promise<any> {
    const healthChecks = this.getHealthChecks();
    const deploymentMetrics = this.getDeploymentMetrics();
    const errorReports = this.getErrorReports();
    const overallHealth = this.getOverallHealth();

    return {
      deployment: {
        environment: this.config.environment,
        version: this.config.version,
        buildNumber: this.config.buildNumber,
        deploymentDate: this.config.deploymentDate,
        uptime: deploymentMetrics.uptime
      },
      health: {
        overall: overallHealth,
        services: healthChecks
      },
      metrics: deploymentMetrics,
      errors: {
        total: errorReports.length,
        bySeverity: this.getErrorsBySeverity(),
        recent: errorReports.slice(-10)
      },
      recommendations: this.generateRecommendations()
    };
  }

  // Obtenir les erreurs par sévérité
  private getErrorsBySeverity(): Record<string, number> {
    return this.errorReports.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  // Générer des recommandations
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const healthChecks = this.getHealthChecks();
    const deploymentMetrics = this.getDeploymentMetrics();

    // Recommandations basées sur la santé des services
    const downServices = healthChecks.filter(h => h.status === 'down');
    if (downServices.length > 0) {
      recommendations.push(`Services down: ${downServices.map(s => s.service).join(', ')}`);
    }

    // Recommandations basées sur les performances
    if (deploymentMetrics.responseTime > 2000) {
      recommendations.push('Temps de réponse élevé, considérer l\'optimisation');
    }

    if (deploymentMetrics.errorRate > 5) {
      recommendations.push('Taux d\'erreur élevé, investigation requise');
    }

    if (deploymentMetrics.memoryUsage > 80) {
      recommendations.push('Utilisation mémoire élevée, considérer l\'optimisation');
    }

    return recommendations;
  }

  // Démarrer le monitoring
  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.setupHealthChecks();
    this.setupMetricsCollection();
    console.log('Monitoring démarré');
  }

  // Arrêter le monitoring
  stopMonitoring(): void {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }
    
    console.log('Monitoring arrêté');
  }

  // Configuration
  updateConfig(newConfig: Partial<DeploymentConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Nettoyage
  destroy(): void {
    this.stopMonitoring();
    console.log('Service de déploiement détruit');
  }
}

// Instance singleton
export const colisDeployment = new ColisDeploymentService();

// Hook React pour le déploiement
export const useDeployment = () => {
  const [healthChecks, setHealthChecks] = React.useState(colisDeployment.getHealthChecks());
  const [deploymentMetrics, setDeploymentMetrics] = React.useState(colisDeployment.getDeploymentMetrics());
  const [overallHealth, setOverallHealth] = React.useState(colisDeployment.getOverallHealth());

  const generateReport = React.useCallback(async () => {
    return colisDeployment.generateDeploymentReport();
  }, []);

  const startMonitoring = React.useCallback(() => {
    colisDeployment.startMonitoring();
  }, []);

  const stopMonitoring = React.useCallback(() => {
    colisDeployment.stopMonitoring();
  }, []);

  const reportError = React.useCallback((error: Omit<ErrorReport, 'id' | 'timestamp'>) => {
    colisDeployment.reportError(error);
  }, []);

  // Mettre à jour les métriques périodiquement
  React.useEffect(() => {
    const interval = setInterval(() => {
      setHealthChecks(colisDeployment.getHealthChecks());
      setDeploymentMetrics(colisDeployment.getDeploymentMetrics());
      setOverallHealth(colisDeployment.getOverallHealth());
    }, 30000); // Toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  return {
    healthChecks,
    deploymentMetrics,
    overallHealth,
    generateReport,
    startMonitoring,
    stopMonitoring,
    reportError
  };
};

export default colisDeployment; 