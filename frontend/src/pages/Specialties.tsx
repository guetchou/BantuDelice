import { useQuery } from "@tanstack/react-query";
import apiService from "@/services/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Specialty {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price: number;
}

const Specialties = () => {
  const navigate = useNavigate();

  const { data: specialties, isLoading } = useQuery({
    queryKey: ['specialties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('category', 'specialty')
        .order('popularity_score', { ascending: false });
      
      if (error) throw error;
      return data as Specialty[];
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Nos Spécialités</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {specialties?.map((specialty) => (
          <Card key={specialty.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative">
              <img 
                src={specialty.image_url || '/placeholder-dish.jpg'} 
                alt={specialty.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{specialty.name}</h3>
              <p className="text-gray-600 mb-4">{specialty.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">{specialty.price.toLocaleString()} FCFA</span>
                <Button 
                  onClick={() => navigate(`/restaurants?dish=${specialty.id}`)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Commander
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Specialties;