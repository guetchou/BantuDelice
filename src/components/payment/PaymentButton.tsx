
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

interface PaymentButtonProps {
  isProcessing: boolean;
  handlePayment: () => Promise<void>;
}

const PaymentButton = ({ isProcessing, handlePayment }: PaymentButtonProps) => {
  return (
    <Button
      className="w-full"
      onClick={handlePayment}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Traitement en cours...
        </>
      ) : (
        'Payer maintenant'
      )}
    </Button>
  );
};

export default PaymentButton;
