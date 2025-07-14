import { useEffect } from "react";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Clock, MessageCircle } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Contact() {
  usePageTitle({ title: "Contact" });
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Ici, tu pourrais envoyer les données à un backend ou un service externe
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 pb-12">
      {/* Header visuel */}
      <div className="relative flex flex-col items-center justify-center py-12 mb-10 bg-gradient-to-r from-orange-500 to-pink-500 shadow-lg rounded-b-3xl">
        <div className="bg-white/20 rounded-full p-4 mb-4 shadow-lg animate-bounce">
          <Mail className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow mb-2">Contactez-nous</h1>
        <p className="text-white/90 text-lg max-w-2xl text-center">Une question, une suggestion ou besoin d'aide ? Notre équipe est à votre écoute !</p>
      </div>
      <div className="flex justify-center mb-8">
        <Button
          variant="outline"
          className="text-orange-600 border-orange-400 hover:bg-orange-50"
          onClick={() => navigate("/")}
        >
          Retour à l'accueil
        </Button>
      </div>
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
        {/* Coordonnées & Réseaux */}
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Nos coordonnées</h2>
            <div className="space-y-2 bg-white/80 rounded-lg shadow p-4">
              <p className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary" /> <span className="font-medium">contact@buntudelice.com</span></p>
              <p className="flex items-center gap-2"><Phone className="h-5 w-5 text-primary" /> <span className="font-medium">+242 XX XXX XXX</span></p>
              <p className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> <span className="font-medium">Brazzaville, Congo</span></p>
            </div>
          </section>
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Horaires d'ouverture</h2>
            <div className="flex items-center gap-2 text-orange-600 font-medium">
              <Clock className="h-5 w-5 text-primary" />
              <span>Lundi - Samedi : 8h00 - 20h00</span>
            </div>
            <div className="flex items-center gap-2 text-orange-600 font-medium">
              <Clock className="h-5 w-5 text-primary" />
              <span>Dimanche : 10h00 - 18h00</span>
            </div>
          </section>
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Réseaux sociaux</h2>
            <div className="flex gap-4 bg-white/80 rounded-lg shadow p-3">
              <a href="https://facebook.com/buntudelice" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-transform hover:scale-110"><Facebook className="h-6 w-6" /></a>
              <a href="https://instagram.com/buntudelice" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-transform hover:scale-110"><Instagram className="h-6 w-6" /></a>
              <a href="https://twitter.com/buntudelice" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-transform hover:scale-110"><Twitter className="h-6 w-6" /></a>
              <a href="https://wa.me/242XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition-transform hover:scale-110"><MessageCircle className="h-6 w-6" /></a>
            </div>
            <div className="mt-2">
              <a href="https://wa.me/242XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded shadow transition">
                <MessageCircle className="h-5 w-5" />
                Discuter sur WhatsApp
              </a>
            </div>
          </section>
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Nous trouver</h2>
            <div className="rounded-lg overflow-hidden shadow-lg border-4 border-orange-100">
              <iframe
                title="Carte Buntudelice"
                src="https://www.google.com/maps?q=Brazzaville,Congo&output=embed"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </section>
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">FAQ</h2>
            <div className="space-y-2 text-gray-700">
              <details className="bg-white/80 rounded p-3 shadow transition-all">
                <summary className="font-medium cursor-pointer">Comment puis-je passer une commande ?</summary>
                <p className="mt-2">Vous pouvez passer commande directement sur notre site ou via notre application mobile.</p>
              </details>
              <details className="bg-white/80 rounded p-3 shadow transition-all">
                <summary className="font-medium cursor-pointer">Quels sont les moyens de paiement acceptés ?</summary>
                <p className="mt-2">Nous acceptons les paiements par carte bancaire, mobile money et espèces à la livraison.</p>
              </details>
              <details className="bg-white/80 rounded p-3 shadow transition-all">
                <summary className="font-medium cursor-pointer">Livrez-vous partout à Brazzaville ?</summary>
                <p className="mt-2">Oui, nous couvrons toute la ville de Brazzaville et ses environs.</p>
              </details>
              <details className="bg-white/80 rounded p-3 shadow transition-all">
                <summary className="font-medium cursor-pointer">Comment contacter le support ?</summary>
                <p className="mt-2">Vous pouvez utiliser ce formulaire, nous écrire sur WhatsApp ou appeler notre numéro de support.</p>
              </details>
            </div>
          </section>
          <section className="space-y-2 text-xs text-gray-500">
            <p>Notre site est accessible aux personnes en situation de handicap. Pour toute demande d'accessibilité, contactez-nous.</p>
          </section>
        </div>
        {/* Formulaire de contact */}
        <div>
          <div className="bg-white/90 rounded-2xl shadow-2xl p-8 border border-orange-100">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Formulaire de contact</h2>
            {submitted ? (
              <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow mb-4 animate-fade-in">
                Merci pour votre message ! Nous vous répondrons rapidement.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block font-medium mb-1">Nom</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-orange-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/60 bg-orange-50"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block font-medium mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-orange-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/60 bg-orange-50"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block font-medium mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full border border-orange-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/60 bg-orange-50"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold px-6 py-3 rounded shadow hover:from-orange-600 hover:to-pink-600 transition"
                >
                  Envoyer
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}