
import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbase';
import { User, UserProfile } from '@/types/user';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        if (pb.authStore.isValid) {
          const userData = pb.authStore.model;
          if (userData) {
            const userObj: User = {
              id: userData.id,
              email: userData.email,
              name: userData.name || '',
              phone: userData.phone,
              role: userData.role || 'user',
              created_at: userData.created,
              avatar_url: userData.avatar_url,
              first_name: userData.first_name,
              last_name: userData.last_name,
              status: userData.status,
            };
            setUser(userObj);

            // Try to load user profile
            try {
              const profileData = await pb.collection('profiles').getFirstListItem(`user_id="${userData.id}"`);
              if (profileData) {
                setUserProfile({
                  id: profileData.id,
                  user_id: profileData.user_id,
                  full_name: profileData.full_name || userData.name,
                  address: profileData.address,
                  phone_number: profileData.phone_number || userData.phone,
                  avatar_url: profileData.avatar_url || userData.avatar_url,
                  preferences: profileData.preferences || {
                    language: 'fr',
                    dark_mode: false,
                    notifications: true,
                    email_notifications: true,
                    push_notifications: true
                  },
                  created_at: profileData.created,
                  updated_at: profileData.updated
                });
              }
            } catch (profileError) {
              console.log('No profile found for user, this is normal for new users');
            }
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    const authChangeHandler = () => {
      loadUser();
    };

    // Subscribe to auth changes
    pb.authStore.onChange(authChangeHandler);

    return () => {
      // Unsubscribe from auth changes when component unmounts
      pb.authStore.onChange(null);
    };
  }, []);

  return {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
  };
};

export default useUser;
