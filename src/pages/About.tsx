import { useEffect } from "react";
import { User } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function About() {
  usePageTitle({ title: "À propos" });

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <User className="h-8 w-8" />
        <h1 className="text-3xl font-bold">À propos de BuntuDélice</h1>
      </div>
      
      <div className="grid gap-8">
        <section className="prose prose-lg max-w-none">
          <p>
            BuntuDélice est votre partenaire de confiance pour la livraison de repas
            congolais authentiques et services de qualité à Brazzaville.
          </p>
          {/* Plus de contenu à venir */}
        </section>
      </div>
    </div>
  );
}