
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Phone, Video, Mic, Image as ImageIcon, Paperclip, MoreVertical, Search, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { format } from 'date-fns';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'contact';
  timestamp: Date;
  read: boolean;
};

type Contact = {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
  online: boolean;
  type: 'driver' | 'restaurant' | 'friend';
};

const contacts: Contact[] = [
  {
    id: '1',
    name: 'Thomas (Taxi)',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    lastMessage: 'Je serai là dans 5 minutes',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 2,
    online: true,
    type: 'driver'
  },
  {
    id: '2',
    name: 'Le Petit Bistro',
    avatar: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=200&auto=format&fit=crop',
    lastMessage: 'Votre commande est en cours de préparation',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 1,
    online: true,
    type: 'restaurant'
  },
  {
    id: '3',
    name: 'Sophie (Covoiturage)',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    lastMessage: 'Je vous attends au point de rencontre',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 0,
    online: false,
    type: 'driver'
  },
  {
    id: '4',
    name: 'Mamadou',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    lastMessage: 'On se retrouve où demain ?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5),
    unreadCount: 0,
    online: false,
    type: 'friend'
  },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '101',
      content: 'Bonjour, je suis votre chauffeur pour aujourd\'hui',
      sender: 'contact',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      read: true
    },
    {
      id: '102',
      content: 'Merci, à quelle heure allez-vous arriver ?',
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 9),
      read: true
    },
    {
      id: '103',
      content: 'Je suis en route, je serai là dans environ 10 minutes',
      sender: 'contact',
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      read: true
    },
    {
      id: '104',
      content: 'Parfait, je vous attends',
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 7),
      read: true
    },
    {
      id: '105',
      content: 'Je suis dans les embouteillages, petit retard',
      sender: 'contact',
      timestamp: new Date(Date.now() - 1000 * 60 * 6),
      read: true
    },
    {
      id: '106',
      content: 'Je serai là dans 5 minutes',
      sender: 'contact',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: false
    },
  ],
  '2': [
    {
      id: '201',
      content: 'Bonjour, votre commande a été reçue',
      sender: 'contact',
      timestamp: new Date(Date.now() - 1000 * 60 * 40),
      read: true
    },
    {
      id: '202',
      content: 'Merci, combien de temps pour la préparation ?',
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 38),
      read: true
    },
    {
      id: '203',
      content: 'Environ 20 minutes, nous vous tiendrons informé',
      sender: 'contact',
      timestamp: new Date(Date.now() - 1000 * 60 * 35),
      read: true
    },
    {
      id: '204',
      content: 'Votre commande est en cours de préparation',
      sender: 'contact',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false
    },
  ]
};

