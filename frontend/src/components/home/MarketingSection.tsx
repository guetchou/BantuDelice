
import React from 'react';
import ReferralProgram from "@/components/marketing/ReferralProgram";
import { useFeature } from "@/utils/featureFlags";
import InfluencerCampaigns from "@/components/marketing/InfluencerCampaigns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const MarketingSection = () => {
  const referralEnabled = useFeature('referral_program');
  const influencerCampaignsEnabled = useFeature('influencer_campaigns');

  if (!referralEnabled && !influencerCampaignsEnabled) {
    return null;
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6">
      <h2 className="text-3xl font-bold text-center mb-10">Nos Programmes Marketing</h2>

      <Tabs defaultValue="referral" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="referral" disabled={!referralEnabled}>Programme de Parrainage</TabsTrigger>
          <TabsTrigger value="influencers" disabled={!influencerCampaignsEnabled}>Campagnes d'Influence</TabsTrigger>
        </TabsList>
        
        {referralEnabled && (
          <TabsContent value="referral">
            <Card>
              <CardHeader>
                <CardTitle>Programme de Parrainage</CardTitle>
                <CardDescription>Parrainez vos amis et gagnez des récompenses exclusives</CardDescription>
              </CardHeader>
              <CardContent>
                <ReferralProgram />
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {influencerCampaignsEnabled && (
          <TabsContent value="influencers">
            <Card>
              <CardHeader>
                <CardTitle>Campagnes d'Influence</CardTitle>
                <CardDescription>Collaborez avec des influenceurs et étendez votre portée</CardDescription>
              </CardHeader>
              <CardContent>
                <InfluencerCampaigns />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default MarketingSection;
