
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, Car, Clock, CheckCircle, CreditCard, TriangleAlert, Star, User, Phone, History, MapPinned, Building2, ChevronRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTaxiBooking } from '@/hooks/useTaxiBooking';
import { useTaxiPricing } from '@/hooks/useTaxiPricing';
import { useUser } from '@/hooks/useUser';

const vehicleTypes = [
  { id: 'standard', name: 'Standard', description: 'Berline confortable pour 1-4 personnes', price: 5000, image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGF4aXxlbnwwfHwwfHx8MA%3D%3D' },
  { id: 'premium', name: 'Premium', description: 'Véhicule haut de gamme pour 1-3 personnes', price: 8000, image: 'https://images.unsplash.com/photo-1588618575327-fa8218b75ea2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dGF4aXxlbnwwfHwwfHx8MA%3D%3D' },
  { id: 'van', name: 'Van', description: 'Minivan pour 4-7 personnes avec bagages', price: 10000, image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHZhbnxlbnwwfHwwfHx8MA%3D%3D' }
];

export default function Taxi() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { rides } = useTaxiBooking();
  const { getQuickEstimate } = useTaxiPricing();
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

  // Fonction pour obtenir une estimation rapide du prix
  const getEstimateForDisplay = (distance: number, vehicleType: string) => {
    return getQuickEstimate(distance, vehicleType as 'standard' | 'comfort' | 'premium' | 'van');
  };
  
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
          
          {/* Navigation Pills - Improved visibility and interactive design */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Button 
              onClick={() => navigate('/taxi/booking')} 
              className="bg-primary/90 hover:bg-primary flex items-center gap-2 px-5 py-2.5 shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
            >
              <Car className="h-4 w-4" />
              Réserver maintenant
            </Button>
            
            <Button 
              variant="outline" 
              className="text-white border-white/20 hover:bg-white/10 flex items-center gap-2 px-5 py-2.5 shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
              onClick={() => navigate('/taxi/history')}
            >
              <History className="h-4 w-4" />
              <span className="whitespace-nowrap">Mes courses</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="text-white border-white/20 hover:bg-white/10 flex items-center gap-2 px-5 py-2.5 shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
              onClick={() => navigate('/taxi/locations')}
            >
              <MapPinned className="h-4 w-4" />
              <span className="whitespace-nowrap">Mes adresses</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="text-white border-white/20 hover:bg-white/10 flex items-center gap-2 px-5 py-2.5 shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
              onClick={() => navigate('/taxi/subscription')}
            >
              <Calendar className="h-4 w-4" />
              <span className="whitespace-nowrap">Abonnements</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="text-white border-white/20 hover:bg-white/10 flex items-center gap-2 px-5 py-2.5 shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
              onClick={() => navigate('/taxi/business')}
            >
              <Building2 className="h-4 w-4" />
              <span className="whitespace-nowrap">Entreprises</span>
            </Button>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-white/10 backdrop-blur border-white/10 text-white h-full hover:bg-white/15 transition-colors">
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
            <Card className="bg-white/10 backdrop-blur border-white/10 text-white h-full hover:bg-white/15 transition-colors">
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
            <Card className="bg-white/10 backdrop-blur border-white/10 text-white h-full hover:bg-white/15 transition-colors">
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
          <Card className="bg-white/10 backdrop-blur-lg border-white/10 hover:bg-white/15 transition-colors">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="flex items-center gap-2 text-white">
                <Car className="h-6 w-6 text-primary" />
                <span>Estimation rapide</span>
              </CardTitle>
              <CardDescription className="text-gray-300">
                Obtenez une estimation du prix de votre course
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-200">Départ</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input 
                        name="pickup_address"
                        value={formData.pickup_address}
                        onChange={handleInputChange}
                        placeholder="Votre localisation" 
                        className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:bg-white/10"
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
                        className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:bg-white/10"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-200">Type de véhicule</Label>
                    <Select
                      value={formData.vehicle_type}
                      onValueChange={(value) => handleSelectChange('vehicle_type', value)}
                    >
                      <SelectTrigger className="bg-white/5 border-white/20 text-white focus:bg-white/10">
                        <SelectValue placeholder="Sélectionnez une option" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-white/10 text-white">
                        {vehicleTypes.map(vehicle => (
                          <SelectItem key={vehicle.id} value={vehicle.id} className="focus:bg-white/10 focus:text-white">
                            {vehicle.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-200">Passagers</Label>
                    <Select
                      value={formData.passengers}
                      onValueChange={(value) => handleSelectChange('passengers', value)}
                    >
                      <SelectTrigger className="bg-white/5 border-white/20 text-white focus:bg-white/10">
                        <SelectValue placeholder="Nombre de passagers" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-white/10 text-white">
                        <SelectItem value="1" className="focus:bg-white/10 focus:text-white">1 personne</SelectItem>
                        <SelectItem value="2" className="focus:bg-white/10 focus:text-white">2 personnes</SelectItem>
                        <SelectItem value="3" className="focus:bg-white/10 focus:text-white">3 personnes</SelectItem>
                        <SelectItem value="4" className="focus:bg-white/10 focus:text-white">4 personnes</SelectItem>
                        <SelectItem value="5+" className="focus:bg-white/10 focus:text-white">5+ personnes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-medium">Prix estimé</h3>
                      <p className="text-sm text-gray-300">
                        Basé sur une distance approximative de 12 km
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {getEstimateForDisplay(12, formData.vehicle_type)}
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={() => navigate('/taxi/booking')} 
                    className="w-full bg-primary/90 hover:bg-primary font-medium shadow-lg transition-all duration-300 hover:translate-y-[-2px] flex items-center justify-center"
                  >
                    Réserver maintenant
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
