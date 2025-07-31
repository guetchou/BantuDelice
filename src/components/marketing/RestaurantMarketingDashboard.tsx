
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, Star, Megaphone, TrendingUp, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function RestaurantMarketingDashboard() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    promotionType: 'percentage',
    value: '',
    startDate: '',
    endDate: '',
    isFeatured: false
  });
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    toast({
      title: "Promotion créée",
      description: "Votre promotion a été créée avec succès",
    });
    
    setFormData({
      title: '',
      description: '',
      promotionType: 'percentage',
      value: '',
      startDate: '',
      endDate: '',
      isFeatured: false
    });
  };
  
  return (
    <div className="space-y-8">
      <Tabs defaultValue="promotions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="featured">Mise en avant</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
        </TabsList>
        
        <TabsContent value="promotions" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-primary" />
                Créer une promotion
              </CardTitle>
              <CardDescription>
                Créez des promotions pour attirer plus de clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre de la promotion</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      placeholder="ex: Happy Hour, Menu du midi, etc."
                      value={formData.title}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      name="description"
                      placeholder="Décrivez votre promotion en quelques mots"
                      value={formData.description}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="promotionType">Type de promotion</Label>
                      <Select 
                        onValueChange={(value) => handleSelectChange('promotionType', value)}
                        defaultValue={formData.promotionType}
                      >
                        <SelectTrigger id="promotionType">
                          <SelectValue placeholder="Sélectionnez le type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Pourcentage de réduction</SelectItem>
                          <SelectItem value="fixed">Montant fixe</SelectItem>
                          <SelectItem value="free_delivery">Livraison gratuite</SelectItem>
                          <SelectItem value="buy_get">Achetez X, obtenez Y</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="value">Valeur</Label>
                      <Input 
                        id="value" 
                        name="value" 
                        placeholder={formData.promotionType === 'percentage' ? "ex: 15 (pour 15%)" : "ex: 1000 (FCFA)"}
                        value={formData.value}
                        onChange={handleFormChange}
                        type="number"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Date de début</Label>
                      <Input 
                        id="startDate" 
                        name="startDate" 
                        type="date" 
                        value={formData.startDate}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Date de fin</Label>
                      <Input 
                        id="endDate" 
                        name="endDate" 
                        type="date" 
                        value={formData.endDate}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="isFeatured" 
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => handleSwitchChange('isFeatured', checked)}
                    />
                    <Label htmlFor="isFeatured">Mettre en avant cette promotion (service payant)</Label>
                  </div>
                </div>
                
                <Button type="submit" className="w-full">Créer la promotion</Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Promotions actives</CardTitle>
              <CardDescription>Gérez vos promotions en cours</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Vous n'avez pas encore de promotions actives
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="featured" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Mise en avant de votre restaurant
              </CardTitle>
              <CardDescription>
                Augmentez votre visibilité en mettant en avant votre restaurant sur la page d'accueil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Options de mise en avant</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-2 border-primary">
                    <CardHeader className="pb-2">
                      <CardTitle>Pack Standard</CardTitle>
                      <CardDescription>7 jours de visibilité</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">5 000 FCFA</p>
                      <ul className="mt-4 space-y-2 text-sm">
                        <li className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                          Rotation sur la page d'accueil
                        </li>
                        <li className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                          Badge "Sponsorisé"
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Choisir</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="border-2 border-primary bg-primary/5">
                    <CardHeader className="pb-2">
                      <CardTitle>Pack Premium</CardTitle>
                      <CardDescription>15 jours de visibilité</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">10 000 FCFA</p>
                      <ul className="mt-4 space-y-2 text-sm">
                        <li className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                          Position prioritaire
                        </li>
                        <li className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                          Badge "Premium"
                        </li>
                        <li className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                          Email marketing
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Choisir</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Pack Elite</CardTitle>
                      <CardDescription>30 jours de visibilité</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">18 000 FCFA</p>
                      <ul className="mt-4 space-y-2 text-sm">
                        <li className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                          Position garantie en haut
                        </li>
                        <li className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                          Badge "Elite"
                        </li>
                        <li className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                          Email + notifications push
                        </li>
                        <li className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                          Story Instagram
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant="outline">Choisir</Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <h3 className="text-lg font-medium mb-2 text-amber-800">Sponsoriser des plats</h3>
                <p className="text-sm text-amber-700 mb-4">
                  Mettez en avant vos meilleurs plats pour augmenter leurs ventes
                </p>
                <Button variant="outline" className="w-full">
                  Sponsoriser un plat
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Clics sur promotions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Dernier mois</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Ventes via promotions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0 FCFA</div>
                <p className="text-xs text-muted-foreground">Dernier mois</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  ROI marketing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0%</div>
                <p className="text-xs text-muted-foreground">Dernier mois</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Statistiques marketing
              </CardTitle>
              <CardDescription>
                Aperçu de vos performances marketing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-muted rounded-lg">
                <p className="text-muted-foreground">
                  Les statistiques seront disponibles après votre première campagne
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Campagnes récentes</CardTitle>
              <CardDescription>Suivi de vos dernières campagnes marketing</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Vous n'avez pas encore de campagnes actives
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default RestaurantMarketingDashboard;
