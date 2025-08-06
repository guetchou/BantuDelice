import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icons from "../components/ui/IconLibrary";
import { Input } from "@/components/ui/input";

export default function Delivery() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);

  const restaurants = [
    {
      id: "rest1",
      name: "Le Gourmet Congolais",
      cuisine: "Cuisine congolaise",
      rating: 4.7,
      deliveryTime: "25-35 min",
      deliveryFee: "0 XAF",
      image: "🍽️",
      dishes: [
        { name: "Poulet Braisé", price: "2500 XAF", description: "Poulet braisé avec accompagnements" },
        { name: "Poisson Braisé", price: "3000 XAF", description: "Poisson frais braisé" },
        { name: "Foufou", price: "800 XAF", description: "Foufou traditionnel" }
      ]
    },
    {
      id: "rest2",
      name: "Saveurs d'Afrique",
      cuisine: "Panafricaine",
      rating: 4.5,
      deliveryTime: "30-40 min",
      deliveryFee: "500 XAF",
      image: "🌍",
      dishes: [
        { name: "Thiéboudienne", price: "2800 XAF", description: "Riz au poisson sénégalais" },
        { name: "Mafé", price: "2200 XAF", description: "Sauce à base d'arachide" },
        { name: "Attieke", price: "1200 XAF", description: "Attieke avec poisson" }
      ]
    },
    {
      id: "rest3",
      name: "Chez Matou",
      cuisine: "Fast Food",
      rating: 4.2,
      deliveryTime: "20-30 min",
      deliveryFee: "300 XAF",
      image: "🍔",
      dishes: [
        { name: "Burger Matou", price: "1800 XAF", description: "Burger avec frites" },
        { name: "Pizza Margherita", price: "2200 XAF", description: "Pizza traditionnelle" },
        { name: "Chicken Wings", price: "1500 XAF", description: "Ailes de poulet épicées" }
      ]
    }
  ];

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-cyan-600">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-white hover:text-blue-200 transition"
            >
              ← Retour à l'accueil
            </Button>
            <h1 className="text-2xl font-bold text-white">Livraison de Repas</h1>
            <div></div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Commandez vos repas en ligne
        </h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto">
          Livraison rapide de repas délicieux à votre porte
        </p>
      </section>

      {/* Search Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Input
            placeholder="Rechercher un restaurant ou une cuisine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/20 border-white/30 text-white placeholder:text-white/60 text-lg py-4"
          />
        </div>
      </section>

      {/* Restaurants Section */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          Restaurants disponibles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <Card 
              key={restaurant.id}
              className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all cursor-pointer"
              onClick={() => setSelectedRestaurant(restaurant.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="text-4xl">{restaurant.image}</div>
                  <div className="text-right">
                    <div className="text-yellow-400">⭐ {restaurant.rating}</div>
                    <div className="text-white/80 text-sm">{restaurant.deliveryTime}</div>
                  </div>
                </div>
                <CardTitle className="text-white text-xl">{restaurant.name}</CardTitle>
                <CardDescription className="text-white/80">{restaurant.cuisine}</CardDescription>
                <div className="text-white font-medium">Livraison: {restaurant.deliveryFee}</div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="text-white font-medium">Plats populaires:</h4>
                  {restaurant.dishes.slice(0, 2).map((dish, index) => (
                    <div key={index} className="text-white/80 text-sm">
                      • {dish.name} - {dish.price}
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full mt-4 bg-white text-blue-600 hover:bg-blue-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Ouverture du menu de ${restaurant.name}`);
                  }}
                >
                  Voir le menu
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Order Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center">Commande rapide</CardTitle>
            <CardDescription className="text-white/80 text-center">
              Commandez en quelques clics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-white font-medium">Adresse de livraison</label>
              <Input
                placeholder="Votre adresse complète"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-white font-medium">Téléphone</label>
              <Input
                placeholder="Votre numéro de téléphone"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>

            <Button 
              className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3"
              onClick={() => alert("Fonctionnalité de commande en cours de développement")}
            >
              Commencer ma commande
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Pourquoi choisir notre service de livraison ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
              <Icons.lightning className="w-5 h-5 mr-2" />
              Rapide
            </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Livraison en 20-40 minutes selon votre localisation</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
              <Icons.restaurant className="w-5 h-5 mr-2" />
              Frais
            </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Repas préparés à la commande par des restaurants partenaires</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
              <Icons.phone className="w-5 h-5 mr-2" />
              Facile
            </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Commande en ligne simple et suivi en temps réel</p>
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