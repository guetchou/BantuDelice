
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PhoneNumberInputProps {
  phoneNumber: string;
  operator: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  openOperatorSelect: boolean;
  setOpenOperatorSelect: (open: boolean) => void;
  setOperator: (value: string) => void;
  operators: Array<{ value: string; label: string; icon: string }>;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  phoneNumber,
  operator,
  handleInputChange,
  openOperatorSelect,
  setOpenOperatorSelect,
  setOperator,
  operators
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="operator">Opérateur</Label>
        <Select
          open={openOperatorSelect}
          onOpenChange={setOpenOperatorSelect}
          value={operator}
          onValueChange={setOperator}
        >
          <SelectTrigger id="operator">
            <SelectValue placeholder="Choisir un opérateur" />
          </SelectTrigger>
          <SelectContent>
            {operators.map((op) => (
              <SelectItem key={op.value} value={op.value}>
                <div className="flex items-center">
                  <span className="mr-2">{op.icon}</span>
                  <span>{op.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
        <div className="flex">
          <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
            <span>+242</span>
          </div>
          <Input
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={handleInputChange}
            className="rounded-l-none"
            placeholder="XXX XXX XXX"
            maxLength={11} // For spaces
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Entrez votre numéro sans le préfixe international
        </p>
      </div>
    </div>
  );
};

export default PhoneNumberInput;
