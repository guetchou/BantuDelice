
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Copy, Share2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useColisAuth } from "@/context/ColisAuthContext";
import useFeature from "@/utils/featureFlags";

const ReferralProgram = () => {
  const { user } = useColisAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const isEnabled = useFeature('referral_program');
  
  // Generate a referral code based on email or user ID
  const referralCode = user 
    ? `BUNTUDELIVERY_${user.email?.substring(0, 5).toUpperCase()}${Math.floor(Math.random() * 1000)}` 
    : "BUNTUDELIVERY";
  const referralLink = `https://buntudelice.com/signup?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "Lien copié!",
      description: "Le lien de parrainage a été copié dans le presse-papiers.",
    });
    
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Rejoignez-moi sur Buntudelice!',
          text: 'Utilisez mon lien de parrainage pour obtenir une réduction sur votre première commande.',
          url: referralLink,
        });
      } catch (error) {
        console.error('Erreur de partage:', error);
      }
    } else {
      handleCopy();
    }
  };

  if (!isEnabled) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-600">
              <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 8V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M23 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Invitez vos amis</h3>
          <p className="text-gray-600 text-sm">Partagez votre code de parrainage avec vos amis et votre famille.</p>
        </Card>
        
        <Card className="p-6 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Ils s'inscrivent</h3>
          <p className="text-gray-600 text-sm">Lorsqu'ils utilisent votre code lors de leur inscription, vous recevez tous les deux un avantage.</p>
        </Card>
        
        <Card className="p-6 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-600">
              <path d="M12 1V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Gagnez des récompenses</h3>
          <p className="text-gray-600 text-sm">Obtenez 2 000 FCFA de crédit pour chaque ami qui s'inscrit et passe une commande.</p>
        </Card>
      </div>
      
      <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-center">Votre lien de parrainage</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input 
            value={referralLink} 
            readOnly 
            className="flex-1"
          />
          <Button 
            variant="outline" 
            onClick={handleCopy}
            className="flex items-center gap-2"
          >
            {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copié!" : "Copier"}
          </Button>
          <Button 
            onClick={handleShare}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Partager
          </Button>
        </div>
        
        <div className="mt-6 bg-white p-4 rounded border border-gray-200">
          <h4 className="text-sm font-medium mb-2">Code à partager</h4>
          <div className="text-xl font-mono font-bold text-center p-2 bg-gray-50 rounded">{referralCode}</div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Comment ça fonctionne</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Partagez votre code avec vos amis via les réseaux sociaux, e-mail ou SMS.</li>
          <li>Ils obtiennent 2 000 FCFA de réduction sur leur première commande.</li>
          <li>Vous recevez 2 000 FCFA de crédit après leur première commande.</li>
          <li>Pas de limite au nombre d'amis que vous pouvez parrainer!</li>
        </ol>
      </div>
    </div>
  );
};

export default ReferralProgram;
