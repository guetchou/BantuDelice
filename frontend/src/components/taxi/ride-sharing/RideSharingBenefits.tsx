
import React from 'react';
import { Shield, Clock } from "lucide-react";

export const RideSharingBenefits: React.FC = () => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Shield className="h-4 w-4 text-green-500" />
        <span className="text-sm text-gray-600">Sécurisé et vérifié</span>
      </div>
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-amber-500" />
        <span className="text-sm text-gray-600">+5-10 min sur le temps de trajet</span>
      </div>
    </div>
  );
};
