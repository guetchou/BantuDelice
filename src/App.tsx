import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Auth from "@/pages/Auth";
import Admin from "@/pages/Admin";
import Dashboard from "@/pages/Dashboard";
import KitchenDashboard from "@/pages/kitchen/Dashboard";
import AnalyticsDashboard from "@/pages/analytics/Dashboard";
import Profile from "@/pages/Profile";
import { SidebarProvider } from "@/contexts/SidebarContext";
import NotificationBell from "@/components/NotificationBell";
import Restaurants from "@/pages/Restaurants";
import RestaurantMenu from "@/pages/RestaurantMenu";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { logger } from "@/services/logger";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      logger.info("Auth state changed:", { event, hasSession: !!session });
      
      if (event === "SIGNED_OUT") {
        logger.info("User signed out, redirecting to auth page");
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <SidebarProvider>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/auth" element={<Auth />} />
        
        {/* Protected Routes with Layout */}
        <Route element={
          <ProtectedRoute>
            <div className="min-h-screen bg-background">
              <Navbar />
              <NotificationBell />
              <main className="container mx-auto px-4 py-8">
                <Outlet />
              </main>
            </div>
          </ProtectedRoute>
        }>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/kitchen" element={<KitchenDashboard />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurant/:restaurantId/menu" element={<RestaurantMenu />} />
        </Route>

        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SidebarProvider>
  );
};

export default App;