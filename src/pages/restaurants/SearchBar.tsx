
import { Search } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFindNearMe: () => void;
}

export default function SearchBar({ 
  searchQuery, 
  onSearchChange, 
  onFindNearMe 
}: SearchBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher un restaurant, un plat ou une cuisine..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-gray-800 border-gray-700 text-white"
        />
      </div>
      
      <Button 
        onClick={onFindNearMe}
        className="bg-orange-500 hover:bg-orange-600"
      >
        <MapPin className="mr-2 h-4 w-4" />
        Près de moi
      </Button>
    </div>
  );
}
