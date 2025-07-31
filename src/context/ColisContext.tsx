import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Types
interface Colis {
  id: string;
  trackingNumber: string;
  type: 'national' | 'international';
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  sender: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  recipient: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  package: {
    type: string;
    weight: number;
    dimensions: string;
    description: string;
  };
  price: number;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery: string;
}

interface Notification {
  id: string;
  type: 'delivery' | 'update' | 'reminder' | 'alert' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
  colisId?: string;
}

interface ColisState {
  colis: Colis[];
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  stats: {
    totalColis: number;
    delivered: number;
    inTransit: number;
    pending: number;
    totalSpent: number;
    thisMonth: number;
    national: number;
    international: number;
  };
}

// Actions
type ColisAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_COLIS'; payload: Colis[] }
  | { type: 'ADD_COLIS'; payload: Colis }
  | { type: 'UPDATE_COLIS'; payload: { id: string; updates: Partial<Colis> } }
  | { type: 'REMOVE_COLIS'; payload: string }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
  | { type: 'UPDATE_STATS'; payload: Partial<ColisState['stats']> };

// Initial state
const initialState: ColisState = {
  colis: [],
  notifications: [],
  loading: false,
  error: null,
  stats: {
    totalColis: 0,
    delivered: 0,
    inTransit: 0,
    pending: 0,
    totalSpent: 0,
    thisMonth: 0,
    national: 0,
    international: 0
  }
};

// Reducer
const colisReducer = (state: ColisState, action: ColisAction): ColisState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_COLIS':
      return { ...state, colis: action.payload };
    
    case 'ADD_COLIS':
      return { ...state, colis: [...state.colis, action.payload] };
    
    case 'UPDATE_COLIS':
      return {
        ...state,
        colis: state.colis.map(colis =>
          colis.id === action.payload.id
            ? { ...colis, ...action.payload.updates }
            : colis
        )
      };
    
    case 'REMOVE_COLIS':
      return {
        ...state,
        colis: state.colis.filter(colis => colis.id !== action.payload)
      };
    
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        )
      };
    
    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          read: true
        }))
      };
    
    case 'UPDATE_STATS':
      return {
        ...state,
        stats: { ...state.stats, ...action.payload }
      };
    
    default:
      return state;
  }
};

// Context
interface ColisContextType {
  state: ColisState;
  dispatch: React.Dispatch<ColisAction>;
  // Actions
  fetchColis: () => Promise<void>;
  addColis: (colis: Omit<Colis, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateColis: (id: string, updates: Partial<Colis>) => Promise<void>;
  removeColis: (id: string) => Promise<void>;
  trackColis: (trackingNumber: string) => Promise<Colis | null>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'time'>) => void;
  updateStats: () => void;
}

const ColisContext = createContext<ColisContextType | undefined>(undefined);

// Provider
export const ColisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(colisReducer, initialState);

  // Fetch colis from API
  const fetchColis = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockColis: Colis[] = [
        // Données vides - sera remplacé par de vraies données utilisateur
      ];
      
      dispatch({ type: 'SET_COLIS', payload: mockColis });
      updateStats();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors du chargement des colis' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Add new colis
  const addColis = async (colisData: Omit<Colis, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newColis: Colis = {
      ...colisData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    dispatch({ type: 'ADD_COLIS', payload: newColis });
    
    // Add notification
    addNotification({
      type: 'update',
      title: 'Nouveau colis créé',
      message: `Le colis ${newColis.trackingNumber} a été créé avec succès`,
      read: false,
      colisId: newColis.id
    });
  };

  // Update colis
  const updateColis = async (id: string, updates: Partial<Colis>) => {
    dispatch({ type: 'UPDATE_COLIS', payload: { id, updates } });
  };

  // Remove colis
  const removeColis = async (id: string) => {
    dispatch({ type: 'REMOVE_COLIS', payload: id });
  };

  // Track colis
  const trackColis = async (trackingNumber: string): Promise<Colis | null> => {
    const colis = state.colis.find(c => c.trackingNumber === trackingNumber);
    return colis || null;
  };

  // Mark notification as read
  const markNotificationRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  // Mark all notifications as read
  const markAllNotificationsRead = () => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
  };

  // Add notification
  const addNotification = (notification: Omit<Notification, 'id' | 'time'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      time: 'À l\'instant'
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
  };

  // Update stats
  const updateStats = () => {
    const stats = {
      totalColis: state.colis.length,
      delivered: state.colis.filter(c => c.status === 'delivered').length,
      inTransit: state.colis.filter(c => c.status === 'in_transit').length,
      pending: state.colis.filter(c => c.status === 'pending').length,
      totalSpent: state.colis.reduce((sum, c) => sum + c.price, 0),
      thisMonth: state.colis.filter(c => {
        const createdAt = new Date(c.createdAt);
        const now = new Date();
        return createdAt.getMonth() === now.getMonth() && 
               createdAt.getFullYear() === now.getFullYear();
      }).length,
      national: state.colis.filter(c => c.type === 'national').length,
      international: state.colis.filter(c => c.type === 'international').length
    };
    
    dispatch({ type: 'UPDATE_STATS', payload: stats });
  };

  // Load initial data
  useEffect(() => {
    fetchColis();
  }, []);

  const value: ColisContextType = {
    state,
    dispatch,
    fetchColis,
    addColis,
    updateColis,
    removeColis,
    trackColis,
    markNotificationRead,
    markAllNotificationsRead,
    addNotification,
    updateStats
  };

  return (
    <ColisContext.Provider value={value}>
      {children}
    </ColisContext.Provider>
  );
};

// Hook
export const useColis = () => {
  const context = useContext(ColisContext);
  if (context === undefined) {
    throw new Error('useColis must be used within a ColisProvider');
  }
  return context;
}; 