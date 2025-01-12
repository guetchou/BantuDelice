import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Package, Truck, CheckCircle } from "lucide-react";

interface OrderTrackingProps {
  orderId: string;
}

const OrderTracking = ({ orderId }: OrderTrackingProps) => {
  const { data: tracking, isLoading } = useQuery({
    queryKey: ['orderTracking', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('delivery_tracking')
        .select('*')
        .eq('order_id', orderId)
        .single();
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000 // Rafraîchir toutes les 30 secondes
  });

  if (isLoading) {
    return <div>Chargement du suivi...</div>;
  }

  const steps = [
    { icon: Clock, label: 'Commande reçue', status: 'completed' },
    { icon: Package, label: 'En préparation', status: tracking?.status === 'preparing' ? 'current' : tracking?.status === 'delivering' || tracking?.status === 'delivered' ? 'completed' : 'waiting' },
    { icon: Truck, label: 'En livraison', status: tracking?.status === 'delivering' ? 'current' : tracking?.status === 'delivered' ? 'completed' : 'waiting' },
    { icon: CheckCircle, label: 'Livrée', status: tracking?.status === 'delivered' ? 'completed' : 'waiting' }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Suivi de commande</h3>
      <div className="relative">
        {steps.map((step, index) => (
          <div key={step.label} className="flex items-center mb-8 last:mb-0">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center
              ${step.status === 'completed' ? 'bg-green-500 text-white' :
                step.status === 'current' ? 'bg-blue-500 text-white' :
                'bg-gray-200 text-gray-400'}
            `}>
              <step.icon className="w-5 h-5" />
            </div>
            <div className="ml-4 flex-1">
              <p className="font-medium">{step.label}</p>
              {step.status === 'current' && tracking?.updated_at && (
                <p className="text-sm text-muted-foreground">
                  Mis à jour à {new Date(tracking.updated_at).toLocaleTimeString()}
                </p>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className="absolute left-4 ml-[11px] h-full border-l border-gray-200" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default OrderTracking;