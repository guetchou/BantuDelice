import React, { useState } from 'react';
import NavbarColis from '@/components/colis/NavbarColis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  AlertTriangle, 
  FileText, 
  Clock, 
  User, 
  Mail, 
  Phone,
  Send,
  CheckCircle,
  Shield,
  Scale
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ColisPlaintePage: React.FC = () => {
  const [formData, setFormData] = useState({
    trackingNumber: '',
    type: '',
    description: '',
    impact: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    resolution: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const plainteTypes = [
    { value: 'service_quality', label: 'Qualité de service défaillante' },
    { value: 'staff_behavior', label: 'Comportement du personnel' },
    { value: 'billing_issue', label: 'Problème de facturation' },
    { value: 'delivery_failure', label: 'Échec de livraison répété' },
    { value: 'damage_compensation', label: 'Compensation insuffisante' },
    { value: 'other', label: 'Autre' }
  ];

  const impactLevels = [
    { value: 'low', label: 'Faible - Inconvénient mineur' },
    { value: 'medium', label: 'Moyen - Impact sur le service' },
    { value: 'high', label: 'Élevé - Perte financière' },
    { value: 'critical', label: 'Critique - Impact majeur' }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50">
        <NavbarColis />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <Card className="text-center">
            <CardContent className="p-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Plainte enregistrée
              </h2>
              <p className="text-gray-600 mb-6">
                Votre plainte a été transmise à notre service juridique. Vous recevrez une réponse dans les 48h.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Numéro de référence :</strong> PL-{Date.now().toString().slice(-6)}
                </p>
              </div>
              <Button 
                onClick={() => setIsSubmitted(false)}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
              >
                Nouvelle plainte
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50">
      <NavbarColis />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Déposer une plainte formelle
          </h1>
          <p className="text-lg text-gray-600">
            Pour les problèmes graves nécessitant une intervention formelle
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="md:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6" />
                  Formulaire de plainte formelle
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="trackingNumber">Numéro de tracking concerné</Label>
                    <Input
                      id="trackingNumber"
                      value={formData.trackingNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, trackingNumber: e.target.value }))}
                      placeholder="Ex: BD123456 ou DHL123456789"
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Type de plainte *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le type de plainte" />
                      </SelectTrigger>
                      <SelectContent>
                        {plainteTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="impact">Niveau d'impact *</Label>
                    <Select
                      value={formData.impact}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, impact: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez l'impact" />
                      </SelectTrigger>
                      <SelectContent>
                        {impactLevels.map((impact) => (
                          <SelectItem key={impact.value} value={impact.value}>
                            {impact.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description détaillée *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Décrivez en détail les faits, les circonstances et l'impact..."
                      rows={6}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="resolution">Résolution souhaitée</Label>
                    <Textarea
                      id="resolution"
                      value={formData.resolution}
                      onChange={(e) => setFormData(prev => ({ ...prev, resolution: e.target.value }))}
                      placeholder="Quelle résolution attendez-vous ?"
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactName">Nom complet *</Label>
                      <Input
                        id="contactName"
                        value={formData.contactName}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactEmail">Email *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="contactPhone">Téléphone</Label>
                    <Input
                      id="contactPhone"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                      placeholder="+242 06 XXX XXX"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Soumettre la plainte
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Informations */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-red-500" />
                  Procédure formelle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Accusé de réception</span>
                  <Badge variant="secondary">48h</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Enquête interne</span>
                  <Badge variant="outline">5-10 jours</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Réponse formelle</span>
                  <Badge variant="destructive">15 jours</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Service juridique
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>juridique@bantudelice.cg</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>+242 06 XXX XXX</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Lun-Ven: 9h-17h</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-500" />
                  Informations importantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Les plaintes sont traitées par notre service juridique</li>
                  <li>• Conservez tous les documents relatifs</li>
                  <li>• Une enquête interne sera menée</li>
                  <li>• Vous recevrez une réponse écrite formelle</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColisPlaintePage; 