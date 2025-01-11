import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      await fetchProfile(user.id);
    };

    getUser();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le profil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !profile) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-cyan-900 flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-cyan-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 glass-effect">
        <h1 className="text-2xl font-bold text-white mb-6">Mon Profil</h1>
        <form onSubmit={updateProfile} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300">Prénom</label>
            <Input
              type="text"
              value={profile?.first_name || ""}
              onChange={(e) => setProfile(prev => ({ ...prev!, first_name: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300">Nom</label>
            <Input
              type="text"
              value={profile?.last_name || ""}
              onChange={(e) => setProfile(prev => ({ ...prev!, last_name: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300">Téléphone</label>
            <Input
              type="tel"
              value={profile?.phone || ""}
              onChange={(e) => setProfile(prev => ({ ...prev!, phone: e.target.value }))}
              className="mt-1"
            />
          </div>
          <Button type="submit" disabled={updating} className="w-full">
            {updating ? "Mise à jour..." : "Mettre à jour"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Profile;