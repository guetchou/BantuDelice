
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isAgent?: boolean;
}

interface AgentDetails {
  first_name: string;
  last_name: string;
  avatar_url?: string;
}

interface LiveChatProps {
  orderId?: string;
  onClose?: () => void;
  minimized?: boolean;
  onToggleMinimize?: () => void;
}

const LiveChat = ({ orderId, onClose, minimized, onToggleMinimize }: LiveChatProps) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [agent, setAgent] = useState<AgentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Simulate fetching agent and message history
  useEffect(() => {
    const fetchChatHistory = async () => {
      setIsLoading(true);
      try {
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock agent data
        setAgent({
          first_name: 'Aisha',
          last_name: 'Diallo',
          avatar_url: 'https://i.pravatar.cc/150?u=aisha'
        });
        
        // Mock initial messages
        setMessages([
          {
            id: '1',
            senderId: 'agent',
            text: 'Bonjour ! Je suis Aisha, votre agent de support. Comment puis-je vous aider aujourd\'hui ?',
            timestamp: new Date().toISOString(),
            isAgent: true
          }
        ]);
      } catch (error) {
        console.error('Error fetching chat history:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger l'historique du chat",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChatHistory();
  }, [toast]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      text: input,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    
    // Simulate agent response
    setTimeout(() => {
      const agentResponses = [
        "Je vérifie ça tout de suite pour vous.",
        "Merci pour votre patience. Laissez-moi vérifier cette information.",
        "Je comprends votre préoccupation. Nous allons résoudre ce problème rapidement.",
        "Votre commande est en cours de traitement. Le livreur devrait arriver bientôt.",
        "Je suis désolé pour ce désagrément. Je vais vous aider à résoudre ce problème."
      ];
      
      const randomResponse = agentResponses[Math.floor(Math.random() * agentResponses.length)];
      
      const newAgentMessage: Message = {
        id: Date.now().toString(),
        senderId: 'agent',
        text: randomResponse,
        timestamp: new Date().toISOString(),
        isAgent: true
      };
      
      setMessages(prev => [...prev, newAgentMessage]);
    }, 1000);
  };

  if (minimized) {
    return (
      <Button
        className="fixed bottom-6 right-6 p-4 flex items-center gap-2 rounded-full shadow-lg"
        onClick={onToggleMinimize}
      >
        <span>Chat avec le support</span>
      </Button>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="pb-3 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              {agent && agent.avatar_url ? (
                <AvatarImage src={agent.avatar_url} alt={`${agent.first_name} ${agent.last_name}`} />
              ) : (
                <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
              )}
            </Avatar>
            <div>
              <CardTitle className="text-sm font-medium">
                {agent ? `${agent.first_name} ${agent.last_name}` : 'Agent de support'}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {agent ? 'En ligne' : 'Connexion en cours...'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onToggleMinimize && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full" 
                onClick={onToggleMinimize}
              >
                <span className="sr-only">Minimiser</span>
                <span className="h-1 w-4 bg-current block" />
              </Button>
            )}
            {onClose && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full" 
                onClick={onClose}
              >
                <span className="sr-only">Fermer</span>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <ScrollArea className="h-[320px]">
        <CardContent className="p-4 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.isAgent ? 'justify-start' : 'justify-end'}`}
            >
              {message.isAgent && (
                <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                  {agent?.avatar_url ? (
                    <AvatarImage src={agent.avatar_url} alt={agent.first_name} />
                  ) : (
                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                  )}
                </Avatar>
              )}
              <div 
                className={`rounded-lg px-3 py-2 max-w-[80%] text-sm ${
                  message.isAgent 
                    ? 'bg-muted text-muted-foreground' 
                    : 'bg-primary text-primary-foreground ml-auto'
                }`}
              >
                {message.text}
                <div className={`text-[10px] mt-1 ${message.isAgent ? 'text-muted-foreground/70' : 'text-primary-foreground/70'}`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>
      </ScrollArea>
      <CardFooter className="p-4 pt-2 border-t">
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Écrivez votre message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button type="submit" size="icon" onClick={handleSend}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Envoyer</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LiveChat;
