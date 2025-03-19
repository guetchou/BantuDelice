
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, UserPlus, Share2, Users, Gift, Check, Instagram, Youtube } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

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

export default function ReferralProgram() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [referralTab, setReferralTab] = useState('user');
  
  const referralCode = "BUNTUAMI2024";
  const referralLink = `https://buntudelice.com/join?ref=${referralCode}`;
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    
    toast({
      title: "Copié dans le presse-papier",
      description: "Partagez ce code avec vos amis !",
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const shareReferral = async (platform: string) => {
    let shareUrl = '';
    const shareText = "Rejoingnez-moi sur BuntuDelice ! Utilisez mon code de parrainage et recevez 2000 FCFA de réduction sur votre première commande.";
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + referralLink)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=Rejoignez BuntuDelice&body=${encodeURIComponent(shareText + ' ' + referralLink)}`;
        break;
      case 'instagram':
      case 'tiktok':
      case 'youtube':
        copyToClipboard(referralLink);
        toast({
          title: `Partager sur ${platform}`,
          description: "Lien copié. Collez-le dans votre story ou bio.",
        });
        return;
      default:
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent(shareText)}`;
    }
    
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <UserPlus className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Programme de Parrainage</h1>
        </div>
        
        <Tabs value={referralTab} onValueChange={setReferralTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user">Parrainer des utilisateurs</TabsTrigger>
            <TabsTrigger value="driver">Parrainer des livreurs</TabsTrigger>
          </TabsList>
          
          {/* User Referral Tab */}
          <TabsContent value="user" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Parrainez vos amis et recevez des récompenses</CardTitle>
                <CardDescription>
                  Pour chaque ami qui s'inscrit et passe sa première commande avec votre code de parrainage, vous recevez 1000 FCFA en crédit.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-primary/5 p-6 rounded-lg border text-center">
                  <h3 className="text-lg font-medium mb-2">Votre code de parrainage</h3>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="text-2xl font-bold tracking-widest bg-white px-4 py-2 rounded-md border">
                      {referralCode}
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => copyToClipboard(referralCode)}
                      className="transition-all duration-200"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Ou partagez votre lien d'invitation</h4>
                    <div className="flex items-center mb-2">
                      <Input 
                        value={referralLink} 
                        readOnly 
                        className="bg-white"
                      />
                      <Button 
                        variant="outline" 
                        className="ml-2"
                        onClick={() => copyToClipboard(referralLink)}
                      >
                        {copied ? "Copié !" : "Copier"}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Partagez sur les réseaux sociaux</h4>
                    <div className="flex justify-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => shareReferral('whatsapp')}>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                          <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375c-.99-1.576-1.516-3.391-1.516-5.26 0-5.445 4.455-9.885 9.942-9.885 2.654 0 5.145 1.035 7.021 2.91 1.875 1.859 2.909 4.35 2.909 6.99-.004 5.444-4.46 9.885-9.935 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411"/>
                        </svg>
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => shareReferral('telegram')}>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => shareReferral('instagram')}>
                        <Instagram className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => shareReferral('tiktok')}>
                        <TikTokIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => shareReferral('email')}>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border rounded-md p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-medium mb-1">Amis Invités</h3>
                    <p className="text-3xl font-bold">12</p>
                  </div>
                  <div className="border rounded-md p-4 text-center">
                    <Gift className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-medium mb-1">Récompenses Gagnées</h3>
                    <p className="text-3xl font-bold">8,000 FCFA</p>
                  </div>
                  <div className="border rounded-md p-4 text-center">
                    <Share2 className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-medium mb-1">Conversions</h3>
                    <p className="text-3xl font-bold">67%</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-4">Historique des parrainages</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b pb-3">
                      <div>
                        <p className="font-medium">Olivier K.</p>
                        <p className="text-sm text-gray-500">15 avril 2023</p>
                      </div>
                      <Badge>+1000 FCFA</Badge>
                    </div>
                    <div className="flex justify-between items-center border-b pb-3">
                      <div>
                        <p className="font-medium">Sophie M.</p>
                        <p className="text-sm text-gray-500">2 avril 2023</p>
                      </div>
                      <Badge>+1000 FCFA</Badge>
                    </div>
                    <div className="flex justify-between items-center border-b pb-3">
                      <div>
                        <p className="font-medium">Patrick N.</p>
                        <p className="text-sm text-gray-500">23 mars 2023</p>
                      </div>
                      <Badge>+1000 FCFA</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Driver Referral Tab */}
          <TabsContent value="driver" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Parrainez des livreurs et gagnez des commissions</CardTitle>
                <CardDescription>
                  Pour chaque livreur qui s'inscrit avec votre code et complète 5 livraisons, vous recevez une commission de 5000 FCFA et 1% sur leurs 3 premiers mois de livraison.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-primary/5 p-6 rounded-lg border text-center">
                  <h3 className="text-lg font-medium mb-2">Votre code de parrainage livreur</h3>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="text-2xl font-bold tracking-widest bg-white px-4 py-2 rounded-md border">
                      {referralCode + "DRV"}
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => copyToClipboard(referralCode + "DRV")}
                      className="transition-all duration-200"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Ou partagez votre lien d'invitation livreur</h4>
                    <div className="flex items-center mb-2">
                      <Input 
                        value={referralLink + "/driver"} 
                        readOnly 
                        className="bg-white"
                      />
                      <Button 
                        variant="outline" 
                        className="ml-2"
                        onClick={() => copyToClipboard(referralLink + "/driver")}
                      >
                        {copied ? "Copié !" : "Copier"}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border rounded-md p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-medium mb-1">Livreurs Invités</h3>
                    <p className="text-3xl font-bold">3</p>
                  </div>
                  <div className="border rounded-md p-4 text-center">
                    <Gift className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-medium mb-1">Commissions Gagnées</h3>
                    <p className="text-3xl font-bold">15,000 FCFA</p>
                  </div>
                  <div className="border rounded-md p-4 text-center">
                    <Share2 className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-medium mb-1">Conversion</h3>
                    <p className="text-3xl font-bold">100%</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-4">Historique des parrainages livreurs</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b pb-3">
                      <div>
                        <p className="font-medium">Jean B.</p>
                        <p className="text-sm text-gray-500">10 février 2023</p>
                      </div>
                      <Badge>+5000 FCFA</Badge>
                    </div>
                    <div className="flex justify-between items-center border-b pb-3">
                      <div>
                        <p className="font-medium">Pierre M.</p>
                        <p className="text-sm text-gray-500">5 février 2023</p>
                      </div>
                      <Badge>+5000 FCFA + 1%</Badge>
                    </div>
                    <div className="flex justify-between items-center border-b pb-3">
                      <div>
                        <p className="font-medium">Claude K.</p>
                        <p className="text-sm text-gray-500">15 janvier 2023</p>
                      </div>
                      <Badge>+5000 FCFA + 1%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
