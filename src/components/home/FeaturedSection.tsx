import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Rocket,
  ShieldCheck,
  Sparkles,
  Clock,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const FeaturedSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselSlides = [
    {
      image: "/images/delivery-action.jpg",
      title: "Service Express 90min",
      subtitle: "Disponible dans tout Brazzaville",
      badge: "Nouveau",
      icon: Clock,
      color: "text-orange-300"
    },
    {
      image: "/images/call-center.jpg",
      title: "Call Center 24/7",
      subtitle: "Commandez par téléphone, SMS, WhatsApp",
      badge: "Disponible",
      icon: Sparkles,
      color: "text-blue-300"
    },
    {
      image: "/images/chauffeur-taxi.png",
      title: "Partenariat MTN Money",
      subtitle: "Paiement mobile sécurisé",
      badge: "Partenaire",
      icon: ShieldCheck,
      color: "text-green-300"
    }
  ];

  const featuredNews = [
    {
      icon: Rocket,
      title: "Nouveau : Livraison Express 90min",
      description: "Service prioritaire disponible dans tout Brazzaville",
      badge: "Nouveau",
      color: "from-orange-100 to-orange-50 text-orange-500"
    },
    {
      icon: ShieldCheck,
      title: "Partenariat avec MTN Money",
      description: "Paiement mobile sécurisé maintenant disponible",
      badge: "Partenaire",
      color: "from-blue-100 to-blue-50 text-blue-500"
    },
    {
      icon: Sparkles,
      title: "Service Call Center 24/7",
      description: "Commandez par téléphone, SMS ou WhatsApp",
      badge: "Disponible",
      color: "from-purple-100 to-purple-50 text-purple-500"
    }
  ];

  // Auto-rotation du carrousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000); // Change toutes les 5 secondes

    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Fond gradient animé */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-purple-50 opacity-90"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/dot-pattern.svg')] bg-[size:40px] opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Colonne texte */}
          <div className="lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>Actualités & Nouveautés</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
                À la Une
              </span><br />
              Découvrez nos dernières nouveautés
            </h2>

            <p className="text-xl text-gray-600">
              Restez informé des nouveaux services, partenariats et améliorations de BantuDelice pour une expérience toujours plus exceptionnelle.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/services" className="flex items-center gap-2">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-lg transition-all">
                  Découvrir nos services
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              
              <Link to="/help" className="flex items-center gap-2">
                <Button size="lg" variant="outline" className="border-gray-300 hover:bg-white/90">
                  En savoir plus
                </Button>
              </Link>
            </div>
          </div>

          {/* Colonne visuelle - Carrousel */}
          <div className="lg:w-1/2 relative">
            {/* Carrousel principal */}
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 transform perspective-1000 rotate-y-6 hover:rotate-y-3 transition-all duration-500">
              <div className="relative h-80 overflow-hidden">
                {carouselSlides.map((slide, index) => {
                  const Icon = slide.icon;
                  return (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                        index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                      }`}
                    >
                      <img 
                        src={slide.image} 
                        alt={slide.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      
                      {/* Badge dynamique */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md flex items-center gap-1 text-sm font-medium">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>{slide.badge.toUpperCase()}</span>
                      </div>
                      
                      {/* Overlay info */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className={`h-5 w-5 ${slide.color}`} />
                          <span className="font-bold">{slide.badge}</span>
                        </div>
                        <h3 className="text-xl font-bold">{slide.title}</h3>
                        <p className="text-sm text-white/80">{slide.subtitle}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Contrôles du carrousel */}
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all z-10"
                aria-label="Slide précédent"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all z-10"
                aria-label="Slide suivant"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>

              {/* Indicateurs de navigation */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {carouselSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
                    }`}
                    aria-label={`Aller au slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Éléments flottants décoratifs */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-orange-500/10 rounded-full blur-xl"></div>
          </div>
        </div>

        {/* Actualités en bas */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {featuredNews.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${item.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  {item.badge && (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Animation de particules */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-orange-500/10"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

    </section>
  );
};

export default FeaturedSection; 