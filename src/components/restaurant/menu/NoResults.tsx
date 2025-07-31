
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface NoResultsProps {
  onClearFilters: () => void;
}

const NoResults: React.FC<NoResultsProps> = ({ onClearFilters }) => {
  return (
    <div className="text-center p-8 border rounded-md">
      <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
      <h3 className="font-medium mb-1">Aucun résultat</h3>
      <p className="text-sm text-muted-foreground">
        Aucun plat ne correspond à vos critères de recherche
      </p>
      <Button variant="outline" className="mt-4" onClick={onClearFilters}>
        Effacer les filtres
      </Button>
    </div>
  );
};

export default NoResults;
