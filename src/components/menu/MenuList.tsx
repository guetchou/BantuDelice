import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FloatingPager from "@/components/ui/floating-pager";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  available: boolean;
  dietary_preferences: string[];
  category: string;
  cuisine_type: string;
  customization_options: any;
  popularity_score: number;
  restaurant_id: string;
  created_at: string;
}

const ITEMS_PER_PAGE = 6;

const MenuList = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['menuItems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('available', true);
      
      if (error) throw error;
      return data as MenuItem[];
    }
  });

  if (isLoading) {
    return <div>Chargement des plats...</div>;
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = menuItems?.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="relative min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {paginatedItems?.map((item) => (
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
                {item.dietary_preferences?.map((pref) => (
                  <Badge key={pref} variant="outline">{pref}</Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {menuItems && menuItems.length > ITEMS_PER_PAGE && (
        <FloatingPager
          totalItems={menuItems.length}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default MenuList;