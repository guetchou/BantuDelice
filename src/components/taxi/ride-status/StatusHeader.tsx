
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Car, Clock, CheckCircle, Ban, AlertCircle } from "lucide-react";

interface StatusHeaderProps {
  rideId: string;
  status: string;
}

export const StatusHeader = ({ rideId, status }: StatusHeaderProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          label: 'En attente',
          variant: 'secondary' as const,
          color: 'text-yellow-600'
        };
      case 'accepted':
        return {
          icon: Car,
          label: 'Acceptée',
          variant: 'default' as const,
          color: 'text-blue-600'
        };
      case 'in_progress':
        return {
          icon: Car,
          label: 'En cours',
          variant: 'default' as const,
          color: 'text-green-600'
        };
      case 'completed':
        return {
          icon: CheckCircle,
          label: 'Terminée',
          variant: 'secondary' as const,
          color: 'text-green-600'
        };
      case 'cancelled':
        return {
          icon: Ban,
          label: 'Annulée',
          variant: 'destructive' as const,
          color: 'text-red-600'
        };
      default:
        return {
          icon: AlertCircle,
          label: 'Inconnu',
          variant: 'outline' as const,
          color: 'text-gray-600'
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <StatusIcon className={`h-5 w-5 ${config.color}`} />
        <h3 className="text-lg font-semibold">Course {rideId.substring(0, 8)}</h3>
      </div>
      <Badge variant={config.variant}>{config.label}</Badge>
    </div>
  );
};
