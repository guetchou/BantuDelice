
import React, { useState, useEffect } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon, 
  Flag, 
  CheckSquare, 
  AlertTriangle,
  CreditCard,
  Truck,
  Store,
  User,
  Info
} from "lucide-react";

// Create a custom Marketing icon since it's not available in lucide-react
const Marketing = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M5 3a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5z" />
    <path d="M21 9H3" />
    <path d="M6 17l3-3 2 2 3-3 2 2" />
  </svg>
);

import { FeatureFlag, useFeatureFlags } from "@/utils/featureFlags";
import { useUser } from "@/hooks/useUser";
import { Navigate } from "react-router-dom";

export default function FeatureFlags() {
  usePageTitle({ title: "Gestion des fonctionnalités" });
  const { toast } = useToast();
  const { user, isAdmin } = useUser();
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Get feature flags from the store
  const { flags, setFlagEnabled, resetToDefaults } = useFeatureFlags();
  
  // Redirect if not admin
  if (!user || !isAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  // Filter flags by category
  const getFilteredFlags = () => {
    if (activeTab === "all") return flags;
    return flags.filter(flag => flag.category === activeTab);
  };
  
  // Category icons
  const categoryIcons: Record<string, React.ReactNode> = {
    core: <CheckSquare className="h-4 w-4" />,
    marketing: <Marketing className="h-4 w-4" />,
    payment: <CreditCard className="h-4 w-4" />,
    delivery: <Truck className="h-4 w-4" />,
    restaurant: <Store className="h-4 w-4" />,
    user: <User className="h-4 w-4" />,
  };
  
  // Handle toggle change
  const handleToggleChange = (flagId: string, enabled: boolean) => {
    setFlagEnabled(flagId, enabled);
    
    toast({
      title: enabled ? "Fonctionnalité activée" : "Fonctionnalité désactivée",
      description: `La fonctionnalité ${flags.find(f => f.id === flagId)?.name} a été ${enabled ? 'activée' : 'désactivée'}.`,
    });
  };
  
  // Handle reset to defaults
  const handleResetToDefaults = () => {
    resetToDefaults();
    
    toast({
      title: "Réinitialisation effectuée",
      description: "Toutes les fonctionnalités ont été réinitialisées à leur état par défaut.",
    });
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <Flag className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Gestion des fonctionnalités</h1>
      </div>
      
      <Card className="shadow-lg border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            Configuration des fonctionnalités
          </CardTitle>
          <CardDescription className="text-base">
            Activez ou désactivez les fonctionnalités de la plateforme.
            Ces paramètres s'appliquent à tous les utilisateurs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 p-4 rounded-lg mb-6 flex items-start gap-3 text-sm text-slate-600">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <p>
              Utilisez cette interface pour gérer les fonctionnalités disponibles sur la plateforme. 
              Vous pouvez activer ou désactiver chaque fonctionnalité individuellement. 
              Cette gestion granulaire vous permet de contrôler précisément l'expérience utilisateur.
            </p>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="mb-6 grid grid-cols-7 h-auto p-1 w-full max-w-4xl mx-auto">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">
                Toutes
              </TabsTrigger>
              <TabsTrigger value="core" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">
                Essentielles
              </TabsTrigger>
              <TabsTrigger value="marketing" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">
                Marketing
              </TabsTrigger>
              <TabsTrigger value="payment" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">
                Paiement
              </TabsTrigger>
              <TabsTrigger value="delivery" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">
                Livraison
              </TabsTrigger>
              <TabsTrigger value="restaurant" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">
                Restaurant
              </TabsTrigger>
              <TabsTrigger value="user" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">
                Utilisateur
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <div className="space-y-4">
                {getFilteredFlags().length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    Aucune fonctionnalité trouvée dans cette catégorie.
                  </div>
                ) : (
                  getFilteredFlags().map((flag) => (
                    <div key={flag.id} className="p-4 border rounded-lg transition-all hover:bg-slate-50">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-1.5 rounded-full">
                              {categoryIcons[flag.category]}
                            </div>
                            <span className="font-medium">{flag.name}</span>
                            <Badge 
                              variant={flag.enabled ? "default" : "outline"} 
                              className={flag.enabled ? "bg-green-500 hover:bg-green-600" : "text-slate-500"}
                            >
                              {flag.enabled ? "Activé" : "Désactivé"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground pl-9">
                            {flag.description}
                          </p>
                        </div>
                        <Switch 
                          checked={flag.enabled}
                          onCheckedChange={(checked) => handleToggleChange(flag.id, checked)}
                          className="data-[state=checked]:bg-green-500"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <Separator className="my-6" />
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg w-full sm:w-auto">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">La modification des fonctionnalités peut affecter certaines parties de l'application.</span>
            </div>
            <Button 
              variant="outline" 
              onClick={handleResetToDefaults}
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 w-full sm:w-auto"
            >
              Réinitialiser les valeurs par défaut
            </Button>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 border-t p-4 text-xs text-slate-500">
          Dernière mise à jour: {new Date().toLocaleDateString()}
        </CardFooter>
      </Card>
    </div>
  );
}
