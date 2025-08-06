import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Package, 
  Truck, 
  MapPin, 
  Calendar,
  Filter,
  X,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface SearchResult {
  id: string;
  trackingNumber: string;
  type: 'national' | 'international';
  status: string;
  from: string;
  to: string;
  date: string;
  price: number;
}

interface ColisSearchProps {
  onSearch?: (query: string) => void;
  onResultSelect?: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
}

const ColisSearch: React.FC<ColisSearchProps> = ({
  onSearch,
  onResultSelect,
  placeholder = "Rechercher un colis...",
  className = ""
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock data pour les suggestions
  const mockResults: SearchResult[] = [
    {
      id: '1',
      trackingNumber: 'BD12345678',
      type: 'national',
      status: 'delivered',
      from: 'Brazzaville',
      to: 'Pointe-Noire',
      date: '2024-07-15',
      price: 2500
    },
    {
      id: '2',
      trackingNumber: 'BD87654321',
      type: 'international',
      status: 'in_transit',
      from: 'Brazzaville',
      to: 'Paris',
      date: '2024-07-10',
      price: 15000
    },
    {
      id: '3',
      trackingNumber: 'BD11223344',
      type: 'national',
      status: 'pending',
      from: 'Brazzaville',
      to: 'Dolisie',
      date: '2024-07-18',
      price: 3000
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      setIsSearching(true);
      // Simuler une recherche
      setTimeout(() => {
        const filteredResults = mockResults.filter(result =>
          result.trackingNumber.toLowerCase().includes(query.toLowerCase()) ||
          result.from.toLowerCase().includes(query.toLowerCase()) ||
          result.to.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filteredResults);
        setIsSearching(false);
        setShowResults(true);
      }, 300);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query);
      navigate(`/colis/tracking?code=${encodeURIComponent(query.trim())}`);
      setShowResults(false);
    }
  };

  const handleResultSelect = (result: SearchResult) => {
    onResultSelect?.(result);
    navigate(`/colis/tracking?code=${encodeURIComponent(result.trackingNumber)}`);
    setShowResults(false);
    setQuery(result.trackingNumber);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_transit':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-10 pr-20 bg-white/90 backdrop-blur border-orange-200 focus:border-orange-400 focus:ring-orange-400"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="text-orange-600 hover:text-orange-800"
            >
              <Filter className="h-4 w-4" />
            </Button>
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setQuery('')}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white hover:from-orange-500 hover:to-yellow-500"
            >
              Rechercher
            </Button>
          </div>
        </div>
      </form>

      {/* Filtres */}
      {showFilters && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 bg-white/95 backdrop-blur border-orange-200 shadow-xl">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">Tous</option>
                  <option value="national">National</option>
                  <option value="international">International</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">Tous</option>
                  <option value="delivered">Livré</option>
                  <option value="in_transit">En transit</option>
                  <option value="pending">En attente</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résultats de recherche */}
      {showResults && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 bg-white/95 backdrop-blur border-orange-200 shadow-xl max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {isSearching ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Recherche en cours...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {results.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => handleResultSelect(result)}
                    className="p-4 hover:bg-orange-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-orange-500" />
                        <div>
                          <h4 className="font-semibold text-gray-900">{result.trackingNumber}</h4>
                          <p className="text-sm text-gray-600">{result.from} → {result.to}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.status)}
                        <Badge className={getStatusColor(result.status)}>
                          {result.status === 'delivered' ? 'Livré' : 
                           result.status === 'in_transit' ? 'En transit' : 'En attente'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{result.date}</span>
                      <span>{result.price.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : query.length >= 2 ? (
              <div className="p-4 text-center">
                <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Aucun colis trouvé</p>
                <p className="text-xs text-gray-500">Essayez avec un autre numéro de suivi</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ColisSearch; 