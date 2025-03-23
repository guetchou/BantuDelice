
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Building2, Users, Clock, Calendar, ShieldCheck, FileText, Briefcase, Star } from 'lucide-react';
import BusinessRateCalculator from '@/components/taxi/BusinessRateCalculator';

const TaxiBusinessPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/taxi')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Taxi pour Entreprises</h1>
          <p className="text-gray-600 mt-1">
            Solutions de transport sur mesure pour les professionnels
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Avantages pour votre entreprise
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="mt-1 bg-primary/10 p-2 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Compte entreprise centralisé</h3>
                <p className="text-gray-600">Gérez facilement les déplacements de tous vos employés depuis un seul compte</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="mt-1 bg-primary/10 p-2 rounded-full">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Facturation simplifiée</h3>
                <p className="text-gray-600">Recevez une facture mensuelle unique pour tous les déplacements professionnels</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="mt-1 bg-primary/10 p-2 rounded-full">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Sécurité et fiabilité</h3>
                <p className="text-gray-600">Chauffeurs vérifiés et véhicules inspectés régulièrement pour assurer sécurité et confort</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="mt-1 bg-primary/10 p-2 rounded-full">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Accompagnement dédié</h3>
                <p className="text-gray-600">Un gestionnaire de compte personnel pour répondre à tous vos besoins</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            Nos services pour professionnels
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium">Service 24/7</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Des chauffeurs disponibles à toute heure pour vos besoins professionnels urgents
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <h3 className="font-medium">Réservation à l'avance</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Planifiez vos trajets plusieurs semaines à l'avance pour vos rendez-vous importants
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-purple-600" />
                  <h3 className="font-medium">Navettes d'entreprise</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Transport régulier pour vos équipes entre différents sites de l'entreprise
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-5 w-5 text-amber-600" />
                  <h3 className="font-medium">Transport événementiel</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Solutions sur mesure pour vos séminaires, conférences et événements d'entreprise
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <div className="mt-12 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold">Calculez votre tarif entreprise</h2>
          <p className="text-gray-600">
            Obtenez une estimation adaptée aux besoins spécifiques de votre organisation
          </p>
        </div>
        
        <BusinessRateCalculator />
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg mt-12">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Ils nous font confiance</h2>
          <p className="text-gray-600">Plus de 50 entreprises à Brazzaville utilisent nos services</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 opacity-70">
          <div className="w-32 h-16 bg-gray-200 rounded flex items-center justify-center">Logo 1</div>
          <div className="w-32 h-16 bg-gray-200 rounded flex items-center justify-center">Logo 2</div>
          <div className="w-32 h-16 bg-gray-200 rounded flex items-center justify-center">Logo 3</div>
          <div className="w-32 h-16 bg-gray-200 rounded flex items-center justify-center">Logo 4</div>
          <div className="w-32 h-16 bg-gray-200 rounded flex items-center justify-center">Logo 5</div>
        </div>
      </div>
    </div>
  );
};

export default TaxiBusinessPage;
