import React from "react";
import { Link } from "react-router-dom";
// Header removed - now handled by MainLayout
import { Helmet } from "react-helmet-async";
import {
  HeroSection,
  ServicesSection,
  TrendingServicesSection,
  TestimonialsSection,
  MobileAppSection,
  FeaturedSection,
  // Ajout de HomeMapSection
  HomeMapSection
} from "@/components/home";
import HumanizedTestimonials from "@/components/home/HumanizedTestimonials";
import HumanizedServices from "@/components/home/HumanizedServices";
import ChatBot from "@/components/ChatBot";
import "../styles/hero.css";

export default function Index() {
  return (
    <>
      <Helmet>
        <title>BantuDelice - Livraison, Taxi, Colis, Services au Congo</title>
        <meta name="description" content="BantuDelice : Commandez, déplacez-vous, livrez ou réservez un service en 1 clic. Votre super app tout-en-un au Congo !" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-orange-500 to-blue-900">
        {/* Header removed - now handled by MainLayout */}
        <HeroSection />
        {/* Carte interactive - HomeMapSection */}
        <HomeMapSection />
        <FeaturedSection />
        <HumanizedServices />
        <HumanizedTestimonials />
        <TrendingServicesSection />
        <MobileAppSection />

        {/* ChatBot */}
        <ChatBot />

        {/* Footer */}
        <footer className="bg-black/20 backdrop-blur-md border-t border-white/20 mt-20" role="contentinfo">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Logo et description */}
              <div className="lg:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl" aria-hidden="true">B</span>
                  <span className="font-bold text-xl text-white">BantuDelice</span>
                </div>
                <p className="text-white/80 mb-4">
                  Votre application tout-en-un au Congo. Services de qualité, livraison rapide, transport fiable.
                </p>
                <nav className="flex space-x-4" aria-label="Réseaux sociaux">
                  <button className="text-white/80 hover:text-white transition" aria-label="Facebook">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button className="text-white/80 hover:text-white transition" aria-label="Instagram">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.98-.245-1.297-.49-.317-.245-.49-.49-.49-.98 0-.49.173-.735.49-.98.317-.245.807-.49 1.297-.49s.98.245 1.297.49c.317.245.49.49.49.98 0 .49-.173.735-.49.98-.317.245-.807.49-1.297.49z"/>
                    </svg>
                  </button>
                  <button className="text-white/80 hover:text-white transition" aria-label="TikTok">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </button>
                  <button className="text-white/80 hover:text-white transition" aria-label="YouTube">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </button>
                </nav>
              </div>

              {/* Liens utiles */}
              <nav>
                <h3 className="text-white font-semibold mb-4">Liens utiles</h3>
                <ul className="space-y-2" role="list">
                  <li role="listitem">
                    <Link to="/about" className="text-white/80 hover:text-white transition">À propos</Link>
                  </li>
                  <li role="listitem">
                    <Link to="/cgu" className="text-white/80 hover:text-white transition">CGU</Link>
                  </li>
                  <li role="listitem">
                    <Link to="/privacy" className="text-white/80 hover:text-white transition">Politique de confidentialité</Link>
                  </li>
                  <li role="listitem">
                    <Link to="/help" className="text-white/80 hover:text-white transition">Centre d'aide</Link>
                  </li>
                </ul>
              </nav>

              {/* Contact */}
              <address>
                <h3 className="text-white font-semibold mb-4">Contact</h3>
                <ul className="space-y-2" role="list">
                  <li role="listitem" className="text-white/80 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href="mailto:contact@bantudelice.cg" className="hover:text-white transition">contact@bantudelice.cg</a>
                  </li>
                  <li role="listitem" className="text-white/80 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href="tel:+242061234567" className="hover:text-white transition">+242 06 123 45 67</a>
                  </li>
                  <li role="listitem" className="text-white/80 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    WhatsApp
                  </li>
                  <li role="listitem" className="text-white/80 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Brazzaville, Congo
                  </li>
                </ul>
              </address>

              {/* Langues */}
              <nav>
                <h3 className="text-white font-semibold mb-4">Langues</h3>
                <div className="space-y-2" role="list">
                  <button className="text-white/80 hover:text-white p-0 h-auto flex items-center gap-2" role="listitem">
                    <span className="text-sm">🇫🇷</span> Français
                  </button>
                  <button className="text-white/80 hover:text-white p-0 h-auto flex items-center gap-2" role="listitem">
                    <span className="text-sm">🇬🇧</span> English
                  </button>
                  <button className="text-white/80 hover:text-white p-0 h-auto flex items-center gap-2" role="listitem">
                    <span className="text-sm">🇨🇬</span> Lingala
                  </button>
                </div>
              </nav>
            </div>

            <div className="border-t border-white/20 mt-8 pt-8 text-center">
              <p className="text-white/60">
                &copy; 2024 BantuDelice. Tous droits réservés. | Votre partenaire de confiance au Congo
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
