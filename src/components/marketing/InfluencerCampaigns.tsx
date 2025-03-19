
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Youtube, Instagram, TikTok, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface InfluencerCampaignProps {
  isRestaurantOwner?: boolean;
}

export function InfluencerCampaigns({ isRestaurantOwner = false }: InfluencerCampaignProps) {
  // Mock data for influencer campaigns
  const activeCampaigns = [
    {
      id: '1',
      influencer: {
        name: 'FoodieExplorer',
        platform: 'instagram',
        followers: '25K',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80'
      },
      restaurant: {
        name: 'Le Gourmet Africain',
        cuisine: 'Cuisine traditionnelle'
      },
      campaign: {
        title: 'Dégustation de nouveaux plats',
        startDate: '2023-08-15',
        endDate: '2023-08-30',
        status: 'active',
        budget: 50000,
        metrics: {
          views: 12500,
          engagement: 8.2,
          clicks: 320
        }
      }
    },
    {
      id: '2',
      influencer: {
        name: 'AfroTaste',
        platform: 'tiktok',
        followers: '45K',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80'
      },
      restaurant: {
        name: 'Saveurs d\'Afrique',
        cuisine: 'Fusion africaine'
      },
      campaign: {
        title: 'Challenge culinaire',
        startDate: '2023-08-10',
        endDate: '2023-09-10',
        status: 'active',
        budget: 75000,
        metrics: {
          views: 35000,
          engagement: 12.4,
          clicks: 850
        }
      }
    },
    {
      id: '3',
      influencer: {
        name: 'CookingWithAfrican',
        platform: 'youtube',
        followers: '100K',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80'
      },
      restaurant: {
        name: 'Le Palais Gourmand',
        cuisine: 'Cuisine camerounaise'
      },
      campaign: {
        title: 'Recettes exclusives',
        startDate: '2023-07-01',
        endDate: '2023-08-31',
        status: 'active',
        budget: 120000,
        metrics: {
          views: 45000,
          engagement: 9.8,
          clicks: 1200
        }
      }
    }
  ];
  
  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'tiktok':
        return <TikTok className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };
  
  const getPlatformColor = (platform: string) => {
    switch(platform) {
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'tiktok':
        return 'bg-black text-white';
      case 'youtube':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Collaborations avec des Influenceurs
        </CardTitle>
        <CardDescription>
          {isRestaurantOwner
            ? "Créez des campagnes avec des influenceurs locaux pour promouvoir votre restaurant"
            : "Découvrez les campagnes en cours avec nos influenceurs partenaires"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isRestaurantOwner && (
          <div className="mb-6">
            <Button className="w-full">Créer une nouvelle campagne</Button>
          </div>
        )}
        
        <div className="space-y-4">
          {activeCampaigns.map((campaign) => (
            <div key={campaign.id} className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border">
              <div className="flex-shrink-0">
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={campaign.influencer.image} alt={campaign.influencer.name} />
                    <AvatarFallback>{campaign.influencer.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <Badge className={`absolute -bottom-1 -right-1 ${getPlatformColor(campaign.influencer.platform)}`}>
                    {getPlatformIcon(campaign.influencer.platform)}
                  </Badge>
                </div>
              </div>
              
              <div className="flex-grow">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <h3 className="font-semibold">
                      {campaign.influencer.name}
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        {campaign.influencer.followers} followers
                      </span>
                    </h3>
                    <p className="text-sm text-gray-700">
                      {campaign.campaign.title} avec {campaign.restaurant.name}
                    </p>
                  </div>
                  <Badge 
                    variant={
                      campaign.campaign.status === 'active' ? 'default' : 
                      campaign.campaign.status === 'planned' ? 'outline' : 'secondary'
                    }
                  >
                    {campaign.campaign.status}
                  </Badge>
                </div>
                
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground">Vues</p>
                    <p className="font-semibold">{campaign.campaign.metrics.views.toLocaleString()}</p>
                  </div>
                  <div className="p-2 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground">Engagement</p>
                    <p className="font-semibold">{campaign.campaign.metrics.engagement}%</p>
                  </div>
                  <div className="p-2 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground">Clicks</p>
                    <p className="font-semibold">{campaign.campaign.metrics.clicks.toLocaleString()}</p>
                  </div>
                </div>
                
                {isRestaurantOwner && (
                  <div className="mt-3 flex justify-end">
                    <Button variant="outline" size="sm">
                      Voir les détails
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {!isRestaurantOwner && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Vous êtes un influenceur?</p>
            <Button variant="outline">
              Devenir partenaire
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default InfluencerCampaigns;
