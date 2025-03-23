
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, ArrowRight, ChevronDown, Calendar, Users, Building2, BarChart } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface PlanFeature {
  included: boolean;
  label: string;
  highlight?: boolean;
}

interface SubscriptionPlanData {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  callToAction: string;
  savings?: string;
  planType: 'individual' | 'family' | 'business';
  rideCredits?: number;
  discountPercentage?: number;
  familyMembers?: number;
  businessTeamSize?: string;
}

const individualPlans: SubscriptionPlanData[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    period: 'voyage',
    description: 'Réservation à la demande sans engagement',
    features: [
      { included: true, label: 'Réservation standard' },
      { included: true, label: 'Prix normal' },
      { included: false, label: 'Réduction sur les courses' },
      { included: false, label: 'Courses prioritaires' },
      { included: false, label: 'Annulation gratuite' },
    ],
    callToAction: 'Commencer',
    planType: 'individual'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 15000,
    period: 'mois',
    description: 'Pour les utilisateurs réguliers de taxi',
    features: [
      { included: true, label: 'Réservation prioritaire', highlight: true },
      { included: true, label: '15% de réduction sur toutes les courses', highlight: true },
      { included: true, label: '5 annulations gratuites par mois' },
      { included: true, label: 'Chauffeurs les mieux notés' },
      { included: true, label: 'Support client prioritaire' },
    ],
    popular: true,
    callToAction: 'Choisir Premium',
    savings: 'Économisez jusqu\'à 22 500 FCFA/mois',
    rideCredits: 0,
    discountPercentage: 15,
    planType: 'individual'
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 35000,
    period: 'mois',
    description: 'Pour les professionnels et voyageurs fréquents',
    features: [
      { included: true, label: '10 courses incluses par mois', highlight: true },
      { included: true, label: '25% de réduction sur les courses supplémentaires', highlight: true },
      { included: true, label: 'Annulations illimitées' },
      { included: true, label: 'Véhicules premium disponibles' },
      { included: true, label: 'Ligne d\'assistance VIP dédiée' },
    ],
    callToAction: 'Choisir Elite',
    savings: 'Économisez jusqu\'à 52 500 FCFA/mois',
    rideCredits: 10,
    discountPercentage: 25,
    planType: 'individual'
  }
];

const familyPlans: SubscriptionPlanData[] = [
  {
    id: 'family-basic',
    name: 'Famille Essentiel',
    price: 25000,
    period: 'mois',
    description: 'Idéal pour les familles avec des besoins occasionnels',
    features: [
      { included: true, label: 'Jusqu\'à 3 membres de famille', highlight: true },
      { included: true, label: '10% de réduction sur toutes les courses' },
      { included: true, label: '3 annulations gratuites par mois' },
      { included: true, label: 'Partage du compte familial' },
      { included: false, label: 'Courses simultanées' },
    ],
    callToAction: 'Choisir Famille Essentiel',
    familyMembers: 3,
    discountPercentage: 10,
    planType: 'family'
  },
  {
    id: 'family-plus',
    name: 'Famille Plus',
    price: 40000,
    period: 'mois',
    description: 'Pour les familles actives avec des besoins réguliers',
    features: [
      { included: true, label: 'Jusqu\'à 5 membres de famille', highlight: true },
      { included: true, label: '15% de réduction sur toutes les courses' },
      { included: true, label: '8 courses incluses par mois à partager', highlight: true },
      { included: true, label: 'Courses simultanées possible' },
      { included: true, label: 'Annulations gratuites illimitées' },
    ],
    popular: true,
    callToAction: 'Choisir Famille Plus',
    savings: 'Idéal pour les familles actives',
    familyMembers: 5,
    rideCredits: 8,
    discountPercentage: 15,
    planType: 'family'
  },
  {
    id: 'family-premium',
    name: 'Famille Premium',
    price: 60000,
    period: 'mois',
    description: 'Solution complète pour les grandes familles',
    features: [
      { included: true, label: 'Jusqu\'à 8 membres de famille', highlight: true },
      { included: true, label: '20% de réduction sur toutes les courses' },
      { included: true, label: '15 courses incluses par mois à partager', highlight: true },
      { included: true, label: 'Courses simultanées illimitées' },
      { included: true, label: 'Service de conciergerie familiale' },
    ],
    callToAction: 'Choisir Famille Premium',
    savings: 'Solution complète pour familles nombreuses',
    familyMembers: 8,
    rideCredits: 15,
    discountPercentage: 20,
    planType: 'family'
  }
];

