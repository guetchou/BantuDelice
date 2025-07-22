import React from 'react';
import { DeliveryLocation, DeliveryHistoryService } from '@/services/deliveryService';

interface AddressHistoryProps {
  onAddressSelect: (location: { lat: number; lng: number; address: string }) => void;
  className?: string;
}

export default function AddressHistory({ onAddressSelect, className = '' }: AddressHistoryProps) {
  const [history, setHistory] = React.useState<DeliveryLocation[]>([]);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setHistory(DeliveryHistoryService.getHistory());
  }, []);

  const handleAddressSelect = (location: DeliveryLocation) => {
    onAddressSelect({
      lat: location.lat,
      lng: location.lng,
      address: location.address
    });
    setIsVisible(false);
  };

  const handleClearHistory = () => {
    DeliveryHistoryService.clearHistory();
    setHistory([]);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'À l\'instant';
    } else if (diffInHours < 24) {
      return `Il y a ${Math.floor(diffInHours)}h`;
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Adresses récentes ({history.length})</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isVisible ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isVisible && (
        <div className="mt-3 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          <div className="p-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">Adresses récentes</h4>
              <button
                onClick={handleClearHistory}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Effacer
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {history.map((location, index) => (
              <button
                key={index}
                onClick={() => handleAddressSelect(location)}
                className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {location.address}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(location.timestamp)}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 