import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { 
  MessageCircle, 
  Send, 
  Phone, 
  X, 
  Minimize2, 
  Maximize2,
  User,
  Car
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'passenger' | 'driver';
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface TaxiChatProps {
  rideId: string;
  driver?: {
    id: string;
    name: string;
    phone: string;
  };
  passenger?: {
    id: string;
    name: string;
    phone: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

export default function TaxiChat({ 
  rideId, 
  driver, 
  passenger, 
  isOpen, 
  onClose, 
  onMinimize 
}: TaxiChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isDriver = user?.role === 'driver';
  const currentUser = isDriver ? driver : passenger;
  const otherUser = isDriver ? passenger : driver;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  // Simulate initial messages
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMessages: Message[] = [
        {
          id: '1',
          senderId: 'system',
          senderName: 'Système',
          senderType: 'driver',
          content: 'Bonjour ! Vous pouvez maintenant communiquer avec votre chauffeur/passager.',
          timestamp: new Date(),
          isRead: true
        }
      ];
      setMessages(initialMessages);
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user?.id || '',
      senderName: user?.name || 'Utilisateur',
      senderType: isDriver ? 'driver' : 'passenger',
      content: newMessage.trim(),
      timestamp: new Date(),
      isRead: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Simulate auto-reply for demo
      if (Math.random() > 0.7) {
        const autoReply: Message = {
          id: (Date.now() + 1).toString(),
          senderId: otherUser?.id || '',
          senderName: otherUser?.name || 'Autre utilisateur',
          senderType: isDriver ? 'passenger' : 'driver',
          content: getAutoReply(newMessage),
          timestamp: new Date(),
          isRead: false
        };
        setMessages(prev => [...prev, autoReply]);
      }
    }, 1000 + Math.random() * 2000);
  };

  const getAutoReply = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('arrivée') || lowerMessage.includes('arrive')) {
      return isDriver ? "J'arrive dans 2 minutes !" : "Parfait, je vous attends !";
    }
    if (lowerMessage.includes('attendre') || lowerMessage.includes('attente')) {
      return "Pas de problème, prenez votre temps.";
    }
    if (lowerMessage.includes('merci') || lowerMessage.includes('thanks')) {
      return "De rien ! Au plaisir de vous servir.";
    }
    if (lowerMessage.includes('prix') || lowerMessage.includes('tarif')) {
      return "Le prix sera calculé selon le trajet effectué.";
    }
    
    return "Message reçu, merci !";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCall = () => {
    if (otherUser?.phone) {
      window.location.href = `tel:${otherUser.phone}`;
    } else {
      toast.error('Numéro de téléphone non disponible');
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    onMinimize();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="w-80 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4 text-blue-500" />
                <CardTitle className="text-sm">Chat Taxi</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {messages.filter(m => !m.isRead && m.senderId !== user?.id).length}
                </Badge>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMinimize}
                >
                  <Maximize2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-96 h-96 shadow-lg flex flex-col">
        <CardHeader className="pb-2 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4 text-blue-500" />
              <div>
                <CardTitle className="text-sm">Chat Taxi</CardTitle>
                <p className="text-xs text-gray-500">
                  Course #{rideId.substring(0, 8)}
                </p>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCall}
                title="Appeler"
              >
                <Phone className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMinimize}
                title="Réduire"
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                title="Fermer"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.senderId === user?.id
                      ? 'bg-blue-500 text-white'
                      : message.senderId === 'system'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.senderId !== 'system' && (
                    <div className="flex items-center space-x-1 mb-1">
                      {message.senderType === 'driver' ? (
                        <Car className="h-3 w-3" />
                      ) : (
                        <User className="h-3 w-3" />
                      )}
                      <span className="text-xs font-medium">
                        {message.senderName}
                      </span>
                    </div>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg">
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-600 ml-2">
                      {otherUser?.name || 'Autre utilisateur'} tape...
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-3">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 