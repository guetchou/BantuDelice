import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight, PhoneCall, FileText, AlertTriangle, MessageCircle } from 'lucide-react';

const ColisCTASection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-orange-500 to-pink-500 relative overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="/images/team-celebrating.jpg" 
          alt="Équipe de livraison"
          className="w-full h-full object-cover opacity-20"
          style={{ objectPosition: 'center 30%' }}
        />
      </div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à expédier votre premier colis ?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Rejoignez les milliers de clients qui nous font confiance pour leurs livraisons
          </p>
          
          {/* Boutons principaux */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/colis/expedition">
              <Button 
                size="lg" 
                className="bg-white text-orange-600 hover:bg-gray-100 shadow-lg group"
              >
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Formulaire d'expédition
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 hover:text-white"
              >
                <span className="flex items-center gap-2">
                  <PhoneCall className="h-4 w-4" />
                  Nous contacter
                </span>
              </Button>
            </Link>
          </div>

          {/* Liens de support et assistance */}
          <div className="border-t border-white/20 pt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Besoin d'aide ?</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/colis/reclamation">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Déposer une réclamation
                </Button>
              </Link>
              <Link to="/colis/plainte">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Déposer une plainte
                </Button>
              </Link>
              <Link to="/colis/support">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Support client
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ColisCTASection; 