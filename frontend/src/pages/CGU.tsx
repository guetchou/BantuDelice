import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BackToHome from '@/components/BackToHome';
import { FileText, Shield, Users, CreditCard, AlertTriangle } from 'lucide-react';

const CGU: React.FC = () => {
  const sections = [
    {
      title: "1. Acceptation des conditions",
      content: "En utilisant les services de BantuDelice, vous acceptez d'être lié par ces conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services."
    },
    {
      title: "2. Description des services",
      content: "BantuDelice propose des services de livraison, transport, covoiturage et services à domicile au Congo. Nos services incluent la mise en relation entre utilisateurs et prestataires de services."
    },
    {
      title: "3. Inscription et compte utilisateur",
      content: "Pour utiliser nos services, vous devez créer un compte en fournissant des informations exactes et à jour. Vous êtes responsable de la confidentialité de vos identifiants de connexion."
    },
    {
      title: "4. Utilisation des services",
      content: "Vous vous engagez à utiliser nos services conformément aux lois en vigueur et à ne pas les utiliser à des fins illégales ou préjudiciables à autrui."
    },
    {
      title: "5. Paiements et facturation",
      content: "Les prix de nos services sont affichés en FCFA. Les paiements sont effectués via notre plateforme sécurisée. Nous nous réservons le droit de modifier nos tarifs avec un préavis de 30 jours."
    },
    {
      title: "6. Responsabilité",
      content: "BantuDelice agit en tant qu'intermédiaire. Nous ne sommes pas responsables des actes ou omissions des prestataires de services ou des utilisateurs de notre plateforme."
    },
    {
      title: "7. Protection des données",
      content: "Nous collectons et traitons vos données personnelles conformément à notre politique de confidentialité et aux lois en vigueur sur la protection des données."
    },
    {
      title: "8. Propriété intellectuelle",
      content: "Tous les droits de propriété intellectuelle relatifs à notre plateforme et à nos services appartiennent à BantuDelice ou à nos partenaires."
    },
    {
      title: "9. Résiliation",
      content: "Nous nous réservons le droit de suspendre ou de résilier votre compte en cas de violation de ces conditions ou pour toute autre raison légitime."
    },
    {
      title: "10. Modifications",
      content: "Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prendront effet dès leur publication sur notre plateforme."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-gray-800 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Bouton retour à l'accueil */}
          <div className="absolute top-4 left-4 z-30">
            <BackToHome variant="icon" />
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <FileText className="h-12 w-12 mr-4" />
            <h1 className="text-5xl font-bold">Conditions Générales d'Utilisation</h1>
          </div>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline" size="lg" className="backdrop-blur-md bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300">
              <Link to="/privacy">Politique de confidentialité</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="backdrop-blur-md bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300">
              <Link to="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Avertissement important */}
            <Card className="mb-8 border-orange-200 bg-orange-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-orange-800 mb-2">
                      Important
                    </h3>
                    <p className="text-orange-700">
                      Veuillez lire attentivement ces conditions avant d'utiliser nos services. 
                      En utilisant BantuDelice, vous acceptez d'être lié par ces conditions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sections des conditions */}
            <div className="space-y-8">
              {sections.map((section, index) => (
                <Card key={index} className="border-0 shadow-lg backdrop-blur-md bg-white/80 hover:bg-white/90 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {section.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact et support */}
            <Card className="mt-12 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-blue-800 mb-4">
                    Questions sur nos conditions ?
                  </h3>
                  <p className="text-blue-700 mb-6">
                    Notre équipe est là pour vous aider à comprendre nos conditions d'utilisation.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button asChild variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                      <Link to="/contact">Contacter le support</Link>
                    </Button>
                    <Button asChild variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                      <Link to="/faq">FAQ</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CGU; 