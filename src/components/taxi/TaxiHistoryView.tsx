
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Car, CreditCard, ArrowUpRight, CalendarClock, Info, Ban } from "lucide-react";
import { useTaxiHistory } from '@/hooks/useTaxiHistory';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { TaxiRide } from '@/types/taxi';

export default function TaxiHistoryView() {
  const navigate = useNavigate();
  const { pastRides, upcomingRides, isLoading, cancelUpcomingRide } = useTaxiHistory();
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [selectedRide, setSelectedRide] = useState<TaxiRide | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };
  
  const formatStatus = (status: string) => {
    switch(status) {
      case 'pending': return 'En attente';
      case 'accepted': return 'Acceptée';
      case 'en_route': return 'En route';
      case 'arrived': return 'Arrivée';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500';
      case 'accepted': return 'bg-blue-500';
      case 'en_route': return 'bg-indigo-500';
      case 'arrived': return 'bg-purple-500';
      case 'in_progress': return 'bg-green-500';
      case 'completed': return 'bg-green-700';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const handleCancelRide = async () => {
    if (!selectedRide) return;
    
    const success = await cancelUpcomingRide(selectedRide.id);
    
    if (success) {
      toast.success("Course annulée avec succès");
      setShowCancelDialog(false);
      setSelectedRide(null);
    } else {
      toast.error("Impossible d'annuler la course");
    }
  };
  
  const showRideDetails = (ride: TaxiRide) => {
    setSelectedRide(ride);
  };
  
  const viewRideDetails = (rideId: string) => {
    navigate(`/taxi/ride/${rideId}`);
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming" className="relative">
            Courses prévues
            {upcomingRides.length > 0 && (
              <Badge className="absolute top-0 right-2 translate-x-1/2 -translate-y-1/2 bg-primary text-xs h-5 min-w-5 flex items-center justify-center">
                {upcomingRides.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="past">Historique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : upcomingRides.length > 0 ? (
            <div className="space-y-4">
              {upcomingRides.map(ride => (
                <Card key={ride.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{format(new Date(ride.pickup_time), 'EEEE d MMMM', { locale: fr })}</h3>
                          <p className="text-sm text-gray-500">{format(new Date(ride.pickup_time), 'HH:mm', { locale: fr })}</p>
                        </div>
                        <Badge className={`${getStatusColor(ride.status)}`}>
                          {formatStatus(ride.status)}
                        </Badge>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="mt-1">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Départ</p>
                            <p className="text-sm text-gray-600">{ride.pickup_address}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <div className="mt-1">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Destination</p>
                            <p className="text-sm text-gray-600">{ride.destination_address}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-between items-center">
                        <div className="text-sm">
                          <span className="font-medium">Prix estimé:</span> {ride.estimated_price} FCFA
                        </div>
                        <div className="text-sm capitalize">
                          <Car className="inline-block mr-1 h-3.5 w-3.5" /> {ride.vehicle_type}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setSelectedRide(ride);
                            setShowCancelDialog(true);
                          }}
                        >
                          <Ban className="mr-1 h-4 w-4" /> Annuler
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => viewRideDetails(ride.id)}
                        >
                          Détails <ArrowUpRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <CalendarClock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune course prévue</h3>
              <p className="text-gray-500 mb-6">Vous n'avez pas de courses à venir</p>
              <Button onClick={() => navigate('/taxi/booking')}>
                Réserver un taxi
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="mt-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : pastRides.length > 0 ? (
            <div className="space-y-4">
              {pastRides.map(ride => (
                <Card key={ride.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{formatDate(ride.pickup_time)}</h3>
                        </div>
                        <Badge className={`${getStatusColor(ride.status)}`}>
                          {formatStatus(ride.status)}
                        </Badge>
                      </div>
                      
                      <div className="mt-3 space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                          <p className="text-sm text-gray-600">{ride.pickup_address} → {ride.destination_address}</p>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            {ride.distance_km ? `${ride.distance_km} km` : "Distance non disponible"}
                          </div>
                          <div className="flex items-center">
                            <CreditCard className="h-3.5 w-3.5 mr-1" />
                            {ride.actual_price ? `${ride.actual_price} FCFA` : `${ride.estimated_price} FCFA`}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary" 
                          onClick={() => showRideDetails(ride)}
                        >
                          Voir détails
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Info className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun historique</h3>
              <p className="text-gray-500">Vous n'avez pas encore effectué de course</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Détails de la course sélectionnée */}
      {selectedRide && (
        <Dialog open={!!selectedRide && !showCancelDialog} onOpenChange={() => setSelectedRide(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Détails de la course</DialogTitle>
              <DialogDescription>
                {formatDate(selectedRide.pickup_time)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="flex flex-col gap-1">
                <div className="text-sm text-gray-500">Statut</div>
                <Badge className={`${getStatusColor(selectedRide.status)}`}>
                  {formatStatus(selectedRide.status)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Type de véhicule</div>
                  <div className="capitalize">{selectedRide.vehicle_type}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Mode de paiement</div>
                  <div className="capitalize">
                    {selectedRide.payment_method === 'cash' ? 'Espèces' : 
                     selectedRide.payment_method === 'card' ? 'Carte bancaire' : 
                     selectedRide.payment_method === 'mobile_money' ? 'Mobile Money' : 
                     selectedRide.payment_method}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500">Trajet</div>
                <div className="space-y-2 mt-1">
                  <div className="flex items-start gap-2">
                    <div className="mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Départ</p>
                      <p className="text-sm text-gray-600">{selectedRide.pickup_address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className="mt-1">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Destination</p>
                      <p className="text-sm text-gray-600">{selectedRide.destination_address}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Distance</div>
                  <div>{selectedRide.distance_km ? `${selectedRide.distance_km} km` : "Non disponible"}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Prix</div>
                  <div className="font-medium">
                    {selectedRide.actual_price ? `${selectedRide.actual_price} FCFA` : `${selectedRide.estimated_price} FCFA (estimé)`}
                  </div>
                </div>
              </div>
              
              {selectedRide.special_instructions && (
                <div>
                  <div className="text-sm text-gray-500">Instructions spéciales</div>
                  <div className="p-2 bg-gray-50 rounded text-sm mt-1">
                    {selectedRide.special_instructions}
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                onClick={() => {
                  setSelectedRide(null);
                  if (selectedRide.status === 'pending' || selectedRide.status === 'accepted') {
                    navigate(`/taxi/ride/${selectedRide.id}`);
                  }
                }}
              >
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Boîte de dialogue pour l'annulation */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer l'annulation</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir annuler cette course ?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-gray-500">
              L'annulation peu de temps avant le départ peut entraîner des frais supplémentaires conformément à nos conditions générales.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Retour
            </Button>
            <Button variant="destructive" onClick={handleCancelRide}>
              Confirmer l'annulation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
