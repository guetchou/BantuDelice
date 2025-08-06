// Services API
export { colisApi } from './colisApi';
export type {
  ApiResponse,
  ColisApiData,
  CreateColisRequest,
  UpdateColisRequest,
  TrackingResponse,
  PricingRequest,
  PricingResponse,
  NotificationApiData,
  StatsApiData,
} from './colisApi';

// Hooks API
export {
  useColis,
  useColisList,
  useCreateColis,
  useTracking,
  usePricing,
  useNotifications,
  useStats,
  usePayment,
  useImageUpload,
  useColisCache,
} from '../hooks/useColisApi';

// Context API
export {
  ColisApiProvider,
  useColisApiContext,
  useColisWithCache,
  useNotificationsWithCache,
  useStatsWithCache,
} from '../context/ColisApiContext';

// Gestion d'erreurs API
export { default as ColisApiErrorBoundary } from '../components/colis/ColisApiErrorBoundary';
export {
  useApiErrorHandler,
  ColisApiError,
  ColisApiLoading,
  ColisApiEmpty,
} from '../components/colis/ColisApiErrorBoundary';

// Services de mock et simulation
export { default as colisApiMock } from './colisApiMock';

// Services WebSocket
export { default as colisWebSocket } from './colisWebSocket';
export {
  useWebSocket,
  useRealTimeTracking,
  useRealTimeNotifications,
  useRealTimeStats,
} from './colisWebSocket';

// Services de performance
export { default as colisPerformance } from './colisPerformance';
export {
  usePerformanceMetrics,
  useOptimizedColis,
  useOptimizedColisList,
} from './colisPerformance';

// Services de validation et sécurité
export { default as colisValidation } from './colisValidation';
export {
  useValidation,
  useSecurity,
} from './colisValidation';

// Services d'analytics et monitoring
export { default as colisAnalytics } from './colisAnalytics';
export {
  useAnalytics,
} from './colisAnalytics';

// Services d'optimisation
export { default as colisOptimization } from './colisOptimization';
export {
  useOptimization,
} from './colisOptimization';

// Services de déploiement
export { default as colisDeployment } from './colisDeployment';
export {
  useDeployment,
} from './colisDeployment'; 