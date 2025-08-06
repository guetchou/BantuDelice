import { colisConfig } from '@/config/colisConfig';

// Types pour les événements WebSocket
export interface WebSocketMessage {
  type: 'tracking_update' | 'notification' | 'stats_update' | 'payment_update' | 'error';
  data: unknown;
  timestamp: string;
  id?: string;
}

export interface TrackingUpdate {
  colisId: string;
  status: string;
  location: string;
  description: string;
  timestamp: string;
}

export interface NotificationUpdate {
  id: string;
  type: 'delivery' | 'update' | 'reminder' | 'alert' | 'info';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  colisId?: string;
}

export interface StatsUpdate {
  totalShipments: number;
  delivered: number;
  inTransit: number;
  pending: number;
  totalRevenue: number;
}

export interface PaymentUpdate {
  paymentId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  amount: number;
  method: string;
}

// Types pour les callbacks
export type MessageHandler = (message: WebSocketMessage) => void;
export type ConnectionHandler = (connected: boolean) => void;
export type ErrorHandler = (error: Event) => void;

// Configuration WebSocket
interface WebSocketConfig {
  url: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
  debug: boolean;
}

class ColisWebSocketService {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private connectionHandlers: Set<ConnectionHandler> = new Set();
  private errorHandlers: Set<ErrorHandler> = new Set();
  private isConnecting = false;
  private isManualClose = false;

  constructor(config?: Partial<WebSocketConfig>) {
    this.config = {
      url: colisConfig.api.baseUrl.replace('http', 'ws') + '/ws',
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      debug: import.meta.env?.MODE === 'development',
      ...config
    };
  }

  // Connexion
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        reject(new Error('Connexion déjà en cours'));
        return;
      }

      this.isConnecting = true;
      this.isManualClose = false;

      try {
        this.ws = new WebSocket(this.config.url);

        this.ws.onopen = () => {
          this.log('WebSocket connecté');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.notifyConnectionHandlers(true);
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            this.log('Erreur parsing message:', error);
          }
        };

        this.ws.onclose = (event) => {
          this.log('WebSocket fermé:', event.code, event.reason);
          this.isConnecting = false;
          this.stopHeartbeat();
          this.notifyConnectionHandlers(false);

          if (!this.isManualClose && this.reconnectAttempts < this.config.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          this.log('Erreur WebSocket:', error);
          this.notifyErrorHandlers(error);
          reject(error);
        };

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  // Déconnexion
  disconnect(): void {
    this.isManualClose = true;
    this.stopHeartbeat();
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close(1000, 'Déconnexion manuelle');
      this.ws = null;
    }
  }

  // Envoi de messages
  send(message: WebSocketMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
      this.log('Message envoyé:', message);
    } else {
      this.log('WebSocket non connecté, message ignoré:', message);
    }
  }

  // S'abonner aux mises à jour de suivi
  subscribeToTracking(colisId: string): void {
    this.send({
      type: 'tracking_update',
      data: { action: 'subscribe', colisId },
      timestamp: new Date().toISOString()
    });
  }

  // Se désabonner des mises à jour de suivi
  unsubscribeFromTracking(colisId: string): void {
    this.send({
      type: 'tracking_update',
      data: { action: 'unsubscribe', colisId },
      timestamp: new Date().toISOString()
    });
  }

  // S'abonner aux notifications
  subscribeToNotifications(): void {
    this.send({
      type: 'notification',
      data: { action: 'subscribe' },
      timestamp: new Date().toISOString()
    });
  }

  // S'abonner aux mises à jour de statistiques
  subscribeToStats(): void {
    this.send({
      type: 'stats_update',
      data: { action: 'subscribe' },
      timestamp: new Date().toISOString()
    });
  }

  // S'abonner aux mises à jour de paiement
  subscribeToPayment(paymentId: string): void {
    this.send({
      type: 'payment_update',
      data: { action: 'subscribe', paymentId },
      timestamp: new Date().toISOString()
    });
  }

  // Gestionnaires d'événements
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  onConnection(handler: ConnectionHandler): () => void {
    this.connectionHandlers.add(handler);
    return () => this.connectionHandlers.delete(handler);
  }

  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.add(handler);
    return () => this.errorHandlers.delete(handler);
  }

  // Gestionnaires spécifiques
  onTrackingUpdate(handler: (update: TrackingUpdate) => void): () => void {
    return this.onMessage((message) => {
      if (message.type === 'tracking_update') {
        handler(message.data);
      }
    });
  }

  onNotification(handler: (notification: NotificationUpdate) => void): () => void {
    return this.onMessage((message) => {
      if (message.type === 'notification') {
        handler(message.data);
      }
    });
  }

  onStatsUpdate(handler: (stats: StatsUpdate) => void): () => void {
    return this.onMessage((message) => {
      if (message.type === 'stats_update') {
        handler(message.data);
      }
    });
  }

  onPaymentUpdate(handler: (payment: PaymentUpdate) => void): () => void {
    return this.onMessage((message) => {
      if (message.type === 'payment_update') {
        handler(message.data);
      }
    });
  }

  // Méthodes privées
  private handleMessage(message: WebSocketMessage): void {
    this.log('Message reçu:', message);
    this.messageHandlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        this.log('Erreur dans le gestionnaire de message:', error);
      }
    });
  }

  private notifyConnectionHandlers(connected: boolean): void {
    this.connectionHandlers.forEach(handler => {
      try {
        handler(connected);
      } catch (error) {
        this.log('Erreur dans le gestionnaire de connexion:', error);
      }
    });
  }

  private notifyErrorHandlers(error: Event): void {
    this.errorHandlers.forEach(handler => {
      try {
        handler(error);
      } catch (err) {
        this.log('Erreur dans le gestionnaire d\'erreur:', err);
      }
    });
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.config.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);
    
    this.log(`Tentative de reconnexion ${this.reconnectAttempts}/${this.config.maxReconnectAttempts} dans ${delay}ms`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect().catch(error => {
        this.log('Échec de reconnexion:', error);
      });
    }, delay);
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({
          type: 'heartbeat',
          data: { timestamp: Date.now() },
          timestamp: new Date().toISOString()
        });
      }
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private log(...args: unknown[]): void {
    if (this.config.debug) {
      console.log('[WebSocket]', ...args);
    }
  }

  // Getters
  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  get readyState(): number {
    return this.ws?.readyState || WebSocket.CLOSED;
  }

  get reconnectAttemptsCount(): number {
    return this.reconnectAttempts;
  }
}

