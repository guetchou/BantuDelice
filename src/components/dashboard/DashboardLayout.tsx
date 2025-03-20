
import { ReactNode } from 'react';
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  FileText, 
  Settings, 
  Calendar, 
  TrendingUp, 
  Bell,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from '@/components/ui/ThemeProvider';
import { useNavigation } from '@/contexts/NavigationContext';
import { toast } from 'sonner';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { theme, setTheme } = useTheme();
  const { navigate, currentPath } = useNavigation();

  const menuItems = [
    { icon: BarChart3, label: 'Tableau de bord', path: '/dashboard' },
    { icon: Users, label: 'Employés', path: '/employees' },
    { icon: ShoppingCart, label: 'Commandes', path: '/orders' },
    { icon: FileText, label: 'Factures', path: '/invoices' },
    { icon: Calendar, label: 'Calendrier', path: '/calendar' },
    { icon: TrendingUp, label: 'Rapports', path: '/reports' },
    { icon: Settings, label: 'Paramètres', path: '/settings' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    toast.success(`Navigation vers ${path}`);
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    toast.success(`Thème ${theme === 'dark' ? 'clair' : 'sombre'} activé`);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border shadow-lg transition-all duration-300">
        <div className="p-4 border-b border-border">
          <h2 className="text-2xl font-bold text-gradient animate-gradient-x">Buntudelice ERP</h2>
        </div>
        
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`
                w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200
                ${currentPath === item.path 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'text-foreground hover:bg-muted hover:text-primary'}
              `}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
              {currentPath === item.path && (
                <div className="ml-auto w-1.5 h-5 bg-primary-foreground/50 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                JD
              </div>
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">Administrateur</p>
              </div>
            </div>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="bg-card border-b border-border">
          <div className="px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-lg font-medium">Espace de travail</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
              </button>
              
              <div className="relative">
                <form>
                  <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    className="modern-input w-64 py-2 pl-10 pr-4 text-sm"
                  />
                  <span className="absolute inset-y-0 left-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                </form>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-auto p-6 bg-background animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
