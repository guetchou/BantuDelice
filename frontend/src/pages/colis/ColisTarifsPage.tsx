import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, Package, Shield, Truck, Globe, MapPin, Clock, Star } from 'lucide-react';

const ColisTarifsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    type: 'national',
    from: '',
    to: '',
    weight: '',
    dimensions: '',
    insurance: false,
    express: false
  });

  const [result, setResult] = useState<any>(null);

  const calculateTarif = () => {
    // Simulation de calcul de tarif
    const basePrice = formData.type === 'national' ? 2000 : 15000;
    const weightPrice = parseFloat(formData.weight) * 500;
    const insurancePrice = formData.insurance ? 2000 : 0;
    const expressPrice = formData.express ? 5000 : 0;
    
    const total = basePrice + weightPrice + insurancePrice + expressPrice;
    
    setResult({
      basePrice,
      weightPrice,
      insurancePrice,
      expressPrice,
      total,
      currency: 'FCFA',
      deliveryTime: formData.express ? '24h' : '3-5 jours'
    });
  };

  const nationalZones = [
    { name: 'Brazzaville', price: 2000 },
    { name: 'Pointe-Noire', price: 2500 },
    { name: 'Dolisie', price: 3000 },
    { name: 'Nkayi', price: 3500 },
    { name: 'Ouesso', price: 5000 }
  ];

  const internationalZones = [
    { name: 'Europe', price: 15000 },
    { name: 'Amérique du Nord', price: 25000 },
    { name: 'Asie', price: 20000 },
    { name: 'Afrique de l\'Ouest', price: 12000 },
    { name: 'Afrique de l\'Est', price: 18000 }
  ];

  const carriers = [
    { name: 'DHL', rating: 4.8, price: '15000-25000', time: '3-5 jours' },
    { name: 'FedEx', rating: 4.7, price: '14000-24000', time: '3-5 jours' },
    { name: 'UPS', rating: 4.6, price: '16000-26000', time: '4-6 jours' },
    { name: 'La Poste', rating: 4.5, price: '12000-22000', time: '5-7 jours' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-100 to-yellow-200">
      {/* Header avec navigation */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/images/logo/logo.png" alt="BantuDelice" className="h-10 w-10 rounded-full border-2 border-yellow-400 shadow" />
              <span className="font-bold text-orange-700 text-xl">BantuDelice Colis</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/colis" className="text-orange-700 hover:text-orange-900 font-medium">Accueil</Link>
              <Link to="/colis/tracking" className="text-orange-700 hover:text-orange-900 font-medium">Suivi</Link>
              <Link to="/colis/tarifs" className="text-orange-700 hover:text-orange-900 font-medium">Tarifs</Link>
              <Link to="/colis/expedier" className="text-orange-700 hover:text-orange-900 font-medium">Expédier</Link>
              <Link to="/colis/historique" className="text-orange-700 hover:text-orange-900 font-medium">Historique</Link>
            </nav>
            <Button asChild className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-bold">
              <Link to="/colis/tracking">Suivre un colis</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-700 mb-4">Calculateur de tarifs</h1>
          <p className="text-xl text-gray-600">Calculez instantanément le coût de vos envois nationaux et internationaux</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculateur */}
          <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <Calculator className="h-6 w-6" />
                Calculateur de tarifs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type d'envoi</label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="national">National</SelectItem>
                      <SelectItem value="international">International</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Standard" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="express">Express</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ville de départ</label>
                  <Input 
                    placeholder="Brazzaville"
                    value={formData.from}
                    onChange={(e) => setFormData({...formData, from: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ville de destination</label>
                  <Input 
                    placeholder="Pointe-Noire"
                    value={formData.to}
                    onChange={(e) => setFormData({...formData, to: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Poids (kg)</label>
                  <Input 
                    type="number"
                    placeholder="1.5"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions (cm)</label>
                  <Input 
                    placeholder="30x20x10"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="insurance"
                    checked={formData.insurance}
                    onChange={(e) => setFormData({...formData, insurance: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="insurance" className="text-sm font-medium text-gray-700">
                    Assurance supplémentaire (+2000 FCFA)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="express"
                    checked={formData.express}
                    onChange={(e) => setFormData({...formData, express: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="express" className="text-sm font-medium text-gray-700">
                    Livraison express (+5000 FCFA)
                  </label>
                </div>
              </div>

              <Button 
                onClick={calculateTarif}
                className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-bold"
              >
                Calculer le tarif
              </Button>
            </CardContent>
          </Card>

          {/* Résultat */}
          <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-orange-700">Résultat du calcul</CardTitle>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-700">
                      {result.total.toLocaleString()} {result.currency}
                    </div>
                    <div className="text-sm text-green-600">
                      Livraison estimée : {result.deliveryTime}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Prix de base :</span>
                      <span>{result.basePrice.toLocaleString()} {result.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Poids :</span>
                      <span>{result.weightPrice.toLocaleString()} {result.currency}</span>
                    </div>
                    {result.insurancePrice > 0 && (
                      <div className="flex justify-between">
                        <span>Assurance :</span>
                        <span>{result.insurancePrice.toLocaleString()} {result.currency}</span>
                      </div>
                    )}
                    {result.expressPrice > 0 && (
                      <div className="flex justify-between">
                        <span>Express :</span>
                        <span>{result.expressPrice.toLocaleString()} {result.currency}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total :</span>
                      <span>{result.total.toLocaleString()} {result.currency}</span>
                    </div>
                  </div>

                  <Button asChild className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-bold">
                    <Link to="/colis/expedier">Expédier maintenant</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Remplissez le formulaire et cliquez sur "Calculer le tarif"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tableaux de prix */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-orange-700 mb-12">Tarifs par zone</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Tarifs nationaux */}
            <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <MapPin className="h-6 w-6" />
                  Tarifs Nationaux
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nationalZones.map((zone) => (
                    <div key={zone.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        <span className="font-medium">{zone.name}</span>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">
                        {zone.price.toLocaleString()} FCFA
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tarifs internationaux */}
            <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Globe className="h-6 w-6" />
                  Tarifs Internationaux
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {internationalZones.map((zone) => (
                    <div key={zone.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{zone.name}</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {zone.price.toLocaleString()} FCFA
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comparaison transporteurs */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-orange-700 mb-12">Comparaison transporteurs</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {carriers.map((carrier) => (
              <Card key={carrier.name} className="bg-white/90 backdrop-blur border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-center">{carrier.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(carrier.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">({carrier.rating})</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">{carrier.price}</div>
                  <div className="text-sm text-gray-600">Délai : {carrier.time}</div>
                  <Button className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 text-white">
                    Choisir
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColisTarifsPage; 