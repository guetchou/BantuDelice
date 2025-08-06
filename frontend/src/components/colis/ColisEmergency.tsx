import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertTriangle, 
  Phone, 
  MessageSquare, 
  Camera, 
  FileText,
  Clock,
  MapPin,
  User,
  Package,
  QrCode,
  Download,
  Share2,
  CheckCircle,
  X,
  Zap,
  Shield,
  Truck,
  ArrowLeft
} from 'lucide-react';

interface EmergencyAction {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<unknown>;
  color: string;
  available: boolean;
}

interface EmergencyReport {
  trackingNumber: string;
  issue: string;
  description: string;
  location?: string;
  photos: File[];
  contactPhone: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

const ColisEmergency: React.FC = () => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [report, setReport] = useState<EmergencyReport>({
    trackingNumber: '',
    issue: '',
    description: '',
    photos: [],
    contactPhone: '',
    urgency: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emergencyId, setEmergencyId] = useState<string | null>(null);

  const emergencyActions: EmergencyAction[] = [
    {
      id: 'damaged',
      name: 'Colis endommagé',
      description: 'Signaler un colis endommagé ou détérioré',
      icon: Package,
      color: 'bg-red-100 text-red-800',
      available: true
    },
    {
      id: 'lost',
      name: 'Colis perdu',
      description: 'Colis non reçu ou perdu en transit',
      icon: AlertTriangle,
      color: 'bg-orange-100 text-orange-800',
      available: true
    },
    {
      id: 'delayed',
      name: 'Retard de livraison',
      description: 'Colis en retard par rapport à l\'estimation',
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-800',
      available: true
    },
    {
      id: 'wrong_address',
      name: 'Mauvaise adresse',
      description: 'Changer l\'adresse de livraison',
      icon: MapPin,
      color: 'bg-blue-100 text-blue-800',
      available: true
    },
    {
      id: 'cancel',
      name: 'Annuler l\'envoi',
      description: 'Annuler l\'expédition avant livraison',
      icon: X,
      color: 'bg-gray-100 text-gray-800',
      available: true
    },
    {
      id: 'return',
      name: 'Retour d\'expédition',
      description: 'Retourner un colis reçu',
      icon: Truck,
      color: 'bg-purple-100 text-purple-800',
      available: true
    }
  ];

  const urgencyLevels = [
    { id: 'low', name: 'Faible', color: 'bg-green-100 text-green-800', description: 'Problème mineur' },
    { id: 'medium', name: 'Moyenne', color: 'bg-yellow-100 text-yellow-800', description: 'Problème modéré' },
    { id: 'high', name: 'Élevée', color: 'bg-orange-100 text-orange-800', description: 'Problème important' },
    { id: 'critical', name: 'Critique', color: 'bg-red-100 text-red-800', description: 'Urgence immédiate' }
  ];

  const handleEmergencyActivation = () => {
    setIsEmergencyActive(true);
    // Générer un ID d'urgence unique
    setEmergencyId('SOS-' + Date.now().toString().slice(-6));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setReport({ ...report, photos: [...report.photos, ...files] });
  };

  const removePhoto = (index: number) => {
    const newPhotos = report.photos.filter((_, i) => i !== index);
    setReport({ ...report, photos: newPhotos });
  };

  const submitEmergencyReport = async () => {
    setIsSubmitting(true);
    
    try {
      // Simuler l'envoi du rapport d'urgence
      console.log('Rapport d\'urgence soumis:', report);
      
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simuler une réponse
      console.log('Rapport traité avec succès');
      
      // Réinitialiser le formulaire
      setReport({
        trackingNumber: '',
        issue: '',
        description: '',
        photos: [],
        contactPhone: '',
        urgency: 'medium'
      });
      setSelectedAction(null);
      setIsEmergencyActive(false);
      
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getActionIcon = (actionId: string) => {
    const action = emergencyActions.find(a => a.id === actionId);
    return action ? <action.icon className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />;
  };

  const getActionColor = (actionId: string) => {
    const action = emergencyActions.find(a => a.id === actionId);
    return action ? action.color : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          SOS Colis - Support d'Urgence
        </h2>
        <p className="text-gray-600">
          Assistance immédiate pour tous vos problèmes d'expédition
        </p>
      </div>

      {!isEmergencyActive ? (
        /* Bouton d'activation d'urgence */
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Besoin d'aide urgente ?
              </h3>
              <p className="text-gray-600">
                Notre équipe d'urgence est disponible 24h/24 pour vous assister
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <Phone className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Support téléphonique</p>
                <p className="text-xs text-gray-500">24h/24</p>
              </div>
              <div className="text-center">
                <MessageSquare className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Chat en ligne</p>
                <p className="text-xs text-gray-500">Réponse immédiate</p>
              </div>
            </div>

            <Button
              onClick={handleEmergencyActivation}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
            >
              <AlertTriangle className="h-5 w-5 mr-2" />
              Activer le Mode Urgence
            </Button>

            <p className="text-xs text-gray-500 mt-4">
              Temps de réponse garanti : moins de 30 minutes
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Interface d'urgence */
        <div className="space-y-6">
          {/* En-tête d'urgence */}
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-900">Mode Urgence Activé</h3>
                    <p className="text-sm text-red-700">ID: {emergencyId}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEmergencyActive(false)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sélection de l'action */}
          {!selectedAction ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Sélectionnez le type de problème
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {emergencyActions.map((action) => (
                    <Button
                      key={action.id}
                      variant="outline"
                      className={`h-auto p-4 justify-start ${action.available ? '' : 'opacity-50 cursor-not-allowed'}`}
                      onClick={() => action.available && setSelectedAction(action.id)}
                      disabled={!action.available}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <action.icon className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{action.name}</div>
                          <div className="text-sm text-gray-600">{action.description}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Formulaire de rapport */
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getActionIcon(selectedAction)}
                  Rapport d'urgence - {emergencyActions.find(a => a.id === selectedAction)?.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Numéro de tracking */}
                <div>
                  <label className="block text-sm font-medium mb-2">Numéro de tracking *</label>
                  <Input
                    placeholder="Ex: BD123456"
                    value={report.trackingNumber}
                    onChange={(e) => setReport({...report, trackingNumber: e.target.value})}
                  />
                </div>

                {/* Niveau d'urgence */}
                <div>
                  <label className="block text-sm font-medium mb-2">Niveau d'urgence</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {urgencyLevels.map((level) => (
                      <Button
                        key={level.id}
                        variant={report.urgency === level.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setReport({...report, urgency: level.id as any})}
                        className="justify-start"
                      >
                        <div className="flex items-center gap-2">
                          <Badge className={level.color}>
                            {level.name}
                          </Badge>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Description du problème */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description détaillée *</label>
                  <Textarea
                    placeholder="Décrivez le problème en détail..."
                    rows={4}
                    value={report.description}
                    onChange={(e) => setReport({...report, description: e.target.value})}
                  />
                </div>

                {/* Photos */}
                <div>
                  <label className="block text-sm font-medium mb-2">Photos (optionnel)</label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('photo-upload')?.click()}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Ajouter des photos
                      </Button>
                      <input
                        id="photo-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </div>
                    
                    {report.photos.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {report.photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 w-6 h-6 p-0"
                              onClick={() => removePhoto(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-sm font-medium mb-2">Téléphone de contact *</label>
                  <Input
                    type="tel"
                    placeholder="06 12 34 56 78"
                    value={report.contactPhone}
                    onChange={(e) => setReport({...report, contactPhone: e.target.value})}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedAction(null)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour
                  </Button>
                  <Button
                    onClick={submitEmergencyReport}
                    disabled={isSubmitting || !report.trackingNumber || !report.description || !report.contactPhone}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Envoyer le rapport d'urgence
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informations d'urgence */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Assistance d'urgence disponible</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• Support téléphonique 24h/24 : +242 06 123 45 67</p>
                    <p>• Chat en ligne avec réponse immédiate</p>
                    <p>• Intervention sur site si nécessaire</p>
                    <p>• Remboursement ou remplacement rapide</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ColisEmergency; 