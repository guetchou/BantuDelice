import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import apiService from "@/services/api";
import { FileText, Download } from "lucide-react";

interface Invoice {
  id: string;
  amount: number;
  status: string;
  invoice_number: string;
  created_at: string;
  due_date: string;
}

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data: { user } } = await apiService.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from("invoices")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (data) setInvoices(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des factures:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleDownload = (invoice: Invoice) => {
    // Logique de téléchargement à implémenter
    console.log("Téléchargement de la facture:", invoice.invoice_number);
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Factures</h1>
      <div className="space-y-4">
        {invoices.map((invoice) => (
          <Card key={invoice.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileText className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-medium">Facture #{invoice.invoice_number}</p>
                  <p className="text-sm text-muted-foreground">
                    Émise le {new Date(invoice.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Échéance le {new Date(invoice.due_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  {invoice.amount.toLocaleString()} XAF
                </p>
                <p className={`text-sm ${
                  invoice.status === "paid" ? "text-green-500" : "text-amber-500"
                }`}>
                  {invoice.status === "paid" ? "Payée" : "En attente"}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleDownload(invoice)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Invoices;