import { useState, useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Profile {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

interface Message {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  agent_id?: string | null;
  is_bot?: boolean | null;
  profiles?: Profile | null;
}

const LiveChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const loadMessages = async () => {
      console.log('Loading messages...');
      const { data: messagesData, error } = await supabase
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
        console.error('Error loading messages:', error);
        return;
      }

      console.log('Messages loaded:', messagesData);
      if (messagesData) {
        const typedMessages: Message[] = messagesData.map(msg => ({
          id: msg.id,
          user_id: msg.user_id || '',
          message: msg.message,
          created_at: msg.created_at,
          agent_id: msg.agent_id,
          is_bot: msg.is_bot,
          profiles: msg.profiles && !('error' in msg.profiles) ? msg.profiles : null
        }));
        setMessages(typedMessages);
      }
    };

    loadMessages();

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
          console.log('New message received:', payload);
          const newMsg: Message = {
            id: payload.new.id,
            user_id: payload.new.user_id || '',
            message: payload.new.message,
            created_at: payload.new.created_at,
            agent_id: payload.new.agent_id,
            is_bot: payload.new.is_bot,
            profiles: null // For new messages, we'll need to load the profile separately
          };
          setMessages(current => [...current, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    console.log('Sending message:', newMessage);
    const { error } = await supabase
      .from('chat_messages')
      .insert([
        {
          message: newMessage.trim(),
          user_id: (await supabase.auth.getUser()).data.user?.id,
        }
      ]);

    if (error) {
      console.error('Error sending message:', error);
      return;
    }

    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Live Chat</h2>
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
            placeholder="Write your message..."
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </div>
      </form>
    </div>
  );
};

export default LiveChat;