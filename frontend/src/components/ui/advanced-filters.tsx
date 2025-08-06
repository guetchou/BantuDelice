import React, { useState } from 'react';
import { Search, Filter, X, Calendar, DollarSign, Package, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DatePicker } from '@/components/ui/date-picker';

interface FilterOptions {
  search: string;
  status: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  minValue: string;
  maxValue: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  activeFilters: FilterOptions;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  onFiltersChange,
  onClearFilters,
  activeFilters
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(activeFilters);

  const handleFilterChange = (key: keyof FilterOptions, value: unknown) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters: FilterOptions = {
      search: '',
      status: '',
      dateFrom: null,
      dateTo: null,
      minValue: '',
      maxValue: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setLocalFilters(emptyFilters);
    onClearFilters();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.search) count++;
    if (localFilters.status) count++;
    if (localFilters.dateFrom) count++;
    if (localFilters.dateTo) count++;
    if (localFilters.minValue) count++;
    if (localFilters.maxValue) count++;
    return count;
  };

  const activeCount = getActiveFiltersCount();

  return (
    <div className="space-y-4">
      {/* Barre de recherche principale */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par numéro de tracking, nom, adresse..."
            value={localFilters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtres
          {activeCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeCount}
            </Badge>
          )}
        </Button>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filtres avancés */}
      {isExpanded && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres avancés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Statut */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Statut</label>
                <Select
                  value={localFilters.status}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="in_transit">En transit</SelectItem>
                    <SelectItem value="delivered">Livré</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date de début */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date de début</label>
                <DatePicker
                  date={localFilters.dateFrom}
                  onSelect={(date) => handleFilterChange('dateFrom', date)}
                  placeholder="Sélectionner une date"
                />
              </div>

              {/* Date de fin */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date de fin</label>
                <DatePicker
                  date={localFilters.dateTo}
                  onSelect={(date) => handleFilterChange('dateTo', date)}
                  placeholder="Sélectionner une date"
                />
              </div>

              {/* Valeur minimale */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Valeur min (FCFA)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    placeholder="0"
                    value={localFilters.minValue}
                    onChange={(e) => handleFilterChange('minValue', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Valeur maximale */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Valeur max (FCFA)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    placeholder="100000"
                    value={localFilters.maxValue}
                    onChange={(e) => handleFilterChange('maxValue', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Tri */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Trier par</label>
                <Select
                  value={localFilters.sortBy}
                  onValueChange={(value) => handleFilterChange('sortBy', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Date de création</SelectItem>
                    <SelectItem value="trackingNumber">Numéro de tracking</SelectItem>
                    <SelectItem value="totalPrice">Valeur</SelectItem>
                    <SelectItem value="status">Statut</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filtres actifs */}
            {activeCount > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-700">Filtres actifs :</span>
                  {localFilters.search && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Recherche: {localFilters.search}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleFilterChange('search', '')}
                      />
                    </Badge>
                  )}
                  {localFilters.status && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Statut: {localFilters.status}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleFilterChange('status', '')}
                      />
                    </Badge>
                  )}
                  {localFilters.minValue && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Min: {localFilters.minValue} FCFA
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleFilterChange('minValue', '')}
                      />
                    </Badge>
                  )}
                  {localFilters.maxValue && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Max: {localFilters.maxValue} FCFA
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleFilterChange('maxValue', '')}
                      />
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedFilters; 