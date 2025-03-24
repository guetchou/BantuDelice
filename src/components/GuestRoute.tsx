
import React from 'react';
import { Navigate } from 'react-router-dom';
import pb from '@/lib/pocketbase';
import { Loader2 } from 'lucide-react';

interface GuestRouteProps {
  children: React.ReactNode;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  // Vérifier si l'utilisateur est connecté à partir de PocketBase
  const isAuthenticated = pb.authStore.isValid;
  
  // Nous n'avons pas besoin de gérer un état de chargement ici puisque
  // PocketBase vérifie immédiatement si l'utilisateur est connecté
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
