import React from "react";
import { useNavigate } from "react-router-dom";

const trendingServices = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Plombier disponible",
    description: "Plombier disponible à Brazzaville",
    path: "/home-services",
    badge: "Disponible"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "Offres resto populaires",
    description: "Livraison gratuite aujourd'hui",
    path: "/delivery",
    badge: "Promo"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: "Livraison express",
    description: "Livraison en 30 minutes garantie",
    path: "/delivery",
    badge: "Express"
  }
];

export default function TrendingServicesSection() {
  const navigate = useNavigate();

  return (
    <section className="container mx-auto px-4 py-16" aria-labelledby="trending-title">
      <h2 id="trending-title" className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">
        Services les plus utilisés
      </h2>
      <p className="text-lg text-white/80 text-center mb-12 max-w-2xl mx-auto">
        Découvrez les services tendances et les offres du moment
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="list">
        {trendingServices.map((service, index) => (
          <div
            key={index}
            onClick={() => navigate(service.path)}
            onKeyDown={(e) => e.key === 'Enter' && navigate(service.path)}
            className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
            role="listitem"
            tabIndex={0}
            aria-label={`Accéder au service tendance ${service.title}`}
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 relative">
              <div className="absolute top-4 right-4">
                <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full" aria-label={`Badge: ${service.badge}`}>
                  {service.badge}
                </span>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300 text-white" aria-hidden="true">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-white/80 text-sm">
                  {service.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 