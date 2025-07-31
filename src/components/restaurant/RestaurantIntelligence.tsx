
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Line, Bar, Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement
} from 'chart.js';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useRestaurantData } from '@/hooks/useRestaurantData';
import { 
  TrendingUp,
  BarChart3,
  FileBarChart,
  ListChecks,
  DollarSign,
  Search,
  Target,
  Zap,
  Award,
  Lightbulb,
  AlertCircle
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface RestaurantIntelligenceProps {
  restaurantId: string;
}

const RestaurantIntelligence: React.FC<RestaurantIntelligenceProps> = ({ restaurantId }) => {
  const [activeTab, setActiveTab] = useState('performance');
  const { items, categories, isLoading, error } = useMenuItems(restaurantId);
  const { 
    useMenuRecommendations, 
    useOptimizePricing,
    useRestaurantPerformance
  } = useRestaurantData();
  
  const { data: menuRecommendations, isLoading: recommendationsLoading } = useMenuRecommendations(restaurantId);
  const { data: pricingData, isLoading: pricingLoading } = useOptimizePricing(restaurantId);
  const { data: performanceData, isLoading: performanceLoading } = useRestaurantPerformance(restaurantId, 'week');
  
  if (isLoading || recommendationsLoading || pricingLoading || performanceLoading) {
    return (
      <div className="w-full p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          Impossible de charger les données d'intelligence du restaurant.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Intelligence Commerciale</h2>
        <Button variant="outline" className="gap-2">
          <FileBarChart className="h-4 w-4" />
          Exporter les analyses
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Performance</span>
          </TabsTrigger>
          <TabsTrigger value="menu" className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            <span>Analyse du Menu</span>
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>Optimisation des Prix</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {performanceData?.summary && (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                      Revenus
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {new Intl.NumberFormat('fr-FR').format(performanceData.summary.totalRevenue)} FCFA
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <span className={`${Number(performanceData.summary.revenueGrowth) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {Number(performanceData.summary.revenueGrowth) >= 0 ? '+' : ''}{performanceData.summary.revenueGrowth}%
                      </span>
                      vs période précédente
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Search className="h-5 w-5 text-green-500" />
                      Commandes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {performanceData.summary.totalOrders}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Panier moyen: {new Intl.NumberFormat('fr-FR').format(performanceData.summary.averageOrderValue)} FCFA
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-red-500" />
                      Analyse
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {performanceData.insights.map((insight, index) => (
                        <p key={index} className="text-sm">
                          <span className="font-medium">{insight.title}:</span> {insight.description}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenus quotidiens</CardTitle>
              </CardHeader>
              <CardContent>
                {performanceData?.dailyData && (
                  <div className="h-80">
                    <Line 
                      data={{
                        labels: performanceData.dailyData.map(day => day.date),
                        datasets: [
                          {
                            label: 'Revenus (FCFA)',
                            data: performanceData.dailyData.map(day => day.revenue),
                            borderColor: 'rgb(59, 130, 246)',
                            backgroundColor: 'rgba(59, 130, 246, 0.5)',
                            tension: 0.3
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: false
                          }
                        }
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top 5 plats</CardTitle>
              </CardHeader>
              <CardContent>
                {performanceData?.topItems && (
                  <div className="h-80">
                    <Bar 
                      data={{
                        labels: performanceData.topItems.map(item => item.name),
                        datasets: [
                          {
                            label: 'Commandes',
                            data: performanceData.topItems.map(item => item.orders),
                            backgroundColor: 'rgba(34, 197, 94, 0.8)',
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'y',
                        plugins: {
                          legend: {
                            position: 'top',
                          }
                        }
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="menu" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Analyse du Menu</CardTitle>
                <CardDescription>
                  Aperçu des statistiques et de la distribution du menu
                </CardDescription>
              </CardHeader>
              <CardContent>
                {menuRecommendations?.stats && (
                  <>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <Label className="text-sm text-muted-foreground">Nombre d'éléments</Label>
                        <p className="text-2xl font-bold">{menuRecommendations.stats.totalItems}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Catégories</Label>
                        <p className="text-2xl font-bold">{Object.keys(menuRecommendations.stats.categories).length}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Prix moyen</Label>
                        <p className="text-2xl font-bold">{new Intl.NumberFormat('fr-FR').format(menuRecommendations.stats.avgPrice)} FCFA</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Prix le plus élevé</Label>
                        <p className="text-2xl font-bold">
                          {new Intl.NumberFormat('fr-FR').format(
                            items.reduce((max, item) => Math.max(max, item.price), 0)
                          )} FCFA
                        </p>
                      </div>
                    </div>
                    
                    <div className="h-64">
                      <Pie 
                        data={{
                          labels: Object.keys(menuRecommendations.stats.categories),
                          datasets: [
                            {
                              label: 'Éléments par catégorie',
                              data: Object.values(menuRecommendations.stats.categories),
                              backgroundColor: [
                                'rgba(255, 99, 132, 0.8)',
                                'rgba(54, 162, 235, 0.8)',
                                'rgba(255, 206, 86, 0.8)',
                                'rgba(75, 192, 192, 0.8)',
                                'rgba(153, 102, 255, 0.8)',
                                'rgba(255, 159, 64, 0.8)',
                                'rgba(199, 199, 199, 0.8)',
                              ],
                              borderWidth: 1,
                            }
                          ]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recommandations</CardTitle>
                <CardDescription>
                  Suggestions pour améliorer votre menu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {menuRecommendations?.recommendations && menuRecommendations.recommendations.length > 0 ? (
                    menuRecommendations.recommendations.map((rec, index) => (
                      <Alert key={index} className={`
                        ${rec.priority === 'high' ? 'border-red-500 bg-red-50' : ''}
                        ${rec.priority === 'medium' ? 'border-amber-500 bg-amber-50' : ''}
                        ${rec.priority === 'low' ? 'border-blue-500 bg-blue-50' : ''}
                      `}>
                        <Lightbulb className={`
                          h-4 w-4
                          ${rec.priority === 'high' ? 'text-red-500' : ''}
                          ${rec.priority === 'medium' ? 'text-amber-500' : ''}
                          ${rec.priority === 'low' ? 'text-blue-500' : ''}
                        `} />
                        <AlertTitle className="text-gray-800">{rec.title}</AlertTitle>
                        <AlertDescription className="text-gray-600">
                          <p>{rec.description}</p>
                          <p className="text-sm mt-1 font-medium">Impact: {rec.impact}</p>
                        </AlertDescription>
                      </Alert>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <Award className="mx-auto h-10 w-10 text-green-500 mb-3" />
                      <p className="text-lg font-medium text-gray-700">Votre menu semble bien équilibré</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Nous n'avons pas de recommandations majeures pour l'instant
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="pricing" className="pt-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Optimisation des Prix</CardTitle>
                <CardDescription>
                  Recommandations pour ajuster les prix et maximiser la rentabilité
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pricingData?.summary && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card className="shadow-none border-0 bg-green-50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-full">
                              <Zap className="h-5 w-5 text-green-700" />
                            </div>
                            <div>
                              <p className="text-sm text-green-700">Augmentation potentielle de revenus</p>
                              <p className="text-xl font-bold text-green-700">
                                {new Intl.NumberFormat('fr-FR').format(pricingData.summary.potentialRevenueIncrease)} FCFA
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="shadow-none border-0 bg-blue-50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <FileBarChart className="h-5 w-5 text-blue-700" />
                            </div>
                            <div>
                              <p className="text-sm text-blue-700">Nombre de changements de prix</p>
                              <p className="text-xl font-bold text-blue-700">
                                {pricingData.summary.totalPriceChanges} plats
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="shadow-none border-0 bg-amber-50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-amber-100 p-2 rounded-full">
                              <DollarSign className="h-5 w-5 text-amber-700" />
                            </div>
                            <div>
                              <p className="text-sm text-amber-700">Changement moyen</p>
                              <p className="text-xl font-bold text-amber-700">
                                {pricingData.summary.avgPercentageChange}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="border rounded-md">
                      <div className="bg-gray-50 p-3 border-b">
                        <div className="grid grid-cols-12 text-sm font-medium text-gray-700">
                          <div className="col-span-4">Plat</div>
                          <div className="col-span-2 text-right">Prix actuel</div>
                          <div className="col-span-2 text-right">Prix recommandé</div>
                          <div className="col-span-2 text-right">Changement</div>
                          <div className="col-span-2 text-right">Impact</div>
                        </div>
                      </div>
                      
                      <div className="divide-y">
                        {pricingData.recommendations.map((rec, index) => (
                          <div key={index} className="p-3 hover:bg-gray-50">
                            <div className="grid grid-cols-12 items-center">
                              <div className="col-span-4">
                                <p className="font-medium">{rec.name}</p>
                                <p className="text-xs text-gray-500">{rec.reasoning}</p>
                              </div>
                              <div className="col-span-2 text-right">
                                {new Intl.NumberFormat('fr-FR').format(rec.currentPrice)} FCFA
                              </div>
                              <div className="col-span-2 text-right font-medium">
                                {new Intl.NumberFormat('fr-FR').format(rec.recommendedPrice)} FCFA
                              </div>
                              <div className="col-span-2 text-right">
                                <span className={`
                                  font-medium
                                  ${Number(rec.percentageChange) > 0 ? 'text-green-600' : ''}
                                  ${Number(rec.percentageChange) < 0 ? 'text-red-600' : ''}
                                `}>
                                  {rec.percentageChange}
                                </span>
                              </div>
                              <div className="col-span-2 text-right">
                                <span className="text-green-600 font-medium">
                                  +{new Intl.NumberFormat('fr-FR').format(rec.expectedRevenueChange)} FCFA
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button className="bg-green-600 hover:bg-green-700">
                        Appliquer les changements de prix
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RestaurantIntelligence;
