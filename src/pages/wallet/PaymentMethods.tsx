import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Plus, Trash2 } from "lucide-react";

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expMonth: string;
  expYear: string;
}

const PaymentMethods = () => {
  const { toast } = useToast();
  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "visa",
      last4: "4242",
      expMonth: "12",
      expYear: "24",
    },
  ]);

  const handleAddCard = () => {
    toast({
      title: "Carte ajoutée",
      description: "Votre carte a été ajoutée avec succès",
    });
  };

  const handleDeleteCard = (id: string) => {
    toast({
      title: "Carte supprimée",
      description: "Votre carte a été supprimée avec succès",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Moyens de paiement</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une carte
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle carte</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Numéro de carte
                </label>
                <Input placeholder="4242 4242 4242 4242" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Date d'expiration
                  </label>
                  <Input placeholder="MM/YY" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">CVC</label>
                  <Input placeholder="123" />
                </div>
              </div>
              <Button className="w-full" onClick={handleAddCard}>
                Ajouter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <Card key={method.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CreditCard className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-medium capitalize">{method.type}</p>
                  <p className="text-sm text-muted-foreground">
                    **** **** **** {method.last4}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Expire {method.expMonth}/{method.expYear}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteCard(method.id)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;