import React from 'react';
import { Clock, MapPin, ShieldCheck } from 'lucide-react';

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  image: string;
}

const ColisFeaturesSection: React.FC = () => {
  const features: Feature[] = [
    {
      icon: Clock,
      title: "Livraison Express",
      description: "Délai garanti de 24h à Brazzaville et 48h dans les autres départements",
      color: "text-orange-600",
      image: "/images/livreur.jpg"
    },
    {
      icon: MapPin,
      title: "Suivi en Temps Réel",
      description: "Localisation GPS précise de votre colis à chaque étape",
      color: "text-blue-600",
      image: "/images/delivery-action.jpg"
    },
    {
      icon: ShieldCheck,
      title: "Assurance Incluse",
      description: "Couverture jusqu'à 500 000 FCFA sans frais supplémentaires",
      color: "text-emerald-600",
      image: "/images/livreur-repas.jpeg"
    }
  ];

  return (
    <section className="py-16 bg-gray-50" role="region" aria-labelledby="features-title">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 id="features-title" className="text-3xl font-bold text-gray-900 mb-4">
            Pourquoi choisir <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-700">notre service</span> ?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Une solution intégrée avec la Poste Congo pour des envois sans tracas
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6" role="list" aria-label="Fonctionnalités du service colis">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1"
              role="listitem"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={feature.image} 
                  alt={`Illustration pour ${feature.title}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  style={{ objectPosition: 'center 20%' }}
                />
              </div>
              <div className="p-6">
                <div className={`w-12 h-12 ${feature.color.replace('text-', 'bg-').replace('-600', '-100')} rounded-lg mb-4 flex items-center justify-center`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ColisFeaturesSection; 