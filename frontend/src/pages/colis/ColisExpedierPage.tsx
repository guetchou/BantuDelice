import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Package, User, MapPin, Calculator, Download, Send, Shield, Clock } from 'lucide-react';
import ColisImageUpload from '@/components/colis/ColisImageUpload';

const ColisExpedierPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Informations expéditeur
    senderName: '',
    senderPhone: '',
    senderEmail: '',
    senderAddress: '',
    senderCity: '',
    
    // Informations destinataire
    recipientName: '',
    recipientPhone: '',
    recipientEmail: '',
    recipientAddress: '',
    recipientCity: '',
    
    // Informations colis
    packageType: 'standard',
    weight: '',
    dimensions: '',
    description: '',
    
    // Options
    insurance: false,
    express: false,
    fragile: false,
    
    // Calcul
    calculatedPrice: 0
  });

  const [trackingNumber, setTrackingNumber] = useState('');

  const calculatePrice = () => {
    const basePrice = 2000;
    const weightPrice = parseFloat(formData.weight) * 500;
    const insurancePrice = formData.insurance ? 2000 : 0;
    const expressPrice = formData.express ? 5000 : 0;
    const fragilePrice = formData.fragile ? 1000 : 0;
    
    return basePrice + weightPrice + insurancePrice + expressPrice + fragilePrice;
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Générer le numéro de tracking et l'étiquette
      const newTrackingNumber = 'BD' + Date.now().toString().slice(-8);
      setTrackingNumber(newTrackingNumber);
      setFormData({...formData, calculatedPrice: calculatePrice()});
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const downloadLabel = () => {
    // Simulation de téléchargement d'étiquette
    const labelContent = `
      BantuDelice Colis
      Numéro de tracking: ${trackingNumber}
      
      Expéditeur:
      ${formData.senderName}
      ${formData.senderAddress}
      ${formData.senderCity}
      
      Destinataire:
      ${formData.recipientName}
      ${formData.recipientAddress}
      ${formData.recipientCity}
      
      Colis: ${formData.description}
      Poids: ${formData.weight}kg
      Prix: ${formData.calculatedPrice} FCFA
    `;
    
    const blob = new Blob([labelContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `etiquette-${trackingNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="font-medium">Expéditeur</span>
            </div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="font-medium">Destinataire</span>
            </div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="font-medium">Colis</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-orange-500 h-2 rounded-full transition-all duration-300" style={{width: `${(step / 3) * 100}%`}}></div>
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Send className="h-6 w-6" />
              {step === 1 && 'Informations expéditeur'}
              {step === 2 && 'Informations destinataire'}
              {step === 3 && 'Détails du colis'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
                    <Input 
                      placeholder="Votre nom"
                      value={formData.senderName}
                      onChange={(e) => setFormData({...formData, senderName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                    <Input 
                      placeholder="+242 06 12 34 56"
                      value={formData.senderPhone}
                      onChange={(e) => setFormData({...formData, senderPhone: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input 
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.senderEmail}
                    onChange={(e) => setFormData({...formData, senderEmail: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
                  <Textarea 
                    placeholder="Votre adresse complète"
                    value={formData.senderAddress}
                    onChange={(e) => setFormData({...formData, senderAddress: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                  <Select value={formData.senderCity} onValueChange={(value) => setFormData({...formData, senderCity: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une ville" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Brazzaville">Brazzaville</SelectItem>
                      <SelectItem value="Pointe-Noire">Pointe-Noire</SelectItem>
                      <SelectItem value="Dolisie">Dolisie</SelectItem>
                      <SelectItem value="Nkayi">Nkayi</SelectItem>
                      <SelectItem value="Ouesso">Ouesso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
                    <Input 
                      placeholder="Nom du destinataire"
                      value={formData.recipientName}
                      onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                    <Input 
                      placeholder="+242 06 12 34 56"
                      value={formData.recipientPhone}
                      onChange={(e) => setFormData({...formData, recipientPhone: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input 
                    type="email"
                    placeholder="destinataire@email.com"
                    value={formData.recipientEmail}
                    onChange={(e) => setFormData({...formData, recipientEmail: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
                  <Textarea 
                    placeholder="Adresse complète du destinataire"
                    value={formData.recipientAddress}
                    onChange={(e) => setFormData({...formData, recipientAddress: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                  <Select value={formData.recipientCity} onValueChange={(value) => setFormData({...formData, recipientCity: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une ville" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Brazzaville">Brazzaville</SelectItem>
                      <SelectItem value="Pointe-Noire">Pointe-Noire</SelectItem>
                      <SelectItem value="Dolisie">Dolisie</SelectItem>
                      <SelectItem value="Nkayi">Nkayi</SelectItem>
                      <SelectItem value="Ouesso">Ouesso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type de colis</label>
                    <Select value={formData.packageType} onValueChange={(value) => setFormData({...formData, packageType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="express">Express</SelectItem>
                        <SelectItem value="fragile">Fragile</SelectItem>
                        <SelectItem value="heavy">Lourd</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Poids (kg) *</label>
                    <Input 
                      type="number"
                      placeholder="1.5"
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions (cm)</label>
                  <Input 
                    placeholder="30x20x10"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description du contenu</label>
                  <Textarea 
                    placeholder="Décrivez le contenu de votre colis"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800">Options supplémentaires</h3>
                  <div className="space-y-3">
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
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="fragile"
                        checked={formData.fragile}
                        onChange={(e) => setFormData({...formData, fragile: e.target.checked})}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="fragile" className="text-sm font-medium text-gray-700">
                        Colis fragile (+1000 FCFA)
                      </label>
                    </div>
                  </div>
                </div>

                {/* Calcul du prix */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">Prix estimé :</span>
                    <span className="text-2xl font-bold text-orange-600">{calculatePrice().toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>
            )}

            {/* Boutons de navigation */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <Button onClick={handlePrevious} variant="outline" className="border-orange-300 text-orange-700">
                  Précédent
                </Button>
              )}
              <div className="ml-auto">
                {step < 3 ? (
                  <Button onClick={handleNext} className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-bold">
                    Suivant
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-bold">
                    Confirmer l'envoi
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confirmation et étiquette */}
        {trackingNumber && (
          <Card className="mt-8 bg-white/90 backdrop-blur border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Package className="h-6 w-6" />
                Envoi confirmé !
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="text-2xl font-bold text-green-700 mb-2">
                    Numéro de tracking : {trackingNumber}
                  </div>
                  <p className="text-green-600">Votre colis a été enregistré avec succès</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-800 mb-2">Expéditeur</h4>
                    <p className="text-sm text-gray-600">{formData.senderName}</p>
                    <p className="text-sm text-gray-600">{formData.senderAddress}</p>
                    <p className="text-sm text-gray-600">{formData.senderCity}</p>
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-800 mb-2">Destinataire</h4>
                    <p className="text-sm text-gray-600">{formData.recipientName}</p>
                    <p className="text-sm text-gray-600">{formData.recipientAddress}</p>
                    <p className="text-sm text-gray-600">{formData.recipientCity}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={downloadLabel} className="bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger l'étiquette
                  </Button>
                  <Button asChild className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-bold">
                    <Link to={`/colis/tracking?number=${trackingNumber}`}>
                      Suivre ce colis
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-2">Ajouter des photos du colis</h4>
                <ColisImageUpload 
                  colisId={trackingNumber} 
                  onUploadSuccess={() => console.log('Upload réussi sur la page Expédier')}
                  onImagesUpload={() => {}}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ColisExpedierPage; 