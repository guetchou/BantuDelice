import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Bell, Shield, User, Moon, Sun, Palette, Globe, Phone } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Settings() {
  usePageTitle({ title: "Paramètres" });
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("fr");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotionalEmails, setPromotionalEmails] = useState(true);

  // Charger les préférences utilisateur
  useEffect(() => {
    const loadUserPreferences = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: preferences, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading preferences:', error);
        return;
      }

      if (preferences) {
        setDarkMode(preferences.dark_mode ?? false);
        setNotifications(preferences.notifications ?? true);
        setLanguage(preferences.language ?? "fr");
        setEmailNotifications(preferences.email_notifications ?? true);
        setPushNotifications(preferences.push_notifications ?? true);
        setOrderUpdates(preferences.order_updates ?? true);
        setPromotionalEmails(preferences.promotional_emails ?? true);
      }
    };

    loadUserPreferences();
  }, []);

  // Sauvegarder les préférences
  const savePreferences = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const preferences = {
      user_id: user.id,
      dark_mode: darkMode,
      notifications,
      language,
      email_notifications: emailNotifications,
      push_notifications: pushNotifications,
      order_updates: orderUpdates,
      promotional_emails: promotionalEmails,
    };

    const { error } = await supabase
      .from('user_preferences')
      .upsert(preferences, { onConflict: 'user_id' });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder vos préférences",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Vos préférences ont été sauvegardées",
      });
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <SettingsIcon className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Paramètres</h1>
      </div>
      
      <div className="grid gap-8 max-w-3xl">
        {/* Apparence */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Palette className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Apparence</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  <span className="font-medium">Mode sombre</span>
                </div>
                <p className="text-sm text-gray-500">
                  Ajuster l'apparence de l'application
                </p>
              </div>
              <Switch 
                checked={darkMode} 
                onCheckedChange={setDarkMode} 
              />
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Bell className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Notifications</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-medium">Notifications push</span>
                <p className="text-sm text-gray-500">
                  Recevoir des notifications sur votre appareil
                </p>
              </div>
              <Switch 
                checked={pushNotifications} 
                onCheckedChange={setPushNotifications} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-medium">Notifications par email</span>
                <p className="text-sm text-gray-500">
                  Recevoir des notifications par email
                </p>
              </div>
              <Switch 
                checked={emailNotifications} 
                onCheckedChange={setEmailNotifications} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-medium">Mises à jour des commandes</span>
                <p className="text-sm text-gray-500">
                  Suivi en temps réel de vos commandes
                </p>
              </div>
              <Switch 
                checked={orderUpdates} 
                onCheckedChange={setOrderUpdates} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-medium">Emails promotionnels</span>
                <p className="text-sm text-gray-500">
                  Recevoir des offres spéciales et promotions
                </p>
              </div>
              <Switch 
                checked={promotionalEmails} 
                onCheckedChange={setPromotionalEmails} 
              />
            </div>
          </div>
        </Card>

        {/* Langue */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Globe className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Langue</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-medium">Langue de l'application</span>
                <p className="text-sm text-gray-500">
                  Sélectionner votre langue préférée
                </p>
              </div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sélectionner la langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <div className="flex justify-end mt-6">
          <Button onClick={savePreferences} className="w-full md:w-auto">
            Sauvegarder les préférences
          </Button>
        </div>
      </div>
    </div>
  );
}
