
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  PieChart, 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  LogOut,
  Coffee,
  HeartHandshake,
  ShoppingBag
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSidebar } from "@/contexts/SidebarContext";
import { BackButton } from "@/components/navigation/BackButton";
import NotificationBell from "@/components/NotificationBell";
import { LoyaltyStatus } from "@/components/loyalty/LoyaltyStatus";
import { useOrders } from "@/contexts/OrderContext";

const Navbar = () => {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const { activeOrders } = useOrders();
  
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const checkAdminRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      setIsAdmin(roles?.role === "admin");
    };

    checkAdminRole();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full flex transition-all duration-300 z-50",
      isCollapsed ? "w-[60px]" : "w-full sm:w-64"
    )}>
      <nav className="w-full glass-effect backdrop-blur-xl p-4 relative flex flex-col">
        <div className={cn(
          "mb-8 flex items-center",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed && (
            <>
              <BackButton />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Buntudelice
              </h1>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-300 hover:text-white hover:bg-white/10"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="space-y-2 flex-1">
          <Link
            to="/"
            className={cn(
              "flex items-center p-3 rounded-lg transition-colors",
              isCollapsed ? "justify-center" : "space-x-3",
              isActive("/") 
                ? "bg-white/20 text-white" 
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            )}
          >
            <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Tableau de bord</span>}
          </Link>
          
          <Link
            to="/restaurants"
            className={cn(
              "flex items-center p-3 rounded-lg transition-colors",
              isCollapsed ? "justify-center" : "space-x-3",
              isActive("/restaurants") 
                ? "bg-white/20 text-white" 
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            )}
          >
            <Coffee className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Restaurants</span>}
          </Link>
          
          <Link
            to="/orders"
            className={cn(
              "flex items-center p-3 rounded-lg transition-colors",
              isCollapsed ? "justify-center" : "space-x-3",
              isActive("/orders") 
                ? "bg-white/20 text-white" 
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            )}
          >
            <ShoppingBag className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && (
              <div className="flex items-center justify-between flex-1">
                <span>Mes commandes</span>
                {activeOrders.length > 0 && (
                  <span className="bg-emerald-500 text-white text-xs rounded-full px-2 py-1">
                    {activeOrders.length}
                  </span>
                )}
              </div>
            )}
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className={cn(
                "flex items-center p-3 rounded-lg transition-colors",
                isCollapsed ? "justify-center" : "space-x-3",
                isActive("/admin") 
                  ? "bg-white/20 text-white" 
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <Settings className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>Administration</span>}
            </Link>
          )}
        </div>

        {/* Zone du bas avec notifications et fidélité */}
        <div className="mt-auto pt-4 space-y-4">
          {!isCollapsed && <LoyaltyStatus />}
          
          <div className="flex items-center justify-between">
            <NotificationBell />
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>
      <Separator orientation="vertical" className="h-full opacity-20" />
    </div>
  );
};

export default Navbar;
