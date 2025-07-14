
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBookingForm } from './BookingFormContext';
import { formatPrice, vehicleTypeToFrench, getPaymentMethodLabel } from './bookingFormUtils';
import { TaxiDriver } from '@/types/taxi';
import { ArrowRight, MapPin, Calendar, Car, CreditCard, User, Shield, AlertTriangle } from 'lucide-react';

interface BookingSummaryProps {
  currentStep: number;
  selectedDriver: TaxiDriver | null;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ 
  currentStep,
  selectedDriver
}) => {
  const { formState } = useBookingForm();
  
  // Obtenir la distance estimée si disponible
  const distance = formState.estimatedDistance;
  
  return (
    <Card className="sticky top-6 shadow-sm">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg">Résumé de la course</CardTitle>
      </CardHeader>
      
      <CardContent className="pt-4 pb-0">
        <div className="space-y-4">
          {/* Adresses */}
          <div className="space-y-3">
            {formState.pickupAddress && (
              <div className="flex gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="absolute top-8 bottom-0 left-1/2 w-0.5 -ml-[1px] border-l-2 border-dotted border-gray-300 h-6"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Départ</p>
                  <p className="font-medium truncate max-w-[230px]">{formState.pickupAddress}</p>
                </div>
              </div>
            )}
            
            {formState.destinationAddress && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Destination</p>
                  <p className="font-medium truncate max-w-[230px]">{formState.destinationAddress}</p>
                </div>
              </div>
            )}
          </div>
          
          {(formState.pickupAddress && formState.destinationAddress) && (
            <>
              <Separator />
              
              {/* Détails de la course */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-gray-500" />
                    <span>Type de véhicule</span>
                  </div>
                  <span className="font-medium">{vehicleTypeToFrench(formState.vehicleType)}</span>
                </div>
                
                {distance && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-gray-500" />
                      <span>Distance</span>
                    </div>
                    <span className="font-medium">{distance} km</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Départ</span>
                  </div>
                  <span className="font-medium">
                    {formState.pickupTime === 'now' 
                      ? 'Immédiat' 
                      : new Date(formState.scheduledTime).toLocaleString('fr-FR', {
                          dateStyle: 'short',
                          timeStyle: 'short'
                        })
                    }
                  </span>
                </div>
                
                {currentStep >= 3 && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <span>Paiement</span>
                    </div>
                    <span className="font-medium">{getPaymentMethodLabel(formState.paymentMethod)}</span>
                  </div>
                )}
                
                {selectedDriver && currentStep >= 4 && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>Chauffeur</span>
                    </div>
                    <span className="font-medium">{selectedDriver.name}</span>
                  </div>
                )}
              </div>
              
              <Separator />
              
              {/* Prix */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Prix de base</span>
                  <span>{formatPrice(formState.estimatedPrice - 500)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Frais de service</span>
                  <span>{formatPrice(500)}</span>
                </div>
                
                {formState.promoCode && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Promotion appliquée</span>
                    <span>-{formatPrice(500)}</span>
                  </div>
                )}
                
                <div className="flex justify-between pt-2 font-medium text-base">
                  <span>Total</span>
                  <span>{formatPrice(formState.estimatedPrice)}</span>
                </div>
              </div>
            </>
          )}
          
          {/* Message informatif */}
          {currentStep === 1 && !formState.pickupAddress && (
            <div className="py-8 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-gray-600">
                Complétez votre adresse de départ et de destination pour voir le résumé de votre course.
              </p>
            </div>
          )}
          
          {/* Notice de sécurité */}
          {currentStep >= 2 && (
            <div className="flex items-start gap-2 bg-blue-50 p-3 rounded-md text-sm text-blue-800">
              <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p>
                Tous nos chauffeurs sont vérifiés et votre trajet est assuré. En cas de besoin, 
                contactez notre service client au 123456789.
              </p>
            </div>
          )}
          
          {/* Notice d'estimation */}
          {formState.estimatedPrice > 0 && (
            <div className="flex items-start gap-2 bg-amber-50 p-3 rounded-md text-sm text-amber-800">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p>
                Ce prix est estimé et peut varier légèrement en fonction du trajet exact et des 
                conditions de circulation.
              </p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pb-4 pt-2">
        <p className="text-xs text-gray-500">
          En poursuivant, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité.
        </p>
      </CardFooter>
    </Card>
  );
};

export default BookingSummary;
