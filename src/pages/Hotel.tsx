import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Hotel() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const hotels = [
    { name: "Hôtel du Fleuve", location: "Brazzaville", rating: 4.8, icon: "🏨" },
    { name: "Palace Congo", location: "Pointe-Noire", rating: 4.6, icon: "🏝️" },
    { name: "Résidence Maya", location: "Brazzaville", rating: 4.3, icon: "🏠" }
  ];

  const filtered = hotels.filter(h => h.name.toLowerCase().includes(search.toLowerCase()) || h.location.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-600">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={() => navigate('/')} className="text-white hover:text-purple-200 transition">← Retour à l'accueil</Button>
            <h1 className="text-2xl font-bold text-white">Hôtels</h1>
            <div></div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Trouvez et réservez un hôtel</h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">Comparez les meilleurs hôtels et réservez en ligne.</p>
      </section>

      {/* Recherche et liste */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto mb-8">
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un hôtel ou une ville..." className="bg-white/20 border-white/30 text-white placeholder:text-white/60 text-lg py-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.length > 0 ? filtered.map((h, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md border-white/20 rounded-2xl p-6 text-center cursor-pointer hover:bg-white/20 transition-all">
              <div className="text-5xl mb-2">{h.icon}</div>
              <div className="text-xl font-bold text-white mb-1">{h.name}</div>
              <div className="text-white/80 mb-2">{h.location}</div>
              <div className="text-yellow-400">{h.rating} ⭐</div>
              <Button className="mt-4 w-full bg-white text-purple-600 hover:bg-purple-100">Réserver</Button>
            </div>
          )) : <p className="text-white text-center col-span-full">Aucun hôtel trouvé.</p>}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-md border-t border-white/20 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white/80">
            <p>&copy; 2024 Bantudelice. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 