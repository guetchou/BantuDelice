
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Car, Clock, CheckCircle, CreditCard, TriangleAlert, Star } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Steps, Step } from "@/components/ui/steps";
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Taxi() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  
  const handleReservation = () => {
    toast.success("Votre réservation a été prise en compte", {
      description: "Recherche d'un chauffeur en cours..."
    });
    setTimeout(() => {
      navigate(`/taxi/ride/${Math.random().toString(36).substring(7)}`);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen relative py-12">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
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
              <div className="mb-8">
                <Steps activeStep={activeStep} className="mb-6">
                  <Step icon={MapPin}>Adresse</Step>
                  <Step icon={Calendar}>Date/Heure</Step>
                  <Step icon={Car}>Véhicule</Step>
                  <Step icon={CheckCircle}>Confirmation</Step>
                </Steps>
              </div>
              
              <div className="space-y-6">
                {activeStep === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-200">Adresse de prise en charge</label>
                      <div className="flex items-center border border-white/20 rounded-md p-3 bg-white/5 focus-within:ring-1 focus-within:ring-primary">
                        <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="Votre localisation" 
                          className="bg-transparent w-full outline-none text-white placeholder:text-gray-500"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-200">Destination</label>
                      <div className="flex items-center border border-white/20 rounded-md p-3 bg-white/5 focus-within:ring-1 focus-within:ring-primary">
                        <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="Votre destination" 
                          className="bg-transparent w-full outline-none text-white placeholder:text-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {activeStep === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-200">Date et heure</label>
                      <div className="flex items-center border border-white/20 rounded-md p-3 bg-white/5 focus-within:ring-1 focus-within:ring-primary">
                        <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                        <input 
                          type="datetime-local" 
                          className="bg-transparent w-full outline-none text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-200">Options</label>
                      <div className="flex items-center border border-white/20 rounded-md p-3 bg-white/5 focus-within:ring-1 focus-within:ring-primary">
                        <Clock className="h-5 w-5 mr-2 text-gray-400" />
                        <select className="w-full bg-transparent outline-none text-white">
                          <option value="immediate" className="bg-gray-900">Départ immédiat</option>
                          <option value="scheduled" className="bg-gray-900">Départ programmé</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeStep === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-200">Type de véhicule</label>
                      <select className="w-full border border-white/20 rounded-md p-3 bg-white/5 text-white outline-none">
                        <option className="bg-gray-900">Standard</option>
                        <option className="bg-gray-900">Premium</option>
                        <option className="bg-gray-900">Van</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-200">Nombre de passagers</label>
                      <select className="w-full border border-white/20 rounded-md p-3 bg-white/5 text-white outline-none">
                        <option className="bg-gray-900">1</option>
                        <option className="bg-gray-900">2</option>
                        <option className="bg-gray-900">3</option>
                        <option className="bg-gray-900">4+</option>
                      </select>
                    </div>
                  </div>
                )}
                
                {activeStep === 3 && (
                  <div className="space-y-4">
                    <div className="border border-white/20 rounded-lg p-4 bg-white/5">
                      <h3 className="font-medium text-white mb-3">Résumé de votre réservation</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Prise en charge:</span>
                          <span className="text-white">Centre-ville, Brazzaville</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Destination:</span>
                          <span className="text-white">Aéroport International, Brazzaville</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Date et heure:</span>
                          <span className="text-white">Immédiat</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Véhicule:</span>
                          <span className="text-white">Standard</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Estimation du prix:</span>
                          <span className="font-bold text-white">5,000 FCFA</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md">
                      <TriangleAlert className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-gray-300">
                        Le prix final peut varier en fonction du trajet réel et des conditions de circulation.
                      </div>
                    </div>
                  </div>
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
                  
                  {activeStep < 3 ? (
                    <Button 
                      className="ml-auto"
                      onClick={() => setActiveStep(prev => Math.min(3, prev + 1))}
                    >
                      Continuer
                    </Button>
                  ) : (
                    <Button 
                      className="ml-auto"
                      onClick={handleReservation}
                    >
                      Réserver maintenant
                    </Button>
                  )}
                </div>
                
                <p className="text-xs text-gray-400 text-center mt-4">
                  En cliquant sur Réserver, vous acceptez nos <a href="#" className="text-primary hover:underline">Conditions d'utilisation</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
