import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
      
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 animate-gradient-x" />

      <div className="container relative mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="group hover:scale-105 transition-transform duration-300">
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              À propos de nous
            </h3>
            <p className="text-sm text-gray-400 transform hover:translate-x-2 transition-transform duration-300">
              Buntudelice est votre partenaire de confiance pour la livraison de repas
              congolais authentiques et services de qualité.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Contactez-nous
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group cursor-pointer">
                <MapPin className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span>28 Rue du Docteur Curreux, Centre-Ville, Brazzaville</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group cursor-pointer">
                <Phone className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span>+242 06 449 53 53</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group cursor-pointer">
                <Mail className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span>contact@buntudelice.com</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Liens rapides
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "Accueil" },
                { href: "/restaurants", label: "Restaurants" },
                { href: "/services", label: "Services" },
                { href: "/contact", label: "Contact" }
              ].map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href} 
                    className={cn(
                      "text-gray-400 hover:text-white transition-colors relative group block",
                      "after:content-[''] after:absolute after:bottom-0 after:left-0",
                      "after:w-0 after:h-0.5 after:bg-indigo-400",
                      "after:transition-all after:duration-300",
                      "hover:after:w-full"
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Suivez-nous
            </h3>
            <div className="flex space-x-4 mb-6">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Instagram, href: "#" }
              ].map(({ Icon, href }, index) => (
                <a 
                  key={index}
                  href={href} 
                  className="text-gray-400 hover:text-white transition-colors transform hover:scale-110 duration-300"
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Votre email"
                className="w-full px-4 py-2 rounded-lg glass-effect border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              />
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25">
                S'abonner
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Buntudelice. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;