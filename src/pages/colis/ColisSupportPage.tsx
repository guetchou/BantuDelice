import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  User, 
  Send, 
  FileText,
  Camera,
  Paperclip,
  Smile,
  CheckCircle,
  AlertCircle,
  Star,
  Globe,
  Languages,
  Headphones,
  HelpCircle,
  BookOpen,
  Settings
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  attachments?: string[];
}

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: Date;
  lastUpdate: Date;
}

const ColisSupportPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ln', name: 'Lingala', flag: '🇨🇬' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const quickActions = [
    { id: 'tracking', label: 'Problème de suivi', icon: Clock },
    { id: 'delivery', label: 'Retard de livraison', icon: AlertCircle },
    { id: 'damage', label: 'Colis endommagé', icon: AlertCircle },
    { id: 'payment', label: 'Problème de paiement', icon: CheckCircle },
    { id: 'refund', label: 'Demande de remboursement', icon: CheckCircle },
    { id: 'other', label: 'Autre problème', icon: HelpCircle }
  ];

  const supportChannels = [
    {
      id: 'phone',
      name: 'Téléphone',
      description: 'Support téléphonique 24/7',
      icon: Phone,
      contact: '+242 06 123 45 67',
      availability: '24h/24, 7j/7',
      color: 'bg-green-500'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      description: 'Support via WhatsApp',
      icon: MessageSquare,
      contact: '+242 06 123 45 67',
      availability: '8h-20h',
      color: 'bg-green-600'
    },
    {
      id: 'email',
      name: 'Email',
      description: 'Support par email',
      icon: Mail,
      contact: 'support@bantudelice.cg',
      availability: 'Réponse sous 24h',
      color: 'bg-blue-500'
    }
  ];

  useEffect(() => {
    // Simuler des messages initiaux
    const initialMessages: Message[] = [
      {
        id: '1',
        text: 'Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd\'hui ?',
        sender: 'agent',
        timestamp: new Date()
      }
    ];
    setMessages(initialMessages);

    // Simuler des tickets existants
    const mockTickets: SupportTicket[] = [
      {
        id: 'TKT-001',
        subject: 'Retard de livraison - Colis BD123456',
        status: 'in_progress',
        priority: 'high',
        category: 'delivery',
        createdAt: new Date('2024-01-14'),
        lastUpdate: new Date('2024-01-15')
      },
      {
        id: 'TKT-002',
        subject: 'Colis endommagé à la réception',
        status: 'open',
        priority: 'urgent',
        category: 'damage',
        createdAt: new Date('2024-01-15'),
        lastUpdate: new Date('2024-01-15')
      }
    ];
    setTickets(mockTickets);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simuler une réponse automatique
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Merci pour votre message. Un agent va vous répondre dans les plus brefs délais.',
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentMessage]);
    }, 1000);
  };

  const handleQuickAction = (actionId: string) => {
    const actionMessages = {
      tracking: 'J\'ai un problème avec le suivi de mon colis.',
      delivery: 'Ma livraison est en retard.',
      damage: 'Mon colis est arrivé endommagé.',
      payment: 'J\'ai un problème avec le paiement.',
      refund: 'Je souhaite demander un remboursement.',
      other: 'J\'ai un autre problème à signaler.'
    };

    const message = actionMessages[actionId as keyof typeof actionMessages];
    if (message) {
      setNewMessage(message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const ChatInterface = () => (
    <div className="h-96 flex flex-col">
      {/* En-tête du chat */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <Headphones className="h-4 w-4 text-orange-600" />
          </div>
          <div>
            <div className="font-medium">Support Client</div>
            <div className="text-sm text-gray-600">En ligne</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="text-sm">{message.text}</div>
              <div className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-orange-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Actions rapides */}
      <div className="p-4 border-t bg-gray-50">
        <div className="text-sm font-medium mb-2">Actions rapides :</div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action.id)}
            >
              <action.icon className="h-3 w-3 mr-1" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Zone de saisie */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <div className="flex-1 flex gap-2">
            <Button variant="outline" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Camera className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Tapez votre message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
          </div>
          <Button onClick={handleSendMessage} className="bg-orange-600 hover:bg-orange-700">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const TicketsInterface = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Mes tickets de support</h3>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <FileText className="h-4 w-4 mr-2" />
          Nouveau ticket
        </Button>
      </div>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{ticket.subject}</h4>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status === 'open' ? 'Ouvert' :
                       ticket.status === 'in_progress' ? 'En cours' :
                       ticket.status === 'resolved' ? 'Résolu' : 'Fermé'}
                    </Badge>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority === 'urgent' ? 'Urgent' :
                       ticket.priority === 'high' ? 'Élevé' :
                       ticket.priority === 'medium' ? 'Moyen' : 'Faible'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Créé le {ticket.createdAt.toLocaleDateString('fr-FR')} • 
                    Dernière mise à jour : {ticket.lastUpdate.toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Voir détails
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const ContactChannels = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        {supportChannels.map((channel) => (
          <Card key={channel.id} className="text-center">
            <CardContent className="p-6">
              <div className={`w-12 h-12 ${channel.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <channel.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{channel.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{channel.description}</p>
              <div className="space-y-2">
                <div className="font-medium">{channel.contact}</div>
                <div className="text-sm text-gray-500">{channel.availability}</div>
              </div>
              <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700">
                Contacter
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Nos bureaux
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Brazzaville</h4>
              <p className="text-sm text-gray-600 mb-1">123, Avenue de la Logistique</p>
              <p className="text-sm text-gray-600 mb-1">Brazzaville, Congo</p>
              <p className="text-sm text-gray-600">Tél: +242 06 123 45 67</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Pointe-Noire</h4>
              <p className="text-sm text-gray-600 mb-1">456, Boulevard du Commerce</p>
              <p className="text-sm text-gray-600 mb-1">Pointe-Noire, Congo</p>
              <p className="text-sm text-gray-600">Tél: +242 06 123 45 68</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50">
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Support Client
            </h1>
            <p className="text-gray-600">
              Notre équipe est là pour vous aider 24h/24, 7j/7
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat">Chat en ligne</TabsTrigger>
            <TabsTrigger value="tickets">Mes tickets</TabsTrigger>
            <TabsTrigger value="contact">Nous contacter</TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <Card>
              <CardContent className="p-0">
                <ChatInterface />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets">
            <TicketsInterface />
          </TabsContent>

          <TabsContent value="contact">
            <ContactChannels />
          </TabsContent>
        </Tabs>

        {/* FAQ rapide */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Questions fréquentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Comment suivre mon colis ?</h4>
                <p className="text-sm text-gray-600">
                  Utilisez votre numéro de tracking sur notre page de suivi ou contactez-nous.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Délais de livraison ?</h4>
                <p className="text-sm text-gray-600">
                  National : 1-3 jours, International : 5-15 jours selon la destination.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Que faire si mon colis est endommagé ?</h4>
                <p className="text-sm text-gray-600">
                  Prenez des photos et contactez-nous immédiatement pour déclarer le sinistre.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Comment annuler une commande ?</h4>
                <p className="text-sm text-gray-600">
                  Contactez-nous dans les 2h suivant la commande pour une annulation gratuite.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ColisSupportPage; 