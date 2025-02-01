import { useEffect } from "react";
import { Info } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Help() {
  usePageTitle({ title: "Aide" });

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <Info className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Centre d'aide</h1>
      </div>
      
      <div className="grid gap-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Questions fréquentes</h2>
          {/* FAQ à venir */}
        </section>
      </div>
    </div>
  );
}