
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user' as const,
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate API response with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response
      const responses = [
        "Je suis désolé, je ne peux pas vous aider avec cette demande pour le moment.",
        "Merci pour votre message. Comment puis-je vous aider davantage?",
        "Votre commande est en cours de traitement.",
        "Nous avons bien reçu votre feedback, merci!",
        "Avez-vous essayé de redémarrer l'application?"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date(),
      }]);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Désolé, j'ai rencontré une erreur. Veuillez réessayer.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Assistant IA</h2>
      </div>
      
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                {message.role === 'assistant' ? (
                  <Bot className="h-5 w-5" />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </div>
              <div className={`max-w-[80%] ${
                message.role === 'user' ? 'text-right' : ''
              }`}>
                <p className="text-sm bg-gray-100 rounded-lg p-3">
                  {message.content}
                </p>
                <span className="text-xs text-gray-400">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-400">
              <Bot className="h-5 w-5 animate-spin" />
              <span>En train d'écrire...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Envoi...' : 'Envoyer'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AIChat;
