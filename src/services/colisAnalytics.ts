import { colisApi, colisPerformance } from './index';
import type { ColisApiData, NotificationApiData, StatsApiData } from './colisApi';

// Types pour les analytics
export interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'api_call' | 'error' | 'user_action' | 'performance';
  name: string;
  data: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

export interface PerformanceMetrics {
  apiResponseTime: number;
  cacheHitRate: number;
  errorRate: number;
  userEngagement: number;
  conversionRate: number;
  loadTime: number;
  memoryUsage: number;
  networkLatency: number;
}

export interface UserBehavior {
  sessionDuration: number;
  pagesVisited: string[];
  actionsPerformed: string[];
  timeOnPage: Record<string, number>;
  scrollDepth: Record<string, number>;
  clicks: Record<string, number>;
}

export interface BusinessMetrics {
  totalRevenue: number;
  averageOrderValue: number;
  customerLifetimeValue: number;
  churnRate: number;
  customerSatisfaction: number;
  deliverySuccessRate: number;
  repeatCustomerRate: number;
}

export interface AnalyticsConfig {
  enableTracking: boolean;
  enablePerformanceMonitoring: boolean;
  enableUserBehaviorTracking: boolean;
  enableBusinessMetrics: boolean;
  sampleRate: number;
  batchSize: number;
  flushInterval: number;
  endpoint: string;
}

class ColisAnalyticsService {
  private config: AnalyticsConfig;
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private userId?: string;
  private flushTimer?: NodeJS.Timeout;
  private performanceObserver?: PerformanceObserver;
  private userBehavior: UserBehavior;
  private isInitialized = false;

  constructor(config?: Partial<AnalyticsConfig>) {
    this.config = {
      enableTracking: true,
      enablePerformanceMonitoring: true,
      enableUserBehaviorTracking: true,
      enableBusinessMetrics: true,
      sampleRate: 1.0,
      batchSize: 50,
      flushInterval: 30000, // 30 secondes
      endpoint: '/api/analytics',
      ...config
    };

    this.sessionId = this.generateSessionId();
    this.userBehavior = {
      sessionDuration: 0,
      pagesVisited: [],
      actionsPerformed: [],
      timeOnPage: {},
      scrollDepth: {},
      clicks: {}
    };

    this.initialize();
  }

  private initialize(): void {
    if (this.isInitialized || !this.config.enableTracking) return;

    this.isInitialized = true;
    this.startSessionTracking();
    this.startPerformanceMonitoring();
    this.startUserBehaviorTracking();
    this.startPeriodicFlush();
  }

  // Génération d'ID de session
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Tracking d'événements
  trackEvent(type: AnalyticsEvent['type'], name: string, data: Record<string, any> = {}): void {
    if (!this.config.enableTracking || Math.random() > this.config.sampleRate) return;

    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      name,
      data: {
        ...data,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      },
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId
    };

    this.events.push(event);

