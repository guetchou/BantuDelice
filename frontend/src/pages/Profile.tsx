
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<unknown>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setForm({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || ""
      });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const updatedUser = { ...user, ...form };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    alert("Profil mis à jour avec succès !");
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const orders = [
    { id: 1, date: "2024-01-15", items: ["Poulet Braisé", "Taxi Standard"], total: 4000, status: "Livré" },
    { id: 2, date: "2024-01-10", items: ["Poisson Braisé"], total: 3000, status: "En cours" },
    { id: 3, date: "2024-01-05", items: ["Location Voiture"], total: 10000, status: "Terminé" }
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-blue-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={() => navigate('/')} className="text-white hover:text-orange-200 transition">← Retour à l'accueil</Button>
            <h1 className="text-2xl font-bold text-white">Mon Profil</h1>
            <Button variant="ghost" onClick={handleLogout} className="text-white hover:text-red-200">Déconnexion</Button>
          </div>
        </div>
      </header>

      {/* Contenu */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Onglets */}
          <div className="flex space-x-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-1 mb-8">
            <Button
              variant={activeTab === "profile" ? "default" : "ghost"}
              onClick={() => setActiveTab("profile")}
              className={`flex-1 ${activeTab === "profile" ? 'bg-white text-orange-600' : 'text-white hover:text-orange-200'}`}
            >
              Profil
            </Button>
            <Button
              variant={activeTab === "orders" ? "default" : "ghost"}
              onClick={() => setActiveTab("orders")}
              className={`flex-1 ${activeTab === "orders" ? 'bg-white text-orange-600' : 'text-white hover:text-orange-200'}`}
            >
              Commandes
            </Button>
            <Button
              variant={activeTab === "settings" ? "default" : "ghost"}
              onClick={() => setActiveTab("settings")}
              className={`flex-1 ${activeTab === "settings" ? 'bg-white text-orange-600' : 'text-white hover:text-orange-200'}`}
            >
              Paramètres
            </Button>
          </div>

          {/* Onglet Profil */}
          {activeTab === "profile" && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Informations personnelles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Nom complet</label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Téléphone</label>
                  <Input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Adresse</label>
                  <Input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  />
                </div>
              </div>
              <Button onClick={handleSave} className="mt-6 bg-white text-orange-600 hover:bg-orange-50 font-semibold">
                Sauvegarder les modifications
              </Button>
            </div>
          )}

          {/* Onglet Commandes */}
          {activeTab === "orders" && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Historique des commandes</h2>
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white/10 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-white font-semibold">Commande #{order.id}</h3>
                        <p className="text-white/60 text-sm">{order.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "Livré" ? "bg-green-500 text-white" :
                        order.status === "En cours" ? "bg-yellow-500 text-white" :
                        "bg-blue-500 text-white"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <p key={index} className="text-white/80">• {item}</p>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-semibold">Total: {order.total} XAF</span>
                        <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-orange-600">
                          Voir les détails
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Onglet Paramètres */}
          {activeTab === "settings" && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Paramètres</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">Notifications push</h3>
                    <p className="text-white/60 text-sm">Recevoir des notifications sur votre appareil</p>
                  </div>
                  <input type="checkbox" className="w-6 h-6" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">Notifications email</h3>
                    <p className="text-white/60 text-sm">Recevoir des emails de confirmation</p>
                  </div>
                  <input type="checkbox" className="w-6 h-6" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">Mode sombre</h3>
                    <p className="text-white/60 text-sm">Activer le thème sombre</p>
                  </div>
                  <input type="checkbox" className="w-6 h-6" />
                </div>
                <div className="pt-6 border-t border-white/20">
                  <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                    Supprimer mon compte
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
