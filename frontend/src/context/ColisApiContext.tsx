import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { colisApi } from '@/services/colisApi';
import { environment } from '@/config/environment';

// Types simplifiés
interface ColisData {
  notifications: any[] | null;
  stats: any | null;
  expeditions: any[] | null;
  loading: boolean;
  error: string | null;
}

interface ColisContextType extends ColisData {
  refreshData: () => Promise<void>;
  clearError: () => void;
}

// État initial
const initialState: ColisData = {
  notifications: null,
  stats: null,
  expeditions: null,
  loading: false,
  error: null,
};

// Context
const ColisContext = createContext<ColisContextType | undefined>(undefined);

// Provider
export const ColisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ColisData>(initialState);

  // Fonction pour charger les données
  const loadData = async () => {
    if (state.loading) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Charger les données en parallèle
      const [notificationsRes, statsRes, expeditionsRes] = await Promise.allSettled([
        colisApi.getNotifications(),
        colisApi.getStats(),
        colisApi.getAllExpeditions(),
      ]);

      const newState: Partial<ColisData> = {};

      // Traiter les notifications
      if (notificationsRes.status === 'fulfilled' && notificationsRes.value.success) {
        newState.notifications = notificationsRes.value.data?.notifications || [];
      }

      // Traiter les stats
      if (statsRes.status === 'fulfilled' && statsRes.value.success) {
        newState.stats = statsRes.value.data;
      }

      // Traiter les expeditions
      if (expeditionsRes.status === 'fulfilled' && expeditionsRes.value.success) {
        newState.expeditions = expeditionsRes.value.data?.expeditions || [];
      }

      setState(prev => ({
        ...prev,
        ...newState,
        loading: false,
      }));

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Erreur lors du chargement des données',
      }));
    }
  };

  // Fonction pour rafraîchir les données
  const refreshData = async () => {
    await loadData();
  };

  // Fonction pour effacer les erreurs
  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  // Charger les données au montage
  useEffect(() => {
    // Délai initial pour éviter les requêtes multiples
    const timer = setTimeout(() => {
      loadData();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const contextValue: ColisContextType = {
    ...state,
    refreshData,
    clearError,
  };

  return (
    <ColisContext.Provider value={contextValue}>
      {children}
    </ColisContext.Provider>
  );
};

// Hook personnalisé
export const useColisApi = (): ColisContextType => {
  const context = useContext(ColisContext);
  if (context === undefined) {
    throw new Error('useColisApi doit être utilisé dans un ColisProvider');
  }
  return context;
}; 