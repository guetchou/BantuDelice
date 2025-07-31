
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PhotoGallery from '@/components/PhotoGallery';
import BackToHome from '@/components/BackToHome';
import { 
  Users, 
  Award, 
  Globe, 
  Heart, 
  Target, 
  TrendingUp, 
  Shield, 
  Star,
  MapPin,
  Phone,
  Mail,
  Clock
} from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { label: 'Clients satisfaits', value: '50,000+', icon: Users },
    { label: 'Villes desservies', value: '25+', icon: MapPin },
    { label: 'Livraisons/jour', value: '1,200+', icon: TrendingUp },
    { label: 'Années d\'expérience', value: '8+', icon: Award }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Service client exceptionnel',
      description: 'Notre équipe dédiée est disponible 24h/24 pour vous accompagner'
    },
    {
      icon: Shield,
      title: 'Sécurité garantie',
      description: 'Vos colis sont assurés et suivis à chaque étape'
    },
    {
      icon: Target,
      title: 'Innovation continue',
      description: 'Nous développons constamment de nouvelles solutions'
    },
    {
      icon: Globe,
      title: 'Impact social',
      description: 'Nous contribuons au développement économique local'
    }
  ];

  const team = [
    {
      name: 'Jean-Pierre Mboungou',
      role: 'PDG & Fondateur',
      image: '/team/ceo.jpg',
      description: 'Visionnaire passionné par l\'innovation technologique'
    },
    {
      name: 'Marie-Louise Nzamba',
      role: 'Directrice Opérationnelle',
      image: '/team/coo.jpg',
      description: 'Experte en logistique et gestion des opérations'
    },
    {
      name: 'David Kimbembe',
      role: 'Directeur Technique',
      image: '/team/cto.jpg',
      description: 'Spécialiste en développement et architecture système'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      {/* Hero Section avec effet glass */}
      <section className="relative py-20 bg-gradient-to-r from-orange-600 to-pink-600 text-white overflow-hidden">
        {/* Arrière-plan avec image */}
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/90 to-pink-600/90"></div>
        
        {/* Image d'arrière-plan */}
        <div className="absolute inset-0">
          <img 
            src="/images/thedrop24BG.jpg" 
            alt="BantuDelice Background" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Bouton retour à l'accueil */}
          <div className="absolute top-4 left-4 z-30">
            <BackToHome variant="icon" />
          </div>
          
          <h1 className="text-5xl font-bold mb-6">À propos de BantuDelice</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Leader de la livraison de colis au Congo, nous connectons les personnes 
            et les entreprises avec des solutions innovantes et fiables.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline" size="lg" className="backdrop-blur-md bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300">
              <Link to="/gallery">Voir notre galerie</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="backdrop-blur-md bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300">
              <Link to="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Statistiques avec effet glass */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 to-pink-100/50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-xl backdrop-blur-md bg-white/70 hover:bg-white/90 transition-all duration-300 group">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Notre histoire */}
      <section className="py-16 bg-white relative overflow-hidden">
        {/* Illustration de fond */}
        <div className="hidden md:block absolute inset-0 z-0 pointer-events-none">
          <img 
            src="/images/illustrations/urban-scene.jpg" 
            alt="Scène urbaine Congo" 
            className="w-full h-full object-cover opacity-10"
            loading="lazy"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre Histoire</h2>
              <p className="text-lg text-gray-600">
                Découvrez comment BantuDelice est devenu le leader de la livraison au Congo
              </p>
            </div>
            
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2">
                  <div className="bg-orange-100 rounded-lg p-8">
                    <h3 className="text-2xl font-bold text-orange-700 mb-4">2016 - Les débuts</h3>
                    <p className="text-gray-700">
                      Fondée par Jean-Pierre Mboungou, BantuDelice démarre avec une simple 
                      idée : faciliter les livraisons dans la région de Brazzaville. 
                      L'entreprise commence avec 5 employés et 2 véhicules.
                    </p>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg p-8 text-white">
                    <h3 className="text-2xl font-bold mb-4">2020 - L'expansion</h3>
                    <p>
                      BantuDelice étend ses services à 10 nouvelles villes et lance 
                      sa plateforme numérique. L'entreprise emploie maintenant 150 personnes 
                      et gère plus de 500 livraisons par jour.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                <div className="md:w-1/2">
                  <div className="bg-yellow-100 rounded-lg p-8">
                    <h3 className="text-2xl font-bold text-yellow-700 mb-4">2023 - L'innovation</h3>
                    <p className="text-gray-700">
                      Lancement de l'IA prédictive et des drones de livraison. 
                      BantuDelice devient la première entreprise de livraison 
                      à utiliser l'intelligence artificielle en Afrique centrale.
                    </p>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg p-8 text-white">
                    <h3 className="text-2xl font-bold mb-4">2024 - Le leadership</h3>
                    <p>
                      BantuDelice est maintenant le leader incontesté avec 50,000+ clients, 
                      25+ villes desservies et une technologie de pointe. 
                      L'entreprise continue d'innover pour servir mieux.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Valeurs</h2>
            <p className="text-lg text-gray-600">
              Les principes qui guident nos actions au quotidien
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <Icon className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Notre équipe avec photos */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre Équipe</h2>
            <p className="text-lg text-gray-600">
              Des experts passionnés qui font de BantuDelice une entreprise d'excellence
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="text-center border-0 shadow-xl backdrop-blur-md bg-white/80 hover:bg-white/90 transition-all duration-300 group">
                <CardContent className="pt-6">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-200 group-hover:border-orange-400 transition-colors duration-300">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback vers les initiales si l'image ne charge pas
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center" style={{display: 'none'}}>
                        <span className="text-3xl font-bold text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <Badge variant="outline" className="mb-3 bg-orange-50 text-orange-700 border-orange-200">{member.role}</Badge>
                  <p className="text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Galerie Photo */}
      <PhotoGallery />

      {/* Contact avec effet glass */}
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
          <h2 className="text-4xl font-bold mb-6">Prêt à nous rejoindre ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Découvrez comment BantuDelice peut transformer vos livraisons 
            et contribuer au succès de votre entreprise.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline" size="lg" className="backdrop-blur-md bg-white/20 border-white/40 text-white hover:bg-white/30 hover:border-white/60 transition-all duration-300">
              <Link to="/contact">Nous contacter</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="backdrop-blur-md bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300">
              <Link to="/services">Découvrir nos services</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
