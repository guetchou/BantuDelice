import { useState, useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
}

const LiveChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Charger les messages existants
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) {
        console.error('Erreur lors du chargement des messages:', error);
        return;
      }

      setMessages(data || []);
    };

    loadMessages();

    // Souscrire aux nouveaux messages
    const channel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          setMessages(current => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const { error } = await supabase
      .from('chat_messages')
      .insert([
        {
          message: newMessage.trim(),
          user_id: (await supabase.auth.getUser()).data.user?.id,
        }
      ]);

    if (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      return;
    }

    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Chat en direct</h2>
      </div>
      
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              <Avatar>
                <AvatarImage src={message.profiles?.avatar_url || undefined} />
                <AvatarFallback>
                  {message.profiles?.first_name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">
                  {message.profiles?.first_name} {message.profiles?.last_name}
                </div>
                <p className="text-sm text-gray-600">{message.message}</p>
                <span className="text-xs text-gray-400">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1"
          />
          <Button type="submit">Envoyer</Button>
        </div>
      </form>
    </div>
  );
};

export default LiveChat;