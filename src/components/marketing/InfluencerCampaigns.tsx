
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Instagram, Youtube, Hash, Users, Upload, DollarSign, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// TikTok icon component since it's not available in lucide-react
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

// Marketing icon component since it's not available in lucide-react
const MarketingIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M5 3a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5z" />
    <path d="M21 9H3" />
    <path d="M6 17l3-3 2 2 3-3 2 2" />
  </svg>
);

export default function InfluencerCampaigns() {
  const [activeTab, setActiveTab] = useState('instagram');
  const { toast } = useToast();
  const [campaignName, setCampaignName] = useState('');
  const [selectedRestaurants, setSelectedRestaurants] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [contentType, setContentType] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!campaignName || !budget || !description || !startDate || !endDate || contentType.length === 0 || selectedRestaurants.length === 0) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    
    // Here would go API call to submit the campaign
    toast({
      title: "Campagne créée",
      description: `La campagne ${campaignName} a été créée avec succès`,
      variant: "default"
    });
    
    // Reset form
    setCampaignName('');
    setSelectedRestaurants([]);
    setBudget('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setContentType([]);
  };

  const toggleContentType = (type: string) => {
    if (contentType.includes(type)) {
      setContentType(contentType.filter(t => t !== type));
    } else {
      setContentType([...contentType, type]);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MarketingIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Campagnes Influenceurs</h1>
        </div>
        <Button onClick={() => toast({ title: "Statistiques exportées", description: "Les statistiques ont été exportées avec succès" })}>
          Exporter les statistiques
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Créer une nouvelle campagne</CardTitle>
              <CardDescription>
                Configurez votre campagne d'influence pour promouvoir vos restaurants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4 grid grid-cols-3">
                  <TabsTrigger value="instagram" className="flex items-center gap-2">
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </TabsTrigger>
                  <TabsTrigger value="tiktok" className="flex items-center gap-2">
                    <TikTokIcon className="h-4 w-4" />
                    TikTok
                  </TabsTrigger>
                  <TabsTrigger value="youtube" className="flex items-center gap-2">
                    <Youtube className="h-4 w-4" />
                    YouTube
                  </TabsTrigger>
                </TabsList>

                {/* Common form for all platforms with some platform-specific fields */}
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-1 font-medium">Nom de la campagne</label>
                      <Input 
                        placeholder="Ex: Lancement menu d'été" 
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-1 font-medium">Restaurants concernés</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {selectedRestaurants.map(resto => (
                          <Badge key={resto} variant="secondary" className="flex items-center gap-1">
                            {resto}
                            <span 
                              className="cursor-pointer" 
                              onClick={() => setSelectedRestaurants(selectedRestaurants.filter(r => r !== resto))}
                            >
                              ×
                            </span>
                          </Badge>
                        ))}
                      </div>
                      <select 
                        className="w-full p-2 border rounded-md"
                        onChange={(e) => {
                          if (e.target.value && !selectedRestaurants.includes(e.target.value)) {
                            setSelectedRestaurants([...selectedRestaurants, e.target.value]);
                            e.target.value = '';
                          }
                        }}
                      >
                        <option value="">Sélectionner un restaurant</option>
                        <option value="Le Fétiche">Le Fétiche</option>
                        <option value="Mami Wata">Mami Wata</option>
                        <option value="Le Massala">Le Massala</option>
                        <option value="La Baie des Saveurs">La Baie des Saveurs</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-1 font-medium">Budget (FCFA)</label>
                      <Input 
                        type="number" 
                        placeholder="Ex: 50000" 
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-1 font-medium">Description de la campagne</label>
                      <Textarea 
                        placeholder="Décrivez l'objectif de la campagne..." 
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-1 font-medium">Date de début</label>
                        <Input 
                          type="date" 
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1 font-medium">Date de fin</label>
                        <Input 
                          type="date" 
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-1 font-medium">Type de contenu souhaité</label>
                      <div className="flex flex-wrap gap-2">
                        <Badge 
                          variant={contentType.includes('photos') ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleContentType('photos')}
                        >
                          Photos
                        </Badge>
                        <Badge 
                          variant={contentType.includes('videos') ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleContentType('videos')}
                        >
                          Vidéos
                        </Badge>
                        <Badge 
                          variant={contentType.includes('stories') ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleContentType('stories')}
                        >
                          Stories
                        </Badge>
                        <Badge 
                          variant={contentType.includes('reels') ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleContentType('reels')}
                        >
                          Reels
                        </Badge>
                        <Badge 
                          variant={contentType.includes('live') ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleContentType('live')}
                        >
                          Live
                        </Badge>
                      </div>
                    </div>

                    {/* Platform-specific fields */}
                    <TabsContent value="instagram">
                      <div className="border rounded-md p-4 space-y-4">
                        <div>
                          <label className="block text-sm mb-1 font-medium">Hashtags</label>
                          <div className="flex items-center">
                            <Hash className="h-4 w-4 mr-2 text-gray-500" />
                            <Input placeholder="Ex: #buntudelice #foodcongo" />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="tiktok">
                      <div className="border rounded-md p-4 space-y-4">
                        <div>
                          <label className="block text-sm mb-1 font-medium">Challenge</label>
                          <Input placeholder="Nom du challenge TikTok" />
                        </div>
                        <div>
                          <label className="block text-sm mb-1 font-medium">Son/Musique</label>
                          <Input placeholder="Lien vers le son à utiliser" />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="youtube">
                      <div className="border rounded-md p-4 space-y-4">
                        <div>
                          <label className="block text-sm mb-1 font-medium">Durée vidéo (minutes)</label>
                          <Input type="number" placeholder="Ex: 5" min="1" />
                        </div>
                        <div>
                          <label className="block text-sm mb-1 font-medium">Type de vidéo</label>
                          <select className="w-full p-2 border rounded-md">
                            <option value="review">Critique culinaire</option>
                            <option value="vlog">Food vlog</option>
                            <option value="mukbang">Mukbang</option>
                            <option value="shorts">Shorts</option>
                          </select>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="public" 
                          checked={isPublic}
                          onCheckedChange={setIsPublic}
                        />
                        <label htmlFor="public">
                          Campagne publique
                        </label>
                      </div>
                      <Button type="submit">Créer la campagne</Button>
                    </div>
                  </div>
                </form>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Campagnes actives</CardTitle>
              <CardDescription>
                Campagnes en cours avec des influenceurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Instagram className="h-4 w-4 text-pink-500" />
                    <h3 className="font-medium">Festival des Saveurs</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">3 restaurants • Budget: 75,000 FCFA</p>
                  <div className="flex items-center text-sm">
                    <Users className="h-3 w-3 mr-1" />
                    <span>5 influenceurs</span>
                    <span className="mx-2">•</span>
                    <Upload className="h-3 w-3 mr-1" />
                    <span>12 posts</span>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TikTokIcon className="h-4 w-4 text-black" />
                    <h3 className="font-medium">Challenge #BuntuFoodDance</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">2 restaurants • Budget: 50,000 FCFA</p>
                  <div className="flex items-center text-sm">
                    <Users className="h-3 w-3 mr-1" />
                    <span>8 influenceurs</span>
                    <span className="mx-2">•</span>
                    <DollarSign className="h-3 w-3 mr-1" />
                    <span>10,000 impressions</span>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Youtube className="h-4 w-4 text-red-500" />
                    <h3 className="font-medium">Reviews Gastronomiques</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">4 restaurants • Budget: 120,000 FCFA</p>
                  <div className="flex items-center text-sm">
                    <Users className="h-3 w-3 mr-1" />
                    <span>3 YouTubers</span>
                    <span className="mx-2">•</span>
                    <ExternalLink className="h-3 w-3 mr-1" />
                    <span>6 vidéos</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Voir toutes les campagnes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
