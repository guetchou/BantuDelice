
import React from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReferralProgramComponent from '@/components/marketing/ReferralProgram';
import InfluencerCampaigns from '@/components/marketing/InfluencerCampaigns';
import { useFeature } from '@/utils/featureFlags';
import { NavigationLink } from '@/utils/navigation';

const ReferralProgram = () => {
  // Configurer le titre de la page
  usePageTitle({ title: "Programme de parrainage" });
  
  // Obtenir l'utilisateur actuel
  const { user } = useUser();
  
  // Vérifier si les fonctionnalités sont activées
  const referralEnabled = useFeature('referral_program');
  const influencerEnabled = useFeature('influencer_campaigns');
  
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">Programmes de Recommandation</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {referralEnabled && (
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Programme de Parrainage</CardTitle>
            </CardHeader>
            <CardContent>
              <ReferralProgramComponent />
            </CardContent>
          </Card>
        )}
        
        {influencerEnabled && (
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Campagnes d'Influence</CardTitle>
            </CardHeader>
            <CardContent>
              <InfluencerCampaigns />
            </CardContent>
          </Card>
        )}
        
        {!referralEnabled && !influencerEnabled && (
          <div className="col-span-2 text-center py-12">
            <p className="text-gray-500 mb-4">Aucun programme de recommandation n'est actuellement disponible.</p>
            <Button asChild>
              <NavigationLink to="/">Retourner à l'accueil</NavigationLink>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralProgram;
