
import { useState } from "react";
import { addClient } from "@/services/pocketbaseService";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function AddClientForm() {
  const { toast } = useToast();
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const client = await addClient(nom, email, telephone);
      toast({
        title: "Client ajouté",
        description: `${client.record.nom} a été ajouté avec succès`,
      });
      // Reset form
      setNom("");
      setEmail("");
      setTelephone("");
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Erreur lors de l'ajout du client",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Ajouter un client</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div>
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div>
          <Input
            placeholder="Téléphone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </form>
    </Card>
  );
}
