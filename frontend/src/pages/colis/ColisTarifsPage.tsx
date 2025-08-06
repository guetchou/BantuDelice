import React, { useState, useEffect } from 'react';
import NavbarColis from '@/components/colis/NavbarColis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Calculator, 
  MapPin, 
  Package, 
  Clock, 
  Truck, 
  Plane, 
  Ship,
  Shield,
  Zap,
  TrendingUp,
  Target,
  Award,
  Users,
  Globe,
  Star,
  CheckCircle,
  AlertTriangle,
  Info,
  Download,
  Share2,
  Loader2,
  Building,
  Home,
  FileText
} from 'lucide-react';
import TarifService, { TarifCalculation } from '@/services/tarifService';

const ColisTarifsPage: React.FC = () => {
  const [calculationParams, setCalculationParams] = useState({
    from: 'Brazzaville',
    to: 'Pointe-Noire',
    weight: 5,
    service: 'standard',
    declaredValue: 0,
    isFragile: false,
    isUrgent: false,
    deliveryType: 'agence' as 'agence' | 'domicile'
  });

  const [tarif, setTarif] = useState<TarifCalculation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('calculator');

  // Villes disponibles selon la politique tarifaire
  const cities = [
    'Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi', 'Ouesso', 'Gamboma', 
    'Madingou', 'Mossendjo', 'Kinkala', 'Loandjili', 'Djambala', 'Ewo',
    'Sibiti', 'Impfondo', 'Makoua'
  ];

  const services = [
    { 
      id: 'economy', 
      name: 'Économique', 
      description: 'Livraison groupée, délais plus longs',
      price: 0.8, 
      delay: '5-7 jours',
      icon: Ship,
      color: 'text-green-600'
    },
    { 
      id: 'standard', 
      name: 'Standard', 
      description: 'Service classique, bon rapport qualité-prix',
      price: 1.0, 
      delay: '3-5 jours',
      icon: Truck,
      color: 'text-blue-600',
      popular: true
    },
    { 
      id: 'express', 
      name: 'Express', 
      description: 'Livraison rapide, priorité haute',
      price: 2.0, 
      delay: '1-2 jours',
      icon: Plane,
      color: 'text-orange-600'
    },
    { 
      id: 'premium', 
      name: 'Premium', 
      description: 'Service haut de gamme, suivi dédié',
      price: 1.5, 
      delay: '24h',
      icon: Star,
      color: 'text-purple-600'
    }
  ];

  // Calcul automatique selon la politique tarifaire officielle
  const calculateTarif = async () => {
    if (!calculationParams.from || !calculationParams.to || !calculationParams.weight) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsLoading(true);
    setError('');
    
    // Simulation d'un délai de calcul
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const weight = calculationParams.weight;
      
      // Validation des paramètres
      const validation = TarifService.validateParams({
        from: calculationParams.from,
        to: calculationParams.to,
        weight,
        service: calculationParams.service
      });

      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        setIsLoading(false);
        return;
      }

      // Calcul selon la politique tarifaire officielle
      const calculation = TarifService.calculateTarif({
        from: calculationParams.from,
        to: calculationParams.to,
        weight,
        service: calculationParams.service,
        isInternational: false, // Pour la page tarifs, on se concentre sur le national
        isFragile: calculationParams.isFragile,
        isUrgent: calculationParams.isUrgent,
        insuranceValue: calculationParams.declaredValue,
        deliveryType: calculationParams.deliveryType
      });

      setTarif(calculation);
    } catch (error) {
      setError('Erreur lors du calcul du tarif');
    } finally {
      setIsLoading(false);
    }
  };

  // Calcul automatique lors des changements
  useEffect(() => {
    if (calculationParams.from && calculationParams.to && calculationParams.weight > 0) {
      calculateTarif();
    }
  }, [calculationParams]);

  const handleShare = () => {
    if (!tarif) return;
    
    const shareText = `Tarif BantuDelice : ${calculationParams.from} → ${calculationParams.to}, ${calculationParams.weight}kg, ${tarif.total.toLocaleString()} FCFA`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Calcul de tarif BantuDelice',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      // Ici vous pourriez afficher une notification de succès
    }
  };

  const handleExportPDF = () => {
    // Implémentation de l'export PDF
    console.log('Export PDF');
  };

  const handleQuickOrder = () => {
    // Redirection vers la page d'expédition avec les paramètres pré-remplis
    const params = new URLSearchParams({
      from: calculationParams.from,
      to: calculationParams.to,
      weight: calculationParams.weight.toString(),
      service: calculationParams.service
    });
    window.location.href = `/colis/expedier?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50">
      <NavbarColis />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Tarifs et Calculatrice
          </h1>
          <p className="text-lg text-gray-600">
            Calculez vos tarifs selon notre politique tarifaire officielle
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire de calcul */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-6 w-6" />
                  Calculateur de tarif officiel
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Origine et destination */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="from">Ville d'origine *</Label>
                      <Select
                        value={calculationParams.from}
                        onValueChange={(value) => setCalculationParams(prev => ({ ...prev, from: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une ville" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="to">Ville de destination *</Label>
                      <Select
                        value={calculationParams.to}
                        onValueChange={(value) => setCalculationParams(prev => ({ ...prev, to: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une ville" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="weight">Poids (kg) *</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={calculationParams.weight}
                        onChange={(e) => setCalculationParams(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                        placeholder="5"
                        min="0.1"
                        max="50"
                        step="0.1"
                      />
                    </div>
                  </div>

                  {/* Service et options */}
                  <div className="space-y-4">
                    <div>
                      <Label>Type de service</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {services.map((service) => (
                          <Button
                            key={service.id}
                            variant={calculationParams.service === service.id ? 'default' : 'outline'}
                            onClick={() => setCalculationParams(prev => ({ ...prev, service: service.id }))}
                            className="h-12 flex flex-col items-center justify-center text-xs"
                          >
                            <service.icon className={`h-4 w-4 mb-1 ${service.color}`} />
                            <span>{service.name}</span>
                            {service.popular && (
                              <Badge variant="secondary" className="text-xs mt-1">
                                Populaire
                              </Badge>
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Mode de livraison</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Button
                          variant={calculationParams.deliveryType === 'agence' ? 'default' : 'outline'}
                          onClick={() => setCalculationParams(prev => ({ ...prev, deliveryType: 'agence' }))}
                          className="h-12 flex flex-col items-center justify-center text-xs"
                        >
                          <Building className="h-4 w-4 mb-1" />
                          <span>Agence</span>
                        </Button>
                        <Button
                          variant={calculationParams.deliveryType === 'domicile' ? 'default' : 'outline'}
                          onClick={() => setCalculationParams(prev => ({ ...prev, deliveryType: 'domicile' }))}
                          className="h-12 flex flex-col items-center justify-center text-xs"
                        >
                          <Home className="h-4 w-4 mb-1" />
                          <span>Domicile</span>
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="fragile">Colis fragile</Label>
                        <Switch
                          checked={calculationParams.isFragile}
                          onCheckedChange={(checked) => setCalculationParams(prev => ({ ...prev, isFragile: checked }))}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="urgent">Envoi urgent</Label>
                        <Switch
                          checked={calculationParams.isUrgent}
                          onCheckedChange={(checked) => setCalculationParams(prev => ({ ...prev, isUrgent: checked }))}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="insurance">Assurance supplémentaire</Label>
                        <Switch
                          checked={calculationParams.declaredValue > 0}
                          onCheckedChange={(checked) => setCalculationParams(prev => ({ 
                            ...prev, 
                            declaredValue: checked ? 50000 : 0 
                          }))}
                        />
                      </div>

                      {calculationParams.declaredValue > 0 && (
                        <div>
                          <Label htmlFor="declaredValue">Valeur déclarée (FCFA)</Label>
                          <Input
                            id="declaredValue"
                            type="number"
                            value={calculationParams.declaredValue}
                            onChange={(e) => setCalculationParams(prev => ({ ...prev, declaredValue: parseFloat(e.target.value) || 0 }))}
                            placeholder="50000"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Résultat du calcul */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Tarif calculé
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-500" />
                    <p className="text-gray-600">Calcul en cours...</p>
                  </div>
                ) : tarif ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">
                        {tarif.total.toLocaleString()} FCFA
                      </div>
                      <div className="text-sm text-gray-600">
                        Livraison en {tarif.estimatedDays} jours
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Zone: {tarif.zone.name}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Tarif de base</span>
                        <span>{tarif.baseRate.toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Charge poids</span>
                        <span>{tarif.weightCharge.toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Surcharge carburant</span>
                        <span>{tarif.fuelSurcharge.toLocaleString()} FCFA</span>
                      </div>
                      {tarif.insurance > 0 && (
                        <div className="flex justify-between">
                          <span>Assurance</span>
                          <span>{tarif.insurance.toLocaleString()} FCFA</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Frais de service</span>
                        <span>{tarif.serviceCharge.toLocaleString()} FCFA</span>
                      </div>
                      {tarif.specialCharges > 0 && (
                        <div className="flex justify-between">
                          <span>Surcharges spéciales</span>
                          <span>{tarif.specialCharges.toLocaleString()} FCFA</span>
                        </div>
                      )}
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>{tarif.total.toLocaleString()} FCFA</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button onClick={handleQuickOrder} className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Commander maintenant
                      </Button>
                      <Button variant="outline" onClick={handleShare} className="w-full">
                        <Share2 className="h-4 w-4 mr-2" />
                        Partager
                      </Button>
                      <Button variant="outline" onClick={handleExportPDF} className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Exporter PDF
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calculator className="h-8 w-8 mx-auto mb-4" />
                    <p>Remplissez les informations pour voir le tarif</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comparaison avec la concurrence */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Comparaison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>BantuDelice</span>
                  <Badge variant="default" className="bg-green-500">
                    {tarif ? `${tarif.total.toLocaleString()} FCFA` : '---'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>La Poste</span>
                  <Badge variant="outline">
                    {tarif ? `${Math.round(tarif.total * 0.7).toLocaleString()} FCFA` : '---'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>DHL</span>
                  <Badge variant="outline">
                    {tarif ? `${Math.round(tarif.total * 3).toLocaleString()} FCFA` : '---'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Avantages */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Nos avantages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Suivi en temps réel</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Assurance incluse</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Livraison à domicile</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Service client 24/7</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColisTarifsPage; 