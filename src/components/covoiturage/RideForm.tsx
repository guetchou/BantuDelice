
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/hooks/use-toast";
import RidesharingMap from './RidesharingMap';
import { useGeocoding } from '@/hooks/useGeocoding';
import { useNavigate } from 'react-router-dom';

const RideForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { geocode, getCurrentLocation, isLoading } = useGeocoding();

  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [pickupCoordinates, setPickupCoordinates] = useState<[number, number] | null>(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState<[number, number] | null>(null);
  const [date, setDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState('');
  const [availableSeats, setAvailableSeats] = useState('1');
  const [price, setPrice] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState<string[]>([]);
  const [isSelectingPickup, setIsSelectingPickup] = useState(false);
  const [isSelectingDestination, setIsSelectingDestination] = useState(false);
  const [preferredPayment, setPreferredPayment] = useState('cash');
  const [comments, setComments] = useState('');
  const [allowMultipleStops, setAllowMultipleStops] = useState(false);

  useEffect(() => {
    // Try to get user's current location on component mount
    handleUseCurrentLocation();
  }, []);

  const handlePickupSelect = async (address: string) => {
    setIsSelectingPickup(true);
    setPickupAddress(address);
    try {
      const result = await geocode(address);
      if (result) {
        setPickupCoordinates(result.coordinates);
      }
    } catch (error) {
      console.error('Error geocoding pickup address:', error);
    } finally {
      setIsSelectingPickup(false);
    }
  };

  const handleDestinationSelect = async (address: string) => {
    setIsSelectingDestination(true);
    setDestinationAddress(address);
    try {
      const result = await geocode(address);
      if (result) {
        setDestinationCoordinates(result.coordinates);
      }
    } catch (error) {
      console.error('Error geocoding destination address:', error);
    } finally {
      setIsSelectingDestination(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      const result = await getCurrentLocation();
      if (result) {
        setPickupCoordinates(result.coordinates);
        setPickupAddress(result.address);
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      toast({
        title: "Erreur de localisation",
        description: "Impossible d'accéder à votre position actuelle.",
        variant: "destructive",
      });
    }
  };

  const handleMapPickupSelect = (coordinates: [number, number], address: string) => {
    setPickupCoordinates(coordinates);
    setPickupAddress(address);
    setIsSelectingPickup(false);
  };

  const handleMapDestinationSelect = (coordinates: [number, number], address: string) => {
    setDestinationCoordinates(coordinates);
    setDestinationAddress(address);
    setIsSelectingDestination(false);
  };

  const handleToggleRecurring = () => {
    setIsRecurring(!isRecurring);
  };

  const handleRecurringDayToggle = (day: string) => {
    if (recurringDays.includes(day)) {
      setRecurringDays(recurringDays.filter(d => d !== day));
    } else {
      setRecurringDays([...recurringDays, day]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pickupCoordinates || !destinationCoordinates || !date || !time || !price) {
      toast({
        title: "Erreur de formulaire",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulating a successful ride creation
    toast({
      title: "Trajet publié !",
      description: "Votre trajet a été publié avec succès.",
      variant: "default",
    });
    
    // Redirect to rides list or confirmation page
    setTimeout(() => {
      navigate('/covoiturage/mes-trajets');
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Proposer un trajet</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Détails du trajet</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pickup">Point de départ</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="pickup"
                      placeholder="Saisissez votre point de départ"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      onBlur={() => handlePickupSelect(pickupAddress)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setIsSelectingPickup(true)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="px-0"
                    onClick={handleUseCurrentLocation}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Chargement...' : 'Utiliser ma position actuelle'}
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="destination"
                      placeholder="Saisissez votre destination"
                      value={destinationAddress}
                      onChange={(e) => setDestinationAddress(e.target.value)}
                      onBlur={() => handleDestinationSelect(destinationAddress)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setIsSelectingDestination(true)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <DatePicker date={date} setDate={setDate} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Heure</Label>
                    <Input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seats">Places disponibles</Label>
                    <Select value={availableSeats} onValueChange={setAvailableSeats}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 place</SelectItem>
                        <SelectItem value="2">2 places</SelectItem>
                        <SelectItem value="3">3 places</SelectItem>
                        <SelectItem value="4">4 places</SelectItem>
                        <SelectItem value="5">5+ places</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix par passager (XAF)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="Ex: 2000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="recurring"
                      checked={isRecurring}
                      onChange={handleToggleRecurring}
                      className="rounded"
                    />
                    <Label htmlFor="recurring">Trajet régulier</Label>
                  </div>
                  
                  {isRecurring && (
                    <div className="pt-2">
                      <Label className="block mb-2">Jours de la semaine</Label>
                      <div className="flex flex-wrap gap-2">
                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day, index) => {
                          const dayNames: Record<string, string> = {
                            monday: 'Lun',
                            tuesday: 'Mar',
                            wednesday: 'Mer',
                            thursday: 'Jeu',
                            friday: 'Ven',
                            saturday: 'Sam',
                            sunday: 'Dim'
                          };
                          
                          return (
                            <Button
                              key={day}
                              type="button"
                              variant={recurringDays.includes(day) ? "default" : "outline"}
                              className="w-12 h-10"
                              onClick={() => handleRecurringDayToggle(day)}
                            >
                              {dayNames[day]}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment">Méthode de paiement préférée</Label>
                  <Select value={preferredPayment} onValueChange={setPreferredPayment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Espèces</SelectItem>
                      <SelectItem value="mobile">Mobile Money</SelectItem>
                      <SelectItem value="wallet">Portefeuille EazyCongo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="comments">Commentaires (optionnel)</Label>
                  <Input
                    id="comments"
                    placeholder="Précisions sur le trajet, bagage autorisé, etc."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="multiple-stops"
                    checked={allowMultipleStops}
                    onChange={() => setAllowMultipleStops(!allowMultipleStops)}
                    className="rounded"
                  />
                  <Label htmlFor="multiple-stops">Accepter des arrêts intermédiaires</Label>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button type="submit" className="w-full">Publier le trajet</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Carte du trajet</CardTitle>
            </CardHeader>
            <CardContent className="p-2 h-[500px]">
              <RidesharingMap
                pickupCoordinates={pickupCoordinates || undefined}
                destinationCoordinates={destinationCoordinates || undefined}
                onPickupSelect={handleMapPickupSelect}
                onDestinationSelect={handleMapDestinationSelect}
                isSelectingPickup={isSelectingPickup}
                isSelectingDestination={isSelectingDestination}
                routeVisible={!!(pickupCoordinates && destinationCoordinates)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RideForm;
