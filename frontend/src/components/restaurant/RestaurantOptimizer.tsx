
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Zap, BarChart4, Brain, FileBarChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RestaurantOptimizerProps {
  restaurantId: string;
}

const RestaurantOptimizer: React.FC<RestaurantOptimizerProps> = ({ restaurantId }) => {
  const { toast } = useToast();
  const [optimizing, setOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [activeOptimizations, setActiveOptimizations] = useState({
    pricing: false,
    menu: false,
    inventory: false,
    scheduling: false,
    marketing: false
  });
  const [optimizationIntensity, setOptimizationIntensity] = useState({
    pricing: 50,
    menu: 50,
    inventory: 50,
    scheduling: 50,
    marketing: 50
  });
  
  // Mock optimization results
  const [optimizationResults, setOptimizationResults] = useState({
    pricing: null,
    menu: null,
    inventory: null,
    scheduling: null,
    marketing: null
  });
  
  // Mock pricing recommendations
  const pricingRecommendations = [
    {
      itemId: 'item-1',
      name: 'Poulet Yassa',
      currentPrice: 5500,
      recommendedPrice: 6200,
      potentialRevenue: '+12.7%',
      confidence: 'high'
    },
    {
      itemId: 'item-2',
      name: 'Salade Niçoise',
      currentPrice: 3500,
      recommendedPrice: 3000,
      potentialRevenue: '+8.2%',
      confidence: 'medium'
    },
    {
      itemId: 'item-3',
      name: 'Poisson Braisé',
      currentPrice: 7000,
      recommendedPrice: 7500,
      potentialRevenue: '+7.1%',
      confidence: 'high'
    },
    {
      itemId: 'item-4',
      name: 'Jus de Bissap',
      currentPrice: 1500,
      recommendedPrice: 1800,
      potentialRevenue: '+20%',
      confidence: 'high'
    }
  ];
  
  // Mock menu optimization recommendations
  const menuRecommendations = [
    {
      type: 'add',
      name: 'Burger Africain',
      description: 'Burger avec sauce arachide et légumes locaux',
      estimatedRevenue: '35,000 FCFA/semaine',
      confidence: 'high'
    },
    {
      type: 'remove',
      name: 'Salade Caesar',
      reason: 'Faible marge, faible popularité',
      potentialSavings: '12,000 FCFA/semaine',
      confidence: 'medium'
    },
    {
      type: 'modify',
      name: 'Tieboudienne',
      suggestion: 'Offrir une version pour 2 personnes',
      estimatedRevenue: '+25,000 FCFA/semaine',
      confidence: 'high'
    }
  ];
  
  // Mock inventory recommendations
  const inventoryRecommendations = [
    {
      item: 'Poulet',
      currentStock: '20 kg',
      recommendation: 'Augmenter de 15%',
      reason: 'Ventes en hausse le weekend',
      potentialSavings: '30,000 FCFA/mois'
    },
    {
      item: 'Tomates',
      currentStock: '15 kg',
      recommendation: 'Réduire de 10%',
      reason: 'Gaspillage observé',
      potentialSavings: '12,000 FCFA/mois'
    },
    {
      item: 'Riz',
      currentStock: '50 kg',
      recommendation: 'Commander plus fréquemment',
      reason: 'Optimisation du cash flow',
      potentialSavings: '25,000 FCFA/mois'
    }
  ];
  
  // Mock staff scheduling recommendations
  const schedulingRecommendations = [
    {
      day: 'Vendredi',
      time: '18:00 - 22:00',
      recommendation: 'Ajouter 1 serveur',
      reason: 'Temps d\'attente élevé',
      impact: 'Amélioration satisfaction client +15%'
    },
    {
      day: 'Mardi',
      time: '14:00 - 17:00',
      recommendation: 'Réduire personnel cuisine de 1',
      reason: 'Période creuse',
      impact: 'Économie de 20,000 FCFA/mois'
    },
    {
      day: 'Weekend',
      time: '12:00 - 15:00',
      recommendation: 'Ajouter 1 cuisinier',
      reason: 'Pics de commandes',
      impact: 'Réduction temps préparation de 7 min'
    }
  ];
  
  // Mock marketing recommendations
  const marketingRecommendations = [
    {
      type: 'Promotion',
      suggestion: 'Happy Hour 17h-19h sur les boissons',
      impact: 'Augmentation fréquentation +22%',
      cost: '15,000 FCFA/semaine',
      roi: '200%'
    },
    {
      type: 'Fidélité',
      suggestion: '1 plat gratuit après 10 visites',
      impact: 'Augmentation clients réguliers +15%',
      cost: '30,000 FCFA/mois',
      roi: '180%'
    },
    {
      type: 'Social Media',
      suggestion: 'Campagne Instagram sur plats signature',
      impact: 'Nouveaux clients +10%',
      cost: '25,000 FCFA',
      roi: '150%'
    }
  ];
  
  // Function to run AI optimization
  const runOptimization = () => {
    if (!Object.values(activeOptimizations).some(value => value)) {
      toast({
        title: "Sélectionnez au moins une catégorie",
        description: "Veuillez activer au moins une catégorie d'optimisation.",
        variant: "destructive",
      });
      return;
    }
    
    setOptimizing(true);
    setOptimizationProgress(0);
    
    // Reset previous results
    setOptimizationResults({
      pricing: null,
      menu: null,
      inventory: null,
      scheduling: null,
      marketing: null
    });
    
    // Simulate optimization progress
    const interval = setInterval(() => {
      setOptimizationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Set mock results when optimization completes
          const newResults = { ...optimizationResults };
          
          if (activeOptimizations.pricing) {
            newResults.pricing = {
              potentialRevenue: '85,000 FCFA/mois',
              recommendations: pricingRecommendations,
              overallConfidence: 'high'
            };
          }
          
          if (activeOptimizations.menu) {
            newResults.menu = {
              potentialImpact: '72,000 FCFA/mois',
              recommendations: menuRecommendations,
              overallConfidence: 'medium'
            };
          }
          
          if (activeOptimizations.inventory) {
            newResults.inventory = {
              potentialSavings: '67,000 FCFA/mois',
              recommendations: inventoryRecommendations,
              overallConfidence: 'high'
            };
          }
          
          if (activeOptimizations.scheduling) {
            newResults.scheduling = {
              potentialSavings: '45,000 FCFA/mois',
              recommendations: schedulingRecommendations,
              overallConfidence: 'high'
            };
          }
          
          if (activeOptimizations.marketing) {
            newResults.marketing = {
              potentialRevenue: '120,000 FCFA/mois',
              recommendations: marketingRecommendations,
              overallConfidence: 'medium'
            };
          }
          
          setOptimizationResults(newResults);
          setOptimizing(false);
          
          toast({
            title: "Optimisation terminée",
            description: "Les résultats de l'optimisation sont prêts.",
          });
          
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };
  
  // Implement recommendations
  const implementRecommendations = (category) => {
    toast({
      title: "Recommandations appliquées",
      description: `Les recommandations ${category} ont été appliquées avec succès.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Optimiseur IA</h2>
        
        <Button
          disabled={optimizing}
          onClick={runOptimization}
          className="flex items-center gap-2"
        >
          <Brain className="h-4 w-4" />
          {optimizing ? 'Optimisation en cours...' : 'Lancer l\'optimisation'}
        </Button>
      </div>
      
      {optimizing && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analyse des données...</span>
                <span>{optimizationProgress}%</span>
              </div>
              <Progress value={optimizationProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Catégories d'optimisation</CardTitle>
            <CardDescription>
              Sélectionnez les domaines à optimiser avec notre IA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="pricing"
                  checked={activeOptimizations.pricing}
                  onCheckedChange={(checked) => 
                    setActiveOptimizations({...activeOptimizations, pricing: checked})
                  }
                />
                <Label htmlFor="pricing" className="font-medium">Optimisation des prix</Label>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <Slider
                  disabled={!activeOptimizations.pricing}
                  value={[optimizationIntensity.pricing]}
                  min={0}
                  max={100}
                  step={10}
                  onValueChange={(value) => 
                    setOptimizationIntensity({...optimizationIntensity, pricing: value[0]})
                  }
                  className="w-36"
                />
                <span className="text-xs text-muted-foreground">
                  Intensité: {optimizationIntensity.pricing}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="menu"
                  checked={activeOptimizations.menu}
                  onCheckedChange={(checked) => 
                    setActiveOptimizations({...activeOptimizations, menu: checked})
                  }
                />
                <Label htmlFor="menu" className="font-medium">Optimisation du menu</Label>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <Slider
                  disabled={!activeOptimizations.menu}
                  value={[optimizationIntensity.menu]}
                  min={0}
                  max={100}
                  step={10}
                  onValueChange={(value) => 
                    setOptimizationIntensity({...optimizationIntensity, menu: value[0]})
                  }
                  className="w-36"
                />
                <span className="text-xs text-muted-foreground">
                  Intensité: {optimizationIntensity.menu}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="inventory"
                  checked={activeOptimizations.inventory}
                  onCheckedChange={(checked) => 
                    setActiveOptimizations({...activeOptimizations, inventory: checked})
                  }
                />
                <Label htmlFor="inventory" className="font-medium">Optimisation des stocks</Label>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <Slider
                  disabled={!activeOptimizations.inventory}
                  value={[optimizationIntensity.inventory]}
                  min={0}
                  max={100}
                  step={10}
                  onValueChange={(value) => 
                    setOptimizationIntensity({...optimizationIntensity, inventory: value[0]})
                  }
                  className="w-36"
                />
                <span className="text-xs text-muted-foreground">
                  Intensité: {optimizationIntensity.inventory}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="scheduling"
                  checked={activeOptimizations.scheduling}
                  onCheckedChange={(checked) => 
                    setActiveOptimizations({...activeOptimizations, scheduling: checked})
                  }
                />
                <Label htmlFor="scheduling" className="font-medium">Planification du personnel</Label>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <Slider
                  disabled={!activeOptimizations.scheduling}
                  value={[optimizationIntensity.scheduling]}
                  min={0}
                  max={100}
                  step={10}
                  onValueChange={(value) => 
                    setOptimizationIntensity({...optimizationIntensity, scheduling: value[0]})
                  }
                  className="w-36"
                />
                <span className="text-xs text-muted-foreground">
                  Intensité: {optimizationIntensity.scheduling}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="marketing"
                  checked={activeOptimizations.marketing}
                  onCheckedChange={(checked) => 
                    setActiveOptimizations({...activeOptimizations, marketing: checked})
                  }
                />
                <Label htmlFor="marketing" className="font-medium">Stratégies marketing</Label>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <Slider
                  disabled={!activeOptimizations.marketing}
                  value={[optimizationIntensity.marketing]}
                  min={0}
                  max={100}
                  step={10}
                  onValueChange={(value) => 
                    setOptimizationIntensity({...optimizationIntensity, marketing: value[0]})
                  }
                  className="w-36"
                />
                <span className="text-xs text-muted-foreground">
                  Intensité: {optimizationIntensity.marketing}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Impact Estimé</CardTitle>
            <CardDescription>
              Amélioration potentielle de votre activité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Augmentation du chiffre d'affaires</p>
                    <p className="text-sm text-muted-foreground">Estimation mensuelle</p>
                  </div>
                </div>
                <div className="text-2xl font-bold">+15-25%</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <FileBarChart className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Réduction des coûts</p>
                    <p className="text-sm text-muted-foreground">Estimation mensuelle</p>
                  </div>
                </div>
                <div className="text-2xl font-bold">-8-12%</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">Gain de temps</p>
                    <p className="text-sm text-muted-foreground">Heures par semaine</p>
                  </div>
                </div>
                <div className="text-2xl font-bold">5-10h</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <BarChart4 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Amélioration de la satisfaction</p>
                    <p className="text-sm text-muted-foreground">Estimation</p>
                  </div>
                </div>
                <div className="text-2xl font-bold">+20%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Optimization Results */}
      {Object.values(optimizationResults).some(result => result !== null) && (
        <Tabs defaultValue="pricing" className="w-full mt-8">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="pricing" disabled={!optimizationResults.pricing}>
              Prix
            </TabsTrigger>
            <TabsTrigger value="menu" disabled={!optimizationResults.menu}>
              Menu
            </TabsTrigger>
            <TabsTrigger value="inventory" disabled={!optimizationResults.inventory}>
              Stocks
            </TabsTrigger>
            <TabsTrigger value="scheduling" disabled={!optimizationResults.scheduling}>
              Personnel
            </TabsTrigger>
            <TabsTrigger value="marketing" disabled={!optimizationResults.marketing}>
              Marketing
            </TabsTrigger>
          </TabsList>
          
          {/* Pricing Optimization Results */}
          <TabsContent value="pricing" className="mt-6">
            {optimizationResults.pricing && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Optimisation des prix</CardTitle>
                    <CardDescription>
                      Impact potentiel: {optimizationResults.pricing.potentialRevenue}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-blue-50">
                    Confiance: {optimizationResults.pricing.overallConfidence === 'high' ? 'Haute' : 'Moyenne'}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {optimizationResults.pricing.recommendations.map((rec, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-4">
                        <div>
                          <p className="font-medium">{rec.name}</p>
                          <div className="flex gap-4 mt-1">
                            <span className="text-sm">
                              Prix actuel: <span className="font-medium">{rec.currentPrice} FCFA</span>
                            </span>
                            <span className="text-sm">
                              Prix recommandé: <span className="font-medium">{rec.recommendedPrice} FCFA</span>
                            </span>
                          </div>
                          <div className="flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-xs text-green-500">Revenue potentiel: {rec.potentialRevenue}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className={`
                          ${rec.confidence === 'high' ? 'bg-green-50' : 'bg-yellow-50'}
                        `}>
                          {rec.confidence === 'high' ? 'Haute confiance' : 'Confiance moyenne'}
                        </Badge>
                      </div>
                    ))}
                    
                    <Button onClick={() => implementRecommendations('de prix')}>
                      Appliquer les recommandations
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Menu Optimization Results */}
          <TabsContent value="menu" className="mt-6">
            {optimizationResults.menu && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Optimisation du menu</CardTitle>
                    <CardDescription>
                      Impact potentiel: {optimizationResults.menu.potentialImpact}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-blue-50">
                    Confiance: {optimizationResults.menu.overallConfidence === 'high' ? 'Haute' : 'Moyenne'}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {optimizationResults.menu.recommendations.map((rec, index) => (
                      <div key={index} className="flex justify-between items-start border-b pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge>
                              {rec.type === 'add' ? 'Ajouter' : rec.type === 'remove' ? 'Retirer' : 'Modifier'}
                            </Badge>
                            <p className="font-medium">{rec.name}</p>
                          </div>
                          <p className="text-sm mt-1">
                            {rec.type === 'add' 
                              ? rec.description 
                              : rec.type === 'remove' 
                                ? rec.reason 
                                : rec.suggestion}
                          </p>
                          <div className="flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-xs text-green-500">
                              {rec.type === 'remove' ? rec.potentialSavings : rec.estimatedRevenue}
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className={`
                          ${rec.confidence === 'high' ? 'bg-green-50' : 'bg-yellow-50'}
                        `}>
                          {rec.confidence === 'high' ? 'Haute confiance' : 'Confiance moyenne'}
                        </Badge>
                      </div>
                    ))}
                    
                    <Button onClick={() => implementRecommendations('de menu')}>
                      Appliquer les recommandations
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Inventory Optimization Results */}
          <TabsContent value="inventory" className="mt-6">
            {optimizationResults.inventory && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Optimisation des stocks</CardTitle>
                    <CardDescription>
                      Économies potentielles: {optimizationResults.inventory.potentialSavings}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-blue-50">
                    Confiance: {optimizationResults.inventory.overallConfidence === 'high' ? 'Haute' : 'Moyenne'}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {optimizationResults.inventory.recommendations.map((rec, index) => (
                      <div key={index} className="flex justify-between items-start border-b pb-4">
                        <div>
                          <p className="font-medium">{rec.item}</p>
                          <div className="flex gap-4 mt-1">
                            <span className="text-sm">
                              Stock actuel: <span className="font-medium">{rec.currentStock}</span>
                            </span>
                            <span className="text-sm">
                              Recommandation: <span className="font-medium">{rec.recommendation}</span>
                            </span>
                          </div>
                          <p className="text-xs mt-1 text-gray-500">Raison: {rec.reason}</p>
                          <div className="flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-xs text-green-500">Économies: {rec.potentialSavings}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button onClick={() => implementRecommendations('de stocks')}>
                      Appliquer les recommandations
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Scheduling Optimization Results */}
          <TabsContent value="scheduling" className="mt-6">
            {optimizationResults.scheduling && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Planification du personnel</CardTitle>
                    <CardDescription>
                      Économies potentielles: {optimizationResults.scheduling.potentialSavings}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-blue-50">
                    Confiance: {optimizationResults.scheduling.overallConfidence === 'high' ? 'Haute' : 'Moyenne'}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {optimizationResults.scheduling.recommendations.map((rec, index) => (
                      <div key={index} className="flex justify-between items-start border-b pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-blue-50">
                              {rec.day}
                            </Badge>
                            <Badge variant="outline" className="bg-purple-50">
                              {rec.time}
                            </Badge>
                          </div>
                          <p className="font-medium mt-2">{rec.recommendation}</p>
                          <p className="text-xs mt-1 text-gray-500">Raison: {rec.reason}</p>
                          <div className="flex items-center mt-1">
                            <Zap className="h-3 w-3 text-amber-500 mr-1" />
                            <span className="text-xs text-amber-500">Impact: {rec.impact}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button onClick={() => implementRecommendations('de planification')}>
                      Appliquer les recommandations
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Marketing Optimization Results */}
          <TabsContent value="marketing" className="mt-6">
            {optimizationResults.marketing && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Stratégies marketing</CardTitle>
                    <CardDescription>
                      Revenus potentiels: {optimizationResults.marketing.potentialRevenue}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-blue-50">
                    Confiance: {optimizationResults.marketing.overallConfidence === 'high' ? 'Haute' : 'Moyenne'}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {optimizationResults.marketing.recommendations.map((rec, index) => (
                      <div key={index} className="flex justify-between items-start border-b pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge>
                              {rec.type}
                            </Badge>
                          </div>
                          <p className="font-medium mt-2">{rec.suggestion}</p>
                          <div className="flex gap-4 mt-1">
                            <span className="text-sm">
                              Coût: <span className="font-medium">{rec.cost}</span>
                            </span>
                            <span className="text-sm">
                              ROI: <span className="font-medium">{rec.roi}</span>
                            </span>
                          </div>
                          <div className="flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-xs text-green-500">Impact: {rec.impact}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button onClick={() => implementRecommendations('de marketing')}>
                      Appliquer les recommandations
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default RestaurantOptimizer;
