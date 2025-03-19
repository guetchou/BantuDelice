
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Clock, MapPin, User, CalendarDays, CreditCard, Award } from "lucide-react";
import { Order } from "@/types/order";
import { Card } from "@/components/ui/card";
import { OrderSharing } from "@/components/sharing/OrderSharing";
import LoyaltyBadge from "@/components/loyalty/LoyaltyBadge";

interface OrderDetailsProps {
  order: Order;
  restaurantName?: string;
}

export default function OrderDetails({ order, restaurantName }: OrderDetailsProps) {
  if (!order) return null;

  return (
    <Card className="p-6 shadow-md">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold">Commande #{order.id.slice(0, 8)}</h2>
          <p className="text-muted-foreground">
            {format(new Date(order.created_at), "PPP à HH:mm")}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <OrderSharing order={order} restaurant_name={restaurantName} />
          
          {order.loyalty_points_earned && (
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">+{order.loyalty_points_earned} points</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 mb-6">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>Status: <span className="font-medium">{order.status}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>Livraison à: <span className="font-medium">{order.delivery_address}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>Status de livraison: <span className="font-medium">{order.delivery_status}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <span>Paiement: <span className="font-medium">{order.payment_method}</span> ({order.payment_status})</span>
        </div>
        {order.special_instructions && (
          <div className="flex items-start gap-2">
            <span className="text-muted-foreground mt-1">Instructions:</span>
            <span className="font-medium">{order.special_instructions}</span>
          </div>
        )}
      </div>

      <h3 className="font-semibold text-lg mb-3">Articles commandés</h3>
      <ul className="space-y-3 mb-6">
        {order.order_items.map((item) => (
          <li key={item.id} className="flex justify-between">
            <div>
              <span className="font-medium">
                {item.quantity}x {item.item_name}
              </span>
              {item.options && (
                <p className="text-sm text-muted-foreground">{item.options}</p>
              )}
              {item.special_instructions && (
                <p className="text-sm text-muted-foreground italic">
                  "{item.special_instructions}"
                </p>
              )}
            </div>
            <span>{(item.price * item.quantity).toLocaleString()} FCFA</span>
          </li>
        ))}
      </ul>

      <div className="border-t pt-4">
        <div className="flex justify-between mb-1">
          <span>Sous-total</span>
          <span>
            {order.order_items
              .reduce((sum, item) => sum + item.price * item.quantity, 0)
              .toLocaleString()}{" "}
            FCFA
          </span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Frais de livraison</span>
          <span>{order.delivery_fee.toLocaleString()} FCFA</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-2">
          <span>Total</span>
          <span>{order.total_amount.toLocaleString()} FCFA</span>
        </div>
      </div>
    </Card>
  );
}
