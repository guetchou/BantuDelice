import React, { useState, useEffect } from 'react';
import apiClient from '@/integrations/api/client';
import { useToast } from '@/hooks/use-toast';
import { MenuItem } from '@/types/menu';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Search, ChefHat, AlertTriangle, Package, CheckCircle, XCircle } from "lucide-react";

interface MenuAvailabilityManagerProps {
  restaurantId: string;
  isOwner?: boolean;
}

export function MenuAvailabilityManager({ restaurantId, isOwner = true }: MenuAvailabilityManagerProps) {
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [lowStockThreshold] = useState(5);
  const [categories, setCategories] = useState<string[]>([]);
  
  useEffect(() => {
    if (restaurantId) {
      fetchMenuItems();
    }
  }, [restaurantId]);
  
  useEffect(() => {
    filterItems();
  }, [searchQuery, menuItems, selectedCategory]);
  
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const data = await apiClient.restaurants.getMenu(restaurantId);
      
      if (data) {
        setMenuItems(data);
        
        const uniqueCategories = Array.from(
          new Set(data.map((item: MenuItem) => item.category))
        ).filter(Boolean) as string[];
        
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de charger les plats du menu",
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const filterItems = () => {
    let filtered = [...menuItems];
    
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    setFilteredItems(filtered);
  };
  
  const toggleItemAvailability = async (itemId: string, available: boolean) => {
    try {
      setSaving(itemId);
      
      await apiClient.restaurants.updateMenuItemAvailability(itemId, !available);
      
      setMenuItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? { ...item, available: !available } : item
        )
      );
      
      toast({
        title: available ? 'Plat désactivé' : 'Plat activé',
        description: available 
          ? "Le plat n'est plus disponible à la commande" 
          : "Le plat est maintenant disponible à la commande",
      });
    } catch (error) {
      console.error('Error toggling item availability:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de modifier la disponibilité du plat",
        variant: 'destructive'
      });
    } finally {
      setSaving(null);
    }
  };
  
  const updateStockLevel = async (itemId: string, newStock: number) => {
    try {
      setSaving(itemId);
      
      await apiClient.restaurants.updateMenuItemStock(itemId, newStock);
      
      setMenuItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? { 
            ...item, 
            stock_level: newStock,
            available: newStock > 0 
          } : item
        )
      );
      
      toast({
        title: 'Stock mis à jour',
        description: `Le niveau de stock a été mis à jour (${newStock} unités)`,
      });
    } catch (error) {
      console.error('Error updating stock level:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de mettre à jour le niveau de stock",
        variant: 'destructive'
      });
    } finally {
      setSaving(null);
    }
  };

  const getBadgeVariant = (available: boolean) => {
    return available ? "default" : "destructive";
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ChefHat className="mr-2 h-6 w-6" />
            Gestion de la disponibilité du menu
          </CardTitle>
          <CardDescription>
            Gérez la disponibilité et le stock des plats dans votre restaurant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un plat"
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-60">
                <select 
                  className="w-full px-3 py-2 border rounded-md"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {filteredItems.some(item => item.stock_level !== undefined && item.stock_level < lowStockThreshold) && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md flex items-center text-amber-700">
                <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p className="text-sm">
                  {filteredItems.filter(item => item.stock_level !== undefined && item.stock_level < lowStockThreshold).length} plat(s) en stock faible
                </p>
              </div>
            )}
            
            {filteredItems.length === 0 ? (
              <div className="text-center p-8">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun plat trouvé</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Essayez de modifier vos critères de recherche.
                </p>
              </div>
            ) : (
              <div className="border rounded-md divide-y">
                {filteredItems.map((item) => (
                  <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{item.name}</h3>
                        {item.stock_level !== undefined && item.stock_level < lowStockThreshold && (
                          <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50">
                            Stock faible: {item.stock_level}
                          </Badge>
                        )}
                        <Badge variant={getBadgeVariant(item.available)} className="ml-2">
                          {item.available ? 'Disponible' : 'Indisponible'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      <p className="text-sm font-medium mt-1">{(item.price / 100).toLocaleString('fr-FR')} XAF</p>
                    </div>
                    
                    {isOwner && (
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`stock-${item.id}`} className="whitespace-nowrap">
                            Stock:
                          </Label>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                Mettre à jour
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Mettre à jour le stock</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Entrez le nouveau niveau de stock pour {item.name}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <div className="py-4">
                                <Label htmlFor="stock-level" className="mb-2 block">
                                  Niveau de stock
                                </Label>
                                <Input
                                  id="stock-level"
                                  type="number"
                                  min="0"
                                  defaultValue={item.stock_level || 0}
                                  className="w-full"
                                />
                              </div>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => {
                                  const input = document.getElementById("stock-level") as HTMLInputElement;
                                  const newStock = parseInt(input.value);
                                  if (!isNaN(newStock) && newStock >= 0) {
                                    updateStockLevel(item.id, newStock);
                                  }
                                }}>
                                  Mettre à jour
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Switch
                            id={`available-${item.id}`}
                            checked={item.available}
                            onCheckedChange={() => toggleItemAvailability(item.id, item.available)}
                            disabled={saving === item.id}
                          />
                          <Label htmlFor={`available-${item.id}`}>
                            {item.available ? 'Disponible' : 'Indisponible'}
                          </Label>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
