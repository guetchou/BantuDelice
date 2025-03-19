
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhoneNumberInputProps {
  phoneNumber: string;
  operator: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  openOperatorSelect: boolean;
  setOpenOperatorSelect: (open: boolean) => void;
  setOperator: (operator: string) => void;
  operators: { value: string; label: string; icon: string }[];
}

const PhoneNumberInput = ({
  phoneNumber,
  operator,
  handleInputChange,
  openOperatorSelect,
  setOpenOperatorSelect,
  setOperator,
  operators
}: PhoneNumberInputProps) => {
  return (
    <>
      <div>
        <Label className="text-sm font-medium block mb-1">
          Opérateur
        </Label>
        <Popover open={openOperatorSelect} onOpenChange={setOpenOperatorSelect}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openOperatorSelect}
              className="w-full justify-between"
            >
              {operator
                ? operators.find((op) => op.value === operator)?.label
                : "Sélectionnez un opérateur"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Rechercher un opérateur..." />
              <CommandEmpty>Aucun opérateur trouvé.</CommandEmpty>
              <CommandGroup>
                {operators.map((op) => (
                  <CommandItem
                    key={op.value}
                    value={op.value}
                    onSelect={(currentValue) => {
                      setOperator(currentValue === operator ? "" : currentValue);
                      setOpenOperatorSelect(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        operator === op.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="mr-2">{op.icon}</span>
                    {op.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <label htmlFor="phone" className="text-sm font-medium block mb-1">
          Numéro de téléphone
        </label>
        <Input
          id="phone"
          type="tel"
          placeholder="Entrez 9 chiffres"
          value={phoneNumber}
          onChange={handleInputChange}
          className="w-full"
          maxLength={13}
        />
        <p className="text-xs text-gray-500 mt-1">Format: XXX XXX XXX</p>
      </div>
    </>
  );
};

export default PhoneNumberInput;