const businessPlans: SubscriptionPlanData[] = [
  {
    id: 'business-starter',
    name: 'Business Starter',
    price: 75000,
    period: 'mois',
    description: 'Pour les petites entreprises et startups',
    features: [
      { included: true, label: 'Jusqu\'à 5 employés', highlight: true },
      { included: true, label: '15% de réduction sur toutes les courses' },
      { included: true, label: '20 courses business par mois', highlight: true },
      { included: true, label: 'Tableau de bord de gestion' },
      { included: true, label: 'Facturation mensuelle détaillée' },
    ],
    callToAction: 'Demander un devis',
    businessTeamSize: '1-5',
    rideCredits: 20,
    discountPercentage: 15,
    planType: 'business'
  },
  {
    id: 'business-pro',
    name: 'Business Pro',
    price: 150000,
    period: 'mois',
    description: 'Pour les PME avec des besoins réguliers',
    features: [
      { included: true, label: 'Jusqu\'à 15 employés', highlight: true },
      { included: true, label: '20% de réduction sur toutes les courses' },
      { included: true, label: '50 courses business par mois', highlight: true },
      { included: true, label: 'Rapports d\'activité détaillés' },
      { included: true, label: 'Gestionnaire de compte dédié' },
    ],
    popular: true,
    callToAction: 'Demander un devis',
    businessTeamSize: '5-15',
    rideCredits: 50,
    discountPercentage: 20,
    planType: 'business'
  },
  {
    id: 'business-enterprise',
    name: 'Business Enterprise',
    price: 300000,
    period: 'mois',
    description: 'Solution sur mesure pour grandes entreprises',
    features: [
      { included: true, label: 'Nombre illimité d\'employés', highlight: true },
      { included: true, label: '25% de réduction sur toutes les courses' },
      { included: true, label: '120 courses business par mois', highlight: true },
      { included: true, label: 'API d\'intégration disponible' },
      { included: true, label: 'Service client VIP 24/7' },
    ],
    callToAction: 'Contacter l\'équipe commerciale',
    businessTeamSize: '15+',
    rideCredits: 120,
    discountPercentage: 25,
    planType: 'business'
  }
];

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description }) => (
  <Card className="border-border/40 bg-background/60 backdrop-blur">
    <CardHeader className="pb-2">
      <div className="mb-2 w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default function SubscriptionPlans() {
  const [selectedPlanType, setSelectedPlanType] = useState('individual');
  const navigate = useNavigate();
  
  const handlePlanSelect = (planId: string) => {
    navigate(`/taxi/subscription/${planId}`);
  };
  
  const plansByType = {
    individual: individualPlans,
    family: familyPlans,
    business: businessPlans
  };
  
  const selectedPlans = plansByType[selectedPlanType as keyof typeof plansByType];
  
  const getTabIcon = (type: string) => {
    switch (type) {
      case 'individual':
        return <Calendar className="mr-2 h-4 w-4" />;
      case 'family':
        return <Users className="mr-2 h-4 w-4" />;
      case 'business':
        return <Building2 className="mr-2 h-4 w-4" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Abonnements Taxi</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Économisez sur vos déplacements avec nos formules d'abonnement adaptées à tous les profils
        </p>
      </div>
      
      <Tabs 
        defaultValue="individual" 
        value={selectedPlanType}
        onValueChange={setSelectedPlanType}
        className="mb-12"
      >
        <div className="flex justify-center mb-8">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="individual" className="flex items-center">
              {getTabIcon('individual')}
              <span className="hidden sm:inline">Individuel</span>
            </TabsTrigger>
            <TabsTrigger value="family" className="flex items-center">
              {getTabIcon('family')}
              <span className="hidden sm:inline">Famille</span>
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center">
              {getTabIcon('business')}
              <span className="hidden sm:inline">Entreprise</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="individual" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {individualPlans.map((plan) => (
              <PlanCard 
                key={plan.id} 
                plan={plan} 
                onSelect={() => handlePlanSelect(plan.id)} 
              />
            ))}
          </div>
          
          <IndividualBenefits />
        </TabsContent>
        
        <TabsContent value="family" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {familyPlans.map((plan) => (
              <PlanCard 
                key={plan.id} 
                plan={plan} 
                onSelect={() => handlePlanSelect(plan.id)} 
              />
            ))}
          </div>
          
          <FamilyBenefits />
        </TabsContent>
        
        <TabsContent value="business" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {businessPlans.map((plan) => (
              <PlanCard 
                key={plan.id} 
                plan={plan} 
                onSelect={() => handlePlanSelect(plan.id)} 
              />
            ))}
          </div>
          
          <BusinessBenefits />
        </TabsContent>
      </Tabs>
      
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4 text-center">Questions fréquentes</h2>
        <FAQ />
      </div>
    </div>
  );
}

interface PlanCardProps {
  plan: SubscriptionPlanData;
  onSelect: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className={`h-full flex flex-col relative overflow-hidden ${
        plan.popular 
          ? 'border-primary shadow-lg shadow-primary/10' 
          : 'border-border/50'
      }`}>
        {plan.popular && (
          <div className="absolute top-0 right-0">
            <Badge className="rounded-none rounded-bl-lg bg-primary text-white m-0">Populaire</Badge>
          </div>
        )}
        
        <CardHeader>
          <CardTitle className="flex justify-between items-start">
            <span>{plan.name}</span>
            {plan.discountPercentage && (
              <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                -{plan.discountPercentage}%
              </Badge>
            )}
          </CardTitle>
          <CardDescription>{plan.description}</CardDescription>
          
          <div className="mt-4 flex items-center">
            <span className="text-3xl font-bold">{plan.price.toLocaleString()} FCFA</span>
            <span className="ml-2 text-muted-foreground">/{plan.period}</span>
          </div>
          
          {plan.savings && (
            <p className="text-sm text-green-600 mt-1">{plan.savings}</p>
          )}
        </CardHeader>
        
        <CardContent className="flex-grow">
          <ul className="space-y-2">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex">
                <span className={`mr-2 mt-1 ${feature.included ? 'text-green-500' : 'text-gray-300'}`}>
                  {feature.included ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-gray-300" />
                  )}
                </span>
                <span className={`${feature.included ? '' : 'text-gray-400'} ${feature.highlight ? 'font-medium text-primary' : ''}`}>
                  {feature.label}
                </span>
              </li>
            ))}
          </ul>
          
          {plan.planType === 'individual' && plan.rideCredits > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-sm font-medium text-primary">
                {plan.rideCredits} courses incluses chaque mois
              </p>
            </div>
          )}
          
          {plan.planType === 'family' && (
            <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-sm font-medium text-primary">
                {plan.familyMembers} membres de famille maximum
              </p>
              {plan.rideCredits && (
                <p className="text-sm text-muted-foreground mt-1">
                  {plan.rideCredits} courses à partager entre les membres
                </p>
              )}
            </div>
          )}
          
          {plan.planType === 'business' && (
            <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-sm font-medium text-primary">
                Taille d'équipe: {plan.businessTeamSize} employés
              </p>
              {plan.rideCredits && (
                <p className="text-sm text-muted-foreground mt-1">
                  {plan.rideCredits} courses professionnelles incluses
                </p>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-0">
          <Button onClick={onSelect} className="w-full group" variant={plan.popular ? "default" : "outline"}>
            {plan.callToAction}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const IndividualBenefits = () => (
  <section className="mt-16">
    <h2 className="text-2xl font-bold mb-6 text-center">Avantages des abonnements individuels</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BenefitCard
        icon={<Calendar className="w-6 h-6" />}
        title="Réductions garanties"
        description="Économisez jusqu'à 25% sur chaque course et accumulez des économies substantielles chaque mois."
      />
      <BenefitCard
        icon={<BarChart className="w-6 h-6" />}
        title="Courses prioritaires"
        description="Bénéficiez d'une attribution prioritaire des chauffeurs, même pendant les heures de pointe."
      />
      <BenefitCard
        icon={<CheckCircle className="w-6 h-6" />}
        title="Flexibilité totale"
        description="Annulez sans frais et profitez d'un service client prioritaire pour tous vos besoins."
      />
    </div>
  </section>
);

const FamilyBenefits = () => (
  <section className="mt-16">
    <h2 className="text-2xl font-bold mb-6 text-center">Avantages des formules familiales</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BenefitCard
        icon={<Users className="w-6 h-6" />}
        title="Compte partagé"
        description="Partagez un compte entre tous les membres de la famille avec des profils individuels."
      />
      <BenefitCard
        icon={<Calendar className="w-6 h-6" />}
        title="Courses familiales"
        description="Réservez plusieurs courses simultanément pour différents membres de la famille."
      />
      <BenefitCard
        icon={<CheckCircle className="w-6 h-6" />}
        title="Sécurité renforcée"
        description="Suivez les déplacements de vos proches et recevez des notifications en temps réel."
      />
    </div>
  </section>
);

const BusinessBenefits = () => (
  <section className="mt-16">
    <h2 className="text-2xl font-bold mb-6 text-center">Avantages des solutions professionnelles</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BenefitCard
        icon={<Building2 className="w-6 h-6" />}
        title="Gestion centralisée"
        description="Dashboard administrateur complet pour gérer les réservations et les dépenses de l'entreprise."
      />
      <BenefitCard
        icon={<BarChart className="w-6 h-6" />}
        title="Rapports détaillés"
        description="Suivez les dépenses par département, par employé ou par projet avec des rapports personnalisables."
      />
      <BenefitCard
        icon={<CheckCircle className="w-6 h-6" />}
        title="Facturation simplifiée"
        description="Recevez une facture mensuelle unique et intégrez facilement vos déplacements dans votre comptabilité."
      />
    </div>
  </section>
);

const FAQ = () => {
  const faqs = [
    {
      question: "Comment fonctionnent les abonnements ?",
      answer: "Nos abonnements vous permettent de payer un montant fixe mensuel pour bénéficier de réductions sur vos courses de taxi et d'avantages exclusifs. Selon la formule choisie, vous pouvez également avoir des courses incluses dans votre abonnement."
    },
    {
      question: "Puis-je changer de formule d'abonnement ?",
      answer: "Oui, vous pouvez changer de formule à tout moment. Le changement prendra effet au début du cycle de facturation suivant. Si vous passez à une formule supérieure, vous bénéficierez immédiatement des nouveaux avantages."
    },
    {
      question: "Comment fonctionnent les courses incluses ?",
      answer: "Les courses incluses dans votre abonnement sont créditées sur votre compte au début de chaque cycle mensuel. Elles sont valables pour des trajets jusqu'à 15 km, au-delà un supplément kilométrique sera appliqué. Les courses non utilisées ne sont pas reportées au mois suivant."
    },
    {
      question: "Les abonnements sont-ils avec engagement ?",
      answer: "Nos abonnements sont sans engagement de durée et peuvent être résiliés à tout moment. La résiliation prendra effet à la fin du cycle de facturation en cours."
    }
  ];
  
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  return (
    <div className="max-w-3xl mx-auto">
      {faqs.map((faq, index) => (
        <div key={index} className="mb-4">
          <button
            onClick={() => setOpenFaq(openFaq === index ? null : index)}
            className="flex justify-between items-center w-full p-4 text-left bg-card border rounded-lg"
          >
            <span className="font-medium">{faq.question}</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
          </button>
          {openFaq === index && (
            <div className="mt-1 p-4 border rounded-lg bg-card/50">
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
