
import React, { useState, useEffect } from 'react';
import apiClient from '@/integrations/api/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Ban, Package, Utensils, CircleCheck, Filter, MoreVertical, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MenuItem } from '@/types/menu';

interface MenuItemAvailabilityManagerProps {
  restaurantId: string;
  isOwner?: boolean;
}

export function MenuItemAvailabilityManager({ restaurantId, isOwner = true }: MenuItemAvailabilityManagerProps) {
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [editingStockItem, setEditingStockItem] = useState<string | null>(null);
  const [stockValue, setStockValue] = useState<number>(0);
  
  useEffect(() => {
    if (restaurantId) {
      fetchMenuItems();
    }
  }, [restaurantId]);
  
  useEffect(() => {
    applyFilters();
  }, [menuItems, searchQuery, filter]);
  
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      
      const data = await apiClient.restaurants.getMenu(restaurantId);
      
      if (data) {
        setMenuItems(data);
        setFilteredItems(data);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de charger les éléments du menu",
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const applyFilters = () => {
    let items = [...menuItems];
    
    // Apply search filter
    if (searchQuery) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply availability filter
    if (filter === 'available') {
      items = items.filter(item => item.available);
    } else if (filter === 'unavailable') {
      items = items.filter(item => !item.available);
    }
    
    setFilteredItems(items);
  };
  
  const updateItemAvailability = async (itemId: string, available: boolean) => {
    if (!isOwner) return;
    
    try {
      setUpdating(itemId);
      
      await apiClient.restaurants.updateMenuItemAvailability(itemId, available);
      
      // Update local state
      setMenuItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? { ...item, available } : item
        )
      );
      
      toast({
        title: available ? 'Article disponible' : 'Article indisponible',
        description: available 
          ? "L'article est maintenant disponible à la commande" 
          : "L'article n'est plus disponible à la commande",
      });
    } catch (error) {
      console.error('Error updating item availability:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de mettre à jour la disponibilité de l'article",
        variant: 'destructive'
      });
    } finally {
      setUpdating(null);
    }
  };
  
  const updateItemStock = async (itemId: string, stockLevel: number) => {
    if (!isOwner || stockLevel < 0) return;
    
    try {
      setUpdating(itemId);
      
      await apiClient.restaurants.updateMenuItemStock(itemId, stockLevel);
      
      // Update local state
      setMenuItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? { 
            ...item, 
            stock_level: stockLevel,
            available: stockLevel > 0 
          } : item
        )
      );
      
      // Reset editing state
      setEditingStockItem(null);
      
      toast({
        title: 'Stock mis à jour',
        description: stockLevel > 0 
          ? `Stock mis à jour à ${stockLevel} unités` 
          : "Stock épuisé, l'article a été marqué comme indisponible",
      });
    } catch (error) {
      console.error('Error updating item stock:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de mettre à jour le stock de l'article",
        variant: 'destructive'
      });
    } finally {
      setUpdating(null);
    }
  };
  
  const refreshData = () => {
    fetchMenuItems();
    toast({
      title: 'Rafraîchissement',
      description: "Mise à jour des données en cours...",
    });
  };
  
  const getStockBadge = (item: MenuItem) => {
    const stockLevel = item.stock_level || 0;
    
    if (!item.available) {
      return (
        <Badge variant="destructive" className="ml-2">
          Indisponible
        </Badge>
      );
    }
    
    if (stockLevel <= 5) {
      return (
        <Badge variant="destructive" className="ml-2">
          Stock faible : {stockLevel}
        </Badge>
      );
    }
    
    if (stockLevel <= 10) {
      return (
        <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Stock : {stockLevel}
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
        Stock : {stockLevel}
      </Badge>
    );
  };
  
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Package className="mr-2 h-6 w-6" />
            <div>
              <CardTitle>Gestion des stocks</CardTitle>
              <CardDescription>
                Gérez la disponibilité des articles et les niveaux de stock
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={refreshData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtrer
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Disponibilité</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setFilter('all')}>
                  Tous les articles
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('available')}>
                  Disponibles seulement
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('unavailable')}>
                  Indisponibles seulement
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <Separator />
          
          {filteredItems.length === 0 ? (
            <div className="text-center p-8 border rounded-md">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun article trouvé</h3>
              <p className="mt-1 text-sm text-gray-500">
                Aucun article ne correspond à vos critères de recherche.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="border rounded-md p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Utensils className="h-5 w-5 mr-2 text-gray-500" />
                        <h3 className="font-medium">{item.name}</h3>
                        {getStockBadge(item)}
                      </div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{item.description}</p>
                      <p className="text-sm font-medium mt-1">{item.price.toFixed(2)} €</p>
                    </div>
                    
                    {isOwner && (
                      <>
                        {editingStockItem === item.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              value={stockValue}
                              onChange={(e) => setStockValue(parseInt(e.target.value) || 0)}
                              className="w-20"
                            />
                            <Button 
                              size="sm" 
                              onClick={() => updateItemStock(item.id, stockValue)}
                              disabled={updating === item.id}
                            >
                              {updating === item.id ? (
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                              ) : (
                                "Sauvegarder"
                              )}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => setEditingStockItem(null)}
                            >
                              Annuler
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Switch
                              id={`available-${item.id}`}
                              checked={item.available}
                              onCheckedChange={(checked) => updateItemAvailability(item.id, checked)}
                              disabled={updating === item.id}
                            />
                            <Label htmlFor={`available-${item.id}`} className="cursor-pointer">
                              {item.available ? 'Disponible' : 'Indisponible'}
                            </Label>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
                                  setEditingStockItem(item.id);
                                  setStockValue(item.stock_level || 0);
                                }}>
                                  Modifier le stock
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateItemStock(item.id, 0)}>
                                  Marquer comme épuisé
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
