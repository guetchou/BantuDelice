/**
 * ColisNationalPage - Page d'envoi de colis avec paiement multi-provider (MTN MoMo, Airtel Money)
 * - Utilise PaymentGateway pour la sélection du provider et l'initiation du paiement
 * - Transmet paymentMethod au backend pour routage dynamique
 * - Monitoring UX : logs frontend pour chaque étape clé
 * - Polling automatique du statut de paiement
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  MapPin, 
  Shield, 
  Clock, 
  Star,
  Calculator,
  Truck,
  Zap,
  CheckCircle
} from 'lucide-react';

const ColisNationalPage: React.FC = () => {
  const [calculatorData, setCalculatorData] = useState({
    origin: '',
    destination: '',
    weight: '',
    service: 'standard'
  });
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  const services = [
    { id: 'standard', name: 'Standard', price: '2 500 FCFA', delay: '3-5 jours' },
    { id: 'express', name: 'Express', price: '5 000 FCFA', delay: '24-48h' },
    { id: 'pro', name: 'Pro', price: '8 000 FCFA', delay: 'Avant 12h' }
  ];

  const cities = [
    'Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi', 'Ouesso', 'Gamboma', 
    'Madingou', 'Mossendjo', 'Kinkala', 'Loandjili', 'Djambala', 'Ewo',
    'Sibiti', 'Impfondo', 'Makoua'
  ];

  const calculatePrice = () => {
    if (!calculatorData.origin || !calculatorData.destination || !calculatorData.weight) {
      return;
    }

    const basePrice = 2500;
    const weightPrice = parseFloat(calculatorData.weight) * 500;
    let serviceMultiplier = 1;

    switch (calculatorData.service) {
      case 'express':
        serviceMultiplier = 2;
        break;
      case 'pro':
        serviceMultiplier = 3.2;
        break;
      default:
        serviceMultiplier = 1;
    }

    const totalPrice = (basePrice + weightPrice) * serviceMultiplier;
    setCalculatedPrice(totalPrice);
  };

  const features = [
    {
      icon: MapPin,
      title: "Couverture Nationale",
      description: "Réseau postal étendu dans les 15 départements"
    },
    {
      icon: Shield,
      title: "Assurance Incluse",
      description: "Protection jusqu'à 500 000 FCFA sans frais supplémentaires"
    },
    {
      icon: Clock,
      title: "Livraison Rapide",
      description: "Délais de livraison optimisés selon vos besoins"
    },
    {
      icon: Star,
      title: "Tarifs Transparents",
      description: "Prix clairs sans frais cachés"
    }
  ];

  const testimonials = [
    {
      name: "Marie K.",
      city: "Brazzaville",
      rating: 5,
      comment: "Service rapide et fiable. Mon colis est arrivé en 2 jours !"
    },
    {
      name: "Jean P.",
      city: "Pointe-Noire", 
      rating: 5,
      comment: "Excellent rapport qualité-prix. Je recommande vivement."
    },
    {
      name: "Sophie M.",
      city: "Dolisie",
      rating: 4,
      comment: "Personnel professionnel et suivi en temps réel."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-200">
                <Shield className="h-4 w-4 mr-2" />
                Service Officiel Poste Congo
              </Badge>
            </div>
            <Link to="/colis/expedition">
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Package className="h-4 w-4 mr-2" />
                Expédier un colis
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Livraison <span className="text-orange-600">Nationale</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expédiez vos colis dans tout le Congo avec le réseau postal le plus étendu du pays
          </p>
        </div>

        {/* Calculateur de tarifs */}
        <Card className="mb-12 bg-white/95 backdrop-blur border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Calculator className="h-6 w-6 text-orange-600" />
              Calculer votre tarif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="origin">Ville d'origine</Label>
                  <Select value={calculatorData.origin} onValueChange={(value) => setCalculatorData({...calculatorData, origin: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez la ville d'origine" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="destination">Ville de destination</Label>
                  <Select value={calculatorData.destination} onValueChange={(value) => setCalculatorData({...calculatorData, destination: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez la ville de destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="weight">Poids (kg)</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 2.5"
                    value={calculatorData.weight}
                    onChange={(e) => setCalculatorData({...calculatorData, weight: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="service">Service</Label>
                  <Select value={calculatorData.service} onValueChange={(value) => setCalculatorData({...calculatorData, service: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - {service.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={calculatePrice} className="w-full bg-orange-600 hover:bg-orange-700">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculer le tarif
                </Button>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-lg border border-orange-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Résultat du calcul</h3>
                {calculatedPrice > 0 ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">{calculatedPrice.toLocaleString()} FCFA</div>
                      <p className="text-sm text-gray-600">Prix total estimé</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Prix de base:</span>
                        <span>2 500 FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Poids ({calculatorData.weight}kg):</span>
                        <span>{(parseFloat(calculatorData.weight) * 500).toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service {services.find(s => s.id === calculatorData.service)?.name}:</span>
                        <span>+{((2500 + parseFloat(calculatorData.weight) * 500) * (services.find(s => s.id === calculatorData.service)?.id === 'express' ? 1 : services.find(s => s.id === calculatorData.service)?.id === 'pro' ? 2.2 : 0)).toLocaleString()} FCFA</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>{calculatedPrice.toLocaleString()} FCFA</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <Calculator className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Remplissez les informations pour calculer le tarif</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Nos Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="relative hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-orange-600" />
                    {service.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600 mb-2">{service.price}</div>
                  <p className="text-gray-600 mb-4">{service.delay}</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Suivi en temps réel
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Assurance incluse
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Livraison à domicile
                    </li>
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Pourquoi nous choisir ?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Témoignages */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Ce que disent nos clients</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.comment}"</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{testimonial.name}</span>
                    <span className="text-sm text-gray-500">{testimonial.city}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-4">Prêt à expédier votre colis ?</h3>
              <p className="mb-6">Rejoignez des milliers de clients satisfaits</p>
              <Link to="/colis/expedition">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                  <Zap className="h-4 w-4 mr-2" />
                  Commencer maintenant
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ColisNationalPage;