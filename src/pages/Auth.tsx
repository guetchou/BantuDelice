
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Login } from './Login';
import { Register } from './Register';
import { AuthLayout } from '@/layouts/AuthLayout';
import { Loader2 } from 'lucide-react';

const Auth = () => {
  const location = useLocation();
  const { isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(
    location.search.includes('signup=true') ? 'register' : 'login'
  );

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="bg-card p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Bienvenue sur Buntudelice</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Login />
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">
                Vous n'avez pas de compte ? 
              </span>{' '}
              <Link 
                to="#" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  setActiveTab('register'); 
                }}
                className="text-primary hover:underline"
              >
                Inscrivez-vous
              </Link>
            </div>
          </TabsContent>
          
          <TabsContent value="register">
            <Register />
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">
                Vous avez déjà un compte ? 
              </span>{' '}
              <Link 
                to="#" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  setActiveTab('login'); 
                }}
                className="text-primary hover:underline"
              >
                Connectez-vous
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AuthLayout>
  );
};

export default Auth;
