import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  AlertCircle, 
  Download, 
  Share2, 
  Mail, 
  Phone,
  Clock,
  Package,
  MapPin,
  User,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { expeditionConfirmationService, ExpeditionConfirmationData, ConfirmationResponse } from '@/services/expeditionConfirmationService';

interface ExpeditionConfirmationProps {
  trackingNumber: string;
  expeditionId: string;
  paymentMethod: string;
  paymentReference: string;
  expeditionData: {
    sender: string;
    recipient: string;
    origin: string;
    destination: string;
    amount: number;
    recipientEmail?: string;
    recipientPhone?: string;
  };
  onConfirmationComplete?: (success: boolean) => void;
  onRetry?: () => void;
}

const ExpeditionConfirmation: React.FC<ExpeditionConfirmationProps> = ({
  trackingNumber,
  expeditionId,
  paymentMethod,
  paymentReference,
  expeditionData,
  onConfirmationComplete,
  onRetry
}) => {
  const [confirmationStatus, setConfirmationStatus] = useState<'pending' | 'processing' | 'success' | 'error'>('pending');
  const [confirmationData, setConfirmationData] = useState<ExpeditionConfirmationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (confirmationStatus === 'pending') {
      startConfirmation();
    }
  }, [confirmationStatus]);

  const startConfirmation = async () => {
    setConfirmationStatus('processing');
    setProgress(0);
    setError(null);

    // Simulation de progression
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      console.log(`🚀 Début confirmation expédition: ${trackingNumber}`);
      
      const response = await expeditionConfirmationService.confirmExpedition({
        trackingNumber,
        expeditionId,
        paymentMethod,
        paymentReference
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.success && response.data) {
        setConfirmationData(response.data);
        setConfirmationStatus('success');
        
        // Envoi automatique des notifications
        await sendNotifications();
        
        toast({
          title: 'Expédition confirmée !',
          description: 'Votre expédition a été confirmée avec succès.',
          variant: 'default'
        });

        onConfirmationComplete?.(true);
      } else {
        throw new Error(response.error || 'Erreur lors de la confirmation');
      }

    } catch (err) {
      clearInterval(progressInterval);
      setProgress(0);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setConfirmationStatus('error');
      
      toast({
        title: 'Erreur de confirmation',
        description: err instanceof Error ? err.message : 'Erreur inconnue',
        variant: 'destructive'
      });

      onConfirmationComplete?.(false);
    }
  };

  const sendNotifications = async () => {
    try {
      // Notification par email
      if (expeditionData.recipientEmail) {
        await expeditionConfirmationService.sendConfirmationNotification(
          trackingNumber,
          expeditionData.recipientEmail
        );
      }

      // Notification par SMS
      if (expeditionData.recipientPhone) {
        await expeditionConfirmationService.sendConfirmationNotification(
          trackingNumber,
          undefined,
          expeditionData.recipientPhone
        );
      }
    } catch (error) {
      console.error('Erreur envoi notifications:', error);
    }
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    setConfirmationStatus('pending');
    setIsRetrying(false);
  };

  const handleDownloadReceipt = () => {
    if (!confirmationData) return;

    const receipt = expeditionConfirmationService.generateConfirmationReceipt(confirmationData);
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `confirmation-${trackingNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Reçu téléchargé',
      description: 'Le reçu de confirmation a été téléchargé.',
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Expédition confirmée - ${trackingNumber}`,
        text: `Mon expédition ${trackingNumber} a été confirmée avec succès sur BantuDelice !`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Lien copié',
        description: 'Le lien de suivi a été copié dans votre presse-papier.',
      });
    }
  };

  const renderProcessingState = () => (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <RefreshCw className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Confirmation en cours...</h3>
        <p className="text-muted-foreground mb-4">
          Nous confirmons votre expédition. Veuillez patienter.
        </p>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground mt-2">
          {progress}% terminé
        </p>
      </div>
    </div>
  );

  const renderSuccessState = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">
          Expédition confirmée !
        </h3>
        <p className="text-muted-foreground">
          Votre expédition a été confirmée avec succès.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Package className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium">Numéro de tracking</p>
              <p className="text-lg font-bold">{trackingNumber}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium">Date de confirmation</p>
              <p className="text-lg font-bold">
                {confirmationData?.timestamp ? 
                  new Date(confirmationData.timestamp).toLocaleString('fr-FR') : 
                  'Maintenant'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Expéditeur</p>
              <p className="font-medium">{expeditionData.sender}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Destinataire</p>
              <p className="font-medium">{expeditionData.recipient}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Trajet</p>
              <p className="font-medium">{expeditionData.origin} → {expeditionData.destination}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Montant</p>
              <p className="font-medium">{expeditionData.amount.toLocaleString()} FCFA</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleDownloadReceipt}
          variant="outline"
          className="flex-1"
        >
          <Download className="h-4 w-4 mr-2" />
          Télécharger le reçu
        </Button>
        
        <Button 
          onClick={handleShare}
          variant="outline"
          className="flex-1"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Partager
        </Button>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <XCircle className="h-16 w-16 text-red-600" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-red-800 mb-2">
          Erreur de confirmation
        </h3>
        <p className="text-muted-foreground mb-4">
          {error || 'Une erreur est survenue lors de la confirmation.'}
        </p>
        
        {retryCount > 0 && (
          <Badge variant="secondary" className="mb-4">
            Tentative {retryCount}/3
          </Badge>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleRetry}
          disabled={isRetrying || retryCount >= 3}
          className="flex-1"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Nouvelle tentative...' : 'Réessayer'}
        </Button>
        
        {onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline"
            className="flex-1"
          >
            Retour au formulaire
          </Button>
        )}
      </div>

      {retryCount >= 3 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              Si le problème persiste, contactez notre support client.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <Package className="h-6 w-6" />
          <span>Confirmation d'expédition</span>
        </CardTitle>
        <CardDescription>
          {confirmationStatus === 'pending' && 'Préparation de la confirmation...'}
          {confirmationStatus === 'processing' && 'Confirmation en cours...'}
          {confirmationStatus === 'success' && 'Expédition confirmée avec succès'}
          {confirmationStatus === 'error' && 'Erreur lors de la confirmation'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {confirmationStatus === 'processing' && renderProcessingState()}
        {confirmationStatus === 'success' && renderSuccessState()}
        {confirmationStatus === 'error' && renderErrorState()}
      </CardContent>

      {confirmationStatus === 'success' && (
        <CardFooter className="flex flex-col space-y-3">
          <div className="w-full text-center">
            <p className="text-sm text-muted-foreground">
              Vous recevrez des notifications par email et SMS.
            </p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button variant="ghost" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Suivre par email
            </Button>
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              Suivre par SMS
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default ExpeditionConfirmation; 