
import React from 'react';
import pb from '../lib/pocketbase';

export default function Logout() {
  const handleLogout = () => {
    pb.authStore.clear(); // Efface la session
    alert("Déconnexion réussie !");
    window.location.reload(); // ou rediriger avec useNavigate()
  };

  return (
    <button onClick={handleLogout}>
      Se déconnecter
    </button>
  );
}
