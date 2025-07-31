/**
 * Utilitaires pour la surveillance des performances
 * Spécialement conçus pour les images hero et les métriques Core Web Vitals
 */

export interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
}

export interface ImageMetrics {
  name: string;
  size: number; // en bytes
  loadTime: number; // en ms
  format: string;
  dimensions: {
    width: number;
    height: number;
  };
}

/**
 * Surveille le chargement des images hero
 */
export function monitorHeroImagePerformance(): Promise<ImageMetrics[]> {
  return new Promise((resolve) => {
    const metrics: ImageMetrics[] = [];
    const heroImages = [
      '/images/hero-bg.jpg',
      '/images/hero-bg.webp',
      '/images/hero-bg-mobile.jpg',
      '/images/hero-bg-mobile.webp'
    ];

    heroImages.forEach((src) => {
      const img = new Image();
      const startTime = performance.now();

      img.onload = () => {
        const loadTime = performance.now() - startTime;
        
        // Récupérer les dimensions réelles
        const dimensions = {
          width: img.naturalWidth,
          height: img.naturalHeight
        };

        // Estimer la taille (approximatif)
        const estimatedSize = dimensions.width * dimensions.height * 3; // 3 bytes par pixel (RGB)

        metrics.push({
          name: src.split('/').pop() || src,
          size: estimatedSize,
          loadTime,
          format: src.split('.').pop() || 'unknown',
          dimensions
        });

        // Si toutes les images sont chargées
        if (metrics.length === heroImages.length) {
          resolve(metrics);
        }
      };

      img.onerror = () => {
        console.warn(`Impossible de charger l'image: ${src}`);
        
        metrics.push({
          name: src.split('/').pop() || src,
          size: 0,
          loadTime: 0,
          format: 'error',
          dimensions: { width: 0, height: 0 }
        });

        if (metrics.length === heroImages.length) {
          resolve(metrics);
        }
      };

      img.src = src;
    });
  });
}

/**
 * Surveille les métriques Core Web Vitals
 */
export function monitorCoreWebVitals(): Promise<PerformanceMetrics> {
  return new Promise((resolve) => {
    const metrics: Partial<PerformanceMetrics> = {};

    // LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        metrics.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    // FID (First Input Delay)
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstEntry = entries[0];
        metrics.fid = firstEntry.processingStart - firstEntry.startTime;
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    }

    // CLS (Cumulative Layout Shift)
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        metrics.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }

    // FCP (First Contentful Paint)
    if ('PerformanceObserver' in window) {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstEntry = entries[0];
        metrics.fcp = firstEntry.startTime;
      });
      fcpObserver.observe({ entryTypes: ['first-contentful-paint'] });
    }

    // TTFB (Time to First Byte)
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
    }

    // Attendre un peu pour collecter les métriques
    setTimeout(() => {
      resolve(metrics as PerformanceMetrics);
    }, 3000);
  });
}

/**
 * Vérifie si les images sont optimisées
 */
export function checkImageOptimization(metrics: ImageMetrics[]): {
  isOptimized: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];

  metrics.forEach((metric) => {
    // Vérifier la taille
    const sizeInKB = metric.size / 1024;
    if (sizeInKB > 500) {
      issues.push(`${metric.name} est trop lourd (${Math.round(sizeInKB)}KB > 500KB)`);
      recommendations.push(`Compresser ${metric.name} avec WebP ou réduire la qualité`);
    }

    // Vérifier le temps de chargement
    if (metric.loadTime > 2000) {
      issues.push(`${metric.name} met trop de temps à charger (${Math.round(metric.loadTime)}ms)`);
      recommendations.push(`Optimiser ${metric.name} ou utiliser un CDN`);
    }

    // Vérifier les dimensions
    if (metric.dimensions.width > 1920 || metric.dimensions.height > 1080) {
      issues.push(`${metric.name} a des dimensions trop grandes`);
      recommendations.push(`Redimensionner ${metric.name} à 1920x1080 maximum`);
    }
  });

  return {
    isOptimized: issues.length === 0,
    issues,
    recommendations
  };
}

/**
 * Affiche un rapport de performance dans la console
 */
export async function generatePerformanceReport(): Promise<void> {
  console.group('🚀 Rapport de Performance - BantuDelice');
  
  try {
    // Métriques des images
    console.group('📸 Métriques des Images Hero');
    const imageMetrics = await monitorHeroImagePerformance();
    const optimization = checkImageOptimization(imageMetrics);
    
    imageMetrics.forEach((metric) => {
      console.log(`${metric.name}: ${Math.round(metric.size / 1024)}KB, ${Math.round(metric.loadTime)}ms`);
    });
    
    if (!optimization.isOptimized) {
      console.warn('⚠️ Problèmes détectés:', optimization.issues);
      console.info('💡 Recommandations:', optimization.recommendations);
    } else {
      console.log('✅ Images optimisées');
    }
    console.groupEnd();

    // Métriques Core Web Vitals
    console.group('⚡ Core Web Vitals');
    const webVitals = await monitorCoreWebVitals();
    
    console.log(`LCP: ${Math.round(webVitals.lcp)}ms ${webVitals.lcp < 2500 ? '✅' : '❌'}`);
    console.log(`FID: ${Math.round(webVitals.fid)}ms ${webVitals.fid < 100 ? '✅' : '❌'}`);
    console.log(`CLS: ${webVitals.cls.toFixed(3)} ${webVitals.cls < 0.1 ? '✅' : '❌'}`);
    console.log(`FCP: ${Math.round(webVitals.fcp)}ms ${webVitals.fcp < 1800 ? '✅' : '❌'}`);
    console.log(`TTFB: ${Math.round(webVitals.ttfb)}ms ${webVitals.ttfb < 600 ? '✅' : '❌'}`);
    
    console.groupEnd();
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération du rapport:', error);
  }
  
  console.groupEnd();
}

// Exporter pour utilisation dans les composants
export default {
  monitorHeroImagePerformance,
  monitorCoreWebVitals,
  checkImageOptimization,
  generatePerformanceReport
}; 