import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Settings,
  Eye,
  EyeOff,
  Edit,
  Save,
  RotateCcw,
  TrendingUp,
  Users,
  Package
} from 'lucide-react';
import { toast } from 'sonner';

// Types
interface AvailabilityItem {
  id: string;
  type: 'restaurant' | 'menu_item';
  name: string;
  is_available: boolean;
  status: 'available' | 'unavailable' | 'limited';
  reason?: string;
  estimated_reopening?: string;
  stock_level?: number;
  opening_hours?: object;
  updated_at: string;
}

interface RestaurantAvailability {
  id: string;
  name: string;
  is_open: boolean;
  status: 'available' | 'unavailable' | 'limited';
  reason?: string;
  estimated_reopening?: string;
  opening_hours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  temporary_schedule?: object;
}

interface MenuItemAvailability {
  id: string;
  name: string;
  restaurant: string;
  is_available: boolean;
  stock_level: number;
  status: 'available' | 'unavailable' | 'limited';
  reason?: string;
}

// Données simulées
const mockRestaurants: RestaurantAvailability[] = [
  {
    id: 'rest1',
    name: 'Restaurant Le Gourmet',
    is_open: true,
    status: 'available',
    opening_hours: {
      monday: { open: '08:00', close: '22:00', closed: false },
      tuesday: { open: '08:00', close: '22:00', closed: false },
      wednesday: { open: '08:00', close: '22:00', closed: false },
      thursday: { open: '08:00', close: '22:00', closed: false },
      friday: { open: '08:00', close: '23:00', closed: false },
      saturday: { open: '09:00', close: '23:00', closed: false },
      sunday: { open: '10:00', close: '21:00', closed: false }
    }
  },
  {
    id: 'rest2',
    name: 'Pizza Express',
    is_open: false,
    status: 'unavailable',
    reason: 'Fermeture temporaire pour rénovation',
    estimated_reopening: '2024-02-15T10:00:00Z',
    opening_hours: {
      monday: { open: '11:00', close: '23:00', closed: false },
      tuesday: { open: '11:00', close: '23:00', closed: false },
      wednesday: { open: '11:00', close: '23:00', closed: false },
      thursday: { open: '11:00', close: '23:00', closed: false },
      friday: { open: '11:00', close: '00:00', closed: false },
      saturday: { open: '11:00', close: '00:00', closed: false },
      sunday: { open: '12:00', close: '22:00', closed: false }
    }
  },
  {
    id: 'rest3',
    name: 'Sushi Bar',
    is_open: true,
    status: 'limited',
    reason: 'Menu limité - personnel réduit',
    opening_hours: {
      monday: { open: '12:00', close: '21:00', closed: false },
      tuesday: { open: '12:00', close: '21:00', closed: false },
      wednesday: { open: '12:00', close: '21:00', closed: false },
      thursday: { open: '12:00', close: '21:00', closed: false },
      friday: { open: '12:00', close: '22:00', closed: false },
      saturday: { open: '12:00', close: '22:00', closed: false },
      sunday: { open: '12:00', close: '20:00', closed: false }
    }
  }
];

const mockMenuItems: MenuItemAvailability[] = [
  {
    id: 'item1',
    name: 'Pizza Margherita',
    restaurant: 'Pizza Express',
    is_available: true,
    stock_level: 15,
    status: 'available'
  },
  {
    id: 'item2',
    name: 'Sushi California Roll',
    restaurant: 'Sushi Bar',
    is_available: true,
    stock_level: 8,
    status: 'limited'
  },
  {
    id: 'item3',
    name: 'Burger Deluxe',
    restaurant: 'Restaurant Le Gourmet',
    is_available: false,
    stock_level: 0,
    status: 'unavailable',
    reason: 'Ingrédients indisponibles'
  }
];

