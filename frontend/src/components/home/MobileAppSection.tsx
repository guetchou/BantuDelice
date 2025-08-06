import React from "react";
import { Button } from "@/components/ui/button";

export default function MobileAppSection() {
  return (
    <section className="container mx-auto px-4 py-16" aria-labelledby="mobile-app-title">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-center lg:text-left">
            <h2 id="mobile-app-title" className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Téléchargez notre application mobile
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Accédez à tous nos services depuis votre smartphone.
              Commandez, réservez et suivez vos livraisons en temps réel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start" role="group" aria-label="Télécharger l'application">
              <Button className="bg-black text-white hover:bg-gray-800 font-semibold py-3 px-6 rounded-xl">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                App Store
              </Button>
              <Button className="bg-black text-white hover:bg-gray-800 font-semibold py-3 px-6 rounded-xl">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                Google Play
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              {/* Mockup téléphone */}
              <div className="w-64 h-96 bg-gray-900 rounded-3xl p-2 shadow-2xl" aria-hidden="true">
                <div className="w-full h-full bg-gradient-to-br from-orange-500 to-blue-600 rounded-2xl p-4 flex flex-col items-center justify-center">
                  <svg className="w-16 h-16 text-white mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <div className="text-white text-center">
                    <div className="text-2xl font-bold mb-2">BantuDelice</div>
                    <div className="text-sm opacity-80">Votre super app</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 