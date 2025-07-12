
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Building2, Users, CreditCard, CalendarClock, BarChart, CheckCircle, Shield, Car, MoveRight } from 'lucide-react';
import { toast } from 'sonner';
import TaxiNavigationMenu from '@/components/taxi/TaxiNavigationMenu';
import { Separator } from '@/components/ui/separator';

const TaxiBusinessPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    employeeCount: '',
    message: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Demande envoyée avec succès", {
      description: "Notre équipe commerciale vous contactera dans les 24 heures"
    });
    
    // Dans une vraie application, nous enverrions les données à un backend
    console.log("Données soumises:", formData);
    
    // Réinitialisation du formulaire
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      employeeCount: '',
      message: ''
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
      
      <TaxiNavigationMenu activeRoute="business" />
      
      <div className="max-w-4xl mx-auto mt-6">
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl p-8 mb-10">
          <h2 className="text-2xl font-bold mb-3">Une solution de transport sur mesure pour votre entreprise</h2>
          <p className="text-lg mb-6">
            Simplifiez la gestion des déplacements professionnels de vos collaborateurs avec notre offre dédiée aux entreprises.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Demander un devis
            </Button>
            <Button variant="outline" className="gap-2">
              <MoveRight className="h-4 w-4" />
              Découvrir nos offres
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Comptes Entreprise
              </CardTitle>
              <CardDescription>
                Gérez les déplacements de vos employés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Définissez des règles et limites de dépenses</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Attribuez des budgets par département</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Console d'administration dédiée</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Assistance 24/7 prioritaire</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-primary" />
                Paiement Centralisé
              </CardTitle>
              <CardDescription>
                Simplifiez la gestion des frais de transport
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Facturation mensuelle consolidée</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Paiement différé jusqu'à 45 jours</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Intégration avec vos systèmes comptables</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Gestion des notes de frais automatisée</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <CalendarClock className="mr-2 h-5 w-5 text-primary" />
                Réservations Récurrentes
              </CardTitle>
              <CardDescription>
                Planifiez vos transports réguliers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Programmez des transports hebdomadaires</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Chauffeurs dédiés pour plus de régularité</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Modification flexible des horaires</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Tarifs préférentiels garantis</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-primary" />
                Rapports & Analyses
              </CardTitle>
              <CardDescription>
                Suivez et optimisez vos dépenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Tableaux de bord personnalisables</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Rapports d'utilisation détaillés</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Analyse des tendances et optimisations</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Export des données au format Excel/CSV</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-muted p-6 rounded-xl mb-10">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            Nos engagements pour les entreprises
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card p-4 rounded-lg">
              <Car className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-medium text-lg mb-2">Flotte premium</h3>
              <p className="text-sm text-muted-foreground">
                Véhicules récents et confortables avec chauffeurs professionnels pour vos collaborateurs
              </p>
            </div>
            
            <div className="bg-card p-4 rounded-lg">
              <Clock className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-medium text-lg mb-2">Disponibilité 24/7</h3>
              <p className="text-sm text-muted-foreground">
                Service disponible à toute heure pour répondre aux besoins urgents de déplacement
              </p>
            </div>
            
            <div className="bg-card p-4 rounded-lg">
              <CheckCircle className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-medium text-lg mb-2">Garantie satisfaction</h3>
              <p className="text-sm text-muted-foreground">
                Remboursement en cas de retard significatif ou d'insatisfaction
              </p>
            </div>
          </div>
        </div>
        
        <Card className="mb-10">
          <CardHeader>
            <CardTitle>Tarification Entreprise</CardTitle>
            <CardDescription>
              Des solutions adaptées à la taille de votre entreprise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 transition-all hover:shadow-md">
                <h3 className="font-semibold text-lg mb-2">PME</h3>
                <p className="text-sm text-muted-foreground mb-2">5-50 employés</p>
                <ul className="text-sm space-y-1 mb-4">
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>15% de réduction sur les courses</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Facturation mensuelle</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Rapports de base</span>
                  </li>
                </ul>
                <div className="text-lg font-bold">À partir de 70 000 FCFA/mois</div>
              </div>
              
              <div className="border rounded-lg p-4 bg-primary/5 border-primary/20 transition-all hover:shadow-md relative">
                <div className="absolute -top-3 right-4 bg-primary text-white text-xs px-2 py-1 rounded-full">Populaire</div>
                <h3 className="font-semibold text-lg mb-2">Entreprise</h3>
                <p className="text-sm text-muted-foreground mb-2">50-200 employés</p>
                <ul className="text-sm space-y-1 mb-4">
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>25% de réduction sur les courses</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Paiement à 30 jours</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Rapports avancés</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Gestionnaire de compte dédié</span>
                  </li>
                </ul>
                <div className="text-lg font-bold">À partir de 200 000 FCFA/mois</div>
              </div>
              
              <div className="border rounded-lg p-4 transition-all hover:shadow-md">
                <h3 className="font-semibold text-lg mb-2">Corporate</h3>
                <p className="text-sm text-muted-foreground mb-2">200+ employés</p>
                <ul className="text-sm space-y-1 mb-4">
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>35% de réduction sur les courses</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Paiement à 45 jours</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Analyse prédictive</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>API d'intégration</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Équipe de support dédiée</span>
                  </li>
                </ul>
                <div className="text-lg font-bold">Sur mesure</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Demande d'information</CardTitle>
            <CardDescription>
              Complétez le formulaire ci-dessous pour être contacté par notre équipe commerciale
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="companyName" className="text-sm font-medium">
                    Nom de l'entreprise <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="contactPerson" className="text-sm font-medium">
                    Personne à contacter <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email professionnel <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="employeeCount" className="text-sm font-medium">
                    Nombre d'employés <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="employeeCount"
                    name="employeeCount"
                    value={formData.employeeCount}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Votre demande
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Précisez vos besoins et questions spécifiques"
                />
              </div>
              
              <Button type="submit" className="w-full md:w-auto">
                Envoyer ma demande
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaxiBusinessPage;
