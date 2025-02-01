import { useEffect } from "react";
import { FileText } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Legal() {
  usePageTitle({ title: "Mentions légales" });

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <FileText className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Mentions légales</h1>
      </div>
      
      <div className="grid gap-8">
        <section className="prose prose-lg max-w-none">
          <h2>Conditions Générales d'Utilisation</h2>
          {/* CGU à venir */}
          
          <h2>Politique de confidentialité</h2>
          {/* Politique de confidentialité à venir */}
          
          <h2>Conditions Générales de Vente</h2>
          {/* CGV à venir */}
        </section>
      </div>
    </div>
  );
}