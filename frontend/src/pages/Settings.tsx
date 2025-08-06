import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Palette, 
  Smartphone,
  Mail,
  MapPin,
  Eye,
  EyeOff,
  Save,
  Trash2
} from 'lucide-react';

const Settings: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    locationSharing: true,
    dataAnalytics: true
  });

  const [language, setLanguage] = useState('fr');
  const [theme, setTheme] = useState('light');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres</h1>
            <p className="text-gray-600">Gérez vos préférences et votre compte</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Navigation latérale */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <nav className="space-y-2">
                    <a href="#profile" className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 text-orange-700 font-medium">
                      <User className="h-5 w-5" />
                      Profil
                    </a>
                    <a href="#notifications" className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50">
                      <Bell className="h-5 w-5" />
                      Notifications
                    </a>
                    <a href="#privacy" className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50">
                      <Shield className="h-5 w-5" />
                      Confidentialité
                    </a>
                    <a href="#preferences" className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50">
                      <Globe className="h-5 w-5" />
                      Préférences
                    </a>
                    <a href="#security" className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50">
                      <Shield className="h-5 w-5" />
                      Sécurité
                    </a>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Contenu principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profil */}
              <Card className="border-0 shadow-lg" id="profile">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informations du profil
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input id="firstName" placeholder="Votre prénom" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input id="lastName" placeholder="Votre nom" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="votre@email.com" />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" placeholder="+242 XXX XXX XXX" />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <Input id="address" placeholder="Votre adresse complète" />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Ville</Label>
                      <Input id="city" placeholder="Votre ville" />
                    </div>
                    <div>
                      <Label htmlFor="country">Pays</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="congo">Congo</SelectItem>
                          <SelectItem value="rdc">RDC</SelectItem>
                          <SelectItem value="cameroun">Cameroun</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder les modifications
                  </Button>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card className="border-0 shadow-lg" id="notifications">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Préférences de notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Notifications par email</Label>
                        <p className="text-sm text-gray-600">Recevoir les notifications importantes par email</p>
                      </div>
                      <Switch 
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Notifications push</Label>
                        <p className="text-sm text-gray-600">Recevoir les notifications sur votre appareil</p>
                      </div>
                      <Switch 
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Notifications SMS</Label>
                        <p className="text-sm text-gray-600">Recevoir les notifications par SMS</p>
                      </div>
                      <Switch 
                        checked={notifications.sms}
                        onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Emails marketing</Label>
                        <p className="text-sm text-gray-600">Recevoir les offres et promotions</p>
                      </div>
                      <Switch 
                        checked={notifications.marketing}
                        onCheckedChange={(checked) => setNotifications({...notifications, marketing: checked})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Confidentialité */}
              <Card className="border-0 shadow-lg" id="privacy">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Paramètres de confidentialité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Visibilité du profil</Label>
                    <Select value={privacy.profileVisibility} onValueChange={(value) => setPrivacy({...privacy, profileVisibility: value})}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="friends">Amis uniquement</SelectItem>
                        <SelectItem value="private">Privé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Partage de localisation</Label>
                      <p className="text-sm text-gray-600">Autoriser le partage de votre position</p>
                    </div>
                    <Switch 
                      checked={privacy.locationSharing}
                      onCheckedChange={(checked) => setPrivacy({...privacy, locationSharing: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Analyses de données</Label>
                      <p className="text-sm text-gray-600">Autoriser l'analyse de vos données d'utilisation</p>
                    </div>
                    <Switch 
                      checked={privacy.dataAnalytics}
                      onCheckedChange={(checked) => setPrivacy({...privacy, dataAnalytics: checked})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Préférences */}
              <Card className="border-0 shadow-lg" id="preferences">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Préférences générales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Langue</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ln">Lingala</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-base font-medium">Thème</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Clair</SelectItem>
                        <SelectItem value="dark">Sombre</SelectItem>
                        <SelectItem value="auto">Automatique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Sécurité */}
              <Card className="border-0 shadow-lg" id="security">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Sécurité du compte
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <div className="relative mt-2">
                      <Input 
                        id="currentPassword" 
                        type={showPassword ? "text" : "password"}
                        placeholder="Votre mot de passe actuel"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <Input 
                      id="newPassword" 
                      type="password"
                      placeholder="Votre nouveau mot de passe"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password"
                      placeholder="Confirmez votre nouveau mot de passe"
                      className="mt-2"
                    />
                  </div>
                  
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Save className="h-4 w-4 mr-2" />
                    Changer le mot de passe
                  </Button>
                </CardContent>
              </Card>

              {/* Suppression de compte */}
              <Card className="border-0 shadow-lg border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <Trash2 className="h-5 w-5" />
                    Zone dangereuse
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Une fois que vous supprimez votre compte, il n'y a pas de retour en arrière. 
                    Veuillez être certain.
                  </p>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer mon compte
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
