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

interface MenuItemCustomizationProps {
  item: MenuItem;
  onAddToCart: (item: CartItem) => void;
  onClose: () => void;
}

const MenuItemCustomization = ({ item, onAddToCart, onClose }: MenuItemCustomizationProps) => {
  const [selectedCustomizations, setSelectedCustomizations] = useState<{ [category: string]: { [option: string]: boolean } }>({});
  const [specialInstructions, setSpecialInstructions] = useState('');

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

    if (specialInstructions && specialInstructions.trim() !== '') {
    }

    onAddToCart({
      ...item,
      options: selectedOptions,
      quantity: 1,
    });
    
    onClose();
  };

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{item.name} - Personnalisation</AlertDialogTitle>
          <AlertDialogDescription>
            Choisissez vos options préférées pour personnaliser votre plat.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ScrollArea className="h-[400px] w-full">
          <div className="grid gap-4 py-4">
            {item.customization_options && Object.entries(item.customization_options).map(([category, options]: [string, any]) => (
              <div key={category} className="space-y-2">
                <h3 className="text-lg font-semibold">{category}</h3>
                {options.options.map((option: any) => (
                  <div key={option.name} className="flex items-center space-x-2">
                    <Input
                      type="checkbox"
                      id={`${category}-${option.name}`}
                      checked={selectedCustomizations[category]?.[option.name] || false}
                      onChange={() => toggleCustomization(category, option.name)}
                    />
                    <Label htmlFor={`${category}-${option.name}`}>
                      {option.name} {option.price ? `(+${(option.price / 100).toFixed(2)}€)` : ''}
                    </Label>
                  </div>
                ))}
              </div>
            ))}

            <div>
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
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleAddToCart}>Ajouter au panier</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MenuItemCustomization;
