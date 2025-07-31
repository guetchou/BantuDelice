
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Checkout() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePayment = () => {
    // Simulation de paiement
    setTimeout(() => {
      alert("Paiement réussi ! Votre commande a été confirmée.");
      navigate('/profile');
    }, 2000);
  };

  const paymentMethods = [
    { id: "card", name: "Carte bancaire", icon: "💳" },
    { id: "mobile", name: "Mobile Money", icon: "📱" },
    { id: "cash", name: "Espèces", icon: "💰" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-blue-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={() => navigate('/cart')} className="text-white hover:text-orange-200 transition">← Retour au panier</Button>
            <h1 className="text-2xl font-bold text-white">Paiement</h1>
            <div></div>
          </div>
        </div>
      </header>

      {/* Étapes */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Indicateur d'étapes */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-white text-orange-600' : 'bg-white/20 text-white'}`}>1</div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-white' : 'bg-white/20'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-white text-orange-600' : 'bg-white/20 text-white'}`}>2</div>
            </div>
          </div>

          {step === 1 ? (
            /* Étape 1: Informations de commande */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Informations de commande</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input name="name" value={form.name} onChange={handleChange} placeholder="Nom complet" className="bg-white/20 border-white/30 text-white placeholder:text-white/60" required />
                  <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="bg-white/20 border-white/30 text-white placeholder:text-white/60" required />
                  <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Téléphone" className="bg-white/20 border-white/30 text-white placeholder:text-white/60" required />
                  <Input name="address" value={form.address} onChange={handleChange} placeholder="Adresse de livraison" className="bg-white/20 border-white/30 text-white placeholder:text-white/60" required />
                  <Button type="submit" className="w-full bg-white text-orange-600 hover:bg-orange-50 font-semibold py-3">Continuer</Button>
                </form>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">Résumé de la commande</h3>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-white">
                    <span>Poulet Braisé (x2)</span>
                    <span>5000 XAF</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Taxi Standard</span>
                    <span>1500 XAF</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Frais de livraison</span>
                    <span>500 XAF</span>
                  </div>
                  <div className="border-t border-white/20 pt-2">
                    <div className="flex justify-between text-white font-bold text-lg">
                      <span>Total</span>
                      <span>7000 XAF</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Étape 2: Paiement */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Méthode de paiement</h2>
                
                {/* Choix de la méthode */}
                <div className="space-y-4 mb-6">
                  {paymentMethods.map(method => (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === method.id ? 'border-white bg-white/20' : 'border-white/20 bg-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{method.icon}</span>
                        <span className="text-white font-semibold">{method.name}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Formulaire de carte */}
                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <Input name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="Numéro de carte" className="bg-white/20 border-white/30 text-white placeholder:text-white/60" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM/AA" className="bg-white/20 border-white/30 text-white placeholder:text-white/60" />
                      <Input name="cvv" value={form.cvv} onChange={handleChange} placeholder="CVV" className="bg-white/20 border-white/30 text-white placeholder:text-white/60" />
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <Button onClick={() => setStep(1)} variant="outline" className="flex-1 border-white text-white hover:bg-white hover:text-orange-600">
                    Retour
                  </Button>
                  <Button onClick={handlePayment} className="flex-1 bg-white text-orange-600 hover:bg-orange-50 font-semibold">
                    Payer 7000 XAF
                  </Button>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">Détails de la commande</h3>
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2">Informations client</h4>
                    <p className="text-white/80">{form.name}</p>
                    <p className="text-white/80">{form.email}</p>
                    <p className="text-white/80">{form.phone}</p>
                    <p className="text-white/80">{form.address}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2">Articles commandés</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-white/80">
                        <span>Poulet Braisé (x2)</span>
                        <span>5000 XAF</span>
                      </div>
                      <div className="flex justify-between text-white/80">
                        <span>Taxi Standard</span>
                        <span>1500 XAF</span>
                      </div>
                      <div className="flex justify-between text-white/80">
                        <span>Frais de livraison</span>
                        <span>500 XAF</span>
                      </div>
                      <div className="border-t border-white/20 pt-2">
                        <div className="flex justify-between text-white font-bold">
                          <span>Total</span>
                          <span>7000 XAF</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
