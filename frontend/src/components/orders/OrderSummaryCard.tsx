
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Order } from "@/types/order";

interface OrderSummaryCardProps {
  order: Order;
}

const OrderSummaryCard = ({ order }: OrderSummaryCardProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Résumé de la commande</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <p className="text-gray-600">Status:</p>
          <Badge>{order.status}</Badge>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-600">Total:</p>
          <p className="font-medium">{order.total_amount.toLocaleString()} XAF</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-600">Adresse:</p>
          <p className="text-right max-w-[200px]">{order.delivery_address}</p>
        </div>
        {order.delivery_instructions && (
          <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
            <p className="font-medium mb-1">Instructions:</p>
            <p>{order.delivery_instructions}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default OrderSummaryCard;
