import React from 'react';
import { Shield, Award, Users } from 'lucide-react';

interface Guarantee {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  image: string;
}

const ColisGuaranteesSection: React.FC = () => {
  const guarantees: Guarantee[] = [
    {
      icon: Shield,
      title: "Garantie de Livraison",
      description: "Remboursement si votre colis n'arrive pas à temps",
      image: "/images/client-satisfait.png"
    },
    {
      icon: Award,
      title: "Service Premium",
      description: "Chauffeurs formés et véhicules entretenus",
      image: "/images/chauffeur-taxi.png"
    },
    {
      icon: Users,
      title: "Support 24/7",
      description: "Équipe disponible pour vous accompagner",
      image: "/images/call-center.jpg"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-700">Garanties</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Votre satisfaction et la sécurité de vos colis sont nos priorités
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {guarantees.map((guarantee, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl overflow-hidden border border-orange-200"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={guarantee.image} 
                  alt={guarantee.title}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center 30%' }}
                />
              </div>
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg mb-4 flex items-center justify-center mx-auto">
                  <guarantee.icon className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{guarantee.title}</h3>
                <p className="text-gray-600">{guarantee.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ColisGuaranteesSection; 