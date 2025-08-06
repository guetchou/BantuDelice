// Composants de navigation et layout
export { default as ColisNavigation } from './ColisNavigation';
export { default as ColisBreadcrumbs } from './ColisBreadcrumbs';

// Composants de statistiques et analytics
export { default as ColisStats } from './ColisStats';
export { default as ColisRealTimeStats } from './ColisRealTimeStats';
export { default as ColisAnalytics } from './ColisAnalytics';
export { default as ColisLiveDashboard } from './ColisLiveDashboard';

// Composants de suivi et cartes
export { default as ColisTrackingCard } from './ColisTrackingCard';
export { default as ColisSearch } from './ColisSearch';
export { default as ColisMap } from './ColisMap';

// Composants de notifications
export { default as ColisNotifications } from './ColisNotifications';
export { default as ColisNotificationCenter } from './ColisNotificationCenter';

// Composants de formulaire et processus
export { default as ColisShippingForm } from './ColisShippingForm';
export { default as ColisImageUpload } from './ColisImageUpload';
export { default as PaymentGateway } from './PaymentGateway';
export { default as Stepper } from './Stepper';

// Composants de tarification
export { default as ColisPricingCard } from './ColisPricingCard';

// Documentation
export { default as ColisComponentDocs } from './ColisComponentDocs';

// Types communs
export interface ColisData {
  id: string;
  status: string;
  sender: string;
  recipient: string;
  from: string;
  to: string;
  date: string;
  price: number;
  weight: string;
  type: 'national' | 'international';
}

export interface TrackingEvent {
  id: string;
  status: string;
  location: string;
  timestamp: string;
  description: string;
  icon: 'package' | 'truck' | 'check' | 'alert';
}

export interface NotificationData {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  colisId?: string;
}

export interface AnalyticsData {
  period: string;
  totalShipments: number;
  totalRevenue: number;
  averageDeliveryTime: number;
  customerSatisfaction: number;
  activeUsers: number;
  growthRate: number;
  topCities: Array<{ city: string; shipments: number; revenue: number }>;
  shipmentTypes: Array<{ type: string; count: number; percentage: number }>;
  revenueByMonth: Array<{ month: string; revenue: number }>;
} 