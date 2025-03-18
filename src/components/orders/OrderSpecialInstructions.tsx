
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { OrderStatus } from '@/types/order';

interface OrderSpecialInstructionsProps {
  orderId: string;
  status: OrderStatus;
  userId?: string;
}

const OrderSpecialInstructions = ({ orderId, status, userId }: OrderSpecialInstructionsProps) => {
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const { toast } = useToast();

  const isAllowedToAddInstructions = 
    status === 'pending' || 
    status === 'accepted' || 
    status === 'preparing';

  const sendSpecialInstructions = async () => {
    if (!orderId || !specialInstructions.trim()) return;
    
    try {
      // First, check if a support_ticket exists for this order
      const { data: existingTicket, error: ticketCheckError } = await supabase
        .from('support_tickets')
        .select('id')
        .eq('order_id', orderId)
        .maybeSingle();
        
      if (ticketCheckError) throw ticketCheckError;
      
      let ticketId;
      
      if (existingTicket) {
        ticketId = existingTicket.id;
        
        // Add message to existing ticket
        const { error: messageError } = await supabase
          .from('support_messages')
          .insert({
            ticket_id: ticketId,
            message: specialInstructions,
            sender_type: 'customer'
          });
          
        if (messageError) throw messageError;
      } else {
        // Create a new ticket
        const { data: newTicket, error: createTicketError } = await supabase
          .from('support_tickets')
          .insert({
            order_id: orderId,
            subject: `Instructions spéciales pour commande #${orderId.slice(0, 8)}`,
            status: 'open',
            priority: 'medium',
            customer_id: userId
          })
          .select()
          .single();
          
        if (createTicketError) throw createTicketError;
        
        ticketId = newTicket.id;
        
        // Add the first message
        const { error: messageError } = await supabase
          .from('support_messages')
          .insert({
            ticket_id: ticketId,
            message: specialInstructions,
            sender_type: 'customer'
          });
          
        if (messageError) throw messageError;
      }
      
      // Update the orders table with the special instructions
      const { error: orderUpdateError } = await supabase
        .from('orders')
        .update({
          delivery_instructions: specialInstructions
        })
        .eq('id', orderId);
        
      if (orderUpdateError) throw orderUpdateError;
      
      toast({
        title: "Instructions envoyées",
        description: "Vos instructions spéciales ont été envoyées au restaurant",
      });
      
      setIsMessageDialogOpen(false);
      setSpecialInstructions('');
    } catch (error) {
      console.error('Error sending special instructions:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer vos instructions spéciales",
        variant: "destructive"
      });
    }
  };

  if (!isAllowedToAddInstructions) {
    return null;
  }

  return (
    <div className="mt-4">
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Ajouter des instructions spéciales
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Instructions spéciales</DialogTitle>
            <DialogDescription>
              Ajoutez des instructions spéciales pour votre commande ou le livreur
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Ex: Sonner au 3ème étage, préférence sur la cuisson, allergies..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={5}
              className="w-full"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={sendSpecialInstructions}>
              Envoyer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderSpecialInstructions;
