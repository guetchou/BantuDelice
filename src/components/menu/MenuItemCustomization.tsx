import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from '@/contexts/CartContext';

interface MenuItemCustomizationProps {
  item: {
    id: string;
    name: string;
    price: number;
    customization_options?: {
      [key: string]: string[];
    };
  } | null;
  open: boolean;
  onClose: () => void;
}

const MenuItemCustomization = ({ item, open, onClose }: MenuItemCustomizationProps) => {
  const { addToCart } = useCart();
  const [options, setOptions] = React.useState<Record<string, string>>({});
  const [specialInstructions, setSpecialInstructions] = React.useState('');

  // Reset state when dialog closes
  React.useEffect(() => {
    if (!open) {
      setOptions({});
      setSpecialInstructions('');
    }
  }, [open]);

  // Don't render the dialog if there's no item
  if (!item) {
    return null;
  }

  const handleAddToCart = () => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      options: {
        ...options,
        specialInstructions
      }
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Personnaliser {item.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {item.customization_options && Object.entries(item.customization_options).map(([key, values]) => (
            <div key={key}>
              <label className="text-sm font-medium mb-1 block">
                {key}
              </label>
              <Select
                value={options[key]}
                onValueChange={(value) => setOptions(prev => ({ ...prev, [key]: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Choisir ${key.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {values.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Instructions spéciales
            </label>
            <Textarea
              placeholder="Ex: sans oignon, sauce à part..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleAddToCart}>
            Ajouter au panier
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemCustomization;