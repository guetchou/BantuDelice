import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Download, 
  Share2, 
  Home,
  FileText,
  Calendar,
  User,
  Building,
  CreditCard,
  Smartphone,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const ColisExpeditionComplete: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [expeditionData, setExpeditionData] = useState<any>(null);

  useEffect(() => {
    // Récupérer le numéro de tracking depuis l'état de navigation
    const location = window.location;
    const state = (location as any).state;
    
    if (state && state.trackingNumber) {
      setTrackingNumber(state.trackingNumber);
      // Sauvegarder pour référence future
      localStorage.setItem('lastTrackingNumber', state.trackingNumber);
    } else {
      // Fallback avec format correct
      const generateTrackingNumber = () => {
        const prefix = 'BD';
        const timestamp = Date.now().toString().slice(-6); // 6 chiffres seulement
        return `${prefix}${timestamp}`;
      };
      setTrackingNumber(generateTrackingNumber());
    }

    // Récupérer les données de l'expédition depuis localStorage ou sessionStorage
    const savedData = localStorage.getItem('expeditionData');
    if (savedData) {
      setExpeditionData(JSON.parse(savedData));
    }
  }, []);

  const handleDownloadReceipt = () => {
    // Logique pour télécharger le reçu
    console.log('Téléchargement du reçu...');
  };

  const handleShare = () => {
    const shareText = `Mon colis BantuDelice - Numéro de suivi: ${trackingNumber}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Confirmation d\'expédition BantuDelice',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      // Ici vous pourriez afficher une notification de succès
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* En-tête de succès */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Expédition confirmée !
          </h1>
          <p className="text-lg text-gray-600">
            Votre colis a été enregistré avec succès
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Informations principales */}
          <div className="lg:col-span-2 space-y-6">
            {/* Numéro de suivi */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-6 w-6" />
                  Numéro de suivi
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-mono font-bold text-gray-900 mb-4">
                    {trackingNumber}
                  </div>
                  <div className="flex justify-center gap-4">
                    <Button onClick={handleShare} variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Partager
                    </Button>
                    <Button onClick={handleDownloadReceipt} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger le reçu
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Détails de l'expédition */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Détails de l'expédition
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Expéditeur */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Expéditeur
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Nom :</span> {expeditionData?.sender?.name || 'John Doe'}
                      </div>
                      <div>
                        <span className="font-medium">Téléphone :</span> {expeditionData?.sender?.phone || '+242 06 XXX XXX'}
                      </div>
                      <div>
                        <span className="font-medium">Ville :</span> {expeditionData?.sender?.city || 'Brazzaville'}
                      </div>
                      <div>
                        <span className="font-medium">Agence :</span> {expeditionData?.sender?.agency || 'Agence Centrale'}
                      </div>
                    </div>
                  </div>

                  {/* Destinataire */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Destinataire
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Nom :</span> {expeditionData?.recipient?.name || 'Jane Smith'}
                      </div>
                      <div>
                        <span className="font-medium">Téléphone :</span> {expeditionData?.recipient?.phone || '+242 06 XXX XXX'}
                      </div>
                      <div>
                        <span className="font-medium">Ville :</span> {expeditionData?.recipient?.city || 'Pointe-Noire'}
                      </div>
                      <div>
                        <span className="font-medium">Adresse :</span> {expeditionData?.recipient?.address || 'Adresse de livraison'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Détails du colis */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Détails du colis
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Type :</span> {expeditionData?.packageType || 'Colis Standard'}
                    </div>
                    <div>
                      <span className="font-medium">Poids :</span> {expeditionData?.weight || '5'} kg
                    </div>
                    <div>
                      <span className="font-medium">Service :</span> {expeditionData?.service || 'Standard'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prochaines étapes */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Prochaines étapes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Récupération du colis</h5>
                      <p className="text-sm text-gray-600">Notre équipe vous contactera dans les 24h pour organiser la récupération</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-orange-600 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Traitement et expédition</h5>
                      <p className="text-sm text-gray-600">Votre colis sera traité et expédié dans les 24h suivant la récupération</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Livraison</h5>
                      <p className="text-sm text-gray-600">Livraison à domicile selon le service choisi</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Actions rapides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to={`/colis/tracking?tracking=${trackingNumber}`}>
                  <Button className="w-full">
                    <Truck className="h-4 w-4 mr-2" />
                    Suivre mon colis
                  </Button>
                </Link>
                <Link to="/colis/expedier">
                  <Button variant="outline" className="w-full">
                    <Package className="h-4 w-4 mr-2" />
                    Nouvelle expédition
                  </Button>
                </Link>
                <Link to="/colis/dashboard">
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Mon tableau de bord
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Besoin d'aide ?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler le support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Chat en ligne
                </Button>
                <Link to="/colis/faq">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    FAQ
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Retour à l'accueil */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <Link to="/">
                  <Button variant="outline" className="w-full">
                    <Home className="h-4 w-4 mr-2" />
                    Retour à l'accueil
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColisExpeditionComplete; 