
import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DatePickerProps {
  date: Date | null;
  onSelect: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  date,
  onSelect,
  placeholder = "Sélectionner une date",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const clearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        className={`w-full justify-start text-left font-normal ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar className="mr-2 h-4 w-4" />
        {date ? (
          <div className="flex items-center justify-between w-full">
            <span>{formatDate(date)}</span>
            <X
              className="h-4 w-4 text-gray-400 hover:text-gray-600"
              onClick={clearDate}
            />
          </div>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <Input
            type="date"
            onChange={(e) => {
              const selectedDate = e.target.value ? new Date(e.target.value) : null;
              onSelect(selectedDate);
              setIsOpen(false);
            }}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;
