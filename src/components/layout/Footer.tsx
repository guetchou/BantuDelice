
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
      
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-green-500/10 animate-gradient-x" />

      <div className="container relative mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              À propos de nous
            </h3>
            <p className="text-gray-400">
              EazyCongo est votre partenaire de confiance pour la livraison de repas
              congolais authentiques et services de qualité à Brazzaville.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Contact
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin className="h-4 w-4 text-green-400" />
                <span>Brazzaville, Congo</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="h-4 w-4 text-green-400" />
                <span>+242 XX XXX XXX</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="h-4 w-4 text-green-400" />
                <span>contact@eazycongo.com</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Liens rapides
            </h3>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-400 hover:text-white transition-colors">Accueil</Link>
              <Link to="/restaurants" className="block text-gray-400 hover:text-white transition-colors">Restaurants</Link>
              <Link to="/taxi" className="block text-gray-400 hover:text-white transition-colors">Taxi</Link>
              <Link to="/orders" className="block text-gray-400 hover:text-white transition-colors">Commandes</Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Suivez-nous
            </h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
            <div className="mt-4">
              <input
                type="email"
                placeholder="Votre email"
                className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Button className="w-full mt-2 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600">
                S'abonner
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} EazyCongo. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
