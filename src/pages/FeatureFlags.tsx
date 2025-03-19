
import React, { useState, useEffect } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Marketing,
  CreditCard,
  Truck,
  Store,
  User
} from "lucide-react";
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
      
      <Card>
        <CardHeader>
          <CardTitle>Configuration des fonctionnalités</CardTitle>
          <CardDescription>
            Activez ou désactivez les fonctionnalités de la plateforme.
            Ces paramètres s'appliquent à tous les utilisateurs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">
                Toutes
              </TabsTrigger>
              <TabsTrigger value="core">
                Essentielles
              </TabsTrigger>
              <TabsTrigger value="marketing">
                Marketing
              </TabsTrigger>
              <TabsTrigger value="payment">
                Paiement
              </TabsTrigger>
              <TabsTrigger value="delivery">
                Livraison
              </TabsTrigger>
              <TabsTrigger value="restaurant">
                Restaurant
              </TabsTrigger>
              <TabsTrigger value="user">
                Utilisateur
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <div className="space-y-4">
                {getFilteredFlags().map((flag) => (
                  <div key={flag.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-2">
                          {categoryIcons[flag.category]}
                          <span className="font-medium">{flag.name}</span>
                          <Badge variant={flag.enabled ? "default" : "outline"} className="ml-2">
                            {flag.enabled ? "Activé" : "Désactivé"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {flag.description}
                        </p>
                      </div>
                      <Switch 
                        checked={flag.enabled}
                        onCheckedChange={(checked) => handleToggleChange(flag.id, checked)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <Separator className="my-6" />
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">La modification des fonctionnalités peut affecter certaines parties de l'application.</span>
            </div>
            <Button variant="outline" onClick={handleResetToDefaults}>
              Réinitialiser les valeurs par défaut
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
