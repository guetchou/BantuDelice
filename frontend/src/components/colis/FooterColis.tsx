import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  Shield, 
  Phone, 
  Mail, 
  MapPin,
  Facebook, 
  Twitter, 
  Instagram,
  Linkedin,
  Package,
  Truck,
  Calculator,
  ChevronDown,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

const FooterColis: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  return (
    <footer className="bg-gradient-to-br from-orange-50 to-yellow-50 border-t border-orange-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mobile Accordion */}
        <div className="lg:hidden space-y-4 mb-8">
          {[
            { 
              title: "Services Colis", 
              icon: Package,
              links: [
                { to: "/colis/expedition", label: "Expédier un colis", icon: Package },
                { to: "/colis/tracking", label: "Suivi de colis", icon: Truck },
                { to: "/colis/tarifs", label: "Tarifs et devis", icon: Calculator }
              ]
            },
            { 
              title: "Support & Aide", 
              icon: HelpCircle,
              links: [
                { to: "/colis/support", label: "Centre d'aide", icon: HelpCircle },
                { to: "/colis/restrictions", label: "Restrictions", icon: Shield },
                { href: "tel:+33123456789", label: "Support téléphonique", icon: Phone }
              ]
            },
            { 
              title: "Contact", 
              icon: Mail,
              content: (
                <div className="space-y-3 text-sm pl-2">
                  <div className="flex items-center gap-2 text-orange-600">
                    <MapPin className="h-4 w-4" />
                    <span>28 Rue du Docteur Curreux, Centre-Ville, Brazzaville</span>
                  </div>
                  <div className="flex items-center gap-2 text-orange-600">
                    <Phone className="h-4 w-4" />
                    <span>+242 06 449 53 53</span>
                  </div>
                  <div className="flex items-center gap-2 text-orange-600">
                    <Mail className="h-4 w-4" />
                    <span>colis@bantudelice.cg</span>
                  </div>
                </div>
              )
            }
          ].map((section, index) => (
            <div key={index} className="border-b border-orange-200 pb-4">
              <button
                onClick={() => toggleAccordion(section.title)}
                className="flex justify-between items-center w-full text-lg font-semibold text-orange-800"
              >
                <div className="flex items-center gap-2">
                  <section.icon className="h-5 w-5" />
                  {section.title}
                </div>
                <ChevronDown className={`h-5 w-5 transition-transform ${activeAccordion === section.title ? 'rotate-180' : ''}`} />
              </button>
              
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: activeAccordion === section.title ? 'auto' : 0,
                  opacity: activeAccordion === section.title ? 1 : 0
                }}
                className="overflow-hidden"
              >
                <div className="pt-3 pl-7 space-y-3">
                  {section.links ? (
                    section.links.map((link, i) => (
                      link.to ? (
                        <Link
                          key={i}
                          to={link.to}
                          className="text-orange-600 hover:text-orange-800 transition-colors flex items-center gap-2 text-sm"
                        >
                          <link.icon className="h-4 w-4" />
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          key={i}
                          href={link.href}
                          className="text-orange-600 hover:text-orange-800 transition-colors flex items-center gap-2 text-sm"
                        >
                          <link.icon className="h-4 w-4" />
                          {link.label}
                        </a>
                      )
                    ))
                  ) : (
                    section.content
                  )}
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Section Services Colis */}
          <div>
            <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Services Colis
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/colis/expedition", label: "Expédier un colis", icon: Package },
                { to: "/colis/tracking", label: "Suivi de colis", icon: Truck },
                { to: "/colis/tarifs", label: "Tarifs et devis", icon: Calculator }
              ].map((link, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Link 
                    to={link.to} 
                    className="text-orange-600 hover:text-orange-800 transition-colors flex items-center gap-2"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Section Support et Aide */}
          <div>
            <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Support & Aide
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/colis/support", label: "Centre d'aide", icon: HelpCircle },
                { to: "/colis/restrictions", label: "Restrictions", icon: Shield },
                { href: "tel:+33123456789", label: "Support téléphonique", icon: Phone }
              ].map((link, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {link.to ? (
                    <Link 
                      to={link.to} 
                      className="text-orange-600 hover:text-orange-800 transition-colors flex items-center gap-2"
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  ) : (
                    <a 
                      href={link.href} 
                      className="text-orange-600 hover:text-orange-800 transition-colors flex items-center gap-2"
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </a>
                  )}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Section Contact */}
          <div>
            <h3 className="text-lg font-semibold text-orange-800 mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              {[
                { icon: MapPin, text: "28 Rue du Docteur Curreux, Centre-Ville, Brazzaville" },
                { icon: Phone, text: "+242 06 449 53 53" },
                { icon: Mail, text: "colis@bantudelice.cg" }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-2 text-orange-600"
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Section Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-orange-800 mb-4">Restez informé</h3>
            <p className="text-sm text-orange-600 mb-4">
              Recevez nos dernières actualités et offres spéciales
            </p>
            
            {isSubscribed ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg"
              >
                <Check className="h-4 w-4" />
                <span>Merci pour votre abonnement !</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <Input
                  type="email"
                  placeholder="Votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-orange-200 focus:ring-orange-400"
                  required
                />
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white text-sm shadow-md hover:shadow-lg transition-all"
                >
                  S'abonner
                </Button>
              </form>
            )}
            
            {/* Réseaux sociaux */}
            <div className="flex space-x-4 mt-6">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Linkedin, href: "#" }
              ].map(({ Icon, href }, index) => (
                <motion.a 
                  key={index}
                  href={href} 
                  className="text-orange-600 hover:text-orange-800 transition-colors"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Ligne de séparation */}
        <div className="border-t border-orange-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-orange-600">
              © {new Date().getFullYear()} BantuDelice Colis. Tous droits réservés.
            </p>
            <div className="flex flex-wrap gap-4 md:gap-6 text-sm">
              {[
                { to: "/colis/support", label: "Support" },
                { to: "/colis/restrictions", label: "Restrictions" },
                { to: "/privacy", label: "Confidentialité" },
                { to: "/terms", label: "Conditions" },
                { to: "/cookies", label: "Cookies" }
              ].map((link, index) => (
                <Link 
                  key={index}
                  to={link.to} 
                  className="text-orange-600 hover:text-orange-800 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterColis;