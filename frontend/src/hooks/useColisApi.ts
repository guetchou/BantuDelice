import { useState, useEffect, useCallback, useRef } from 'react';
import { colisApi, type ColisApiData, type CreateColisRequest, type UpdateColisRequest, type TrackingResponse, type PricingRequest, type PricingResponse, type NotificationApiData, type StatsApiData } from '@/services/colisApi';

// Types pour les états des hooks
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface ApiStateWithPagination<T> extends ApiState<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// Hook pour les colis
export const useColis = (id?: string) => {
  const [state, setState] = useState<ApiState<ColisApiData>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchColis = useCallback(async (colisId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await colisApi.getColis(colisId);
      setState({ data: response.data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error instanceof Error ? error.message : 'Erreur inconnue' });
    }
  }, []);

  const updateColis = useCallback(async (colisId: string, data: UpdateColisRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await colisApi.updateColis(colisId, data);
      setState({ data: response.data, loading: false, error: null });
      return response.data;
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Erreur inconnue' }));
      throw error;
    }
  }, []);

  const deleteColis = useCallback(async (colisId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await colisApi.deleteColis(colisId);
      setState({ data: null, loading: false, error: null });
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Erreur inconnue' }));
      throw error;
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchColis(id);
    }
  }, [id, fetchColis]);

  return {
    ...state,
    fetchColis,
    updateColis,
    deleteColis,
  };
};

// Hook pour la liste des colis
export const useColisList = (initialParams?: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  search?: string;
}) => {
  const [state, setState] = useState<ApiStateWithPagination<ColisApiData[]>>({
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      hasMore: false,
    },
  });

  const [params, setParams] = useState(initialParams || {});

  const fetchColisList = useCallback(async (searchParams = params) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await colisApi.listColis(searchParams);
      setState({
        data: response.data.colis,
        loading: false,
        error: null,
        pagination: {
          page: response.data.page,
          limit: response.data.limit,
          total: response.data.total,
          hasMore: response.data.page * response.data.limit < response.data.total,
        },
      });
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Erreur inconnue' }));
    }
  }, [params]);

  const loadMore = useCallback(() => {
    if (state.pagination.hasMore && !state.loading) {
      const nextPage = state.pagination.page + 1;
      fetchColisList({ ...params, page: nextPage });
    }
  }, [state.pagination.hasMore, state.loading, params, fetchColisList]);

  const refresh = useCallback(() => {
    fetchColisList({ ...params, page: 1 });
  }, [params, fetchColisList]);

  useEffect(() => {
    fetchColisList();
  }, [fetchColisList]);

  return {
    ...state,
    fetchColisList,
    loadMore,
    refresh,
    setParams,
  };
};

// Hook pour créer un colis
export const useCreateColis = () => {
  const [state, setState] = useState<ApiState<ColisApiData>>({
    data: null,
    loading: false,
    error: null,
  });

  const createColis = useCallback(async (data: CreateColisRequest) => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await colisApi.createColis(data);
      setState({ data: response.data, loading: false, error: null });
      return response.data;
    } catch (error) {
      setState({ data: null, loading: false, error: error instanceof Error ? error.message : 'Erreur inconnue' });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    createColis,
    reset,
  };
};

// Hook pour le suivi
export const useTracking = (trackingNumber?: string) => {
  const [state, setState] = useState<ApiState<TrackingResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchTracking = useCallback(async (number: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await colisApi.trackColis(number);
      setState({ data: response.data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error instanceof Error ? error.message : 'Erreur inconnue' });
    }
  }, []);

  const updateTracking = useCallback(async (colisId: string, event: unknown) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await colisApi.updateTracking(colisId, event);
      // Mettre à jour les événements dans l'état
      if (state.data) {
        setState(prev => ({
          ...prev,
          data: prev.data ? {
            ...prev.data,
            tracking: {
              ...prev.data.tracking,
              events: [...prev.data.tracking.events, response.data],
            },
          } : null,
          loading: false,
          error: null,
        }));
      }
      return response.data;
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Erreur inconnue' }));
      throw error;
    }
  }, [state.data]);

  useEffect(() => {
    if (trackingNumber) {
      fetchTracking(trackingNumber);
    }
  }, [trackingNumber, fetchTracking]);

  return {
    ...state,
    fetchTracking,
    updateTracking,
  };
};

