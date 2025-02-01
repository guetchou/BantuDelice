import { useEffect } from "react";
import { Wallet as WalletIcon } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Wallet() {
  usePageTitle({ title: "Portefeuille" });

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <WalletIcon className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Portefeuille</h1>
      </div>
      
      <div className="grid gap-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Solde et transactions</h2>
          {/* Contenu à venir */}
        </section>
      </div>
    </div>
  );
}