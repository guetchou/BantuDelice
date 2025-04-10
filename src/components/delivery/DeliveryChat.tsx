
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface DeliveryMessage {
  id: string;
  order_id: string;
  sender_id: string;
  sender_type: 'driver' | 'customer';
  message: string;
  read: boolean;
  created_at: string;
}

interface DeliveryChatProps {
  orderId: string;
  userType: 'driver' | 'customer';
}

export default function DeliveryChat({ orderId, userType }: DeliveryChatProps) {
  const [messages, setMessages] = useState<DeliveryMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
    subscribeToMessages();
    
    return () => {
      // Cleanup subscription here if needed
    };
  }, [orderId]);

  const fetchMessages = async () => {
    if (!orderId) return;
    
    try {
      const { data, error } = await supabase
        .from('delivery_messages')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at');
      
      if (error) throw error;
      
      if (data) {
        const typedData = data.map(msg => ({
          ...msg,
          sender_type: msg.sender_type as "driver" | "customer"
        }));
        setMessages(typedData);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('delivery-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'delivery_messages',
          filter: `order_id=eq.${orderId}`
        },
        (payload) => {
          setMessages(current => [...current, payload.new as DeliveryMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);
    const { data } = await supabase.auth.getUser();
    
    if (!data.user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour envoyer un message",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('delivery_messages')
      .insert({
        order_id: orderId,
        sender_type: userType,
        sender_id: data.user.id,
        message: newMessage.trim()
      });

    if (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
      });
    } else {
      setNewMessage('');
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[400px] border rounded-lg">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_type === userType ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.sender_type === userType
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100'
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <span className="text-xs opacity-70">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-2"
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Votre message..."
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !newMessage.trim()}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
