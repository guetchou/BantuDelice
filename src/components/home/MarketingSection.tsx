
import React from 'react';
import { ReferralProgram } from '@/components/marketing/ReferralProgram';
import { SponsoredRestaurants } from '@/components/marketing/SponsoredRestaurants';
import { InfluencerCampaigns } from '@/components/marketing/InfluencerCampaigns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MarketingSection() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Promotions et Partenariats
        </h2>
        
        <Tabs defaultValue="featured" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="featured">Restaurants en vedette</TabsTrigger>
            <TabsTrigger value="referral">Programme de parrainage</TabsTrigger>
            <TabsTrigger value="influencers">Collaborations influenceurs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="featured">
            <SponsoredRestaurants />
          </TabsContent>
          
          <TabsContent value="referral">
            <ReferralProgram />
          </TabsContent>
          
          <TabsContent value="influencers">
            <InfluencerCampaigns />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default MarketingSection;
