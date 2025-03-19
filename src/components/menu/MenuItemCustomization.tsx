
import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoIcon, AlertCircle, Leaf } from "lucide-react";
import { MenuItem } from "@/types/menu";
import { CartItem } from "@/types/cart";

interface MenuItemCustomizationProps {
  item: MenuItem;
  onAddToCart: (item: CartItem) => void;
  onClose: () => void;
  suggestedCombos?: MenuItem[];
}

const MenuItemCustomization = ({ item, onAddToCart, onClose, suggestedCombos = [] }: MenuItemCustomizationProps) => {
  const [selectedCustomizations, setSelectedCustomizations] = useState<{ [category: string]: { [option: string]: boolean } }>({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(item.price);
  const [selectedCombo, setSelectedCombo] = useState<MenuItem | null>(null);

  // Initialize selected customizations
  useEffect(() => {
    if (item.customization_options) {
      const initialCustomizations: { [category: string]: { [option: string]: boolean } } = {};
      Object.keys(item.customization_options).forEach(category => {
        initialCustomizations[category] = {};
        item.customization_options![category].options.forEach((option: any) => {
          initialCustomizations[category][option.name] = false;
        });
      });
      setSelectedCustomizations(initialCustomizations);
    }
  }, [item]);

  // Calculate total price based on selections
  useEffect(() => {
    let calculatedPrice = item.price;
    
    // Add customization costs
    Object.entries(selectedCustomizations).forEach(([category, options]) => {
      Object.entries(options).forEach(([option, isSelected]) => {
        if (isSelected) {
          const optionData = getOptionByName(category, option);
          if (optionData && optionData.price) {
            calculatedPrice += optionData.price;
          }
        }
      });
    });
    
    // Add combo item price (with potential discount)
    if (selectedCombo) {
      const comboDiscount = selectedCombo.price * 0.15; // 15% discount on combo items
      calculatedPrice += (selectedCombo.price - comboDiscount);
    }
    
    // Apply any promotional discounts if available
    if (item.promotional_data?.is_on_promotion) {
      const now = new Date();
      const validFrom = item.promotional_data.valid_from ? new Date(item.promotional_data.valid_from) : null;
      const validTo = item.promotional_data.valid_to ? new Date(item.promotional_data.valid_to) : null;
      
      // Check if promotion is valid now
      const isValidTime = (!validFrom || now >= validFrom) && (!validTo || now <= validTo);
      
      if (isValidTime) {
        // Apply discount
        if (item.promotional_data.discount_type === 'percentage') {
          const discountAmount = calculatedPrice * (item.promotional_data.discount_value / 100);
          calculatedPrice -= discountAmount;
        } else if (item.promotional_data.discount_type === 'fixed_amount') {
          calculatedPrice -= item.promotional_data.discount_value;
        }
      }
    }
    
    // Multiply by quantity
    calculatedPrice *= quantity;
    
    setTotalPrice(calculatedPrice);
  }, [selectedCustomizations, quantity, selectedCombo, item]);

  const toggleCustomization = (category: string, option: string) => {
    setSelectedCustomizations(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [option]: !prev[category]?.[option],
      },
    }));
  };

  const getOptionByName = (category: string, optionName: string) => {
    const categoryOptions = item.customization_options?.[category];
    if (categoryOptions && categoryOptions.options) {
      return categoryOptions.options.find((option: any) => option.name === optionName);
    }
    return null;
  };

  const handleAddToCart = () => {
    const selectedOptions = Object.entries(selectedCustomizations)
      .flatMap(([category, options]) =>
        Object.entries(options)
          .filter(([_, isSelected]) => isSelected)
          .map(([option]) => {
            const optionData = getOptionByName(category, option);
            return {
              name: category,
              value: option,
              price: optionData?.price || 0
            };
          })
      );

    // Create cart item
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      price: totalPrice / quantity, // Store base price with options
      quantity: quantity,
      image_url: item.image_url,
      options: selectedOptions,
      special_instructions: specialInstructions || undefined
    };
    
    // If combo is selected, add both items or adjust the main item
    if (selectedCombo) {
      cartItem.combo_item = {
        id: selectedCombo.id,
        name: selectedCombo.name,
        price: Math.round(selectedCombo.price * 0.85), // 15% discount
        quantity: quantity
      };
    }
    
    onAddToCart(cartItem);
    onClose();
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex justify-between items-center">
            <span>{item.name}</span>
            {item.promotional_data?.is_on_promotion && (
              <Badge variant="destructive" className="ml-2">
                {item.promotional_data.discount_type === 'percentage' 
                  ? `-${item.promotional_data.discount_value}%` 
                  : `-${item.promotional_data.discount_value} XAF`}
              </Badge>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {item.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <Tabs defaultValue="customize" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="customize">Personnalisation</TabsTrigger>
            <TabsTrigger value="combo">Combo & Extras</TabsTrigger>
            <TabsTrigger value="nutrition">
              Nutrition & Allergènes
              {item.allergens && item.allergens.length > 0 && (
                <AlertCircle className="w-4 h-4 ml-2 text-amber-500" />
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="customize" className="space-y-4">
            <ScrollArea className="h-[320px]">
              <div className="space-y-6">
                {item.customization_options && Object.entries(item.customization_options).length > 0 ? (
                  Object.entries(item.customization_options).map(([category, options]: [string, any]) => (
                    <div key={category} className="space-y-3">
                      <h3 className="text-lg font-semibold">{category}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {options.options.map((option: any) => (
                          <div key={option.name} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                            <input
                              type="checkbox"
                              id={`${category}-${option.name}`}
                              className="h-4 w-4 border-gray-300 rounded"
                              checked={selectedCustomizations[category]?.[option.name] || false}
                              onChange={() => toggleCustomization(category, option.name)}
                            />
                            <Label htmlFor={`${category}-${option.name}`} className="flex-1 cursor-pointer">
                              {option.name}
                            </Label>
                            {option.price > 0 && (
                              <span className="text-sm font-medium text-gray-500">
                                +{option.price.toLocaleString('fr-FR')} XAF
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4">
                    <p className="text-sm text-gray-500">
                      Aucune option de personnalisation disponible pour ce plat.
                    </p>
                  </div>
                )}
              
                <div className="space-y-2">
                  <Label htmlFor="specialInstructions">Instructions spéciales</Label>
                  <Input
                    id="specialInstructions"
                    placeholder="Ajoutez des instructions spéciales..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                  />
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="combo" className="space-y-4">
            <ScrollArea className="h-[320px]">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Suggestions de combos</h3>
                  {suggestedCombos.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {suggestedCombos.map(comboItem => (
                        <div 
                          key={comboItem.id} 
                          className={`border rounded-lg p-3 flex items-center justify-between cursor-pointer transition-colors ${
                            selectedCombo?.id === comboItem.id ? 'bg-green-50 border-green-500' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedCombo(selectedCombo?.id === comboItem.id ? null : comboItem)}
                        >
                          <div className="flex items-center">
                            <div>
                              <h4 className="font-medium">{comboItem.name}</h4>
                              <p className="text-sm text-gray-500">{comboItem.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {(comboItem.price * 0.85).toLocaleString('fr-FR')} XAF
                            </div>
                            <div className="text-xs text-gray-500 line-through">
                              {comboItem.price.toLocaleString('fr-FR')} XAF
                            </div>
                            <Badge variant="outline" className="mt-1">15% off</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-sm text-gray-500">
                        Aucune suggestion de combo disponible pour ce plat.
                      </p>
                    </div>
                  )}
                </div>
                
                {item.is_combo && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Contenu du menu</h3>
                    <div className="border rounded-lg p-4">
                      <p className="font-medium mb-2">Ce menu comprend:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {item.combo_items?.map((comboItemId, index) => (
                          <li key={index} className="text-sm">
                            {comboItemId} {/* Idéalement, on récupérerait le nom de l'item à partir de son ID */}
                          </li>
                        ))}
                      </ul>
                      {item.combo_discount && (
                        <p className="text-sm text-green-600 mt-2">
                          Économisez {item.combo_discount}% par rapport aux articles achetés séparément
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="nutrition" className="space-y-4">
            <ScrollArea className="h-[320px]">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Information nutritionnelle</h3>
                  {item.nutritional_info ? (
                    <div className="space-y-2">
                      {item.nutritional_info.calories !== undefined && (
                        <div className="flex justify-between py-1 border-b border-gray-100">
                          <span>Calories</span>
                          <span className="font-medium">{item.nutritional_info.calories} kcal</span>
                        </div>
                      )}
                      {item.nutritional_info.protein !== undefined && (
                        <div className="flex justify-between py-1 border-b border-gray-100">
                          <span>Protéines</span>
                          <span className="font-medium">{item.nutritional_info.protein} g</span>
                        </div>
                      )}
                      {item.nutritional_info.carbs !== undefined && (
                        <div className="flex justify-between py-1 border-b border-gray-100">
                          <span>Glucides</span>
                          <span className="font-medium">{item.nutritional_info.carbs} g</span>
                        </div>
                      )}
                      {item.nutritional_info.fat !== undefined && (
                        <div className="flex justify-between py-1 border-b border-gray-100">
                          <span>Lipides</span>
                          <span className="font-medium">{item.nutritional_info.fat} g</span>
                        </div>
                      )}
                      {item.nutritional_info.fiber !== undefined && (
                        <div className="flex justify-between py-1 border-b border-gray-100">
                          <span>Fibres</span>
                          <span className="font-medium">{item.nutritional_info.fiber} g</span>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        *Les valeurs nutritionnelles sont données à titre indicatif
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Les informations nutritionnelles ne sont pas disponibles pour ce plat
                    </p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Allergènes</h3>
                  {item.allergens && item.allergens.length > 0 ? (
                    <div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {item.allergens.map((allergen, index) => (
                          <Badge key={index} variant="outline" className="bg-amber-50">
                            {allergen}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2 flex items-start">
                        <InfoIcon className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
                        Si vous êtes allergique à l'un de ces ingrédients, veuillez nous en informer dans les instructions spéciales
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Aucun allergène connu pour ce plat
                    </p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Ingrédients</h3>
                  {item.ingredients && item.ingredients.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {item.ingredients.map((ingredient, index) => (
                        <li key={index} className="text-sm">{ingredient}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      La liste des ingrédients n'est pas disponible pour ce plat
                    </p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Régimes alimentaires</h3>
                  {item.dietary_preferences && item.dietary_preferences.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {item.dietary_preferences.map((pref, index) => (
                        <Badge key={index} variant="outline" className="bg-green-50 flex items-center gap-1">
                          <Leaf className="h-3 w-3" />
                          {pref}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Aucune préférence alimentaire spécifique pour ce plat
                    </p>
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="icon"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <span>{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={incrementQuantity}
            >
              +
            </Button>
          </div>
          
          <div className="text-right">
            <div className="text-xl font-semibold">
              {totalPrice.toLocaleString('fr-FR')} XAF
            </div>
            {selectedCombo && (
              <div className="text-sm text-green-600">
                Économie: {(quantity * selectedCombo.price * 0.15).toLocaleString('fr-FR')} XAF
              </div>
            )}
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleAddToCart} className="bg-green-600 hover:bg-green-700">
            Ajouter au panier
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MenuItemCustomization;
