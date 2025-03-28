
import React, { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from './booking-form/bookingFormUtils';
import { useSharedRides } from '@/hooks/useSharedRides';
import { Card, CardContent } from "@/components/ui/card";
import { Users, Info, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RideSharingProps {
  rideId: string | null;
  onSharingEnabled: (enabled: boolean) => void;
  initialPrice: number;
}

const RideSharing: React.FC<RideSharingProps> = ({ 
  rideId, 
  onSharingEnabled, 
  initialPrice 
}) => {
  const [isSharingEnabled, setIsSharingEnabled] = useState(false);
  const [showSharedRides, setShowSharedRides] = useState(false);
  const { nearbySharedRides, loading, joinSharedRide } = useSharedRides(rideId, isSharingEnabled);
  
  useEffect(() => {
    // Notify parent component when sharing is enabled/disabled
    onSharingEnabled(isSharingEnabled);
  }, [isSharingEnabled, onSharingEnabled]);
  
  const handleSharingToggle = (checked: boolean) => {
    setIsSharingEnabled(checked);
    // Only show nearby rides if sharing is enabled
    if (!checked) {
      setShowSharedRides(false);
    }
  };
  
  const handleViewSharedRides = () => {
    setShowSharedRides(true);
  };
  
  const handleJoinRide = async (sharedRideId: string) => {
    if (!rideId) return;
    
    await joinSharedRide(sharedRideId);
    setShowSharedRides(false);
  };
  
  // Calculate discounted price (20% off for shared rides)
  const discountedPrice = Math.floor(initialPrice * 0.8);
  const savedAmount = initialPrice - discountedPrice;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <Label htmlFor="sharing-mode" className="font-medium">
              Trajet partagé
            </Label>
          </div>
          <p className="text-sm text-gray-500">
            Économisez jusqu'à 20% en partageant votre trajet avec d'autres voyageurs
          </p>
        </div>
        <Switch
          id="sharing-mode"
          checked={isSharingEnabled}
          onCheckedChange={handleSharingToggle}
        />
      </div>
      
      {isSharingEnabled && (
        <>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">
                    Mode partagé activé
                  </p>
                  <p className="text-sm text-blue-700">
                    Votre course pourra être partagée avec d'autres voyageurs sur un trajet similaire.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-md p-3 flex justify-between items-center border border-blue-200">
                <div>
                  <span className="text-sm text-gray-500">Prix normal</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium line-through text-gray-500">
                      {formatPrice(initialPrice)}
                    </span>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0">
                      -20%
                    </Badge>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <div>
                  <span className="text-sm text-gray-500">Prix partagé</span>
                  <p className="text-lg font-medium text-blue-700">
                    {formatPrice(discountedPrice)}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-blue-700 font-medium">
                Économisez {formatPrice(savedAmount)}
              </p>
              
              {!showSharedRides && nearbySharedRides.length > 0 && (
                <div className="pt-2">
                  <Button 
                    onClick={handleViewSharedRides}
                    variant="outline"
                    className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Voir {nearbySharedRides.length} trajet{nearbySharedRides.length > 1 ? 's' : ''} à partager
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {showSharedRides && (
            <div className="space-y-3">
              <p className="font-medium">Trajets partagés disponibles</p>
              
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  {nearbySharedRides.length > 0 ? (
                    <div className="space-y-3">
                      {nearbySharedRides.map(ride => (
                        <Card key={ride.id} className="overflow-hidden">
                          <div className="bg-blue-50 p-2 border-b border-blue-100 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-700">
                                Trajet partagé
                              </span>
                            </div>
                            <Badge variant="outline" className="bg-blue-100 border-blue-200 text-blue-700">
                              {ride.max_passengers || 2} places
                            </Badge>
                          </div>
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <div className="relative mt-0.5">
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <div className="absolute top-2 bottom-0 left-1/2 w-0.5 -ml-[1px] border-l border-dotted border-gray-300 h-6"></div>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Départ</p>
                                  <p className="font-medium text-sm">{ride.pickup_address}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Destination</p>
                                  <p className="font-medium text-sm">{ride.destination_address}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                  <Clock className="h-4 w-4" />
                                  <span>Départ dans ~10 min</span>
                                </div>
                                <Button 
                                  size="sm"
                                  onClick={() => handleJoinRide(ride.id)}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  Rejoindre
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-md text-center">
                      <Info className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Aucun trajet partagé disponible pour le moment</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Nous vous attribuerons d'autres passagers si des trajets similaires sont réservés
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
      
      <Separator />
    </div>
  );
};

export default RideSharing;
