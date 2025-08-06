import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Package, 
  Truck, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X, 
  Settings,
  Filter,
  Search
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  colisId?: string;
  priority: 'low' | 'medium' | 'high';
}

interface ColisNotificationCenterProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (id: string) => void;
  maxNotifications?: number;
}

const ColisNotificationCenter: React.FC<ColisNotificationCenterProps> = ({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  maxNotifications = 50
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Notifications par défaut si aucune n'est fournie
  const defaultNotifications: Notification[] = [
    {
      id: '1',
      type: 'success',
      title: 'Colis livré avec succès',
      message: 'Votre colis BD12345678 a été livré à Jean Dupont',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      priority: 'high',
      colisId: 'BD12345678',
      action: {
        label: 'Voir les détails',
        onClick: () => console.log('Voir détails BD12345678')
      }
    },
    {
      id: '2',
      type: 'warning',
      title: 'Retard de livraison',
      message: 'Le colis BD87654321 est en retard de 2 heures',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
      priority: 'high',
      colisId: 'BD87654321',
      action: {
        label: 'Suivre le colis',
        onClick: () => console.log('Suivre BD87654321')
      }
    },
    {
      id: '3',
      type: 'info',
      title: 'Nouveau service disponible',
      message: 'Livraison express maintenant disponible dans votre région',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
      priority: 'medium'
    },
    {
      id: '4',
      type: 'error',
      title: 'Problème de paiement',
      message: 'Le paiement pour le colis BD11223344 a échoué',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      read: false,
      priority: 'high',
      colisId: 'BD11223344',
      action: {
        label: 'Réessayer le paiement',
        onClick: () => console.log('Réessayer paiement BD11223344')
      }
    }
  ];

  const allNotifications = notifications.length > 0 ? notifications : defaultNotifications;

  const filteredNotifications = allNotifications
    .filter(notification => {
      if (filter === 'unread' && notification.read) return false;
      if (filter === 'high' && notification.priority !== 'high') return false;
      if (searchQuery && !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !notification.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .slice(0, maxNotifications);

  const unreadCount = allNotifications.filter(n => !n.read).length;
  const highPriorityCount = allNotifications.filter(n => n.priority === 'high' && !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return timestamp.toLocaleDateString('fr-FR');
  };

  return (
    <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="h-6 w-6 text-orange-500" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-800">
                Centre de notifications
              </CardTitle>
              <p className="text-sm text-gray-600">
                {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
                {highPriorityCount > 0 && ` • ${highPriorityCount} prioritaire${highPriorityCount > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="border-orange-300 text-orange-700"
            >
              <Settings className="h-4 w-4" />
            </Button>
            {onMarkAllAsRead && unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onMarkAllAsRead}
                className="border-green-300 text-green-700"
              >
                Tout marquer comme lu
              </Button>
            )}
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher dans les notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="all">Toutes</option>
              <option value="unread">Non lues</option>
              <option value="high">Prioritaires</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune notification trouvée</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-orange-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h4>
                          <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                            {notification.priority}
                          </Badge>
                          {notification.colisId && (
                            <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                              {notification.colisId}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {notification.action && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={notification.action.onClick}
                              className="text-xs border-orange-300 text-orange-700"
                            >
                              {notification.action.label}
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 ml-2">
                        {!notification.read && onMarkAsRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onMarkAsRead(notification.id)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-green-600"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(notification.id)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
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

export default ColisNotificationCenter; 