
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { type MenuItem } from '@/types/restaurant';
import { type CartItem, CartItemOption } from '@/types/cart';
import { Plus, Info } from 'lucide-react';

interface MenuItemCustomizationProps {
  item: MenuItem;
  onAddToCart: (item: CartItem) => void;
  onClose: () => void;
  suggestedCombos?: MenuItem[];
}

interface CustomizationOption {
  required?: boolean;
  multiple?: boolean;
  values: {
    value: string;
    price: number;
    default?: boolean;
  }[];
}

const MenuItemCustomization = ({ item, onAddToCart, onClose, suggestedCombos = [] }: MenuItemCustomizationProps) => {
  const [selectedOptions, setSelectedOptions] = useState<Array<{ name: string; value: string; price: number }>>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Traiter les options de personnalisation en s'assurant que c'est un objet
  const customizationOptions = item.customization_options as Record<string, CustomizationOption> || {};
  const hasCustomizationOptions = Object.keys(customizationOptions || {}).length > 0;

  const handleOptionChange = (
    optionName: string, 
    optionValue: string, 
    price: number, 
    isMultiple: boolean,
    checked: boolean
  ) => {
    if (isMultiple) {
      if (checked) {
        setSelectedOptions([...selectedOptions, { name: optionName, value: optionValue, price }]);
      } else {
        setSelectedOptions(selectedOptions.filter(
          option => !(option.name === optionName && option.value === optionValue)
        ));
      }
    } else {
      // Pour les options radio, on remplace l'option existante
      const filteredOptions = selectedOptions.filter(option => option.name !== optionName);
      setSelectedOptions([...filteredOptions, { name: optionName, value: optionValue, price }]);
    }
  };

  const isOptionSelected = (optionName: string, optionValue: string) => {
    return selectedOptions.some(
      option => option.name === optionName && option.value === optionValue
    );
  };

  const getSelectedOptionsPrice = () => {
    return selectedOptions.reduce((total, option) => total + option.price, 0);
  };

  const getTotalPrice = () => {
    return (item.price + getSelectedOptionsPrice()) * quantity;
  };

  const handleAddToCart = () => {
    // Create CartItemOption objects from selectedOptions
    const cartItemOptions: CartItemOption[] = selectedOptions.map(option => ({
      id: `${option.name}-${option.value}`,
      name: option.name,
      value: option.value,
      price: option.price,
      quantity: 1
    }));

    onAddToCart({
      id: item.id,
      menu_item_id: item.id,
      name: item.name,
      price: item.price + getSelectedOptionsPrice(),
      total: getTotalPrice(),
      image_url: item.image_url,
      quantity,
      options: cartItemOptions,
      special_instructions: specialInstructions,
      restaurant_id: item.restaurant_id
    });
    onClose();
  };

  const handleAddComboToCart = (comboItem: MenuItem) => {
    onAddToCart({
      id: comboItem.id,
      menu_item_id: comboItem.id,
      name: comboItem.name,
      price: comboItem.price,
      total: comboItem.price,
      image_url: comboItem.image_url,
      quantity: 1,
      restaurant_id: comboItem.restaurant_id
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">{item.name}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-grow pr-4 max-h-[60vh]">
          {item.image_url && (
            <div className="h-48 w-full mb-4">
              <img 
                src={item.image_url} 
                alt={item.name} 
                className="h-full w-full object-cover rounded-md"
              />
            </div>
          )}

          <div className="space-y-6">
            {hasCustomizationOptions && (
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Personnalisation</h3>
                
                {Object.entries(customizationOptions || {}).map(([optionName, optionDetails]) => (
                  <div key={optionName} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">{optionName}</h4>
                      {optionDetails.required && (
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Obligatoire</span>
                      )}
                    </div>
                    
                    {optionDetails.multiple ? (
                      <div className="space-y-2">
                        {optionDetails.values.map((option) => (
                          <div key={option.value} className="flex items-center gap-2">
                            <Checkbox 
                              id={`${optionName}-${option.value}`}
                              checked={isOptionSelected(optionName, option.value)}
                              onCheckedChange={(checked) => 
                                handleOptionChange(optionName, option.value, option.price, true, !!checked)
                              }
                            />
                            <Label htmlFor={`${optionName}-${option.value}`} className="flex-grow">
                              {option.value}
                            </Label>
                            {option.price > 0 && (
                              <span className="text-sm">+{option.price.toLocaleString()} XAF</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <RadioGroup 
                        defaultValue={optionDetails.values.find(opt => opt.default)?.value}
                        className="space-y-2"
                        onValueChange={(value) => {
                          const option = optionDetails.values.find(opt => opt.value === value);
                          if (option) {
                            handleOptionChange(optionName, option.value, option.price, false, true);
                          }
                        }}
                      >
                        {optionDetails.values.map((option) => (
                          <div key={option.value} className="flex items-center gap-2">
                            <RadioGroupItem 
                              value={option.value} 
                              id={`${optionName}-${option.value}`} 
                            />
                            <Label htmlFor={`${optionName}-${option.value}`} className="flex-grow">
                              {option.value}
                            </Label>
                            {option.price > 0 && (
                              <span className="text-sm">+{option.price.toLocaleString()} XAF</span>
                            )}
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="space-y-3">
              <Label htmlFor="special-instructions">Instructions spéciales</Label>
              <Textarea 
                id="special-instructions"
                placeholder="Ex: sans oignon, sauce à part, etc."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
            </div>

            {suggestedCombos.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Complétez votre commande
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {suggestedCombos.map((combo) => (
                    <Card key={combo.id} className="p-3 flex items-center gap-3 bg-gray-50">
                      {combo.image_url && (
                        <img 
                          src={combo.image_url} 
                          alt={combo.name} 
                          className="h-14 w-14 object-cover rounded"
                        />
                      )}
                      <div className="flex-grow">
                        <h4 className="font-medium text-sm">{combo.name}</h4>
                        <p className="text-sm text-gray-500">{combo.price.toLocaleString()} XAF</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAddComboToCart(combo)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="h-8 w-8"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 h-8 text-center"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                className="h-8 w-8"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-lg font-bold">{getTotalPrice().toLocaleString()} XAF</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Annuler</Button>
            <Button 
              className="bg-orange-500 hover:bg-orange-600"
              onClick={handleAddToCart}
            >
              Ajouter au panier
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemCustomization;

// Import du Minus qui manquait
function Minus({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14" />
    </svg>
  );
}
