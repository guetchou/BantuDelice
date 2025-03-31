
import { useState, useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, X, Send } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import LiveChatMessage from './LiveChatMessage';

interface Message {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  is_bot: boolean;
  user?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
}

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  
  useEffect(() => {
    if (!isOpen || !user) return;

    const loadMessages = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('chat_messages')
          .select(`
            id,
            user_id,
            message,
            created_at,
            is_bot,
            profiles:profiles(first_name, last_name, avatar_url)
          `)
          .or(`user_id.eq.${user.id},is_bot.eq.true`)
          .order('created_at', { ascending: true })
          .limit(50);

        if (error) throw error;

        if (data) {
          const formattedMessages = data.map(msg => ({
            id: msg.id,
            user_id: msg.user_id,
            message: msg.message,
            created_at: msg.created_at,
            is_bot: msg.is_bot,
            user: msg.profiles ? {
              first_name: msg.profiles.first_name,
              last_name: msg.profiles.last_name,
              avatar_url: msg.profiles.avatar_url
            } : undefined
          }));
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error("Impossible de charger les messages");
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages(current => [...current, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen, user]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading || !user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([
          {
            message: newMessage.trim(),
            user_id: user.id,
            is_bot: false
          }
        ]);

      if (error) throw error;
      setNewMessage('');
      
      // Simulate bot response
      setTimeout(async () => {
        const botResponses = [
          "Merci pour votre message! Un agent va vous répondre sous peu.",
          "Votre question est importante pour nous. Nous y répondrons dans les plus brefs délais.",
          "Nous avons bien reçu votre message et nous traitons votre demande.",
          "Merci de nous avoir contactés. Un membre de notre équipe vous répondra bientôt."
        ];
        
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
        
        await supabase
          .from('chat_messages')
          .insert([
            {
              message: randomResponse,
              user_id: user.id,
              is_bot: true
            }
          ]);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <ChatWindow 
          messages={messages} 
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessage={sendMessage}
          scrollAreaRef={scrollAreaRef}
          isLoading={isLoading}
          user={user}
          onClose={() => setIsOpen(false)}
        />
      ) : (
        <ChatButton onClick={() => setIsOpen(true)} />
      )}
    </div>
  );
};

interface ChatWindowProps {
  messages: Message[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  sendMessage: (e: React.FormEvent) => void;
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  user: any;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  newMessage,
  setNewMessage,
  sendMessage,
  scrollAreaRef,
  isLoading,
  user,
  onClose
}) => {
  return (
    <div className="w-80 sm:w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col border">
      <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
        <h2 className="text-lg font-semibold">Support Chat</h2>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Commencez à discuter avec notre équipe de support</p>
            </div>
          )}
          
          {messages.map((message) => (
            <LiveChatMessage
              key={message.id}
              id={message.id}
              message={message.message}
              created_at={message.created_at}
              is_bot={message.is_bot}
              user={message.user}
            />
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            disabled={isLoading || !user}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !user || !newMessage.trim()} className="bg-orange-500 hover:bg-orange-600">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {!user && (
          <p className="text-xs text-red-500 mt-1">Connectez-vous pour discuter avec notre équipe</p>
        )}
      </form>
    </div>
  );
};

const ChatButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="rounded-full h-14 w-14 flex items-center justify-center bg-orange-500 hover:bg-orange-600 shadow-lg"
    >
      <MessageSquare className="h-6 w-6" />
    </Button>
  );
};

export default LiveChat;
