
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, CreditCard, Calendar, Shield, AlertCircle } from 'lucide-react';
import { useTaxiPricing } from '@/hooks/useTaxiPricing';
import { toast } from 'sonner';
import { useUser } from '@/hooks/useUser';

const TaxiSubscriptionDetails = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { calculateSubscriptionDiscount } = useTaxiPricing();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const standardRidePrice = 5000;
  
  // Plan configuration based on ID
  const planConfig = {
    daily: {
      name: 'Pass Quotidien',
      frequency: 'daily',
      rides: 20,
      price: calculateSubscriptionDiscount(standardRidePrice, 'daily', 20),
      perRidePrice: Math.round(calculateSubscriptionDiscount(standardRidePrice, 'daily', 20) / 20),
      color: 'blue',
      features: [
        'Courses illimitées en heures creuses',
        'Priorité de réservation',
        'Annulation gratuite',
        'Chauffeurs premium',
        'Service client dédié'
      ]
    },
    weekly: {
      name: 'Pass Business',
      frequency: 'weekly',
      rides: 10,
      price: calculateSubscriptionDiscount(standardRidePrice, 'weekly', 10),
      perRidePrice: Math.round(calculateSubscriptionDiscount(standardRidePrice, 'weekly', 10) / 10),
      color: 'primary',
      features: [
        'Jusqu\'à 10 courses par semaine',
        'Voitures confort & premium',
        'Réservation à l\'avance',
        'Facture mensuelle unique',
        'Suivi des dépenses'
      ]
    },
    monthly: {
      name: 'Pass Flexible',
      frequency: 'monthly',
      rides: 8,
      price: calculateSubscriptionDiscount(standardRidePrice, 'monthly', 8),
      perRidePrice: Math.round(calculateSubscriptionDiscount(standardRidePrice, 'monthly', 8) / 8),
      color: 'green',
      features: [
        '8 courses par mois',
        'Report des courses non utilisées',
        'Chauffeurs 4.8+ étoiles',
        'Véhicules standard et confort',
        'Pas d\'engagement'
      ]
    }
  };
  
  const activePlan = planId ? planConfig[planId as keyof typeof planConfig] : null;
  
  if (!activePlan) {
    useEffect(() => {
      navigate('/taxi/subscription');
    }, [navigate]);
    return null;
  }
  
  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour souscrire à un abonnement");
      return;
    }
    
    setIsProcessing(true);
    
    // Simuler un appel API pour la souscription
    setTimeout(() => {
      toast.success(`Félicitations ! Vous êtes maintenant abonné au ${activePlan.name}`, {
        description: "Votre abonnement est actif dès maintenant"
      });
      setIsProcessing(false);
    }, 1500);
  };
  
  const colorMap = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    primary: "bg-primary/5 border-primary text-primary-foreground",
    green: "bg-green-50 border-green-200 text-green-800"
  };
  
  const buttonColorMap = {
    blue: "bg-blue-600 hover:bg-blue-700",
    primary: "bg-primary hover:bg-primary/90",
    green: "bg-green-600 hover:bg-green-700"
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/taxi/subscription')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{activePlan.name}</h1>
          <p className="text-gray-600 mt-1">
            Forfait de courses {
              activePlan.frequency === 'daily' ? 'quotidiennes' : 
              activePlan.frequency === 'weekly' ? 'hebdomadaires' : 'mensuelles'
            }
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <Card className={`${colorMap[activePlan.color as keyof typeof colorMap]} border-2`}>
            <CardHeader>
              <CardTitle className="text-2xl">Détails de l'abonnement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white/60 rounded-lg">
                  <div className="text-sm text-gray-600">Prix de l'abonnement</div>
                  <div className="text-3xl font-bold mt-1">{(activePlan.price / 1000).toFixed(1)}k FCFA</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {activePlan.frequency === 'daily' ? 'Par jour' : 
                     activePlan.frequency === 'weekly' ? 'Par semaine' : 'Par mois'}
                  </div>
                </div>
                
                <div className="p-4 bg-white/60 rounded-lg">
                  <div className="text-sm text-gray-600">Prix par course</div>
                  <div className="text-3xl font-bold mt-1">{activePlan.perRidePrice} FCFA</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Économie de {Math.round((1 - activePlan.perRidePrice / standardRidePrice) * 100)}% par course
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-white/80 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Avantages inclus</h3>
                <div className="space-y-3">
                  {activePlan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-white/80 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Conditions d'utilisation</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>• Abonnement sans engagement, annulable à tout moment</p>
                  <p>• Paiement {
                    activePlan.frequency === 'daily' ? 'quotidien' : 
                    activePlan.frequency === 'weekly' ? 'hebdomadaire' : 'mensuel'
                  } automatique</p>
                  <p>• Les courses sont valables uniquement dans la ville de Brazzaville</p>
                  <p>• Les courses non utilisées {
                    activePlan.frequency === 'monthly' ? 'sont reportées au mois suivant (max 3 mois)' : 'sont perdues'
                  }</p>
                  <p>• Des frais supplémentaires peuvent s'appliquer pour les courses en heures de pointe</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className={`w-full ${buttonColorMap[activePlan.color as keyof typeof buttonColorMap]}`}
                disabled={isProcessing}
                onClick={handleSubscribe}
              >
                {isProcessing ? 'Traitement en cours...' : 'Souscrire maintenant'}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Méthodes de paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <CreditCard className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium">Carte bancaire</div>
                    <div className="text-sm text-gray-500">Visa, Mastercard</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="h-5 w-5 flex items-center justify-center bg-blue-500 text-white rounded-full text-xs font-bold">M</div>
                  <div>
                    <div className="font-medium">Mobile Money</div>
                    <div className="text-sm text-gray-500">MTN, Airtel, Moov</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Garantie satisfaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Si vous n'êtes pas satisfait de votre abonnement dans les 7 premiers jours, nous vous remboursons intégralement.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Besoin d'aide ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Notre équipe est disponible 24/7 pour répondre à vos questions.
              </p>
              <Button variant="outline" className="w-full">Contacter le support</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaxiSubscriptionDetails;
