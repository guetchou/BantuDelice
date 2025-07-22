import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Clock,
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
  Package,
  MapPin,
  Star,
  Filter,
  Search
} from 'lucide-react';
import { toast } from 'sonner';

// Types
interface AvailabilityItem {
  id: string;
  type: 'restaurant' | 'menu_item' | 'service';
  name: string;
  category: string;
  is_available: boolean;
  status: 'available' | 'unavailable' | 'limited';
  reason?: string;
  estimated_reopening?: string;
  stock_level?: number;
  opening_hours?: object;
  updated_at: string;
  location: string;
  rating?: number;
  price?: number;
}

interface AvailabilityFilter {
  type: string;
  status: string;
  category: string;
  location: string;
}

// Données simulées
const mockAvailabilityItems: AvailabilityItem[] = [
  {
    id: 'rest1',
    type: 'restaurant',
    name: 'Restaurant Le Gourmet',
    category: 'restaurant',
    is_available: true,
    status: 'available',
    location: 'Brazzaville Centre',
    rating: 4.8,
    price: 15000,
    updated_at: new Date().toISOString()
  },
  {
    id: 'item1',
    type: 'menu_item',
    name: 'Pizza Margherita',
    category: 'pizza',
    is_available: true,
    status: 'available',
    stock_level: 15,
    location: 'Pizza Express',
    price: 8000,
    updated_at: new Date().toISOString()
  },
  {
    id: 'service1',
    type: 'service',
    name: 'Service Plomberie',
    category: 'plomberie',
    is_available: true,
    status: 'available',
    location: 'Brazzaville',
    rating: 4.9,
    price: 5000,
    updated_at: new Date().toISOString()
  }
];

// Composant pour afficher un élément de disponibilité
const AvailabilityItemCard: React.FC<{
  item: AvailabilityItem;
  onUpdate: (id: string, updates: Partial<AvailabilityItem>) => void;
  onToggle: (id: string) => void;
}> = ({ item, onUpdate, onToggle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    status: item.status,
    reason: item.reason || '',
    stock_level: item.stock_level || 0
  });

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

  const handleSave = () => {
    onUpdate(item.id, editData);
    setIsEditing(false);
    toast.success('Disponibilité mise à jour');
  };

  const handleCancel = () => {
    setEditData({
      status: item.status,
      reason: item.reason || '',
      stock_level: item.stock_level || 0
    });
    setIsEditing(false);
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon(item.status)}
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold">{item.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {item.type}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">{item.location}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(item.status)}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select
                value={editData.status}
                onValueChange={(value) => setEditData({ ...editData, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="unavailable">Indisponible</SelectItem>
                  <SelectItem value="limited">Limité</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {editData.status !== 'available' && (
              <div className="space-y-2">
                <Label>Raison</Label>
                <Textarea
                  value={editData.reason}
                  onChange={(e) => setEditData({ ...editData, reason: e.target.value })}
                  placeholder="Raison de l'indisponibilité..."
                />
              </div>
            )}

            {item.type === 'menu_item' && (
              <div className="space-y-2">
                <Label>Niveau de stock</Label>
                <Input
                  type="number"
                  value={editData.stock_level}
                  onChange={(e) => setEditData({ ...editData, stock_level: parseInt(e.target.value) })}
                  min="0"
                />
              </div>
            )}

            <div className="flex space-x-2">
              <Button onClick={handleSave} size="sm">
                Sauvegarder
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                Annuler
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Disponible:</span>
              <Switch
                checked={item.is_available}
                onCheckedChange={() => onToggle(item.id)}
              />
            </div>
            {item.reason && (
              <p className="text-sm text-gray-600">
                <strong>Raison:</strong> {item.reason}
              </p>
            )}
            {item.stock_level !== undefined && (
              <p className="text-sm text-gray-600">
                <strong>Stock:</strong> {item.stock_level}
              </p>
            )}
            {item.rating && (
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm">{item.rating}</span>
              </div>
            )}
            {item.price && (
              <p className="text-sm font-medium text-green-600">
                {item.price.toLocaleString()} FCFA
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Composant pour les filtres
const AvailabilityFilters: React.FC<{
  filters: AvailabilityFilter;
  onFilterChange: (filters: AvailabilityFilter) => void;
}> = ({ filters, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Type</Label>
        <Select
          value={filters.type}
          onValueChange={(value) => onFilterChange({ ...filters, type: value })}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous</SelectItem>
            <SelectItem value="restaurant">Restaurants</SelectItem>
            <SelectItem value="menu_item">Articles</SelectItem>
            <SelectItem value="service">Services</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Statut</Label>
        <Select
          value={filters.status}
          onValueChange={(value) => onFilterChange({ ...filters, status: value })}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous</SelectItem>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="unavailable">Indisponible</SelectItem>
            <SelectItem value="limited">Limité</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Catégorie</Label>
        <Select
          value={filters.category}
          onValueChange={(value) => onFilterChange({ ...filters, category: value })}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes</SelectItem>
            <SelectItem value="restaurant">Restaurants</SelectItem>
            <SelectItem value="pizza">Pizza</SelectItem>
            <SelectItem value="plomberie">Plomberie</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Localisation</Label>
        <Input
          placeholder="Rechercher..."
          value={filters.location}
          onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
          className="w-32"
        />
      </div>
    </div>
  );
};

// Composant principal
export default function AvailabilityManager() {
  const [items, setItems] = useState<AvailabilityItem[]>(mockAvailabilityItems);
  const [filters, setFilters] = useState<AvailabilityFilter>({
    type: '',
    status: '',
    category: '',
    location: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const filteredItems = items.filter(item => {
    const matchesType = !filters.type || item.type === filters.type;
    const matchesStatus = !filters.status || item.status === filters.status;
    const matchesCategory = !filters.category || item.category === filters.category;
    const matchesLocation = !filters.location || 
      item.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesStatus && matchesCategory && matchesLocation && matchesSearch;
  });

  const updateItem = (id: string, updates: Partial<AvailabilityItem>) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
      )
    );
  };

  const toggleAvailability = (id: string) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { 
          ...item, 
          is_available: !item.is_available,
          status: !item.is_available ? 'available' : 'unavailable',
          updated_at: new Date().toISOString()
        } : item
      )
    );
  };

  const stats = {
    total: items.length,
    available: items.filter(item => item.is_available).length,
    unavailable: items.filter(item => !item.is_available).length,
    restaurants: items.filter(item => item.type === 'restaurant').length,
    menuItems: items.filter(item => item.type === 'menu_item').length,
    services: items.filter(item => item.type === 'service').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Disponibilités</h2>
          <p className="text-gray-600">Gérez la disponibilité de tous vos services</p>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Paramètres
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Disponibles</p>
                <p className="text-2xl font-bold">{stats.available}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Indisponibles</p>
                <p className="text-2xl font-bold">{stats.unavailable}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Restaurants</p>
                <p className="text-2xl font-bold">{stats.restaurants}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="management">Gestion</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <AvailabilityFilters filters={filters} onFilterChange={setFilters} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <AvailabilityItemCard
                key={item.id}
                item={item}
                onUpdate={updateItem}
                onToggle={toggleAvailability}
              />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Aucun élément trouvé</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions en masse</CardTitle>
              <CardDescription>
                Modifiez plusieurs éléments à la fois
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Button variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Marquer comme disponible
                </Button>
                <Button variant="outline">
                  <XCircle className="h-4 w-4 mr-2" />
                  Marquer comme indisponible
                </Button>
                <Button variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Réinitialiser
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics de disponibilité</CardTitle>
              <CardDescription>
                Statistiques et tendances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Analytics en cours de développement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 