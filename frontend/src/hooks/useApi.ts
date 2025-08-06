import { useState, useEffect, useCallback } from 'react';
import apiService from '@/services/api';

export interface UseApiOptions {
  enabled?: boolean;
  refetchInterval?: number;
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}

export function useApi<T = any>(
  queryFn: () => Promise<T>,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);

  const { enabled = true, refetchInterval, onSuccess, onError } = options;

  const fetchData = useCallback(async (isRefetch = false) => {
    if (!enabled) return;

    try {
      if (isRefetch) {
        setIsRefetching(true);
      } else {
        setIsLoading(true);
      }
      
      setError(null);
      const result = await queryFn();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [queryFn, enabled, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!refetchInterval) return;

    const interval = setInterval(() => {
      fetchData(true);
    }, refetchInterval);

    return () => clearInterval(interval);
  }, [fetchData, refetchInterval]);

  const refetch = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return {
    data,
    error,
    isLoading,
    isRefetching,
    refetch,
  };
}

// Specific hooks for common operations
export function useRestaurants(filters?: unknown, options?: UseApiOptions) {
  return useApi(
    () => apiService.getRestaurants(filters),
    options
  );
}

export function useRestaurant(id: string, options?: UseApiOptions) {
  return useApi(
    () => apiService.getRestaurant(id),
    { ...options, enabled: !!id }
  );
}

export function useOrders(filters?: unknown, options?: UseApiOptions) {
  return useApi(
    () => apiService.getOrders(filters),
    options
  );
}

export function useOrder(id: string, options?: UseApiOptions) {
  return useApi(
    () => apiService.getOrder(id),
    { ...options, enabled: !!id }
  );
}

export function useTracking(trackingNumber: string, options?: UseApiOptions) {
  return useApi(
    () => apiService.getTrackingInfo(trackingNumber),
    { ...options, enabled: !!trackingNumber, refetchInterval: 5000 }
  );
}

export function useColis(filters?: unknown, options?: UseApiOptions) {
  return useApi(
    () => apiService.getColis(filters),
    options
  );
}

export function useColisByTracking(trackingNumber: string, options?: UseApiOptions) {
  return useApi(
    () => apiService.getColisByTracking(trackingNumber),
    { ...options, enabled: !!trackingNumber }
  );
}

export function useNotifications(filters?: unknown, options?: UseApiOptions) {
  return useApi(
    () => apiService.getNotifications(filters),
    options
  );
}

export function useCurrentUser(options?: UseApiOptions) {
  return useApi(
    () => apiService.getCurrentUser(),
    options
  );
}

export function useDrivers(filters?: unknown, options?: UseApiOptions) {
  return useApi(
    () => apiService.getDrivers(filters),
    options
  );
}

export function useDriver(id: string, options?: UseApiOptions) {
  return useApi(
    () => apiService.getDriver(id),
    { ...options, enabled: !!id }
  );
} 