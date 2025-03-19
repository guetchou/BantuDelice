
import React from 'react';
import { ReferralProgram } from '@/components/marketing/ReferralProgram';
import { SponsoredRestaurants } from '@/components/marketing/SponsoredRestaurants';
import { InfluencerCampaigns } from '@/components/marketing/InfluencerCampaigns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PremiumBadge } from '@/components/subscription/PremiumBadge';
import { ArrowRight, Crown, GiftIcon, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function MarketingSection() {
  const navigate = useNavigate();
  
  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              Promotions et Partenariats
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Découvrez nos restaurants partenaires, programmes d'affiliation et collaborations spéciales
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <PremiumBadge tier="premium" size="md" />
            <PremiumBadge tier="elite" size="md" />
          </div>
        </div>
        
        <Tabs defaultValue="featured" className="w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <TabsList className="mb-4 md:mb-0">
              <TabsTrigger value="featured">Restaurants en vedette</TabsTrigger>
              <TabsTrigger value="referral">Programme de parrainage</TabsTrigger>
              <TabsTrigger value="influencers">Collaborations influenceurs</TabsTrigger>
            </TabsList>
            
            <Button variant="outline" size="sm" onClick={() => navigate('/restaurant/subscription/plans')} className="hidden md:flex">
              <Crown className="h-4 w-4 mr-2 text-amber-500" />
              Devenir restaurant partenaire
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Crown className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Restaurant Premium</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Boostez votre visibilité et réduisez vos commissions avec notre abonnement Premium
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-auto"
              onClick={() => navigate('/restaurant/subscription/plans')}
            >
              Découvrir
            </Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="bg-amber-100 p-3 rounded-full mb-4">
              <TrendingUp className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Livreur Premium</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Accédez aux meilleures courses et bénéficiez de commissions réduites
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-auto"
              onClick={() => navigate('/driver/subscription/plans')}
            >
              Découvrir
            </Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <GiftIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Programme de parrainage</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Invitez vos amis et gagnez des réductions sur vos prochaines commandes
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-auto"
              onClick={() => navigate('/referral')}
            >
              Parrainer
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MarketingSection;
