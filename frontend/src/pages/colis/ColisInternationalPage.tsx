import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Package, User, MapPin, Calculator, Download, Send, Shield, Clock, Globe, FileText } from 'lucide-react';
import ColisImageUpload from './ColisExpedierPage';

type FormData = {
  expediteur: string;
  destinataire: string;
  adresse: string;
  paysDestination: string;
  poids: string;
  description: string;
  service: string;
  documents: string[];
  declarationDouane: boolean;
};

const COUNTRIES = [
  "France", "Belgique", "Allemagne", "Espagne", "Italie", 
  "États-Unis", "Canada", "Côte d'Ivoire", "Sénégal", "Cameroun"
];

const SERVICES = [
  { value: "express", label: "Express (3-5 jours)", price: 25000 },
  { value: "standard", label: "Standard (7-10 jours)", price: 15000 },
  { value: "economy", label: "Économique (10-15 jours)", price: 10000 }
];

const DOCUMENTS = [
  { value: "facture", label: "Facture commerciale" },
  { value: "cni", label: "Copie CNI" },
  { value: "certificat", label: "Certificat d'origine" }
];

const ColisInternationalPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    expediteur: '',
    destinataire: '',
    adresse: '',
    paysDestination: '',
    poids: '',
    description: '',
    service: 'standard',
    documents: [],
    declarationDouane: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [generatedColisId, setGeneratedColisId] = useState<string | null>(null);
  const [uploadCompleted, setUploadCompleted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: keyof FormData, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const calculateEstimatedCost = () => {
    if (!formData.poids || !formData.paysDestination || !formData.service) return null;
    
    const selectedService = SERVICES.find(s => s.value === formData.service);
    let basePrice = selectedService?.price || 15000;
    
    const countrySurcharge = ["États-Unis", "Canada"].includes(formData.paysDestination) ? 5000 : 0;
    const weightSurcharge = parseFloat(formData.poids) > 5 ? 3000 : 0;
    const documentsSurcharge = formData.documents.length > 1 ? 2000 : 0;
    
    return basePrice + countrySurcharge + weightSurcharge + documentsSurcharge;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.declarationDouane) {
      alert("Vous devez accepter la déclaration douanière");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulation d'appel API
      const mockResponse = await new Promise((resolve) => 
        setTimeout(() => resolve({ 
          success: true, 
          colisId: `INT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          trackingNumber: `TRK${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`
        }), 1500)
      );

      if (mockResponse.success) {
        setGeneratedColisId(mockResponse.colisId);
        setSubmitSuccess(true);
      }
    } catch (error) {
      console.error("Erreur de soumission", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadComplete = () => {
    setUploadCompleted(true);
    setTimeout(() => navigate(`/colis/tracking/${generatedColisId}`), 3000);
  };

  const estimatedCost = calculateEstimatedCost();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      {/* Header inchangé */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/images/logo/logo.png" alt="BantuDelice" className="h-10 w-10 rounded-full border-2 border-blue-400 shadow" />
              <span className="font-bold text-blue-700 text-xl">Colis International</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/colis" className="text-blue-700 hover:text-blue-900 font-medium">Accueil</Link>
              <Link to="/colis/tracking" className="text-blue-700 hover:text-blue-900 font-medium">Suivi</Link>
              <Link to="/colis/tarifs" className="text-blue-700 hover:text-blue-900 font-medium">Tarifs</Link>
              <Link to="/colis/expedier" className="text-blue-700 hover:text-blue-900 font-medium">Expédier</Link>
              <Link to="/colis/historique" className="text-blue-700 hover:text-blue-900 font-medium">Historique</Link>
            </nav>
            <Button asChild className="bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold">
              <Link to="/colis/tracking">Suivre un colis</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white/90 backdrop-blur border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Globe className="h-6 w-6" />
              Expédition internationale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-700">Envoyez vos colis dans le monde entier avec nos partenaires internationaux. Livraison rapide, suivi universel, assurance premium.</p>
            
            {!submitSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expediteur" className="block text-sm font-medium text-gray-700 mb-1">
                      <User className="inline h-4 w-4 mr-1" />
                      Expéditeur
                    </label>
                    <Input
                      id="expediteur"
                      name="expediteur"
                      value={formData.expediteur}
                      onChange={handleChange}
                      required
                      placeholder="Nom complet"
                    />
                  </div>

                  <div>
                    <label htmlFor="destinataire" className="block text-sm font-medium text-gray-700 mb-1">
                      <User className="inline h-4 w-4 mr-1" />
                      Destinataire
                    </label>
                    <Input
                      id="destinataire"
                      name="destinataire"
                      value={formData.destinataire}
                      onChange={handleChange}
                      required
                      placeholder="Nom complet"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Adresse de livraison
                  </label>
                  <Textarea
                    id="adresse"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    required
                    placeholder="Adresse complète avec code postal"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="paysDestination" className="block text-sm font-medium text-gray-700 mb-1">
                      <Globe className="inline h-4 w-4 mr-1" />
                      Pays de destination
                    </label>
                    <Select 
                      value={formData.paysDestination} 
                      onValueChange={(value) => handleSelectChange('paysDestination', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un pays" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="poids" className="block text-sm font-medium text-gray-700 mb-1">
                      <Package className="inline h-4 w-4 mr-1" />
                      Poids (kg)
                    </label>
                    <Input
                      id="poids"
                      name="poids"
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={formData.poids}
                      onChange={handleChange}
                      required
                      placeholder="0.5"
                    />
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                      <Clock className="inline h-4 w-4 mr-1" />
                      Service de livraison
                    </label>
                    <Select 
                      value={formData.service} 
                      onValueChange={(value) => handleSelectChange('service', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un service" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICES.map(service => (
                          <SelectItem key={service.value} value={service.value}>{service.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    <Package className="inline h-4 w-4 mr-1" />
                    Description du contenu
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Décrivez précisément le contenu pour les formalités douanières"
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FileText className="inline h-4 w-4 mr-1" />
                    Documents requis
                  </label>
                  <Select 
                    value={formData.documents} 
                    onValueChange={(value) => handleSelectChange('documents', value)}
                    multiple
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez les documents" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCUMENTS.map(doc => (
                        <SelectItem key={doc.value} value={doc.value}>{doc.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">Sélectionnez les documents que vous joindrez</p>
                </div>

                <div className="pt-2">
                  <label className="flex items-start space-x-2">
                    <Checkbox 
                      id="douane" 
                      checked={formData.declarationDouane}
                      onCheckedChange={(checked) => handleCheckboxChange('declarationDouane', !!checked)}
                      required
                    />
                    <span className="text-sm font-medium leading-none">
                      Je certifie que les informations fournies sont exactes et complètes pour les formalités douanières.
                      Toute fausse déclaration peut entraîner des pénalités.
                    </span>
                  </label>
                </div>

                {estimatedCost && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-blue-700">Estimation du coût:</span>
                      <span className="font-bold text-lg">{estimatedCost.toLocaleString()} FCFA</span>
                    </div>
                    <div className="text-sm text-blue-600 mt-1">
                      Inclut l'assurance de base et le suivi international
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        En cours...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer le colis
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-bold text-green-800 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Colis international créé avec succès
                  </h3>
                  <p className="mt-2">
                    Votre numéro de suivi: <span className="font-mono font-bold">{generatedColisId}</span>
                  </p>
                  <p className="mt-1 text-sm">
                    Vous pouvez maintenant ajouter des photos ou documents supplémentaires pour faciliter le traitement douanier.
                  </p>
                </div>

                <ColisImageUpload 
                  colisId={generatedColisId!} 
                  onUploadSuccess={handleUploadComplete}
                />

                {uploadCompleted && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <p className="text-blue-700">Téléversement terminé! Redirection vers le suivi...</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section tarifs, partenaires, etc. */}
        <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Calculator className="h-6 w-6" />
              Tarifs & Partenaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="mb-4 text-gray-700 list-disc pl-6">
              <li>Livraison express vers l'Europe, l'Afrique, l'Asie, l'Amérique</li>
              <li>Partenaires : DHL, FedEx, UPS, La Poste, etc.</li>
              <li>Assurance premium jusqu'à 500 000 FCFA</li>
              <li>Tarifs à partir de 15 000 FCFA selon la destination</li>
            </ul>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                <span className="font-medium text-center">Assurance incluse</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                <Globe className="h-8 w-8 text-blue-600 mb-2" />
                <span className="font-medium text-center">200+ pays</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                <Clock className="h-8 w-8 text-blue-600 mb-2" />
                <span className="font-medium text-center">Suivi en temps réel</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                <Download className="h-8 w-8 text-blue-600 mb-2" />
                <span className="font-medium text-center">Documents inclus</span>
              </div>
            </div>
            
            <Badge className="bg-blue-200 text-blue-700 mt-4">Service international</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ColisInternationalPage;