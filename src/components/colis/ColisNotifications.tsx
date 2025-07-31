import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  Package, 
  Truck, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Clock,
  X,
  Eye,
  Download
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'delivery' | 'update' | 'reminder' | 'alert' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ColisNotificationsProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
}

const ColisNotifications: React.FC<ColisNotificationsProps> = ({
  notifications = [
    {
      id: '1',
      type: 'delivery',
      title: 'Colis livré avec succès',
      message: 'Votre colis BD12345678 a été livré à Pointe-Noire',
      time: 'Il y a 2 heures',
      read: false,
      action: {
        label: 'Voir les détails',
        onClick: () => console.log('Voir détails colis')
      }
    },
    {
      id: '2',
      type: 'update',
      title: 'Mise à jour du statut',
      message: 'Le statut de votre colis BD87654321 a été mis à jour',
      time: 'Il y a 4 heures',
      read: false,
      action: {
        label: 'Suivre le colis',
        onClick: () => console.log('Suivre colis')
      }
    },
    {
      id: '3',
      type: 'reminder',
      title: 'Rappel de récupération',
      message: 'N\'oubliez pas de récupérer votre colis BD11223344',
      time: 'Il y a 1 jour',
      read: true
    },
    {
      id: '4',
      type: 'alert',
      title: 'Retard de livraison',
      message: 'Votre colis BD99887766 a été retardé',
      time: 'Il y a 2 jours',
      read: false
    },
    {
      id: '5',
      type: 'info',
      title: 'Nouveau service disponible',
      message: 'Livraison express maintenant disponible',
      time: 'Il y a 3 jours',
      read: true
    }
  ],
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const [expandedNotifications, setExpandedNotifications] = useState<string[]>([]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'delivery':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'update':
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'reminder':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-purple-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'delivery':
        return 'border-green-200 bg-green-50';
      case 'update':
        return 'border-blue-200 bg-blue-50';
      case 'reminder':
        return 'border-yellow-200 bg-yellow-50';
      case 'alert':
        return 'border-red-200 bg-red-50';
      case 'info':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getNotificationBadge = (type: Notification['type']) => {
    switch (type) {
      case 'delivery':
        return <Badge className="bg-green-100 text-green-800">Livraison</Badge>;
      case 'update':
        return <Badge className="bg-blue-100 text-blue-800">Mise à jour</Badge>;
      case 'reminder':
        return <Badge className="bg-yellow-100 text-yellow-800">Rappel</Badge>;
      case 'alert':
        return <Badge className="bg-red-100 text-red-800">Alerte</Badge>;
      case 'info':
        return <Badge className="bg-purple-100 text-purple-800">Info</Badge>;
      default:
        return null;
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(n => n !== id)
        : [...prev, id]
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="bg-white/40 backdrop-blur-md border border-white/30 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-orange-600" />
          <CardTitle className="text-xl font-bold text-gray-900">Notifications</CardTitle>
          {unreadCount > 0 && (
            <Badge className="bg-orange-100 text-orange-800">
              {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''}
            </Badge>
          )}
        </div>
        {unreadCount > 0 && onMarkAllAsRead && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onMarkAllAsRead}
            className="text-orange-700 hover:text-orange-900"
          >
            Tout marquer comme lu
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune notification pour le moment</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all ${
                  notification.read 
                    ? 'opacity-75' 
                    : 'border-orange-300 bg-orange-50'
                } ${getNotificationColor(notification.type)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">
                            {notification.title}
                          </h4>
                          {getNotificationBadge(notification.type)}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {notification.time}
                          </span>
                          
                          <div className="flex items-center gap-2">
                            {notification.action && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={notification.action.onClick}
                                className="text-orange-700 hover:text-orange-900"
                              >
                                {notification.action.label}
                              </Button>
                            )}
                            
                            {!notification.read && onMarkAsRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onMarkAsRead(notification.id)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ColisNotifications; 