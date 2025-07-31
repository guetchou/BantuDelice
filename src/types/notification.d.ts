
export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | string;
  action_type: string;
  read: boolean;
  link?: string;
  created_at: string;
  metadata?: any;
}

export interface NotificationPreference {
  id: string;
  user_id: string;
  type: string;  // order_updates, promotions, etc.
  email: boolean;
  push: boolean;
  sms: boolean;
  in_app: boolean;
  created_at: string;
  updated_at: string;
}
