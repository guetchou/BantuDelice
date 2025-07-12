
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import ProfileSummary from "@/components/profile/ProfileSummary";
import PersonalInfoForm from "@/components/profile/PersonalInfoForm";
import SecurityTab from "@/components/profile/SecurityTab";
import PreferencesTab from "@/components/profile/PreferencesTab";

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
          <ProfileSummary 
            user={user}
            onAvatarUpdate={handleAvatarUpdate}
          />
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
                  <PersonalInfoForm
                    user={user}
                    updating={updating}
                    onSubmit={handleUpdateProfile}
                    onInputChange={handleInputChange}
                    formData={formData}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <SecurityTab user={user} />
            </TabsContent>
            
            <TabsContent value="preferences">
              <PreferencesTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
