
import { useState } from "react";
import { useInventory } from "@/hooks/useInventory";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Package } from "lucide-react";

interface InventoryManagerProps {
  restaurantId: string;
}

export const InventoryManager = ({ restaurantId }: InventoryManagerProps) => {
  const { inventoryLevels, isLoading, updateStock } = useInventory(restaurantId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  const handleUpdateStock = (itemId: string) => {
    updateStock({ itemId, quantity: editValue });
    setEditingId(null);
  };

  if (isLoading) {
    return <div className="animate-pulse">Chargement de l'inventaire...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Gestion du Stock</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventoryLevels?.map((item: unknown) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{item.menu_items.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Package className="w-4 h-4" />
                  <span>Stock actuel: {item.current_stock}</span>
                </div>
                {item.current_stock <= item.min_stock_level && (
                  <div className="flex items-center gap-2 mt-2 text-amber-500">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Stock bas</span>
                  </div>
                )}
              </div>
              {editingId === item.id ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(Number(e.target.value))}
                    className="w-20"
                  />
                  <Button size="sm" onClick={() => handleUpdateStock(item.menu_items.id)}>
                    Sauvegarder
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setEditingId(item.id);
                    setEditValue(item.current_stock);
                  }}
                >
                  Modifier
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
