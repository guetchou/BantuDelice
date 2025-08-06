import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular: boolean;
  color: string;
  image: string;
}

const ColisPricingSection: React.FC = () => {
  const pricing: PricingPlan[] = [
    {
      name: "Standard",
      price: "2 500 FCFA",
      description: "Pour les colis non urgents",
      features: ["3-5 jours", "Suivi basic", "Jusqu'à 5kg"],
      popular: false,
      color: "from-gray-100 to-gray-50",
      image: "/images/bg-colis.jpeg"
    },
    {
      name: "Express",
      price: "5 000 FCFA",
      description: "Livraison prioritaire",
      features: ["24-48h", "Suivi GPS", "Jusqu'à 10kg", "Assurance incluse"],
      popular: true,
      color: "from-orange-50 to-amber-50",
      image: "/images/bg-colis2.jpeg"
    },
    {
      name: "Pro",
      price: "8 000 FCFA",
      description: "Pour professionnels",
      features: ["Livraison avant 12h", "Emballage offert", "Jusqu'à 25kg", "Assurance premium"],
      popular: false,
      color: "from-gray-100 to-gray-50",
      image: "/images/bg-colis3.jpeg"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-700">Offres Tarifaires</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choisissez la formule qui correspond à vos besoins
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricing.map((plan, index) => (
            <div 
              key={index}
              className={`relative rounded-xl overflow-hidden border-2 ${plan.popular ? 'border-orange-300 bg-gradient-to-b from-orange-50 to-amber-50 shadow-lg' : 'border-gray-200 bg-white'} transition-all hover:shadow-md`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-600 to-amber-700 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md z-10">
                  Le plus choisi
                </div>
              )}
              <div className="h-48 overflow-hidden">
                <img 
                  src={plan.image} 
                  alt={plan.name}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center 30%' }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="text-4xl font-bold text-orange-600 mb-6">{plan.price}</div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <Check className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/colis/expedition">
                  <Button 
                    size="lg"
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800' : 'bg-gray-800 hover:bg-gray-900'} text-white`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      Choisir cette option
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ColisPricingSection; 