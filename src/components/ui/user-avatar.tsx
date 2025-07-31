import React, { useState } from 'react';
import { User, Settings, LogOut, Bell, Package, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useColisAuth } from '@/context/ColisAuthContext';

interface UserAvatarProps {
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ className = "" }) => {
  const { user, isAuthenticated, logout } = useColisAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <Button variant="ghost" size="sm" className={className}>
        <User className="h-5 w-5 mr-2" />
        Se connecter
      </Button>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`flex items-center gap-2 ${className}`}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar || undefined} alt={user.name} />
          <AvatarFallback className="bg-orange-100 text-orange-600">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-gray-900">{user.name}</div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>
      </Button>

      {isMenuOpen && (
        <Card className="absolute right-0 top-12 w-64 z-50 shadow-lg">
          <CardContent className="p-0">
            {/* En-tête utilisateur */}
            <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-amber-50">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar || undefined} alt={user.name} />
                  <AvatarFallback className="bg-orange-100 text-orange-600 text-lg">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                  <div className="text-xs text-gray-500">{user.phone}</div>
                </div>
              </div>
            </div>

            {/* Menu options */}
            <div className="py-2">
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-3"
                onClick={() => {
                  window.location.href = '/colis/dashboard';
                  setIsMenuOpen(false);
                }}
              >
                <Package className="h-4 w-4 mr-3" />
                Mon Dashboard
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-3"
                onClick={() => {
                  window.location.href = '/colis/expedition';
                  setIsMenuOpen(false);
                }}
              >
                <Package className="h-4 w-4 mr-3" />
                Nouvelle expédition
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-3"
                onClick={() => {
                  window.location.href = '/colis/analytics';
                  setIsMenuOpen(false);
                }}
              >
                <BarChart3 className="h-4 w-4 mr-3" />
                Mes statistiques
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-3"
                onClick={() => {
                  window.location.href = '/colis/profile';
                  setIsMenuOpen(false);
                }}
              >
                <Settings className="h-4 w-4 mr-3" />
                Paramètres
              </Button>
            </div>

            {/* Séparateur */}
            <div className="border-t" />

            {/* Logout */}
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Se déconnecter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserAvatar; 