
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, MapPin, Route, Clock, CreditCard, Car } from "lucide-react";
import { usePageTitle } from '@/hooks/usePageTitle';

export const Home = () => {
  usePageTitle({ title: "Accueil" });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Simplifiez vos déplacements au Congo
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Trouvez des taxis, partagez vos trajets ou faites-vous livrer en quelques clics !
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
              <Link to="/taxi">Réserver un taxi</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/covoiturage">Trouver un covoiturage</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Nos services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                  <Car className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Taxis</h3>
                <p className="text-gray-600 mb-4">
                  Réservez un taxi en quelques clics pour vous déplacer en ville de manière fiable et sécurisée.
                </p>
                <Button variant="ghost" asChild className="group">
                  <Link to="/taxi">
                    En savoir plus <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Route className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Covoiturage</h3>
                <p className="text-gray-600 mb-4">
                  Partagez vos trajets quotidiens ou occasionnels pour économiser et réduire l'impact environnemental.
                </p>
                <Button variant="ghost" asChild className="group">
                  <Link to="/covoiturage">
                    En savoir plus <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Livraison</h3>
                <p className="text-gray-600 mb-4">
                  Faites-vous livrer vos repas, courses et colis partout en ville rapidement et facilement.
                </p>
                <Button variant="ghost" asChild className="group">
                  <Link to="/delivery">
                    En savoir plus <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Choisissez votre destination</h3>
              <p className="text-gray-600">
                Indiquez votre point de départ et d'arrivée pour votre trajet
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Sélectionnez votre service</h3>
              <p className="text-gray-600">
                Choisissez entre taxi, covoiturage ou autres options disponibles
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Confirmez votre réservation</h3>
              <p className="text-gray-600">
                Vérifiez les détails et confirmez votre trajet en quelques secondes
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Payez et profitez</h3>
              <p className="text-gray-600">
                Payez en toute sécurité et profitez de votre trajet sereinement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Prêt à simplifier vos déplacements ?</h2>
          <p className="text-xl text-gray-600 mb-10">
            Rejoignez des milliers d'utilisateurs qui se déplacent facilement à travers le Congo
          </p>
          <Button size="lg" asChild>
            <Link to="/auth/register">Créer un compte gratuitement</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};
