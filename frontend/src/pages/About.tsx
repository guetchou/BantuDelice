
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Award, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Package, 
  UserCheck, 
  Shield, 
  Globe, 
  ThumbsUp 
} from 'lucide-react';
import SEO from '@/components/SEO';
import Breadcrumb from '@/components/navigation/Breadcrumb';

const About = () => {
  const teamMembers = [
    {
      name: "Laurent Durand",
      title: "Fondateur & CEO",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=3&w=300&h=300&q=80",
      bio: "Entrepreneur passionné par l'innovation technologique et l'amélioration des services en Afrique."
    },
    {
      name: "Marie Kamara",
      title: "Directrice des Opérations",
      image: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=3&w=300&h=300&q=80",
      bio: "Experte en logistique avec 10 ans d'expérience dans l'optimisation des chaînes d'approvisionnement."
    },
    {
      name: "Jean Mbeki",
      title: "Responsable Technologie",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=3&w=300&h=300&q=80",
      bio: "Ingénieur logiciel spécialisé dans le développement d'applications mobiles et de solutions innovantes."
    }
  ];

  const values = [
    {
      title: "Qualité",
      description: "Nous nous engageons à offrir des services et produits de la plus haute qualité.",
      icon: <Award className="h-8 w-8 text-primary" />
    },
    {
      title: "Innovation",
      description: "Nous sommes constamment à la recherche de nouvelles façons d'améliorer nos services.",
      icon: <Globe className="h-8 w-8 text-primary" />
    },
    {
      title: "Confiance",
      description: "Nous bâtissons des relations durables basées sur la confiance et la transparence.",
      icon: <Shield className="h-8 w-8 text-primary" />
    },
    {
      title: "Excellence",
      description: "Nous visons l'excellence dans tous les aspects de notre entreprise.",
      icon: <ThumbsUp className="h-8 w-8 text-primary" />
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO 
        title="À propos de Buntudelice | Notre histoire et nos valeurs"
        description="Découvrez l'histoire de Buntudelice, notre mission et nos valeurs. Nous sommes dédiés à fournir des services de qualité à Brazzaville et dans toute la RDC."
        keywords="à propos, Buntudelice, histoire, mission, valeurs, Brazzaville, RDC"
      />
      
      <div className="mb-8">
        <Breadcrumb items={[
          { label: 'Accueil', path: '/' },
          { label: 'À propos', path: '/about' },
        ]} />
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl p-8 mb-16 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <h1 className="text-4xl font-bold mb-4">À propos de Buntudelice</h1>
          <p className="text-lg mb-6">
            Fondé en 2023, Buntudelice est une plateforme de services tout-en-un dédiée à simplifier le quotidien 
            des habitants de Brazzaville et de toute la République Démocratique du Congo.
          </p>
          <Button asChild>
            <Link to="/contact">Contactez-nous</Link>
          </Button>
        </div>
        <div className="lg:w-1/2 flex justify-center">
          <img 
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80" 
            alt="Team Buntudelice" 
            className="rounded-lg shadow-lg" 
          />
        </div>
      </div>

      {/* Our Mission */}
      <div className="mb-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Notre Mission</h2>
        <p className="text-xl max-w-3xl mx-auto">
          Notre mission est de rendre les services essentiels accessibles, abordables et fiables pour tous les Congolais, 
          en utilisant la technologie pour connecter les clients avec des prestataires de qualité.
        </p>
      </div>

      {/* Our Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-10 text-center">Nos Valeurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index}>
              <CardContent className="pt-6 text-center">
                <div className="mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Our Story */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Notre Histoire</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="prose max-w-none">
            <p>
              L'idée de Buntudelice est née d'un constat simple : dans les grandes villes africaines comme Brazzaville, 
              trouver des services fiables et de qualité peut être un véritable défi. Notre fondateur, Laurent Durand, 
              a vécu cette réalité et a décidé de créer une solution.
            </p>
            <p>
              Après des mois de recherche et de développement, Buntudelice a été lancé en 2023 avec une vision claire : 
              devenir la plateforme de référence pour tous les services du quotidien en RDC, en mettant la technologie au 
              service de l'amélioration de la vie quotidienne.
            </p>
            <p>
              Depuis, notre équipe s'est agrandie, notre offre s'est diversifiée, et nous continuons à innover pour 
              répondre aux besoins spécifiques de nos utilisateurs. Notre engagement reste le même : offrir un service 
              de qualité, fiable et accessible à tous.
            </p>
          </div>
        </div>
      </div>

      {/* The Team */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-10 text-center">Notre Équipe</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold mb-1">{member.name}</h3>
              <p className="text-primary mb-3">{member.title}</p>
              <p className="text-gray-600">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="mb-16 bg-gray-50 p-8 rounded-xl">
        <h2 className="text-3xl font-bold mb-10 text-center">Pourquoi Nous Choisir</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex items-start">
            <div className="mr-4 mt-1">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Service Rapide</h3>
              <p className="text-gray-600">
                Notre plateforme permet de connecter rapidement les clients avec les prestataires de services.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="mr-4 mt-1">
              <UserCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Prestataires Vérifiés</h3>
              <p className="text-gray-600">
                Tous nos partenaires sont rigoureusement sélectionnés et vérifiés pour garantir un service de qualité.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="mr-4 mt-1">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Services Variés</h3>
              <p className="text-gray-600">
                De la livraison de repas aux services professionnels, nous offrons une large gamme de solutions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-8">Contactez-nous</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center">
            <div className="mb-4 bg-primary/10 p-4 rounded-full">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Adresse</h3>
            <p className="text-gray-600">123 Avenue du Commerce, Gombe, Brazzaville, RDC</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-4 bg-primary/10 p-4 rounded-full">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Téléphone</h3>
            <p className="text-gray-600">+242 81 234 5678</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-4 bg-primary/10 p-4 rounded-full">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Email</h3>
            <p className="text-gray-600">contact@buntudelice.com</p>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-primary text-white rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Rejoignez la communauté Buntudelice</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Que vous soyez à la recherche de services ou que vous souhaitiez devenir partenaire,
          nous serions ravis de vous accueillir dans notre communauté en pleine croissance.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="secondary" asChild>
            <Link to="/auth/register">S'inscrire</Link>
          </Button>
          <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary" asChild>
            <Link to="/partners">Devenir partenaire</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;
