import React from "react";
import { useNavigate } from "react-router-dom";
import Icons from "../components/ui/IconLibrary";

const transportServices = [
  { name: "Taxi", description: "Réservation de taxi en ligne", path: "/taxi", icon: <Icons.taxi className="w-8 h-8" /> },
  { name: "Covoiturage", description: "Partage de trajets", path: "/covoiturage", icon: <Icons.car className="w-8 h-8" /> },
  { name: "Location Voiture", description: "Location de véhicules", path: "/location-voiture", icon: <Icons.car className="w-8 h-8" /> },
];

const deliveryServices = [
  { name: "Livraison Repas", description: "Livraison de repas à domicile", path: "/delivery", icon: <Icons.pizza className="w-8 h-8" /> },
  { name: "Colis", description: "Expédition et suivi de colis", path: "/colis", icon: <Icons.package className="w-8 h-8" /> },
];

const lifestyleServices = [
  { name: "Restaurant", description: "Réservation de restaurants", path: "/restaurant", icon: <Icons.restaurant className="w-8 h-8" /> },
  { name: "Hôtel", description: "Réservation d'hôtels", path: "/hotel", icon: <Icons.hotel className="w-8 h-8" /> },
  { name: "Shopping", description: "Boutiques en ligne", path: "/shopping", icon: <Icons.shopping className="w-8 h-8" /> },
];

const homeServices = [
  { name: "Services à domicile", description: "Plombier, électricien, etc.", path: "/home-services", icon: <Icons.wrench className="w-8 h-8" /> },
];

export default function Services() {
  const navigate = useNavigate();

  const ServiceCard = ({ service }: { service: unknown }) => (
    <div
      onClick={() => navigate(service.path)}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex items-center mb-4">
        <div className="text-blue-600 mr-3">
          {service.icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
      </div>
      <p className="text-gray-600">{service.description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Nos Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez notre gamme complète de services pour tous vos besoins quotidiens
          </p>
        </div>

        {/* Transport Services */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Transport</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {transportServices.map((service) => (
              <ServiceCard key={service.name} service={service} />
            ))}
          </div>
        </div>

        {/* Delivery Services */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Livraison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deliveryServices.map((service) => (
              <ServiceCard key={service.name} service={service} />
            ))}
          </div>
        </div>

        {/* Lifestyle Services */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Lifestyle</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lifestyleServices.map((service) => (
              <ServiceCard key={service.name} service={service} />
            ))}
          </div>
        </div>

        {/* Home Services */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Services à domicile</h2>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {homeServices.map((service) => (
              <ServiceCard key={service.name} service={service} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
