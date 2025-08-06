import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, MapPin, Phone, Mail, Package, Truck, CreditCard, Calendar } from 'lucide-react';

const Order: React.FC = () => {
  const [orderType, setOrderType] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const orderTypes = [
    { id: 'delivery', label: 'Livraison', icon: Truck, description: 'Livraison à domicile' },
    { id: 'pickup', label: 'Retrait', icon: Package, description: 'Retrait en point relais' },
    { id: 'express', label: 'Express', icon: Clock, description: 'Livraison express' }
  ];

  const paymentMethods = [
    { id: 'card', label: 'Carte bancaire', icon: CreditCard },
    { id: 'mobile', label: 'Mobile Money', icon: Phone },
    { id: 'cash', label: 'Espèces', icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Passer une commande</h1>
            <p className="text-lg text-gray-600">Choisissez vos options de livraison et de paiement</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulaire principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Type de commande */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Type de commande
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {orderTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <div
                          key={type.id}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            orderType === type.id
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-orange-300'
                          }`}
                          onClick={() => setOrderType(type.id)}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-6 w-6 text-orange-500" />
                            <div>
                              <h3 className="font-semibold">{type.label}</h3>
                              <p className="text-sm text-gray-600">{type.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Informations de livraison */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Adresse de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Prénom</label>
                      <Input placeholder="Votre prénom" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom</label>
                      <Input placeholder="Votre nom" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Adresse</label>
                    <Input placeholder="Rue, numéro" />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Ville</label>
                      <Input placeholder="Ville" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Code postal</label>
                      <Input placeholder="Code postal" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Pays</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="congo">Congo</SelectItem>
                          <SelectItem value="rdc">RDC</SelectItem>
                          <SelectItem value="cameroun">Cameroun</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Téléphone</label>
                    <Input placeholder="+242 XXX XXX XXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Instructions spéciales</label>
                    <Textarea placeholder="Instructions pour le livreur..." />
                  </div>
                </CardContent>
              </Card>

              {/* Méthode de paiement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Méthode de paiement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <div
                          key={method.id}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            paymentMethod === method.id
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-orange-300'
                          }`}
                          onClick={() => setPaymentMethod(method.id)}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-6 w-6 text-orange-500" />
                            <span className="font-medium">{method.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Résumé de la commande */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Résumé de la commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span className="font-semibold">45 000 FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span className="font-semibold">2 500 FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span className="font-semibold">1 500 FCFA</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>49 000 FCFA</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="insurance" />
                    <label htmlFor="insurance" className="text-sm">
                      Assurance colis (+1 000 FCFA)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="tracking" />
                    <label htmlFor="tracking" className="text-sm">
                      Suivi en temps réel (+500 FCFA)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="fragile" />
                    <label htmlFor="fragile" className="text-sm">
                      Colis fragile (+800 FCFA)
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg">
                Confirmer la commande
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  En passant cette commande, vous acceptez nos{' '}
                  <Link to="/terms" className="text-orange-500 hover:underline">
                    conditions générales
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order; 