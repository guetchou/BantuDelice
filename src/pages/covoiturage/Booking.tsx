
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, MapPin, Calendar, Clock, Users, CreditCard, MessageSquare } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const CovoiturageBooking = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [passengerCount, setPassengerCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // In a real app, you'd fetch the trip details from an API
  const tripDetails = {
    id: id || 'trip-123',
    departure: 'Brazzaville, Centre-ville',
    destination: 'Matadi',
    date: '15 Avril 2025',
    time: '09:30',
    driver: 'Jean Mutombo',
    price: 35,
    availableSeats: 3,
    estimatedDuration: '4h 30m'
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to book the trip
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: "Réservation confirmée !",
        description: "Votre trajet a été réservé avec succès.",
      });
      
      navigate('/covoiturage/mes-trajets');
    }, 1500);
  };
  
  const handleBack = () => {
    navigate(`/covoiturage/details/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center gap-2"
        onClick={handleBack}
      >
        <ChevronLeft className="h-4 w-4" /> Retour aux détails du trajet
      </Button>
      
      <h1 className="text-3xl font-bold mb-6">Réserver ce trajet</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Détails du trajet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">De</p>
                      <p className="text-muted-foreground">{tripDetails.departure}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">À</p>
                      <p className="text-muted-foreground">{tripDetails.destination}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-muted-foreground">{tripDetails.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">Heure de départ</p>
                      <p className="text-muted-foreground">{tripDetails.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">Nombre de passagers</p>
                      <div className="flex items-center mt-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
                          disabled={passengerCount <= 1}
                        >
                          -
                        </Button>
                        <span className="mx-4 font-medium">{passengerCount}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setPassengerCount(Math.min(tripDetails.availableSeats, passengerCount + 1))}
                          disabled={passengerCount >= tripDetails.availableSeats}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Message au conducteur (optionnel)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                  <Textarea 
                    placeholder="Avez-vous des questions ou des informations à communiquer au conducteur ?"
                    className="resize-none" 
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Méthode de paiement</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={setPaymentMethod}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="flex items-center">
                        <CreditCard className="mr-2 h-5 w-5" />
                        <span>Carte bancaire</span>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="mobile" id="mobile" />
                    <Label htmlFor="mobile" className="flex-1 cursor-pointer">
                      <div className="flex items-center">
                        <CreditCard className="mr-2 h-5 w-5" />
                        <span>Paiement mobile</span>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex-1 cursor-pointer">
                      <div className="flex items-center">
                        <CreditCard className="mr-2 h-5 w-5" />
                        <span>Espèces</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                
                {paymentMethod === 'card' && (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Titulaire de la carte</Label>
                        <Input id="cardName" placeholder="Nom du titulaire" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Numéro de carte</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Date d'expiration</Label>
                        <Input id="expiryDate" placeholder="MM/AA" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'mobile' && (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
                      <Input id="phoneNumber" placeholder="+242 ..." />
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Traitement..." : "Confirmer la réservation"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
        
        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Résumé du paiement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Prix par personne</span>
                <span>{tripDetails.price} FCFA </span>
              </div>
              
              <div className="flex justify-between">
                <span>Nombre de passagers</span>
                <span>× {passengerCount}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{tripDetails.price * passengerCount} FCFA </span>
              </div>
              
              <div className="text-xs text-muted-foreground pt-4">
                <p>En confirmant cette réservation, vous acceptez les conditions générales d'utilisation et la politique de confidentialité.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CovoiturageBooking;
