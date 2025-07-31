
import { useState, useEffect } from 'react';

interface DeliveryMetrics {
  averageTime: number;
  peakHours: string[];
  optimalZones: Array<{
    id: string;
    score: number;
    estimatedTime: number;
  }>;
}

export const useDeliveryOptimization = (restaurantId: string) => {
  const [data, setData] = useState<DeliveryMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOptimizationData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock optimization data
        const mockMetrics: DeliveryMetrics = {
          averageTime: 35 * 60 * 1000, // 35 minutes in milliseconds
          peakHours: ['12:00', '19:00', '20:00'],
          optimalZones: [
            {
              id: 'zone-1',
              score: 0.85,
              estimatedTime: 25 * 60 * 1000 // 25 minutes
            },
            {
              id: 'zone-2',
              score: 0.72,
              estimatedTime: 35 * 60 * 1000 // 35 minutes
            },
            {
              id: 'zone-3',
              score: 0.65,
              estimatedTime: 40 * 60 * 1000 // 40 minutes
            }
          ]
        };
        
        setData(mockMetrics);
      } catch (err) {
        console.error('Error fetching delivery optimization data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch optimization data'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOptimizationData();
  }, [restaurantId]);

  return {
    data,
    isLoading,
    error
  };
};
