import { useState, useEffect } from 'react';
import { apiService, Service } from '../services/api';

export const useServices = (category?: string) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await apiService.getServices(category);
      setServices(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des services');
      console.error('Erreur fetchServices:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchService = async (id: string) => {
    try {
      const service = await apiService.getService(id);
      return { success: true, service };
    } catch (err) {
      console.error('Erreur fetchService:', err);
      return { success: false, error: err };
    }
  };

  useEffect(() => {
    fetchServices();
  }, [category]);

  return {
    services,
    loading,
    error,
    fetchServices,
    fetchService,
  };
}; 