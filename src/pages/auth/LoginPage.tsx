
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginComponent from '@/components/auth/LoginComponent';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get redirect URL from query parameters or default to home
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get('redirect') || '/';
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à l'accueil
        </Button>
        
        <div className="max-w-md mx-auto mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Bienvenue</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Connectez-vous pour accéder à votre compte
          </p>
        </div>
        
        <LoginComponent redirectTo={redirectTo} />
        
        <div className="text-center mt-8">
          <p className="text-gray-500 dark:text-gray-400">
            Vous n'avez pas de compte?{' '}
            <Button 
              variant="link" 
              className="p-0" 
              onClick={() => navigate('/auth/register')}
            >
              S'inscrire
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
