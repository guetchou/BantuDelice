import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Lock, 
  Mail, 
  Phone, 
  Shield, 
  ArrowRight,
  X,
  Eye,
  EyeOff
} from 'lucide-react';

interface AuthGateProps {
  children: React.ReactNode;
  modalTitle?: string;
  onAuthSuccess?: (user: unknown) => void;
}

const AuthGate: React.FC<AuthGateProps> = ({ 
  children, 
  modalTitle = "Connectez-vous pour continuer",
  onAuthSuccess 
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleAuth = async (mode: 'login' | 'register') => {
    // Simulation de l'authentification
    console.log(`${mode} avec:`, formData);
    
    // Simuler un délai
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simuler un succès
    const mockUser = {
      id: 'user_123',
      email: formData.email,
      phone: formData.phone,
      name: 'Utilisateur Test',
      address: 'Brazzaville, Congo'
    };
    
    onAuthSuccess?.(mockUser);
    setShowAuthModal(false);
  };

  const AuthModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2"
            onClick={() => setShowAuthModal(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange-600" />
            {modalTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={authMode === 'login' ? 'default' : 'ghost'}
              size="sm"
              className="flex-1"
              onClick={() => setAuthMode('login')}
            >
              Connexion
            </Button>
            <Button
              variant={authMode === 'register' ? 'default' : 'ghost'}
              size="sm"
              className="flex-1"
              onClick={() => setAuthMode('register')}
            >
              Inscription
            </Button>
          </div>

          {/* Formulaire */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="06xxxxxxx"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {authMode === 'register' && (
              <div>
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="space-y-2">
            <Button 
              className="w-full bg-orange-600 hover:bg-orange-700"
              onClick={() => handleAuth(authMode)}
            >
              {authMode === 'login' ? 'Se connecter' : 'S\'inscrire'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            
            {authMode === 'login' && (
              <Button variant="link" className="w-full text-sm">
                Mot de passe oublié ?
              </Button>
            )}
          </div>

          {/* Informations de sécurité */}
          <div className="text-xs text-gray-500 text-center">
            <p>En continuant, vous acceptez nos conditions d'utilisation</p>
            <p>Vos données sont protégées par chiffrement SSL</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      <div onClick={() => setShowAuthModal(true)}>
        {children}
      </div>
      {showAuthModal && <AuthModal />}
    </>
  );
};

export default AuthGate; 