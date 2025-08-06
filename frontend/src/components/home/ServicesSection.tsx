
import React from "react";
import { useNavigate } from "react-router-dom";
import ServiceIcon from "@/components/ui/ServiceIcons";

const services = [
  {
    icon: "restaurant",
    title: "Restauration",
    description: "Explorer les restaurants, commander",
    path: "/delivery",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: "taxi",
    title: "Transport Taxi",
    description: "Réserver un chauffeur",
    path: "/taxi",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: "delivery",
    title: "Livraison Colis",
    description: "Estimer prix, envoyer, suivre",
    path: "/colis",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: "carpool",
    title: "Covoiturage",
    description: "Réserver un trajet, proposer une place",
    path: "/covoiturage",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: "homeServices",
    title: "Services à domicile",
    description: "Plombier, électricien, juridique…",
    path: "/home-services",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: "carRental",
    title: "Location Voiture",
    description: "Réserver une voiture avec ou sans chauffeur",
    path: "/location-voiture",
    color: "from-indigo-500 to-purple-500"
  }
];

export default function ServicesSection() {
  const navigate = useNavigate();

  return (
    <section className="container mx-auto px-4 py-16" aria-labelledby="services-title">
      <h2 id="services-title" className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">
        Nos services
      </h2>
      <p className="text-lg text-white/80 text-center mb-12 max-w-2xl mx-auto">
        Découvrez notre gamme complète de services pour tous vos besoins quotidiens
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
        {services.map((service, index) => (
          <div
            key={index}
            onClick={() => navigate(service.path)}
            onKeyDown={(e) => e.key === 'Enter' && navigate(service.path)}
            className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
            role="listitem"
            tabIndex={0}
            aria-label={`Accéder au service ${service.title}`}
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-center">
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                  <ServiceIcon type={service.icon} className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  {service.description}
                </p>
                <div className={`w-full h-2 rounded-full bg-gradient-to-r ${service.color} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} aria-hidden="true"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
