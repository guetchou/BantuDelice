
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Clock, Car, User, ArrowRight, MapPin, Navigation } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import RidesharingMap from './RidesharingMap';

interface RideFormProps {
  isRecurring?: boolean;
}

const RideForm: React.FC<RideFormProps> = ({ isRecurring = false }) => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [seats, setSeats] = useState("1");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [returnTrip, setReturnTrip] = useState("no");
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "map">("form");
  const [isSelectingPickup, setIsSelectingPickup] = useState(false);
  const [isSelectingDestination, setIsSelectingDestination] = useState(false);
  const [pickupCoordinates, setPickupCoordinates] = useState<[number, number] | undefined>(undefined);
  const [destinationCoordinates, setDestinationCoordinates] = useState<[number, number] | undefined>(undefined);
  
  // Additional fields for recurring trips
  const [daySelections, setDaySelections] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  
  const [departureTime, setDepartureTime] = useState("08:00");
  const [returnTime, setReturnTime] = useState("18:00");
  
  const handleToggleDay = (day: keyof typeof daySelections) => {
    setDaySelections(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  // Handle location selection from map
  const handlePickupSelect = (coordinates: [number, number], address: string) => {
    setPickupCoordinates(coordinates);
    setOrigin(address);
    setIsSelectingPickup(false);
  };

  const handleDestinationSelect = (coordinates: [number, number], address: string) => {
    setDestinationCoordinates(coordinates);
    setDestination(address);
    setIsSelectingDestination(false);
  };

  // Toggle selection modes
  const startPickupSelection = () => {
    setIsSelectingDestination(false);
    setIsSelectingPickup(true);
    setActiveTab("map");
  };

  const startDestinationSelection = () => {
    setIsSelectingPickup(false);
    setIsSelectingDestination(true);
    setActiveTab("map");
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!origin || !destination || !date) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    if (returnTrip === "yes" && !returnDate) {
      toast.error("Veuillez sélectionner une date de retour");
      return;
    }
    
    if (isRecurring && !Object.values(daySelections).some(Boolean)) {
      toast.error("Veuillez sélectionner au moins un jour de la semaine");
      return;
    }
    
    // Validate price format
    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error("Le prix doit être un nombre positif");
      return;
    }

    // Validate coordinates
    if (!pickupCoordinates || !destinationCoordinates) {
      toast.error("Veuillez sélectionner les emplacements sur la carte");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Mock API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(
        isRecurring 
          ? "Trajet régulier publié avec succès" 
          : "Trajet publié avec succès"
      );
      
      navigate("/covoiturage");
    } catch (error) {
      console.error("Error publishing ride:", error);
      toast.error("Une erreur est survenue lors de la publication du trajet");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full shadow-sm border-gray-200">
      <CardHeader>
        <CardTitle>
          {isRecurring 
            ? "Proposer un trajet régulier" 
            : "Proposer un trajet ponctuel"}
        </CardTitle>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "form" | "map")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Formulaire</TabsTrigger>
            <TabsTrigger value="map">Carte</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent>
        <TabsContent value="form" className="mt-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Origin and Destination */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Départ</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="origin"
                    placeholder="Adresse ou lieu de départ"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-1"
                    onClick={startPickupSelection}
                  >
                    <Navigation className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="destination"
                    placeholder="Adresse ou lieu d'arrivée"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-1"
                    onClick={startDestinationSelection}
                  >
                    <Navigation className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Date and Time Section */}
            {isRecurring ? (
              <div className="space-y-4">
                <div>
                  <Label>Jours de trajet</Label>
                  <div className="grid grid-cols-7 gap-1 mt-2">
                    {Object.entries(daySelections).map(([day, isSelected]) => (
                      <Button
                        key={day}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        className="h-10 w-10 p-0"
                        onClick={() => handleToggleDay(day as keyof typeof daySelections)}
                      >
                        {day.charAt(0).toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="departureTime">Heure de départ</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="departureTime"
                        type="time"
                        value={departureTime}
                        onChange={(e) => setDepartureTime(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="returnTime">Heure de retour</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="returnTime"
                        type="time"
                        value={returnTime}
                        onChange={(e) => setReturnTime(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Date du trajet</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? formatDate(date) : "Sélectionner une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-3">
                  <Label>Proposer un trajet retour ?</Label>
                  <RadioGroup
                    value={returnTrip}
                    onValueChange={setReturnTrip}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="return-yes" />
                      <Label htmlFor="return-yes">Oui</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="return-no" />
                      <Label htmlFor="return-no">Non</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {returnTrip === "yes" && (
                  <div className="space-y-2">
                    <Label>Date de retour</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {returnDate ? formatDate(returnDate) : "Sélectionner une date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={returnDate}
                          onSelect={setReturnDate}
                          initialFocus
                          disabled={(date) => {
                            if (!date) return false;
                            return date < (new Date());
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>
            )}
            
            {/* Vehicle and Price Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="seats">Places disponibles</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <select
                    id="seats"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    className="w-full pl-10 h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="1">1 place</option>
                    <option value="2">2 places</option>
                    <option value="3">3 places</option>
                    <option value="4">4 places</option>
                    <option value="5">5 places</option>
                    <option value="6">6+ places</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Prix par personne (FCFA)</Label>
                <div className="relative">
                  <Input
                    id="price"
                    type="number"
                    placeholder="ex: 2000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Informations complémentaires</Label>
              <Textarea
                id="description"
                placeholder="Précisions sur le lieu de rendez-vous, conditions particulières, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </form>
        </TabsContent>

        <TabsContent value="map" className="mt-0 space-y-4">
          <div className="h-[400px] w-full rounded-lg border overflow-hidden">
            <RidesharingMap
              pickupCoordinates={pickupCoordinates}
              destinationCoordinates={destinationCoordinates}
              onPickupSelect={handlePickupSelect}
              onDestinationSelect={handleDestinationSelect}
              isSelectingPickup={isSelectingPickup}
              isSelectingDestination={isSelectingDestination}
              showCurrentLocation={true}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant={pickupCoordinates ? "outline" : "default"}
              onClick={startPickupSelection}
              className="w-full"
            >
              {pickupCoordinates ? "Modifier départ" : "Définir départ"}
            </Button>
            <Button 
              variant={destinationCoordinates ? "outline" : "default"}
              onClick={startDestinationSelection}
              className="w-full"
            >
              {destinationCoordinates ? "Modifier destination" : "Définir destination"}
            </Button>
          </div>
          <div>
            {origin && (
              <div className="flex items-start gap-2 mb-2">
                <MapPin className="h-4 w-4 text-green-600 mt-1 shrink-0" />
                <div>
                  <span className="text-sm text-gray-500">Départ:</span>
                  <p className="text-sm">{origin}</p>
                </div>
              </div>
            )}
            {destination && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-orange-600 mt-1 shrink-0" />
                <div>
                  <span className="text-sm text-gray-500">Destination:</span>
                  <p className="text-sm">{destination}</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigate("/covoiturage")}>
          Annuler
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isLoading || !origin || !destination || !pickupCoordinates || !destinationCoordinates}
          className="bg-green-600 hover:bg-green-700"
        >
          {isLoading ? "Publication..." : "Publier le trajet"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RideForm;
