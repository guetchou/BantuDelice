import React from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { NotificationToast } from './NotificationToast';

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div
      className="fixed top-20 right-4 z-50 space-y-2 max-w-sm w-full"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="animate-fade-in"
          style={{
            animationDelay: '0ms',
            animationDuration: '300ms',
          }}
        >
          <NotificationToast
            notification={notification}
            onRemove={removeNotification}
          />
        </div>
      ))}
    </div>
  );
}; 