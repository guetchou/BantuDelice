import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  ChevronDown, 
  ChevronUp,
  Package,
  CreditCard,
  Shield,
  Truck,
  Users,
  FileText,
  HelpCircle
} from 'lucide-react';

const FAQ: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqData = [
    {
      category: 'Livraison',
      icon: Package,
      questions: [
        {
          question: 'Comment suivre mon colis ?',
          answer: 'Utilisez le numéro de suivi fourni lors de la commande dans la section "Suivi" de votre espace client.',
          tags: ['suivi', 'colis', 'livraison']
        },
        {
          question: 'Quels sont les délais de livraison ?',
          answer: 'Livraison locale : 24-48h, Nationale : 2-5 jours, Internationale : 5-15 jours selon le pays.',
          tags: ['délais', 'livraison']
        },
        {
          question: 'Que faire si mon colis est endommagé ?',
          answer: 'Prenez des photos et contactez immédiatement notre service client pour un remboursement ou remplacement.',
          tags: ['dommage', 'remboursement']
        }
      ]
    },
    {
      category: 'Paiement',
      icon: CreditCard,
      questions: [
        {
          question: 'Quels moyens de paiement acceptez-vous ?',
          answer: 'Cartes bancaires, Mobile Money, Airtel Money, virements bancaires et paiements en espèces.',
          tags: ['paiement', 'moyens']
        },
        {
          question: 'Comment obtenir une facture ?',
          answer: 'Téléchargez depuis votre espace client dans "Mes commandes" ou recevez par email automatiquement.',
          tags: ['facture', 'facturation']
        },
        {
          question: 'Puis-je annuler une commande ?',
          answer: 'Oui, dans les 2 heures suivant la validation. Passé ce délai, contactez notre service client.',
          tags: ['annulation', 'commande']
        }
      ]
    },
    {
      category: 'Compte',
      icon: Users,
      questions: [
        {
          question: 'Comment modifier mes informations ?',
          answer: 'Allez dans "Paramètres" > "Profil" pour modifier vos informations personnelles.',
          tags: ['profil', 'modification']
        },
        {
          question: 'J\'ai oublié mon mot de passe',
          answer: 'Utilisez "Mot de passe oublié" sur la page de connexion pour recevoir un lien de réinitialisation.',
          tags: ['mot de passe', 'oubli']
        },
        {
          question: 'Mes données sont-elles sécurisées ?',
          answer: 'Oui, nous utilisons des protocoles de sécurité avancés pour protéger vos données.',
          tags: ['sécurité', 'données']
        }
      ]
    },
    {
      category: 'Service client',
      icon: HelpCircle,
      questions: [
        {
          question: 'Comment contacter le service client ?',
          answer: 'Par téléphone au +242 81 234 5678, par email à support@bantudelice.com ou via le chat en ligne.',
          tags: ['contact', 'support']
        },
        {
          question: 'Quels sont les horaires de service ?',
          answer: 'Lun-Ven : 8h-18h, Sam : 9h-16h, Dim : 10h-14h. Urgences : 24h/24.',
          tags: ['horaires', 'service']
        },
        {
          question: 'Puis-je porter plainte ?',
          answer: 'Oui, utilisez notre formulaire de contact ou appelez directement notre service client.',
          tags: ['plainte', 'réclamation']
        }
      ]
    }
  ];

  const filteredFaqs = faqData.flatMap(category => 
    category.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Questions fréquentes</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trouvez rapidement les réponses à vos questions les plus courantes
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Rechercher dans les FAQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto">
          {searchQuery ? (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Résultats de recherche
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFaqs.map((faq, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <button
                        className="w-full text-left flex justify-between items-center"
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      >
                        <h3 className="font-medium text-gray-900">{faq.question}</h3>
                        {expandedFaq === index ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      {expandedFaq === index && (
                        <div className="mt-3">
                          <p className="text-gray-600 mb-3">{faq.answer}</p>
                          <div className="flex flex-wrap gap-2">
                            {faq.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {faqData.map((category, categoryIndex) => {
                const Icon = category.icon;
                return (
                  <Card key={categoryIndex} className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-orange-500" />
                        {category.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {category.questions.map((faq, faqIndex) => {
                          const globalIndex = categoryIndex * 3 + faqIndex;
                          return (
                            <div key={faqIndex} className="border rounded-lg p-4">
                              <button
                                className="w-full text-left flex justify-between items-center"
                                onClick={() => setExpandedFaq(expandedFaq === globalIndex ? null : globalIndex)}
                              >
                                <h3 className="font-medium text-gray-900">{faq.question}</h3>
                                {expandedFaq === globalIndex ? (
                                  <ChevronUp className="h-5 w-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-gray-500" />
                                )}
                              </button>
                              {expandedFaq === globalIndex && (
                                <div className="mt-3">
                                  <p className="text-gray-600 mb-3">{faq.answer}</p>
                                  <div className="flex flex-wrap gap-2">
                                    {faq.tags.map((tag, tagIndex) => (
                                      <Badge key={tagIndex} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Vous n'avez pas trouvé la réponse à votre question ?
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="/help" 
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Contacter le support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 