export default function Messages() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setMessages(mockMessages[contact.id] || []);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
      read: true
    };
    
    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-6 bg-gradient-to-br from-slate-900 to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 text-white">Messages</h1>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Communiquez avec vos chauffeurs, restaurants et amis
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)] min-h-[500px]">
          <Card className="bg-black/20 backdrop-blur-sm border-gray-700 md:col-span-1 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  className="pl-10 bg-black/30 border-gray-600 text-white"
                  placeholder="Rechercher..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full bg-black/20">
                <TabsTrigger value="all" className="flex-1 text-white data-[state=active]:bg-teal-500/20">Tous</TabsTrigger>
                <TabsTrigger value="drivers" className="flex-1 text-white data-[state=active]:bg-teal-500/20">Chauffeurs</TabsTrigger>
                <TabsTrigger value="restaurants" className="flex-1 text-white data-[state=active]:bg-teal-500/20">Restaurants</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="m-0">
                <div className="overflow-y-auto h-[calc(100vh-300px)]">
                  {filteredContacts.map(contact => (
                    <div 
                      key={contact.id}
                      className={`flex items-center p-4 border-b border-gray-700 cursor-pointer hover:bg-black/30 transition-colors ${selectedContact?.id === contact.id ? 'bg-black/30' : ''}`}
                      onClick={() => handleContactSelect(contact)}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        {contact.online && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></div>
                        )}
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-white truncate">{contact.name}</h3>
                          {contact.lastMessageTime && (
                            <span className="text-xs text-gray-400">
                              {format(contact.lastMessageTime, 'HH:mm')}
                            </span>
                          )}
                        </div>
                        {contact.lastMessage && (
                          <p className="text-sm text-gray-400 truncate">{contact.lastMessage}</p>
                        )}
                      </div>
                      {(contact.unreadCount && contact.unreadCount > 0) && (
                        <Badge className="ml-2 bg-teal-500">{contact.unreadCount}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="drivers" className="m-0">
                <div className="overflow-y-auto h-[calc(100vh-300px)]">
                  {filteredContacts.filter(c => c.type === 'driver').map(contact => (
                    <div 
                      key={contact.id}
                      className={`flex items-center p-4 border-b border-gray-700 cursor-pointer hover:bg-black/30 transition-colors ${selectedContact?.id === contact.id ? 'bg-black/30' : ''}`}
                      onClick={() => handleContactSelect(contact)}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        {contact.online && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></div>
                        )}
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-white truncate">{contact.name}</h3>
                          {contact.lastMessageTime && (
                            <span className="text-xs text-gray-400">
                              {format(contact.lastMessageTime, 'HH:mm')}
                            </span>
                          )}
                        </div>
                        {contact.lastMessage && (
                          <p className="text-sm text-gray-400 truncate">{contact.lastMessage}</p>
                        )}
                      </div>
                      {(contact.unreadCount && contact.unreadCount > 0) && (
                        <Badge className="ml-2 bg-teal-500">{contact.unreadCount}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="restaurants" className="m-0">
                <div className="overflow-y-auto h-[calc(100vh-300px)]">
                  {filteredContacts.filter(c => c.type === 'restaurant').map(contact => (
                    <div 
                      key={contact.id}
                      className={`flex items-center p-4 border-b border-gray-700 cursor-pointer hover:bg-black/30 transition-colors ${selectedContact?.id === contact.id ? 'bg-black/30' : ''}`}
                      onClick={() => handleContactSelect(contact)}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        {contact.online && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></div>
                        )}
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-white truncate">{contact.name}</h3>
                          {contact.lastMessageTime && (
                            <span className="text-xs text-gray-400">
                              {format(contact.lastMessageTime, 'HH:mm')}
                            </span>
                          )}
                        </div>
                        {contact.lastMessage && (
                          <p className="text-sm text-gray-400 truncate">{contact.lastMessage}</p>
                        )}
                      </div>
                      {(contact.unreadCount && contact.unreadCount > 0) && (
                        <Badge className="ml-2 bg-teal-500">{contact.unreadCount}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
          
          <Card className="bg-black/20 backdrop-blur-sm border-gray-700 md:col-span-2 flex flex-col">
            {selectedContact ? (
              <>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedContact.avatar} />
                      <AvatarFallback>{selectedContact.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <h3 className="font-medium text-white">{selectedContact.name}</h3>
                      <p className="text-xs text-gray-400">
                        {selectedContact.online ? 'En ligne' : 'Hors ligne'}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-black/20">
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-black/20">
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-black/20">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map(message => (
                    <div 
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.sender === 'contact' && (
                        <Avatar className="h-8 w-8 mr-2 mt-1">
                          <AvatarImage src={selectedContact.avatar} />
                          <AvatarFallback>{selectedContact.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div 
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          message.sender === 'user' 
                            ? 'bg-teal-500 text-white' 
                            : 'bg-gray-700 text-white'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' 
                            ? 'text-teal-200' 
                            : 'text-gray-400'
                        }`}>
                          {format(message.timestamp, 'HH:mm')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-700">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-black/20">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-black/20">
                      <ImageIcon className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-black/20">
                      <Mic className="h-5 w-5" />
                    </Button>
                    <Input 
                      className="bg-black/30 border-gray-600 text-white"
                      placeholder="Écrivez un message..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      className="bg-teal-500 hover:bg-teal-600"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center flex-col p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Vos messages</h3>
                <p className="text-gray-400 max-w-md">
                  Sélectionnez une conversation pour commencer à discuter avec vos chauffeurs, restaurants ou amis.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
