import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import BackToHome from '@/components/BackToHome';
import { 
  HelpCircle, 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin,
  ChevronDown,
  ChevronUp,
  Truck,
  Car,
  Package,
  Users
} from 'lucide-react';

const Help: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "Comment commander un repas ?",
      answer: "Pour commander un repas, connectez-vous à votre compte, sélectionnez un restaurant, choisissez vos plats et finalisez votre commande. La livraison se fait en 30 minutes en moyenne.",
      category: "Livraison"
    },
    {
      question: "Comment réserver un taxi ?",
      answer: "Réservez un taxi en quelques clics : indiquez votre adresse de départ et d'arrivée, choisissez votre véhicule et confirmez votre réservation. Un chauffeur sera à votre disposition rapidement.",
      category: "Transport"
    },
    {
      question: "Comment expédier un colis ?",
      answer: "Pour expédier un colis, créez une expédition en indiquant les détails du colis et les adresses. Un livreur viendra récupérer votre colis et vous pourrez suivre sa livraison en temps réel.",
      category: "Colis"
    },
    {
      question: "Quels sont les moyens de paiement acceptés ?",
      answer: "Nous acceptons les paiements par carte bancaire, Mobile Money (MTN, Airtel), espèces et virements bancaires. Tous les paiements sont sécurisés.",
      category: "Paiement"
    },
    {
      question: "Comment contacter le service client ?",
      answer: "Notre service client est disponible 24h/24 par téléphone, email, chat en ligne ou WhatsApp. Nous répondons dans les plus brefs délais.",
      category: "Support"
    },
    {
      question: "Que faire en cas de problème avec ma commande ?",
      answer: "En cas de problème, contactez immédiatement notre service client. Nous nous engageons à résoudre rapidement tout problème et à vous rembourser si nécessaire.",
      category: "Support"
    }
  ];

  const categories = [
    { name: "Livraison", icon: Truck, color: "from-orange-500 to-red-500" },
    { name: "Transport", icon: Car, color: "from-blue-500 to-cyan-500" },
    { name: "Colis", icon: Package, color: "from-green-500 to-emerald-500" },
    { name: "Support", icon: Users, color: "from-purple-500 to-pink-500" }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Bouton retour à l'accueil */}
          <div className="absolute top-4 left-4 z-30">
            <BackToHome variant="icon" />
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <HelpCircle className="h-12 w-12 mr-4" />
            <h1 className="text-5xl font-bold">Centre d'Aide</h1>
          </div>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Trouvez rapidement des réponses à vos questions et contactez notre équipe de support
          </p>
          
          {/* Barre de recherche */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Rechercher dans l'aide..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg bg-white/10 border-white/30 text-white placeholder-white/70 backdrop-blur-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Catégories d'aide */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comment pouvons-nous vous aider ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sélectionnez une catégorie pour trouver rapidement l'aide dont vous avez besoin
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-lg backdrop-blur-md bg-white/80 hover:bg-white/90 transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Questions Fréquemment Posées
              </h2>
              <p className="text-lg text-gray-600">
                Trouvez rapidement des réponses aux questions les plus courantes
              </p>
            </div>
            
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <Card key={index} className="border-0 shadow-lg backdrop-blur-md bg-white/80 hover:bg-white/90 transition-all duration-300">
                  <CardContent className="p-0">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                          {faq.category}
                        </span>
                      </div>
                      {expandedFaq === index ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <div className="px-6 pb-6">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Besoin d'aide supplémentaire ?
              </h2>
              <p className="text-lg text-gray-600">
                Notre équipe de support est là pour vous aider 24h/24
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="text-center border-0 shadow-lg backdrop-blur-md bg-white/80 hover:bg-white/90 transition-all duration-300">
                <CardContent className="p-6">
                  <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Téléphone</h3>
                  <p className="text-gray-600 mb-4">+242 06 123 45 67</p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="tel:+242061234567">Appeler maintenant</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="text-center border-0 shadow-lg backdrop-blur-md bg-white/80 hover:bg-white/90 transition-all duration-300">
                <CardContent className="p-6">
                  <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Chat en ligne</h3>
                  <p className="text-gray-600 mb-4">Support instantané</p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/chat">Démarrer le chat</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="text-center border-0 shadow-lg backdrop-blur-md bg-white/80 hover:bg-white/90 transition-all duration-300">
                <CardContent className="p-6">
                  <Mail className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-600 mb-4">support@bantudelice.cg</p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="mailto:support@bantudelice.cg">Envoyer un email</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Formulaire de contact */}
            <Card className="border-0 shadow-lg backdrop-blur-md bg-white/80">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Envoyez-nous un message</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input placeholder="Votre nom" className="bg-white/50" />
                    <Input placeholder="Votre email" type="email" className="bg-white/50" />
                  </div>
                  <Input placeholder="Sujet" className="bg-white/50" />
                  <Textarea 
                    placeholder="Décrivez votre problème ou question..." 
                    rows={4}
                    className="bg-white/50"
                  />
                  <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Envoyer le message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Help;