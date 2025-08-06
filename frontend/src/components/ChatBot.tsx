import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Bonjour ! Je suis l'assistant virtuel de BantuDelice. Comment puis-je vous aider aujourd'hui ?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const quickReplies = [
    "Comment commander ?",
    "Problème de livraison",
    "Paiement",
    "Contacter le support"
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simuler une réponse automatique
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: "Merci pour votre message. Un conseiller va vous répondre dans les plus brefs délais. En attendant, vous pouvez consulter notre centre d'aide ou nous contacter directement.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleQuickReply = (reply: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      text: reply,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Réponses automatiques selon la question
    setTimeout(() => {
      let botResponse = "";
      switch (reply) {
        case "Comment commander ?":
          botResponse = "Pour commander, connectez-vous à votre compte, sélectionnez un service (livraison, taxi, colis), suivez les étapes et finalisez votre commande. C'est simple et rapide !";
          break;
        case "Problème de livraison":
          botResponse = "En cas de problème de livraison, contactez immédiatement notre service client au +242 06 123 45 67 ou via le chat. Nous nous engageons à résoudre rapidement tout problème.";
          break;
        case "Paiement":
          botResponse = "Nous acceptons les paiements par carte bancaire, Mobile Money (MTN, Airtel), espèces et virements. Tous les paiements sont sécurisés et vous recevez un reçu par email.";
          break;
        case "Contacter le support":
          botResponse = "Notre équipe est disponible 24h/24. Téléphone : +242 06 123 45 67, Email : support@bantudelice.cg, ou consultez notre centre d'aide en ligne.";
          break;
        default:
          botResponse = "Merci pour votre message. Un conseiller va vous répondre dans les plus brefs délais.";
      }

      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <>
      {/* Bouton flottant du chatbot */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg backdrop-blur-md"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      {/* Fenêtre du chatbot */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-start p-6">
          <div className="w-96 h-[500px] bg-white rounded-2xl shadow-2xl backdrop-blur-md border border-gray-200 flex flex-col">
            {/* En-tête */}
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bot className="h-6 w-6" />
                  <div>
                    <CardTitle className="text-lg">Assistant BantuDelice</CardTitle>
                    <p className="text-sm opacity-90">En ligne</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-2xl ${
                      message.isUser
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>

            {/* Réponses rapides */}
            {messages.length === 1 && (
              <div className="px-4 pb-4">
                <p className="text-sm text-gray-600 mb-3">Réponses rapides :</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs bg-white/80 backdrop-blur-sm"
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Zone de saisie */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Tapez votre message..."
                  className="flex-1 bg-gray-50"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot; 