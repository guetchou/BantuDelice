
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';

// Types pour les données
interface OrderAnalyticsProps {
  restaurantId: string;
  dailyOrders: {
    day: string;
    count: number;
    revenue: number;
  }[];
  categoryData: {
    name: string;
    value: number;
  }[];
  topProducts: {
    name: string;
    count: number;
  }[];
}

// Couleurs pour les graphiques
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A267AC'];

const OrderAnalytics: React.FC<OrderAnalyticsProps> = ({
  restaurantId,
  dailyOrders,
  categoryData,
  topProducts
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Analyse des commandes</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="orders">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="orders" className="flex-1">Commandes</TabsTrigger>
            <TabsTrigger value="revenue" className="flex-1">Chiffre d'affaires</TabsTrigger>
            <TabsTrigger value="categories" className="flex-1">Catégories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} commandes`, 'Commandes']}
                  labelFormatter={(label) => `Jour: ${label}`}
                />
                <Bar dataKey="count" fill="#8884d8" name="Commandes" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="revenue" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${(Number(value)/100).toFixed(2)} FCFA `, 'Chiffre d\'affaires']}
                  labelFormatter={(label) => `Jour: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#82ca9d" 
                  name="Chiffre d'affaires"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="categories" className="h-80">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} commandes`, 'Commandes']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Produits les plus vendus</h3>
                <div className="space-y-2">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{product.name}</span>
                      <div className="flex items-center">
                        <div 
                          className="h-2 mr-2" 
                          style={{ 
                            width: `${(product.count / Math.max(...topProducts.map(p => p.count)) * 100)}px`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        />
                        <span className="text-sm font-medium">{product.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OrderAnalytics;
