import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
  spicy_level: number;
  dietary_preferences: string[];
}

const MenuList = () => {
  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['menuItems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true);
      
      if (error) throw error;
      return data as MenuItem[];
    }
  });

  if (isLoading) {
    return <div>Chargement des plats...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {menuItems?.map((item) => (
        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          {item.image_url && (
            <img 
              src={item.image_url} 
              alt={item.name}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <span className="text-lg font-bold">{item.price / 100}€</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">{item.description}</p>
            <div className="flex flex-wrap gap-2">
              {item.spicy_level > 0 && (
                <Badge variant="secondary">
                  {Array(item.spicy_level).fill('🌶️').join('')}
                </Badge>
              )}
              {item.dietary_preferences?.map((pref) => (
                <Badge key={pref} variant="outline">{pref}</Badge>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MenuList;