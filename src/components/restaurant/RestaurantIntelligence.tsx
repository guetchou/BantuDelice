
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRestaurant } from '@/hooks/useRestaurant';
import { useMenuItems } from '@/hooks/useMenuItems';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Brain, LineChart, TrendingUp, Sparkles, Lightbulb, AlertTriangle } from 'lucide-react';

interface RestaurantIntelligenceProps {
  restaurantId: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const RestaurantIntelligence: React.FC<RestaurantIntelligenceProps> = ({ restaurantId }) => {
  const { data: restaurant } = useRestaurant(restaurantId);
  const { 
    items: menuItems = [], 
    categories,
    menuAnalysis,
    menuSuggestions,
    isLoading
  } = useMenuItems(restaurantId);

  const [insightDepth, setInsightDepth] = useState<number>(50);
  const [activeTab, setActiveTab] = useState('market-analysis');

  // Intelligence marketing
  const [marketingTargets, setMarketingTargets] = useState({
    newCustomers: true,
    existingCustomers: true,
    lapsedCustomers: false
  });

  // Préparation des données pour les graphiques
  const categoryData = categories.map(category => {
    const itemsInCategory = menuItems.filter(item => item.category === category);
    const avgPrice = itemsInCategory.reduce((sum, item) => sum + item.price, 0) / itemsInCategory.length;
    const availableCount = itemsInCategory.filter(item => item.available).length;
    
    return {
      name: category,
      itemCount: itemsInCategory.length,
      averagePrice: Math.round(avgPrice),
      availablePercentage: (availableCount / itemsInCategory.length) * 100
    };
  });

  const profitabilityData = categories.map(category => {
    const itemsInCategory = menuItems.filter(item => item.category === category);
    const totalRevenue = itemsInCategory.reduce((sum, item) => sum + item.price, 0);
    // Estimation fictive du profit (30% du prix)
    const estimatedProfit = totalRevenue * 0.3;
    
    return {
      name: category,
      revenue: totalRevenue,
      profit: estimatedProfit
    };
  });

  // Données fictives pour la section marketing
  const customerSegments = [
    { name: 'Habitués', value: 40 },
    { name: 'Occasionnels', value: 30 },
    { name: 'Nouveaux', value: 20 },
    { name: 'Groupes', value: 10 }
  ];

  // Données fictives pour les prévisions
  const weekdays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const forecastData = weekdays.map(day => ({
    name: day,
    predicted: Math.round(Math.random() * 80) + 20,
    actual: Math.round(Math.random() * 80) + 20
  }));

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-10 flex justify-center items-center">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
            <p>Chargement de l'intelligence restaurant...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold">Intelligence Restaurant</h2>
          <p className="text-muted-foreground">
            Analyses avancées et recommandations pour optimiser votre restaurant
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Label htmlFor="insight-depth">Profondeur d'analyse</Label>
          <Slider
            id="insight-depth"
            className="w-[150px]"
            defaultValue={[50]}
            max={100}
            min={10}
            step={10}
            onValueChange={(value) => setInsightDepth(value[0])}
          />
          <span className="text-sm font-medium">{insightDepth}%</span>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 w-full">
          <TabsTrigger value="market-analysis" className="flex gap-2 items-center">
            <LineChart className="h-4 w-4" />
            Analyse du marché
          </TabsTrigger>
          <TabsTrigger value="menu-optimization" className="flex gap-2 items-center">
            <Sparkles className="h-4 w-4" />
            Optimisation du menu
          </TabsTrigger>
          <TabsTrigger value="smart-pricing" className="flex gap-2 items-center">
            <TrendingUp className="h-4 w-4" />
            Tarification intelligente
          </TabsTrigger>
          <TabsTrigger value="ai-suggestions" className="flex gap-2 items-center">
            <Brain className="h-4 w-4" />
            Intelligence artificielle
          </TabsTrigger>
        </TabsList>

        {/* ONGLET: ANALYSE DU MARCHÉ */}
        <TabsContent value="market-analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Segmentation de la clientèle</CardTitle>
              <CardDescription>
                Comprendre la composition de votre clientèle pour mieux cibler vos actions marketing
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customerSegments}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {customerSegments.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Cibles marketing</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="target-new">Nouveaux clients</Label>
                      <Switch
                        id="target-new"
                        checked={marketingTargets.newCustomers}
                        onCheckedChange={(checked) => setMarketingTargets({...marketingTargets, newCustomers: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="target-existing">Clients fidèles</Label>
                      <Switch
                        id="target-existing"
                        checked={marketingTargets.existingCustomers}
                        onCheckedChange={(checked) => setMarketingTargets({...marketingTargets, existingCustomers: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="target-lapsed">Clients perdus</Label>
                      <Switch
                        id="target-lapsed"
                        checked={marketingTargets.lapsedCustomers}
                        onCheckedChange={(checked) => setMarketingTargets({...marketingTargets, lapsedCustomers: checked})}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <h4 className="font-medium">Recommandations marketing</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                        <span>Lancez une promotion "Happy Hour" entre 15h et 17h pour attirer plus de clients pendant les heures creuses.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                        <span>Créez un programme de fidélité offrant 10% de réduction après 5 visites pour encourager la fidélité client.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                        <span>Organisez des événements thématiques mensuels pour générer du buzz et attirer de nouveaux clients.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Prévisions d'affluence</CardTitle>
              <CardDescription>
                Prévisions basées sur les données historiques et les tendances saisonnières
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={forecastData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="predicted" name="Prévision" fill="#8884d8" />
                    <Bar dataKey="actual" name="Réel" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 space-y-4">
                <h4 className="font-medium">Points d'action</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <h5 className="font-medium mb-1">Samedi - Pic d'affluence</h5>
                      <p className="text-sm text-muted-foreground">Prévoyez 2 serveurs supplémentaires et augmentez les stocks de 25%.</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <h5 className="font-medium mb-1">Mardi - Période creuse</h5>
                      <p className="text-sm text-muted-foreground">Lancez une promotion "2 pour 1" pour stimuler la fréquentation.</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <h5 className="font-medium mb-1">Tendance mensuelle</h5>
                      <p className="text-sm text-muted-foreground">Hausse prévue de 15% par rapport au mois précédent.</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* ONGLET: OPTIMISATION DU MENU */}
        <TabsContent value="menu-optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des performances du menu</CardTitle>
              <CardDescription>
                Identifier les forces et faiblesses de votre offre actuelle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Distribution par catégorie</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={categoryData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="itemCount" name="Nombre d'items" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Performances générales</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Disponibilité des plats</span>
                        <span className="text-sm font-medium">{menuAnalysis?.availability?.availablePercentage.toFixed(0)}%</span>
                      </div>
                      <Progress value={menuAnalysis?.availability?.availablePercentage} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Options végétariennes</span>
                        <span className="text-sm font-medium">{menuAnalysis?.dietaryOptions?.vegetarianPercentage.toFixed(0)}%</span>
                      </div>
                      <Progress value={menuAnalysis?.dietaryOptions?.vegetarianPercentage} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Équilibre des prix</span>
                        <span className="text-sm font-medium">75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Popularité moyenne</span>
                        <span className="text-sm font-medium">
                          {(menuAnalysis?.popularityStats?.averagePopularity * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress 
                        value={menuAnalysis?.popularityStats?.averagePopularity * 100} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium mt-6">Recommandations prioritaires</h3>
                  <ul className="space-y-2">
                    {menuSuggestions?.slice(0, 3).map((suggestion, index) => (
                      <li key={suggestion.id} className="flex items-start gap-2">
                        <Badge variant={suggestion.importance === 'high' ? 'destructive' : 'outline'} className="mt-0.5">
                          {suggestion.importance}
                        </Badge>
                        <span>{suggestion.message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Recommendations d'équilibrage du menu</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <h4 className="font-medium">Ajouter</h4>
                      <ul className="mt-2 space-y-1">
                        <li className="text-sm">• 2-3 options véganes pour élargir votre clientèle</li>
                        <li className="text-sm">• Plus d'options sans gluten dans les entrées</li>
                        <li className="text-sm">• Des plats légers pour le déjeuner d'affaires</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <h4 className="font-medium">Modifier</h4>
                      <ul className="mt-2 space-y-1">
                        <li className="text-sm">• Repensez les 3 plats les moins populaires</li>
                        <li className="text-sm">• Ajustez les prix des desserts (trop élevés)</li>
                        <li className="text-sm">• Améliorez la présentation des salades</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <h4 className="font-medium">Rééquilibrer</h4>
                      <ul className="mt-2 space-y-1">
                        <li className="text-sm">• Divisez la catégorie "Plats principaux" en sous-catégories</li>
                        <li className="text-sm">• Réduisez le nombre total d'options de 15%</li>
                        <li className="text-sm">• Créez une section "Spécialités du chef"</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* ONGLET: TARIFICATION INTELLIGENTE */}
        <TabsContent value="smart-pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimisation des prix</CardTitle>
              <CardDescription>
                Analysez et ajustez stratégiquement vos prix pour maximiser les revenus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Analyse de profitabilité par catégorie</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={profitabilityData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value.toLocaleString()} FCFA`} />
                        <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
                        <Bar dataKey="profit" name="Profit estimé" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Suggestions d'ajustement de prix</h3>
                  <div className="space-y-3">
                    {menuItems.slice(0, 5).map(item => {
                      // Calculer un nouveau prix suggéré (+/- 10% aléatoirement pour la démo)
                      const adjustment = Math.random() > 0.5 ? 1.1 : 0.9;
                      const suggestedPrice = Math.round(item.price * adjustment / 100) * 100;
                      const isIncrease = suggestedPrice > item.price;
                      
                      return (
                        <div key={item.id} className="flex justify-between items-center p-2 rounded border">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="line-through text-sm text-muted-foreground">
                              {item.price.toLocaleString()} FCFA
                            </p>
                            <p className={`font-medium ${isIncrease ? 'text-green-600' : 'text-amber-600'}`}>
                              {suggestedPrice.toLocaleString()} FCFA
                              <span className="text-xs ml-1">
                                ({isIncrease ? '+' : ''}{Math.round((suggestedPrice / item.price - 1) * 100)}%)
                              </span>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    
                    <Button variant="outline" className="w-full mt-2">
                      Voir toutes les suggestions
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-medium">Stratégies de tarification recommandées</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <h4 className="font-medium">Prix psychologiques</h4>
                      <p className="text-sm mt-1">Utilisez des prix se terminant par 90 ou 95 plutôt que des nombres ronds pour créer une perception de meilleure valeur.</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <h4 className="font-medium">Menus à prix fixe</h4>
                      <p className="text-sm mt-1">Créez des formules midi à 6.900 FCFA et des menus dégustation à 15.900 FCFA pour augmenter le panier moyen.</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <h4 className="font-medium">Tarification dynamique</h4>
                      <p className="text-sm mt-1">Augmentez légèrement les prix (+10%) pendant les heures de forte affluence et le week-end.</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6">
                  <Card className="border-yellow-500 bg-yellow-50">
                    <CardContent className="p-4 flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Attention aux hausses de prix</h4>
                        <p className="text-sm text-yellow-800/80 mt-1">
                          Nos analyses montrent qu'une hausse globale des prix de plus de 12% pourrait entraîner une baisse de fréquentation de 8-10%. 
                          Privilégiez des hausses ciblées sur les plats à forte demande et maintenez les prix des plats populaires.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* ONGLET: INTELLIGENCE ARTIFICIELLE */}
        <TabsContent value="ai-suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assistant Intelligence Artificielle</CardTitle>
              <CardDescription>
                Recommandations générées par IA pour votre restaurant
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Brain className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-medium">Analyse globale de votre restaurant</h3>
                    </div>
                    <p className="text-sm">
                      Votre restaurant {restaurant?.name} est bien positionné, avec {menuItems.length} items au menu
                      répartis dans {categories.length} catégories. Vos forces principales sont dans 
                      les catégories {categories[0]} et {categories[1] || 'Entrées'}.
                      
                      Cependant, l'analyse révèle quelques points d'amélioration, notamment:
                    </p>
                    <ul className="mt-2 space-y-1">
                      <li className="text-sm flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>Déséquilibre des prix entre les catégories</span>
                      </li>
                      <li className="text-sm flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>Manque d'options végétariennes ({menuAnalysis?.dietaryOptions?.vegetarianPercentage.toFixed(0)}% du menu)</span>
                      </li>
                      <li className="text-sm flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>Plusieurs plats populaires sont souvent indisponibles</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Lightbulb className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-medium">Plan d'action recommandé</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium">Court terme (0-30 jours)</h4>
                        <ul className="mt-1">
                          <li className="text-sm flex items-start gap-2">
                            <span className="text-primary font-bold">1.</span>
                            <span>Ajouter 3-4 options végétariennes réparties entre entrées et plats principaux</span>
                          </li>
                          <li className="text-sm flex items-start gap-2">
                            <span className="text-primary font-bold">2.</span>
                            <span>Revoir la disponibilité des 5 plats les plus populaires</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium">Moyen terme (1-3 mois)</h4>
                        <ul className="mt-1">
                          <li className="text-sm flex items-start gap-2">
                            <span className="text-primary font-bold">1.</span>
                            <span>Restructurer le menu en divisant la catégorie "{categories[0]}" en sous-catégories</span>
                          </li>
                          <li className="text-sm flex items-start gap-2">
                            <span className="text-primary font-bold">2.</span>
                            <span>Implémenter une stratégie de prix psychologiques</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium">Long terme (3-6 mois)</h4>
                        <ul className="mt-1">
                          <li className="text-sm flex items-start gap-2">
                            <span className="text-primary font-bold">1.</span>
                            <span>Renouveler 20% du menu en conservant les best-sellers</span>
                          </li>
                          <li className="text-sm flex items-start gap-2">
                            <span className="text-primary font-bold">2.</span>
                            <span>Développer des menus saisonniers pour créer de l'engagement</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Impact financier estimé</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Augmentation du chiffre d'affaires</span>
                          <span className="font-medium">+8-12%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Amélioration de la marge</span>
                          <span className="font-medium">+3-5%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Réduction des pertes</span>
                          <span className="font-medium">-15-20%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Retour sur investissement</span>
                          <span className="font-medium text-green-600">4-6 mois</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Menu idéal projeté</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium">Distribution idéale des catégories</h4>
                          <ul className="mt-1">
                            {categories.map((category, i) => (
                              <li key={category} className="text-sm flex items-center justify-between">
                                <span>{category}</span>
                                <Badge variant="outline">{Math.floor(20 - i * 3)}%</Badge>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium">Options diététiques cibles</h4>
                          <ul className="mt-1">
                            <li className="text-sm flex items-center justify-between">
                              <span>Végétarien</span>
                              <Badge variant="outline">25-30%</Badge>
                            </li>
                            <li className="text-sm flex items-center justify-between">
                              <span>Végan</span>
                              <Badge variant="outline">10-15%</Badge>
                            </li>
                            <li className="text-sm flex items-center justify-between">
                              <span>Sans gluten</span>
                              <Badge variant="outline">15-20%</Badge>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <h3 className="font-medium flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span>IA: Idée innovante</span>
                    </h3>
                    <p className="text-sm mt-2">
                      Créez une section "Chef's Table" avec un menu dégustation hebdomadaire
                      à prix premium (25.000 FCFA). Nos analyses prédisent que cela peut 
                      générer une augmentation de 7% du chiffre d'affaires tout en renforçant
                      votre image de marque.
                    </p>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      En savoir plus
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RestaurantIntelligence;
