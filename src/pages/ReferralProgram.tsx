
import { useEffect } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus } from "lucide-react";
import ReferralProgram from '@/components/marketing/ReferralProgram';
import { SponsoredRestaurants } from '@/components/marketing/SponsoredRestaurants';
import { InfluencerCampaigns } from '@/components/marketing/InfluencerCampaigns';

export default function ReferralProgramPage() {
  usePageTitle({ title: "Programme de Parrainage" });
  
  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <UserPlus className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Programme de Parrainage</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ReferralProgram />
        </div>
        
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques de parrainage</CardTitle>
              <CardDescription>Suivez vos performances de parrainage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between p-4 bg-muted rounded-lg">
                  <div className="text-sm font-medium">Amis parrainés</div>
                  <div className="font-bold">0</div>
                </div>
                <div className="flex justify-between p-4 bg-muted rounded-lg">
                  <div className="text-sm font-medium">Livreurs parrainés</div>
                  <div className="font-bold">0</div>
                </div>
                <div className="flex justify-between p-4 bg-muted rounded-lg">
                  <div className="text-sm font-medium">Récompenses gagnées</div>
                  <div className="font-bold">0 FCFA</div>
                </div>
                <div className="flex justify-between p-4 bg-muted rounded-lg">
                  <div className="text-sm font-medium">Récompenses en attente</div>
                  <div className="font-bold">0 FCFA</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Parrainage de restaurants</CardTitle>
              <CardDescription>Êtes-vous un restaurateur? Parrainez d'autres restaurants</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                Si vous êtes déjà restaurateur partenaire, vous pouvez parrainer d'autres restaurants et gagner des commissions pendant 3 mois!
              </p>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <h4 className="text-sm font-medium text-amber-700">Bonus restaurateurs</h4>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    <span className="text-amber-800">10 000 FCFA par restaurant parrainé</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    <span className="text-amber-800">2% des commissions pendant 3 mois</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-12 mb-6">
        <h2 className="text-2xl font-bold mb-6">Découvrez également</h2>
        <Tabs defaultValue="sponsored" className="w-full">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-8">
            <TabsTrigger value="sponsored">Restaurants en vedette</TabsTrigger>
            <TabsTrigger value="influencers">Influenceurs partenaires</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sponsored">
            <SponsoredRestaurants />
          </TabsContent>
          
          <TabsContent value="influencers">
            <InfluencerCampaigns />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
