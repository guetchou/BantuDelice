import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  Clock, 
  MapPin, 
  Users,
  CheckCircle,
  Star,
  Headphones,
  Smartphone,
  MessageCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CallCenter: React.FC = () => {
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
    channel: 'phone'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Simulation d'envoi de ticket
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Demande envoyée",
        description: "Nous vous contacterons dans les plus brefs délais.",
      });
      
      setContactForm({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: '',
        channel: 'phone'
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre demande. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const contactChannels = [
    {
      id: 'phone',
      name: 'Téléphone',
      icon: Phone,
      number: '+242 06 123 4567',
      description: 'Appelez-nous directement',
      color: 'from-green-500 to-emerald-500',
      available: true,
      responseTime: 'Immédiat'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageSquare,
      number: '+242 06 123 4567',
      description: 'Chat WhatsApp Business',
      color: 'from-green-400 to-green-600',
      available: true,
      responseTime: '5 minutes'
    },
    {
      id: 'sms',
      name: 'SMS',
      icon: Smartphone,
      number: '+242 06 123 4567',
      description: 'Envoyez un SMS',
      color: 'from-blue-500 to-cyan-500',
      available: true,
      responseTime: '10 minutes'
    },
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      number: 'support@bantudelice.cg',
      description: 'Envoyez un email',
      color: 'from-purple-500 to-pink-500',
      available: true,
      responseTime: '2 heures'
    }
  ];

  const stats = [
    { label: 'Temps de réponse moyen', value: '4.2 min', icon: Clock },
    { label: 'Satisfaction client', value: '98%', icon: Star },
    { label: 'Agents disponibles', value: '8/12', icon: Users },
    { label: 'Tickets résolus', value: '1,234', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              Support Multicanal
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Besoin d'aide ?
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              Notre équipe est disponible 24/7 pour vous accompagner
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-indigo-600 hover:bg-gray-100"
                onClick={() => window.location.href = 'tel:+242061234567'}
              >
                <Phone className="mr-2 h-5 w-5" />
                Appeler maintenant
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => window.location.href = 'https://wa.me/242061234567'}
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-lg">
                  <CardContent className="pt-6">
                    <Icon className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Canaux de contact */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Canaux de Contact
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choisissez le canal qui vous convient le mieux. Nous sommes là pour vous aider !
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <Card key={channel.id} className="text-center hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className={`w-16 h-16 bg-gradient-to-r ${channel.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{channel.name}</CardTitle>
                    <CardDescription>{channel.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-lg font-semibold text-gray-900">
                        {channel.number}
                      </div>
                      <div className="text-sm text-gray-600">
                        Réponse en {channel.responseTime}
                      </div>
                      <Button 
                        className={`w-full bg-gradient-to-r ${channel.color} hover:opacity-90`}
                        onClick={() => {
                          if (channel.id === 'phone') {
                            window.location.href = `tel:${channel.number}`;
                          } else if (channel.id === 'whatsapp') {
                            window.location.href = `https://wa.me/242061234567`;
                          } else if (channel.id === 'sms') {
                            window.location.href = `sms:${channel.number}`;
                          } else if (channel.id === 'email') {
                            window.location.href = `mailto:${channel.number}`;
                          }
                        }}
                      >
                        {channel.id === 'phone' && 'Appeler'}
                        {channel.id === 'whatsapp' && 'WhatsApp'}
                        {channel.id === 'sms' && 'SMS'}
                        {channel.id === 'email' && 'Email'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Formulaire de contact */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Envoyez-nous un message
              </h2>
              <p className="text-gray-600">
                Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Sujet *</Label>
                    <Input
                      id="subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600">
                    <Headphones className="mr-2 h-4 w-4" />
                    Envoyer le message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Informations supplémentaires */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Horaires d'ouverture
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Lundi - Vendredi</span>
                  <span className="font-semibold">8h00 - 20h00</span>
                </div>
                <div className="flex justify-between">
                  <span>Samedi</span>
                  <span className="font-semibold">9h00 - 18h00</span>
                </div>
                <div className="flex justify-between">
                  <span>Dimanche</span>
                  <span className="font-semibold">10h00 - 16h00</span>
                </div>
                <div className="flex justify-between text-indigo-600 font-semibold">
                  <span>Urgences</span>
                  <span>24h/24</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Nos services
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Commandes par téléphone</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Support technique</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Suivi de commande</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Résolution de problèmes</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Support multilingue</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CallCenter; 