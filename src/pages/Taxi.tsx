
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, Car, Clock, CheckCircle, CreditCard, TriangleAlert, Star, User, Phone } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTaxiBooking } from '@/hooks/useTaxiBooking';
import { useUser } from '@/hooks/useUser';

const vehicleTypes = [
  { id: 'standard', name: 'Standard', description: 'Berline confortable pour 1-4 personnes', price: 5000, image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGF4aXxlbnwwfHwwfHx8MA%3D%3D' },
  { id: 'premium', name: 'Premium', description: 'Véhicule haut de gamme pour 1-3 personnes', price: 8000, image: 'https://images.unsplash.com/photo-1588618575327-fa8218b75ea2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dGF4aXxlbnwwfHwwfHx8MA%3D%3D' },
  { id: 'van', name: 'Van', description: 'Minivan pour 4-7 personnes avec bagages', price: 10000, image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHZhbnxlbnwwfHwwfHx8MA%3D%3D' }
];

export default function Taxi() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { createBooking, isLoading } = useTaxiBooking();
  const [activeStep, setActiveStep] = useState(0);
  const [bgLoaded, setBgLoaded] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    pickup_address: '',
    destination_address: '',
    pickup_time: 'immediate', // immediate or scheduled
    scheduled_time: new Date().toISOString().slice(0, 16), // for scheduled pickup
    vehicle_type: 'standard',
    passengers: '1',
    payment_method: 'cash',
    contact_name: user?.first_name || '',
    contact_phone: '',
    special_instructions: ''
  });
  
  // Set selected vehicle based on vehicle type
  const [selectedVehicle, setSelectedVehicle] = useState(vehicleTypes[0]);
  
  useEffect(() => {
    const vehicle = vehicleTypes.find(v => v.id === formData.vehicle_type);
    if (vehicle) {
      setSelectedVehicle(vehicle);
    }
  }, [formData.vehicle_type]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateCurrentStep = () => {
    switch (activeStep) {
      case 0: // Address step
        return formData.pickup_address && formData.destination_address;
      case 1: // Time step
        if (formData.pickup_time === 'scheduled') {
          return formData.scheduled_time;
        }
        return true;
      case 2: // Vehicle step
        return formData.vehicle_type && formData.passengers;
      case 3: // Contact step
        return formData.contact_name && formData.contact_phone;
      default:
        return true;
    }
  };
  
  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setActiveStep(prev => Math.min(4, prev + 1));
    } else {
      toast.error("Veuillez remplir tous les champs requis");
    }
  };
  
  const handleReservation = async () => {
    try {
      const bookingData = {
        pickup_address: formData.pickup_address,
        destination_address: formData.destination_address,
        pickup_time: formData.pickup_time === 'immediate' 
          ? new Date().toISOString() 
          : formData.scheduled_time,
        status: 'pending',
        vehicle_type: formData.vehicle_type,
        payment_method: formData.payment_method,
        estimated_price: selectedVehicle.price,
        payment_status: 'pending',
        special_instructions: formData.special_instructions,
        pickup_latitude: 0, // Would come from a geocoding service in prod
        pickup_longitude: 0, // Would come from a geocoding service in prod
        destination_latitude: 0, // Would come from a geocoding service in prod
        destination_longitude: 0 // Would come from a geocoding service in prod
      };
      
      toast.success("Votre réservation a été prise en compte", {
        description: "Recherche d'un chauffeur en cours..."
      });
      
      // In a real application, we would save this to the database
      // const ride = await createBooking(bookingData);
      
      // For demo purposes, navigate to a fake ride page after a short delay
      setTimeout(() => {
        navigate(`/taxi/ride/${Math.random().toString(36).substring(7)}`);
      }, 1500);
    } catch (error) {
      toast.error("Une erreur est survenue lors de la réservation", {
        description: error.message
      });
    }
  };
  
  // Preload the background image
  useEffect(() => {
    const img = new Image();
    img.src = "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071&auto=format&fit=crop";
    img.onload = () => setBgLoaded(true);
  }, []);
  
  return (
    <div className="min-h-screen relative py-12">
      {/* Background image with overlay */}
      <div 
        className={`absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-1000 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071&auto=format&fit=crop")', 
          backgroundAttachment: 'fixed' 
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Réservation de Taxi
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Service de taxi rapide, fiable et sécurisé pour tous vos déplacements à Brazzaville
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-white/10 backdrop-blur border-white/10 text-white h-full">
              <CardHeader className="pb-3">
                <CheckCircle className="h-12 w-12 text-green-400 mb-2" />
                <CardTitle>Rapide et Efficace</CardTitle>
                <CardDescription className="text-gray-300">
                  Réservez en quelques clics et obtenez un taxi en moins de 5 minutes
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur border-white/10 text-white h-full">
              <CardHeader className="pb-3">
                <Star className="h-12 w-12 text-yellow-400 mb-2" />
                <CardTitle>Chauffeurs Professionnels</CardTitle>
                <CardDescription className="text-gray-300">
                  Tous nos chauffeurs sont formés et certifiés pour votre sécurité
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-white/10 backdrop-blur border-white/10 text-white h-full">
              <CardHeader className="pb-3">
                <CreditCard className="h-12 w-12 text-blue-400 mb-2" />
                <CardTitle>Paiement Facile</CardTitle>
                <CardDescription className="text-gray-300">
                  Options de paiement multiples: espèces, carte ou mobile money
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/10">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="flex items-center gap-2 text-white">
                <Car className="h-6 w-6 text-primary" />
                <span>Réservez votre taxi</span>
              </CardTitle>
              <CardDescription className="text-gray-300">
                Complétez les informations ci-dessous pour réserver votre course
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Steps indicator */}
              <div className="relative mb-8">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-white/10">
                  <div 
                    style={{ width: `${(activeStep + 1) * 20}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
                  ></div>
                </div>
                <div className="flex justify-between">
                  <div className={`text-xs ${activeStep >= 0 ? 'text-primary' : 'text-gray-400'}`}>Adresse</div>
                  <div className={`text-xs ${activeStep >= 1 ? 'text-primary' : 'text-gray-400'}`}>Horaire</div>
                  <div className={`text-xs ${activeStep >= 2 ? 'text-primary' : 'text-gray-400'}`}>Véhicule</div>
                  <div className={`text-xs ${activeStep >= 3 ? 'text-primary' : 'text-gray-400'}`}>Contact</div>
                  <div className={`text-xs ${activeStep >= 4 ? 'text-primary' : 'text-gray-400'}`}>Confirmation</div>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Step 1: Addresses */}
                {activeStep === 0 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label className="text-gray-200">Adresse de prise en charge</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input 
                          name="pickup_address"
                          value={formData.pickup_address}
                          onChange={handleInputChange}
                          placeholder="Votre localisation" 
                          className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-gray-200">Destination</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input 
                          name="destination_address"
                          value={formData.destination_address}
                          onChange={handleInputChange}
                          placeholder="Votre destination" 
                          className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Step 2: Time */}
                {activeStep === 1 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label className="text-gray-200">Quand souhaitez-vous partir?</Label>
                      <Select
                        value={formData.pickup_time}
                        onValueChange={(value) => handleSelectChange('pickup_time', value)}
                      >
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder="Sélectionnez une option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Départ immédiat</SelectItem>
                          <SelectItem value="scheduled">Départ programmé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {formData.pickup_time === 'scheduled' && (
                      <div className="space-y-2">
                        <Label className="text-gray-200">Date et heure de départ</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input 
                            type="datetime-local"
                            name="scheduled_time"
                            value={formData.scheduled_time}
                            onChange={handleInputChange}
                            className="pl-10 bg-white/5 border-white/20 text-white"
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
                
                {/* Step 3: Vehicle */}
                {activeStep === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <Label className="text-gray-200">Choisissez votre véhicule</Label>
                      
                      <div className="grid gap-4">
                        {vehicleTypes.map((vehicle) => (
                          <div 
                            key={vehicle.id}
                            onClick={() => handleSelectChange('vehicle_type', vehicle.id)}
                            className={`flex items-start rounded-lg p-3 cursor-pointer transition-all ${
                              formData.vehicle_type === vehicle.id 
                                ? 'bg-white/20 border border-primary/50' 
                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex-shrink-0 mr-4 rounded-md overflow-hidden" style={{width: '80px', height: '60px'}}>
                              <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h3 className="font-medium text-white">{vehicle.name}</h3>
                                <span className="font-bold text-primary">{vehicle.price} FCFA</span>
                              </div>
                              <p className="text-sm text-gray-300">{vehicle.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-gray-200">Nombre de passagers</Label>
                      <Select
                        value={formData.passengers}
                        onValueChange={(value) => handleSelectChange('passengers', value)}
                      >
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder="Nombre de passagers" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 personne</SelectItem>
                          <SelectItem value="2">2 personnes</SelectItem>
                          <SelectItem value="3">3 personnes</SelectItem>
                          <SelectItem value="4">4 personnes</SelectItem>
                          <SelectItem value="5+">5+ personnes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )}
                
                {/* Step 4: Contact Info */}
                {activeStep === 3 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label className="text-gray-200">Nom du contact</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input 
                          name="contact_name"
                          value={formData.contact_name}
                          onChange={handleInputChange}
                          placeholder="Votre nom" 
                          className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-gray-200">Numéro de téléphone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input 
                          name="contact_phone"
                          value={formData.contact_phone}
                          onChange={handleInputChange}
                          placeholder="Votre numéro" 
                          className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-gray-200">Mode de paiement</Label>
                      <Select
                        value={formData.payment_method}
                        onValueChange={(value) => handleSelectChange('payment_method', value)}
                      >
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder="Choisir un mode de paiement" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Espèces</SelectItem>
                          <SelectItem value="card">Carte bancaire</SelectItem>
                          <SelectItem value="mobile_money">Mobile Money</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-gray-200">Instructions spéciales (facultatif)</Label>
                      <Input 
                        name="special_instructions"
                        value={formData.special_instructions}
                        onChange={handleInputChange}
                        placeholder="Instructions pour le chauffeur" 
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                      />
                    </div>
                  </motion.div>
                )}
                
                {/* Step 5: Confirmation */}
                {activeStep === 4 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="border border-white/20 rounded-lg p-4 bg-white/5">
                      <h3 className="font-medium text-white mb-3">Résumé de votre réservation</h3>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-gray-400">Prise en charge:</span>
                          <span className="text-white">{formData.pickup_address}</span>
                        </div>
                        
                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-gray-400">Destination:</span>
                          <span className="text-white">{formData.destination_address}</span>
                        </div>
                        
                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-gray-400">Date et heure:</span>
                          <span className="text-white">
                            {formData.pickup_time === 'immediate' 
                              ? 'Immédiat' 
                              : new Date(formData.scheduled_time).toLocaleString('fr-FR')}
                          </span>
                        </div>
                        
                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-gray-400">Véhicule:</span>
                          <span className="text-white">{selectedVehicle.name}</span>
                        </div>
                        
                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-gray-400">Passagers:</span>
                          <span className="text-white">{formData.passengers}</span>
                        </div>
                        
                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-gray-400">Contact:</span>
                          <span className="text-white">{formData.contact_name} ({formData.contact_phone})</span>
                        </div>
                        
                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-gray-400">Paiement:</span>
                          <span className="text-white">
                            {formData.payment_method === 'cash' && 'Espèces'}
                            {formData.payment_method === 'card' && 'Carte bancaire'}
                            {formData.payment_method === 'mobile_money' && 'Mobile Money'}
                          </span>
                        </div>
                        
                        <div className="flex justify-between pt-2">
                          <span className="text-gray-400">Estimation du prix:</span>
                          <span className="font-bold text-primary text-lg">{selectedVehicle.price} FCFA</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md">
                      <TriangleAlert className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-gray-300">
                        Le prix final peut varier en fonction du trajet réel et des conditions de circulation.
                        En confirmant, vous acceptez nos conditions d'utilisation.
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div className="flex justify-between pt-4">
                  {activeStep > 0 && (
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Retour
                    </Button>
                  )}
                  
                  {activeStep < 4 ? (
                    <Button 
                      className="ml-auto"
                      onClick={handleNextStep}
                    >
                      Continuer
                    </Button>
                  ) : (
                    <Button 
                      className="ml-auto"
                      onClick={handleReservation}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                          Réservation...
                        </span>
                      ) : (
                        "Réserver maintenant"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
