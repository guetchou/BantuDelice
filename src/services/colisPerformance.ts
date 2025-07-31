import { colisApi, type ColisApiData, type ApiResponse } from './colisApi';

// Types pour les métriques de performance
export interface PerformanceMetrics {
  requestCount: number;
  successCount: number;
  errorCount: number;
  averageResponseTime: number;
  cacheHitRate: number;
  totalRequests: number;
  lastRequestTime: number;
}

export interface RequestLog {
  id: string;
  endpoint: string;
  method: string;
  startTime: number;
  endTime: number;
  duration: number;
  success: boolean;
  error?: string;
  cacheHit: boolean;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

// Configuration de performance
interface PerformanceConfig {
  enableMetrics: boolean;
  enableRequestLogging: boolean;
  enableCacheOptimization: boolean;
  maxCacheSize: number;
  defaultTTL: number;
  slowRequestThreshold: number;
  errorThreshold: number;
}

class ColisPerformanceService {
  private config: PerformanceConfig;
  private metrics: PerformanceMetrics;
  private requestLogs: RequestLog[] = [];
  private cache = new Map<string, CacheEntry<any>>();
  private pendingRequests = new Map<string, Promise<any>>();
  private observers: Set<(metrics: PerformanceMetrics) => void> = new Set();

  constructor(config?: Partial<PerformanceConfig>) {
    this.config = {
      enableMetrics: true,
      enableRequestLogging: true,
      enableCacheOptimization: true,
      maxCacheSize: 100,
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      slowRequestThreshold: 2000, // 2 secondes
      errorThreshold: 0.1, // 10%
      ...config
    };

    this.metrics = {
      requestCount: 0,
      successCount: 0,
      errorCount: 0,
      averageResponseTime: 0,
      cacheHitRate: 0,
      totalRequests: 0,
      lastRequestTime: 0
    };
  }

  // Méthodes de métriques
  startRequest(endpoint: string, method: string): string {
    if (!this.config.enableMetrics) return '';

    const requestId = this.generateRequestId();
    const startTime = performance.now();

    const log: RequestLog = {
      id: requestId,
      endpoint,
      method,
      startTime,
      endTime: 0,
      duration: 0,
      success: false,
      cacheHit: false
    };

    this.requestLogs.push(log);
    this.metrics.requestCount++;
    this.metrics.lastRequestTime = Date.now();

    return requestId;
  }

  endRequest(requestId: string, success: boolean, error?: string): void {
    if (!this.config.enableMetrics || !requestId) return;

    const log = this.requestLogs.find(l => l.id === requestId);
    if (!log) return;

    log.endTime = performance.now();
    log.duration = log.endTime - log.startTime;
    log.success = success;
    log.error = error;

    if (success) {
      this.metrics.successCount++;
    } else {
      this.metrics.errorCount++;
    }

    this.updateMetrics();
    this.checkPerformanceAlerts(log);
  }

  private updateMetrics(): void {
    const successfulLogs = this.requestLogs.filter(log => log.success);
    const totalLogs = this.requestLogs.length;

    if (totalLogs > 0) {
      this.metrics.averageResponseTime = successfulLogs.reduce((sum, log) => sum + log.duration, 0) / successfulLogs.length;
      this.metrics.cacheHitRate = this.cache.size / totalLogs;
      this.metrics.totalRequests = totalLogs;
    }

    this.notifyObservers();
  }

  private checkPerformanceAlerts(log: RequestLog): void {
    // Alerte pour les requêtes lentes
    if (log.duration > this.config.slowRequestThreshold) {
      console.warn(`[Performance] Requête lente détectée: ${log.endpoint} (${log.duration.toFixed(2)}ms)`);
    }

    // Alerte pour le taux d'erreur élevé
    const errorRate = this.metrics.errorCount / this.metrics.totalRequests;
    if (errorRate > this.config.errorThreshold) {
      console.error(`[Performance] Taux d'erreur élevé: ${(errorRate * 100).toFixed(2)}%`);
    }
  }

  // Méthodes de cache optimisé
  async getCachedOrFetch<T>(
    key: string,
    fetchFunction: () => Promise<ApiResponse<T>>,
    ttl: number = this.config.defaultTTL
  ): Promise<ApiResponse<T>> {
    if (!this.config.enableCacheOptimization) {
      return fetchFunction();
    }

    // Vérifier le cache
    const cached = this.getFromCache<T>(key);
    if (cached) {
      return { success: true, data: cached };
    }

    // Vérifier les requêtes en cours
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    // Effectuer la requête
    const requestPromise = fetchFunction().then(response => {
      if (response.success) {
        this.setCache(key, response.data, ttl);
      }
      this.pendingRequests.delete(key);
      return response;
    }).catch(error => {
      this.pendingRequests.delete(key);
      throw error;
    });

    this.pendingRequests.set(key, requestPromise);
    return requestPromise;
  }

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Vérifier l'expiration
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Mettre à jour les statistiques d'accès
    entry.accessCount++;
    entry.lastAccessed = Date.now();

    return entry.data;
  }

  private setCache<T>(key: string, data: T, ttl: number): void {
    // Nettoyer le cache si nécessaire
    this.cleanupCache();

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      accessCount: 1,
      lastAccessed: Date.now()
    };

