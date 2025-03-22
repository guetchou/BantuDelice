
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, LineChart, Line 
} from "recharts";
import { CalendarIcon, TrendingUp, Users, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, subDays, subMonths } from "date-fns";
import { fr } from "date-fns/locale";

interface RestaurantAnalyticsProps {
  restaurantId: string;
}

// Mock data for demonstration
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const RestaurantAnalytics: React.FC<RestaurantAnalyticsProps> = ({ restaurantId }) => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('week');
  
  // Mock data for demonstration
  const categoryData = [
    { name: 'Entrées', value: 25 },
    { name: 'Plats', value: 45 },
    { name: 'Desserts', value: 15 },
    { name: 'Boissons', value: 10 },
    { name: 'Autres', value: 5 },
  ];
  
  const generateTimeSeriesData = () => {
    const today = new Date();
    const data = [];
    
    if (period === 'day') {
      for (let i = 0; i < 24; i++) {
        data.push({
          time: `${i}h`,
          commandes: Math.floor(Math.random() * 10),
          chiffre: Math.floor(Math.random() * 5000 + 1000),
        });
      }
    } else if (period === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        data.push({
          time: format(date, 'EEE', { locale: fr }),
          commandes: Math.floor(Math.random() * 30 + 10),
          chiffre: Math.floor(Math.random() * 20000 + 5000),
        });
      }
    } else if (period === 'month') {
      for (let i = 29; i >= 0; i--) {
        const date = subDays(today, i);
        data.push({
          time: format(date, 'd MMM', { locale: fr }),
          commandes: Math.floor(Math.random() * 50 + 20),
          chiffre: Math.floor(Math.random() * 30000 + 10000),
        });
      }
    } else if (period === 'year') {
      for (let i = 11; i >= 0; i--) {
        const date = subMonths(today, i);
        data.push({
          time: format(date, 'MMM', { locale: fr }),
          commandes: Math.floor(Math.random() * 200 + 100),
          chiffre: Math.floor(Math.random() * 300000 + 100000),
        });
      }
    }
    
    return data;
  };
  
  const timeSeriesData = generateTimeSeriesData();
  
  const customerData = [
    { name: 'Nouveaux', value: 35 },
    { name: 'Réguliers', value: 65 },
  ];
  
  const popularTimesData = [
    { heure: '6-8h', clients: 5 },
    { heure: '8-10h', clients: 15 },
    { heure: '10-12h', clients: 25 },
    { heure: '12-14h', clients: 80 },
    { heure: '14-16h', clients: 30 },
    { heure: '16-18h', clients: 20 },
    { heure: '18-20h', clients: 75 },
    { heure: '20-22h', clients: 60 },
    { heure: '22-24h', clients: 25 },
  ];
  
  // AI-generated insights based on data patterns
  const insights = [
    "Les plats principaux représentent 45% de votre chiffre d'affaires, envisagez d'élargir cette gamme.",
    "Vos heures de pointe sont entre 12h-14h et 18h-20h, optimisez votre personnel pendant ces périodes.",
    "65% de vos clients sont des habitués. Envisagez un programme de fidélité pour augmenter ce pourcentage.",
    "Les ventes augmentent de 23% le weekend par rapport à la semaine.",
  ];
  
  // AI-recommended actions based on analytics
  const recommendations = [
    "Ajoutez 2-3 nouvelles entrées pour diversifier votre menu",
    "Lancez une promotion sur les boissons pour augmenter leur part (actuellement 10%)",
    "Prévoyez plus de personnel le vendredi soir, vos commandes y sont 30% plus élevées",
    "Optimisez vos horaires d'ouverture: envisagez d'ouvrir plus tard le soir le weekend",
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Analyse et Intelligence</h2>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={period === 'day' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setPeriod('day')}
          >
            Jour
          </Button>
          <Button 
            variant={period === 'week' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setPeriod('week')}
          >
            Semaine
          </Button>
          <Button 
            variant={period === 'month' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setPeriod('month')}
          >
            Mois
          </Button>
          <Button 
            variant={period === 'year' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setPeriod('year')}
          >
            Année
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Commandes</p>
                <h3 className="text-2xl font-bold">324</h3>
                <p className="text-xs text-emerald-500 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% cette période
                </p>
              </div>
              <div className="h-12 w-12 bg-primary/10 flex items-center justify-center rounded-full">
                <CalendarIcon className="text-primary h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clients</p>
                <h3 className="text-2xl font-bold">1,254</h3>
                <p className="text-xs text-emerald-500 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5% cette période
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-500/10 flex items-center justify-center rounded-full">
                <Users className="text-blue-500 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Temps moyen</p>
                <h3 className="text-2xl font-bold">28 min</h3>
                <p className="text-xs text-rose-500 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +3min cette période
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-500/10 flex items-center justify-center rounded-full">
                <Clock className="text-orange-500 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chiffre d'affaires</p>
                <h3 className="text-2xl font-bold">425,890 F</h3>
                <p className="text-xs text-emerald-500 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +18% cette période
                </p>
              </div>
              <div className="h-12 w-12 bg-green-500/10 flex items-center justify-center rounded-full">
                <DollarSign className="text-green-500 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="customers">Clients</TabsTrigger>
          <TabsTrigger value="insights">Insights IA</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des ventes par catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Heures de popularité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={popularTimesData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="heure" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="clients" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des commandes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={timeSeriesData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="commandes"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line yAxisId="right" type="monotone" dataKey="chiffre" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Types de clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customerData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {customerData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Statistiques clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Taux de fidélisation</span>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Taux de conversion</span>
                    <span className="text-sm font-medium">28%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Satisfaction client</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Commande moyenne</span>
                    <span className="text-sm font-medium">12,500 F</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="insights" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Insights basés sur l'IA</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {insights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className={cn(
                        "mt-0.5 h-6 w-6 flex items-center justify-center rounded-full text-sm font-medium",
                        "bg-primary/10 text-primary"
                      )}>
                        {index + 1}
                      </div>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recommandations d'optimisation</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className={cn(
                        "mt-0.5 h-6 w-6 flex items-center justify-center rounded-full text-sm font-medium",
                        "bg-blue-500/10 text-blue-500"
                      )}>
                        {index + 1}
                      </div>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6">Générer plus de recommandations</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RestaurantAnalytics;
