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
  Globe, 
  Shield, 
  Clock, 
  Star,
  Calculator,
  Plane,
  Ship,
  Zap,
  CheckCircle
} from 'lucide-react';

const ColisInternationalPage: React.FC = () => {
  const [calculatorData, setCalculatorData] = useState({
    origin: '',
    destination: '',
    weight: '',
    service: 'standard'
  });
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  const serviceTypes = [
    {
      id: 'economy',
      name: 'Économique',
      price: '15 000 FCFA',
      delay: '7-15 jours',
      transport: 'Maritime',
      icon: Ship
    },
    {
      id: 'standard',
      name: 'Standard',
      price: '25 000 FCFA',
      delay: '5-10 jours',
      transport: 'Aérien',
      icon: Plane,
      popular: true
    },
    {
      id: 'express',
      name: 'Express',
      price: '45 000 FCFA',
      delay: '2-5 jours',
      transport: 'Aérien Premium',
      icon: Plane
    }
  ];

  const countries = [
    'France',
    'Belgique',
    'Suisse',
    'Allemagne',
    'Italie',
    'Espagne',
    'Pays-Bas',
    'Royaume-Uni',
    'États-Unis',
    'Canada',
    'Brésil',
    'Chine',
    'Japon',
    'Corée du Sud',
    'Inde',
    'Australie',
    'Afrique du Sud',
    'Nigeria',
    'Ghana',
    'Côte d\'Ivoire',
    'Sénégal',
    'Mali',
    'Cameroun',
    'Gabon',
    'RCA',
    'Tchad',
    'RDC'
  ];

  const calculatePrice = () => {
    if (!calculatorData.origin || !calculatorData.destination || !calculatorData.weight) {
      return;
    }

    const basePrice = 15000;
    const weightPrice = parseFloat(calculatorData.weight) * 2000;
    let serviceMultiplier = 1;

    switch (calculatorData.service) {
      case 'economy':
        serviceMultiplier = 1;
        break;
      case 'standard':
        serviceMultiplier = 1.67;
        break;
      case 'express':
        serviceMultiplier = 3;
        break;
      default:
        serviceMultiplier = 1;
    }

    const totalPrice = (basePrice + weightPrice) * serviceMultiplier;
    setCalculatedPrice(totalPrice);
  };

  const features = [
    {
      icon: Globe,
      title: "Couverture Mondiale",
      description: "Expédition vers plus de 200 pays et territoires"
    },
    {
      icon: Shield,
      title: "Assurance Premium",
      description: "Protection jusqu'à 1 000 000 FCFA incluse"
    },
    {
      icon: Clock,
      title: "Délais Garantis",
      description: "Livraison express et économique selon vos besoins"
    },
    {
      icon: Star,
      title: "Tarifs Transparents",
      description: "Prix clairs sans frais cachés"
    }
  ];

  const testimonials = [
    {
      name: "Pierre D.",
      country: "France",
      rating: 5,
      comment: "Service impeccable ! Mon colis est arrivé en 3 jours à Brazzaville."
    },
    {
      name: "Sarah M.",
      country: "Canada",
      rating: 5,
      comment: "Suivi en temps réel très pratique. Je recommande !"
    },
    {
      name: "Ahmed K.",
      country: "Maroc",
      rating: 4,
      comment: "Prix compétitifs et service professionnel."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-200">
                <Shield className="h-4 w-4 mr-2" />
                Service Officiel Poste Congo
              </Badge>
            </div>
            <Link to="/colis/expedition">
              <Button className="bg-blue-600 hover:bg-blue-700">
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
            Livraison <span className="text-blue-600">Internationale</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expédiez vos colis partout dans le monde avec notre réseau international
          </p>
        </div>

        {/* Calculateur de tarifs */}
        <Card className="mb-12 bg-white/95 backdrop-blur border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Calculator className="h-6 w-6 text-blue-600" />
              Calculer votre tarif international
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="origin">Pays d'origine</Label>
                  <Select value={calculatorData.origin} onValueChange={(value) => setCalculatorData({...calculatorData, origin: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez le pays d'origine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Congo">Congo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="destination">Pays de destination</Label>
                  <Select value={calculatorData.destination} onValueChange={(value) => setCalculatorData({...calculatorData, destination: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez le pays de destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
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
                      {serviceTypes.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - {service.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={calculatePrice} className="w-full bg-blue-600 hover:bg-blue-700">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculer le tarif
                </Button>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Résultat du calcul</h3>
                {calculatedPrice > 0 ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{calculatedPrice.toLocaleString()} FCFA</div>
                      <p className="text-sm text-gray-600">Prix total estimé</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Prix de base:</span>
                        <span>15 000 FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Poids ({calculatorData.weight}kg):</span>
                        <span>{(parseFloat(calculatorData.weight) * 2000).toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service {serviceTypes.find(s => s.id === calculatorData.service)?.name}:</span>
                        <span>+{((15000 + parseFloat(calculatorData.weight) * 2000) * (serviceTypes.find(s => s.id === calculatorData.service)?.id === 'standard' ? 0.67 : serviceTypes.find(s => s.id === calculatorData.service)?.id === 'express' ? 2 : 0)).toLocaleString()} FCFA</span>
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
          <h2 className="text-3xl font-bold text-center mb-8">Nos Services Internationaux</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {serviceTypes.map((service) => (
              <Card key={service.id} className={`relative hover:shadow-lg transition-shadow ${service.popular ? 'border-blue-300 shadow-xl' : ''}`}>
                {service.popular && (
                  <Badge className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white">
                    Le plus choisi
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <service.icon className="h-5 w-5 text-blue-600" />
                    {service.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{service.price}</div>
                  <p className="text-gray-600 mb-4">{service.delay} • {service.transport}</p>
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
                  <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
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
                    <span className="text-sm text-gray-500">{testimonial.country}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-4">Prêt à expédier à l'international ?</h3>
              <p className="mb-6">Rejoignez des milliers de clients satisfaits</p>
              <Link to="/colis/expedition">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
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

export default ColisInternationalPage;