    this.cache.set(key, entry);
  }

  private cleanupCache(): void {
    if (this.cache.size < this.config.maxCacheSize) return;

    // Supprimer les entrées les moins utilisées
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => {
      const scoreA = a[1].accessCount / (Date.now() - a[1].lastAccessed);
      const scoreB = b[1].accessCount / (Date.now() - b[1].lastAccessed);
      return scoreA - scoreB;
    });

    const toDelete = entries.slice(0, Math.floor(this.config.maxCacheSize * 0.2));
    toDelete.forEach(([key]) => this.cache.delete(key));
  }

  // Méthodes de requêtes optimisées
  async optimizedGetColis(id: string): Promise<ApiResponse<ColisApiData>> {
    const requestId = this.startRequest(`/colis/${id}`, 'GET');
    
    try {
      const result = await this.getCachedOrFetch(
        `colis:${id}`,
        () => colisApi.getColis(id),
        10 * 60 * 1000 // 10 minutes pour les colis
      );
      
      this.endRequest(requestId, result.success);
      return result;
    } catch (error) {
      this.endRequest(requestId, false, error instanceof Error ? error.message : 'Erreur inconnue');
      throw error;
    }
  }

  async optimizedListColis(params?: any): Promise<ApiResponse<any>> {
    const requestId = this.startRequest('/colis', 'GET');
    
    try {
      const result = await this.getCachedOrFetch(
        `colis:list:${JSON.stringify(params)}`,
        () => colisApi.listColis(params),
        2 * 60 * 1000 // 2 minutes pour les listes
      );
      
      this.endRequest(requestId, result.success);
      return result;
    } catch (error) {
      this.endRequest(requestId, false, error instanceof Error ? error.message : 'Erreur inconnue');
      throw error;
    }
  }

  async optimizedGetStats(period?: string): Promise<ApiResponse<StatsApiData>> {
    const requestId = this.startRequest('/colis/stats', 'GET');
    
    try {
      const result = await this.getCachedOrFetch(
        `stats:${period || 'default'}`,
        () => colisApi.getStats(period),
        30 * 1000 // 30 secondes pour les stats
      );
      
      this.endRequest(requestId, result.success);
      return result;
    } catch (error) {
      this.endRequest(requestId, false, error instanceof Error ? error.message : 'Erreur inconnue');
      throw error;
    }
  }

  // Méthodes de batch et de requêtes multiples
  async batchGetColis(ids: string[]): Promise<ApiResponse<ColisApiData>[]> {
    const requestId = this.startRequest('/colis/batch', 'POST');
    
    try {
      const promises = ids.map(id => this.optimizedGetColis(id));
      const results = await Promise.allSettled(promises);
      
      const successfulResults = results
        .filter((result): result is PromiseFulfilledResult<ApiResponse<ColisApiData>> => 
          result.status === 'fulfilled'
        )
        .map(result => result.value);

      const failedCount = results.length - successfulResults.length;
      this.endRequest(requestId, failedCount === 0);
      
      return successfulResults;
    } catch (error) {
      this.endRequest(requestId, false, error instanceof Error ? error.message : 'Erreur inconnue');
      throw error;
    }
  }

  // Méthodes de préchargement
  async preloadColisData(ids: string[]): Promise<void> {
    if (!this.config.enableCacheOptimization) return;

    const uncachedIds = ids.filter(id => !this.cache.has(`colis:${id}`));
    
    if (uncachedIds.length > 0) {
      // Précharger en arrière-plan
      this.batchGetColis(uncachedIds).catch(error => {
        console.warn('[Performance] Échec du préchargement:', error);
      });
    }
  }

  // Méthodes de nettoyage
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  clearRequestLogs(): void {
    this.requestLogs = [];
    this.updateMetrics();
  }

  // Méthodes d'observation
  observeMetrics(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  private notifyObservers(): void {
    this.observers.forEach(callback => {
      try {
        callback(this.metrics);
      } catch (error) {
        console.error('[Performance] Erreur dans l\'observateur:', error);
      }
    });
  }

  // Getters
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getRequestLogs(): RequestLog[] {
    return [...this.requestLogs];
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  getCacheKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  // Utilitaires
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Méthodes de diagnostic
  generatePerformanceReport(): string {
    const report = {
      metrics: this.metrics,
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      recentErrors: this.requestLogs
        .filter(log => !log.success)
        .slice(-10)
        .map(log => ({
          endpoint: log.endpoint,
          error: log.error,
          duration: log.duration
        })),
      slowRequests: this.requestLogs
        .filter(log => log.duration > this.config.slowRequestThreshold)
        .slice(-5)
        .map(log => ({
          endpoint: log.endpoint,
          duration: log.duration
        }))
    };

    return JSON.stringify(report, null, 2);
  }
}

// Instance singleton
export const colisPerformance = new ColisPerformanceService();

// Hook React pour les métriques de performance
export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>(colisPerformance.getMetrics());

  React.useEffect(() => {
    const unsubscribe = colisPerformance.observeMetrics(setMetrics);
    return unsubscribe;
  }, []);

  return {
    metrics,
    clearCache: colisPerformance.clearCache.bind(colisPerformance),
    clearLogs: colisPerformance.clearRequestLogs.bind(colisPerformance),
    generateReport: colisPerformance.generatePerformanceReport.bind(colisPerformance),
    preloadData: colisPerformance.preloadColisData.bind(colisPerformance)
  };
};

// Hook pour les requêtes optimisées
export const useOptimizedColis = (id?: string) => {
  const [data, setData] = React.useState<ColisApiData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    colisPerformance.optimizedGetColis(id)
      .then(response => {
        if (response.success) {
          setData(response.data);
        } else {
          setError(response.error || 'Erreur inconnue');
        }
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return { data, loading, error };
};

// Hook pour les listes optimisées
export const useOptimizedColisList = (params?: any) => {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    setError(null);

    colisPerformance.optimizedListColis(params)
      .then(response => {
        if (response.success) {
          setData(response.data);
        } else {
          setError(response.error || 'Erreur inconnue');
        }
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [JSON.stringify(params)]);

  return { data, loading, error };
};

export default colisPerformance; 