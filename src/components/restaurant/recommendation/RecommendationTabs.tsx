
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MenuItem } from '@/types/menu';
import RecommendedItem from './RecommendedItem';

interface RecommendationTabsProps {
  selectedItem: MenuItem | null;
  recommendedItems: MenuItem[];
  popularItems: MenuItem[];
  healthyItems: MenuItem[];
  quickItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

const RecommendationTabs: React.FC<RecommendationTabsProps> = ({
  selectedItem,
  recommendedItems,
  popularItems,
  healthyItems,
  quickItems,
  onAddToCart
}) => {
  return (
    <Tabs defaultValue="personal">
      <TabsList className="w-full">
        <TabsTrigger value="personal" className="flex-1">
          Pour vous
        </TabsTrigger>
        <TabsTrigger value="popular" className="flex-1">
          Populaires
        </TabsTrigger>
        <TabsTrigger value="healthy" className="flex-1">
          Healthy
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="personal" className="mt-4">
        {selectedItem ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Basé sur votre sélection de <span className="font-medium">{selectedItem.name}</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {recommendedItems.length > 0 ? (
                recommendedItems.map(item => (
                  <RecommendedItem
                    key={item.id}
                    item={item}
                    onAddToCart={() => onAddToCart(item)}
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground col-span-3 text-center py-6">
                  Aucune recommandation disponible
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">
              Sélectionnez un plat pour voir des recommandations personnalisées
            </p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="popular" className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {popularItems.length > 0 ? (
            popularItems.map(item => (
              <RecommendedItem
                key={item.id}
                item={item}
                onAddToCart={() => onAddToCart(item)}
              />
            ))
          ) : (
            <p className="text-sm text-muted-foreground col-span-3 text-center py-6">
              Aucun plat populaire disponible
            </p>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="healthy" className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {healthyItems.length > 0 ? (
            healthyItems.map(item => (
              <RecommendedItem
                key={item.id}
                item={item}
                onAddToCart={() => onAddToCart(item)}
              />
            ))
          ) : (
            <p className="text-sm text-muted-foreground col-span-3 text-center py-6">
              Aucun plat healthy disponible
            </p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default RecommendationTabs;
