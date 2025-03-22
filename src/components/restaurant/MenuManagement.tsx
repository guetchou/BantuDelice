
import React, { useState, useEffect } from 'react';
import { useRestaurantData } from '@/hooks/useRestaurantData';
import { 
  Card, CardContent, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Search, Plus, Edit, Trash2, ChefHat, Filter, SlidersHorizontal, 
  ArrowUpDown, Tag, Clock, AlertCircle, FileSpreadsheet, Copy, Image
} from "lucide-react";
import { MenuItem } from '@/types/restaurant';
import { useForm } from 'react-hook-form';

interface MenuManagementProps {
  restaurantId: string;
}

interface MenuItemFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  preparation_time?: number;
  ingredients?: string;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  is_spicy?: boolean;
  allergens?: string;
}

const MenuManagement: React.FC<MenuManagementProps> = ({ restaurantId }) => {
  const { useMenuItems, useCreateMenuItem, useUpdateMenuItem, useDeleteMenuItem } = useRestaurantData();
  const { data: menuItems = [], isLoading, error } = useMenuItems(restaurantId);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'category'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [filters, setFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    spicy: false
  });

  const createMenuItem = useCreateMenuItem();
  const updateMenuItem = useUpdateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<MenuItemFormData>();
  
  // Get unique categories from menu items
  const categories = React.useMemo(() => {
    const uniqueCategories = Array.from(new Set(menuItems.map(item => item.category)));
    return ['all', ...uniqueCategories];
  }, [menuItems]);
  
  // Filter and sort menu items
  const filteredItems = React.useMemo(() => {
    let result = [...menuItems];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    // Apply dietary filters
    if (filters.vegetarian) {
      result = result.filter(item => item.is_vegetarian);
    }
    if (filters.vegan) {
      result = result.filter(item => item.is_vegan);
    }
    if (filters.glutenFree) {
      result = result.filter(item => item.is_gluten_free);
    }
    if (filters.spicy) {
      result = result.filter(item => item.is_spicy);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'price') {
        return sortOrder === 'asc' 
          ? a.price - b.price 
          : b.price - a.price;
      } else if (sortBy === 'category') {
        return sortOrder === 'asc' 
          ? a.category.localeCompare(b.category) 
          : b.category.localeCompare(a.category);
      }
      return 0;
    });
    
    return result;
  }, [menuItems, searchQuery, selectedCategory, sortBy, sortOrder, filters]);
  
  // Reset form when dialog closes
  useEffect(() => {
    if (!isDialogOpen) {
      reset();
      setEditingItem(null);
    }
  }, [isDialogOpen, reset]);
  
  // Set form values when editing an item
  useEffect(() => {
    if (editingItem && isDialogOpen) {
      setValue('name', editingItem.name);
      setValue('description', editingItem.description);
      setValue('price', editingItem.price);
      setValue('category', editingItem.category);
      setValue('available', editingItem.available);
      setValue('preparation_time', editingItem.preparation_time);
      setValue('ingredients', editingItem.ingredients?.join(', '));
      setValue('is_vegetarian', editingItem.is_vegetarian);
      setValue('is_vegan', editingItem.is_vegan);
      setValue('is_gluten_free', editingItem.is_gluten_free);
      setValue('is_spicy', editingItem.is_spicy);
      setValue('allergens', editingItem.allergens?.join(', '));
    }
  }, [editingItem, isDialogOpen, setValue]);
  
  // Handle form submission
  const onSubmit = async (data: MenuItemFormData) => {
    try {
      const menuItemData = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        category: data.category,
        available: data.available,
        restaurant_id: restaurantId,
        preparation_time: data.preparation_time,
        ingredients: data.ingredients ? data.ingredients.split(',').map(i => i.trim()) : [],
        is_vegetarian: !!data.is_vegetarian,
        is_vegan: !!data.is_vegan,
        is_gluten_free: !!data.is_gluten_free,
        is_spicy: !!data.is_spicy,
        allergens: data.allergens ? data.allergens.split(',').map(a => a.trim()) : []
      };
      
      if (editingItem) {
        await updateMenuItem.mutateAsync({
          id: editingItem.id,
          data: menuItemData
        });
        toast.success("Menu item updated successfully");
      } else {
        await createMenuItem.mutateAsync({
          menuItem: menuItemData
        });
        toast.success("Menu item created successfully");
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving menu item:", error);
      toast.error("Error saving menu item");
    }
  };
  
  // Handle item deletion
  const handleDeleteItem = async () => {
    if (itemToDelete) {
      try {
        await deleteMenuItem.mutateAsync(itemToDelete.id);
        toast.success("Menu item deleted successfully");
        setShowDeleteConfirm(false);
        setItemToDelete(null);
      } catch (error) {
        console.error("Error deleting menu item:", error);
        toast.error("Error deleting menu item");
      }
    }
  };
  
  // Handle duplicate item
  const handleDuplicateItem = (item: MenuItem) => {
    const newItem = { ...item, name: `${item.name} (Copie)` };
    delete (newItem as any).id;
    delete (newItem as any).created_at;
    
    createMenuItem.mutate({
      menuItem: newItem
    });
  };
  
  // Bulk import items
  const handleBulkImport = () => {
    // Open file dialog and read CSV/Excel file
    // For demo purposes, we'll just show a toast
    toast.success("Bulk import functionality would be implemented here");
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium">Error loading menu items</h3>
          <p className="text-sm text-gray-500">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold">Gestion du Menu</h2>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
          
          <Button
            variant="outline"
            onClick={handleBulkImport}
            className="flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Import
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un plat
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'Modifier un plat' : 'Ajouter un nouveau plat'}
                </DialogTitle>
                <DialogDescription>
                  Remplissez les détails du plat ci-dessous
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="basic">Informations</TabsTrigger>
                    <TabsTrigger value="details">Détails</TabsTrigger>
                    <TabsTrigger value="dietary">Diététique</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom du plat</Label>
                      <Input 
                        id="name" 
                        {...register('name', { required: 'Le nom est requis' })} 
                      />
                      {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        {...register('description', { required: 'La description est requise' })} 
                      />
                      {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Prix (FCFA)</Label>
                        <Input 
                          id="price" 
                          type="number" 
                          {...register('price', { 
                            required: 'Le prix est requis',
                            min: { value: 0, message: 'Le prix doit être positif' } 
                          })} 
                        />
                        {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Catégorie</Label>
                        <Select 
                          onValueChange={(value) => setValue('category', value)} 
                          defaultValue={editingItem?.category}
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories
                              .filter(cat => cat !== 'all')
                              .map(category => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))
                            }
                            <SelectItem value="other">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="available" 
                        checked={editingItem?.available} 
                        onCheckedChange={(checked) => setValue('available', checked)}
                        {...register('available')} 
                      />
                      <Label htmlFor="available">Disponible</Label>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="details" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="preparation_time">Temps de préparation (minutes)</Label>
                      <Input 
                        id="preparation_time" 
                        type="number" 
                        {...register('preparation_time', { 
                          min: { value: 1, message: 'Le temps doit être d\'au moins 1 minute' } 
                        })} 
                      />
                      {errors.preparation_time && (
                        <p className="text-sm text-red-500">{errors.preparation_time.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ingredients">Ingrédients (séparés par une virgule)</Label>
                      <Textarea 
                        id="ingredients" 
                        {...register('ingredients')} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="allergens">Allergènes (séparés par une virgule)</Label>
                      <Textarea 
                        id="allergens" 
                        {...register('allergens')} 
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="dietary" className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="is_vegetarian" 
                        checked={editingItem?.is_vegetarian}
                        onCheckedChange={(checked) => setValue('is_vegetarian', checked)}
                        {...register('is_vegetarian')} 
                      />
                      <Label htmlFor="is_vegetarian">Végétarien</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="is_vegan" 
                        checked={editingItem?.is_vegan}
                        onCheckedChange={(checked) => setValue('is_vegan', checked)}
                        {...register('is_vegan')} 
                      />
                      <Label htmlFor="is_vegan">Végan</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="is_gluten_free" 
                        checked={editingItem?.is_gluten_free}
                        onCheckedChange={(checked) => setValue('is_gluten_free', checked)}
                        {...register('is_gluten_free')} 
                      />
                      <Label htmlFor="is_gluten_free">Sans gluten</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="is_spicy" 
                        checked={editingItem?.is_spicy}
                        onCheckedChange={(checked) => setValue('is_spicy', checked)}
                        {...register('is_spicy')} 
                      />
                      <Label htmlFor="is_spicy">Épicé</Label>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit">
                    {editingItem ? 'Mettre à jour' : 'Créer'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {showFilters && (
        <Card className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un plat..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'Toutes les catégories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <Select
                value={sortBy}
                onValueChange={(value: 'name' | 'price' | 'category') => setSortBy(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nom</SelectItem>
                  <SelectItem value="price">Prix</SelectItem>
                  <SelectItem value="category">Catégorie</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <ArrowUpDown className={`h-4 w-4 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`} />
            </Button>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <Switch 
                id="filter-vegetarian" 
                checked={filters.vegetarian}
                onCheckedChange={(checked) => setFilters({...filters, vegetarian: checked})}
              />
              <Label htmlFor="filter-vegetarian">Végétarien</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="filter-vegan" 
                checked={filters.vegan}
                onCheckedChange={(checked) => setFilters({...filters, vegan: checked})}
              />
              <Label htmlFor="filter-vegan">Végan</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="filter-glutenFree" 
                checked={filters.glutenFree}
                onCheckedChange={(checked) => setFilters({...filters, glutenFree: checked})}
              />
              <Label htmlFor="filter-glutenFree">Sans gluten</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="filter-spicy" 
                checked={filters.spicy}
                onCheckedChange={(checked) => setFilters({...filters, spicy: checked})}
              />
              <Label htmlFor="filter-spicy">Épicé</Label>
            </div>
          </div>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            {item.image_url ? (
              <div className="h-40 relative">
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={item.available ? "default" : "destructive"}>
                    {item.available ? 'Disponible' : 'Non disponible'}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="h-40 bg-gray-100 flex items-center justify-center relative">
                <Image className="h-16 w-16 text-gray-300" />
                <div className="absolute top-2 right-2">
                  <Badge variant={item.available ? "default" : "destructive"}>
                    {item.available ? 'Disponible' : 'Non disponible'}
                  </Badge>
                </div>
              </div>
            )}
            
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{item.name}</CardTitle>
                <div className="font-bold">{item.price.toLocaleString()} FCFA</div>
              </div>
            </CardHeader>
            
            <CardContent className="pb-0">
              <p className="text-gray-500 text-sm line-clamp-2 mb-2">{item.description}</p>
              
              <div className="flex flex-wrap gap-1 mt-2">
                <Badge variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {item.category}
                </Badge>
                
                {item.preparation_time && (
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {item.preparation_time} min
                  </Badge>
                )}
                
                {item.is_vegetarian && (
                  <Badge variant="outline" className="text-xs bg-green-50">
                    Végétarien
                  </Badge>
                )}
                
                {item.is_vegan && (
                  <Badge variant="outline" className="text-xs bg-green-50">
                    Végan
                  </Badge>
                )}
                
                {item.is_gluten_free && (
                  <Badge variant="outline" className="text-xs bg-yellow-50">
                    Sans gluten
                  </Badge>
                )}
                
                {item.is_spicy && (
                  <Badge variant="outline" className="text-xs bg-red-50">
                    Épicé
                  </Badge>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between gap-2 pt-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingItem(item);
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDuplicateItem(item)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setItemToDelete(item);
                  setShowDeleteConfirm(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        {filteredItems.length === 0 && (
          <div className="col-span-full flex justify-center items-center h-64">
            <div className="text-center">
              <ChefHat className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium">Aucun plat trouvé</h3>
              <p className="text-sm text-gray-500">Essayez de modifier vos filtres ou d'ajouter un nouveau plat</p>
            </div>
          </div>
        )}
      </div>
      
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer "{itemToDelete?.name}" ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuManagement;
