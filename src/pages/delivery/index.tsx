
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Package, Route as RouteIcon, ArrowRight, Clock, Activity } from 'lucide-react';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useApiAuth } from '@/contexts/ApiAuthContext';
import Layout from '@/components/Layout';

interface DeliveryPageProps {}

const DeliveryPage: React.FC<DeliveryPageProps> = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useApiAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [currentLocation, setCurrentLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Get user location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
    
    // Here you would fetch active deliveries for the user
    // This is a placeholder for demo purposes
  }, []);

  const updateLocation = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setIsLoading(false);
        },
        (error) => {
          console.error("Error updating location:", error);
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error("Error updating location:", error);
      setIsLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };
  
  return (
    <Layout>
      <motion.div 
        className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord de livraison</h1>
            <p className="text-gray-600 mt-2">
              {isAuthenticated 
                ? `Bienvenue, ${user?.email}. Gérez vos livraisons et suivez vos colis en temps réel.`
                : "Connectez-vous pour accéder à toutes les fonctionnalités de livraison."
              }
            </p>
          </motion.div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <Card className="bg-white hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Livraisons actives</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Package className="h-8 w-8 text-orange-500 mr-3" />
                    <div>
                      <p className="text-3xl font-bold">0</p>
                      <p className="text-xs text-gray-500">En cours de livraison</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <Card className="bg-white hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Temps moyen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-blue-500 mr-3" />
                    <div>
                      <p className="text-3xl font-bold">25 min</p>
                      <p className="text-xs text-gray-500">Temps de livraison moyen</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <Card className="bg-white hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Distance totale</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <RouteIcon className="h-8 w-8 text-green-500 mr-3" />
                    <div>
                      <p className="text-3xl font-bold">0 km</p>
                      <p className="text-xs text-gray-500">Parcourus aujourd'hui</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <Card className="bg-white hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Évaluation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Activity className="h-8 w-8 text-purple-500 mr-3" />
                    <div>
                      <p className="text-3xl font-bold">4.9</p>
                      <p className="text-xs text-gray-500">Sur 5 étoiles</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Location Map */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Card className="bg-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Votre position actuelle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 h-[300px] rounded-md flex items-center justify-center mb-4">
                    {isLoading ? (
                      <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
                    ) : currentLocation ? (
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                        <p>Latitude: {currentLocation.latitude.toFixed(6)}</p>
                        <p>Longitude: {currentLocation.longitude.toFixed(6)}</p>
                      </div>
                    ) : (
                      <p>Impossible d'accéder à votre position</p>
                    )}
                  </div>
                  
                  <Button 
                    onClick={updateLocation}
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Mise à jour...' : 'Mettre à jour ma position'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Card className="bg-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      className="flex flex-col h-24 items-center justify-center hover:bg-primary/10"
                      onClick={() => navigate('/delivery/optimization')}
                    >
                      <RouteIcon className="h-8 w-8 mb-2 text-primary" />
                      <span>Optimisation</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex flex-col h-24 items-center justify-center hover:bg-primary/10"
                      onClick={() => navigate('/delivery/messages')}
                    >
                      <MessageSquare className="h-8 w-8 mb-2 text-primary" />
                      <span>Messages</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex flex-col h-24 items-center justify-center hover:bg-primary/10"
                      onClick={() => navigate('/settings')}
                    >
                      <Settings className="h-8 w-8 mb-2 text-primary" />
                      <span>Paramètres</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex flex-col h-24 items-center justify-center hover:bg-primary/10"
                      onClick={() => navigator.geolocation.getCurrentPosition(
                        position => alert(`Position: ${position.coords.latitude}, ${position.coords.longitude}`),
                        error => alert(`Erreur: ${error.message}`)
                      )}
                    >
                      <MapPin className="h-8 w-8 mb-2 text-primary" />
                      <span>Position</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Action Button */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button 
              onClick={() => navigate('/delivery/map')}
              className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-medium"
              size="lg"
            >
              Voir la carte de livraison 
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

function MessageSquare(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function Settings(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export default DeliveryPage;
