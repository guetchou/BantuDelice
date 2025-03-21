
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Clock, Package, Truck, UtensilsCrossed } from "lucide-react";

interface OrderStatus {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  time?: string;
  completed: boolean;
  inProgress: boolean;
}

interface OrderTrackingSectionProps {
  orderId: string;
  restaurantName: string;
  statuses: OrderStatus[];
  estimatedDeliveryTime?: string;
}

const OrderTrackingSection: React.FC<OrderTrackingSectionProps> = ({
  orderId,
  restaurantName,
  statuses,
  estimatedDeliveryTime
}) => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Suivi de commande</CardTitle>
        <CardDescription>
          Commande #{orderId.substring(0, 6)} - {restaurantName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {estimatedDeliveryTime && (
          <div className="bg-muted/40 p-4 rounded-lg mb-6">
            <div className="font-medium flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              Livraison estimée
            </div>
            <div className="text-lg font-bold">{estimatedDeliveryTime}</div>
          </div>
        )}

        <div className="space-y-6">
          {statuses.map((status, index) => (
            <div key={index} className="flex">
              <div className="flex flex-col items-center mr-4">
                <div
                  className={`rounded-full p-2 ${
                    status.completed
                      ? "bg-green-100 text-green-600"
                      : status.inProgress
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {status.icon}
                </div>
                {index < statuses.length - 1 && (
                  <div
                    className={`h-full w-0.5 ${
                      status.completed ? "bg-green-600" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
              <div className="flex-1 pb-8">
                <div className="flex items-center justify-between">
                  <h3
                    className={`font-medium ${
                      status.completed || status.inProgress
                        ? "text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {status.title}
                  </h3>
                  {status.time && (
                    <span className="text-sm text-gray-500">{status.time}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {status.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTrackingSection;
