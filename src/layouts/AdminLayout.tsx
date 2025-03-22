
import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import {
  Menu, X, Home, Users, ShoppingBag, Settings, LogOut, 
  Coffee, LayoutDashboard, ChevronDown, User
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout, isAuthenticated, isSuperAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
    if (!isAuthenticated && location.pathname !== '/admin/login') {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Si l'utilisateur n'est pas authentifié et n'est pas sur la page de connexion, ne rien afficher
  if (!isAuthenticated && location.pathname !== '/admin/login') {
    return null;
  }

  // Si on est sur la page de connexion, afficher directement le contenu sans la mise en page admin
  if (location.pathname === '/admin/login') {
    return <Outlet />;
  }

  const menuItems = [
    { label: 'Tableau de bord', icon: <LayoutDashboard className="w-4 h-4 mr-2" />, path: '/admin/dashboard' },
    { label: 'Utilisateurs', icon: <Users className="w-4 h-4 mr-2" />, path: '/admin/users' },
    { label: 'Commandes', icon: <ShoppingBag className="w-4 h-4 mr-2" />, path: '/admin/orders' },
    { label: 'Restaurants', icon: <Coffee className="w-4 h-4 mr-2" />, path: '/admin/restaurants' },
    { label: 'Paramètres', icon: <Settings className="w-4 h-4 mr-2" />, path: '/admin/settings' },
  ];

  const getInitials = (name?: string) => {
    if (!name) return 'A';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <NavLink to="/admin/dashboard" className="flex items-center gap-2 font-semibold" onClick={() => setOpen(false)}>
                  <LayoutDashboard className="h-6 w-6" />
                  <span>Administration</span>
                </NavLink>
                <div className="my-6">
                  <nav className="flex flex-col space-y-1">
                    {menuItems.map((item) => (
                      <Button
                        key={item.path}
                        variant={location.pathname === item.path ? "secondary" : "ghost"}
                        className="justify-start"
                        onClick={() => {
                          navigate(item.path);
                          setOpen(false);
                        }}
                      >
                        {item.icon}
                        {item.label}
                      </Button>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            
            <NavLink to="/admin/dashboard" className="ml-2 flex items-center gap-2 font-semibold md:ml-0">
              <LayoutDashboard className="h-6 w-6" />
              <span className="hidden md:inline">Administration</span>
            </NavLink>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                asChild
                className={location.pathname === item.path ? "bg-accent" : ""}
              >
                <NavLink to={item.path}>{item.label}</NavLink>
              </Button>
            ))}
          </nav>
          
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar_url} alt={user?.first_name} />
                    <AvatarFallback>{getInitials(user?.first_name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.first_name} {user?.last_name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/admin/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <Outlet />
      </main>
      
      <footer className="border-t py-4 bg-background">
        <div className="container flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Administration - Tous droits réservés
          </p>
          <p className="text-sm text-muted-foreground">
            {user?.role === 'superadmin' ? 'Super Administrateur' : 'Administrateur'}
          </p>
        </div>
      </footer>
    </div>
  );
}
