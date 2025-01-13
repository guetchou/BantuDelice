import { Routes, Route } from "react-router-dom";
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

const App = () => {
  return (
    <SidebarProvider>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Navbar />
            <NotificationBell />
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute>
            <Navbar />
            <NotificationBell />
            <Admin />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Navbar />
            <NotificationBell />
            <Profile />
          </ProtectedRoute>
        } />
        
        <Route path="/kitchen" element={
          <ProtectedRoute>
            <Navbar />
            <NotificationBell />
            <KitchenDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/analytics" element={
          <ProtectedRoute>
            <Navbar />
            <NotificationBell />
            <AnalyticsDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/restaurants" element={
          <ProtectedRoute>
            <Navbar />
            <NotificationBell />
            <Restaurants />
          </ProtectedRoute>
        } />
        
        <Route path="/restaurant/:restaurantId/menu" element={
          <ProtectedRoute>
            <Navbar />
            <NotificationBell />
            <RestaurantMenu />
          </ProtectedRoute>
        } />
      </Routes>
    </SidebarProvider>
  );
};

export default App;