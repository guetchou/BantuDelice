
import React, { useState } from 'react';
import { Bell, BellOff, Check, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useRealTimeNotifications, Notification } from '@/hooks/useRealTimeNotifications';
import { useUser } from '@/hooks/useUser';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationItem = ({ 
  notification, 
  onRead, 
  onDelete 
}: { 
  notification: Notification, 
  onRead: () => void, 
  onDelete: () => void 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "mb-2 border transition-colors",
        notification.read ? "bg-muted/30" : "bg-card shadow-sm",
        notification.type === 'success' && !notification.read && "border-l-4 border-l-green-500",
        notification.type === 'warning' && !notification.read && "border-l-4 border-l-yellow-500",
        notification.type === 'error' && !notification.read && "border-l-4 border-l-red-500",
        notification.type === 'info' && !notification.read && "border-l-4 border-l-blue-500"
      )}>
        <CardHeader className="p-3 pb-1">
          <div className="flex justify-between items-start">
            <CardTitle className={cn(
              "text-sm font-medium",
              notification.read && "text-muted-foreground"
            )}>
              {notification.type === 'success' && '✓ '}
              {notification.type === 'warning' && '⚠️ '}
              {notification.type === 'error' && '✗ '}
              {notification.type === 'info' && 'ℹ '}
              {notification.message.split(' ').slice(0, 4).join(' ')}
              {notification.message.split(' ').length > 4 ? '...' : ''}
            </CardTitle>
            <div className="flex gap-1">
              {!notification.read && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={onRead}
                  title="Marquer comme lu"
                >
                  <Check className="h-3 w-3" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-muted-foreground hover:text-destructive" 
                onClick={onDelete}
                title="Supprimer"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <CardDescription className="text-xs">
            {new Date(notification.created_at).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-1">
          <p className={cn(
            "text-sm",
            notification.read && "text-muted-foreground"
          )}>
            {notification.message}
          </p>
        </CardContent>
        {notification.action_link && (
          <CardFooter className="p-2 pt-0">
            <Button 
              variant="link" 
              size="sm" 
              className="px-0 h-auto" 
              asChild
            >
              <a href={notification.action_link}>Voir plus</a>
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export const NotificationCenter = () => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useRealTimeNotifications(user?.id);

  if (!user) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1.5 h-5 min-w-5 flex items-center justify-center" 
              variant="destructive"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold">Notifications</h2>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs"
                onClick={() => markAllAsRead()}
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Tout marquer comme lu
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <ScrollArea className="h-[400px] p-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
              <BellOff className="h-12 w-12 mb-2 opacity-20" />
              <p>Aucune notification pour le moment</p>
            </div>
          ) : (
            <AnimatePresence>
              {notifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={() => markAsRead(notification.id)}
                  onDelete={() => deleteNotification(notification.id)}
                />
              ))}
            </AnimatePresence>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
