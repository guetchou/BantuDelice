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
  Package, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  Phone,
  FileText,
  Upload,
  Send,
  CheckCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ColisReclamationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    trackingNumber: '',
    type: '',
    description: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    priority: 'normal'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation de soumission
    setIsSubmitted(true);
  };

  const reclamationTypes = [
    { value: 'delivery_delay', label: 'Retard de livraison' },
    { value: 'damaged_package', label: 'Colis endommagé' },
    { value: 'lost_package', label: 'Colis perdu' },
    { value: 'wrong_address', label: 'Mauvaise adresse' },
    { value: 'missing_items', label: 'Articles manquants' },
    { value: 'other', label: 'Autre' }
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
                Réclamation soumise avec succès
              </h2>
              <p className="text-gray-600 mb-6">
                Votre réclamation a été enregistrée. Notre équipe vous contactera dans les 24h.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Numéro de suivi :</strong> {formData.trackingNumber}
                </p>
              </div>
              <Button 
                onClick={() => setIsSubmitted(false)}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
              >
                Nouvelle réclamation
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
            Déposer une réclamation
          </h1>
          <p className="text-lg text-gray-600">
            Nous sommes là pour vous aider à résoudre votre problème
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="md:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6" />
                  Formulaire de réclamation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="trackingNumber">Numéro de tracking *</Label>
                    <Input
                      id="trackingNumber"
                      value={formData.trackingNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, trackingNumber: e.target.value }))}
                      placeholder="Ex: BD123456 ou DHL123456789"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Type de réclamation *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le type de réclamation" />
                      </SelectTrigger>
                      <SelectContent>
                        {reclamationTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority">Priorité</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Basse</SelectItem>
                        <SelectItem value="normal">Normale</SelectItem>
                        <SelectItem value="high">Haute</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description détaillée *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Décrivez votre problème en détail..."
                      rows={5}
                      required
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
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Soumettre la réclamation
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
                  <Clock className="h-5 w-5 text-orange-500" />
                  Délais de traitement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Réclamation normale</span>
                  <Badge variant="secondary">24h</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Réclamation urgente</span>
                  <Badge variant="destructive">4h</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Résolution complète</span>
                  <Badge variant="outline">3-5 jours</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-500" />
                  Contact rapide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>+242 06 XXX XXX</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>support@bantudelice.cg</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Lun-Ven: 8h-18h</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-500" />
                  Conseils
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Fournissez le numéro de tracking exact</li>
                  <li>• Décrivez le problème en détail</li>
                  <li>• Joignez des photos si possible</li>
                  <li>• Gardez une copie de votre réclamation</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColisReclamationPage; 