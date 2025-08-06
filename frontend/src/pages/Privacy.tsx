import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BackToHome from '@/components/BackToHome';
import { Shield, Eye, Lock, Users, Globe } from 'lucide-react';

const Privacy: React.FC = () => {
  const sections = [
    {
      title: "1. Collecte des données",
      content: "Nous collectons les informations que vous nous fournissez directement (nom, email, téléphone, adresse) ainsi que les données de navigation et d'utilisation de notre plateforme.",
      icon: unknown
    },
    {
      title: "2. Utilisation des données",
      content: "Vos données sont utilisées pour fournir nos services, améliorer votre expérience, communiquer avec vous et assurer la sécurité de notre plateforme.",
      icon: Users
    },
    {
      title: "3. Partage des données",
      content: "Nous ne vendons jamais vos données personnelles. Nous les partageons uniquement avec les prestataires de services nécessaires et dans le respect de la loi.",
      icon: Globe
    },
    {
      title: "4. Sécurité des données",
      content: "Nous mettons en place des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès non autorisé ou perte.",
      icon: Lock
    },
    {
      title: "5. Vos droits",
      content: "Vous avez le droit d'accéder, de rectifier, de supprimer vos données et de vous opposer à leur traitement. Contactez-nous pour exercer ces droits.",
      icon: Eye
    },
    {
      title: "6. Cookies et traceurs",
      content: "Nous utilisons des cookies pour améliorer votre expérience et analyser l'utilisation de notre site. Vous pouvez désactiver les cookies dans vos paramètres.",
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Bouton retour à l'accueil */}
          <div className="absolute top-4 left-4 z-30">
            <BackToHome variant="icon" />
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 mr-4" />
            <h1 className="text-5xl font-bold">Politique de Confidentialité</h1>
          </div>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline" size="lg" className="backdrop-blur-md bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300">
              <Link to="/cgu">Conditions d'utilisation</Link>
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
            {/* Introduction */}
            <Card className="mb-8 border-green-200 bg-green-50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4">
                  Notre engagement envers votre vie privée
                </h3>
                <p className="text-green-700 leading-relaxed">
                  Chez BantuDelice, nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles. 
                  Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
                </p>
              </CardContent>
            </Card>

            {/* Sections de la politique */}
            <div className="space-y-8">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <Card key={index} className="border-0 shadow-lg backdrop-blur-md bg-white/80 hover:bg-white/90 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                          <Icon className="h-5 w-5 text-white" />
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
                );
              })}
            </div>

            {/* Contact DPO */}
            <Card className="mt-12 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-blue-800 mb-4">
                    Délégué à la Protection des Données
                  </h3>
                  <p className="text-blue-700 mb-6">
                    Pour toute question concernant la protection de vos données personnelles, 
                    contactez notre délégué à la protection des données.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button asChild variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                      <Link to="mailto:dpo@bantudelice.cg">Email DPO</Link>
                    </Button>
                    <Button asChild variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                      <Link to="/contact">Formulaire de contact</Link>
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

export default Privacy; 