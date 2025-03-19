
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Instagram, TikTok, Youtube, UserPlus, DollarSign, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";

export function ReferralProgram() {
  const { toast } = useToast();
  const { user } = useUser();
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState("USER" + Math.random().toString(36).substring(2, 8).toUpperCase());
  
  const handleCopyReferralLink = () => {
    const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "Lien copié!",
      description: "Le lien de parrainage a été copié dans le presse-papier",
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleShareOnSocial = (platform: string) => {
    const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;
    let shareUrl = '';
    
    switch(platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=Utilisez mon code ${referralCode} pour vous inscrire sur Buntudelice et obtenez une réduction! ${referralLink}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=Utilisez mon code ${referralCode} pour vous inscrire sur Buntudelice et obtenez une réduction!`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=Utilisez mon code ${referralCode} pour vous inscrire sur Buntudelice et obtenez une réduction! ${encodeURIComponent(referralLink)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          Programme de Parrainage
        </CardTitle>
        <CardDescription>
          Invitez vos amis et gagnez des récompenses pour chaque nouvel inscrit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user">Parrainage d'amis</TabsTrigger>
            <TabsTrigger value="driver">Parrainage de livreurs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="user" className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="text-sm font-medium">Votre code de parrainage</h4>
                  <p className="text-xs text-muted-foreground">Partagez ce code avec vos amis</p>
                </div>
                <Badge variant="outline" className="text-lg font-bold py-2">{referralCode}</Badge>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="referral-link">Lien de parrainage</Label>
                  <div className="flex mt-1.5">
                    <Input
                      id="referral-link"
                      value={`${window.location.origin}/signup?ref=${referralCode}`}
                      readOnly
                      className="rounded-r-none"
                    />
                    <Button
                      onClick={handleCopyReferralLink}
                      variant="secondary"
                      className="rounded-l-none"
                    >
                      {copied ? "Copié!" : "Copier"}
                    </Button>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-sm mb-3">Ou partagez directement sur</p>
                  <div className="flex justify-center gap-4">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleShareOnSocial('whatsapp')}
                      className="rounded-full bg-green-50 hover:bg-green-100 text-green-600"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleShareOnSocial('facebook')}
                      className="rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleShareOnSocial('twitter')}
                      className="rounded-full bg-sky-50 hover:bg-sky-100 text-sky-600"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h4 className="text-sm font-medium flex items-center gap-2 text-green-700">
                <DollarSign className="h-4 w-4" />
                Récompenses
              </h4>
              <ul className="mt-2 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="text-green-800">Recevez <strong>1000 FCFA</strong> pour chaque ami qui s'inscrit</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="text-green-800">Vos amis reçoivent <strong>500 FCFA</strong> sur leur première commande</span>
                </li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="driver" className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="text-sm font-medium">Parrainez un livreur</h4>
              <p className="text-xs text-muted-foreground mb-4">Aidez à développer notre réseau de livreurs et soyez récompensé</p>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="driver-name">Nom du livreur</Label>
                  <Input id="driver-name" placeholder="Nom complet" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="driver-phone">Téléphone</Label>
                  <Input id="driver-phone" placeholder="+237 612345678" className="mt-1.5" />
                </div>
                <Button className="w-full">Envoyer une invitation</Button>
              </div>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <h4 className="text-sm font-medium flex items-center gap-2 text-amber-700">
                <DollarSign className="h-4 w-4" />
                Bonus pour les livreurs
              </h4>
              <ul className="mt-2 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                  <span className="text-amber-800">Recevez <strong>3000 FCFA</strong> pour chaque livreur qui rejoint la plateforme</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                  <span className="text-amber-800">Bonus additionnel de <strong>1% des commissions</strong> pendant 3 mois</span>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Vous avez parrainé <strong className="text-primary">0</strong> ami(s) et <strong className="text-primary">0</strong> livreur(s)</p>
          <p className="text-xs text-muted-foreground mt-1">Total des récompenses gagnées: <strong>0 FCFA</strong></p>
        </div>
      </CardFooter>
    </Card>
  );
}

export default ReferralProgram;
