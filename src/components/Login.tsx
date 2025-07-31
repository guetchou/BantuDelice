
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../context/NotificationContext';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = searchParams.get('redirect') || '/';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(formData);
      if (result.success) {
        addNotification({
          type: 'success',
          title: 'Connexion réussie !',
          message: 'Bienvenue sur BantuDelice',
          duration: 3000,
        });
        // Rediriger vers la page demandée ou la page d'accueil
        const redirectTo = searchParams.get('redirect') || '/';
        navigate(redirectTo, { replace: true });
      } else {
        addNotification({
          type: 'error',
          title: 'Erreur de connexion',
          message: result.error || 'Vérifiez vos identifiants',
          duration: 4000,
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erreur de connexion',
        message: 'Une erreur est survenue',
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-2">
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="block w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="password">Mot de passe:</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            className="block w-full p-2 border rounded-md"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
      <p>
        Vous n'avez pas de compte ?{' '}
        <Link to="/register" className="text-blue-500 hover:underline">
          Inscrivez-vous ici
        </Link>
      </p>
    </div>
  );
}
