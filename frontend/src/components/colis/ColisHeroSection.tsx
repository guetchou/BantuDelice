import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronRight, Search, Calculator, Zap, FileText, AlertTriangle, Loader2, Target, TrendingUp } from 'lucide-react';
import ColisTarifCalculator from './ColisTarifCalculator';

interface CalculatorData {
  origin: string;
  destination: string;
  weight: string;
  service: string;
}

const ColisHeroSection: React.FC = () => {
  const [calculatorData, setCalculatorData] = useState<CalculatorData>({
    origin: '',
    destination: '',
    weight: '',
    service: 'standard'
  });
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  const cities = [
    'Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi', 'Ouesso', 'Gamboma', 
    'Madingou', 'Mossendjo', 'Kinkala', 'Loandjili', 'Djambala', 'Ewo',
    'Sibiti', 'Impfondo', 'Makoua'
  ];

  const services = [
    { id: 'standard', name: 'Standard', price: 2500, delay: '3-5 jours' },
    { id: 'express', name: 'Express', price: 5000, delay: '24-48h' },
    { id: 'pro', name: 'Pro', price: 8000, delay: 'Avant 12h' }
  ];

  const calculatePrice = () => {
    if (!calculatorData.origin || !calculatorData.destination || !calculatorData.weight) {
      return;
    }

    const basePrice = services.find(s => s.id === calculatorData.service)?.price || 2500;
    const weightPrice = parseFloat(calculatorData.weight) * 500;
    const totalPrice = basePrice + weightPrice;
    setCalculatedPrice(totalPrice);
  };

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-amber-50 to-orange-100" role="banner" aria-labelledby="hero-title">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 backdrop-blur-sm border border-orange-500/20 text-orange-600 rounded-full text-sm font-medium shadow-sm">
              <Zap className="h-4 w-4" />
              <span>Service Officiel Poste Congo</span>
            </div>

            <h1 id="hero-title" className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-700">
                Livraison Nationale
              </span><br />
              <span className="text-gray-800">Rapide et Sécurisée</span>
            </h1>

            <p className="text-lg text-gray-700">
              Expédiez vos colis dans tout le Congo avec le réseau postal le plus étendu du pays. 
              Tarifs transparents, suivi en temps réel, garantie de livraison.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link to="/colis/expedition">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg group"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Formulaire d'expédition
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              
              <Link to="/colis/tracking">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-orange-600 bg-white/80 text-orange-600 hover:bg-orange-600/10 hover:border-orange-700"
                >
                  <span className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Suivre un colis
                  </span>
                </Button>
              </Link>
            </div>

            {/* Liens rapides */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Link to="/colis/reclamation">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Réclamation
                </Button>
              </Link>
              <Link to="/colis/plainte">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Plainte
                </Button>
              </Link>
              <Link to="/colis/support">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Support
                </Button>
              </Link>
            </div>

            {/* Stats rapides avec images */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <img 
                  src="/images/nos-services.jpg" 
                  alt="Statistiques de livraison"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-gray-900">15 départements</div>
                  <div className="text-sm text-gray-600">Couverture nationale</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <img 
                  src="/images/client-satisfait.png" 
                  alt="Satisfaction client"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-gray-900">98%</div>
                  <div className="text-sm text-gray-600">Clients satisfaits</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2">
            {/* Calculateur de prix - Style DHL/UPS */}
            <Card className="bg-white/95 backdrop-blur border-0 shadow-xl" role="region" aria-labelledby="calculator-title">
              <CardHeader>
                <CardTitle id="calculator-title" className="flex items-center gap-2 text-2xl">
                  <Calculator className="h-6 w-6 text-orange-600" aria-hidden="true" />
                  Calculer votre tarif
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="origin">Départ</Label>
                    <Select value={calculatorData.origin} onValueChange={(value) => setCalculatorData({...calculatorData, origin: value})}>
                      <SelectTrigger id="origin" aria-describedby="origin-help">
                        <SelectValue placeholder="Ville de départ" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p id="origin-help" className="text-xs text-gray-500 mt-1">Sélectionnez votre ville de départ</p>
                  </div>
                  <div>
                    <Label htmlFor="destination">Destination</Label>
                    <Select value={calculatorData.destination} onValueChange={(value) => setCalculatorData({...calculatorData, destination: value})}>
                      <SelectTrigger id="destination" aria-describedby="destination-help">
                        <SelectValue placeholder="Ville d'arrivée" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p id="destination-help" className="text-xs text-gray-500 mt-1">Sélectionnez votre ville de destination</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">Poids (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="Ex: 2.5"
                      value={calculatorData.weight}
                      onChange={(e) => setCalculatorData({...calculatorData, weight: e.target.value})}
                      aria-describedby="weight-help"
                      min="0.1"
                      step="0.1"
                    />
                    <p id="weight-help" className="text-xs text-gray-500 mt-1">Entrez le poids en kilogrammes</p>
                  </div>
                  <div>
                    <Label htmlFor="service">Service</Label>
                    <Select value={calculatorData.service} onValueChange={(value) => setCalculatorData({...calculatorData, service: value})}>
                      <SelectTrigger id="service" aria-describedby="service-help">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} - {service.price.toLocaleString()} FCFA
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p id="service-help" className="text-xs text-gray-500 mt-1">Choisissez le type de service</p>
                  </div>
                </div>
                
                <Button 
                  onClick={calculatePrice} 
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                  aria-describedby="calculator-result"
                >
                  <Calculator className="h-4 w-4 mr-2" aria-hidden="true" />
                  Calculer le tarif
                </Button>
                
                {calculatedPrice > 0 && (
                  <div id="calculator-result" className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200" role="status" aria-live="polite">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{calculatedPrice.toLocaleString()} FCFA</div>
                      <p className="text-sm text-gray-600">Prix total estimé</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ColisHeroSection; 