// Hook pour les tarifs
export const usePricing = () => {
  const [state, setState] = useState<ApiState<PricingResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const calculatePricing = useCallback(async (data: PricingRequest) => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await colisApi.calculatePricing(data);
      setState({ data: response.data, loading: false, error: null });
      return response.data;
    } catch (error) {
      setState({ data: null, loading: false, error: error instanceof Error ? error.message : 'Erreur inconnue' });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    calculatePricing,
    reset,
  };
};

// Hook pour les notifications
export const useNotifications = (initialParams?: {
  page?: number;
  limit?: number;
  read?: boolean;
  type?: string;
}) => {
  const [state, setState] = useState<ApiStateWithPagination<NotificationApiData[]>>({
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      hasMore: false,
    },
  });

  const [params, setParams] = useState(initialParams || {});

  const fetchNotifications = useCallback(async (searchParams = params) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await colisApi.getNotifications(searchParams);
      setState({
        data: response.data.notifications,
        loading: false,
        error: null,
        pagination: {
          page: searchParams.page || 1,
          limit: searchParams.limit || 20,
          total: response.data.total,
          hasMore: (searchParams.page || 1) * (searchParams.limit || 20) < response.data.total,
        },
      });
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Erreur inconnue' }));
    }
  }, [params]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await colisApi.markNotificationAsRead(id);
      // Mettre à jour l'état local
      setState(prev => ({
        ...prev,
        data: prev.data?.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        ) || [],
      }));
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await colisApi.markAllNotificationsAsRead();
      // Mettre à jour l'état local
      setState(prev => ({
        ...prev,
        data: prev.data?.map(notification => ({ ...notification, read: true })) || [],
      }));
    } catch (error) {
      console.error('Erreur lors du marquage de tous comme lus:', error);
    }
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      await colisApi.deleteNotification(id);
      // Mettre à jour l'état local
      setState(prev => ({
        ...prev,
        data: prev.data?.filter(notification => notification.id !== id) || [],
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    ...state,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    setParams,
  };
};

// Hook pour les statistiques
export const useStats = (period?: string) => {
  const [state, setState] = useState<ApiState<StatsApiData>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchStats = useCallback(async (statsPeriod = period) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await colisApi.getStats(statsPeriod);
      setState({ data: response.data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error instanceof Error ? error.message : 'Erreur inconnue' });
    }
  }, [period]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    ...state,
    fetchStats,
  };
};

// Hook pour les paiements
export const usePayment = () => {
  const [state, setState] = useState<ApiState<{ paymentId: string; status: string; redirectUrl?: string }>>({
    data: null,
    loading: false,
    error: null,
  });

  const initiatePayment = useCallback(async (colisId: string, paymentData: {
    method: 'momo' | 'airtel' | 'card' | 'cash';
    amount: number;
    phoneNumber?: string;
  }) => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await colisApi.initiatePayment(colisId, paymentData);
      setState({ data: response.data, loading: false, error: null });
      return response.data;
    } catch (error) {
      setState({ data: null, loading: false, error: error instanceof Error ? error.message : 'Erreur inconnue' });
      throw error;
    }
  }, []);

  const checkPaymentStatus = useCallback(async (paymentId: string) => {
    try {
      const response = await colisApi.checkPaymentStatus(paymentId);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la vérification du paiement:', error);
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    initiatePayment,
    checkPaymentStatus,
    reset,
  };
};

// Hook pour les uploads d'images
export const useImageUpload = () => {
  const [state, setState] = useState<ApiState<{ imageUrl: string }>>({
    data: null,
    loading: false,
    error: null,
  });

  const uploadImage = useCallback(async (colisId: string, file: File) => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await colisApi.uploadImage(colisId, file);
      setState({ data: response.data, loading: false, error: null });
      return response.data;
    } catch (error) {
      setState({ data: null, loading: false, error: error instanceof Error ? error.message : 'Erreur inconnue' });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    uploadImage,
    reset,
  };
};

// Hook pour le cache et la synchronisation
export const useColisCache = () => {
  const cacheRef = useRef<Map<string, { data: unknown; timestamp: number }>>(new Map());
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const getCachedData = useCallback((key: string) => {
    const cached = cacheRef.current.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }, []);

  const setCachedData = useCallback((key: string, data: unknown) => {
    cacheRef.current.set(key, { data, timestamp: Date.now() });
  }, []);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  const invalidateCache = useCallback((pattern?: string) => {
    if (pattern) {
      for (const key of cacheRef.current.keys()) {
        if (key.includes(pattern)) {
          cacheRef.current.delete(key);
        }
      }
    } else {
      cacheRef.current.clear();
    }
  }, []);

  return {
    getCachedData,
    setCachedData,
    clearCache,
    invalidateCache,
  };
}; 