import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  AlertTriangle, 
  MessageCircle, 
  PhoneCall, 
  HelpCircle, 
  Mail,
  Clock,
  Shield,
  Users
} from 'lucide-react';

interface SupportOption {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  link: string;
  color: string;
  bgColor: string;
  responseTime: string;
}

const ColisSupportSection: React.FC = () => {
  const supportOptions: SupportOption[] = [
    {
      title: "Formulaire d'Expédition",
      description: "Expédiez votre colis en quelques étapes simples",
      icon: FileText,
      link: "/colis/expedition",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      responseTime: "Immédiat"
    },
    {
      title: "Réclamation",
      description: "Signalez un problème avec votre livraison",
      icon: AlertTriangle,
      link: "/colis/reclamation",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      responseTime: "24h"
    },
    {
      title: "Plainte",
      description: "Déposez une plainte formelle",
      icon: AlertTriangle,
      link: "/colis/plainte",
      color: "text-red-600",
      bgColor: "bg-red-100",
      responseTime: "48h"
    },
    {
      title: "Support Client",
      description: "Obtenez de l'aide en ligne",
      icon: HelpCircle,
      link: "/colis/support",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      responseTime: "2h"
    },
    {
      title: "Nous Contacter",
      description: "Contactez notre équipe directement",
      icon: PhoneCall,
      link: "/contact",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      responseTime: "1h"
    },
    {
      title: "FAQ",
      description: "Questions fréquemment posées",
      icon: MessageCircle,
      link: "/colis/faq",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      responseTime: "Immédiat"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-700">Support & Assistance</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nous sommes là pour vous accompagner à chaque étape de votre expérience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {supportOptions.map((option, index) => (
            <Card key={index} className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 ${option.bgColor} rounded-lg mb-4 flex items-center justify-center`}>
                  <option.icon className={`h-6 w-6 ${option.color}`} />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                  {option.title}
                </CardTitle>
                <p className="text-gray-600 text-sm">
                  {option.description}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>Réponse : {option.responseTime}</span>
                  </div>
                </div>
                <Link to={option.link}>
                  <Button 
                    className={`w-full ${option.color.replace('text-', 'bg-').replace('-600', '-600')} hover:${option.color.replace('text-', 'bg-').replace('-600', '-700')} text-white`}
                  >
                    <span className="flex items-center gap-2">
                      Accéder
                      <FileText className="h-4 w-4" />
                    </span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Informations de contact rapide */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhoneCall className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Téléphone</h3>
              <p className="text-gray-600 mb-2">+242 06 XXX XXX</p>
              <p className="text-sm text-gray-500">Lun-Ven: 8h-18h</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 mb-2">support@bantudelice.cg</p>
              <p className="text-sm text-gray-500">Réponse sous 24h</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Équipe Support</h3>
              <p className="text-gray-600 mb-2">Professionnels dédiés</p>
              <p className="text-sm text-gray-500">7j/7 disponible</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ColisSupportSection; 