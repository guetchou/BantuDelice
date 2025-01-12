import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ServiceProvider {
  id: string;
  name: string;
  type: string;
  address: string;
  services_offered: string[];
  working_hours: Record<string, string[]>;
}

const ServiceList = () => {
  const navigate = useNavigate();
  const { data: providers, isLoading } = useQuery({
    queryKey: ['serviceProviders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data as ServiceProvider[];
    }
  });

  if (isLoading) {
    return <div>Chargement des services...</div>;
  }

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'restaurant':
        return '🍽️';
      case 'doctor':
        return '👨‍⚕️';
      case 'driver':
        return '🚗';
      case 'hotel':
        return '🏨';
      default:
        return '📦';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {providers?.map((provider) => (
        <Card key={provider.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-4">{getServiceIcon(provider.type)}</div>
          <h3 className="text-xl font-semibold mb-2">{provider.name}</h3>
          <p className="text-gray-600 mb-4">{provider.address}</p>
          <div className="space-y-2 mb-4">
            {provider.services_offered?.map((service) => (
              <Badge key={service} variant="secondary">
                {service}
              </Badge>
            ))}
          </div>
          <Button 
            className="w-full"
            onClick={() => navigate(`/booking/${provider.id}`)}
          >
            Réserver
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default ServiceList;