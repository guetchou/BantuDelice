import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Info,
  HelpCircle,
  Package,
  Truck,
  MapPin,
  DollarSign,
  Settings,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Smile,
  ThumbsUp,
  ThumbsDown,
  Star,
  Zap,
  Brain,
  Activity,
  TrendingUp,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Download,
  Share2,
  Copy,
  MoreHorizontal
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
  attachments?: ChatAttachment[];
  quickReplies?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  confidence?: number;
}

interface ChatAttachment {
  type: 'image' | 'file' | 'location' | 'tracking';
  url?: string;
  name?: string;
  size?: number;
  data?: unknown;
}

interface ChatSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  messages: ChatMessage[];
  userSatisfaction?: number;
  resolutionTime?: number;
  agentInvolved?: boolean;
  category: 'tracking' | 'pricing' | 'delivery' | 'complaint' | 'general';
}

const ColisAIChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Bonjour ! Je suis l\'assistant IA de BantuDelice Colis. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date(),
      status: 'sent',
      quickReplies: [
        'Suivre un colis',
        'Calculer un tarif',
        'Problème de livraison',
        'Informations générales'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSession, setCurrentSession] = useState<ChatSession>({
    id: 'session-1',
    startTime: new Date(),
    messages: [],
    category: 'general'
  });
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [aiStats, setAiStats] = useState({
    totalConversations: 1247,
    averageResponseTime: 1.2,
    satisfactionRate: 94.8,
    resolutionRate: 89.3,
    aiConfidence: 92.1
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simuler la réponse IA
    setTimeout(() => {
      const botResponse = generateAIResponse(inputMessage);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse.content,
        timestamp: new Date(),
        status: 'sent',
        quickReplies: botResponse.quickReplies,
        sentiment: botResponse.sentiment,
        confidence: botResponse.confidence
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateAIResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('suivre') || input.includes('tracking') || input.includes('colis')) {
      return {
        content: 'Pour suivre votre colis, j\'ai besoin de votre numéro de suivi. Pouvez-vous me le fournir ?',
        quickReplies: ['BD12345678', 'Je n\'ai pas le numéro', 'Comment l\'obtenir ?'],
        sentiment: 'positive' as const,
        confidence: 0.95
      };
    }
    
    if (input.includes('tarif') || input.includes('prix') || input.includes('coût')) {
      return {
        content: 'Je peux vous aider à calculer le tarif de livraison. D\'où vers où souhaitez-vous envoyer votre colis ?',
        quickReplies: ['Brazzaville → Pointe-Noire', 'Autre destination', 'Voir les tarifs'],
        sentiment: 'positive' as const,
        confidence: 0.92
      };
    }
    
    if (input.includes('problème') || input.includes('retard') || input.includes('perdu')) {
      return {
        content: 'Je comprends votre préoccupation. Pour vous aider efficacement, pouvez-vous me donner plus de détails sur le problème rencontré ?',
        quickReplies: ['Colis en retard', 'Colis endommagé', 'Colis perdu', 'Autre problème'],
        sentiment: 'neutral' as const,
        confidence: 0.88
      };
    }
    
    return {
      content: 'Je suis là pour vous aider avec toutes vos questions concernant BantuDelice Colis. Que souhaitez-vous savoir ?',
      quickReplies: ['Suivre un colis', 'Calculer un tarif', 'Nos services', 'Contact humain'],
      sentiment: 'positive' as const,
      confidence: 0.85
    };
  };

  const handleQuickReply = (reply: string) => {
    setInputMessage(reply);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Simulation de reconnaissance vocale
    if (!isListening) {
      setTimeout(() => {
        setInputMessage('Suivre mon colis BD12345678');
        setIsListening(false);
      }, 3000);
    }
  };

  const handleMessageFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, sentiment: feedback }
        : msg
    ));
  };

  const quickActions = [
    { icon: Package, label: 'Suivre un colis', action: () => handleQuickReply('Suivre un colis') },
    { icon: DollarSign, label: 'Calculer tarif', action: () => handleQuickReply('Calculer un tarif') },
    { icon: Truck, label: 'Statut livraison', action: () => handleQuickReply('Statut de ma livraison') },
    { icon: HelpCircle, label: 'Aide', action: () => handleQuickReply('J\'ai besoin d\'aide') }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Assistant IA BantuDelice</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Chatbot intelligent pour vous accompagner dans toutes vos démarches de livraison de colis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Statistiques IA */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Performance IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Conversations</span>
                  <span className="font-semibold">{aiStats.totalConversations.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Temps de réponse</span>
                  <span className="font-semibold">{aiStats.averageResponseTime}s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Satisfaction</span>
                  <span className="font-semibold text-green-600">{aiStats.satisfactionRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Résolution</span>
                  <span className="font-semibold text-blue-600">{aiStats.resolutionRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Confiance IA</span>
                  <span className="font-semibold text-purple-600">{aiStats.aiConfidence}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={action.action}
                  >
                    <action.icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat principal */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Assistant IA BantuDelice</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-500">En ligne</span>
                      <Badge variant="outline" className="text-xs">
                        IA Confiance: {aiStats.aiConfidence}%
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                        <div className={`flex items-start gap-2 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`p-2 rounded-full ${
                            message.type === 'user' 
                              ? 'bg-gradient-to-r from-orange-400 to-yellow-400' 
                              : 'bg-gray-100'
                          }`}>
                            {message.type === 'user' ? (
                              <User className="h-4 w-4 text-white" />
                            ) : (
                              <Bot className="h-4 w-4 text-gray-600" />
                            )}
                          </div>
                          
                          <div className={`rounded-lg p-3 ${
                            message.type === 'user'
                              ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white'
                              : 'bg-gray-50 text-gray-900'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            
                            {message.quickReplies && (
                              <div className="mt-3 space-y-2">
                                {message.quickReplies.map((reply, index) => (
                                  <Button
                                    key={index}
                                    size="sm"
                                    variant={message.type === 'user' ? 'secondary' : 'outline'}
                                    className="text-xs"
                                    onClick={() => handleQuickReply(reply)}
                                  >
                                    {reply}
                                  </Button>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs opacity-70">
                                {message.timestamp.toLocaleTimeString()}
                              </span>
                              
                              {message.type === 'bot' && (
                                <div className="flex items-center gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleMessageFeedback(message.id, 'positive')}
                                  >
                                    <ThumbsUp className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleMessageFeedback(message.id, 'negative')}
                                  >
                                    <ThumbsDown className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-2">
                        <div className="p-2 bg-gray-100 rounded-full">
                          <Bot className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>

            <div className="border-t p-4">
              <div className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleVoiceInput}
                  className={isListening ? 'bg-red-100 text-red-600' : ''}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Historique des conversations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Historique des Conversations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chatHistory.slice(0, 6).map((session, index) => (
              <div key={session.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{session.category}</Badge>
                  <span className="text-sm text-gray-500">
                    {session.startTime.toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {session.messages.length} messages
                </p>
                {session.userSatisfaction && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span className="text-sm">{session.userSatisfaction}/5</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColisAIChatbot; 