
import React, { useState } from 'react';
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
import { CalendarIcon, Clock, Car, User, ArrowRight, MapPin } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

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
      </CardHeader>
      
      <CardContent>
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
                  className="pl-10"
                  required
                />
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
                  className="pl-10"
                  required
                />
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
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigate("/covoiturage")}>
          Annuler
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isLoading}
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
