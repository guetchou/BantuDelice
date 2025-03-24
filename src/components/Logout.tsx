
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function Logout() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    alert("Déconnexion réussie !");
    window.location.reload(); // or use useNavigate()
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      Se déconnecter
    </Button>
  );
}
