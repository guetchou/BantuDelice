
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, YoutubeIcon, Twitter, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const InfluencerCampaigns = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    platform: "",
    followers: "",
    message: "",
    socialLink: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulaire soumis:", formData);
    
    // Simulation d'envoi du formulaire
    setTimeout(() => {
      toast({
        title: "Demande envoyée!",
        description: "Notre équipe examinera votre candidature et vous contactera sous peu.",
      });
      
      // Réinitialiser le formulaire
      setFormData({
        name: "",
        email: "",
        platform: "",
        followers: "",
        message: "",
        socialLink: ""
      });
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="overflow-hidden">
          <div className="h-3 bg-pink-500"></div>
          <CardContent className="pt-6">
            <div className="flex justify-center mb-4">
              <Instagram className="h-10 w-10 text-pink-500" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">Instagram</h3>
            <p className="text-sm text-gray-600 text-center">Partagez vos expériences culinaires avec votre communauté.</p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <div className="h-3 bg-red-500"></div>
          <CardContent className="pt-6">
            <div className="flex justify-center mb-4">
              <YoutubeIcon className="h-10 w-10 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">YouTube</h3>
            <p className="text-sm text-gray-600 text-center">Créez des vidéos d'unboxing de nos plats et services.</p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <div className="h-3 bg-blue-400"></div>
          <CardContent className="pt-6">
            <div className="flex justify-center mb-4">
              <Twitter className="h-10 w-10 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">Twitter</h3>
            <p className="text-sm text-gray-600 text-center">Partagez votre expérience en temps réel avec vos abonnés.</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-6 text-center">Ce que nous offrons</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-orange-100 rounded-full p-2 mt-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-500">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h4 className="font-medium">Commissions sur ventes</h4>
              <p className="text-sm text-gray-600">Gagnez jusqu'à 10% sur les commandes effectuées via votre lien.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-orange-100 rounded-full p-2 mt-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-500">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h4 className="font-medium">Repas et services gratuits</h4>
              <p className="text-sm text-gray-600">Testez nos services premium pour vos contenus.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-orange-100 rounded-full p-2 mt-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-500">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h4 className="font-medium">Code promo exclusif</h4>
              <p className="text-sm text-gray-600">Offrez une réduction spéciale à votre audience.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-orange-100 rounded-full p-2 mt-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-500">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h4 className="font-medium">Mise en avant</h4>
              <p className="text-sm text-gray-600">Promotion de votre profil sur nos réseaux et notre app.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Devenir Influenceur Partenaire</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Nom</label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="platform" className="block text-sm font-medium mb-1">Plateforme principale</label>
              <Input 
                id="platform" 
                name="platform" 
                placeholder="Instagram, YouTube, TikTok, etc." 
                value={formData.platform} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="followers" className="block text-sm font-medium mb-1">Nombre d'abonnés</label>
              <Input 
                id="followers" 
                name="followers" 
                type="number" 
                value={formData.followers} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="socialLink" className="block text-sm font-medium mb-1">Lien de votre profil</label>
              <div className="flex gap-2">
                <Input 
                  id="socialLink" 
                  name="socialLink" 
                  placeholder="https://" 
                  value={formData.socialLink} 
                  onChange={handleChange} 
                  required 
                />
                {formData.socialLink && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={() => window.open(formData.socialLink, '_blank')}
                  >
                    <Link className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="message" className="block text-sm font-medium mb-1">Comment souhaitez-vous collaborer?</label>
              <Textarea 
                id="message" 
                name="message" 
                rows={4} 
                value={formData.message} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full">Envoyer ma candidature</Button>
        </form>
      </div>
    </div>
  );
};

export default InfluencerCampaigns;
