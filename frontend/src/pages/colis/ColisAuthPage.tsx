import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Package, Eye, EyeOff, User, Mail, Lock, Phone, MapPin } from 'lucide-react';
import { useColisAuth } from '@/context/ColisAuthContext';
import AvatarUpload from '@/components/ui/avatar-upload';

// Composant de formulaire de connexion mémorisé
const LoginForm = React.memo<{
  loginData: { email: string; password: string };
  setLoginData: (data: { email: string; password: string }) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}>(({ loginData, setLoginData, showPassword, setShowPassword, loading, onSubmit }) => {
  const handleInputChange = useCallback((field: 'email' | 'password', value: string) => {
    setLoginData({ ...loginData, [field]: value });
  }, [loginData, setLoginData]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword, setShowPassword]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="votre@email.com"
            value={loginData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={loginData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="pl-10 pr-10"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Connexion...' : 'Se connecter'}
      </Button>
    </form>
  );
});

// Composant de formulaire d'inscription mémorisé
const RegisterForm = React.memo<{
  registerData: {
    email: string;
    password: string;
    name: string;
    phone: string;
    address: string;
  };
  setRegisterData: (data: unknown) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  avatarFile: File | null;
  setAvatarFile: (file: File | null) => void;
}>(({ registerData, setRegisterData, showPassword, setShowPassword, loading, onSubmit, avatarFile, setAvatarFile }) => {
  const handleInputChange = useCallback((field: string, value: string) => {
    setRegisterData({ ...registerData, [field]: value });
  }, [registerData, setRegisterData]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword, setShowPassword]);

  const handleAvatarChange = useCallback((file: File | null) => {
    setAvatarFile(file);
  }, [setAvatarFile]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="mb-6">
        <AvatarUpload onImageChange={handleAvatarChange} currentImage={null} />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="name">Nom complet</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="name"
            type="text"
            placeholder="Votre nom complet"
            value={registerData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="votre@email.com"
            value={registerData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="phone"
            type="tel"
            placeholder="+242 05 53 44 253"
            value={registerData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="address"
            type="text"
            placeholder="Votre adresse"
            value={registerData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={registerData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="pl-10 pr-10"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Inscription...' : 'S\'inscrire'}
      </Button>
    </form>
  );
});

const ColisAuthPage: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const { login, register, loading } = useColisAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    email: '', 
    password: '', 
    name: '', 
    phone: '', 
    address: '' 
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Handlers mémorisés
  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    console.log('Début de la connexion...');
    const success = await login(loginData.email, loginData.password);
    
    if (success) {
      console.log('Connexion réussie, redirection...');
      navigate('/colis/dashboard');
    } else {
      setError('Email ou mot de passe incorrect');
    }
  }, [login, loginData, navigate]);

  const handleRegister = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    console.log('Début de l\'inscription...');
    const success = await register(registerData);
    
    if (success) {
      console.log('Inscription réussie, redirection...');
      navigate('/colis/dashboard');
    } else {
      setError('Erreur lors de l\'inscription. Vérifiez vos informations.');
    }
  }, [register, registerData, navigate]);

  const handleTabChange = useCallback((tab: 'login' | 'register') => {
    setActiveTab(tab);
    setError(null);
  }, []);

  // Données mémorisées pour les onglets
  const tabData = useMemo(() => [
    { id: 'login' as const, label: 'Connexion', active: activeTab === 'login' },
    { id: 'register' as const, label: 'Inscription', active: activeTab === 'register' }
  ], [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Package className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">BantuDelice</h1>
          <p className="text-orange-100">Service de livraison et expédition</p>
        </div>

        {/* Carte d'authentification */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="pb-4">
            <div className="flex gap-2 mb-6">
              {tabData.map((tab) => (
                <Button
                  key={tab.id}
                  variant={tab.active ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => handleTabChange(tab.id)}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
            
            {error && (
              <Alert className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {activeTab === 'login' && (
              <LoginForm
                loginData={loginData}
                setLoginData={setLoginData}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                loading={loading}
                onSubmit={handleLogin}
              />
            )}
            
            {activeTab === 'register' && (
              <RegisterForm
                registerData={registerData}
                setRegisterData={setRegisterData}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                loading={loading}
                onSubmit={handleRegister}
                avatarFile={avatarFile}
                setAvatarFile={setAvatarFile}
              />
            )}
          </CardHeader>
        </Card>

        {/* Lien de retour */}
        <div className="text-center mt-6">
          <Link 
            to="/colis" 
            className="text-orange-100 hover:text-white transition-colors text-sm"
          >
            ← Retour au module Colis
          </Link>
        </div>
      </div>
    </div>
  );
});

ColisAuthPage.displayName = 'ColisAuthPage';

export default ColisAuthPage; 