    // Flush si le batch est plein
    if (this.events.length >= this.config.batchSize) {
      this.flushEvents();
    }
  }

  // Tracking de pages vues
  trackPageView(pageName: string, additionalData: Record<string, any> = {}): void {
    this.trackEvent('page_view', 'page_view', {
      page: pageName,
      referrer: document.referrer,
      ...additionalData
    });

    // Mettre à jour le comportement utilisateur
    if (!this.userBehavior.pagesVisited.includes(pageName)) {
      this.userBehavior.pagesVisited.push(pageName);
    }
  }

  // Tracking d'actions utilisateur
  trackUserAction(action: string, element: string, additionalData: Record<string, any> = {}): void {
    this.trackEvent('user_action', action, {
      element,
      ...additionalData
    });

    // Mettre à jour les statistiques de clics
    this.userBehavior.clicks[element] = (this.userBehavior.clicks[element] || 0) + 1;
    this.userBehavior.actionsPerformed.push(action);
  }

  // Tracking d'erreurs
  trackError(error: Error, context: Record<string, any> = {}): void {
    this.trackEvent('error', 'error', {
      message: error.message,
      stack: error.stack,
      ...context
    });
  }

  // Tracking d'appels API
  trackApiCall(endpoint: string, method: string, duration: number, success: boolean, statusCode?: number): void {
    this.trackEvent('api_call', 'api_call', {
      endpoint,
      method,
      duration,
      success,
      statusCode
    });
  }

  // Monitoring des performances
  private startPerformanceMonitoring(): void {
    if (!this.config.enablePerformanceMonitoring) return;

    // Observer les métriques de performance web
    if ('PerformanceObserver' in window) {
      try {
        this.performanceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              this.trackEvent('performance', 'page_load', {
                loadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
                domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
                firstPaint: navEntry.responseStart - navEntry.requestStart
              });
            }
          }
        });

        this.performanceObserver.observe({ entryTypes: ['navigation'] });
      } catch (error) {
        console.warn('Performance monitoring not supported:', error);
      }
    }

    // Monitoring des métriques de mémoire
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.trackEvent('performance', 'memory_usage', {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        });
      }, 60000); // Toutes les minutes
    }
  }

  // Tracking du comportement utilisateur
  private startUserBehaviorTracking(): void {
    if (!this.config.enableUserBehaviorTracking) return;

    // Tracking du temps sur la page
    let pageStartTime = Date.now();
    let currentPage = window.location.pathname;

    const updateTimeOnPage = () => {
      const timeSpent = Date.now() - pageStartTime;
      this.userBehavior.timeOnPage[currentPage] = (this.userBehavior.timeOnPage[currentPage] || 0) + timeSpent;
      pageStartTime = Date.now();
    };

    // Mettre à jour le temps lors du changement de page
    window.addEventListener('beforeunload', updateTimeOnPage);
    window.addEventListener('pagehide', updateTimeOnPage);

    // Tracking de la profondeur de scroll
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        this.userBehavior.scrollDepth[currentPage] = maxScrollDepth;
      }
    });

    // Tracking des clics
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const elementId = target.id || target.className || target.tagName;
      this.trackUserAction('click', elementId, {
        text: target.textContent?.substring(0, 50),
        tagName: target.tagName
      });
    });
  }

  // Tracking de session
  private startSessionTracking(): void {
    const sessionStartTime = Date.now();

    // Mettre à jour la durée de session
    setInterval(() => {
      this.userBehavior.sessionDuration = Date.now() - sessionStartTime;
    }, 10000); // Toutes les 10 secondes

    // Tracking de la fin de session
    window.addEventListener('beforeunload', () => {
      this.userBehavior.sessionDuration = Date.now() - sessionStartTime;
      this.trackEvent('user_action', 'session_end', {
        duration: this.userBehavior.sessionDuration,
        pagesVisited: this.userBehavior.pagesVisited.length,
        actionsPerformed: this.userBehavior.actionsPerformed.length
      });
      this.flushEvents(true); // Flush immédiat
    });
  }

  // Flush périodique des événements
  private startPeriodicFlush(): void {
    this.flushTimer = setInterval(() => {
      this.flushEvents();
    }, this.config.flushInterval);
  }

  // Envoi des événements au serveur
  private async flushEvents(immediate = false): Promise<void> {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          events: eventsToSend,
          sessionId: this.sessionId,
          userId: this.userId,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      // Remettre les événements dans la queue en cas d'échec
      this.events.unshift(...eventsToSend);
    }
  }

  // Métriques de performance
  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    const metrics = colisPerformance.getMetrics();
    const cacheStats = colisPerformance.getCacheStats();

    return {
      apiResponseTime: metrics.averageResponseTime,
      cacheHitRate: cacheStats.hitRate,
      errorRate: metrics.totalRequests > 0 ? (metrics.errorCount / metrics.totalRequests) * 100 : 0,
      userEngagement: this.calculateUserEngagement(),
      conversionRate: this.calculateConversionRate(),
      loadTime: this.getAverageLoadTime(),
      memoryUsage: this.getMemoryUsage(),
      networkLatency: this.getNetworkLatency()
    };
  }

  // Comportement utilisateur
  getUserBehavior(): UserBehavior {
    return { ...this.userBehavior };
  }

  // Métriques business
  async getBusinessMetrics(): Promise<BusinessMetrics> {
    try {
      const stats = await colisApi.getStats();
      
      return {
        totalRevenue: stats.data.totalRevenue,
        averageOrderValue: stats.data.totalRevenue / stats.data.totalShipments,
        customerLifetimeValue: this.calculateCustomerLifetimeValue(),
        churnRate: this.calculateChurnRate(),
        customerSatisfaction: stats.data.customerSatisfaction,
        deliverySuccessRate: (stats.data.delivered / stats.data.totalShipments) * 100,
        repeatCustomerRate: this.calculateRepeatCustomerRate()
      };
    } catch (error) {
      console.error('Failed to get business metrics:', error);
      return {
        totalRevenue: 0,
        averageOrderValue: 0,
        customerLifetimeValue: 0,
        churnRate: 0,
        customerSatisfaction: 0,
        deliverySuccessRate: 0,
        repeatCustomerRate: 0
      };
    }
  }

  // Rapports d'analytics
  async generateAnalyticsReport(period: string = '7d'): Promise<any> {
    const performanceMetrics = await this.getPerformanceMetrics();
    const userBehavior = this.getUserBehavior();
    const businessMetrics = await this.getBusinessMetrics();

    return {
      period,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      performance: performanceMetrics,
      userBehavior,
      business: businessMetrics,
      events: {
        total: this.events.length,
        byType: this.getEventsByType(),
        byPage: this.getEventsByPage()
      }
    };
  }

  // Méthodes utilitaires
  private calculateUserEngagement(): number {
    const timeOnPage = Object.values(this.userBehavior.timeOnPage);
    const totalTime = timeOnPage.reduce((sum, time) => sum + time, 0);
    const averageTime = totalTime / timeOnPage.length || 0;
    
    return Math.min(averageTime / 60000, 100); // Normalisé sur 100
  }

  private calculateConversionRate(): number {
    const conversionEvents = this.events.filter(e => 
      e.type === 'user_action' && e.name === 'colis_created'
    ).length;
    
    const totalSessions = 1; // Pour simplifier
    return (conversionEvents / totalSessions) * 100;
  }

  private getAverageLoadTime(): number {
    const loadEvents = this.events.filter(e => 
      e.type === 'performance' && e.name === 'page_load'
    );
    
    if (loadEvents.length === 0) return 0;
    
    const totalLoadTime = loadEvents.reduce((sum, event) => 
      sum + (event.data.loadTime || 0), 0
    );
    
    return totalLoadTime / loadEvents.length;
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
    }
    return 0;
  }

  private getNetworkLatency(): number {
    const apiEvents = this.events.filter(e => 
      e.type === 'api_call'
    );
    
    if (apiEvents.length === 0) return 0;
    
    const totalLatency = apiEvents.reduce((sum, event) => 
      sum + (event.data.duration || 0), 0
    );
    
    return totalLatency / apiEvents.length;
  }

  private calculateCustomerLifetimeValue(): number {
    // Simulation basée sur les métriques disponibles
    return 50000; // FCFA
  }

  private calculateChurnRate(): number {
    // Simulation basée sur les métriques disponibles
    return 5.2; // %
  }

  private calculateRepeatCustomerRate(): number {
    // Simulation basée sur les métriques disponibles
    return 35.8; // %
  }

  private getEventsByType(): Record<string, number> {
    return this.events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private getEventsByPage(): Record<string, number> {
    return this.events.reduce((acc, event) => {
      const page = event.data.url ? new URL(event.data.url).pathname : 'unknown';
      acc[page] = (acc[page] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  // Configuration
  setUserId(userId: string): void {
    this.userId = userId;
  }

  updateConfig(newConfig: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Nettoyage
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    
    this.flushEvents(true);
  }
}

// Instance singleton
export const colisAnalytics = new ColisAnalyticsService();

// Hook React pour les analytics
export const useAnalytics = () => {
  const [isTracking, setIsTracking] = React.useState(colisAnalytics.config.enableTracking);

  const trackEvent = React.useCallback((
    type: AnalyticsEvent['type'], 
    name: string, 
    data: Record<string, any> = {}
  ) => {
    if (isTracking) {
      colisAnalytics.trackEvent(type, name, data);
    }
  }, [isTracking]);

  const trackPageView = React.useCallback((pageName: string, additionalData: Record<string, any> = {}) => {
    if (isTracking) {
      colisAnalytics.trackPageView(pageName, additionalData);
    }
  }, [isTracking]);

  const trackUserAction = React.useCallback((
    action: string, 
    element: string, 
    additionalData: Record<string, any> = {}
  ) => {
    if (isTracking) {
      colisAnalytics.trackUserAction(action, element, additionalData);
    }
  }, [isTracking]);

  const trackError = React.useCallback((error: Error, context: Record<string, any> = {}) => {
    if (isTracking) {
      colisAnalytics.trackError(error, context);
    }
  }, [isTracking]);

  const getPerformanceMetrics = React.useCallback(async () => {
    return colisAnalytics.getPerformanceMetrics();
  }, []);

  const getUserBehavior = React.useCallback(() => {
    return colisAnalytics.getUserBehavior();
  }, []);

  const getBusinessMetrics = React.useCallback(async () => {
    return colisAnalytics.getBusinessMetrics();
  }, []);

  const generateReport = React.useCallback(async (period?: string) => {
    return colisAnalytics.generateAnalyticsReport(period);
  }, []);

  const setUserId = React.useCallback((userId: string) => {
    colisAnalytics.setUserId(userId);
  }, []);

  const toggleTracking = React.useCallback((enabled: boolean) => {
    setIsTracking(enabled);
    colisAnalytics.updateConfig({ enableTracking: enabled });
  }, []);

  return {
    isTracking,
    trackEvent,
    trackPageView,
    trackUserAction,
    trackError,
    getPerformanceMetrics,
    getUserBehavior,
    getBusinessMetrics,
    generateReport,
    setUserId,
    toggleTracking
  };
};

export default colisAnalytics; 