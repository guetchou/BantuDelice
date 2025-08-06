import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Notification, NotificationType } from '@/context/NotificationContext';

interface NotificationToastProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

const getNotificationStyles = (type: NotificationType) => {
  const baseStyles = "flex items-start gap-3 p-4 rounded-lg shadow-lg border transition-all duration-300 transform";
  
  switch (type) {
    case 'success':
      return `${baseStyles} bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200`;
    case 'error':
      return `${baseStyles} bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200`;
    case 'warning':
      return `${baseStyles} bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200`;
    case 'info':
      return `${baseStyles} bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200`;
    default:
      return `${baseStyles} bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200`;
  }
};

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return '✅';
    case 'error':
      return '❌';
    case 'warning':
      return '⚠️';
    case 'info':
      return 'ℹ️';
    default:
      return '📢';
  }
};

export const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onRemove }) => {
  useEffect(() => {
    // Focus management for accessibility
    const toast = document.getElementById(`notification-${notification.id}`);
    if (toast) {
      toast.focus();
    }
  }, [notification.id]);

  return (
    <div
      id={`notification-${notification.id}`}
      className={getNotificationStyles(notification.type)}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      tabIndex={0}
    >
      <div className="flex-shrink-0">
        <span className="text-lg" aria-hidden="true">
          {getIcon(notification.type)}
        </span>
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm">
          {notification.title}
        </h4>
        {notification.message && (
          <p className="text-sm mt-1 opacity-90">
            {notification.message}
          </p>
        )}
        {notification.action && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 h-auto p-1 text-xs"
            onClick={notification.action.onClick}
          >
            {notification.action.label}
          </Button>
        )}
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        className="flex-shrink-0 h-auto p-1 opacity-60 hover:opacity-100"
        onClick={() => onRemove(notification.id)}
        aria-label="Fermer la notification"
      >
        <span aria-hidden="true">✕</span>
      </Button>
    </div>
  );
}; 