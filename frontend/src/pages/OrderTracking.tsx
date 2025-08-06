import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Truck, 
  MapPin,
  Phone,
  MessageCircle,
  Star,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface OrderStatus {
  step: number;
  title: string;
  description: string;
  completed: boolean;
  time?: string;
}

interface Driver {
  name: string;
  phone: string;
  rating: number;
  photo: string;
  vehicle: string;
  plateNumber: string;
}

const OrderTracking: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [estimatedTime, setEstimatedTime] = useState(25);
  const [driver, setDriver] = useState<Driver | null>(null);

  // Récupérer les données de la commande
  const orderData = location.state || {
    orderId: 'CMD-123456789',
    restaurantName: 'Le Gourmet Congolais',
    estimatedTime: '25-30 minutes'
  };

  const orderSteps: OrderStatus[] = [
    {
      step: 1,
      title: 'Commande confirmée',
      description: 'Votre commande a été reçue et confirmée',
      completed: true,
      time: '14:30'
    },
    {
      step: 2,
      title: 'En préparation',
      description: 'Le restaurant prépare votre commande',
      completed: currentStep >= 2,
      time: '14:35'
    },
    {
      step: 3,
      title: 'Prêt pour la livraison',
      description: 'Votre commande est prête et attend le livreur',
      completed: currentStep >= 3,
      time: '14:45'
    },
    {
      step: 4,
      title: 'En route',
      description: 'Le livreur est en route vers vous',
      completed: currentStep >= 4,
      time: '14:50'
    },
    {
      step: 5,
      title: 'Livré',
      description: 'Votre commande a été livrée',
      completed: currentStep >= 5,
      time: '15:00'
    }
  ];

  useEffect(() => {
    // Simuler la progression de la commande
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < 5) {
          return prev + 1;
        }
        return prev;
      });
    }, 30000); // Change d'étape toutes les 30 secondes pour la démo

    // Simuler l'arrivée du livreur à l'étape 4
    const driverTimeout = setTimeout(() => {
      if (currentStep >= 4) {
        setDriver({
          name: 'Jean-Pierre Mukeba',
          phone: '+242 123 456 789',
          rating: 4.8,
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          vehicle: 'Moto Yamaha',
          plateNumber: 'KIN-1234'
        });
      }
    }, 35000);

    return () => {
      clearInterval(interval);
      clearTimeout(driverTimeout);
    };
  }, [currentStep]);

  const handleCallDriver = () => {
    if (driver) {
      toast.success(`Appel en cours vers ${driver.name}...`);
      // Ici on pourrait ouvrir l'appel téléphonique
    }
  };

  const handleMessageDriver = () => {
    if (driver) {
      toast.success(`Ouverture du chat avec ${driver.name}...`);
      // Ici on pourrait ouvrir le chat
    }
  };

  const handleRateOrder = () => {
    toast.success('Merci pour votre évaluation !');
    navigate('/restaurants');
  };

  const getProgressPercentage = () => {
    return (currentStep / 5) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/restaurants')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
          </Button>
            <h1 className="text-xl font-bold text-gray-900">Suivi de commande</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Informations de la commande */}
        <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Commande #{orderData.orderId}</span>
                <Badge variant={currentStep === 5 ? "default" : "secondary"}>
                  {currentStep === 5 ? "Livré" : "En cours"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🍽️</span>
                </div>
              <div>
                  <h3 className="font-semibold">{orderData.restaurantName}</h3>
                  <p className="text-sm text-gray-500">Livraison estimée: {orderData.estimatedTime}</p>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Progression</span>
                  <span>{Math.round(getProgressPercentage())}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
            </div>

              {/* Temps restant */}
              {currentStep < 5 && (
                <div className="flex items-center gap-2 text-orange-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Temps restant estimé: {estimatedTime} minutes
                        </span>
                      </div>
                    )}
            </CardContent>
          </Card>

          {/* Étapes de la commande */}
          <Card>
            <CardHeader>
              <CardTitle>Statut de votre commande</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderSteps.map((step, index) => (
                  <div key={step.step} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-medium">{step.step}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${
                          step.completed ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </h4>
                        {step.time && (
                          <span className="text-sm text-gray-400">{step.time}</span>
                        )}
                      </div>
                      <p className={`text-sm ${
                        step.completed ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Informations du livreur */}
          {driver && currentStep >= 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-500" />
                  Votre livreur
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={driver.photo} 
                    alt={driver.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{driver.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{driver.rating} ({Math.floor(Math.random() * 50) + 100} livraisons)</span>
                    </div>
                    <p className="text-sm text-gray-500">{driver.vehicle} - {driver.plateNumber}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleCallDriver}
                    className="flex-1"
                    variant="outline"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Appeler
                  </Button>
                  <Button 
                    onClick={handleMessageDriver}
                    className="flex-1"
                    variant="outline"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions finales */}
          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Commande livrée !
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Votre commande a été livrée avec succès. Nous espérons que vous avez apprécié votre repas !
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleRateOrder}
                    className="flex-1"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Évaluer la commande
                  </Button>
                  <Button 
                    onClick={() => navigate('/restaurants')}
                    variant="outline"
                    className="flex-1"
                  >
                    Commander à nouveau
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informations de sécurité */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-blue-700">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Informations importantes</span>
              </div>
              <ul className="mt-2 text-sm text-blue-600 space-y-1">
                <li>• Vérifiez votre commande avant de signer</li>
                <li>• Le livreur portera un uniforme BantuDelice</li>
                <li>• Paiement sécurisé et tracé</li>
                <li>• Support client disponible 24/7</li>
              </ul>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
