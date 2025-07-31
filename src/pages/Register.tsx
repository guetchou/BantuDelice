
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icons from "../components/ui/IconLibrary";

const userTypes = [
  {
    id: 'customer',
    name: 'Client',
    description: 'Commandez des services et des produits',
    icon: <Icons.star className="w-8 h-8" />,
  },
  {
    id: 'driver',
    name: 'Chauffeur',
    description: 'Livrez des commandes et transportez des passagers',
    icon: <Icons.car className="w-8 h-8" />,
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    description: 'Vendez vos plats et gérez vos commandes',
    icon: <Icons.restaurant className="w-8 h-8" />,
  },
  {
    id: 'business',
    name: 'Commerce',
    description: 'Vendez vos produits en ligne',
    icon: <Icons.shopping className="w-8 h-8" />,
  },
  {
    id: 'beauty',
    name: 'Beauté',
    description: 'Services de coiffure, manucure, etc.',
    icon: <Icons.scissors className="w-8 h-8" />,
  },
  {
    id: 'technical',
    name: 'Technique',
    description: 'Plomberie, électricité, réparation',
    icon: <Icons.wrench className="w-8 h-8" />,
  },
  {
    id: 'entertainment',
    name: 'Divertissement',
    description: 'Musique, événements, loisirs',
    icon: <Icons.music className="w-8 h-8" />,
  },
  {
    id: 'legal',
    name: 'Juridique',
    description: 'Services juridiques et administratifs',
    icon: <Icons.scale className="w-8 h-8" />,
  },
];

const businessCategories = [
  { id: 'all', name: 'Tous les profils', icon: <Icons.star className="w-5 h-5" /> },
  { id: 'Livraison', name: 'Livraison', icon: <Icons.car className="w-5 h-5" /> },
  { id: 'Alimentation', name: 'Alimentation', icon: <Icons.restaurant className="w-5 h-5" /> },
  { id: 'Commerce', name: 'Commerce', icon: <Icons.shopping className="w-5 h-5" /> },
  { id: 'Beaute', name: 'Beauté', icon: <Icons.scissors className="w-5 h-5" /> },
  { id: 'Technique', name: 'Technique', icon: <Icons.wrench className="w-5 h-5" /> },
];

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedUserType, setSelectedUserType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    businessAddress: "",
    businessDescription: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUserTypeSelect = (userType: string) => {
    setSelectedUserType(userType);
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log("Registration data:", { selectedUserType, selectedCategory, formData });
    navigate("/login");
  };

  const filteredUserTypes = selectedCategory === 'all' 
    ? userTypes 
    : userTypes.filter(type => {
        if (selectedCategory === 'Livraison') return type.id === 'driver';
        if (selectedCategory === 'Alimentation') return type.id === 'restaurant';
        if (selectedCategory === 'Commerce') return type.id === 'business';
        if (selectedCategory === 'Beaute') return type.id === 'beauty';
        if (selectedCategory === 'Technique') return type.id === 'technical';
        return true;
      });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-blue-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Créer votre compte</h1>
            <p className="text-xl text-white/90">
              Rejoignez BantuDelice et commencez à utiliser nos services
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 1 ? 'bg-white text-blue-600' : 'bg-white/20 text-white'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 ${
                step >= 2 ? 'bg-white' : 'bg-white/20'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 2 ? 'bg-white text-blue-600' : 'bg-white/20 text-white'
              }`}>
                2
              </div>
            </div>
          </div>

          {step === 1 && (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl text-center">
                  Choisissez votre profil
                </CardTitle>
                <CardDescription className="text-white/80 text-center">
                  Sélectionnez le type de compte qui correspond à vos besoins
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Category Filter */}
                <div className="mb-6">
                  <Label className="text-white mb-2 block">Filtrer par catégorie</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-white/20 border-white/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {businessCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center">
                            <span className="mr-2">{category.icon}</span>
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* User Types Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredUserTypes.map((userType) => (
                    <div
                      key={userType.id}
                      onClick={() => handleUserTypeSelect(userType.id)}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 cursor-pointer hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="text-center">
                        <div className="flex justify-center mb-4 text-white">
                          {userType.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {userType.name}
                        </h3>
                        <p className="text-white/80 text-sm">
                          {userType.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl text-center">
                  Informations personnelles
                </CardTitle>
                <CardDescription className="text-white/80 text-center">
                  Complétez vos informations pour finaliser votre inscription
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-white">Nom complet</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder-white/50"
                        placeholder="Votre nom complet"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder-white/50"
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-white">Téléphone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder-white/50"
                        placeholder="+242 06 123 45 67"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="password" className="text-white">Mot de passe</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder-white/50"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword" className="text-white">Confirmer le mot de passe</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder-white/50"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  {/* Business-specific fields */}
                  {selectedUserType !== 'customer' && (
                    <div className="space-y-6 border-t border-white/20 pt-6">
                      <h3 className="text-lg font-semibold text-white">Informations professionnelles</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="businessName" className="text-white">Nom de l'entreprise</Label>
                          <Input
                            id="businessName"
                            type="text"
                            value={formData.businessName}
                            onChange={(e) => handleInputChange("businessName", e.target.value)}
                            className="bg-white/20 border-white/30 text-white placeholder-white/50"
                            placeholder="Nom de votre entreprise"
                          />
                        </div>
                        <div>
                          <Label htmlFor="businessAddress" className="text-white">Adresse</Label>
                          <Input
                            id="businessAddress"
                            type="text"
                            value={formData.businessAddress}
                            onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                            className="bg-white/20 border-white/30 text-white placeholder-white/50"
                            placeholder="Adresse de votre entreprise"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="businessDescription" className="text-white">Description</Label>
                          <textarea
                            id="businessDescription"
                            value={formData.businessDescription}
                            onChange={(e) => handleInputChange("businessDescription", e.target.value)}
                            className="w-full bg-white/20 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 resize-none"
                            rows={3}
                            placeholder="Décrivez vos services..."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="border-white text-white hover:bg-white hover:text-blue-600"
                    >
                      Retour
                    </Button>
                    <Button
                      type="submit"
                      className="bg-white text-blue-600 hover:bg-blue-50"
                    >
                      Créer mon compte
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
