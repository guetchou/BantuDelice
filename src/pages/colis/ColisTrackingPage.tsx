import React, { useState } from 'react';
import NavbarColis from '@/components/colis/NavbarColis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { colisProductionService } from '@/services/colisProductionService';
import { ProfessionalPDFGenerator, PDFDocumentData } from '@/utils/professionalPDFGenerator';
import ColisTrackingTest from '@/components/colis/ColisTrackingTest';
import BackendTestComponent from '@/components/colis/BackendTestComponent';
import CompleteTestSuite from '@/components/colis/CompleteTestSuite';
import IntegrationTestComponent from '@/components/colis/IntegrationTestComponent';
import ColisRoutesTestComponent from '@/components/colis/ColisRoutesTestComponent';
import AuthTestComponent from '@/components/auth/AuthTestComponent';
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
  TestTube,
  Server,
  Settings,
  Link,
  Route,
  Key
} from 'lucide-react';

const ColisTrackingPage: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTests, setShowTests] = useState(false);
  const [showBackendTests, setShowBackendTests] = useState(false);
  const [showCompleteTests, setShowCompleteTests] = useState(false);
  const [showIntegrationTests, setShowIntegrationTests] = useState(false);
  const [showRoutesTests, setShowRoutesTests] = useState(false);
  const [showAuthTests, setShowAuthTests] = useState(false);

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
          name: trackingInfo.sender.name,
          company: '',
          address: trackingInfo.sender.address,
          city: trackingInfo.sender.city,
          state: '',
          postalCode: '',
          country: trackingInfo.sender.country,
          phone: '',
          email: ''
        },
        recipient: {
          name: trackingInfo.recipient.name,
          company: '',
          address: trackingInfo.recipient.address,
          city: trackingInfo.recipient.city,
          state: '',
          postalCode: '',
          country: trackingInfo.recipient.country,
          phone: '',
          email: ''
        },
        package: {
          weight: trackingInfo.weight,
          dimensions: trackingInfo.dimensions,
          contents: 'Documents et échantillons',
          pieces: 1
        },
        pricing: ProfessionalPDFGenerator.calculatePricing(
          trackingInfo.service, 
          trackingInfo.weight, 
          trackingInfo.type
        ),
        specialInstructions: trackingInfo.deliveryInstructions
      };

      ProfessionalPDFGenerator.generateAndDownloadLabel(pdfData);
      alert('Étiquette téléchargée avec succès !');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement de l\'étiquette. Veuillez réessayer.');
    }
  };

  // Fonction pour télécharger le reçu
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
          name: trackingInfo.sender.name,
          company: '',
          address: trackingInfo.sender.address,
          city: trackingInfo.sender.city,
          state: '',
          postalCode: '',
          country: trackingInfo.sender.country,
          phone: '',
          email: ''
        },
        recipient: {
          name: trackingInfo.recipient.name,
          company: '',
          address: trackingInfo.recipient.address,
          city: trackingInfo.recipient.city,
          state: '',
          postalCode: '',
          country: trackingInfo.recipient.country,
          phone: '',
          email: ''
        },
        package: {
          weight: trackingInfo.weight,
          dimensions: trackingInfo.dimensions,
          contents: 'Documents et échantillons',
          pieces: 1
        },
        pricing: ProfessionalPDFGenerator.calculatePricing(
          trackingInfo.service, 
          trackingInfo.weight, 
          trackingInfo.type
        )
      };

      ProfessionalPDFGenerator.generateAndDownloadReceipt(pdfData);
      alert('Reçu téléchargé avec succès !');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement du reçu. Veuillez réessayer.');
    }
  };

  // Fonction pour télécharger la facture
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
          name: trackingInfo.sender.name,
          company: '',
          address: trackingInfo.sender.address,
          city: trackingInfo.sender.city,
          state: '',
          postalCode: '',
          country: trackingInfo.sender.country,
          phone: '',
          email: ''
        },
        recipient: {
          name: trackingInfo.recipient.name,
          company: '',
          address: trackingInfo.recipient.address,
          city: trackingInfo.recipient.city,
          state: '',
          postalCode: '',
          country: trackingInfo.recipient.country,
          phone: '',
          email: ''
        },
        package: {
          weight: trackingInfo.weight,
          dimensions: trackingInfo.dimensions,
          contents: 'Documents et échantillons',
          pieces: 1
        },
        pricing: ProfessionalPDFGenerator.calculatePricing(
          trackingInfo.service, 
          trackingInfo.weight, 
          trackingInfo.type
        )
      };

      ProfessionalPDFGenerator.generateAndDownloadInvoice(pdfData);
      alert('Facture téléchargée avec succès !');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement de la facture. Veuillez réessayer.');
    }
  };

  // Fonction pour partager le suivi
  const handleShareTracking = () => {
    if (!trackingInfo) return;
    
    const shareData = {
      title: 'Suivi de mon colis BantuDelice',
      text: `Suivez mon colis ${trackingInfo.trackingNumber} en temps réel`,
      url: `${window.location.origin}/colis/tracking?code=${trackingInfo.trackingNumber}`
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      // Fallback : copier le lien
      navigator.clipboard.writeText(shareData.url).then(() => {
        alert('Lien de suivi copié dans le presse-papiers !');
      }).catch(() => {
        alert('Impossible de copier le lien. Veuillez le copier manuellement.');
      });
    }
  };

  // Fonction pour scanner QR Code
  const handleScanQR = () => {
    alert('Fonctionnalité de scan QR Code à implémenter. Utilisez l\'application mobile BantuDelice.');
  };

  // Fonction pour contacter le support
  const handleContactSupport = () => {
    window.open('/colis/support', '_blank');
  };

  // Fonction pour recevoir par email
  const handleEmailTracking = () => {
    if (!trackingInfo) return;
    
    const subject = encodeURIComponent(`Suivi de mon colis ${trackingInfo.trackingNumber}`);
    const body = encodeURIComponent(`
      Bonjour,
      
      Je souhaite recevoir les mises à jour de mon colis ${trackingInfo.trackingNumber} par email.
      
      Merci.
    `);
    
    window.open(`mailto:support@bantudelice.cg?subject=${subject}&body=${body}`);
  };

  // Fonction pour configurer les notifications
  const handleConfigureNotifications = () => {
    if (!trackingInfo) return;
    
    alert('Configuration des notifications à implémenter. Contactez le support pour plus d\'informations.');
  };

  const getStatusColor = (category: string) => {
    switch (category) {
      case 'delivered': return 'bg-emerald-100 text-emerald-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery': return 'bg-orange-100 text-orange-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'exception': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (category: string) => {
    switch (category) {
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'in_transit': return <Truck className="h-4 w-4" />;
      case 'out_for_delivery': return <Package className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'exception': return <AlertTriangle className="h-4 w-4" />;
      case 'returned': return <AlertTriangle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

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
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Suivi de Colis Avancé
            </h1>
            <p className="text-gray-600">
              Système de tracking professionnel basé sur les standards de l'industrie
            </p>
            
            {/* Boutons de test */}
            <div className="flex justify-center gap-3 mt-4 flex-wrap">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowTests(!showTests)}
                className="flex items-center gap-2"
              >
                <TestTube className="h-4 w-4" />
                {showTests ? 'Masquer' : 'Afficher'} Tests Frontend
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowBackendTests(!showBackendTests)}
                className="flex items-center gap-2"
              >
                <Server className="h-4 w-4" />
                {showBackendTests ? 'Masquer' : 'Afficher'} Tests Backend
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowCompleteTests(!showCompleteTests)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                {showCompleteTests ? 'Masquer' : 'Afficher'} Tests Complets
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowIntegrationTests(!showIntegrationTests)}
                className="flex items-center gap-2"
              >
                <Link className="h-4 w-4" />
                {showIntegrationTests ? 'Masquer' : 'Afficher'} Tests Intégration
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowRoutesTests(!showRoutesTests)}
                className="flex items-center gap-2"
              >
                <Route className="h-4 w-4" />
                {showRoutesTests ? 'Masquer' : 'Afficher'} Tests Routes
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAuthTests(!showAuthTests)}
                className="flex items-center gap-2"
              >
                <Key className="h-4 w-4" />
                {showAuthTests ? 'Masquer' : 'Afficher'} Tests Auth
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Composants de test */}
        {showTests && <ColisTrackingTest />}
        {showBackendTests && <BackendTestComponent />}
        {showCompleteTests && <CompleteTestSuite />}
        {showIntegrationTests && <IntegrationTestComponent />}
        {showRoutesTests && <ColisRoutesTestComponent />}
        {showAuthTests && <AuthTestComponent />}

        {/* Formulaire de recherche */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Rechercher un colis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Numéro de tracking (ex: BD123456 ou DHL123456789)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                  className="text-gray-900 placeholder:text-gray-500 focus:text-gray-900"
                  style={{ color: '#111827' }}
                />
              </div>
              <Button 
                onClick={handleTrack}
                disabled={isLoading}
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Recherche...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Suivre
                  </>
                )}
              </Button>
            </div>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-red-800 mb-1">Erreur de suivi</div>
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Aide pour les formats */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-1">Formats acceptés :</div>
                  <div className="space-y-1">
                    <div>• <strong>National</strong> : BD123456 (6 chiffres après BD)</div>
                    <div>• <strong>International</strong> : DHL123456789 ou UPS123456789</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Résultats du tracking */}
        {trackingInfo && (
          <div className="space-y-6">
            {/* Informations principales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getTransportIcon(trackingInfo.type)}
                  Colis {trackingInfo.trackingNumber}
                  <Badge className="ml-2">
                    {trackingInfo.carrier}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Informations du colis</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <Badge className={trackingInfo.type === 'national' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>
                          {trackingInfo.type === 'national' ? 'National' : 'International'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Statut:</span>
                        <Badge className={getStatusColor(trackingInfo.status.category)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(trackingInfo.status.category)}
                            {trackingInfo.status.description}
                          </div>
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service:</span>
                        <span>{trackingInfo.service}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Poids:</span>
                        <span>{trackingInfo.weight} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dimensions:</span>
                        <span>{trackingInfo.dimensions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Livraison estimée:</span>
                        <span>{new Date(trackingInfo.estimatedDelivery).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Adresses</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Expéditeur</div>
                        <div className="font-medium">{trackingInfo.sender.name}</div>
                        <div className="text-sm text-gray-600">{trackingInfo.sender.address}</div>
                        <div className="text-sm text-gray-600">{trackingInfo.sender.city}, {trackingInfo.sender.country}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Destinataire</div>
                        <div className="font-medium">{trackingInfo.recipient.name}</div>
                        <div className="text-sm text-gray-600">{trackingInfo.recipient.address}</div>
                        <div className="text-sm text-gray-600">{trackingInfo.recipient.city}, {trackingInfo.recipient.country}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {trackingInfo.currentLocation && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">Localisation actuelle:</span>
                      <span>{trackingInfo.currentLocation.name}</span>
                    </div>
                  </div>
                )}

                {/* Assurance et instructions */}
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 mb-1">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">Assurance</span>
                    </div>
                    <div className="text-sm text-green-600">
                      {trackingInfo.insurance.amount.toLocaleString()} {trackingInfo.insurance.currency}
                    </div>
                  </div>
                  
                  {trackingInfo.deliveryInstructions && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-2 text-orange-700 mb-1">
                        <Info className="h-4 w-4" />
                        <span className="font-medium">Instructions</span>
                      </div>
                      <div className="text-sm text-orange-600">
                        {trackingInfo.deliveryInstructions}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Historique du suivi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingInfo.timeline.map((event: any, index: number) => (
                    <div key={event.id} className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-sm">{event.icon}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{event.description}</span>
                          <Badge variant="outline" className="text-xs">
                            {new Date(event.timestamp).toLocaleString('fr-FR')}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">{event.location}</div>
                        {event.details && (
                          <div className="text-sm text-gray-500">{event.details}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
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
          <Card>
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

export default ColisTrackingPage; 