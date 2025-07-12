import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Check, X } from "lucide-react";
import { Table } from "@/types/restaurant";

interface RestaurantTableProps {
  table: Table;
  onSelect: (tableId: string) => void;
  isSelected: boolean;
  date?: Date;
  partySize?: number;
}

const RestaurantTable = ({ 
  table, 
  onSelect, 
  isSelected, 
  date, 
  partySize = 2
}: RestaurantTableProps) => {
  const isAvailable = table.is_available !== false;
  const isValidPartySize = partySize >= table.minimum_guests && partySize <= table.maximum_guests;
  
  const canBeSelected = isAvailable && isValidPartySize;
  
  // Support both tableNumber and table_number naming conventions
  const tableNumberDisplay = table.tableNumber || `Table ${table.id.slice(0, 4)}`;

  return (
    <Card 
      className={`p-4 cursor-pointer transition-all ${
        isSelected 
          ? 'bg-primary/10 border-primary' 
          : canBeSelected 
            ? 'hover:bg-gray-50 border-gray-200' 
            : 'bg-gray-100 border-gray-200 opacity-60'
      }`}
      onClick={() => canBeSelected && onSelect(table.id)}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium">{tableNumberDisplay}</h3>
          <p className="text-sm text-gray-500">{table.location}</p>
        </div>
        {isAvailable ? (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Disponible</Badge>
        ) : (
          <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-200">Indisponible</Badge>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-gray-400" />
          <span>{table.minimum_guests} - {table.maximum_guests} personnes</span>
        </div>
        
        {!isValidPartySize && partySize && (
          <div className="text-orange-600 text-xs flex items-center gap-1">
            <X className="h-3 w-3" />
            Nombre de personnes non adapté ({partySize})
          </div>
        )}
        
        {table.is_accessible && (
          <div className="text-blue-600 text-xs">
            Accessible aux personnes à mobilité réduite
          </div>
        )}
        
        {table.notes && (
          <p className="text-xs text-gray-500 mt-2">{table.notes}</p>
        )}
      </div>
      
      {isSelected && (
        <div className="mt-3 pt-3 border-t border-primary/20 flex justify-between items-center">
          <div className="flex items-center gap-1 text-primary text-sm">
            <Check className="h-4 w-4" />
            <span>Sélectionnée</span>
          </div>
          
          {date && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>{date.toLocaleDateString()}</span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default RestaurantTable;
