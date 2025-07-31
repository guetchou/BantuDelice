import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PhotoGallery from '@/components/PhotoGallery';
import BackToHome from '@/components/BackToHome';
import { 
  Camera, 
  Users, 
  Heart, 
  Star,
  ArrowLeft,
  Download,
  Share2
} from 'lucide-react';

const Gallery: React.FC = () => {
  const stats = [
    { label: 'Photos partagées', value: '150+', icon: Camera },
    { label: 'Membres d\'équipe', value: '45+', icon: Users },
    { label: 'Clients satisfaits', value: '50K+', icon: Heart },
    { label: 'Événements capturés', value: '25+', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section avec effet glass */}
      <section className="relative py-20 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 text-white overflow-hidden">
        {/* Arrière-plan avec image */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <img 
            src="/images/thedrop24BG.jpg" 
            alt="Background" 
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Bouton retour à l'accueil */}
          <div className="absolute top-4 left-4 z-30">
            <BackToHome variant="icon" />
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <Camera className="h-12 w-12 mr-4" />
            <h1 className="text-5xl font-bold">Galerie BantuDelice</h1>
          </div>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Découvrez notre équipe en action, nos moments de partage et l'humanité 
            qui fait de BantuDelice une entreprise unique au Congo.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline" size="lg" className="backdrop-blur-md bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300">
              <Link to="/about">
                <ArrowLeft className="h-4 w-4 mr-2" />
                À propos
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="backdrop-blur-md bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300">
              <Link to="/contact">
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-lg bg-white">
                  <CardContent className="pt-6">
                    <Icon className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Galerie Photo */}
      <PhotoGallery />

      {/* Section Témoignages */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Témoignages en Images
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Chaque photo raconte une histoire - celle de notre engagement 
              envers l'excellence et la satisfaction client.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  Service Client
                </h3>
                <p className="text-gray-600 text-center">
                  "Notre équipe dédiée est disponible 24h/24 pour accompagner 
                  chaque client avec professionnalisme et bienveillance."
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  Excellence
                </h3>
                <p className="text-gray-600 text-center">
                  "Nous visons l'excellence dans chaque livraison, 
                  chaque interaction et chaque service proposé."
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  Équipe Unie
                </h3>
                <p className="text-gray-600 text-center">
                  "Une équipe soudée et passionnée qui travaille ensemble 
                  pour offrir le meilleur service possible."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action avec effet glass */}
      <section className="relative py-16 bg-gradient-to-r from-orange-600 to-pink-600 text-white overflow-hidden">
        {/* Arrière-plan avec image */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <img 
            src="/images/client-satisfait.png" 
            alt="Client satisfait" 
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">
            Rejoignez l'Aventure BantuDelice
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Découvrez nos opportunités de carrière et faites partie 
            d'une équipe qui transforme la logistique au Congo.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline" size="lg" className="backdrop-blur-md bg-white/20 border-white/40 text-white hover:bg-white/30 hover:border-white/60 transition-all duration-300">
              <Link to="/careers">Nos offres d'emploi</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="backdrop-blur-md bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300">
              <Link to="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery; 