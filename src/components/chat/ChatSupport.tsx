
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send } from 'lucide-react';

interface Message {
  id: string;
  message: string;
  is_bot: boolean;
  created_at: string;
}

export default function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      message: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
      is_bot: true,
      created_at: new Date().toISOString()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      message: newMessage.trim(),
      is_bot: false,
      created_at: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Simulate bot response after delay
    setTimeout(() => {
      const botResponses = [
        "Merci pour votre message. Un agent va vous contacter bientôt.",
        "Je comprends votre problème. Pouvez-vous nous donner plus de détails ?",
        "Votre demande a été enregistrée. Notre équipe y travaille.",
        "Avez-vous essayé de redémarrer l'application ?",
        "Je suis désolé pour ce désagrément. Nous allons résoudre ce problème rapidement."
      ];
      
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        message: botResponses[Math.floor(Math.random() * botResponses.length)],
        is_bot: true,
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Support Chat</h2>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              ×
            </Button>
          </div>
          
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.is_bot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.is_bot
                        ? 'bg-gray-100'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <span className="text-xs opacity-70">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={sendMessage} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-12 w-12 flex items-center justify-center"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};
