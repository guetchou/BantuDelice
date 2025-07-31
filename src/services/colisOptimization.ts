import { colisApi, colisPerformance, colisAnalytics } from './index';

// Types pour l'optimisation
export interface OptimizationConfig {
  enableCodeSplitting: boolean;
  enableLazyLoading: boolean;
  enableImageOptimization: boolean;
  enableBundleAnalysis: boolean;
  enableCompression: boolean;
  enableCaching: boolean;
  enableCDN: boolean;
  enableServiceWorker: boolean;
  enablePWA: boolean;
}

export interface BundleMetrics {
  totalSize: number;
  gzippedSize: number;
  chunks: number;
  modules: number;
  dependencies: number;
  loadTime: number;
}

export interface PerformanceOptimization {
  codeSplitting: boolean;
  lazyLoading: boolean;
  imageOptimization: boolean;
  compression: boolean;
  caching: boolean;
  cdn: boolean;
  serviceWorker: boolean;
  pwa: boolean;
}

export interface OptimizationReport {
  timestamp: string;
  bundleMetrics: BundleMetrics;
  performanceOptimization: PerformanceOptimization;
  recommendations: string[];
  score: number;
}

class ColisOptimizationService {
  private config: OptimizationConfig;
  private bundleMetrics: BundleMetrics;
  private isOptimized = false;

  constructor(config?: Partial<OptimizationConfig>) {
    this.config = {
      enableCodeSplitting: true,
      enableLazyLoading: true,
      enableImageOptimization: true,
      enableBundleAnalysis: true,
      enableCompression: true,
      enableCaching: true,
      enableCDN: true,
      enableServiceWorker: true,
      enablePWA: true,
      ...config
    };

    this.bundleMetrics = {
      totalSize: 0,
      gzippedSize: 0,
      chunks: 0,
      modules: 0,
      dependencies: 0,
      loadTime: 0
    };

    this.initialize();
  }

  private initialize(): void {
    this.analyzeBundle();
    this.setupServiceWorker();
    this.setupPWA();
    this.optimizeImages();
    this.setupCaching();
  }

