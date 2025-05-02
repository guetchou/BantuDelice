import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SEO from '@/components/SEO';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import { 
  Wrench, 
  Sparkles, 
  Home, 
  Briefcase, 
  Book, 
  Car, 
  Scissors, 
  Utensils, 
  Palette, 
  Phone, 
  Heart, 
  Building 
} from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  price?: string;
  link: string;
  featured?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, price, link, featured }) => {
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${featured ? 'border-primary' : ''}`}>
      <CardHeader className={`${featured ? 'bg-primary/10' : 'bg-gray-50'}`}>
        <div className="flex justify-between items-center">
          <div className={`p-3 rounded-lg ${featured ? 'bg-primary text-white' : 'bg-white'}`}>
            {icon}
          </div>
          {featured && (
            <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
              Populaire
            </span>
          )}
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <CardDescription className="text-gray-700 min-h-[60px]">{description}</CardDescription>
        {price && (
          <div className="mt-4 font-medium text-gray-900">
            À partir de {price}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={link}>Voir les détails</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const homeServices = [
  {
    title: "Plomberie",
    description: "Réparation et installation de systèmes de plomberie, dépannage urgent.",
    icon: <Wrench size={24} />,
    price: "15 000 XAF",
    link: "/services/plomberie",
    featured: true
  },
  {
    title: "Électricité",
    description: "Installation électrique, réparation, mise aux normes et conseils.",
    icon: <Sparkles size={24} />,
    price: "20 000 XAF",
    link: "/services/electricite"
  },
  {
    title: "Ménage",
    description: "Nettoyage régulier ou ponctuel pour votre domicile ou bureau.",
    icon: <Home size={24} />,
    price: "12 000 XAF",
    link: "/services/menage"
  }
];

const professionalServices = [
  {
    title: "Comptabilité",
    description: "Services comptables pour entreprises et particuliers.",
    icon: <Briefcase size={24} />,
    price: "50 000 XAF",
    link: "/services/comptabilite"
  },
  {
    title: "Assistance juridique",
    description: "Consultation juridique et assistance pour vos démarches.",
    icon: <Book size={24} />,
    price: "35 000 XAF",
    link: "/services/juridique",
    featured: true
  },
  {
    title: "Transport spécialisé",
    description: "Transport de marchandises, déménagement et livraison.",
    icon: <Car size={24} />,
    price: "25 000 XAF",
    link: "/services/transport"
  }
];

const personalServices = [
  {
    title: "Coiffure à domicile",
    description: "Coiffeurs professionnels qui se déplacent chez vous.",
    icon: <Scissors size={24} />,
    price: "15 000 XAF",
    link: "/services/coiffure"
  },
  {
    title: "Chef à domicile",
    description: "Profitez d'un repas gastronomique préparé chez vous.",
    icon: <Utensils size={24} />,
    price: "50 000 XAF",
    link: "/services/chef-domicile",
    featured: true
  },
  {
    title: "Décoration intérieure",
    description: "Conseils et services de décoration pour votre intérieur.",
    icon: <Palette size={24} />,
    price: "45 000 XAF",
    link: "/services/decoration"
  }
];

const Services = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <SEO 
        title="Services professionnels | Buntudelice"
        description="Découvrez nos services professionnels à Kinshasa : plomberie, électricité, ménage, assistance juridique et plus encore."
        keywords="services, professionnels, plomberie, électricité, ménage, juridique, Kinshasa"
      />
      
      <div className="mb-8">
        <Breadcrumb items={[
          { label: 'Accueil', path: '/' },
          { label: 'Services', path: '/services' },
        ]} />
      </div>

      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">Services Professionnels</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Découvrez notre gamme complète de services professionnels de qualité à Kinshasa, réalisés par des experts vérifiés.
        </p>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary to-primary/70 rounded-xl p-8 mb-12 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:w-2/3">
            <h2 className="text-2xl font-bold mb-4">Besoin d'assistance rapide?</h2>
            <p className="mb-4">Nos professionnels sont disponibles pour vous aider immédiatement.</p>
            <div className="flex space-x-4">
              <Button variant="secondary" asChild>
                <Link to="/services/contact">
                  <Phone className="mr-2 h-4 w-4" /> Nous contacter
                </Link>
              </Button>
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary" asChild>
                <Link to="/services/urgent">Demande urgente</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="bg-white rounded-full p-6">
              <Wrench className="h-20 w-20 text-primary" />
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="home" className="mb-12">
        <TabsList className="mb-8 flex flex-wrap justify-center">
          <TabsTrigger value="home" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>Services domestiques</span>
          </TabsTrigger>
          <TabsTrigger value="professional" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span>Services professionnels</span>
          </TabsTrigger>
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span>Services personnels</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span>Services aux entreprises</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="home">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeServices.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="professional">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionalServices.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="personal">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalServices.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="business">
          <div className="text-center py-16">
            <Building className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">Services aux entreprises</h3>
            <p className="text-gray-500 mb-6">
              Nos services aux entreprises seront disponibles prochainement.
            </p>
            <Button variant="outline" asChild>
              <Link to="/contact">Contactez-nous pour plus d'informations</Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Comment ça marche */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-10">Comment ça marche</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 rounded-full p-6 mb-4">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Choisissez un service</h3>
            <p className="text-gray-600">
              Parcourez notre catalogue et sélectionnez le service dont vous avez besoin.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 rounded-full p-6 mb-4">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Réservez un créneau</h3>
            <p className="text-gray-600">
              Choisissez la date et l'heure qui vous conviennent le mieux.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 rounded-full p-6 mb-4">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Le professionnel intervient</h3>
            <p className="text-gray-600">
              Un professionnel qualifié se rend chez vous pour effectuer le service.
            </p>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-gray-100 rounded-xl p-8 text-center mb-12">
        <h2 className="text-2xl font-bold mb-4">Besoin d'un service qui n'est pas listé?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Nous avons un large réseau de professionnels qualifiés dans divers domaines. 
          Contactez-nous pour toute demande spécifique.
        </p>
        <Button asChild>
          <Link to="/contact">Nous contacter</Link>
        </Button>
      </div>
    </div>
  );
};

export default Services;
