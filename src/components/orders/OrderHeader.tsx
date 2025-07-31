
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrderHeaderProps {
  orderId: string;
  restaurantName?: string;
}

const OrderHeader = ({ orderId, restaurantName }: OrderHeaderProps) => {
  const { toast } = useToast();
  
  const shareTracking = () => {
    if (navigator.share) {
      navigator.share({
        title: `Suivi de commande #${orderId.substring(0, 8)}`,
        text: `Suivez ma commande ${restaurantName ? `chez ${restaurantName}` : ''} en temps réel!`,
        url: window.location.href
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          toast({
            title: 'Lien copié',
            description: 'Le lien de suivi a été copié dans votre presse-papier',
          });
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
        });
    }
  };

  return (
    <div className="flex justify-between items-center">
      <Button asChild variant="ghost" className="p-0 hover:bg-transparent">
        <Link to="/orders" className="flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux commandes
        </Link>
      </Button>
      <Button variant="outline" size="sm" onClick={shareTracking}>
        <Share2 className="h-4 w-4 mr-2" />
        Partager
      </Button>
    </div>
  );
};

export default OrderHeader;
