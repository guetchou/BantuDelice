
import React, { useState } from 'react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Notification } from '@/hooks/useRealTimeNotifications';
import { Bell, Check, Info, AlertTriangle, AlertCircle, Link } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NotificationCenterProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => Promise<{ success: boolean }>;
  onMarkAllAsRead: () => Promise<{ success: boolean }>;
  onDeleteNotification: (id: string) => Promise<{ success: boolean }>;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification
}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await onMarkAsRead(notification.id);
    }
    
    if (notification.action_link) {
      navigate(notification.action_link);
      setOpen(false);
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-medium text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs"
              onClick={onMarkAllAsRead}
            >
              Tout marquer comme lu
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="unread">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="unread" className="relative">
              Non lues
              {unreadCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className="ml-1 h-5 flex items-center justify-center"
                >
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all">Toutes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="unread">
            <ScrollArea className="h-[300px]">
              {unreadNotifications.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <p>Pas de notifications non lues</p>
                </div>
              ) : (
                <div className="divide-y">
                  {unreadNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className="p-3 hover:bg-muted cursor-pointer flex gap-3"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.created_at), { 
                              addSuffix: true,
                              locale: fr
                            })}
                          </p>
                          
                          {notification.action_link && (
                            <Link className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="all">
            <ScrollArea className="h-[300px]">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <p>Pas de notifications</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-3 hover:bg-muted cursor-pointer flex gap-3 ${notification.read ? 'opacity-70' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.created_at), { 
                              addSuffix: true,
                              locale: fr
                            })}
                          </p>
                          
                          {notification.action_link && (
                            <Link className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
