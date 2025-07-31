import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Restaurant() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const restaurants = [
    { name: "Le Gourmet Congolais", cuisine: "Congolaise", rating: 4.7, icon: "🍽️" },
    { name: "Saveurs d'Afrique", cuisine: "Panafricaine", rating: 4.5, icon: "🌍" },
    { name: "Chez Matou", cuisine: "Fast Food", rating: 4.2, icon: "🍔" }
  ];

  const filtered = restaurants.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.cuisine.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={() => navigate('/')} className="text-white hover:text-orange-200 transition">← Retour à l'accueil</Button>
            <h1 className="text-2xl font-bold text-white">Restaurants</h1>
            <div></div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Découvrez les meilleurs restaurants</h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">Commandez vos plats préférés en quelques clics.</p>
      </section>

      {/* Recherche et liste */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto mb-8">
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un restaurant ou une cuisine..." className="bg-white/20 border-white/30 text-white placeholder:text-white/60 text-lg py-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.length > 0 ? filtered.map((r, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md border-white/20 rounded-2xl p-6 text-center cursor-pointer hover:bg-white/20 transition-all">
              <div className="text-5xl mb-2">{r.icon}</div>
              <div className="text-xl font-bold text-white mb-1">{r.name}</div>
              <div className="text-white/80 mb-2">{r.cuisine}</div>
              <div className="text-yellow-400">{r.rating} ⭐</div>
              <Button className="mt-4 w-full bg-white text-orange-600 hover:bg-orange-100">Voir le menu</Button>
            </div>
          )) : <p className="text-white text-center col-span-full">Aucun restaurant trouvé.</p>}
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