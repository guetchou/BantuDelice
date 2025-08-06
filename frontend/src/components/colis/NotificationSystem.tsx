import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Settings, 
  CheckCircle,
  AlertTriangle,
  Info,
  X,
  Zap
} from 'lucide-react';

interface NotificationChannel {
  id: string;
  name: string;
  icon: React.ComponentType<unknown>;
  enabled: boolean;
  description: string;
}

interface NotificationTrigger {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface NotificationSystemProps {
  userId: string;
  onSettingsChange?: (settings: unknown) => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({
  userId,
  onSettingsChange
}) => {
  const [channels, setChannels] = useState<NotificationChannel[]>([
    {
      id: 'in_app',
      name: 'Notifications in-app',
      icon: Bell,
      enabled: true,
      description: 'Notifications dans l\'application'
    },
    {
      id: 'sms',
      name: 'SMS',
      icon: MessageSquare,
      enabled: true,
      description: 'Notifications par SMS'
    },
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      enabled: false,
      description: 'Notifications par email'
    }
  ]);

  const [triggers, setTriggers] = useState<NotificationTrigger[]>([
    {
      id: 'status_change',
      name: 'Changement de statut',
      description: 'Quand le statut de votre colis change',
      enabled: true
    },
    {
      id: 'delivery_reminder',
      name: 'Rappel de livraison',
      description: '24h avant la livraison estimée',
      enabled: true
    },
    {
      id: 'delay_alert',
      name: 'Alerte de retard',
      description: 'Si votre colis est en retard',
      enabled: true
    },
    {
      id: 'delivery_success',
      name: 'Livraison réussie',
      description: 'Confirmation de livraison',
      enabled: true
    },
    {
      id: 'problem_alert',
      name: 'Alerte de problème',
      description: 'En cas de problème avec votre colis',
      enabled: true
    }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'status_change',
      title: 'Colis en transit',
      message: 'Votre colis BD123456 est maintenant en transit vers Brazzaville',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
      read: false,
      channel: 'in_app'
    },
    {
      id: '2',
      type: 'delivery_reminder',
      title: 'Livraison prévue demain',
      message: 'Votre colis BD789012 sera livré demain entre 9h et 17h',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      channel: 'sms'
    }
  ]);

  const toggleChannel = (channelId: string) => {
    setChannels(channels.map(channel => 
      channel.id === channelId 
        ? { ...channel, enabled: !channel.enabled }
        : channel
    ));
  };

  const toggleTrigger = (triggerId: string) => {
    setTriggers(triggers.map(trigger => 
      trigger.id === triggerId 
        ? { ...trigger, enabled: !trigger.enabled }
        : trigger
    ));
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    ));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'status_change': return <Info className="h-4 w-4 text-blue-500" />;
      case 'delivery_reminder': return <Bell className="h-4 w-4 text-orange-500" />;
      case 'delay_alert': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'delivery_success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'problem_alert': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-600">Gérez vos préférences de notifications</p>
        </div>
        <Badge className="bg-orange-100 text-orange-800">
          {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Canaux de notification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Canaux de notification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {channels.map((channel) => (
            <div key={channel.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <channel.icon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium">{channel.name}</h4>
                  <p className="text-sm text-gray-600">{channel.description}</p>
                </div>
              </div>
              <Switch
                checked={channel.enabled}
                onCheckedChange={() => toggleChannel(channel.id)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Déclencheurs de notification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Types de notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {triggers.map((trigger) => (
            <div key={trigger.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">{trigger.name}</h4>
                <p className="text-sm text-gray-600">{trigger.description}</p>
              </div>
              <Switch
                checked={trigger.enabled}
                onCheckedChange={() => toggleTrigger(trigger.id)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Historique des notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Historique des notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Aucune notification pour le moment</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 border rounded-lg ${
                    notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{notification.title}</h4>
                          {!notification.read && (
                            <Badge className="bg-blue-600 text-white text-xs">
                              Nouveau
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{notification.timestamp.toLocaleString('fr-FR')}</span>
                          <span>Via {notification.channel}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSystem; 