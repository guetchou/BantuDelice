
import { useEffect, useState } from "react";
import { fetchClients } from "@/services/pocketbaseService";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface Client {
  id: string;
  nom: string;
  email: string;
  telephone: string;
}

export default function ClientsList() {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await fetchClients();
        setClients(data.items);
      } catch (err) {
        toast({
          title: "Erreur",
          description: err instanceof Error ? err.message : "Erreur lors du chargement des clients",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Liste des clients</h2>
      {clients.length === 0 ? (
        <p className="text-muted-foreground">Aucun client trouvé</p>
      ) : (
        <ul className="divide-y">
          {clients.map((client) => (
            <li key={client.id} className="py-4">
              <div className="flex flex-col">
                <span className="font-medium">{client.nom}</span>
                <span className="text-sm text-muted-foreground">{client.email}</span>
                <span className="text-sm text-muted-foreground">{client.telephone}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
