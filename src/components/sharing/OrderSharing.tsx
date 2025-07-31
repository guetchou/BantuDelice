
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Order } from '@/types/order';
import { ShareSocial } from './ShareSocial';

interface OrderSharingProps {
  order: Order;
  restaurant_name?: string;
}

export const OrderSharing = ({ order, restaurant_name }: OrderSharingProps) => {
  // Format the order items for sharing
  const formatOrderItems = () => {
    if (!order.order_items || order.order_items.length === 0) {
      return 'Aucun item';
    }

    return order.order_items
      .map(item => `${item.quantity}x ${item.item_name}`)
      .join(', ');
  };

  // Create a shareable text
  const shareText = `J'ai commandé ${formatOrderItems()} chez ${restaurant_name || 'un restaurant'} pour ${order.total_amount} FCFA via Buntudelice!`;
  
  return (
    <div className="flex items-center gap-2">
      <ShareSocial 
        title={`Ma commande chez ${restaurant_name || 'Buntudelice'}`}
        text={shareText}
        url={`${window.location.origin}/orders/${order.id}`}
      />
    </div>
  );
};
