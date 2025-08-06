import React, { useState } from 'react';
import NavbarColis from '@/components/colis/NavbarColis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  ChevronDown, 
  ChevronUp,
  Package,
  Truck,
  Plane,
  Clock,
  MapPin,
  DollarSign,
  Shield,
  FileText,
  Phone
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const ColisFAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqData: FAQItem[] = [
    // Général
    {
      question: "Comment fonctionne le suivi de colis BantuDelice ?",
      answer: "Notre système de suivi utilise des technologies avancées pour tracer vos colis en temps réel. Vous recevez des notifications à chaque étape de la livraison, de l'expédition jusqu'à la réception.",
      category: "general"
    },
    {
      question: "Quels sont les formats de numéros de tracking acceptés ?",
      answer: "Nous acceptons les formats suivants : National (BD123456), International DHL (DHL123456789), UPS (UPS123456789), et autres transporteurs internationaux.",
      category: "general"
    },
    {
      question: "Comment créer un compte BantuDelice ?",
      answer: "Cliquez sur 'Inscription' en haut à droite, remplissez le formulaire avec vos informations personnelles, validez votre email, et votre compte sera activé immédiatement.",
      category: "general"
    },

    // Expédition
    {
      question: "Comment expédier un colis ?",
      answer: "Rendez-vous sur la page 'Expédier un colis', remplissez le formulaire avec les informations de l'expéditeur et du destinataire, choisissez vos options de livraison, et validez votre commande.",
      category: "expedition"
    },
    {
      question: "Quels sont les délais de livraison ?",
      answer: "Livraison nationale : 1-3 jours ouvrables. Livraison internationale : 5-15 jours selon le service choisi (économique, standard, express).",
      category: "expedition"
    },
    {
      question: "Quels sont les poids et dimensions maximums ?",
      answer: "Colis national : jusqu'à 50kg. Colis international : jusqu'à 30kg. Dimensions maximum : 150cm x 100cm x 100cm.",
      category: "expedition"
    },

    // Tarifs
    {
      question: "Comment sont calculés les tarifs ?",
      answer: "Les tarifs dépendent du poids, de la distance, du type de service (économique, standard, express) et des options supplémentaires (assurance, livraison à domicile).",
      category: "tarifs"
    },
    {
      question: "Y a-t-il des frais cachés ?",
      answer: "Non, tous nos tarifs sont transparents. Le prix affiché inclut tous les frais de base. Seules les options supplémentaires (assurance, livraison express) sont facturées en plus.",
      category: "tarifs"
    },
    {
      question: "Quels moyens de paiement acceptez-vous ?",
      answer: "Nous acceptons les cartes bancaires, les virements bancaires, les paiements mobiles (Airtel Money, MTN Money) et les paiements en espèces dans nos agences.",
      category: "tarifs"
    },

    // Suivi
    {
      question: "Mon colis est-il assuré ?",
      answer: "Tous nos colis bénéficient d'une assurance de base. Vous pouvez souscrire une assurance supplémentaire pour une couverture plus importante.",
      category: "suivi"
    },
    {
      question: "Que faire si mon colis est endommagé ?",
      answer: "Contactez immédiatement notre service client, prenez des photos du colis endommagé, et nous traiterons votre réclamation dans les plus brefs délais.",
      category: "suivi"
    },
    {
      question: "Mon colis est en retard, que faire ?",
      answer: "Vérifiez d'abord le statut sur notre site. Si le retard persiste, contactez notre service client qui vous informera de la situation et des solutions possibles.",
      category: "suivi"
    },

    // Support
    {
      question: "Comment contacter le service client ?",
      answer: "Vous pouvez nous contacter par téléphone (+242 06 XXX XXX), email (support@bantudelice.cg), ou via notre chat en ligne disponible 24h/24.",
      category: "support"
    },
    {
      question: "Quels sont vos horaires d'ouverture ?",
      answer: "Nos agences sont ouvertes du lundi au vendredi de 8h à 18h, et le samedi de 9h à 16h. Notre service client en ligne est disponible 24h/24.",
      category: "support"
    },
    {
      question: "Comment déposer une réclamation ?",
      answer: "Rendez-vous sur notre page 'Réclamation', remplissez le formulaire en ligne, ou contactez directement notre service client par téléphone ou email.",
      category: "support"
    }
  ];

  const categories = [
    { id: 'all', label: 'Toutes les questions', icon: FileText },
    { id: 'general', label: 'Général', icon: Package },
    { id: 'expedition', label: 'Expédition', icon: Truck },
    { id: 'tarifs', label: 'Tarifs', icon: DollarSign },
    { id: 'suivi', label: 'Suivi', icon: MapPin },
    { id: 'support', label: 'Support', icon: Shield }
  ];

  const toggleItem = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filteredFAQ = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50">
      <NavbarColis />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Questions Fréquemment Posées
          </h1>
          <p className="text-lg text-gray-600">
            Trouvez rapidement les réponses à vos questions
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Rechercher une question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <category.icon className="h-4 w-4" />
              {category.label}
            </Button>
          ))}
        </div>

        {/* Liste des FAQ */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFAQ.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader 
                className="cursor-pointer"
                onClick={() => toggleItem(index)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {item.question}
                  </CardTitle>
                  {expandedItems.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </CardHeader>
              {expandedItems.includes(index) && (
                <CardContent className="pt-0">
                  <p className="text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Message si aucun résultat */}
        {filteredFAQ.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Aucune question trouvée
              </h3>
              <p className="text-gray-500 mb-6">
                Essayez de modifier vos critères de recherche ou contactez notre service client.
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
              >
                Voir toutes les questions
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Contact rapide */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Vous n'avez pas trouvé votre réponse ?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Notre équipe est là pour vous aider
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler le support
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                  <FileText className="h-4 w-4 mr-2" />
                  Déposer une réclamation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ColisFAQPage; 