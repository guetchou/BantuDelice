
import React from 'react';
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface PaymentButtonProps {
  isProcessing: boolean;
  handlePayment: () => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  isProcessing,
  handlePayment
}) => {
  return (
    <Button
      className="w-full"
      onClick={handlePayment}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <span className="flex items-center">
          <span className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></span>
          Traitement en cours...
        </span>
      ) : (
        <span className="flex items-center">
          <Lock className="h-4 w-4 mr-2" />
          Payer maintenant
        </span>
      )}
    </Button>
  );
};

export default PaymentButton;
