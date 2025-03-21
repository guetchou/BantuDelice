
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  CreditCard, 
  Car, 
  ChevronRight,
  Search,
  UserCheck,
  User,
  Users,
  Briefcase,
  Navigation,
  MapPinned
} from 'lucide-react';

const BookingPage = () => {
  const [bookingStep, setBookingStep] = useState(1);
  const [vehicleType, setVehicleType] = useState('standard');
  const [pickupTime, setPickupTime] = useState('now');
  const [isSharedRide, setIsSharedRide] = useState(false);
  
  const handleNextStep = () => {
    setBookingStep(prev => Math.min(prev + 1, 4));
  };
  
  const handlePrevStep = () => {
    setBookingStep(prev => Math.max(prev - 1, 1));
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Réservation de taxi</h1>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={bookingStep * 25} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Trajet</span>
            <span>Véhicule</span>
            <span>Détails</span>
            <span>Paiement</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* Step 1: Location */}
            {bookingStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Votre trajet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="relative">
                    <div className="absolute left-4 inset-y-0 flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-4"></div>
                      <div className="w-0.5 h-full bg-gray-200 -mt-2"></div>
                    </div>
                    <Input
                      placeholder="Point de départ"
                      className="pl-10"
                    />
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      <MapPinned className="h-4 w-4 text-blue-500" />
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute left-4 inset-y-0 flex items-center">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    </div>
                    <Input
                      placeholder="Destination"
                      className="pl-10"
                    />
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Type de trajet</h3>
                    <RadioGroup 
                      defaultValue="individual" 
                      className="flex gap-4"
                      onValueChange={(value) => setIsSharedRide(value === 'shared')}
                    >
                      <div className="flex items-start gap-2">
                        <RadioGroupItem value="individual" id="individual" />
                        <div>
                          <Label htmlFor="individual" className="font-medium">Individuel</Label>
                          <p className="text-sm text-gray-500">Seulement vous</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <RadioGroupItem value="shared" id="shared" />
                        <div>
                          <Label htmlFor="shared" className="font-medium">Partagé</Label>
                          <p className="text-sm text-gray-500">Économisez en partageant</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={handleNextStep} className="w-full bg-orange-500 hover:bg-orange-600">
                      Continuer <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Step 2: Vehicle Type */}
            {bookingStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Choisissez votre véhicule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <VehicleOption
                      id="standard"
                      title="Standard"
                      price="1 500 FCFA"
                      description="Berline confortable pour 4 personnes"
                      icon={<Car className="h-8 w-8" />}
                      isSelected={vehicleType === 'standard'}
                      onSelect={() => setVehicleType('standard')}
                    />
                    
                    <VehicleOption
                      id="comfort"
                      title="Confort"
                      price="2 500 FCFA"
                      description="Plus d'espace, climatisation, eau offerte"
                      icon={<Car className="h-8 w-8" />}
                      isSelected={vehicleType === 'comfort'}
                      onSelect={() => setVehicleType('comfort')}
                    />
                    
                    <VehicleOption
                      id="premium"
                      title="Premium"
                      price="4 000 FCFA"
                      description="Service haut de gamme, véhicule de luxe"
                      icon={<Car className="h-8 w-8" />}
                      isSelected={vehicleType === 'premium'}
                      onSelect={() => setVehicleType('premium')}
                    />
                    
                    <VehicleOption
                      id="van"
                      title="Van"
                      price="5 000 FCFA"
                      description="Parfait pour les groupes jusqu'à 6 personnes"
                      icon={<Users className="h-8 w-8" />}
                      isSelected={vehicleType === 'van'}
                      onSelect={() => setVehicleType('van')}
                    />
                  </div>
                  
                  <div className="flex justify-between pt-6">
                    <Button variant="outline" onClick={handlePrevStep}>
                      Retour
                    </Button>
                    <Button onClick={handleNextStep} className="bg-orange-500 hover:bg-orange-600">
                      Continuer <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Step 3: Time & Details */}
            {bookingStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Détails de la course</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Quand souhaitez-vous partir?</h3>
                      <Tabs defaultValue="now" onValueChange={setPickupTime}>
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="now">Maintenant</TabsTrigger>
                          <TabsTrigger value="scheduled">Planifier</TabsTrigger>
                        </TabsList>
                        <TabsContent value="now" className="pt-4">
                          <p className="text-sm text-gray-600">
                            Votre chauffeur arrivera dans les 5-10 minutes après la confirmation.
                          </p>
                        </TabsContent>
                        <TabsContent value="scheduled" className="pt-4 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="date">Date</Label>
                              <div className="relative mt-1">
                                <Input id="date" type="date" />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="time">Heure</Label>
                              <div className="relative mt-1">
                                <Input id="time" type="time" />
                                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-3">Raison du voyage</h3>
                      <RadioGroup defaultValue="personal">
                        <div className="flex space-x-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="personal" id="personal" />
                            <Label htmlFor="personal">Personnel</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="business" id="business" />
                            <Label htmlFor="business">Professionnel</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label htmlFor="special-instructions">Instructions spéciales (facultatif)</Label>
                      <Input
                        id="special-instructions"
                        placeholder="Informations pour le chauffeur"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-6">
                    <Button variant="outline" onClick={handlePrevStep}>
                      Retour
                    </Button>
                    <Button onClick={handleNextStep} className="bg-orange-500 hover:bg-orange-600">
                      Continuer <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Step 4: Payment */}
            {bookingStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Paiement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Méthode de paiement</h3>
                      <RadioGroup defaultValue="cash">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3 border rounded-lg p-3">
                            <RadioGroupItem value="cash" id="cash" />
                            <Label htmlFor="cash" className="flex items-center">
                              <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
                              Paiement en espèces
                            </Label>
                          </div>
                          
                          <div className="flex items-center space-x-3 border rounded-lg p-3">
                            <RadioGroupItem value="mobile_money" id="mobile_money" />
                            <Label htmlFor="mobile_money" className="flex items-center">
                              <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
                              Mobile Money
                            </Label>
                          </div>
                          
                          <div className="flex items-center space-x-3 border rounded-lg p-3">
                            <RadioGroupItem value="card" id="card" />
                            <Label htmlFor="card" className="flex items-center">
                              <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
                              Carte bancaire
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label htmlFor="promo">Code promotionnel (facultatif)</Label>
                      <div className="flex gap-2 mt-1">
                        <Input id="promo" placeholder="Entrez un code" />
                        <Button variant="outline">Appliquer</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-6">
                    <Button variant="outline" onClick={handlePrevStep}>
                      Retour
                    </Button>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      Réserver maintenant
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Ride Summary */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Résumé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Point de départ</p>
                      <p className="font-medium">Centre-ville, Brazzaville</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Navigation className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Destination</p>
                      <p className="font-medium">Aéroport international</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-gray-500" />
                      <span>Type de véhicule</span>
                    </div>
                    <span className="font-medium capitalize">{vehicleType}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <span>Heure de départ</span>
                    </div>
                    <span className="font-medium">
                      {pickupTime === 'now' ? 'Maintenant' : 'Planifiée'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-gray-500" />
                      <span>Type de trajet</span>
                    </div>
                    <span className="font-medium">
                      {isSharedRide ? 'Partagé' : 'Individuel'}
                    </span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Prix de base</span>
                    <span>2 500 FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Frais de service</span>
                    <span>300 FCFA</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2">
                    <span>Total</span>
                    <span>2 800 FCFA</span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <p className="text-xs text-gray-500">
                    En confirmant, vous acceptez nos Conditions Générales et notre Politique de confidentialité.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for vehicle selection
const VehicleOption = ({ 
  id, 
  title, 
  price, 
  description, 
  icon, 
  isSelected, 
  onSelect 
}: { 
  id: string; 
  title: string; 
  price: string; 
  description: string; 
  icon: React.ReactNode; 
  isSelected: boolean; 
  onSelect: () => void;
}) => {
  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected ? 'border-orange-500 bg-orange-50' : 'hover:border-gray-400'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className={`p-3 rounded-full ${
            isSelected ? 'bg-orange-100' : 'bg-gray-100'
          }`}>
            {icon}
          </div>
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{title}</h3>
            <span className="font-bold">{price}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        
        <div className="flex-shrink-0 ml-2">
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            isSelected 
              ? 'border-orange-500 bg-orange-500 text-white' 
              : 'border-gray-300'
          }`}>
            {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
