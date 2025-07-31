import React, { useState } from 'react';
import NavbarColis from '@/components/colis/NavbarColis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { colisProductionService } from '@/services/colisProductionService';
import { ProfessionalPDFGenerator, PDFDocumentData } from '@/utils/professionalPDFGenerator';
import { 
  Package, 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Truck, 
  Plane,
  Ship,
  AlertTriangle,
  QrCode,
  Download,
  Share2,
  Phone,
  Mail,
  Info,
  ExternalLink,
  FileText,
  Receipt,
  CreditCard,
  Bell,
  Globe,
  Shield,
  ArrowRight,
  Calendar,
  User,
  Building
} from 'lucide-react';

const ColisTrackingPageClean: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      setError('Veuillez saisir un numéro de tracking');
      return;
    }

    // Validation du format
    if (!colisProductionService.validateTrackingNumber(trackingNumber)) {
      setError('Format de numéro de tracking invalide. Utilisez BD123456 (national) ou DHL123456789 (international)');
      return;
    }

    setIsLoading(true);
    setError('');
    setTrackingInfo(null);

    try {
      const info = await colisProductionService.trackParcel(trackingNumber);
      setTrackingInfo(info);
    } catch (err: any) {
      if (err.message === 'NOT_FOUND') {
        setError('Colis non trouvé. Vérifiez votre numéro de tracking ou contactez le support.');
      } else if (err.message === 'NETWORK_ERROR') {
        setError('Erreur réseau. Vérifiez votre connexion internet et réessayez.');
      } else {
        setError('Erreur lors de la recherche du colis. Veuillez réessayer.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour télécharger l'étiquette PDF
  const handleDownloadLabel = () => {
    if (!trackingInfo) return;
    
    try {
      const pdfData: PDFDocumentData = {
        trackingNumber: trackingInfo.trackingNumber,
        type: 'label',
        carrier: trackingInfo.carrier,
        service: trackingInfo.service,
        date: new Date().toLocaleDateString('fr-FR'),
        sender: {
          name: 'BantuDelice',
          address: '123 Avenue de la République, Brazzaville',
          phone: '+242 06 123 4567',
          email: 'contact@bantudelice.com'
        },
        recipient: trackingInfo.recipient,
        items: trackingInfo.items || [],
        total: trackingInfo.total || 0
      };
      
      ProfessionalPDFGenerator.generatePDF(pdfData);
    } catch (error) {
      console.error('Erreur lors de la génération de l\'étiquette:', error);
    }
  };

  // Fonction pour télécharger le reçu PDF
  const handleDownloadReceipt = () => {
    if (!trackingInfo) return;
    
    try {
      const pdfData: PDFDocumentData = {
        trackingNumber: trackingInfo.trackingNumber,
        type: 'receipt',
        carrier: trackingInfo.carrier,
        service: trackingInfo.service,
        date: new Date().toLocaleDateString('fr-FR'),
        sender: {
          name: 'BantuDelice',
          address: '123 Avenue de la République, Brazzaville',
          phone: '+242 06 123 4567',
          email: 'contact@bantudelice.com'
        },
        recipient: trackingInfo.recipient,
        items: trackingInfo.items || [],
        total: trackingInfo.total || 0
      };
      
      ProfessionalPDFGenerator.generatePDF(pdfData);
    } catch (error) {
      console.error('Erreur lors de la génération du reçu:', error);
    }
  };

  // Fonction pour télécharger la facture PDF
  const handleDownloadInvoice = () => {
    if (!trackingInfo) return;
    
    try {
      const pdfData: PDFDocumentData = {
        trackingNumber: trackingInfo.trackingNumber,
        type: 'invoice',
        carrier: trackingInfo.carrier,
        service: trackingInfo.service,
        date: new Date().toLocaleDateString('fr-FR'),
        sender: {
          name: 'BantuDelice',
          address: '123 Avenue de la République, Brazzaville',
          phone: '+242 06 123 4567',
          email: 'contact@bantudelice.com'
        },
        recipient: trackingInfo.recipient,
        items: trackingInfo.items || [],
        total: trackingInfo.total || 0
      };
      
      ProfessionalPDFGenerator.generatePDF(pdfData);
    } catch (error) {
      console.error('Erreur lors de la génération de la facture:', error);
    }
  };

  // Fonction pour partager le tracking
  const handleShareTracking = () => {
    if (!trackingInfo) return;
    
    const shareText = `Suivez mon colis ${trackingInfo.trackingNumber} sur BantuDelice: ${window.location.origin}/colis/tracking?code=${trackingInfo.trackingNumber}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Suivi de colis BantuDelice',
        text: shareText,
        url: `${window.location.origin}/colis/tracking?code=${trackingInfo.trackingNumber}`
      });
    } else {
      navigator.clipboard.writeText(shareText);
      // Ici vous pourriez afficher une notification de succès
    }
  };

  // Fonction pour scanner QR
  const handleScanQR = () => {
    // Implémentation du scanner QR
    console.log('Scanner QR code');
  };

  // Fonction pour contacter le support
  const handleContactSupport = () => {
    window.open('tel:+242061234567', '_blank');
  };

  // Fonction pour envoyer un email
  const handleEmailTracking = () => {
    if (!trackingInfo) return;
    
    const subject = `Suivi colis ${trackingInfo.trackingNumber}`;
    const body = `Bonjour,\n\nJe souhaite des informations sur le suivi de mon colis ${trackingInfo.trackingNumber}.\n\nMerci.`;
    
    window.open(`mailto:support@bantudelice.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  // Fonction pour configurer les notifications
  const handleConfigureNotifications = () => {
    // Implémentation des notifications
    console.log('Configurer les notifications');
  };

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (category: string) => {
    switch (category) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'exception': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Fonction pour obtenir l'icône du statut
  const getStatusIcon = (category: string) => {
    switch (category) {
      case 'delivered': return <CheckCircle className="h-5 w-5" />;
      case 'in_transit': return <Truck className="h-5 w-5" />;
      case 'pending': return <Clock className="h-5 w-5" />;
      case 'exception': return <AlertTriangle className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  // Fonction pour obtenir l'icône du transport
  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'national': return <Truck className="h-5 w-5" />;
      case 'international': return <Plane className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50">
      <NavbarColis />
      
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Suivi de Colis
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Suivez vos colis en temps réel avec notre système de tracking professionnel
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Formulaire de recherche */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-6 w-6" />
              Rechercher un colis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Numéro de tracking (ex: BD123456 ou DHL123456789)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                />
                <div className="mt-2 text-sm text-gray-600">
                  <p className="font-medium mb-1">Formats acceptés :</p>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-orange-500" />
                      <span>National : BD123456 (6 chiffres après BD)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Plane className="h-4 w-4 text-blue-500" />
                      <span>International : DHL123456789 ou UPS123456789</span>
                    </li>
                  </ul>
                </div>
              </div>
              <Button 
                onClick={handleTrack} 
                disabled={isLoading}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-8 py-6 text-lg font-semibold"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Recherche...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Suivre
                  </div>
                )}
              </Button>
            </div>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Résultats du tracking */}
        {trackingInfo && (
          <div className="space-y-6">
            {/* Informations principales */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package className="h-6 w-6" />
                    <span>Informations du colis</span>
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30">
                    {trackingInfo.trackingNumber}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="h-5 w-5 text-orange-500" />
                      Expéditeur
                    </h3>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>Nom :</strong> {trackingInfo.sender?.name || 'BantuDelice'}</p>
                      <p><strong>Adresse :</strong> {trackingInfo.sender?.address || '123 Avenue de la République, Brazzaville'}</p>
                      <p><strong>Téléphone :</strong> {trackingInfo.sender?.phone || '+242 06 123 4567'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Building className="h-5 w-5 text-blue-500" />
                      Destinataire
                    </h3>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>Nom :</strong> {trackingInfo.recipient?.name || 'Client'}</p>
                      <p><strong>Adresse :</strong> {trackingInfo.recipient?.address || 'Adresse de livraison'}</p>
                      <p><strong>Téléphone :</strong> {trackingInfo.recipient?.phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {getTransportIcon(trackingInfo.type)}
                        <span className="font-semibold text-gray-900">Type</span>
                      </div>
                      <p className="text-gray-600 capitalize">{trackingInfo.type || 'Standard'}</p>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Calendar className="h-5 w-5 text-green-500" />
                        <span className="font-semibold text-gray-900">Date d'expédition</span>
                      </div>
                      <p className="text-gray-600">{trackingInfo.shippedDate || 'N/A'}</p>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-purple-500" />
                        <span className="font-semibold text-gray-900">Statut</span>
                      </div>
                      <Badge className={getStatusColor(trackingInfo.status)}>
                        {trackingInfo.status || 'En cours'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline des événements */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-6 w-6 text-blue-500" />
                  Historique du suivi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(trackingInfo.events || []).map((event: any, index: number) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900">{event.title}</h4>
                          <span className="text-sm text-gray-500">{event.timestamp}</span>
                        </div>
                        <p className="text-gray-600">{event.description}</p>
                        {event.location && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Actions disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="outline" onClick={handleScanQR} className="flex flex-col items-center gap-2 h-auto py-3">
                    <QrCode className="h-4 w-4" />
                    <span className="text-xs">Scanner QR</span>
                  </Button>
                  
                  <Button variant="outline" onClick={handleDownloadLabel} className="flex flex-col items-center gap-2 h-auto py-3">
                    <Download className="h-4 w-4" />
                    <span className="text-xs">Étiquette</span>
                  </Button>
                  
                  <Button variant="outline" onClick={handleDownloadReceipt} className="flex flex-col items-center gap-2 h-auto py-3">
                    <Receipt className="h-4 w-4" />
                    <span className="text-xs">Reçu</span>
                  </Button>
                  
                  <Button variant="outline" onClick={handleDownloadInvoice} className="flex flex-col items-center gap-2 h-auto py-3">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-xs">Facture</span>
                  </Button>
                  
                  <Button variant="outline" onClick={handleShareTracking} className="flex flex-col items-center gap-2 h-auto py-3">
                    <Share2 className="h-4 w-4" />
                    <span className="text-xs">Partager</span>
                  </Button>
                  
                  <Button variant="outline" onClick={handleContactSupport} className="flex flex-col items-center gap-2 h-auto py-3">
                    <Phone className="h-4 w-4" />
                    <span className="text-xs">Support</span>
                  </Button>
                  
                  <Button variant="outline" onClick={handleEmailTracking} className="flex flex-col items-center gap-2 h-auto py-3">
                    <Mail className="h-4 w-4" />
                    <span className="text-xs">Email</span>
                  </Button>
                  
                  <Button variant="outline" onClick={handleConfigureNotifications} className="flex flex-col items-center gap-2 h-auto py-3">
                    <Bell className="h-4 w-4" />
                    <span className="text-xs">Notifications</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Informations supplémentaires */}
        {!trackingInfo && !isLoading && (
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Suivez vos colis en temps réel
              </h3>
              <p className="text-gray-600 mb-4">
                Système de tracking professionnel basé sur les standards de l'industrie
              </p>
              <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-500">
                <div>
                  <Truck className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                  <div>Livraison nationale</div>
                </div>
                <div>
                  <Plane className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <div>Livraison internationale</div>
                </div>
                <div>
                  <CheckCircle className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
                  <div>Suivi en temps réel</div>
                </div>
                <div>
                  <Globe className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <div>Standards internationaux</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ColisTrackingPageClean; 