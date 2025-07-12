
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ServicesSection = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 'food-delivery',
      title: 'Livraison de Nourriture',
      description: 'Commandez vos plats préférés et faites-vous livrer rapidement',
      icon: '🍕',
      color: 'bg-orange-500',
      path: '/order'
    },
    {
      id: 'taxi',
      title: 'Service de Taxi',
      description: 'Réservez un taxi pour vos déplacements en ville',
      icon: '🚕',
      color: 'bg-yellow-500',
      path: '/delivery'
    },
    {
      id: 'colis',
      title: 'Livraison de Colis',
      description: 'Envoyez et recevez vos colis en toute sécurité',
      icon: '📦',
      color: 'bg-blue-500',
      path: '/services/colis'
    },
    {
      id: 'covoiturage',
      title: 'Covoiturage',
      description: 'Partagez vos trajets et économisez sur vos déplacements',
      icon: '🚗',
      color: 'bg-green-500',
      path: '/delivery'
    }
  ];

  return (
    <section id="services" className="py-16 bg-white/5 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Nos Services</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Découvrez tous nos services pour faciliter votre quotidien à Brazzaville
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => navigate(service.path)}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 cursor-pointer hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 group"
            >
              <div className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
              <p className="text-white/70 text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
