
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, Users, Receipt, BarChart, Clock, Shield, Phone } from 'lucide-react';
import { toast } from 'sonner';
import TaxiNavigationMenu from '@/components/taxi/TaxiNavigationMenu';

const TaxiBusinessPage = () => {
  const navigate = useNavigate();
  
  const handleRequestDemo = () => {
    toast.success("Demande de démonstration envoyée", {
      description: "Notre équipe commerciale vous contactera bientôt"
    });
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/taxi')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Solutions Entreprises</h1>
      </div>
      
      <TaxiNavigationMenu />
      
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Transport professionnel pour votre entreprise</h2>
            <p className="text-gray-600 mb-6">
              Optimisez les déplacements de vos employés et simplifiez votre gestion administrative avec nos solutions de transport dédiées aux entreprises congolaises.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Comptes multiples</h3>
                  <p className="text-sm text-gray-600">Gérez facilement les comptes de tous vos employés</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Receipt className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Facturation centralisée</h3>
                  <p className="text-sm text-gray-600">Recevez une facture unique pour tous vos déplacements</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <BarChart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Rapports détaillés</h3>
                  <p className="text-sm text-gray-600">Suivez et analysez les dépenses par département</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Button size="lg" className="mr-4" onClick={handleRequestDemo}>
                Demander une démo
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/contact')}>
                Nous contacter
              </Button>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden h-[400px]">
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop" 
              alt="Business transportation" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Nos forfaits entreprise</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">Starter</CardTitle>
                <CardDescription>Pour les petites équipes</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">100,000 FCFA</span>
                  <span className="text-gray-500 ml-1">/mois</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Jusqu'à 10 employés</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>20% de réduction sur les courses</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Facturation mensuelle</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Rapports basiques</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleRequestDemo}>Commencer</Button>
              </CardFooter>
            </Card>
            
            <Card className="flex flex-col border-primary">
              <CardHeader>
                <div className="py-1 px-3 bg-primary text-white text-xs font-medium rounded-full w-fit mb-2">
                  Populaire
                </div>
                <CardTitle className="text-xl">Business</CardTitle>
                <CardDescription>Pour les moyennes entreprises</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">250,000 FCFA</span>
                  <span className="text-gray-500 ml-1">/mois</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Jusqu'à 50 employés</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>30% de réduction sur les courses</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Facturation mensuelle détaillée</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Console d'administration</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Rapports avancés</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleRequestDemo}>Commencer</Button>
              </CardFooter>
            </Card>
            
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">Enterprise</CardTitle>
                <CardDescription>Pour les grandes entreprises</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">Sur mesure</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Employés illimités</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Tarifs personnalisés</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>API d'intégration</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Gestionnaire de compte dédié</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Solutions personnalisées</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleRequestDemo}>Nous contacter</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Clock className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Disponibilité 24/7</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Des chauffeurs disponibles à tout moment pour les déplacements urgents de vos collaborateurs.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Sécurité garantie</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Tous nos chauffeurs sont vérifiés et nos véhicules régulièrement inspectés pour assurer la sécurité.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Building2 className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Solution sur mesure</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Nous adaptons nos services aux besoins spécifiques de votre entreprise, quelle que soit sa taille.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-12 bg-gray-50 border-gray-200">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-6">
                <h3 className="text-xl font-bold mb-2">Besoin d'informations supplémentaires?</h3>
                <p className="text-gray-600 mb-4">
                  Notre équipe commerciale est à votre disposition pour répondre à toutes vos questions et vous aider à choisir la solution adaptée à votre entreprise.
                </p>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-primary mr-2" />
                  <span className="font-medium">+242 06 123 4567</span>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center md:justify-end">
                <Button size="lg" onClick={handleRequestDemo}>
                  Demander une démo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaxiBusinessPage;
