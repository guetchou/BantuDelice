import React, { useState } from "react";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import { 
  Users, 
  Truck, 
  Package, 
  Coffee, 
  Home, 
  Heart,
  Star,
  MapPin,
  Clock,
  Phone,
  Car,
  CreditCard
} from "lucide-react";

const images = [
  {
    src: "/images/thedrop24BG.jpg",
    title: "Commandez vos repas en ligne",
    description: "Commandez vos repas en ligne et profitez de nos services de livraison",
    category: "Restaurant",
    icon: Star
  },
  {
    src: "/images/agent-centre-appel.png",
    title: "Notre équipe à votre service",
    description: "Notre équipe dédiée disponible 24h/24 pour vous accompagner",
    category: "Service Client",
    icon: Star
  },
  {
    src: "/images/chauffeur-taxi.png",
    title: "Réservez votre taxi",
    description: "Nos chauffeurs professionnels à votre service",
    category: "Livraison",
    icon: Truck
  },
  {
    src: "/images/livreuse-repas.png",
    title: "Livraison Colis",
    description: "Services de livraison de colis",
    category: "Livraison",
    icon: Coffee
  },
  {
    src: "/images/covoiturage.jpg",
    title: "Covoiturage",
    description: "Nos services de covoiturage",
    category: "Covoiturage",
    icon: Car
  },
  {
    src: "/images/nos-services.jpg",
    title: "Nos services à domicile", 
    description: "Nos services à domicile de qualité",
    category: "Livraison",
    icon: Home
  },
  {
    src: "/images/client-satisfait.png",
    title: "Client satisfait",
    description: "Votre satisfaction est notre priorité absolue",
    category: "Témoignage",
    icon: Heart
  },
  {
    src: "/images/mtn-mobile-money.jpg",
    title: "Paiement Mobile Money",
    description: "Paiement Mobile Money pour vos commandes et réservations",
    category: "Paiement",
    icon: CreditCard
  },
  {
    src: "/images/airtel-money.jpg",
    title: "Paiement Airtel Money",
    description: "Paiement Airtel Money pour vos commandes et réservations",
    category: "Paiement",
    icon: CreditCard
  },
 
];

const categories = [
  "Tous",
  "Restaurant",
  "Service Client",
  "Livraison",
  "Covoiturage",
  "Témoignage",
  "Paiement"
];

export default function PhotoGallery() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const filteredImages = selectedCategory === "Tous" 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="px-6 py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Galerie BantuDelice
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez notre équipe passionnée, nos services en action et les moments 
            qui font de BantuDelice une entreprise humaine et proche de ses clients.
          </p>
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grille de photos */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredImages.map((img, i) => {
            const Icon = img.icon;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.03,
                  transition: { duration: 0.2 }
                }}
                onClick={() => {
                  setIndex(images.findIndex(image => image.src === img.src));
                  setOpen(true);
                }}
                className="group cursor-pointer overflow-hidden rounded-2xl shadow-lg bg-white hover:shadow-2xl transition-all duration-300"
              >
                {/* Image avec overlay */}
                <div className="relative overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full h-64 object-cover"
                    loading="lazy"
                  />
                  
                  {/* Overlay au hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-5 w-5" />
                        <span className="text-sm font-medium">{img.category}</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{img.title}</h3>
                      <p className="text-sm opacity-90">{img.description}</p>
                    </div>
                  </div>
                </div>

                {/* Informations sous l'image */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4 text-orange-500" />
                    <span className="text-xs font-medium text-orange-600">{img.category}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{img.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{img.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Message si aucune image dans la catégorie */}
        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune photo dans cette catégorie
            </h3>
            <p className="text-gray-600">
              Nous ajoutons régulièrement de nouvelles photos. Revenez bientôt !
            </p>
          </div>
        )}

        {/* Lightbox */}
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={index}
          slides={images}
          plugins={[Captions]}
          captions={{ 
            descriptionTextAlign: "center",
            descriptionMaxLines: 3
          }}
          carousel={{
            finite: true,
            preload: 2
          }}
          animation={{
            fade: 300,
            swipe: 300
          }}
          render={{
            buttonPrev: images.length <= 1 ? () => null : undefined,
            buttonNext: images.length <= 1 ? () => null : undefined,
          }}
        />
      </div>
    </section>
  );
} 