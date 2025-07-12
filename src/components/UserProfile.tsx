import React, { useState } from 'react';
import { useAuth } from '@/hooks/useSupabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { User, Mail, Phone, MapPin, LogOut, Edit, Save, X } from 'lucide-react';

export default function UserProfile() {
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.user_metadata?.firstName || '',
    lastName: user?.user_metadata?.lastName || '',
    phone: user?.user_metadata?.phone || '',
    address: user?.user_metadata?.address || ''
  });

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut();
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erreur lors de la déconnexion');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      // Ici vous pourriez mettre à jour le profil dans Supabase
      // Pour l'instant, on simule la sauvegarde
      toast.success('Profil mis à jour avec succès');
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl max-w-md w-full">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Non connecté</h2>
            <p className="text-gray-600 mb-4">Vous devez être connecté pour voir votre profil</p>
            <Button onClick={() => window.location.href = '/auth'}>
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">
                  {profileData.firstName ? profileData.firstName[0].toUpperCase() : 
                   profileData.lastName ? profileData.lastName[0].toUpperCase() : 
                   user.email?.[0].toUpperCase() || 'U'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profileData.firstName && profileData.lastName 
                  ? `${profileData.firstName} ${profileData.lastName}`
                  : 'Mon Profil'
                }
              </h1>
              <p className="text-gray-600 mt-2">{user.email}</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex justify-end gap-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  name="firstName"
                  type="text"
                  placeholder="Prénom"
                  value={profileData.firstName}
                  onChange={handleInputChange}
                  className="pl-10"
                  disabled={!isEditing}
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  name="lastName"
                  type="text"
                  placeholder="Nom"
                  value={profileData.lastName}
                  onChange={handleInputChange}
                  className="pl-10"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                value={user.email || ''}
                className="pl-10 bg-gray-50"
                disabled
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                name="phone"
                type="tel"
                placeholder="Téléphone"
                value={profileData.phone}
                onChange={handleInputChange}
                className="pl-10"
                disabled={!isEditing}
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                name="address"
                type="text"
                placeholder="Adresse de livraison"
                value={profileData.address}
                onChange={handleInputChange}
                className="pl-10"
                disabled={!isEditing}
              />
            </div>

            <div className="pt-6 border-t border-gray-200">
              <Button
                onClick={handleLogout}
                disabled={loading}
                variant="destructive"
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {loading ? 'Déconnexion...' : 'Se déconnecter'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 