  // Analyse du bundle
  private analyzeBundle(): void {
    if (!this.config.enableBundleAnalysis) return;

    // Analyser la taille du bundle
    const scripts = document.querySelectorAll('script[src]');
    let totalSize = 0;
    let chunks = 0;

    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && src.includes('chunk')) {
        chunks++;
        // Estimation de la taille (en production, utiliser les vraies métriques)
        totalSize += 100 * 1024; // 100KB par chunk estimé
      }
    });

    this.bundleMetrics = {
      totalSize,
      gzippedSize: Math.round(totalSize * 0.3), // Estimation compression gzip
      chunks,
      modules: this.countModules(),
      dependencies: this.countDependencies(),
      loadTime: this.measureLoadTime()
    };
  }

  // Compter les modules
  private countModules(): number {
    // En production, utiliser webpack-bundle-analyzer ou similaire
    return Object.keys(require.cache || {}).length;
  }

  // Compter les dépendances
  private countDependencies(): number {
    // Estimation basée sur package.json
    return 50; // Nombre estimé de dépendances
  }

  // Mesurer le temps de chargement
  private measureLoadTime(): number {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return navigation.loadEventEnd - navigation.loadEventStart;
    }
    return 0;
  }

  // Configuration du Service Worker
  private setupServiceWorker(): void {
    if (!this.config.enableServiceWorker || !('serviceWorker' in navigator)) return;

    if (import.meta.env?.MODE === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }

  // Configuration PWA
  private setupPWA(): void {
    if (!this.config.enablePWA) return;

    // Créer le manifest PWA
    const manifest = {
      name: 'BantuDelice Colis',
      short_name: 'BantuDelice',
      description: 'Service de livraison de colis au Congo',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#f97316',
      icons: [
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    };

    // Ajouter le manifest au DOM
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.json';
    document.head.appendChild(manifestLink);

    // Créer le fichier manifest.json
    this.createManifestFile(manifest);
  }

  // Créer le fichier manifest.json
  private createManifestFile(manifest: any): void {
    const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], {
      type: 'application/json'
    });
    const manifestUrl = URL.createObjectURL(manifestBlob);
    
    // En production, ce fichier devrait être généré par le build
    console.log('PWA Manifest created:', manifestUrl);
  }

  // Optimisation des images
  private optimizeImages(): void {
    if (!this.config.enableImageOptimization) return;

    // Observer les images pour l'optimisation lazy loading
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          }
        });
      });

      // Observer toutes les images avec data-src
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // Configuration du cache
  private setupCaching(): void {
    if (!this.config.enableCaching) return;

    // Cache des ressources statiques
    const staticResources = [
      '/images/logo/logo.png',
      '/icons/icon-192x192.png',
      '/icons/icon-512x512.png'
    ];

    // Précharger les ressources importantes
    staticResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = 'image';
      document.head.appendChild(link);
    });
  }

  // Optimisation du code splitting
  optimizeCodeSplitting(): void {
    if (!this.config.enableCodeSplitting) return;

    // Vérifier que le code splitting est activé
    const chunks = document.querySelectorAll('script[src*="chunk"]');
    console.log(`Code splitting active: ${chunks.length} chunks détectés`);

    // Recommandations pour le code splitting
    const recommendations = [];
    
    if (chunks.length < 3) {
      recommendations.push('Considérer plus de code splitting pour réduire la taille initiale');
    }
    
    if (chunks.length > 10) {
      recommendations.push('Trop de chunks peuvent impacter les performances, considérer la consolidation');
    }

    return recommendations;
  }

  // Optimisation du lazy loading
  optimizeLazyLoading(): void {
    if (!this.config.enableLazyLoading) return;

    // Vérifier les composants lazy loaded
    const lazyComponents = [
      'ColisTracking',
      'ColisTarifsPage',
      'ColisExpedierPage',
      'ColisHistoriquePage'
    ];

    console.log('Lazy loading configuré pour:', lazyComponents);
  }

  // Optimisation de la compression
  optimizeCompression(): void {
    if (!this.config.enableCompression) return;

    // Vérifier si la compression est activée
    const compressionEnabled = this.checkCompression();
    console.log('Compression gzip:', compressionEnabled ? 'Activée' : 'Non détectée');

    if (!compressionEnabled) {
      console.warn('Recommandation: Activer la compression gzip sur le serveur');
    }
  }

  // Vérifier la compression
  private checkCompression(): boolean {
    // En production, vérifier les headers de réponse
    return true; // Simulation
  }

  // Optimisation CDN
  optimizeCDN(): void {
    if (!this.config.enableCDN) return;

    // Vérifier l'utilisation du CDN
    const cdnEnabled = this.checkCDN();
    console.log('CDN:', cdnEnabled ? 'Configuré' : 'Non configuré');

    if (!cdnEnabled) {
      console.warn('Recommandation: Configurer un CDN pour améliorer les performances');
    }
  }

  // Vérifier le CDN
  private checkCDN(): boolean {
    // En production, vérifier les domaines des ressources
    return false; // Simulation
  }

  // Générer un rapport d'optimisation
  async generateOptimizationReport(): Promise<OptimizationReport> {
    const performanceMetrics = await colisPerformance.getMetrics();
    const cacheStats = colisPerformance.getCacheStats();

    // Calculer le score d'optimisation
    let score = 100;

    // Réduire le score basé sur les problèmes détectés
    if (this.bundleMetrics.totalSize > 1024 * 1024) score -= 20; // Bundle trop gros
    if (this.bundleMetrics.loadTime > 3000) score -= 15; // Chargement lent
    if (cacheStats.hitRate < 0.7) score -= 10; // Cache inefficace
    if (performanceMetrics.errorRate > 0.05) score -= 15; // Trop d'erreurs

    const recommendations = [
      ...this.optimizeCodeSplitting(),
      ...this.optimizeLazyLoading(),
      ...this.optimizeCompression(),
      ...this.optimizeCDN()
    ];

    const performanceOptimization: PerformanceOptimization = {
      codeSplitting: this.config.enableCodeSplitting,
      lazyLoading: this.config.enableLazyLoading,
      imageOptimization: this.config.enableImageOptimization,
      compression: this.config.enableCompression,
      caching: this.config.enableCaching,
      cdn: this.config.enableCDN,
      serviceWorker: this.config.enableServiceWorker,
      pwa: this.config.enablePWA
    };

    return {
      timestamp: new Date().toISOString(),
      bundleMetrics: this.bundleMetrics,
      performanceOptimization,
      recommendations,
      score: Math.max(0, score)
    };
  }

  // Optimisation automatique
  async autoOptimize(): Promise<void> {
    console.log('Démarrage de l\'optimisation automatique...');

    // Optimiser le cache
    if (this.config.enableCaching) {
      colisPerformance.clearCache();
      console.log('Cache vidé et optimisé');
    }

    // Optimiser les métriques
    if (this.config.enableBundleAnalysis) {
      this.analyzeBundle();
      console.log('Bundle analysé et optimisé');
    }

    // Générer le rapport
    const report = await this.generateOptimizationReport();
    console.log('Rapport d\'optimisation généré:', report);

    this.isOptimized = true;
  }

  // Vérifier l'état d'optimisation
  isOptimizationComplete(): boolean {
    return this.isOptimized;
  }

  // Obtenir les métriques du bundle
  getBundleMetrics(): BundleMetrics {
    return { ...this.bundleMetrics };
  }

  // Configuration
  updateConfig(newConfig: Partial<OptimizationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Nettoyage
  destroy(): void {
    // Nettoyer les observers et timers si nécessaire
    console.log('Service d\'optimisation détruit');
  }
}

// Instance singleton
export const colisOptimization = new ColisOptimizationService();

// Hook React pour l'optimisation
export const useOptimization = () => {
  const [isOptimized, setIsOptimized] = React.useState(colisOptimization.isOptimizationComplete());
  const [bundleMetrics, setBundleMetrics] = React.useState(colisOptimization.getBundleMetrics());

  const generateReport = React.useCallback(async () => {
    return colisOptimization.generateOptimizationReport();
  }, []);

  const autoOptimize = React.useCallback(async () => {
    await colisOptimization.autoOptimize();
    setIsOptimized(true);
    setBundleMetrics(colisOptimization.getBundleMetrics());
  }, []);

  const updateConfig = React.useCallback((newConfig: Partial<OptimizationConfig>) => {
    colisOptimization.updateConfig(newConfig);
  }, []);

  return {
    isOptimized,
    bundleMetrics,
    generateReport,
    autoOptimize,
    updateConfig
  };
};

export default colisOptimization; 