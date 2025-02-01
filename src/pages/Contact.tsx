import { useEffect } from "react";
import { Mail } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Contact() {
  usePageTitle({ title: "Contact" });

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <Mail className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Contactez-nous</h1>
      </div>
      
      <div className="grid gap-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Nos coordonnées</h2>
          <div className="space-y-2">
            <p>Email: contact@buntudelice.com</p>
            <p>Téléphone: +242 XX XXX XXX</p>
            <p>Adresse: Brazzaville, Congo</p>
          </div>
        </section>
      </div>
    </div>
  );
}