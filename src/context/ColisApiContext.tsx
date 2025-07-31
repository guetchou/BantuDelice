import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { colisApi, type ColisApiData, type NotificationApiData, type StatsApiData } from '@/services/colisApi';

// Types pour l'état global
interface ColisApiState {
  // Cache des données
  colisCache: Map<string, { data: ColisApiData; timestamp: number }>;
  notificationsCache: NotificationApiData[];
  statsCache: StatsApiData | null;
  
  // État de l'API
  apiStatus: 'idle' | 'loading' | 'error' | 'success';
  lastSync: number | null;
  error: string | null;
  
  // Configuration
  autoRefresh: boolean;
  refreshInterval: number;
  
  // Métriques
  requestCount: number;
  cacheHits: number;
  cacheMisses: number;
}

// Actions pour le reducer
type ColisApiAction =
  | { type: 'SET_LOADING' }
  | { type: 'SET_SUCCESS' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CACHE_COLIS'; payload: { id: string; data: ColisApiData } }
  | { type: 'CACHE_NOTIFICATIONS'; payload: NotificationApiData[] }
  | { type: 'CACHE_STATS'; payload: StatsApiData }
  | { type: 'CLEAR_CACHE' }
  | { type: 'INCREMENT_REQUEST' }
  | { type: 'INCREMENT_CACHE_HIT' }
  | { type: 'INCREMENT_CACHE_MISS' }
  | { type: 'SET_AUTO_REFRESH'; payload: boolean }
  | { type: 'SET_REFRESH_INTERVAL'; payload: number }
  | { type: 'UPDATE_LAST_SYNC' };

// État initial
const initialState: ColisApiState = {
  colisCache: new Map(),
  notificationsCache: [],
  statsCache: null,
  apiStatus: 'idle',
  lastSync: null,
  error: null,
  autoRefresh: true,
  refreshInterval: 30000, // 30 secondes
  requestCount: 0,
  cacheHits: 0,
  cacheMisses: 0,
};

// Reducer pour gérer l'état
const colisApiReducer = (state: ColisApiState, action: ColisApiAction): ColisApiState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, apiStatus: 'loading', error: null };
    
    case 'SET_SUCCESS':
      return { ...state, apiStatus: 'success' };
    
    case 'SET_ERROR':
      return { ...state, apiStatus: 'error', error: action.payload };
    
    case 'CACHE_COLIS':
      const newColisCache = new Map(state.colisCache);
      newColisCache.set(action.payload.id, {
        data: action.payload.data,
        timestamp: Date.now(),
      });
      return { ...state, colisCache: newColisCache };
    
    case 'CACHE_NOTIFICATIONS':
      return { ...state, notificationsCache: action.payload };
    
    case 'CACHE_STATS':
      return { ...state, statsCache: action.payload };
    
    case 'CLEAR_CACHE':
      return { ...state, colisCache: new Map(), notificationsCache: [], statsCache: null };
    
    case 'INCREMENT_REQUEST':
      return { ...state, requestCount: state.requestCount + 1 };
    
    case 'INCREMENT_CACHE_HIT':
      return { ...state, cacheHits: state.cacheHits + 1 };
    
    case 'INCREMENT_CACHE_MISS':
      return { ...state, cacheMisses: state.cacheMisses + 1 };
    
    case 'SET_AUTO_REFRESH':
      return { ...state, autoRefresh: action.payload };
    
    case 'SET_REFRESH_INTERVAL':
      return { ...state, refreshInterval: action.payload };
    
    case 'UPDATE_LAST_SYNC':
      return { ...state, lastSync: Date.now() };
    
    default:
      return state;
  }
};

// Interface pour le contexte
interface ColisApiContextType {
  state: ColisApiState;
  dispatch: React.Dispatch<ColisApiAction>;
  
  // Méthodes de cache
  getCachedColis: (id: string) => ColisApiData | null;
  setCachedColis: (id: string, data: ColisApiData) => void;
  clearCache: () => void;
  invalidateCache: (pattern?: string) => void;
  
  // Méthodes de synchronisation
  syncColis: (id: string) => Promise<ColisApiData>;
  syncNotifications: () => Promise<NotificationApiData[]>;
  syncStats: () => Promise<StatsApiData>;
  
  // Méthodes utilitaires
  isStale: (timestamp: number, maxAge?: number) => boolean;
  getCacheStats: () => { hits: number; misses: number; hitRate: number };
}

// Création du contexte
const ColisApiContext = createContext<ColisApiContextType | undefined>(undefined);

