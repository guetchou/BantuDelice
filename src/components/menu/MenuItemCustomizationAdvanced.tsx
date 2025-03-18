
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { MenuItem } from "@/types/menu";
import { CartItem } from "@/types/cart";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Info, AlertCircle, CheckCircle2 } from "lucide-react"

interface MenuItemCustomizationAdvancedProps {
  item: MenuItem;
  onAddToCart: (item: CartItem) => void;
  onClose: () => void;
  recommendedItems?: MenuItem[];
}

interface NutritionalInfo {
  label: string;
  value: number | null;
  unit: string;
}

const MenuItemCustomizationAdvanced = ({ 
  item, 
  onAddToCart, 
  onClose,
  recommendedItems = []
}: MenuItemCustomizationAdvancedProps) => {
  const [selectedCustomizations, setSelectedCustomizations] = useState<{ [category: string]: { [option: string]: boolean } }>({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(item.price);
  const [selectedCombo, setSelectedCombo] = useState<MenuItem | null>(null);
  const [showNutritionalInfo, setShowNutritionalInfo] = useState(false);
  
  // Extract the nutritional information if it exists
  const nutritionalInfo: NutritionalInfo[] = item.nutritional_info ? [
    { label: 'Calories', value: item.nutritional_info.calories, unit: 'kcal' },
    { label: 'Protéines', value: item.nutritional_info.protein, unit: 'g' },
    { label: 'Glucides', value: item.nutritional_info.carbs, unit: 'g' },
    { label: 'Lipides', value: item.nutritional_info.fat, unit: 'g' },
    { label: 'Fibres', value: item.nutritional_info.fiber, unit: 'g' }
  ] : [];

  useEffect(() => {
    // Initialize selectedCustomizations based on item.customization_options
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

  useEffect(() => {
    // Calculate total price based on base price, customizations, and combos
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
      // Apply a 15% discount on the combo item
      calculatedPrice += selectedCombo.price * 0.85;
    }
    
    // Multiply by quantity
    calculatedPrice *= quantity;
    
    setTotalPrice(calculatedPrice);
  }, [selectedCustomizations, quantity, selectedCombo]);

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
      ...item,
      options: selectedOptions,
      quantity: quantity,
    };
    
    // Add special instructions if provided
    if (specialInstructions && specialInstructions.trim() !== '') {
      cartItem.special_instructions = specialInstructions;
    }

    // If combo is selected, add both items or adjust the main item
    if (selectedCombo) {
      // Option 1: Add the combo as a separate property of the cart item
      cartItem.combo_item = {
        id: selectedCombo.id,
        name: selectedCombo.name,
        price: Math.round(selectedCombo.price * 0.85), // 15% discount
        quantity: quantity
      };
      
      // Option 2 (alternative): Add the combo as a separate cart item
      // This would be implemented here if preferred
    }
    
    onAddToCart(cartItem);
    onClose();
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const toggleComboItem = (comboItem: MenuItem) => {
    setSelectedCombo(selectedCombo?.id === comboItem.id ? null : comboItem);
  };

  // Filter combo recommendations (drinks for food, sides for main dishes, etc.)
  const getRecommendedCombos = () => {
    if (!recommendedItems.length) return [];
    
    // Get items that would make a good combo with the current item
    // For example, if current item is a main dish, recommend drinks and sides
    const currentCategory = item.category?.toLowerCase() || '';
    
    let recommendedCategories: string[] = [];
    if (['plat principal', 'main dish', 'burger', 'pizza', 'sandwich'].some(cat => 
        currentCategory.includes(cat))) {
      recommendedCategories = ['boisson', 'drink', 'dessert', 'side', 'accompagnement'];
    } else if (['boisson', 'drink', 'juice'].some(cat => 
        currentCategory.includes(cat))) {
      recommendedCategories = ['plat principal', 'main dish', 'burger', 'pizza', 'sandwich'];
    }
    
    return recommendedItems.filter(recItem => {
      const recCategory = recItem.category?.toLowerCase() || '';
      return (
        recItem.id !== item.id &&
        recommendedCategories.some(cat => recCategory.includes(cat))
      );
    }).slice(0, 3); // Limit to 3 recommendations
  };

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex justify-between items-center">
            <span>{item.name}</span>
            <Badge variant="outline" className="ml-2">
              {item.category}
            </Badge>
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
                                +{(option.price / 100).toLocaleString('fr-FR')} XAF
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
                  {getRecommendedCombos().length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {getRecommendedCombos().map(comboItem => (
                        <div 
                          key={comboItem.id} 
                          className={`border rounded-lg p-3 flex items-center justify-between cursor-pointer transition-colors ${
                            selectedCombo?.id === comboItem.id ? 'bg-primary-50 border-primary' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => toggleComboItem(comboItem)}
                        >
                          <div className="flex items-center">
                            {selectedCombo?.id === comboItem.id && (
                              <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                            )}
                            <div>
                              <h4 className="font-medium">{comboItem.name}</h4>
                              <p className="text-sm text-gray-500">{comboItem.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {(comboItem.price * 0.85 / 100).toLocaleString('fr-FR')} XAF
                            </div>
                            <div className="text-xs text-gray-500 line-through">
                              {(comboItem.price / 100).toLocaleString('fr-FR')} XAF
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
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Menus du jour</h3>
                  <div className="text-center p-4 border border-dashed rounded-md">
                    <p className="text-sm text-gray-500">
                      Les menus du jour ne sont pas disponibles actuellement.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="nutrition" className="space-y-4">
            <ScrollArea className="h-[320px]">
              <div className="space-y-6">
                <Accordion type="single" collapsible defaultValue="nutritional-info">
                  <AccordionItem value="nutritional-info">
                    <AccordionTrigger>Information nutritionnelle</AccordionTrigger>
                    <AccordionContent>
                      {nutritionalInfo.length > 0 ? (
                        <div className="space-y-2">
                          {nutritionalInfo.map(info => (
                            <div key={info.label} className="flex justify-between py-1 border-b border-gray-100">
                              <span>{info.label}</span>
                              <span className="font-medium">
                                {info.value !== null ? `${info.value} ${info.unit}` : 'N/A'}
                              </span>
                            </div>
                          ))}
                          <p className="text-xs text-gray-500 mt-2">
                            *Les valeurs nutritionnelles sont données à titre indicatif.
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Les informations nutritionnelles ne sont pas disponibles pour ce plat.
                        </p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="allergens">
                    <AccordionTrigger>
                      Allergènes
                      {item.allergens && item.allergens.length > 0 && (
                        <span className="ml-2">
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                        </span>
                      )}
                    </AccordionTrigger>
                    <AccordionContent>
                      {item.allergens && item.allergens.length > 0 ? (
                        <div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {item.allergens.map(allergen => (
                              <Badge key={allergen} variant="outline" className="bg-amber-50">
                                {allergen}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-2 flex items-start">
                            <Info className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
                            Si vous êtes allergique à l'un de ces ingrédients, veuillez nous en informer dans les instructions spéciales.
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Aucun allergène connu pour ce plat.
                        </p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="ingredients">
                    <AccordionTrigger>Ingrédients</AccordionTrigger>
                    <AccordionContent>
                      {item.ingredients && item.ingredients.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {item.ingredients.map(ingredient => (
                            <li key={ingredient} className="text-sm">{ingredient}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">
                          La liste des ingrédients n'est pas disponible pour ce plat.
                        </p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="dietary">
                    <AccordionTrigger>Régimes alimentaires</AccordionTrigger>
                    <AccordionContent>
                      {item.dietary_preferences && item.dietary_preferences.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {item.dietary_preferences.map(pref => (
                            <Badge key={pref} variant="outline" className="bg-green-50">
                              {pref}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Aucune préférence alimentaire spécifique pour ce plat.
                        </p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
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
              {(totalPrice / 100).toLocaleString('fr-FR')} XAF
            </div>
            {selectedCombo && (
              <div className="text-sm text-gray-500">
                Économie: {(quantity * selectedCombo.price * 0.15 / 100).toLocaleString('fr-FR')} XAF
              </div>
            )}
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleAddToCart} className="bg-primary">
            Ajouter au panier
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MenuItemCustomizationAdvanced;