// Composant pour les horaires d'ouverture
const OpeningHoursEditor: React.FC<{ hours: any; onChange: (hours: any) => void }> = ({ hours, onChange }) => {
  const days = [
    { key: 'monday', label: 'Lundi' },
    { key: 'tuesday', label: 'Mardi' },
    { key: 'wednesday', label: 'Mercredi' },
    { key: 'thursday', label: 'Jeudi' },
    { key: 'friday', label: 'Vendredi' },
    { key: 'saturday', label: 'Samedi' },
    { key: 'sunday', label: 'Dimanche' }
  ];

  const updateDay = (dayKey: string, field: string, value: any) => {
    const newHours = { ...hours };
    newHours[dayKey] = { ...newHours[dayKey], [field]: value };
    onChange(newHours);
  };

  return (
    <div className="space-y-4">
      {days.map(({ key, label }) => (
        <div key={key} className="flex items-center space-x-4 p-3 border rounded-lg">
          <div className="w-20 font-medium">{label}</div>
          <Switch
            checked={!hours[key].closed}
            onCheckedChange={(checked) => updateDay(key, 'closed', !checked)}
          />
          {!hours[key].closed && (
            <>
              <Input
                type="time"
                value={hours[key].open}
                onChange={(e) => updateDay(key, 'open', e.target.value)}
                className="w-24"
              />
              <span>-</span>
              <Input
                type="time"
                value={hours[key].close}
                onChange={(e) => updateDay(key, 'close', e.target.value)}
                className="w-24"
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
};

// Composant pour les statistiques
const AvailabilityStats: React.FC = () => {
  const stats = {
    total_restaurants: mockRestaurants.length,
    available_restaurants: mockRestaurants.filter(r => r.is_open).length,
    unavailable_restaurants: mockRestaurants.filter(r => !r.is_open).length,
    total_items: mockMenuItems.length,
    available_items: mockMenuItems.filter(i => i.is_available).length,
    low_stock_items: mockMenuItems.filter(i => i.stock_level < 5).length
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Restaurants</p>
              <p className="text-2xl font-bold">{stats.total_restaurants}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Ouverts</p>
              <p className="text-2xl font-bold">{stats.available_restaurants}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">Articles</p>
              <p className="text-2xl font-bold">{stats.total_items}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <div>
              <p className="text-sm text-gray-600">Stock Faible</p>
              <p className="text-2xl font-bold">{stats.low_stock_items}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function Availability() {
  const [restaurants, setRestaurants] = useState<RestaurantAvailability[]>(mockRestaurants);
  const [menuItems, setMenuItems] = useState<MenuItemAvailability[]>(mockMenuItems);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingRestaurant, setEditingRestaurant] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const updateRestaurantAvailability = (id: string, updates: Partial<RestaurantAvailability>) => {
    setRestaurants(prev => 
      prev.map(rest => 
        rest.id === id ? { ...rest, ...updates } : rest
      )
    );
    toast.success('Disponibilité mise à jour');
  };

  const updateMenuItemAvailability = (id: string, updates: Partial<MenuItemAvailability>) => {
    setMenuItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : rest
      )
    );
    toast.success('Disponibilité mise à jour');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'unavailable':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'limited':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Disponible</Badge>;
      case 'unavailable':
        return <Badge className="bg-red-100 text-red-800">Indisponible</Badge>;
      case 'limited':
        return <Badge className="bg-orange-100 text-orange-800">Limité</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gestion des Disponibilités</h1>
        <p className="text-gray-600">
          Gérez la disponibilité de vos restaurants et articles de menu
        </p>
      </div>

      <AvailabilityStats />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
          <TabsTrigger value="menu-items">Articles</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Restaurants</span>
                </CardTitle>
                <CardDescription>
                  État des restaurants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {restaurants.map((restaurant) => (
                    <div key={restaurant.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(restaurant.status)}
                        <div>
                          <p className="font-medium">{restaurant.name}</p>
                          <p className="text-sm text-gray-500">
                            {restaurant.is_open ? 'Ouvert' : 'Fermé'}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(restaurant.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Articles de Menu</span>
                </CardTitle>
                <CardDescription>
                  État des articles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {menuItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(item.status)}
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            Stock: {item.stock_level}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="restaurants" className="space-y-6">
          <div className="space-y-4">
            {restaurants.map((restaurant) => (
              <Card key={restaurant.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{restaurant.name}</CardTitle>
                      <CardDescription>
                        Dernière mise à jour: {new Date(restaurant.updated_at || Date.now()).toLocaleString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(restaurant.status)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingRestaurant(editingRestaurant === restaurant.id ? null : restaurant.id)}
                      >
                        {editingRestaurant === restaurant.id ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {editingRestaurant === restaurant.id ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Label htmlFor={`status-${restaurant.id}`}>Statut</Label>
                        <Select
                          value={restaurant.status}
                          onValueChange={(value) => updateRestaurantAvailability(restaurant.id, { status: value as any })}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Disponible</SelectItem>
                            <SelectItem value="unavailable">Indisponible</SelectItem>
                            <SelectItem value="limited">Limité</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-4">
                        <Switch
                          checked={restaurant.is_open}
                          onCheckedChange={(checked) => updateRestaurantAvailability(restaurant.id, { is_open: checked })}
                        />
                        <Label>Restaurant ouvert</Label>
                      </div>

                      {restaurant.status !== 'available' && (
                        <div className="space-y-2">
                          <Label>Raison</Label>
                          <Textarea
                            value={restaurant.reason || ''}
                            onChange={(e) => updateRestaurantAvailability(restaurant.id, { reason: e.target.value })}
                            placeholder="Raison de l'indisponibilité..."
                          />
                        </div>
                      )}

                      <div>
                        <Label>Horaires d'ouverture</Label>
                        <OpeningHoursEditor
                          hours={restaurant.opening_hours}
                          onChange={(hours) => updateRestaurantAvailability(restaurant.id, { opening_hours: hours })}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p><strong>Statut:</strong> {restaurant.status}</p>
                      <p><strong>Ouvert:</strong> {restaurant.is_open ? 'Oui' : 'Non'}</p>
                      {restaurant.reason && (
                        <p><strong>Raison:</strong> {restaurant.reason}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="menu-items" className="space-y-6">
          <div className="space-y-4">
            {menuItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{item.name}</CardTitle>
                      <CardDescription>
                        Restaurant: {item.restaurant}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(item.status)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}
                      >
                        {editingItem === item.id ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {editingItem === item.id ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Label htmlFor={`item-status-${item.id}`}>Statut</Label>
                        <Select
                          value={item.status}
                          onValueChange={(value) => updateMenuItemAvailability(item.id, { status: value as any })}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Disponible</SelectItem>
                            <SelectItem value="unavailable">Indisponible</SelectItem>
                            <SelectItem value="limited">Limité</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-4">
                        <Switch
                          checked={item.is_available}
                          onCheckedChange={(checked) => updateMenuItemAvailability(item.id, { is_available: checked })}
                        />
                        <Label>Article disponible</Label>
                      </div>

                      <div className="space-y-2">
                        <Label>Niveau de stock</Label>
                        <Input
                          type="number"
                          value={item.stock_level}
                          onChange={(e) => updateMenuItemAvailability(item.id, { stock_level: parseInt(e.target.value) })}
                          min="0"
                        />
                      </div>

                      {item.status !== 'available' && (
                        <div className="space-y-2">
                          <Label>Raison</Label>
                          <Textarea
                            value={item.reason || ''}
                            onChange={(e) => updateMenuItemAvailability(item.id, { reason: e.target.value })}
                            placeholder="Raison de l'indisponibilité..."
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p><strong>Statut:</strong> {item.status}</p>
                      <p><strong>Disponible:</strong> {item.is_available ? 'Oui' : 'Non'}</p>
                      <p><strong>Stock:</strong> {item.stock_level}</p>
                      {item.reason && (
                        <p><strong>Raison:</strong> {item.reason}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Paramètres de disponibilité</span>
              </CardTitle>
              <CardDescription>
                Configurez les paramètres globaux de disponibilité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Switch id="auto-update" />
                <Label htmlFor="auto-update">Mise à jour automatique</Label>
              </div>
              <div className="flex items-center space-x-4">
                <Switch id="notifications" />
                <Label htmlFor="notifications">Notifications de changement</Label>
              </div>
              <div className="flex items-center space-x-4">
                <Switch id="low-stock-alerts" />
                <Label htmlFor="low-stock-alerts">Alertes de stock faible</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 