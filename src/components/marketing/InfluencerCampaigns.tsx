
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, Youtube, ArrowRight, Users, Lightbulb, TrendingUp, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Create a custom TikTok icon since it's not available in lucide-react
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm10-7a3 3 0 0 0-3-3h-4a.08.08 0 0 0-.07.07v10.36a2.32 2.32 0 0 1-2.93 2.92A2.57 2.57 0 0 1 7 12.62a2.48 2.48 0 0 1 2.5-2.45c.15-.01.87.14.87.14V7.3c-1.78.2-3.37.8-4.57 1.94A6.32 6.32 0 0 0 3 14.57a6.62 6.62 0 0 0 11 4.65c.08-.06.18-.14.24-.21a6.5 6.5 0 0 0 1.77-4.4V8.17a6.8 6.8 0 0 0 4.01 1.26V6.43a3.88 3.88 0 0 1-1.02-.13z" />
  </svg>
);

// Assure qu'il y a un export default pour ce composant
const InfluencerCampaigns = () => {
  const { toast } = useToast();
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
    
    toast({
      title: "Plateforme sélectionnée",
      description: `Vous avez sélectionné la plateforme ${platform}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Users className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Campagnes d'Influence</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-pink-50 to-white border-pink-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl">
              <Instagram className="mr-2 h-5 w-5 text-pink-500" />
              Instagram
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Engagez des influenceurs Instagram pour promouvoir vos produits à travers des posts, stories et reels.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Portée estimée:</span>
                <span className="font-medium">50k - 100k</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Budget minimum:</span>
                <span className="font-medium">300 000 FCFA</span>
              </div>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600" 
              onClick={() => handlePlatformSelect('Instagram')}
            >
              Créer une campagne <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl">
              <TikTokIcon className="mr-2 h-5 w-5 text-black" />
              TikTok
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Créez des tendances virales avec des influenceurs TikTok pour atteindre une audience jeune et engagée.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Portée estimée:</span>
                <span className="font-medium">100k - 250k</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Budget minimum:</span>
                <span className="font-medium">250 000 FCFA</span>
              </div>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-black to-gray-800 hover:from-black hover:to-gray-900" 
              onClick={() => handlePlatformSelect('TikTok')}
            >
              Créer une campagne <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-white border-red-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl">
              <Youtube className="mr-2 h-5 w-5 text-red-500" />
              YouTube
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Collaborez avec des créateurs YouTube pour des présentations détaillées et des tests de vos produits.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Portée estimée:</span>
                <span className="font-medium">30k - 80k</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Budget minimum:</span>
                <span className="font-medium">400 000 FCFA</span>
              </div>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700" 
              onClick={() => handlePlatformSelect('YouTube')}
            >
              Créer une campagne <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
          <Lightbulb className="h-6 w-6 text-blue-500 flex-shrink-0" />
          <div>
            <h3 className="font-medium mb-1">Idées personnalisées</h3>
            <p className="text-sm text-gray-600">Nos experts peuvent concevoir des campagnes uniques adaptées à vos besoins.</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
          <TrendingUp className="h-6 w-6 text-green-500 flex-shrink-0" />
          <div>
            <h3 className="font-medium mb-1">Analyse de performance</h3>
            <p className="text-sm text-gray-600">Suivez l'impact de vos campagnes avec des rapports détaillés.</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
          <DollarSign className="h-6 w-6 text-amber-500 flex-shrink-0" />
          <div>
            <h3 className="font-medium mb-1">ROI optimisé</h3>
            <p className="text-sm text-gray-600">Maximisez votre investissement avec des stratégies ciblées et mesurables.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerCampaigns;
