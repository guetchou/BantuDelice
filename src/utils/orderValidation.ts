import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface OrderValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface AvailabilityCheck {
  itemId: string;
  quantity: number;
}

export const validateOrder = async (items: AvailabilityCheck[]): Promise<OrderValidationResult> => {
  const errors: string[] = [];
  
  try {
    // Check item availability in real-time
    const { data: menuItems, error } = await supabase
      .from('menu_items')
      .select('id, name, available')
      .in('id', items.map(item => item.id));

    if (error) throw error;

    // Validate each item
    menuItems?.forEach(menuItem => {
      const orderItem = items.find(item => item.itemId === menuItem.id);
      if (!menuItem.available) {
        errors.push(`${menuItem.name} n'est plus disponible`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  } catch (error) {
    console.error('Error validating order:', error);
    return {
      isValid: false,
      errors: ['Une erreur est survenue lors de la validation de la commande']
    };
  }
};

export const checkTimeSlotAvailability = async (
  serviceId: string,
  date: Date,
  duration: number
): Promise<boolean> => {
  try {
    const startTime = date.toISOString();
    const endTime = new Date(date.getTime() + duration * 60000).toISOString();

    // Check for overlapping bookings
    const { data: existingBookings, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('service_provider_id', serviceId)
      .or(`start_time.lte.${endTime},end_time.gte.${startTime}`)
      .limit(1);

    if (error) throw error;

    return existingBookings.length === 0;
  } catch (error) {
    console.error('Error checking time slot availability:', error);
    return false;
  }
};

export const validatePayment = async (amount: number, paymentMethod: string): Promise<boolean> => {
  try {
    // Implement payment validation logic here
    // This is just a placeholder - real implementation would depend on payment provider
    return true;
  } catch (error) {
    console.error('Payment validation error:', error);
    toast({
      title: "Erreur de paiement",
      description: "La validation du paiement a échoué. Veuillez réessayer.",
      variant: "destructive"
    });
    return false;
  }
};

// Real-time order tracking
export const subscribeToOrderStatus = (
  orderId: string,
  onStatusChange: (status: string) => void
) => {
  const channel = supabase
    .channel('order-status')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`
      },
      (payload) => {
        console.log('Order status changed:', payload);
        onStatusChange(payload.new.status);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};