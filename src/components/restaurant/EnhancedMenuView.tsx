import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  MenuCustomizationOption,
  MenuItem,
  MenuAnalysisResult
} from '@/types/restaurant';
import { 
  MenuPromotion, 
  MenuStatistics, 
  MenuRecommendation,
  ExtendedMenuAnalysisResult 
} from '@/types/menuAnalysis';
import { formatPrice } from '@/utils/formatPrice';
import { ExtendedMenuItem } from '@/types/extendedRestaurant';

interface EnhancedMenuViewProps {
  restaurantId: string;
}

const EnhancedMenuView: React.FC<EnhancedMenuViewProps> = ({ restaurantId }) => {
  const [menuItems, setMenuItems] = useState<ExtendedMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<ExtendedMenuAnalysisResult | null>(null);
  const [recommendations, setRecommendations] = useState<MenuRecommendation[]>([]);
  const [statistics, setStatistics] = useState<MenuStatistics | null>(null);
  const [promotions, setPromotions] = useState<MenuPromotion[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurantId);

        if (error) throw error;

        setMenuItems(data || []);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        toast({
          title: "Error",
          description: "Failed to fetch menu items.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [restaurantId, toast]);

  useEffect(() => {
    const analyzeMenu = async () => {
      try {
        // Simulate menu analysis
        const extendedMenuItems = menuItems as ExtendedMenuItem[];
        
        const lowProfitItems = extendedMenuItems.filter(item => item.profit_margin && item.profit_margin < 0.15);
        const highProfitItems = extendedMenuItems.filter(item => item.profit_margin && item.profit_margin > 0.3);
        const slowMovers = extendedMenuItems.sort(() => Math.random() - 0.5).slice(0, 3);
        const fastMovers = extendedMenuItems.sort(() => Math.random() - 0.5).slice(0, 3);
        const priceChangeRecommendations = extendedMenuItems.map(item => ({
          itemId: item.id,
          suggestedPrice: item.price * (1 + (Math.random() - 0.5) * 0.2),
        }));
        const bundleOpportunities = extendedMenuItems.sort(() => Math.random() - 0.5).slice(0, 2);
        const seasonalRecommendations: any[] = [];
        const mostPopularCategory = extendedMenuItems[0]?.category;

        // Create basic MenuAnalysisResult with complete dietary options
        const baseAnalysis: MenuAnalysisResult = {
          totalItems: menuItems.length,
          priceStats: {
            average: menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length,
            highest: Math.max(...menuItems.map(item => item.price)),
            lowest: Math.min(...menuItems.map(item => item.price)),
            median: menuItems.sort((a, b) => a.price - b.price)[Math.floor(menuItems.length / 2)].price
          },
          dietaryOptions: {
            vegetarianCount: menuItems.filter(item => item.is_vegetarian).length,
            veganCount: menuItems.filter(item => item.is_vegan).length,
            glutenFreeCount: menuItems.filter(item => item.is_gluten_free).length,
            vegetarianPercentage: (menuItems.filter(item => item.is_vegetarian).length / menuItems.length) * 100,
            veganPercentage: (menuItems.filter(item => item.is_vegan).length / menuItems.length) * 100,
            glutenFreePercentage: (menuItems.filter(item => item.is_gluten_free).length / menuItems.length) * 100
          },
          menuSuggestions: [
            {message: "Ajouter des options végétariennes", priority: "high" as const},
            {message: "Réduire les prix pendant les heures creuses", priority: "medium" as const}
          ]
        };
        
        // Extend with additional analysis properties
        const extendedAnalysis: ExtendedMenuAnalysisResult = {
          ...baseAnalysis,
          lowProfitItems,
          highProfitItems,
          slowMovers,
          fastMovers,
          priceChangeRecommendations,
          bundleOpportunities,
          seasonalRecommendations,
          mostPopularCategory
        };

        setAnalysisResult(extendedAnalysis);

        // Simulate recommendations
        const newRecommendations: MenuRecommendation[] = [];
        setRecommendations(newRecommendations);

        // Simulate statistics
        const newStatistics: MenuStatistics = {
          popularItems: menuItems.sort(() => Math.random() - 0.5).slice(0, 5),
          profitMargins: extendedMenuItems.map(item => ({ itemId: item.id, margin: item.profit_margin })),
          salesTrends: [],
          categoryPerformance: [],
          timeBasedAnalysis: [],
        };
        setStatistics(newStatistics);

        // Simulate promotions
        const newPromotions: MenuPromotion[] = [];
        setPromotions(newPromotions);

      } catch (error) {
        console.error('Error analyzing menu:', error);
        toast({
          title: "Error",
          description: "Failed to analyze menu.",
          variant: "destructive",
        });
      }
    };

    if (menuItems.length > 0) {
      analyzeMenu();
    }
  }, [menuItems, restaurantId, toast]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Menu Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px] mt-2" />
            <Skeleton className="h-4 w-[100px] mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px] mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px] mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Promotions</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px] mt-2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Menu Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {analysisResult ? (
            <div className="space-y-2">
              <div>
                <h3 className="text-lg font-semibold mb-2">Profitability</h3>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Low Profit Items:</span> {analysisResult.lowProfitItems?.length || 0}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">High Profit Items:</span> {analysisResult.highProfitItems?.length || 0}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Item Performance</h3>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Slow Movers:</span> {analysisResult.slowMovers?.map(item => item.name).join(', ') || 'None'}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Fast Movers:</span> {analysisResult.fastMovers?.map(item => item.name).join(', ') || 'None'}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Pricing</h3>
                <div className="space-y-1">
                  {analysisResult.priceChangeRecommendations?.slice(0, 3).map(item => (
                    <p className="text-sm" key={item.itemId}>
                      <span className="font-medium">Item {item.itemId}:</span> Suggested Price {formatPrice(item.suggestedPrice)}
                    </p>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Category Insights</h3>
                <div className="space-y-2">
                  {analysisResult?.mostPopularCategory ? (
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                      <p className="text-sm text-green-800">
                        <span className="font-medium">Most Popular Category:</span> {analysisResult.mostPopularCategory}
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        This category attracts the most customer attention and sales.
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <p>No menu analysis data available.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          {recommendations.length > 0 ? (
            <div className="space-y-2">
              {recommendations.map((rec, i) => (
                <div key={rec.id || i} className="border rounded-md p-3">
                  <p className="text-sm font-medium">{rec.recommendationType}</p>
                  <p className="text-xs text-gray-500">{rec.strength}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No recommendations available.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          {statistics ? (
            <div className="space-y-2">
              <div>
                <h3 className="text-lg font-semibold mb-2">Popular Items</h3>
                <div className="flex gap-2 flex-wrap">
                  {statistics.popularItems.map((item, i) => (
                    <Badge key={item.id || i}>{item.name}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Profit Margins</h3>
                <div className="space-y-1">
                  {statistics.profitMargins.slice(0, 3).map((item, i) => (
                    <p className="text-sm" key={item.itemId || i}>
                      <span className="font-medium">Item {i+1}:</span> Margin {item.margin || 'N/A'}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p>No statistics available.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Promotions</CardTitle>
        </CardHeader>
        <CardContent>
          {promotions.length > 0 ? (
            <div className="space-y-2">
              {promotions.map((promo, i) => (
                <div key={promo.id || i} className="border rounded-md p-3">
                  <p className="text-sm font-medium">{promo.title}</p>
                  <p className="text-xs text-gray-500">{promo.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No promotions available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedMenuView;
