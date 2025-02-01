import { useEffect } from "react";
import { Settings as SettingsIcon } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Settings() {
  usePageTitle({ title: "Paramètres" });

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <SettingsIcon className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Paramètres</h1>
      </div>
      
      <div className="grid gap-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Préférences de compte</h2>
          {/* Contenu à venir */}
        </section>
      </div>
    </div>
  );
}