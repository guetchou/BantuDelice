
import React from 'react';
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";

interface ComboboxItem {
  label: string;
  value: string;
}

interface ComboboxPopoverProps {
  items: ComboboxItem[];
  onSelect: (item: ComboboxItem) => void;
  className?: string;
}

export const ComboboxPopover: React.FC<ComboboxPopoverProps> = ({
  items,
  onSelect,
  className = ""
}) => {
  return (
    <div className={`absolute z-50 top-[calc(100%+5px)] left-0 right-0 bg-white rounded-md border border-gray-200 shadow-md ${className}`}>
      <Command>
        <CommandGroup>
          {items.map((item, index) => (
            <CommandItem
              key={index}
              value={item.value}
              onSelect={() => onSelect(item)}
              className="cursor-pointer"
            >
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>
    </div>
  );
};
