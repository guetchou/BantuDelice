
import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterComponent from '@/components/auth/RegisterComponent';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  
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
          <h1 className="text-3xl font-bold mb-2">Créer un compte</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Rejoignez notre plateforme en quelques étapes simples
          </p>
        </div>
        
        <RegisterComponent />
        
        <div className="text-center mt-8">
          <p className="text-gray-500 dark:text-gray-400">
            Vous avez déjà un compte?{' '}
            <Button 
              variant="link" 
              className="p-0" 
              onClick={() => navigate('/auth/login')}
            >
              Se connecter
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
