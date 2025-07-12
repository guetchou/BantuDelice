
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (e: React.FormEvent) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery, handleSearch }) => {
  return (
    <form onSubmit={handleSearch} className="relative mr-4 hidden md:block">
      <Input
        placeholder="Rechercher un restaurant..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-[200px] lg:w-[300px] pr-10"
      />
      <Button 
        type="submit" 
        variant="ghost" 
        size="icon" 
        className="absolute right-0 top-0 h-full"
      >
        <Search className="h-4 w-4 text-muted-foreground" />
      </Button>
    </form>
  );
};

export default SearchBar;
