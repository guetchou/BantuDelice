import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Package, 
  MapPin, 
  Phone, 
  Mail, 
  Download, 
  Share2, 
  ArrowLeft,
  Calendar,
  Truck,
  FileText,
  Copy,
  Printer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExpeditionData {
  trackingNumber: string;
  sender: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    country: string;
  };
  recipient: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    country: string;
  };
  package: {
    weight: number;
    dimensions: string;
    contents: string;
    declaredValue: number;
  };
  insurance: {
    amount: number;
    currency: string;
  };
  paymentResult: {
    transactionId: string;
    amount: number;
    method: string;
  };
  service: string;
  type: string;
  createdAt: string;
}

const ExpeditionConfirmationPage: React.FC = () => {
  const { trackingNumber } = useParams<{ trackingNumber: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [expeditionData, setExpeditionData] = useState<ExpeditionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer les données depuis localStorage
    const storedData = localStorage.getItem('expeditionData');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setExpeditionData(data);
      } catch (error) {
        console.error('Erreur lors du parsing des données:', error);
      }
    }
    setLoading(false);
  }, [trackingNumber]);

  const handleCopyTrackingNumber = () => {
    if (expeditionData?.trackingNumber) {
      navigator.clipboard.writeText(expeditionData.trackingNumber);
      toast({
        title: "Numéro copié !",
        description: "Le numéro de tracking a été copié dans le presse-papiers",
      });
    }
  };

  const handleDownloadReceipt = () => {
    if (!expeditionData) return;

    const receiptContent = `
=== RÉCÉPISSÉ D'EXPÉDITION BANTUDELICE ===

Numéro de Tracking: ${expeditionData.trackingNumber}
Date de création: ${new Date().toLocaleDateString('fr-FR')}
Heure: ${new Date().toLocaleTimeString('fr-FR')}

=== INFORMATIONS EXPÉDITEUR ===
Nom: ${expeditionData.sender.name}
Téléphone: ${expeditionData.sender.phone}
Email: ${expeditionData.sender.email}
Adresse: ${expeditionData.sender.address}
Ville: ${expeditionData.sender.city}
Pays: ${expeditionData.sender.country}

=== INFORMATIONS DESTINATAIRE ===
Nom: ${expeditionData.recipient.name}
Téléphone: ${expeditionData.recipient.phone}
Email: ${expeditionData.recipient.email}
Adresse: ${expeditionData.recipient.address}
Ville: ${expeditionData.recipient.city}
Pays: ${expeditionData.recipient.country}

=== DÉTAILS DU COLIS ===
Type: ${expeditionData.type}
Service: ${expeditionData.service}
Poids: ${expeditionData.package.weight} kg
Dimensions: ${expeditionData.package.dimensions}
Contenu: ${expeditionData.package.contents}
Valeur déclarée: ${expeditionData.package.declaredValue} ${expeditionData.insurance.currency}

=== PAIEMENT ===
Montant: ${expeditionData.paymentResult.amount} ${expeditionData.insurance.currency}
Méthode: ${expeditionData.paymentResult.method}
Transaction ID: ${expeditionData.paymentResult.transactionId}

=== ASSURANCE ===
Montant assuré: ${expeditionData.insurance.amount} ${expeditionData.insurance.currency}

=== CONDITIONS ===
- Ce récépissé doit être présenté lors du retrait
- Conservez ce numéro de tracking pour le suivi
- Les notifications seront envoyées par SMS et email
- Délai de livraison estimé: 2-5 jours ouvrés

Merci de votre confiance !
BantuDelice - Votre partenaire logistique de confiance
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recu-expedition-${expeditionData.trackingNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Reçu téléchargé !",
      description: "Le récépissé a été téléchargé avec succès",
    });
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share && expeditionData) {
      navigator.share({
        title: 'Expédition BantuDelice',
        text: `Mon colis a été expédié ! Numéro de tracking: ${expeditionData.trackingNumber}`,
        url: window.location.href,
      });
    } else {
      handleCopyTrackingNumber();
    }
  };

  const handleNewExpedition = () => {
    navigate('/colis/expedition');
  };

  const handleTrackColis = () => {
    if (expeditionData?.trackingNumber) {
      navigate(`/colis/tracking/${expeditionData.trackingNumber}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la confirmation...</p>
        </div>
      </div>
    );
  }

  if (!expeditionData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Aucune expédition trouvée</h2>
          <p className="text-gray-600 mb-4">Les données d'expédition ne sont pas disponibles</p>
          <Button onClick={() => navigate('/colis/expedition')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Nouvelle expédition
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Expédition Confirmée !</h1>
          </div>
          <p className="text-lg text-gray-600">
            Votre colis a été créé avec succès et est en cours de traitement
          </p>
        </div>

        {/* Numéro de tracking principal */}
        <Card className="mb-6 border-2 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Numéro de Tracking</h2>
              <div className="flex items-center justify-center gap-4">
                <Badge variant="secondary" className="text-xl px-4 py-2 font-mono">
                  {expeditionData.trackingNumber}
                </Badge>
                <Button variant="outline" size="sm" onClick={handleCopyTrackingNumber}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copier
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Informations expéditeur */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-orange-500" />
                Expéditeur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-gray-900">{expeditionData.sender.name}</p>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{expeditionData.sender.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>{expeditionData.sender.city}, {expeditionData.sender.country}</span>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{expeditionData.sender.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{expeditionData.sender.email}</span>
              </div>
            </CardContent>
          </Card>

          {/* Informations destinataire */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-500" />
                Destinataire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-gray-900">{expeditionData.recipient.name}</p>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{expeditionData.recipient.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>{expeditionData.recipient.city}, {expeditionData.recipient.country}</span>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{expeditionData.recipient.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{expeditionData.recipient.email}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Détails du colis */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-500" />
              Détails du Colis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type d'expédition:</span>
                  <Badge variant="outline">{expeditionData.type}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <Badge variant="outline">{expeditionData.service}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Poids:</span>
                  <span className="font-semibold">{expeditionData.package.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dimensions:</span>
                  <span className="font-semibold">{expeditionData.package.dimensions}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Contenu:</span>
                  <span className="font-semibold">{expeditionData.package.contents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valeur déclarée:</span>
                  <span className="font-semibold">{expeditionData.package.declaredValue} {expeditionData.insurance.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Montant assuré:</span>
                  <span className="font-semibold text-green-600">{expeditionData.insurance.amount} {expeditionData.insurance.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Méthode de paiement:</span>
                  <Badge variant="outline">{expeditionData.paymentResult.method}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button onClick={handleTrackColis} className="bg-blue-600 hover:bg-blue-700">
            <Truck className="h-4 w-4 mr-2" />
            Suivre mon colis
          </Button>
          <Button onClick={handleDownloadReceipt} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Télécharger le reçu
          </Button>
          <Button onClick={handlePrintReceipt} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <Button onClick={handleShare} variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
          <Button onClick={handleNewExpedition} className="bg-orange-600 hover:bg-orange-700">
            <Package className="h-4 w-4 mr-2" />
            Nouvelle expédition
          </Button>
        </div>

        {/* Informations importantes */}
        <Card className="mt-8 border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-orange-800 mb-3">Informations importantes</h3>
            <ul className="space-y-2 text-sm text-orange-700">
              <li>• Conservez ce numéro de tracking pour le suivi de votre colis</li>
              <li>• Vous recevrez des notifications par SMS et email</li>
              <li>• Délai de livraison estimé : 2-5 jours ouvrés</li>
              <li>• Ce récépissé doit être présenté lors du retrait</li>
              <li>• Pour toute question, contactez notre service client</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpeditionConfirmationPage; 