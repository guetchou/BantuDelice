import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LocationVoiture() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", vehicle: "citadine", date: "" });

  const vehicles = [
    { id: "citadine", name: "Citadine", price: "10 000 XAF/jour", icon: "🚗" },
    { id: "suv", name: "SUV", price: "18 000 XAF/jour", icon: "🚙" },
    { id: "van", name: "Van", price: "25 000 XAF/jour", icon: "🚐" }
  ];

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVehicleChange = (id: string) => {
    setForm({ ...form, vehicle: id });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Réservation enregistrée ! Nous vous contacterons rapidement.");
    setForm({ name: "", phone: "", vehicle: "citadine", date: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={() => navigate('/')} className="text-white hover:text-indigo-200 transition">← Retour à l'accueil</Button>
            <h1 className="text-2xl font-bold text-white">Location de voiture</h1>
            <div></div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Louez une voiture en toute simplicité</h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">Choisissez votre véhicule et réservez en ligne.</p>
      </section>

      {/* Formulaire de réservation */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-md border-white/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Réserver une voiture</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="name" value={form.name} onChange={handleFormChange} placeholder="Nom complet" className="bg-white/20 border-white/30 text-white placeholder:text-white/60" required />
            <Input name="phone" value={form.phone} onChange={handleFormChange} placeholder="Téléphone" className="bg-white/20 border-white/30 text-white placeholder:text-white/60" required />
            <Input name="date" value={form.date} onChange={handleFormChange} placeholder="Date de location" type="date" className="bg-white/20 border-white/30 text-white placeholder:text-white/60" required />
            <div className="flex gap-4">
              {vehicles.map(vehicle => (
                <div key={vehicle.id} onClick={() => handleVehicleChange(vehicle.id)} className={`flex-1 cursor-pointer p-4 rounded-xl border-2 transition-all ${form.vehicle === vehicle.id ? 'border-white bg-white/20' : 'border-white/20 bg-white/10'}`}>
                  <div className="text-3xl mb-2">{vehicle.icon}</div>
                  <div className="text-white font-bold">{vehicle.name}</div>
                  <div className="text-white/80 text-sm">{vehicle.price}</div>
                </div>
              ))}
            </div>
            <Button type="submit" className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-semibold py-3">Réserver</Button>
          </form>
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