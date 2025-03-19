
import React from 'react';
import { QrCode } from 'lucide-react';

const CashDeliveryInfo = () => {
  return (
    <div className="p-4 bg-muted rounded-lg">
      <div className="flex items-start space-x-3">
        <QrCode className="w-6 h-6 text-primary" />
        <div>
          <p className="font-medium">Paiement à la livraison</p>
          <p className="text-sm text-muted-foreground mt-1">
            Un code QR sera généré pour votre livraison. Le livreur scannera ce code pour confirmer le paiement. Cela permet d'éviter les fraudes et d'assurer la sécurité des transactions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CashDeliveryInfo;