// Instance singleton
export const colisWebSocket = new ColisWebSocketService();

// Hook React pour utiliser WebSocket
export const useWebSocket = () => {
  const [isConnected, setIsConnected] = React.useState(false);
  const [lastMessage, setLastMessage] = React.useState<WebSocketMessage | null>(null);
  const [error, setError] = React.useState<Event | null>(null);

  React.useEffect(() => {
    const unsubscribeConnection = colisWebSocket.onConnection(setIsConnected);
    const unsubscribeMessage = colisWebSocket.onMessage(setLastMessage);
    const unsubscribeError = colisWebSocket.onError(setError);

    return () => {
      unsubscribeConnection();
      unsubscribeMessage();
      unsubscribeError();
    };
  }, []);

  const connect = React.useCallback(async () => {
    try {
      await colisWebSocket.connect();
    } catch (err) {
      setError(err as Event);
    }
  }, []);

  const disconnect = React.useCallback(() => {
    colisWebSocket.disconnect();
  }, []);

  const send = React.useCallback((message: WebSocketMessage) => {
    colisWebSocket.send(message);
  }, []);

  return {
    isConnected,
    lastMessage,
    error,
    connect,
    disconnect,
    send,
    subscribeToTracking: colisWebSocket.subscribeToTracking.bind(colisWebSocket),
    unsubscribeFromTracking: colisWebSocket.unsubscribeFromTracking.bind(colisWebSocket),
    subscribeToNotifications: colisWebSocket.subscribeToNotifications.bind(colisWebSocket),
    subscribeToStats: colisWebSocket.subscribeToStats.bind(colisWebSocket),
    subscribeToPayment: colisWebSocket.subscribeToPayment.bind(colisWebSocket),
    onTrackingUpdate: colisWebSocket.onTrackingUpdate.bind(colisWebSocket),
    onNotification: colisWebSocket.onNotification.bind(colisWebSocket),
    onStatsUpdate: colisWebSocket.onStatsUpdate.bind(colisWebSocket),
    onPaymentUpdate: colisWebSocket.onPaymentUpdate.bind(colisWebSocket),
  };
};

// Hook spécialisé pour le suivi en temps réel
export const useRealTimeTracking = (colisId?: string) => {
  const [trackingUpdates, setTrackingUpdates] = React.useState<TrackingUpdate[]>([]);
  const { isConnected, connect, disconnect } = useWebSocket();

  React.useEffect(() => {
    if (colisId && isConnected) {
      colisWebSocket.subscribeToTracking(colisId);
      
      const unsubscribe = colisWebSocket.onTrackingUpdate((update) => {
        if (update.colisId === colisId) {
          setTrackingUpdates(prev => [...prev, update]);
        }
      });

      return () => {
        unsubscribe();
        colisWebSocket.unsubscribeFromTracking(colisId);
      };
    }
  }, [colisId, isConnected]);

  React.useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    trackingUpdates,
    isConnected,
    clearUpdates: () => setTrackingUpdates([])
  };
};

// Hook spécialisé pour les notifications en temps réel
export const useRealTimeNotifications = () => {
  const [notifications, setNotifications] = React.useState<NotificationUpdate[]>([]);
  const { isConnected, connect, disconnect } = useWebSocket();

  React.useEffect(() => {
    if (isConnected) {
      colisWebSocket.subscribeToNotifications();
      
      const unsubscribe = colisWebSocket.onNotification((notification) => {
        setNotifications(prev => [notification, ...prev]);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [isConnected]);

  React.useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    notifications,
    isConnected,
    clearNotifications: () => setNotifications([])
  };
};

// Hook spécialisé pour les statistiques en temps réel
export const useRealTimeStats = () => {
  const [stats, setStats] = React.useState<StatsUpdate | null>(null);
  const { isConnected, connect, disconnect } = useWebSocket();

  React.useEffect(() => {
    if (isConnected) {
      colisWebSocket.subscribeToStats();
      
      const unsubscribe = colisWebSocket.onStatsUpdate((statsUpdate) => {
        setStats(statsUpdate);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [isConnected]);

  React.useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    stats,
    isConnected
  };
};

export default colisWebSocket; 