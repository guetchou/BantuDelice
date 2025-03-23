
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import ProfilePhotoUpload from "@/components/profile/ProfilePhotoUpload";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, Shield } from "lucide-react";

const Profile = () => {
  usePageTitle({ title: "Profil" });
  const navigate = useNavigate();
  const { user, loading, updateProfile } = useUser();
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    avatar_url: "",
  });

  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone: user.phone || "",
        avatar_url: user.avatar_url || "",
      });
    }
  }, [user, loading, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setUpdating(true);
    try {
      const { error } = await updateProfile(formData);
      
      if (error) {
        toast.error("Impossible de mettre à jour le profil");
        console.error("Error updating profile:", error);
      } else {
        toast.success("Profil mis à jour avec succès");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarUpdate = (url: string) => {
    setFormData(prev => ({ ...prev, avatar_url: url }));
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <ProfilePhotoUpload 
                  userId={user?.id || ""}
                  currentAvatarUrl={formData.avatar_url}
                  onUploadComplete={handleAvatarUpdate}
                />
                
                <div className="text-center">
                  <h2 className="text-xl font-semibold">
                    {user?.first_name} {user?.last_name}
                  </h2>
                  <p className="text-gray-500">{user?.email}</p>
                  
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {user?.role === 'admin' ? 'Administrateur' : 
                       user?.role === 'restaurant_owner' ? 'Propriétaire de restaurant' : 
                       user?.role === 'driver' ? 'Chauffeur' : 'Utilisateur'}
                    </span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="w-full space-y-2">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{user?.email}</span>
                  </div>
                  
                  {user?.phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm">
                    <Shield className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Compte créé le {new Date(user?.created_at || "").toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="personal">
            <TabsList className="w-full">
              <TabsTrigger value="personal" className="flex-1">Informations personnelles</TabsTrigger>
              <TabsTrigger value="security" className="flex-1">Sécurité</TabsTrigger>
              <TabsTrigger value="preferences" className="flex-1">Préférences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="first_name" className="text-sm font-medium">
                          Prénom
                        </label>
                        <Input
                          id="first_name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          placeholder="Prénom"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="last_name" className="text-sm font-medium">
                          Nom
                        </label>
                        <Input
                          id="last_name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          placeholder="Nom"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="email"
                        value={user?.email}
                        disabled
                        className="bg-gray-100"
                      />
                      <p className="text-xs text-gray-500">L'email ne peut pas être modifié</p>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Téléphone
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+242 XX XXX XXX"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button type="submit" disabled={updating} className="w-full md:w-auto">
                        {updating ? "Mise à jour..." : "Mettre à jour le profil"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité du compte</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Changer de mot de passe</h3>
                      <p className="text-sm text-gray-500">
                        Pour des raisons de sécurité, veuillez contacter l'administrateur pour changer votre mot de passe.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Connexions récentes</h3>
                      <p className="text-sm text-gray-500">
                        Dernière connexion: {user && user?.last_login ? new Date(user.last_login).toLocaleDateString() + ' à ' + new Date(user.last_login).toLocaleTimeString() : 'Inconnue'}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Statut du compte</h3>
                      <div className="flex items-center space-x-2">
                        <div className={`h-3 w-3 rounded-full ${user?.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span>{user?.status === 'active' ? 'Actif' : 'Inactif'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Vous pouvez gérer vos préférences d'application et de notifications dans la section Paramètres.
                  </p>
                  
                  <Button variant="outline" onClick={() => navigate('/settings')}>
                    Aller aux paramètres
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
