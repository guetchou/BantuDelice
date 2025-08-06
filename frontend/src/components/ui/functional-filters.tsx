import React, { useState, useEffect } from 'react';
import { Search, Filter, X, SortAsc, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface FilterOptions {
  search: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface FunctionalFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  activeFilters: FilterOptions;
  totalItems: number;
  filteredItems: number;
}

const FunctionalFilters: React.FC<FunctionalFiltersProps> = ({
  onFiltersChange,
  onClearFilters,
  activeFilters,
  totalItems,
  filteredItems
}) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(activeFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setLocalFilters(activeFilters);
  }, [activeFilters]);

  const handleFilterChange = (key: keyof FilterOptions, value: unknown) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters: FilterOptions = {
      search: '',
      status: '',
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
    if (localFilters.sortBy !== 'createdAt') count++;
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

      {/* Résultats de recherche */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {filteredItems} sur {totalItems} colis trouvés
        </span>
        {activeCount > 0 && (
          <span className="text-orange-600">
            Filtres actifs : {activeCount}
          </span>
        )}
      </div>

      {/* Filtres avancés */}
      {isExpanded && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* Ordre */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ordre</label>
              <div className="flex gap-2">
                <Button
                  variant={localFilters.sortOrder === 'asc' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('sortOrder', 'asc')}
                  className="flex-1"
                >
                  <SortAsc className="h-4 w-4 mr-1" />
                  Croissant
                </Button>
                <Button
                  variant={localFilters.sortOrder === 'desc' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('sortOrder', 'desc')}
                  className="flex-1"
                >
                  <SortDesc className="h-4 w-4 mr-1" />
                  Décroissant
                </Button>
              </div>
            </div>
          </div>

          {/* Filtres actifs */}
          {activeCount > 0 && (
            <div className="pt-4 border-t">
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
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FunctionalFilters; 