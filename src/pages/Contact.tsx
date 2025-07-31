import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icons from "../components/ui/IconLibrary";
import { Input } from "@/components/ui/input";

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    alert("Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
  };

  const contactInfo = [
    {
              icon: <Icons.email className="w-6 h-6" />,
      title: "Email",
      value: "contact@bantudelice.cg",
      description: "Réponse sous 24h"
    },
    {
              icon: <Icons.phoneCall className="w-6 h-6" />,
      title: "Téléphone",
      value: "+242 06 123 45 67",
      description: "Lun-Ven: 8h-18h"
    },
    {
              icon: <Icons.location className="w-6 h-6" />,
      title: "Adresse",
      value: "Brazzaville, Congo",
      description: "Siège social"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-600">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-white hover:text-purple-200 transition"
            >
              ← Retour à l'accueil
            </Button>
            <h1 className="text-2xl font-bold text-white">Contact</h1>
            <div></div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Contactez-nous
        </h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto">
          Nous sommes là pour vous aider. N'hésitez pas à nous contacter !
        </p>
      </section>

      {/* Contact Form and Info */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Envoyez-nous un message</CardTitle>
              <CardDescription className="text-white/80">
                Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-white font-medium">Nom complet *</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Votre nom"
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white font-medium">Email *</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="votre@email.com"
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-white font-medium">Téléphone</label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Votre numéro"
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white font-medium">Sujet</label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Sujet de votre message"
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-white font-medium">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Votre message..."
                    rows={5}
                    className="w-full bg-white/20 border border-white/30 text-white placeholder:text-white/60 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                    required
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-white text-purple-600 hover:bg-purple-50 font-semibold py-3"
                >
                  Envoyer le message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Informations de contact</CardTitle>
                <CardDescription className="text-white/80">
                  Retrouvez-nous ici
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="text-2xl">{info.icon}</div>
                    <div>
                      <h3 className="text-white font-medium">{info.title}</h3>
                      <p className="text-white/90">{info.value}</p>
                      <p className="text-white/60 text-sm">{info.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-xl">Horaires d'ouverture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-white/80">
                  <div className="flex justify-between">
                    <span>Lundi - Vendredi</span>
                    <span>8h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samedi</span>
                    <span>9h00 - 16h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimanche</span>
                    <span>10h00 - 14h00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Questions fréquentes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Comment fonctionne la livraison ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                Nos livreurs professionnels vous livrent en 20-40 minutes selon votre localisation. 
                Vous pouvez suivre votre commande en temps réel.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Quels sont les moyens de paiement ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                Nous acceptons les paiements en espèces, par carte bancaire, 
                et par mobile money (Airtel Money, M-Pesa).
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Comment réserver un taxi ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                Rendez-vous sur notre page taxi, indiquez votre point de départ et destination, 
                choisissez votre véhicule et confirmez la réservation.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Comment suivre mon colis ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                Utilisez le numéro de suivi fourni lors de l'expédition pour 
                suivre votre colis en temps réel sur notre plateforme.
              </p>
            </CardContent>
          </Card>
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