// Provider du contexte
export const ColisApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(colisApiReducer, initialState);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Vérifier si les données sont périmées
  const isStale = useCallback((timestamp: number, maxAge: number = CACHE_DURATION) => {
    return Date.now() - timestamp > maxAge;
  }, []);

  // Obtenir un colis du cache
  const getCachedColis = useCallback((id: string): ColisApiData | null => {
    const cached = state.colisCache.get(id);
    if (cached && !isStale(cached.timestamp)) {
      dispatch({ type: 'INCREMENT_CACHE_HIT' });
      return cached.data;
    }
    dispatch({ type: 'INCREMENT_CACHE_MISS' });
    return null;
  }, [state.colisCache, isStale]);

  // Mettre en cache un colis
  const setCachedColis = useCallback((id: string, data: ColisApiData) => {
    dispatch({ type: 'CACHE_COLIS', payload: { id, data } });
  }, []);

  // Vider le cache
  const clearCache = useCallback(() => {
    dispatch({ type: 'CLEAR_CACHE' });
  }, []);

  // Invalider le cache
  const invalidateCache = useCallback((pattern?: string) => {
    if (pattern) {
      const newCache = new Map();
      for (const [key, value] of state.colisCache.entries()) {
        if (!key.includes(pattern)) {
          newCache.set(key, value);
        }
      }
      // Note: Cette approche nécessiterait une action plus complexe
      // Pour simplifier, on vide tout le cache
      dispatch({ type: 'CLEAR_CACHE' });
    } else {
      dispatch({ type: 'CLEAR_CACHE' });
    }
  }, [state.colisCache]);

  // Synchroniser un colis
  const syncColis = useCallback(async (id: string): Promise<ColisApiData> => {
    dispatch({ type: 'SET_LOADING' });
    dispatch({ type: 'INCREMENT_REQUEST' });
    
    try {
      const response = await colisApi.getColis(id);
      setCachedColis(id, response.data);
      dispatch({ type: 'SET_SUCCESS' });
      dispatch({ type: 'UPDATE_LAST_SYNC' });
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  }, [setCachedColis]);

  // Synchroniser les notifications
  const syncNotifications = useCallback(async (): Promise<NotificationApiData[]> => {
    dispatch({ type: 'SET_LOADING' });
    dispatch({ type: 'INCREMENT_REQUEST' });
    
    try {
      const response = await colisApi.getNotifications();
      dispatch({ type: 'CACHE_NOTIFICATIONS', payload: response.data.notifications });
      dispatch({ type: 'SET_SUCCESS' });
      dispatch({ type: 'UPDATE_LAST_SYNC' });
      return response.data.notifications;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  // Synchroniser les statistiques
  const syncStats = useCallback(async (): Promise<StatsApiData> => {
    dispatch({ type: 'SET_LOADING' });
    dispatch({ type: 'INCREMENT_REQUEST' });
    
    try {
      const response = await colisApi.getStats();
      dispatch({ type: 'CACHE_STATS', payload: response.data });
      dispatch({ type: 'SET_SUCCESS' });
      dispatch({ type: 'UPDATE_LAST_SYNC' });
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  // Obtenir les statistiques du cache
  const getCacheStats = useCallback(() => {
    const total = state.cacheHits + state.cacheMisses;
    const hitRate = total > 0 ? (state.cacheHits / total) * 100 : 0;
    return {
      hits: state.cacheHits,
      misses: state.cacheMisses,
      hitRate: Math.round(hitRate * 100) / 100,
    };
  }, [state.cacheHits, state.cacheMisses]);

  // Synchronisation automatique
  useEffect(() => {
    if (!state.autoRefresh) return;

    const interval = setInterval(() => {
      // Synchroniser les notifications et stats périodiquement
      syncNotifications().catch(console.error);
      syncStats().catch(console.error);
    }, state.refreshInterval);

    return () => clearInterval(interval);
  }, [state.autoRefresh, state.refreshInterval, syncNotifications, syncStats]);

  // Synchronisation initiale
  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([
          syncNotifications(),
          syncStats(),
        ]);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
      }
    };

    initializeData();
  }, [syncNotifications, syncStats]);

  const contextValue: ColisApiContextType = {
    state,
    dispatch,
    getCachedColis,
    setCachedColis,
    clearCache,
    invalidateCache,
    syncColis,
    syncNotifications,
    syncStats,
    isStale,
    getCacheStats,
  };

  return (
    <ColisApiContext.Provider value={contextValue}>
      {children}
    </ColisApiContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useColisApiContext = (): ColisApiContextType => {
  const context = useContext(ColisApiContext);
  if (context === undefined) {
    throw new Error('useColisApiContext must be used within a ColisApiProvider');
  }
  return context;
};

// Hook simplifié pour les colis
export const useColisWithCache = (id?: string) => {
  const { getCachedColis, syncColis, state } = useColisApiContext();
  const [localState, setLocalState] = React.useState<{
    data: ColisApiData | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  React.useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      // Vérifier le cache d'abord
      const cached = getCachedColis(id);
      if (cached) {
        setLocalState({ data: cached, loading: false, error: null });
        return;
      }

      // Si pas en cache, récupérer depuis l'API
      setLocalState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const data = await syncColis(id);
        setLocalState({ data, loading: false, error: null });
      } catch (error) {
        setLocalState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue',
        });
      }
    };

    fetchData();
  }, [id, getCachedColis, syncColis]);

  return {
    ...localState,
    apiStatus: state.apiStatus,
    lastSync: state.lastSync,
  };
};

// Hook simplifié pour les notifications
export const useNotificationsWithCache = () => {
  const { state, syncNotifications } = useColisApiContext();
  
  const refresh = React.useCallback(async () => {
    try {
      await syncNotifications();
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des notifications:', error);
    }
  }, [syncNotifications]);

  return {
    notifications: state.notificationsCache,
    loading: state.apiStatus === 'loading',
    error: state.error,
    refresh,
    lastSync: state.lastSync,
  };
};

// Hook simplifié pour les statistiques
export const useStatsWithCache = () => {
  const { state, syncStats } = useColisApiContext();
  
  const refresh = React.useCallback(async () => {
    try {
      await syncStats();
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des stats:', error);
    }
  }, [syncStats]);

  return {
    stats: state.statsCache,
    loading: state.apiStatus === 'loading',
    error: state.error,
    refresh,
    lastSync: state.lastSync,
  };
}; 