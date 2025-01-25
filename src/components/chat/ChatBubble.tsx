import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([
          { 
            message: message.trim(),
            is_bot: false 
          }
        ]);

      if (error) throw error;

      toast({
        title: "Message envoyé",
        description: "Notre équipe vous répondra dans les plus brefs délais",
      });

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre message",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-orange-500 hover:bg-orange-600"
      >
        <MessageSquare className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-80 bg-white rounded-lg shadow-xl p-4 border border-gray-200">
          <h3 className="font-semibold mb-4">Service Client</h3>
          
          <div className="space-y-4 h-60 overflow-auto mb-4">
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="text-sm">
                Bonjour ! Comment pouvons-nous vous aider aujourd'hui ?
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Votre message..."
              className="flex-1"
            />
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
              Envoyer
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;