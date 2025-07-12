
import React, { useEffect } from 'react';
import { BookingForm } from '@/components/taxi/booking-form/BookingFormLayout';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Info, Clock, Shield, Star } from 'lucide-react';

const BookingPage: React.FC = () => {
  // Mettre à jour le titre de la page
  useEffect(() => {
    document.title = 'Réservation de taxi | BuntuDelice';
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Réservation de taxi</h1>
          <p className="text-gray-600 max-w-3xl">
            Réservez votre taxi en quelques clics pour vous déplacer rapidement et en sécurité partout à Brazzaville et ses environs.
          </p>
        </div>
        
        {/* Avantages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="border-green-100 bg-green-50">
            <CardContent className="pt-6 pb-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Clock className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">Rapide et ponctuel</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Votre chauffeur arrive en moins de 10 minutes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-100 bg-blue-50">
            <CardContent className="pt-6 pb-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800">Sécurité garantie</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Chauffeurs vérifiés et trajets assurés
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-amber-100 bg-amber-50">
            <CardContent className="pt-6 pb-4">
              <div className="flex items-start gap-3">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <Star className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-800">Service de qualité</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    98% de nos clients satisfaits
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Formulaire de réservation */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Votre trajet</h2>
            <Badge variant="outline" className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200">
              <Info className="h-3.5 w-3.5 mr-1" />
              Prix estimé sans engagement
            </Badge>
          </div>
          
          <BookingForm />
        </div>
        
        {/* Section FAQ */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Questions fréquentes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Comment puis-je payer ma course ?</h3>
                <p className="text-gray-600">
                  Vous pouvez payer en espèces, par carte bancaire, ou via Mobile Money directement au chauffeur.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Puis-je réserver un taxi à l'avance ?</h3>
                <p className="text-gray-600">
                  Oui, vous pouvez planifier votre course jusqu'à 7 jours à l'avance via l'option "Planifier".
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Que faire en cas d'objet oublié ?</h3>
                <p className="text-gray-600">
                  Contactez notre service client au plus vite en indiquant la date et le numéro de votre course.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Comment annuler ma réservation ?</h3>
                <p className="text-gray-600">
                  Vous pouvez annuler gratuitement jusqu'à 10 minutes avant l'heure prévue dans la section "Mes courses".
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
