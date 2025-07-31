
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

const CardPaymentForm: React.FC = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  const formatCardNumber = (input: string) => {
    const numericInput = input.replace(/\D/g, '');
    const groups = [];
    
    for (let i = 0; i < numericInput.length; i += 4) {
      groups.push(numericInput.slice(i, i + 4));
    }
    
    return groups.join(' ').slice(0, 19);
  };

  const formatExpiryDate = (input: string) => {
    const numericInput = input.replace(/\D/g, '');
    
    if (numericInput.length <= 2) {
      return numericInput;
    }
    
    return `${numericInput.slice(0, 2)}/${numericInput.slice(2, 4)}`;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(formatExpiryDate(e.target.value));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  // Indique que les paiements par carte sont simulés
  React.useEffect(() => {
    const showDemo = setTimeout(() => {
      toast.info("Mode démo", {
        description: "Les paiements par carte sont simulés. Utilisez n'importe quelles valeurs valides.",
      });
    }, 1000);
    
    return () => clearTimeout(showDemo);
  }, []);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cardholderName">Titulaire de la carte</Label>
        <Input
          id="cardholderName"
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          placeholder="PRÉNOM NOM"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Numéro de carte</Label>
        <Input
          id="cardNumber"
          type="text"
          value={cardNumber}
          onChange={handleCardNumberChange}
          placeholder="4242 4242 4242 4242"
          maxLength={19}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Date d'expiration</Label>
          <Input
            id="expiryDate"
            type="text"
            value={expiryDate}
            onChange={handleExpiryDateChange}
            placeholder="MM/YY"
            maxLength={5}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            type="text"
            value={cvv}
            onChange={handleCvvChange}
            placeholder="123"
            maxLength={3}
          />
        </div>
      </div>
    </div>
  );
};

export default CardPaymentForm;
