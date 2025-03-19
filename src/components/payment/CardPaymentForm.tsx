
import React from 'react';
import { Input } from "@/components/ui/input";

const CardPaymentForm = () => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="cardNumber" className="text-sm font-medium block mb-1">
          Numéro de carte
        </label>
        <Input
          id="cardNumber"
          type="text"
          placeholder="4242 4242 4242 4242"
          className="w-full"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiryDate" className="text-sm font-medium block mb-1">
            Date d'expiration
          </label>
          <Input
            id="expiryDate"
            type="text"
            placeholder="MM/YY"
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="cvv" className="text-sm font-medium block mb-1">
            Code de sécurité
          </label>
          <Input
            id="cvv"
            type="text"
            placeholder="123"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default CardPaymentForm;
