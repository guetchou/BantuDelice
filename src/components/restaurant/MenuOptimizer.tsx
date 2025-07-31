
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { useMenuEnhanced } from '@/hooks/useMenuEnhanced';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useRestaurant } from '@/components/restaurant/useRestaurant';

interface MenuOptimizerProps {
  restaurantId: string;
}

const MenuOptimizer: React.FC<MenuOptimizerProps> = ({ restaurantId }) => {
  const { toast } = useToast();
  const { data: restaurant } = useRestaurant(restaurantId);
  const { allItems, menuAnalysis } = useMenuEnhanced(restaurantId);
  
  const [optimizationCriteria, setOptimizationCriteria] = useState({
    profitMargin: 30,
    customerPreference: 50,
    competitiveAnalysis: true,
    seasonalAdjustment: true,
    ingredientAvailability: true
  });
  
  const [forecastPeriod, setForecastPeriod] = useState(30);
  
  // Algorithme 1: Optimisation des prix basée sur multiples facteurs
  const optimizePrices = () => {
    const optimizedItems = allItems?.map(item => {
      // Calculer le prix optimal basé sur les critères sélectionnés
      let optimalPrice = item.price;
      
      // Ajustement par la marge de profit
      const marginMultiplier = optimizationCriteria.profitMargin / 100 + 0.7;
      optimalPrice = optimalPrice * marginMultiplier;
      
      // Ajustement par les préférences client
      const popularityAdjustment = (optimizationCriteria.customerPreference / 100) * 
        (item.popularity_score ? (1 - item.popularity_score / 10) : 0.1);
      optimalPrice = optimalPrice * (1 - popularityAdjustment);
      
      // Arrondissement psychologique pour marketing
      optimalPrice = Math.ceil(optimalPrice / 500) * 500 - 5;
      
      return {
        ...item,
        currentPrice: item.price,
        suggestedPrice: optimalPrice,
        priceDifference: optimalPrice - item.price,
        percentChange: ((optimalPrice - item.price) / item.price) * 100
      };
    });
    
    // Filtrer les items avec des changements significatifs
    return optimizedItems?.filter(item => 
      Math.abs(item.percentChange) > 5
    ).sort((a, b) => Math.abs(b.percentChange) - Math.abs(a.percentChange));
  };
  
  // Algorithme 2: Prévisions de ventes basées sur les données historiques
  const generateSalesForecast = () => {
    if (!allItems) return [];
    
    // Simuler les ventes historiques pour la démo
    const historicalData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      sales: Math.floor(Math.random() * 5000) + 2000
    }));
    
    // Générer des prévisions pour les prochains mois
    const forecastMonths = forecastPeriod / 30;
    const lastMonth = historicalData[historicalData.length - 1];
    
    const forecast = Array.from({ length: forecastMonths }, (_, i) => {
      const month = lastMonth.month + i + 1;
      const monthName = new Date(2023, (month - 1) % 12, 1).toLocaleString('fr-FR', { month: 'short' });
      
      // Algorithme simplifié de prévision (ARIMA simplifié)
      const trend = Math.sin(month / 6 * Math.PI) * 0.2 + 0.05; // Facteur saisonnier
      const seasonalGrowth = optimizationCriteria.seasonalAdjustment ? trend : 0;
      const marginalGrowth = optimizationCriteria.profitMargin / 100 * 0.1;
      
      const projectedGrowth = 1 + seasonalGrowth + marginalGrowth;
      const projectedSales = Math.round(lastMonth.sales * projectedGrowth);
      
      return {
        month: monthName,
        sales: projectedSales,
        profit: Math.round(projectedSales * optimizationCriteria.profitMargin / 100)
      };
    });
    
    return forecast;
  };
  
  const optimizedPrices = optimizePrices();
  const salesForecast = generateSalesForecast();
  
  const handleOptimize = () => {
    toast({
      title: "Optimisation terminée",
      description: `${optimizedPrices?.length || 0} suggestions de prix ont été générées.`,
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Intelligence d'optimisation du menu</CardTitle>
          <CardDescription>
            Optimisez vos prix et votre menu pour maximiser les revenus et la satisfaction client
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Critères d'optimisation</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="profit-margin">Marge de profit cible (%)</Label>
                    <span className="text-sm">{optimizationCriteria.profitMargin}%</span>
                  </div>
                  <Slider
                    id="profit-margin"
                    value={[optimizationCriteria.profitMargin]}
                    min={5}
                    max={60}
                    step={1}
                    onValueChange={(value) => setOptimizationCriteria({
                      ...optimizationCriteria,
                      profitMargin: value[0]
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="customer-preference">Préférence client (impact)</Label>
                    <span className="text-sm">{optimizationCriteria.customerPreference}%</span>
                  </div>
                  <Slider
                    id="customer-preference"
                    value={[optimizationCriteria.customerPreference]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(value) => setOptimizationCriteria({
                      ...optimizationCriteria,
                      customerPreference: value[0]
                    })}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="competitive-analysis">Analyse compétitive</Label>
                    <Switch
                      id="competitive-analysis"
                      checked={optimizationCriteria.competitiveAnalysis}
                      onCheckedChange={(checked) => setOptimizationCriteria({
                        ...optimizationCriteria,
                        competitiveAnalysis: checked
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="seasonal-adjustment">Ajustement saisonnier</Label>
                    <Switch
                      id="seasonal-adjustment"
                      checked={optimizationCriteria.seasonalAdjustment}
                      onCheckedChange={(checked) => setOptimizationCriteria({
                        ...optimizationCriteria,
                        seasonalAdjustment: checked
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ingredient-availability">Disponibilité des ingrédients</Label>
                    <Switch
                      id="ingredient-availability"
                      checked={optimizationCriteria.ingredientAvailability}
                      onCheckedChange={(checked) => setOptimizationCriteria({
                        ...optimizationCriteria,
                        ingredientAvailability: checked
                      })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2 pt-2">
                  <Label htmlFor="forecast-period">Période de prévision (jours)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="forecast-period"
                      type="number"
                      min={7}
                      max={365}
                      value={forecastPeriod}
                      onChange={(e) => setForecastPeriod(Number(e.target.value))}
                    />
                    <Button onClick={handleOptimize}>Optimiser</Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Prévisions de ventes</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salesForecast}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString('fr-FR')} FCFA`} />
                    <Bar dataKey="sales" name="Ventes" fill="#8884d8" />
                    <Bar dataKey="profit" name="Profit" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-medium mb-4">Suggestions d'optimisation de prix</h3>
            <div className="space-y-3">
              {optimizedPrices?.slice(0, 5).map((item, index) => (
                <Card key={index} className="p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2">
                        <span className="text-sm line-through">{item.currentPrice.toLocaleString('fr-FR')} FCFA</span>
                        <span className="font-medium">{item.suggestedPrice.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                      <span className={`text-xs ${item.percentChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.percentChange > 0 ? '+' : ''}{item.percentChange.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
              
              {optimizedPrices && optimizedPrices.length > 5 && (
                <Button variant="outline" className="w-full">
                  Voir {optimizedPrices.length - 5} suggestions supplémentaires
                </Button>
              )}
              
              {(!optimizedPrices || optimizedPrices.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucune suggestion d'optimisation significative trouvée
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuOptimizer;
